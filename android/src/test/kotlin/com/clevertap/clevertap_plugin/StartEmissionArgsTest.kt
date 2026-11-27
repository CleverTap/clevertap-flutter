package com.clevertap.clevertap_plugin

import com.clevertap.clevertap_plugin.DartToNativePlatformCommunicator.Companion.StartEmissionRequest
import com.clevertap.clevertap_plugin.DartToNativePlatformCommunicator.Companion.parseStartEmission
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

/** startEmission accepts the old String (static handlers, default account) and the Phase 4 map (a handle). */
class StartEmissionArgsTest {

    @Test
    fun string_isAStaticHandler_forTheDefaultAccount() {
        assertEquals(
            StartEmissionRequest("CleverTapProfileDidInitialize", null),
            parseStartEmission("CleverTapProfileDidInitialize"),
        )
    }

    @Test
    fun map_isAHandlesHandler_forThatAccount() {
        assertEquals(
            StartEmissionRequest("CleverTapProfileDidInitialize", "B"),
            parseStartEmission(hashMapOf("event" to "CleverTapProfileDidInitialize", "accountId" to "B")),
        )
    }

    @Test
    fun mapWithoutAnAccount_meansTheDefaultAccount() {
        assertEquals(StartEmissionRequest("E", null), parseStartEmission(hashMapOf("event" to "E")))
        assertEquals(StartEmissionRequest("E", null), parseStartEmission(hashMapOf("event" to "E", "accountId" to null)))
        assertEquals(StartEmissionRequest("E", null), parseStartEmission(hashMapOf("event" to "E", "accountId" to "")))
    }

    @Test
    fun anythingElse_isRejected() {
        assertNull(parseStartEmission(null))
        assertNull(parseStartEmission(42))
        assertNull(parseStartEmission(hashMapOf("accountId" to "B")))
        assertNull(parseStartEmission(hashMapOf("event" to 7, "accountId" to "B")))
    }
}
