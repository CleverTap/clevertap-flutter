package com.clevertap.clevertap_plugin

import com.clevertap.clevertap_plugin.DartToNativePlatformCommunicator.Companion.accountIdOf
import com.clevertap.clevertap_plugin.DartToNativePlatformCommunicator.Companion.scalarArgumentOf
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

/** Which account a method call addresses: a handle call names it; a static call does not. */
class HandleCallAccountTest {

    @Test
    fun handleCall_namesItsAccount() {
        assertEquals("B", accountIdOf(hashMapOf("eventName" to "Purchase", "accountId" to "B")))
    }

    @Test
    fun staticCall_hasNoAccount_soTheDefaultIsUsed() {
        assertNull(accountIdOf(hashMapOf("eventName" to "Purchase", "eventData" to hashMapOf<String, Any>())))
        assertNull(accountIdOf(hashMapOf<String, Any>())) // getCleverTapID sends {}
        assertNull(accountIdOf(null))
        assertNull(accountIdOf("a String argument"))
    }

    @Test
    fun wrongTypeOrEmpty_countsAsAbsent_neverThrows() {
        assertNull(accountIdOf(hashMapOf("accountId" to 42)))
        assertNull(accountIdOf(hashMapOf("accountId" to "")))
        assertNull(accountIdOf(hashMapOf("accountId" to null)))
    }

    // setLocale, clearInAppResources and promptForPushNotification send one bare value from a static
    // call. A handle call wraps it: {"value": ..., "accountId": "B"}. Both must read the same value.
    @Test
    fun scalarArgument_staticSendsTheValue_handleWrapsIt() {
        assertEquals("en_US", scalarArgumentOf("en_US"))
        assertEquals("en_US", scalarArgumentOf(hashMapOf("value" to "en_US", "accountId" to "B")))
        assertEquals(true, scalarArgumentOf(true))
        assertEquals(true, scalarArgumentOf(hashMapOf("value" to true, "accountId" to "B")))
        assertNull(scalarArgumentOf(null))
    }
}
