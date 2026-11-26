package com.clevertap.clevertap_plugin

import io.flutter.plugin.common.BinaryMessenger
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import io.flutter.plugin.common.StandardMethodCodec
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import java.nio.ByteBuffer

/**
 * Buffering lets the plugin hold native events until the Dart listener is ready.
 *
 * A real MethodChannel backed by a fake BinaryMessenger is registered as the
 * "native to Dart" channel. Every event that reaches Dart is decoded from the
 * bytes actually sent, so these tests assert exactly what Dart would receive.
 */
@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class CleverTapEventEmitterTest {

    private class RecordingMessenger : BinaryMessenger {
        val sent = mutableListOf<MethodCall>()
        var failOnSend = false

        override fun send(channel: String, message: ByteBuffer?) = send(channel, message, null)

        override fun send(channel: String, message: ByteBuffer?, callback: BinaryMessenger.BinaryReply?) {
            if (failOnSend) throw RuntimeException("boom")
            message!!.rewind()
            sent.add(StandardMethodCodec.INSTANCE.decodeMethodCall(message))
        }

        override fun setMessageHandler(channel: String, handler: BinaryMessenger.BinaryMessageHandler?) {}
    }

    // bufferable / non-bufferable examples from CleverTapEvent
    private val bufferable = CleverTapEvent.CLEVERTAP_IN_APP_NOTIFICATION_SHOWED // "inAppNotificationShow"
    private val bufferableName = "inAppNotificationShow"
    private val immediate = CleverTapEvent.CLEVERTAP_PROFILE_SYNC // "profileDataUpdated"
    private val immediateName = "profileDataUpdated"

    private lateinit var messenger: RecordingMessenger

    private fun names() = messenger.sent.map { it.method }
    private fun args() = messenger.sent.map { it.arguments }

    @Before
    fun setUp() {
        // The tests rely on these two events behaving differently.
        assertTrue("$bufferable must be bufferable", bufferable.bufferable)
        assertFalse("$immediate must not be bufferable", immediate.bufferable)

        messenger = RecordingMessenger()
        CleverTapPlugin.nativeToDartMethodChannelSet.clear()
        CleverTapPlugin.nativeToDartMethodChannelSet.add(
            MethodChannel(messenger, "clevertap_plugin/native_to_dart")
        )
        CleverTapEventEmitter.resetAllBuffers(enableBuffers = true)
    }

    @After
    fun tearDown() {
        CleverTapPlugin.nativeToDartMethodChannelSet.clear()
        CleverTapEventEmitter.resetAllBuffers(enableBuffers = true)
    }

    @Test
    fun `bufferable event is held while buffering is enabled`() {
        CleverTapEventEmitter.emit(bufferable, mapOf("a" to 1))

        assertTrue("nothing should reach Dart yet", messenger.sent.isEmpty())
    }

    @Test
    fun `flush delivers buffered events in order with the mapped name`() {
        CleverTapEventEmitter.emit(bufferable, "first")
        CleverTapEventEmitter.emit(bufferable, "second")

        CleverTapEventEmitter.flushBuffer(bufferable)

        assertEquals(listOf(bufferableName, bufferableName), names())
        assertEquals(listOf<Any?>("first", "second"), args())
    }

    @Test
    fun `flush empties the buffer so a second flush sends nothing`() {
        CleverTapEventEmitter.emit(bufferable, "once")
        CleverTapEventEmitter.flushBuffer(bufferable)
        CleverTapEventEmitter.flushBuffer(bufferable)

        assertEquals(listOf<Any?>("once"), args())
    }

    @Test
    fun `flushing an empty buffer sends nothing`() {
        CleverTapEventEmitter.flushBuffer(bufferable)

        assertTrue(messenger.sent.isEmpty())
    }

    @Test
    fun `non bufferable event is sent immediately`() {
        CleverTapEventEmitter.emit(immediate, "now")

        assertEquals(listOf(immediateName), names())
        assertEquals(listOf<Any?>("now"), args())
    }

    @Test
    fun `map params arrive in Dart intact`() {
        CleverTapEventEmitter.emit(immediate, mapOf("k" to "v", "n" to 3))

        assertEquals(mapOf("k" to "v", "n" to 3), messenger.sent.single().arguments)
    }

    @Test
    fun `disabling a buffer makes later events go out immediately`() {
        CleverTapEventEmitter.disableBuffer(bufferable)

        CleverTapEventEmitter.emit(bufferable, "live")

        assertEquals(listOf<Any?>("live"), args())
    }

    @Test
    fun `events buffered before disable are still delivered on flush`() {
        CleverTapEventEmitter.emit(bufferable, "early")
        CleverTapEventEmitter.disableBuffer(bufferable)
        CleverTapEventEmitter.emit(bufferable, "late")

        // "late" went out directly, "early" is still waiting
        assertEquals(listOf<Any?>("late"), args())

        CleverTapEventEmitter.flushBuffer(bufferable)
        assertEquals(listOf<Any?>("late", "early"), args())
    }

    @Test
    fun `re-enabling a buffer buffers again`() {
        CleverTapEventEmitter.disableBuffer(bufferable)
        CleverTapEventEmitter.enableBuffer(bufferable)

        CleverTapEventEmitter.emit(bufferable, "held")

        assertTrue(messenger.sent.isEmpty())
    }

    @Test
    fun `resetAllBuffers drops queued events`() {
        CleverTapEventEmitter.emit(bufferable, "stale")

        CleverTapEventEmitter.resetAllBuffers(enableBuffers = true)
        CleverTapEventEmitter.flushBuffer(bufferable)

        assertTrue(messenger.sent.isEmpty())
    }

    @Test
    fun `resetAllBuffers with false makes bufferable events send immediately`() {
        CleverTapEventEmitter.resetAllBuffers(enableBuffers = false)

        CleverTapEventEmitter.emit(bufferable, "direct")

        assertEquals(listOf<Any?>("direct"), args())
    }

    @Test
    fun `buffers are independent per event`() {
        val other = CleverTapEvent.CLEVERTAP_PUSH_NOTIFICATION_CLICKED // "pushClickedPayloadReceived"
        CleverTapEventEmitter.emit(bufferable, "a")
        CleverTapEventEmitter.emit(other, "b")

        CleverTapEventEmitter.flushBuffer(other)

        assertEquals(listOf("pushClickedPayloadReceived"), names())
        assertEquals(listOf<Any?>("b"), args())
    }

    @Test
    fun `disableAllAndFlush delivers everything and stops buffering`() {
        CleverTapEventEmitter.emit(bufferable, "x")

        CleverTapEventEmitter.disableAllAndFlush()
        assertEquals(listOf<Any?>("x"), args())

        CleverTapEventEmitter.emit(bufferable, "y")
        assertEquals(listOf<Any?>("x", "y"), args())
    }

    @Test
    fun `unknown event is never sent`() {
        CleverTapEventEmitter.emit(CleverTapEvent.CLEVERTAP_UNKNOWN, "ignored")

        assertTrue(messenger.sent.isEmpty())
    }

    @Test
    fun `null params are passed through`() {
        CleverTapEventEmitter.emit(immediate, null)

        assertEquals(listOf(immediateName), names())
        assertEquals(listOf<Any?>(null), args())
    }

    // The exception is caught inside CleverTapPlugin.runOnMainThread, which sits
    // between the emitter and the channel. This test covers the whole path: a
    // channel failure must not crash, and later events must still go out.
    @Test
    fun `a failing channel does not crash and later events still go out`() {
        messenger.failOnSend = true
        CleverTapEventEmitter.emit(immediate, "lost") // must not throw

        messenger.failOnSend = false
        CleverTapEventEmitter.emit(immediate, "delivered")

        assertEquals(listOf<Any?>("delivered"), args())
    }
}
