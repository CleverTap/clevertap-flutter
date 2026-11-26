package com.clevertap.clevertap_plugin

import org.json.JSONArray
import org.json.JSONObject
import org.junit.Assert.assertArrayEquals
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class CleverTapTypeUtilsTest {


    // ---- MapUtil.toJSONObject ------------------------------------------------

    @Test
    fun `toJSONObject keeps boolean int string and widens float to double`() {
        val map = mapOf<String, Any?>(
            "b" to true,
            "i" to 7,
            "s" to "text",
            "d" to 1.5,
            "f" to 2.5f
        )
        val json = CleverTapTypeUtils.MapUtil.toJSONObject(map)

        assertEquals(true, json.getBoolean("b"))
        assertEquals(7, json.getInt("i"))
        assertEquals("text", json.getString("s"))
        assertEquals(1.5, json.getDouble("d"), 0.0)
        assertEquals(2.5, json.getDouble("f"), 0.0)
    }

    @Test
    fun `toJSONObject converts nested maps and lists`() {
        val map = mapOf<String, Any?>(
            "nested" to mapOf("k" to "v"),
            "list" to arrayListOf<Any?>("a", 1, mapOf("x" to true), arrayListOf<Any?>(1, 2))
        )
        val json = CleverTapTypeUtils.MapUtil.toJSONObject(map)

        assertEquals("v", json.getJSONObject("nested").getString("k"))
        val list = json.getJSONArray("list")
        assertEquals("a", list.getString(0))
        assertEquals(1, list.getInt(1))
        assertTrue(list.getJSONObject(2).getBoolean("x"))
        assertEquals(2, list.getJSONArray(3).getInt(1))
    }

    @Test
    fun `toJSONObject on empty map gives empty object`() {
        assertEquals(0, CleverTapTypeUtils.MapUtil.toJSONObject(emptyMap()).length())
    }

    @Test
    fun `toJSONObject keeps Long values`() {
        val json = CleverTapTypeUtils.MapUtil.toJSONObject(
            mapOf<String, Any?>("big" to 5_000_000_000L, "ok" to 1)
        )

        assertEquals(5_000_000_000L, json.getLong("big"))
        assertEquals(1, json.getInt("ok"))
    }

    @Test
    fun `toJSONObject keeps Long values inside lists`() {
        val list = CleverTapTypeUtils.MapUtil.toJSONObject(
            mapOf<String, Any?>("l" to arrayListOf<Any?>(5_000_000_000L, 1))
        ).getJSONArray("l")

        assertEquals(5_000_000_000L, list.getLong(0))
        assertEquals(1, list.getInt(1))
    }

    @Test
    fun `toJSONObject drops types it does not support`() {
        val json = CleverTapTypeUtils.MapUtil.toJSONObject(
            mapOf<String, Any?>("obj" to Any(), "ok" to 1)
        )

        assertFalse(json.has("obj"))
        assertEquals(1, json.getInt("ok"))
    }

    @Test
    fun `toJSONObject writes a list null as JSONObject NULL`() {
        val list = CleverTapTypeUtils.MapUtil.toJSONObject(
            mapOf<String, Any?>("l" to arrayListOf<Any?>(null, "x"))
        ).getJSONArray("l")

        assertTrue(list.isNull(0))
        assertEquals("x", list.getString(1))
    }

    // ---- MapUtil.toMap / ArrayUtil -----------------------------------------

    @Test
    fun `toMap converts nested JSON objects and arrays`() {
        val json = JSONObject("""{"a":1,"o":{"b":"x"},"arr":[1,{"c":2},[3]]}""")

        val map = CleverTapTypeUtils.MapUtil.toMap(json)

        assertEquals(1, map["a"])
        assertEquals(mapOf("b" to "x"), map["o"])
        val arr = map["arr"] as Array<*>
        assertEquals(1, arr[0])
        assertEquals(mapOf("c" to 2), arr[1])
        assertArrayEquals(arrayOf<Any>(3), arr[2] as Array<*>)
    }

    @Test
    fun `ArrayUtil toArray handles empty array`() {
        val arr = CleverTapTypeUtils.MapUtil.ArrayUtil.toArray(JSONArray())
        assertEquals(0, arr.size)
    }

    // ---- MapUtil.addValue ----------------------------------------------------

    @Test
    fun `addValue stores supported types under the key`() {
        listOf<Any?>(null, true, 1.5, 3, "s", mapOf("a" to 1), arrayListOf(1, 2)).forEach { v ->
            val result = CleverTapTypeUtils.MapUtil.addValue("k", v)
            assertTrue("key should be present for $v", result.containsKey("k"))
            assertEquals(v, result["k"])
        }
    }

    @Test
    fun `addValue keeps Long values`() {
        val result = CleverTapTypeUtils.MapUtil.addValue("k", 5_000_000_000L)

        assertEquals(5_000_000_000L, result["k"])
    }

    @Test
    fun `addValue ignores unsupported types`() {
        val result = CleverTapTypeUtils.MapUtil.addValue("k", Any())

        assertTrue(result.isEmpty())
    }

    // ---- LongUtil ------------------------------------------------------------

    @Test
    fun `parseLong converts Integer and Long`() {
        assertEquals(5L, CleverTapTypeUtils.LongUtil.parseLong(5))
        assertEquals(9_000_000_000L, CleverTapTypeUtils.LongUtil.parseLong(9_000_000_000L))
    }

    @Test
    fun `parseLong returns null for other types`() {
        assertNull(CleverTapTypeUtils.LongUtil.parseLong("5"))
        assertNull(CleverTapTypeUtils.LongUtil.parseLong(5.0))
        assertNull(CleverTapTypeUtils.LongUtil.parseLong(null))
    }
}
