package com.clevertap.clevertap_plugin

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import java.util.Collections
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.CountDownLatch
import kotlin.concurrent.thread

/**
 * JVM tests for the event buffers in [CleverTapEventEmitter].
 *
 * On a device, emits arrive on the native SDK's callback threads (main, or a background
 * executor - for example profileDidInitialize after onUserLogin) while startEmission and the
 * 5-second reset run on the main thread. These tests play both roles on plain JVM threads,
 * then call [CleverTapEventEmitter.awaitIdle] so the emitter has finished before asserting.
 *
 * Regression guards:
 *  - B1 (same crash as SDK-6021 in React Native): an unsynchronized LinkedList add racing a
 *    drain threw NoSuchElementException. [emitRace_50kPayloads_deliveredExactlyOnce]
 *  - B2: an event emitted between "flush" and "disable" stayed in a disabled buffer and was
 *    lost. [startEmission_eventDuringFlush_isNotLost]
 *  - Order: a handler set mid-stream must not let events reach Dart out of order.
 *    [deliveredInEmitOrder_evenWhenHandlerAttachesMidStream]
 */
class CleverTapEventEmitterTest {

    private val bufferableEvent = CleverTapEvent.CLEVERTAP_PROFILE_DID_INITIALIZE
    private val otherBufferableEvent = CleverTapEvent.CLEVERTAP_IN_APP_NOTIFICATION_DISMISSED
    private val nonBufferableEvent = CleverTapEvent.CLEVERTAP_ON_VARIABLES_CHANGED

    /** Everything the emitter handed to Dart, in delivery order. */
    private val delivered = CopyOnWriteArrayList<Pair<CleverTapEvent, Any?>>()

    /** Exceptions thrown on any helper thread (a crash on a device). */
    private val threadFailures = Collections.synchronizedList(mutableListOf<Throwable>())

    /** The first helper-thread failure with the top of its stack, for assertion messages. */
    private fun failuresText(): String = threadFailures.firstOrNull()?.let { t ->
        "${threadFailures.size} failure(s), first: $t at ${t.stackTrace.take(4).joinToString(" <- ")}"
    } ?: "none"

    private fun deliveredPayloads(event: CleverTapEvent): List<Any?> {
        CleverTapEventEmitter.awaitIdle()
        return delivered.filter { it.first == event }.map { it.second }
    }

    private fun recordingThread(block: () -> Unit): Thread = thread(start = false) {
        try {
            block()
        } catch (t: Throwable) {
            threadFailures.add(t)
        }
    }

    @Before
    fun setUp() {
        CleverTapEventEmitter.sender = { event, params -> delivered.add(event to params) }
        // The emitter is a singleton object: start every test with clean, enabled buffers.
        CleverTapEventEmitter.resetAllBuffers(true)
        CleverTapEventEmitter.awaitIdle()
        delivered.clear()
        threadFailures.clear()
    }

    /**
     * B1: four producer threads (the SDK callbacks) emit 50,000 unique payloads while the test
     * thread (Dart setting its handler, on main) calls startEmission. Every payload must reach
     * Dart exactly once and nothing may throw.
     */
    @Test
    fun emitRace_50kPayloads_deliveredExactlyOnce() {
        val producers = 4
        val perProducer = 12_500
        val go = CountDownLatch(1)
        val threads = (0 until producers).map { p ->
            recordingThread {
                go.await()
                for (i in 0 until perProducer) {
                    CleverTapEventEmitter.emit(bufferableEvent, p * perProducer + i)
                }
            }
        }
        threads.forEach { it.start() }
        go.countDown()
        try {
            // Let some payloads be buffered, then attach mid-stream.
            Thread.sleep(2)
            CleverTapEventEmitter.startEmission(bufferableEvent)
        } catch (t: Throwable) {
            threadFailures.add(t)
        }
        threads.forEach { it.join() }

        assertTrue("threads threw: ${failuresText()}", threadFailures.isEmpty())
        val received = deliveredPayloads(bufferableEvent)
        assertEquals("delivered count", producers * perProducer, received.size)
        assertEquals("duplicates found", received.size, received.toSet().size)
    }

    /**
     * B2: replay the moment between "flush" and "disable" 300 times. Payloads emitted while
     * startEmission runs must still be delivered.
     */
    @Test
    fun startEmission_eventDuringFlush_isNotLost() {
        repeat(300) { round ->
            CleverTapEventEmitter.resetAllBuffers(true)
            CleverTapEventEmitter.awaitIdle()
            delivered.clear()

            repeat(100) { CleverTapEventEmitter.emit(bufferableEvent, "held-$it") }
            val go = CountDownLatch(1)
            val producer = recordingThread {
                go.await()
                repeat(100) { CleverTapEventEmitter.emit(bufferableEvent, "live-$it") }
            }
            producer.start()
            go.countDown()
            try {
                CleverTapEventEmitter.startEmission(bufferableEvent)
            } catch (t: Throwable) {
                threadFailures.add(t)
            }
            producer.join()

            assertTrue("round $round threw: ${failuresText()}", threadFailures.isEmpty())
            assertEquals("round $round delivered", 200, deliveredPayloads(bufferableEvent).size)
        }
    }

    /**
     * One producer emits 0..999 in order while the handler attaches mid-stream. Dart must
     * receive exactly 0..999, in that order, in every round.
     */
    @Test
    fun deliveredInEmitOrder_evenWhenHandlerAttachesMidStream() {
        val expected = (0 until 1_000).toList()
        repeat(300) { round ->
            CleverTapEventEmitter.resetAllBuffers(true)
            CleverTapEventEmitter.awaitIdle()
            delivered.clear()

            val go = CountDownLatch(1)
            val producer = recordingThread {
                go.await()
                expected.forEach { CleverTapEventEmitter.emit(bufferableEvent, it) }
            }
            producer.start()
            go.countDown()
            try {
                CleverTapEventEmitter.startEmission(bufferableEvent)
            } catch (t: Throwable) {
                threadFailures.add(t)
            }
            producer.join()

            assertTrue("round $round threw: ${failuresText()}", threadFailures.isEmpty())
            assertEquals("round $round order", expected, deliveredPayloads(bufferableEvent))
        }
    }

    /** Before any handler: held. After startEmission: held ones first, then live ones. */
    @Test
    fun startEmission_sendsHeldThenLive() {
        CleverTapEventEmitter.emit(bufferableEvent, "a")
        CleverTapEventEmitter.emit(bufferableEvent, "b")
        assertEquals(emptyList<Any?>(), deliveredPayloads(bufferableEvent))

        CleverTapEventEmitter.startEmission(bufferableEvent)
        CleverTapEventEmitter.emit(bufferableEvent, "c")
        assertEquals(listOf("a", "b", "c"), deliveredPayloads(bufferableEvent))
    }

    /** The 5-second valve DISCARDS what is held (same as before), then events go live. */
    @Test
    fun resetAllBuffers_discardsHeld_thenSendsLive() {
        CleverTapEventEmitter.emit(bufferableEvent, "a")
        CleverTapEventEmitter.emit(bufferableEvent, "b")
        CleverTapEventEmitter.resetAllBuffers(false)
        assertEquals(emptyList<Any?>(), deliveredPayloads(bufferableEvent))

        CleverTapEventEmitter.emit(bufferableEvent, "c")
        assertEquals(listOf("c"), deliveredPayloads(bufferableEvent))
    }

    /** Non-bufferable events (for example variables) are never held. */
    @Test
    fun nonBufferable_sentImmediately() {
        CleverTapEventEmitter.emit(nonBufferableEvent, mapOf("discount" to 10))
        assertEquals(listOf(mapOf("discount" to 10)), deliveredPayloads(nonBufferableEvent))
    }

    /** profileDidInitialize can carry a null id; null must still be delivered as null. */
    @Test
    fun nullPayload_isDeliveredAsNull() {
        CleverTapEventEmitter.emit(bufferableEvent, null)
        CleverTapEventEmitter.startEmission(bufferableEvent)
        assertEquals(listOf<Any?>(null), deliveredPayloads(bufferableEvent))
    }

    /** startEmission for one event must not release another event's held payloads. */
    @Test
    fun startEmission_onlyAffectsItsOwnEvent() {
        CleverTapEventEmitter.emit(bufferableEvent, "profile")
        CleverTapEventEmitter.emit(otherBufferableEvent, "dismissed")

        CleverTapEventEmitter.startEmission(bufferableEvent)
        assertEquals(listOf("profile"), deliveredPayloads(bufferableEvent))
        assertEquals(emptyList<Any?>(), deliveredPayloads(otherBufferableEvent))

        CleverTapEventEmitter.startEmission(otherBufferableEvent)
        assertEquals(listOf("dismissed"), deliveredPayloads(otherBufferableEvent))
    }

    /** A sender that throws must not stop later events (the emitter keeps working). */
    @Test
    fun throwingSender_doesNotStopLaterEvents() {
        var first = true
        CleverTapEventEmitter.sender = { event, params ->
            if (first) {
                first = false
                throw IllegalStateException("boom")
            }
            delivered.add(event to params)
        }
        CleverTapEventEmitter.emit(nonBufferableEvent, "lost-to-boom")
        CleverTapEventEmitter.emit(nonBufferableEvent, "after")
        assertEquals(listOf<Any?>("after"), deliveredPayloads(nonBufferableEvent))
    }
}
