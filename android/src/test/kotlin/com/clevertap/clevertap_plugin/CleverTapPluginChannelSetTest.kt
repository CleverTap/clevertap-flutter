package com.clevertap.clevertap_plugin

import io.flutter.plugin.common.BinaryMessenger
import io.flutter.plugin.common.MethodChannel
import org.junit.After
import org.junit.Assert.assertTrue
import org.junit.Test
import java.nio.ByteBuffer
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicReference
import kotlin.concurrent.thread

/**
 * B4 regression guard: [CleverTapPlugin.invokeMethodOnUiThread] loops over every engine's
 * native-to-Dart channel on the emitting thread, while Flutter adds and removes engines on the
 * main thread (for example firebase_messaging starting a background engine when a push
 * arrives). With a HashSet the loop threw ConcurrentModificationException and the event was
 * lost for every engine.
 */
class CleverTapPluginChannelSetTest {

    /** A messenger that accepts and drops every message: we only care that sending never throws. */
    private class NoOpMessenger : BinaryMessenger {
        override fun send(channel: String, message: ByteBuffer?) {}
        override fun send(channel: String, message: ByteBuffer?, callback: BinaryMessenger.BinaryReply?) {}
        override fun setMessageHandler(channel: String, handler: BinaryMessenger.BinaryMessageHandler?) {}
    }

    private val added = mutableListOf<MethodChannel>()

    @After
    fun tearDown() {
        CleverTapPlugin.nativeToDartMethodChannelSet.removeAll(added.toSet())
    }

    @Test
    fun invokeWhileEnginesAttachAndDetach_neverThrows() {
        val messenger = NoOpMessenger()
        repeat(20) {
            val channel = MethodChannel(messenger, "clevertap_plugin/native_to_dart")
            added.add(channel)
            CleverTapPlugin.nativeToDartMethodChannelSet.add(channel)
        }

        val stop = AtomicBoolean(false)
        val failure = AtomicReference<Throwable?>(null)
        // Plays the main thread: engines attaching and detaching.
        val churn = thread {
            while (!stop.get()) {
                val channel = MethodChannel(messenger, "clevertap_plugin/native_to_dart")
                CleverTapPlugin.nativeToDartMethodChannelSet.add(channel)
                CleverTapPlugin.nativeToDartMethodChannelSet.remove(channel)
            }
        }
        try {
            // Plays the SDK callback thread: sending events.
            repeat(20_000) {
                CleverTapPlugin.invokeMethodOnUiThread("profileDidInitialize", "ct_$it")
            }
        } catch (t: Throwable) {
            failure.set(t)
        } finally {
            stop.set(true)
            churn.join()
        }

        assertTrue("invokeMethodOnUiThread threw: ${failure.get()}", failure.get() == null)
    }
}
