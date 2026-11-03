package com.clevertap.clevertap_plugin

import android.util.Log
import androidx.annotation.VisibleForTesting
import com.clevertap.clevertap_plugin.CleverTapPlugin.invokeMethodOnUiThread
import java.util.LinkedList
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

/**
 * CleverTapEventEmitter is responsible for emitting events to the Flutter Dart layer.
 * It manages event buffers and allows events to be queued, which is useful when an event fires
 * before Dart has set its handler (for example the push tap that cold-started the app). Only
 * events specified as [CleverTapEvent.bufferable] will be considered for buffering, all other
 * events will be emitted immediately.
 *
 * ⚠️ THREADING MODEL — thread confinement, no locks. Emits arrive on the native SDK's callback
 * threads (main, or a background executor: profileDidInitialize after onUserLogin is fired from
 * the SDK's postAsyncSafelyTask), while [startEmission] and the 5-second [resetAllBuffers] run
 * on the main thread. Instead of sharing the buffers between those threads, EVERY operation is
 * posted to one single-thread [worker] and runs there, one after another, in submission order:
 *
 *  - No data race is possible: only the worker thread ever touches a [Buffer]. Before, an
 *    unsynchronized LinkedList add on an SDK thread could race a drain on main and crash with
 *    NoSuchElementException (the same crash as SDK-6021 in the React Native SDK).
 *  - No event can fall into a gap: "stop buffering" and "send what was held" are ONE task, so
 *    an event can no longer be added to a buffer that was just turned off and never flushed.
 *  - Ordering is preserved: the worker runs tasks first in, first out, and posts each send to
 *    the main Handler, which is also first in, first out. Dart sees events in emit order.
 *  - No deadlock is possible: there are no locks to order.
 *
 * `Executors.newSingleThreadExecutor` guarantees sequential execution in FIFO order, and
 * submitting a task happens-before the task runs (java.util.concurrent memory consistency), so
 * payloads built on the SDK thread are safely visible to the worker. Callers never wait: posting
 * only enqueues.
 */
object CleverTapEventEmitter {
    private const val LOG_TAG = "CleverTapEventEmitter"

    // The ONE thread that owns all buffer state. Created lazily on the first task. Daemon so an
    // idle worker never keeps a plain JVM (unit tests) alive; on Android the OS ends the process
    // regardless. Named for thread dumps and profilers.
    private val worker: ExecutorService = Executors.newSingleThreadExecutor { runnable ->
        Thread(runnable, "CleverTapEventEmitter").apply { isDaemon = true }
    }

    // Fixed keys, immutable map, built once and never replaced: safe to read from any thread.
    // The Buffers inside are only ever touched on the worker.
    private val eventsBuffers: Map<CleverTapEvent, Buffer> =
        CleverTapEvent.values().filter { it.bufferable }.associateWith { Buffer(enabled = true) }

    // Where events go. Production sends to every Flutter engine; tests replace it to record
    // deliveries. Read on the worker, written by tests on their own thread.
    @Volatile
    @VisibleForTesting
    internal var sender: (CleverTapEvent, Any?) -> Unit = ::sendToDart

    /**
     * Dart set its handler for the specified event: stop buffering it, then send everything
     * that was held for it, in order. Both steps run in ONE worker task, so an event emitted
     * at the same moment is either sent with the held ones or sent live after them - never
     * left behind in a buffer that is already off.
     */
    @JvmStatic
    fun startEmission(event: CleverTapEvent) {
        val buffer = eventsBuffers[event] ?: return
        post("startEmission($event)") {
            buffer.enabled = false
            val held = buffer.drain()
            Log.i(LOG_TAG, "Emission started for $event, flushing ${held.size}")
            held.forEach { params -> send(event, params) }
        }
    }

    /**
     * Enable buffering for the specified event. While enabled, all events which should be emitted
     * will be added to the buffer. Only buffers for events specified as [CleverTapEvent.bufferable]
     * can be enabled.
     *
     * @see [disableBuffer]
     */
    @JvmStatic
    fun enableBuffer(event: CleverTapEvent) {
        val buffer = eventsBuffers[event] ?: return
        post("enableBuffer($event)") { buffer.enabled = true }
    }

    /**
     * Disable buffering for the specified event. This will only have effect for events specified as
     * [CleverTapEvent.bufferable].
     *
     * @see [enableBuffer]
     */
    @JvmStatic
    fun disableBuffer(event: CleverTapEvent) {
        val buffer = eventsBuffers[event] ?: return
        post("disableBuffer($event)") { buffer.enabled = false }
    }

    /**
     * Clear all the buffered events from all buffers and set whether all buffers should be enabled
     * after that. Note: this DISCARDS whatever is still buffered - it is the "handlers never
     * showed up" safety valve, not a flush.
     *
     * @param enableBuffers enable/disable all buffers after they are cleared
     */
    @JvmStatic
    fun resetAllBuffers(enableBuffers: Boolean) {
        post("resetAllBuffers") {
            eventsBuffers.values.forEach { buffer -> buffer.reset(enableBuffers) }
            Log.i(LOG_TAG, "Buffers reset and enabled: $enableBuffers")
        }
    }

    /**
     * Emit all currently buffered events for the specified event name.
     */
    @JvmStatic
    fun flushBuffer(event: CleverTapEvent) {
        val buffer = eventsBuffers[event] ?: return
        post("flushBuffer($event)") {
            buffer.drain().forEach { params -> send(event, params) }
        }
    }

    @JvmStatic
    fun enableAll() {
        post("enableAll") {
            eventsBuffers.values.forEach { buffer -> buffer.enabled = true }
        }
    }

    @JvmStatic
    fun disableAllAndFlush() {
        post("disableAllAndFlush") {
            eventsBuffers.forEach { (event, buffer) ->
                buffer.enabled = false
                buffer.drain().forEach { params -> send(event, params) }
            }
        }
    }

    /**
     * Emit an event with specified params. It will be buffered if buffering for the event is
     * enabled or it will be sent immediately otherwise.
     *
     * @param event The event to be emitted
     * @param params Optional event parameters
     *
     * @see [startEmission]
     */
    @JvmStatic
    fun emit(event: CleverTapEvent, params: Any?) {
        // Non-bufferable events still go through the worker, so they keep their place in line
        // behind everything emitted before them.
        val buffer = eventsBuffers[event]
        post("emit($event)") {
            if (buffer != null && buffer.offer(params)) {
                Log.i(LOG_TAG, "Event $event added to buffer.")
            } else {
                send(event, params)
            }
        }
    }

    /**
     * Blocks until every operation posted before this call has finished. Tests use it to
     * observe the worker's results deterministically; production code never needs it.
     */
    @VisibleForTesting
    internal fun awaitIdle() {
        worker.submit { }.get()
    }

    // Every operation goes through here. A task that throws must not take the worker thread
    // down with it (an uncaught exception off the main thread crashes the app): log and move on
    // to the next task. execute() on an unbounded queue only rejects after shutdown, which never
    // happens; the outer catch keeps that "never" from ever reaching the SDK's callback thread.
    private fun post(what: String, task: () -> Unit) {
        try {
            worker.execute {
                try {
                    task()
                } catch (t: Throwable) {
                    Log.e(LOG_TAG, "$what failed", t)
                }
            }
        } catch (t: Throwable) {
            Log.e(LOG_TAG, "$what could not be scheduled", t)
        }
    }

    // Runs on the worker. One throwing send must not stop the rest of a flush.
    private fun send(event: CleverTapEvent, params: Any?) {
        try {
            sender(event, params)
        } catch (t: Throwable) {
            Log.e(LOG_TAG, "Sending event $event failed", t)
        }
    }

    private fun sendToDart(event: CleverTapEvent, params: Any?) {
        if (event == CleverTapEvent.CLEVERTAP_UNKNOWN) {
            Log.i(LOG_TAG, "Not Sending event since its unknown")
            return
        }
        invokeMethodOnUiThread(EventNameMapper.fromCleverTapEvent(event), params)
        Log.i(LOG_TAG, "Sending event $event")
    }

    /**
     * One event's buffer. Plain data, CONFINED TO THE WORKER THREAD: every method is only ever
     * called from a task posted through [post], so no synchronization is needed or wanted here.
     */
    private class Buffer(var enabled: Boolean) {

        private val items = LinkedList<Any?>()

        /**
         * Buffers the payload and returns true when buffering is on; returns false (the caller
         * sends immediately) otherwise.
         */
        fun offer(item: Any?): Boolean {
            if (!enabled) {
                return false
            }
            items.add(item)
            return true
        }

        /** Removes and returns every held payload, in order. */
        fun drain(): List<Any?> {
            if (items.isEmpty()) {
                return emptyList()
            }
            val all = ArrayList<Any?>(items)
            items.clear()
            return all
        }

        fun reset(enable: Boolean) {
            items.clear()
            enabled = enable
        }
    }
}
