package com.clevertap.clevertap_plugin

import android.os.Bundle
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class UtilsTest {

    // ---- dartMapToProfileMap -------------------------------------------------

    @Test
    fun `dartMapToProfileMap returns null for null input`() {
        assertNull(Utils.dartMapToProfileMap(null))
    }

    @Test
    fun `dartMapToProfileMap passes normal values through unchanged`() {
        val result = Utils.dartMapToProfileMap(
            mapOf("Name" to "Jack", "Age" to 30, "Married" to true)
        )
        assertEquals("Jack", result["Name"])
        assertEquals(30, result["Age"])
        assertEquals(true, result["Married"])
    }

    @Test
    fun `dartMapToProfileMap converts DOB dd-MM-yyyy into a Date`() {
        val result = Utils.dartMapToProfileMap(mapOf("DOB" to "12-05-1990"))
        val dob = result["DOB"]
        assertTrue("DOB should be a Date but was ${dob?.javaClass}", dob is Date)
        val formatted = SimpleDateFormat("dd-MM-yyyy", Locale.ENGLISH).format(dob as Date)
        assertEquals("12-05-1990", formatted)
    }

    @Test
    fun `dartMapToProfileMap drops an unparseable DOB but keeps other keys`() {
        val result = Utils.dartMapToProfileMap(
            mapOf("DOB" to "not-a-date", "Name" to "Jack")
        )
        assertFalse("bad DOB should be skipped, not crash", result.containsKey("DOB"))
        assertEquals("Jack", result["Name"])
    }

    @Test
    fun `dartMapToProfileMap returns an empty map for an empty input`() {
        assertTrue(Utils.dartMapToProfileMap(emptyMap()).isEmpty())
    }

    // ---- mapToBundle / bundleToMap / stringToBundle / jsonToBundle -----------

    @Test
    fun `mapToBundle stringifies every non-null value`() {
        val bundle = Utils.mapToBundle(hashMapOf("a" to 1, "b" to true, "c" to "x"))
        assertEquals("1", bundle.getString("a"))
        assertEquals("true", bundle.getString("b"))
        assertEquals("x", bundle.getString("c"))
    }

    @Test
    @Suppress("UNCHECKED_CAST")
    fun `mapToBundle skips null values`() {
        val map = hashMapOf<String, Any?>("a" to null, "b" to "x") as HashMap<String, Any>
        val bundle = Utils.mapToBundle(map)
        assertFalse(bundle.containsKey("a"))
        assertEquals("x", bundle.getString("b"))
    }

    @Test
    fun `bundleToMap returns null for null bundle`() {
        assertNull(Utils.bundleToMap(null))
    }

    @Test
    fun `bundleToMap copies all keys`() {
        val bundle = Bundle().apply {
            putString("wzrk_id", "123")
            putInt("count", 2)
        }
        val map = Utils.bundleToMap(bundle)
        assertEquals("123", map["wzrk_id"])
        assertEquals(2, map["count"])
        assertEquals(2, map.size)
    }

    @Test
    fun `stringToBundle parses a flat JSON string`() {
        val bundle = Utils.stringToBundle("""{"a":"1","b":2}""")
        assertEquals("1", bundle.getString("a"))
        assertEquals("2", bundle.getString("b")) // numbers become strings
    }

    @Test
    fun `stringToBundle throws on invalid JSON`() {
        try {
            Utils.stringToBundle("not json")
            fail("expected JSONException")
        } catch (e: JSONException) {
            // expected
        }
    }

    @Test
    fun `jsonToBundle handles null and populated objects`() {
        assertTrue(Utils.jsonToBundle(null).isEmpty)
        val bundle = Utils.jsonToBundle(JSONObject().put("k", "v"))
        assertEquals("v", bundle.getString("k"))
    }

    // ---- jsonToMap / mapToJSONObject ----------------------------------------

    @Test
    fun `jsonToMap converts nested objects and arrays into maps and lists`() {
        val json = JSONObject(
            """{"name":"x","nested":{"n":1},"list":[1,2,{"k":"v"}],"deep":[[1,2],[3]]}"""
        )
        val map = Utils.jsonToMap(json)

        assertEquals("x", map["name"])
        assertEquals(mapOf("n" to 1), map["nested"])
        val list = map["list"] as List<*>
        assertEquals(1, list[0])
        assertEquals(mapOf("k" to "v"), list[2])
        assertEquals(listOf(listOf(1, 2), listOf(3)), map["deep"])
    }

    @Test
    fun `jsonToMap on empty object returns empty map`() {
        assertTrue(Utils.jsonToMap(JSONObject()).isEmpty())
    }

    @Test
    fun `mapToJSONObject returns empty object for null map`() {
        assertEquals(0, Utils.mapToJSONObject(null).length())
    }

    @Test
    fun `mapToJSONObject puts scalar values and converts ArrayList to JSONArray`() {
        val map = hashMapOf<String, Any>(
            "s" to "x",
            "n" to 5,
            "list" to arrayListOf("a", "b")
        )
        val json = Utils.mapToJSONObject(map)

        assertEquals("x", json.getString("s"))
        assertEquals(5, json.getInt("n"))
        val arr: JSONArray = json.getJSONArray("list")
        assertEquals(2, arr.length())
        assertEquals("a", arr.getString(0))
    }

    // ---- mapToPushType / utmDetailsToMap ------------------------------------

    @Test
    fun `mapToPushType returns null when type or prefKey is missing`() {
        assertNull(Utils.mapToPushType(mapOf("prefKey" to "k")))
        assertNull(Utils.mapToPushType(mapOf("type" to "fcm")))
        assertNull(Utils.mapToPushType(emptyMap()))
    }

    @Test
    fun `mapToPushType builds a PushType when type and prefKey are present`() {
        val pushType = Utils.mapToPushType(
            mapOf(
                "type" to "fcm",
                "prefKey" to "fcm_token",
                "className" to "com.example.Cls",
                "messagingSDKClassName" to "com.example.Sdk"
            )
        )
        assertNotNull(pushType)
        assertEquals("fcm", pushType!!.type)
        assertEquals("fcm_token", pushType.tokenPrefKey)
        assertEquals("com.example.Cls", pushType.ctProviderClassName)
        assertEquals("com.example.Sdk", pushType.messagingSDKClassName)
    }

    @Test
    fun `utmDetailsToMap returns empty map for null`() {
        assertTrue(Utils.utmDetailsToMap(null).isEmpty())
    }
}
