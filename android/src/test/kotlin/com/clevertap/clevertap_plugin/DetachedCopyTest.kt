package com.clevertap.clevertap_plugin

import com.clevertap.clevertap_plugin.DartToNativePlatformCommunicator.Companion.detachedCopy
import io.flutter.plugin.common.StandardMessageCodec
import org.junit.Assert.assertArrayEquals
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNotSame
import org.junit.Assert.assertNull
import org.junit.Assert.assertSame
import org.junit.Assert.assertTrue
import org.junit.Test
import java.math.BigDecimal
import java.math.BigInteger
import java.util.Collections
import java.util.LinkedList
import kotlin.random.Random

/**
 * [detachedCopy] protects variables payloads, which are now encoded a moment after the SDK
 * callback, from later in-place changes to the native SDK's VarCache tree. It has two duties:
 *
 *  1. Dart must receive EXACTLY the same bytes as without the copy. Checked by encoding the
 *     original and the copy with Flutter's real StandardMessageCodec (the encoder production
 *     uses) and comparing the bytes.
 *  2. After the copy, changing the SDK's objects must not change what Dart receives.
 *
 * The value types covered are every type a Flutter-defined variable can hold (Android SDK
 * 8.4.1 and the Flutter codec, traced in phase0_event_emitter_thread_safety.md section 10):
 *  - from Dart (StandardMessageCodec decode): null, Boolean, Integer, Long, BigInteger, Double,
 *    String, byte[], int[], long[], double[], float[], ArrayList, HashMap;
 *  - from the server (JsonUtil): HashMap, ArrayList, String, Integer, Long, Double, Boolean, null;
 *  - from Var's number conversion: Byte, Short, Integer, Long, Float, Double, Character.
 */
class DetachedCopyTest {

    private fun encode(value: Any?): ByteArray {
        // encodeMessage(null) returns null by contract: a null message has no bytes.
        val buffer = StandardMessageCodec.INSTANCE.encodeMessage(value) ?: return ByteArray(0)
        buffer.rewind()
        return ByteArray(buffer.remaining()).also { buffer.get(it) }
    }

    private fun assertSameBytes(original: Any?) {
        assertArrayEquals("encoded bytes differ for $original", encode(original), encode(detachedCopy(original)))
    }

    // ---- Leaves: immutable, returned as the same instance --------------------------------------

    @Test
    fun immutableLeaves_areReturnedAsTheSameInstance() {
        val leaves = listOf<Any>(
            "hello", true, false,
            Integer.valueOf(7), java.lang.Long.valueOf(3_000_000_000L), java.lang.Double.valueOf(6.9),
            java.lang.Float.valueOf(1.5f), java.lang.Short.valueOf(3), java.lang.Byte.valueOf(1),
            Character.valueOf('x'), BigInteger("123456789012345678901234567890"), BigDecimal("1.25")
        )
        for (leaf in leaves) {
            assertSame("leaf ${leaf.javaClass.simpleName}", leaf, detachedCopy(leaf))
        }
        assertNull(detachedCopy(null))
    }

    // ---- Arrays: same runtime type, new instance, same content ---------------------------------

    @Test
    fun codecArrays_keepTypeAndContent_andAreIndependent() {
        val bytes = byteArrayOf(1, 2)
        val ints = intArrayOf(1, 2)
        val longs = longArrayOf(1L, 2L)
        val doubles = doubleArrayOf(1.0, 2.0)
        val floats = floatArrayOf(1f, 2f)
        val strings = arrayOf("a", "b")
        val originals = listOf<Any>(bytes, ints, longs, doubles, floats, strings)

        val copies = originals.map { detachedCopy(it)!! }
        originals.zip(copies).forEach { (original, copy) ->
            assertEquals(original.javaClass, copy.javaClass)
            assertNotSame(original, copy)
        }
        // Change every original; the copies must keep the old content.
        bytes[0] = 9; ints[0] = 9; longs[0] = 9L; doubles[0] = 9.0; floats[0] = 9f; strings[0] = "z"
        assertArrayEquals(byteArrayOf(1, 2), copies[0] as ByteArray)
        assertArrayEquals(intArrayOf(1, 2), copies[1] as IntArray)
        assertArrayEquals(longArrayOf(1L, 2L), copies[2] as LongArray)
        assertArrayEquals(doubleArrayOf(1.0, 2.0), copies[3] as DoubleArray, 0.0)
        assertArrayEquals(floatArrayOf(1f, 2f), copies[4] as FloatArray, 0f)
        assertArrayEquals(arrayOf("a", "b"), copies[5] as Array<*>)
    }

    // ---- Maps: order kept, nulls kept, any key type kept ---------------------------------------

    /**
     * Why the copy is a LinkedHashMap: a new HashMap can iterate in a different order than the
     * source (the order depends on the table size). Dart keeps the order a map was encoded in,
     * so a plain HashMap copy would change the key order the app sees.
     */
    @Test
    fun mapCopy_keepsTheSourceIterationOrder_whereAPlainHashMapCopyWouldNot() {
        val source = HashMap<Any?, Any?>(64)
        source[1] = "one"
        source[16] = "sixteen"
        assertEquals(listOf<Any?>(1, 16), source.keys.toList())

        val naive = HashMap<Any?, Any?>(source.size).apply { putAll(source) }
        assertNotEquals("proof: a HashMap copy reorders", source.keys.toList(), naive.keys.toList())

        val copy = detachedCopy(source) as Map<*, *>
        assertEquals(source.keys.toList(), copy.keys.toList())
        assertSameBytes(source)
    }

    @Test
    fun mapCopy_keepsOrderForManyKeys() {
        val source = HashMap<String, Any?>()
        repeat(500) { source["key_$it"] = it }
        val copy = detachedCopy(source) as Map<*, *>
        assertEquals(source.keys.toList(), copy.keys.toList())
        assertSameBytes(source)
    }

    @Test
    fun mapCopy_keepsNullKeysNullValuesAndNonStringKeys() {
        val source = HashMap<Any?, Any?>()
        source[null] = "null key"
        source["nullValue"] = null
        source[42] = "int key"
        source[true] = "bool key"
        val copy = detachedCopy(source) as Map<*, *>
        assertEquals(source, copy)
        assertSameBytes(source)
    }

    @Test
    fun emptyContainers_areCopied() {
        val emptyMap = HashMap<String, Any?>()
        val emptyList = ArrayList<Any?>()
        assertEquals(emptyMap, detachedCopy(emptyMap))
        assertNotSame(emptyMap, detachedCopy(emptyMap))
        assertEquals(emptyList, detachedCopy(emptyList))
        assertNotSame(emptyList, detachedCopy(emptyList))
        assertSameBytes(emptyMap)
        assertSameBytes(emptyList)
    }

    // ---- Lists: any List type becomes an ArrayList with the same bytes -------------------------

    @Test
    fun anyListType_isCopiedInOrder_withTheSameBytes() {
        val lists = listOf<List<Any?>>(
            arrayListOf(1, "a", null),
            LinkedList(listOf(1, "a", null)),
            listOf(1, "a", null),
            Collections.unmodifiableList(arrayListOf(1, "a", null))
        )
        for (list in lists) {
            val copy = detachedCopy(list)
            assertTrue(copy is ArrayList<*>)
            assertEquals(list, copy)
            assertSameBytes(list)
        }
    }

    // ---- Nested trees: every level independent ------------------------------------------------

    @Test
    fun nestedTree_everyLevelIsIndependent() {
        val innerList = arrayListOf<Any?>(1, "two")
        val innerMap = hashMapOf<String, Any?>("deep" to innerList)
        val sdkValue = hashMapOf<String, Any?>("color" to "red", "nested" to innerMap)
        val before = encode(sdkValue)

        val copy = detachedCopy(sdkValue)

        // The SDK changes its own objects at every level.
        sdkValue["size"] = "L"
        innerMap["added"] = true
        innerList.add(3)

        assertArrayEquals(before, encode(copy))
    }

    /** The exact case from the VarCache trace: a sub-variable is defined after the callback. */
    @Test
    fun definingASubVariableAfterTheCallback_doesNotChangeTheCopy() {
        val themeNode = hashMapOf<String, Any?>("color" to "red")
        val payload = CleverTapTypeUtils.MapUtil.addValue("theme", themeNode)
        val copy = detachedCopy(payload)

        themeNode["size"] = "L" // what VarCache.updateValuesAndKinds does for 'theme.size'

        assertEquals(mapOf("theme" to mapOf("color" to "red")), copy)
    }

    @Test
    fun deepNesting_isCopiedWithTheSameBytes() {
        var tree: Any? = "leaf"
        repeat(300) { level -> tree = if (level % 2 == 0) hashMapOf("k" to tree) else arrayListOf(tree) }
        assertSameBytes(tree)
    }

    // ---- The real call order: addValue first, then the copy ------------------------------------

    /**
     * Callers copy AFTER MapUtil.addValue, so addValue keeps deciding on the SDK's original
     * object. For every top-level type, the bytes Dart receives must be unchanged - including
     * types addValue drops (it returns an empty map for them, before and after the copy).
     */
    @Test
    fun addValueThenCopy_givesTheSameBytesForEveryTopLevelType() {
        val topLevelValues = listOf<Any?>(
            null, true, 7, 3_000_000_000L, 6.9, 1.5f, "text", BigInteger("123"),
            hashMapOf("color" to "red"), arrayListOf(1, 2), LinkedList(listOf(1, 2)),
            byteArrayOf(1), intArrayOf(1), longArrayOf(1L), doubleArrayOf(1.0), floatArrayOf(1f)
        )
        for (value in topLevelValues) {
            val payload = CleverTapTypeUtils.MapUtil.addValue("v", value)
            assertArrayEquals(
                "addValue + copy changed the bytes for ${value?.javaClass?.simpleName}",
                encode(payload),
                encode(detachedCopy(payload))
            )
        }
    }

    // ---- Random trees of every producible type -------------------------------------------------

    private fun randomLeaf(random: Random): Any? = when (random.nextInt(12)) {
        0 -> null
        1 -> random.nextBoolean()
        2 -> random.nextInt()
        3 -> random.nextLong()
        4 -> random.nextDouble()
        5 -> "s" + random.nextInt(1000)
        6 -> BigInteger(random.nextLong().toString() + "123456789")
        7 -> ByteArray(random.nextInt(4)) { random.nextInt(256).toByte() }
        8 -> IntArray(random.nextInt(4)) { random.nextInt() }
        9 -> LongArray(random.nextInt(4)) { random.nextLong() }
        10 -> DoubleArray(random.nextInt(4)) { random.nextDouble() }
        else -> FloatArray(random.nextInt(4)) { random.nextFloat() }
    }

    private fun randomTree(random: Random, depth: Int): Any? {
        if (depth == 0 || random.nextInt(3) == 0) {
            return randomLeaf(random)
        }
        return if (random.nextBoolean()) {
            HashMap<Any?, Any?>().apply {
                repeat(random.nextInt(8)) {
                    val key: Any? = if (random.nextInt(5) == 0) random.nextInt(100) else "k${random.nextInt(100)}"
                    put(key, randomTree(random, depth - 1))
                }
            }
        } else {
            ArrayList<Any?>().apply { repeat(random.nextInt(8)) { add(randomTree(random, depth - 1)) } }
        }
    }

    /** Changes every container and array inside [value] in place, the way an SDK change would. */
    private fun mutateEverything(value: Any?) {
        when (value) {
            is MutableMap<*, *> -> {
                value.values.toList().forEach { mutateEverything(it) }
                @Suppress("UNCHECKED_CAST")
                (value as MutableMap<Any?, Any?>)["__mutated__"] = "x"
            }
            is MutableList<*> -> {
                value.toList().forEach { mutateEverything(it) }
                @Suppress("UNCHECKED_CAST")
                (value as MutableList<Any?>).add("x")
            }
            is ByteArray -> if (value.isNotEmpty()) value[0] = (value[0] + 1).toByte()
            is IntArray -> if (value.isNotEmpty()) value[0]++
            is LongArray -> if (value.isNotEmpty()) value[0]++
            is DoubleArray -> if (value.isNotEmpty()) value[0] += 1.0
            is FloatArray -> if (value.isNotEmpty()) value[0] += 1f
        }
    }

    @Test
    fun randomTrees_sameBytes_andIndependentOfLaterChanges() {
        repeat(2_000) { seed ->
            val random = Random(seed)
            val original = randomTree(random, depth = 6)
            val before = encode(original)

            val copy = detachedCopy(original)
            assertArrayEquals("seed $seed: copy changed the bytes", before, encode(copy))

            mutateEverything(original)
            assertArrayEquals("seed $seed: a later SDK change leaked into the copy", before, encode(copy))
        }
    }
}
