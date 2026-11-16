package com.clevertap.clevertap_plugin

import org.junit.Assert.assertEquals
import org.junit.Assert.assertSame
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import java.util.Collections
import java.util.IdentityHashMap
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.CountDownLatch
import kotlin.concurrent.thread

/**
 * Per-account events (Phase 3): the envelope, account-aware buffers, and one listener proxy per
 * account.
 */
class AccountEventsTest {

    private val event = CleverTapEvent.CLEVERTAP_PROFILE_DID_INITIALIZE
    private val liveEvent = CleverTapEvent.CLEVERTAP_ON_VARIABLES_CHANGED // not bufferable

    /** Every envelope Dart received, in order. */
    private val delivered = CopyOnWriteArrayList<Map<*, *>>()

    private fun received(): List<Map<*, *>> {
        CleverTapEventEmitter.awaitIdle()
        return delivered.toList()
    }

    private fun payloadsOf(accountId: String?): List<Any?> =
        received().filter { it["accountId"] == accountId }.map { it["payload"] }

    @Before
    fun setUp() {
        CleverTapEventEmitter.sender = { _, envelope -> delivered.add(envelope as Map<*, *>) }
        CleverTapEventEmitter.defaultAccountId = { "DEF" }
        CleverTapEventEmitter.resetAllBuffers(true)
        CleverTapEventEmitter.awaitIdle()
        delivered.clear()
    }

    @Test
    fun envelope_hasTheMarker_theAccount_isDefault_andTheUnchangedPayload() {
        val payload = mapOf("accountId" to "app-key", "payload" to "app-value") // an app map with the same key names
        CleverTapEventEmitter.emit(liveEvent, "B", payload)
        CleverTapEventEmitter.emit(liveEvent, "DEF", true)
        CleverTapEventEmitter.emit(liveEvent, null, "unknown-account")

        val got = received()
        assertEquals(
            mapOf("__ctEnvelope" to true, "accountId" to "B", "isDefault" to false, "payload" to payload),
            got[0],
        )
        assertSame("the payload object is passed through, not copied or changed", payload, got[0]["payload"])
        assertEquals(mapOf("__ctEnvelope" to true, "accountId" to "DEF", "isDefault" to true, "payload" to true), got[1])
        assertEquals("an unknown account routes like the default, as today", true, got[2]["isDefault"])
        assertEquals("the key order is fixed", listOf("__ctEnvelope", "accountId", "isDefault", "payload"), got[0].keys.toList())
    }

    @Test
    fun armingTheDefault_releasesOnlyItsOwnHeldEvents_otherAccountsStayHeld() {
        CleverTapEventEmitter.emit(event, "DEF", "def-1")
        CleverTapEventEmitter.emit(event, "B", "b-1")
        CleverTapEventEmitter.emit(event, "DEF", "def-2")
        CleverTapEventEmitter.emit(event, "B", "b-2")
        assertTrue("nothing is sent before any handler", received().isEmpty())

        CleverTapEventEmitter.startEmission(event) // Dart set the static (default) handler
        CleverTapEventEmitter.emit(event, "DEF", "def-3")
        CleverTapEventEmitter.emit(event, "B", "b-3")

        assertEquals(listOf<Any?>("def-1", "def-2", "def-3"), payloadsOf("DEF"))
        assertTrue("B's events must not be released by the default's handler", payloadsOf("B").isEmpty())

        CleverTapEventEmitter.startEmission(event, "B") // Phase 4: B's handle sets its handler
        assertEquals("B's held events, in order", listOf<Any?>("b-1", "b-2", "b-3"), payloadsOf("B"))
    }

    @Test
    fun unknownAccountEvents_releaseOnTheFirstArm_andGoLiveAfterIt() {
        CleverTapEventEmitter.emit(event, null, "template-1")
        CleverTapEventEmitter.startEmission(event, "B")
        CleverTapEventEmitter.emit(event, null, "template-2")
        assertEquals(listOf<Any?>("template-1", "template-2"), payloadsOf(null))
    }

    @Test
    fun theFiveSecondReset_discardsEveryAccountsHeldEvents_thenEverythingIsLive() {
        CleverTapEventEmitter.emit(event, "DEF", "def-held")
        CleverTapEventEmitter.emit(event, "B", "b-held")
        CleverTapEventEmitter.resetAllBuffers(false)
        CleverTapEventEmitter.emit(event, "B", "b-live")

        assertEquals(listOf<Any?>("b-live"), received().map { it["payload"] })
    }

    @Test
    fun noDefaultAccount_staticHandlerArmsNull_whichNeverReleasesAKnownAccount() {
        CleverTapEventEmitter.defaultAccountId = { null } // no AndroidManifest.xml account
        CleverTapEventEmitter.emit(event, "B", "b-1")
        CleverTapEventEmitter.startEmission(event)
        assertTrue(received().isEmpty())
    }

    @Test
    fun oldTwoArgumentEmit_meansUnknownAccount() {
        CleverTapEventEmitter.emit(liveEvent, "x")
        assertEquals(null, received().single()["accountId"])
        assertEquals(true, received().single()["isDefault"])
    }

    @Test
    fun proxyFor_sameObjectEveryTime_onePerAccount_evenAcross8Threads() {
        val ids = (1..10).map { "ACC-$it" }
        val start = CountDownLatch(1)
        val seen = Collections.synchronizedList(mutableListOf<Pair<String, AccountListenerProxy>>())
        val threads = (0 until 8).map {
            thread {
                start.await()
                repeat(1_000) { i ->
                    val id = ids[i % ids.size]
                    seen.add(id to CleverTapListenerProxy.proxyFor(id))
                }
            }
        }
        start.countDown()
        threads.forEach { it.join() }

        for (id in ids) {
            val distinct = Collections.newSetFromMap(IdentityHashMap<AccountListenerProxy, Boolean>())
            seen.filter { it.first == id }.forEach { distinct.add(it.second) }
            assertEquals("account $id must have exactly one proxy object", 1, distinct.size)
            assertSame(
                "the map keeps it alive: a later lookup returns the same object",
                distinct.first(), CleverTapListenerProxy.proxyFor(id),
            )
        }
    }

    @Test
    fun aProxysCallbacks_areTaggedWithItsAccount() {
        CleverTapEventEmitter.resetAllBuffers(false) // everything live
        CleverTapEventEmitter.awaitIdle()
        CleverTapListenerProxy.proxyFor("B").profileDidInitialize("ct-id-b")
        CleverTapListenerProxy.proxyFor("B").onPushPermissionResponse(true)
        CleverTapListenerProxy.profileDidInitialize("legacy-object") // the public object: unknown account

        val got = received()
        assertEquals(listOf<Any?>("B", "B", null), got.map { it["accountId"] })
        assertEquals(listOf<Any?>("ct-id-b", true, "legacy-object"), got.map { it["payload"] })
    }
}
