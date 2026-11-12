package com.clevertap.clevertap_plugin

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertSame
import org.junit.Assert.assertTrue
import org.junit.Test
import java.util.Collections
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CountDownLatch
import java.util.concurrent.atomic.AtomicInteger
import kotlin.concurrent.thread

/**
 * Tests the account lookup logic with plain fake objects, so no SDK statics need mocking.
 * The context type is Unit: the fakes ignore it.
 */
class InstanceRegistryTest {

    private class FakeInstance(val accountId: String?)

    private class FakeSource(
        var defaultInstance: FakeInstance? = null,
        val known: MutableMap<String, FakeInstance> = ConcurrentHashMap(),
    ) : InstanceSource<Unit, FakeInstance> {
        val defaultCalls = AtomicInteger()
        val wired: MutableList<Pair<String?, CleverTapLibrary?>> =
            Collections.synchronizedList(mutableListOf())
        val warnings: MutableList<String> = Collections.synchronizedList(mutableListOf())

        override fun default(context: Unit): FakeInstance? {
            defaultCalls.incrementAndGet()
            return defaultInstance
        }

        override fun global(context: Unit, accountId: String): FakeInstance? = known[accountId]
        override fun accountIdOf(instance: FakeInstance): String? = instance.accountId
        override fun wire(instance: FakeInstance, library: CleverTapLibrary?) {
            wired.add(instance.accountId to library)
        }

        override fun warn(message: String) {
            warnings.add(message)
        }
    }

    @Test
    fun nullId_returnsDefault_andCachesIt() {
        val d = FakeInstance("D")
        val source = FakeSource(defaultInstance = d)
        val registry = InstanceRegistry(source)

        repeat(5) { assertSame(d, registry.resolve(Unit, null)) }

        assertEquals("default() must be asked once, then cached", 1, source.defaultCalls.get())
        assertTrue(source.warnings.isEmpty())
    }

    @Test
    fun nullId_defaultMissing_retriesOnNextCall_andWarnsEachTime() {
        val source = FakeSource(defaultInstance = null)
        val registry = InstanceRegistry(source)

        assertNull(registry.resolve(Unit, null))
        assertNull(registry.resolve(Unit, null))
        assertEquals("a missing default must be asked again, as today", 2, source.defaultCalls.get())
        assertEquals(2, source.warnings.size)
        assertTrue(source.warnings[0], source.warnings[0].contains("AndroidManifest.xml"))

        // The account appears later (for example the manifest values were read late): picked up.
        val d = FakeInstance("D")
        source.defaultInstance = d
        assertSame(d, registry.resolve(Unit, null))
        assertEquals(listOf<Pair<String?, CleverTapLibrary?>>("D" to null), source.wired)
    }

    @Test
    fun knownId_returnsThatInstance() {
        val b = FakeInstance("B")
        val source = FakeSource(known = ConcurrentHashMap(mapOf("B" to b)))
        val registry = InstanceRegistry(source)

        assertSame(b, registry.resolve(Unit, "B"))
        assertEquals("an account ID must never touch the default slot", 0, source.defaultCalls.get())
        assertTrue(source.warnings.isEmpty())
    }

    @Test
    fun unknownId_returnsNull_andWarnsWithTheId() {
        val source = FakeSource()
        val registry = InstanceRegistry(source)

        assertNull(registry.resolve(Unit, "TYPO-123"))

        assertEquals(1, source.warnings.size)
        assertTrue(source.warnings[0], source.warnings[0].contains("TYPO-123"))
        assertTrue("nothing to wire", source.wired.isEmpty())
    }

    @Test
    fun wire_runsOncePerAccount_evenAcrossManyResolves() {
        val source = FakeSource(
            defaultInstance = FakeInstance("A"),
            known = ConcurrentHashMap(mapOf("B" to FakeInstance("B"))),
        )
        val registry = InstanceRegistry(source)

        repeat(1_000) {
            registry.resolve(Unit, null)
            registry.resolve(Unit, "B")
        }

        assertEquals(listOf("A", "B"), source.wired.map { it.first })
    }

    @Test
    fun defaultResolvedById_isWiredOnlyOnce() {
        val d = FakeInstance("D")
        val source = FakeSource(defaultInstance = d, known = ConcurrentHashMap(mapOf("D" to d)))
        val registry = InstanceRegistry(source)

        assertSame(d, registry.resolve(Unit, null))
        assertSame(d, registry.resolve(Unit, "D"))

        assertEquals(1, source.wired.size)
    }

    @Test
    fun rememberedLibrary_isStampedOnLaterAccounts() {
        val source = FakeSource(
            defaultInstance = FakeInstance("D"),
            known = ConcurrentHashMap(mapOf("B" to FakeInstance("B"))),
        )
        val registry = InstanceRegistry(source)

        registry.resolve(Unit, null) // wired before Dart's setLibrary arrives: no version yet
        registry.rememberLibrary("Flutter", 40300)
        registry.resolve(Unit, "B") // wired after: gets the version

        assertEquals(
            listOf("D" to null, "B" to CleverTapLibrary("Flutter", 40300)),
            source.wired,
        )
    }

    @Test
    fun instanceWithoutAccountId_isReturned_butNotWired() {
        // Defensive: the SDK always has an account ID, but a null must not crash or wire twice.
        val odd = FakeInstance(null)
        val source = FakeSource(defaultInstance = odd)
        val registry = InstanceRegistry(source)

        assertSame(odd, registry.resolve(Unit, null))
        assertTrue(source.wired.isEmpty())
    }

    @Test
    fun concurrentResolves_wireExactlyOnce() {
        val ids = (1..20).map { "ACC-$it" }
        val source = FakeSource(
            defaultInstance = FakeInstance("DEF"),
            known = ConcurrentHashMap(ids.associateWith { FakeInstance(it) }),
        )
        val registry = InstanceRegistry(source)
        val start = CountDownLatch(1)
        val errors = AtomicInteger()

        val threads = (0 until 8).map { t ->
            thread {
                start.await()
                try {
                    repeat(10_000) { i ->
                        val id = if (i % 21 == 0) null else ids[(i + t) % ids.size]
                        if (registry.resolve(Unit, id) == null) errors.incrementAndGet()
                    }
                } catch (e: Throwable) {
                    errors.incrementAndGet()
                }
            }
        }
        start.countDown()
        threads.forEach { it.join() }

        assertEquals(0, errors.get())
        val wiredIds = source.wired.map { it.first }
        assertEquals("each account wired exactly once: $wiredIds", 21, wiredIds.size)
        assertEquals((ids + "DEF").toSet(), wiredIds.toSet())
    }
}
