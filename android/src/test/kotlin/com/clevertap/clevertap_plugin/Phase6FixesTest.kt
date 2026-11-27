package com.clevertap.clevertap_plugin

import com.clevertap.android.sdk.interfaces.OnInitCleverTapIDListener
import com.clevertap.clevertap_plugin.DartToNativePlatformCommunicator.Companion.variables
import com.clevertap.clevertap_plugin.DartToNativePlatformCommunicator.Companion.variablesOf
import com.clevertap.clevertap_plugin.DartToNativePlatformCommunicator.Companion.variablesPayload
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotSame
import org.junit.Assert.assertSame
import org.junit.Test

/** Phase 6: per-account variables maps, and getCleverTapID answering once. */
class Phase6FixesTest {

    @Test
    fun variables_defaultAccountKeepsTheOldMap_otherAccountsGetTheirOwn() {
        assertSame("the default account uses the same map as before", variables, variablesOf("DEF", "DEF"))
        val b = "B-${System.nanoTime()}"
        assertNotSame(variables, variablesOf(b, "DEF"))
        assertSame("the same map every time for one account", variablesOf(b, "DEF"), variablesOf(b, "DEF"))
    }

    @Test
    fun variables_sameNameInTwoAccounts_doesNotOverwrite() {
        val a = "A-${System.nanoTime()}"
        val b = "B-${System.nanoTime()}"
        variablesOf(a, "DEF")["discount"] = 10
        variablesOf(b, "DEF")["discount"] = 0
        assertEquals(10, variablesOf(a, "DEF")["discount"])
        assertEquals(0, variablesOf(b, "DEF")["discount"])
    }

    @Test
    fun variables_noDefaultAccount_everyAccountGetsItsOwnMap() {
        assertNotSame(variables, variablesOf("C-${System.nanoTime()}", null))
    }

    @Test
    fun cleverTapId_answersOnce_andAsksToRemoveTheListenerEveryTime() {
        val replies = mutableListOf<String?>()
        val removed = mutableListOf<OnInitCleverTapIDListener>()
        val listener = SingleReplyCleverTapIDListener(remove = { removed.add(it) }, reply = { replies.add(it) })

        listener.onInitCleverTapID("id-1") // getCleverTapID: the ID already exists
        listener.onInitCleverTapID("id-1") // deviceIDCreated calls the kept listener again
        listener.onInitCleverTapID(null)   // never expected, must not throw

        assertEquals(listOf<String?>("id-1"), replies)
        assertEquals(3, removed.size)
        assertSame(listener, removed[0])
    }

    // Each variables event names the Dart registration it belongs to; Dart runs only that handler.
    @Test
    fun variablesPayload_carriesTheRegistrationId_andTheUnchangedValues() {
        val values = mapOf("discount" to 10)
        val payload = variablesPayload("k3f9q2-7", values)
        assertEquals(listOf("__ctCallbackId", "values"), payload.keys.toList())
        assertEquals("k3f9q2-7", payload["__ctCallbackId"])
        assertSame("the values object is passed through unchanged", values, payload["values"])
        assertEquals(mapOf("__ctCallbackId" to null, "values" to null), variablesPayload(null, null))
    }
}
