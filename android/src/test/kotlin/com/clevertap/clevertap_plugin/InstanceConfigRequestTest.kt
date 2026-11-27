package com.clevertap.clevertap_plugin

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Test

/**
 * The createInstance config rules, tested with the same plain maps Flutter's
 * StandardMessageCodec hands to the plugin (HashMap, ArrayList, String, Boolean, Integer).
 */
class InstanceConfigRequestTest {

    private fun base(vararg extra: Pair<String, Any?>): HashMap<String, Any?> =
        hashMapOf<String, Any?>("accountId" to "ACC-B", "accountToken" to "TOK-B").apply { putAll(extra) }

    private fun assertInvalid(config: Map<*, *>?, expectedMessagePart: String) {
        try {
            InstanceConfigRequest.parse(config)
            fail("expected InvalidConfigException containing \"$expectedMessagePart\"")
        } catch (e: InstanceConfigRequest.InvalidConfigException) {
            assertTrue("message was: ${e.message}", e.message!!.contains(expectedMessagePart))
        }
    }

    @Test
    fun minimalConfig_onlyIdAndToken_everythingElseNotSet() {
        val r = InstanceConfigRequest.parse(base())
        assertEquals("ACC-B", r.accountId)
        assertEquals("TOK-B", r.accountToken)
        assertNull(r.region)
        assertNull(r.proxyDomain)
        assertNull(r.spikyProxyDomain)
        assertNull(r.handshakeDomain)
        assertNull(r.identityKeys)
        assertNull(r.logLevel)
        assertNull(r.analyticsOnly)
        assertNull(r.enablePersonalization)
        assertNull(r.disableAppLaunchedEvent)
        assertNull(r.encryptionLevel)
        assertNull(r.encryptionInTransit)
        assertNull(r.useCustomCleverTapId)
        assertNull(r.cleverTapId)
        assertNull(r.useGoogleAdId)
        assertNull(r.backgroundSync)
        assertTrue(r.pushProviders.isEmpty())
    }

    @Test
    fun fullConfig_everyFieldRead() {
        val r = InstanceConfigRequest.parse(
            base(
                "region" to "eu1",
                "proxyDomain" to "proxy.example.com",
                "spikyProxyDomain" to "spiky.example.com",
                "handshakeDomain" to "hs.example.com",
                "identityKeys" to arrayListOf("Email", "Phone"),
                "logLevel" to "verbose",
                "analyticsOnly" to true,
                "enablePersonalization" to false,
                "disableAppLaunchedEvent" to true,
                "encryptionLevel" to "high",
                "encryptionInTransit" to true,
                "useCustomCleverTapId" to true,
                "cleverTapId" to "my-user-42",
                "android" to hashMapOf(
                    "useGoogleAdId" to true,
                    "backgroundSync" to false,
                    "pushProviders" to arrayListOf(
                        hashMapOf(
                            "type" to "hps",
                            "prefKey" to "hps_token",
                            "className" to "com.clevertap.android.hms.HmsPushProvider",
                            "messagingSDKClassName" to "com.huawei.hms.push.HmsMessageService",
                        )
                    ),
                ),
                "ios" to hashMapOf("disableIDFV" to "ignored on Android, any type"),
            )
        )
        assertEquals("eu1", r.region)
        assertEquals("proxy.example.com", r.proxyDomain)
        assertEquals("spiky.example.com", r.spikyProxyDomain)
        assertEquals("hs.example.com", r.handshakeDomain)
        assertEquals(listOf("Email", "Phone"), r.identityKeys)
        assertEquals("verbose", r.logLevel)
        assertEquals(true, r.analyticsOnly)
        assertEquals(false, r.enablePersonalization)
        assertEquals(true, r.disableAppLaunchedEvent)
        assertEquals("high", r.encryptionLevel)
        assertEquals(true, r.encryptionInTransit)
        assertEquals(true, r.useCustomCleverTapId)
        assertEquals("my-user-42", r.cleverTapId)
        assertEquals(true, r.useGoogleAdId)
        assertEquals(false, r.backgroundSync)
        assertEquals(1, r.pushProviders.size)
        assertEquals("hps", r.pushProviders[0].type)
        assertEquals("hps_token", r.pushProviders[0].prefKey)
        assertEquals("com.clevertap.android.hms.HmsPushProvider", r.pushProviders[0].className)
        assertEquals("com.huawei.hms.push.HmsMessageService", r.pushProviders[0].messagingSDKClassName)
    }

    @Test
    fun explicitNulls_meanNotSet() {
        val r = InstanceConfigRequest.parse(
            base("region" to null, "analyticsOnly" to null, "logLevel" to null, "android" to null)
        )
        assertNull(r.region)
        assertNull(r.analyticsOnly)
        assertNull(r.logLevel)
        assertNull(r.useGoogleAdId)
    }

    @Test
    fun blankRegion_meansNoRegion() {
        assertNull(InstanceConfigRequest.parse(base("region" to "  ")).region)
    }

    @Test
    fun missingConfig_isRejected() {
        assertInvalid(null, "a config object is required")
    }

    @Test
    fun missingOrEmptyIdOrToken_isRejected() {
        val message = "accountId and accountToken must be non-empty strings"
        assertInvalid(hashMapOf("accountToken" to "T"), message)
        assertInvalid(hashMapOf("accountId" to "A"), message)
        assertInvalid(base("accountId" to ""), message)
        assertInvalid(base("accountId" to "   "), message)
        assertInvalid(base("accountToken" to ""), message)
        assertInvalid(base("accountId" to null), message)
    }

    @Test
    fun wrongTypes_areRejected_namingTheField() {
        assertInvalid(base("accountId" to 123), "accountId must be a string")
        assertInvalid(base("region" to 1), "region must be a string")
        assertInvalid(base("analyticsOnly" to "true"), "analyticsOnly must be a boolean")
        assertInvalid(base("analyticsOnly" to 1), "analyticsOnly must be a boolean")
        assertInvalid(base("identityKeys" to "Email"), "identityKeys must be a list")
        assertInvalid(base("identityKeys" to arrayListOf("Email", 7)), "identityKeys must be a list of strings")
        assertInvalid(base("android" to "yes"), "android must be a map")
        assertInvalid(base("android" to hashMapOf("useGoogleAdId" to "yes")), "android.useGoogleAdId must be a boolean")
        assertInvalid(base("android" to hashMapOf("pushProviders" to "hps")), "android.pushProviders must be a list")
    }

    @Test
    fun unknownEnumWords_areRejected_notSilentlyDefaulted() {
        assertInvalid(base("logLevel" to "VERBOSE"), "logLevel must be one of off, info, debug, verbose")
        assertInvalid(base("encryptionLevel" to "HIGH"), "encryptionLevel must be one of none, medium, high")
        assertInvalid(base("encryptionLevel" to "full"), "encryptionLevel must be one of none, medium, high")
    }

    @Test
    fun customCleverTapId_andFlag_mustComeTogether() {
        val message = "cleverTapId and useCustomCleverTapId: true must be given together"
        assertInvalid(base("cleverTapId" to "my-user-42"), message)
        assertInvalid(base("useCustomCleverTapId" to true), message)
        assertInvalid(base("useCustomCleverTapId" to true, "cleverTapId" to "  "), message)
        assertInvalid(base("useCustomCleverTapId" to false, "cleverTapId" to "my-user-42"), message)
        // Both left out, or the flag false with no ID, are fine.
        assertEquals(false, InstanceConfigRequest.parse(base("useCustomCleverTapId" to false)).useCustomCleverTapId)
    }

    @Test
    fun pushProvider_everyPartRequired_namingTheItem() {
        fun provider(vararg drop: String) = hashMapOf<String, Any?>(
            "type" to "hps", "prefKey" to "k", "className" to "c", "messagingSDKClassName" to "m",
        ).apply { drop.forEach { remove(it) } }

        assertInvalid(
            base("android" to hashMapOf("pushProviders" to arrayListOf(provider(), provider("className")))),
            "android.pushProviders[1].className is required",
        )
        assertInvalid(
            base("android" to hashMapOf("pushProviders" to arrayListOf(provider().apply { put("type", " ") }))),
            "android.pushProviders[0].type is required",
        )
        assertInvalid(
            base("android" to hashMapOf("pushProviders" to arrayListOf("hps"))),
            "android.pushProviders[0] must be a map",
        )
    }

    @Test
    fun unknownKeys_areIgnored() {
        // A newer Dart side may send a key this native version does not know yet.
        val r = InstanceConfigRequest.parse(base("someFutureOption" to 42))
        assertEquals("ACC-B", r.accountId)
    }
}
