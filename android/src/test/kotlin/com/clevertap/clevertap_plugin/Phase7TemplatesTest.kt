package com.clevertap.clevertap_plugin

import io.flutter.plugin.common.MethodCall
import org.junit.Assert.assertEquals
import org.junit.Test

/** Phase 7: custom templates per account. */
class Phase7TemplatesTest {

    // Dart has always sent customTemplateContextToString a map: {templateName: "Spin"}. The old
    // handler read the whole argument as a String, so the cast failed on every call.
    @Test(expected = ClassCastException::class)
    fun contextToString_oldRead_failsOnTheMapDartSends() {
        val call = MethodCall("customTemplateContextToString", hashMapOf("templateName" to "Spin"))
        val templateName = call.arguments<String>()
        println(templateName)
    }

    @Test
    fun contextToString_newRead_getsTheName() {
        val call = MethodCall("customTemplateContextToString", hashMapOf("templateName" to "Spin"))
        assertEquals("Spin", call.argument<String>("templateName"))
    }
}
