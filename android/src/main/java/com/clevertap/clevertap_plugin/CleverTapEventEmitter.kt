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
 *
 * ACCOUNTS. Every event carries the account it came from (null when unknown, for example an event
 * sent through the one-argument [emit] by older code). Dart receives it wrapped:
 * `{"__ctEnvelope": true, "accountId": "B", "isDefault": false, "payload": <today's value>}`.
 * Buffers hold each payload with its account. Arming an account ([startEmission] with an
 * accountId) releases only that account's held payloads (plus unknown-account ones), so the
 * default account's handler can never receive, or release, account B's events.
 *
 * Example: B's profileDidInitialize is held. Dart sets the default account's handler, which arms
 * the default: B's payload stays held. It is released when B is armed (Phase 4 handles), or
 * discarded by the 5-second reset.
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
    // deliveries. It receives the envelope. Read on the worker, written by tests on their own thread.
    @Volatile
    @VisibleForTesting
    internal var sender: (CleverTapEvent, Any?) -> Unit = ::sendToDart

    // The default (AndroidManifest.xml) account's ID, read when an event is sent to set
    // isDefault, and when Dart arms "the default account". The default slot never changes once
    // set (no setInstanceWithAccountId in v1), so reading it at send time is stable. Tests
    // replace it.
    @Volatile
    @VisibleForTesting
    internal var defaultAccountId: () -> String? = { CleverTapInstanceRegistry.defaultAccountId() }

    /**
     * Dart set its handler for the specified event on the DEFAULT account (the static
     * CleverTapPlugin handlers). The same as [startEmission] with the default account's ID.
     */
    @JvmStatic
    fun startEmission(event: CleverTapEvent) {
        startEmission(event, defaultAccountId())
    }

    /**
     * Dart set its handler for [event] on [accountId]: from now on that account's payloads for
     * this event are sent live, and the ones held for it are sent first, in order. Both steps run
     * in ONE worker task, so a payload emitted at the same moment is either sent with the held
     * ones or sent live after them, never left behind. Other accounts' held payloads stay held.
     */
    @JvmStatic
    fun startEmission(event: CleverTapEvent, accountId: String?) {
        val buffer = eventsBuffers[event] ?: return
        post("startEmission($event, $accountId)") {
            buffer.arm(accountId)
            val held = buffer.drainFor(accountId)
            Log.i(LOG_TAG, "Emission started for $event, account $accountId, flushing ${held.size}")
            held.forEach { send(event, it.accountId, it.payload) }
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
            buffer.drain().forEach { send(event, it.accountId, it.payload) }
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
                buffer.drain().forEach { send(event, it.accountId, it.payload) }
            }
        }
    }

    /**
     * Emit an event whose account is not known. Dart routes it like a default-account event,
     * which is where such events always went. The plugin's own events all name their account.
     */
    @JvmStatic
    fun emit(event: CleverTapEvent, params: Any?) {
        emit(event, null, params)
    }

    /**
     * Emit [event] for [accountId] with [params]. It is held while buffering is on and the account
     * has not armed this event yet; otherwise it is sent immediately.
     *
     * @param accountId the account the event came from, or null when unknown
     * @see [startEmission]
     */
    @JvmStatic
    fun emit(event: CleverTapEvent, accountId: String?, params: Any?) {
        // Non-bufferable events still go through the worker, so they keep their place in line
        // behind everything emitted before them.
        val buffer = eventsBuffers[event]
        post("emit($event, $accountId)") {
            if (buffer != null && buffer.offer(accountId, params)) {
                Log.i(LOG_TAG, "Event $event for account $accountId added to buffer.")
            } else {
                send(event, accountId, params)
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
    private fun send(event: CleverTapEvent, accountId: String?, payload: Any?) {
        try {
            sender(event, envelope(accountId, payload))
        } catch (t: Throwable) {
            Log.e(LOG_TAG, "Sending event $event failed", t)
        }
    }

    /**
     * The map Dart receives. `__ctEnvelope` marks it, so Dart never mistakes an app-defined payload
     * that happens to contain "accountId" or "payload" keys (for example a push payload) for an
     * envelope. An unknown account (null) counts as default: that is where those events go today.
     */
    @VisibleForTesting
    internal fun envelope(accountId: String?, payload: Any?): Map<String, Any?> = linkedMapOf(
        ENVELOPE_MARKER to true,
        "accountId" to accountId,
        "isDefault" to (accountId == null || accountId == defaultAccountId()),
        "payload" to payload,
    )

    /** The key that marks an envelope. Dart checks the same key (lib/clevertap_plugin.dart). */
    const val ENVELOPE_MARKER = "__ctEnvelope"

    private fun sendToDart(event: CleverTapEvent, params: Any?) {
        if (event == CleverTapEvent.CLEVERTAP_UNKNOWN) {
            Log.i(LOG_TAG, "Not Sending event since its unknown")
            return
        }
        invokeMethodOnUiThread(EventNameMapper.fromCleverTapEvent(event), params)
        Log.i(LOG_TAG, "Sending event $event")
    }

    /** One held payload and the account it came from (null when unknown). */
    private class Held(val accountId: String?, val payload: Any?)

    /**
     * One event's buffer. Plain data, CONFINED TO THE WORKER THREAD: every method is only ever
     * called from a task posted through [post], so no synchronization is needed or wanted here.
     */
    private class Buffer(var enabled: Boolean) {

        private val items = LinkedList<Held>()

        // Accounts whose handler for this event is set. A null entry is "the default account"
        // when the app has no default account; it never matches a known account's payload.
        private val armedAccounts = HashSet<String?>()

        /**
         * Holds the payload and returns true when buffering is on and its account has not armed
         * this event yet; returns false (the caller sends immediately) otherwise. A payload of an
         * unknown account goes live once any account has armed the event.
         */
        fun offer(accountId: String?, payload: Any?): Boolean {
            val armed = if (accountId == null) armedAccounts.isNotEmpty() else accountId in armedAccounts
            if (!enabled || armed) {
                return false
            }
            items.add(Held(accountId, payload))
            return true
        }

        fun arm(accountId: String?) {
            armedAccounts.add(accountId)
        }

        /**
         * Removes and returns the payloads of [accountId] plus the unknown-account ones, in order.
         * Other accounts' payloads stay held, in order.
         */
        fun drainFor(accountId: String?): List<Held> {
            if (items.isEmpty()) {
                return emptyList()
            }
            val released = ArrayList<Held>()
            val iterator = items.iterator()
            while (iterator.hasNext()) {
                val held = iterator.next()
                if (held.accountId == null || held.accountId == accountId) {
                    released.add(held)
                    iterator.remove()
                }
            }
            return released
        }

        /** Removes and returns every held payload, in order, whatever its account. */
        fun drain(): List<Held> {
            if (items.isEmpty()) {
                return emptyList()
            }
            val all = ArrayList<Held>(items)
            items.clear()
            return all
        }

        fun reset(enable: Boolean) {
            items.clear()
            armedAccounts.clear()
            enabled = enable
        }
    }
}
