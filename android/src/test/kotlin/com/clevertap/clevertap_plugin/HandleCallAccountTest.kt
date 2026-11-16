package com.clevertap.clevertap_plugin

import com.clevertap.clevertap_plugin.DartToNativePlatformCommunicator.Companion.accountIdOf
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
}
