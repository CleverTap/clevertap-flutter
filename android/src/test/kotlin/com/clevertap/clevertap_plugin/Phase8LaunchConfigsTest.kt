package com.clevertap.clevertap_plugin

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/** Phase 8: the per-account rules of the launch loop, with fake configs instead of the SDK. */
class Phase8LaunchConfigsTest {

    private data class Fake(val accountId: String?, val cleverTapID: String? = null, val customIds: Boolean = false)

    private class Run(
        configs: List<Fake?>,
        defaultAccountId: String? = "DEF",
        failOn: Set<String> = emptySet(),
        nullOn: Set<String> = emptySet(),
    ) {
        val createdBySdk = mutableListOf<String>()
        val wired = mutableListOf<String>()
        val warnings = mutableListOf<String>()
        val errors = mutableListOf<String>()
        val result = CleverTapLaunchInstances.createAll(
            configs,
            defaultAccountId,
            accountIdOf = { it.accountId },
            customIdIgnored = { it.cleverTapID != null && !it.customIds },
            create = {
                val id = it.accountId!!
                if (id in failOn) throw IllegalStateException("CustomTemplate with a name \"Spin\" is already registered.")
                createdBySdk.add(id)
                if (id in nullOn) null else Any()
            },
            wire = { wired.add(it) },
            log = { error, message -> if (error) errors.add(message) else warnings.add(message) },
        )
    }

    @Test
    fun eachAccount_isCreatedThenWired_inOrder() {
        val run = Run(listOf(Fake("B"), Fake("C")))
        assertEquals(listOf("B", "C"), run.createdBySdk)
        assertEquals(listOf("B", "C"), run.wired)
        assertEquals(listOf("B", "C"), run.result)
        assertTrue(run.warnings.isEmpty() && run.errors.isEmpty())
    }

    // A duplicate template name throws inside creation. Before: an uncaught throw in
    // Application.onCreate crashes the app. Now: B is logged and skipped, C is still created.
    @Test
    fun oneAccountThrows_theNextIsStillCreated() {
        val run = Run(listOf(Fake("B"), Fake("C")), failOn = setOf("B"))
        assertEquals(listOf("C"), run.result)
        assertEquals(listOf("C"), run.wired)
        assertEquals(1, run.errors.size)
        assertTrue(run.errors[0].contains("B") && run.errors[0].contains("already registered"))
    }

    @Test
    fun theSdkReturnsNull_notWired_nextContinues() {
        val run = Run(listOf(Fake("B"), Fake("C")), nullOn = setOf("B"))
        assertEquals(listOf("C"), run.result)
        assertEquals(listOf("C"), run.wired)
        assertEquals(1, run.errors.size)
    }

    @Test
    fun theDefaultAccountsOwnId_isSkipped() {
        val run = Run(listOf(Fake("DEF"), Fake("B")))
        assertEquals(listOf("B"), run.createdBySdk)
        assertTrue(run.warnings.single().contains("DEF"))
    }

    @Test
    fun noDefaultAccount_everyAccountIsCreated() {
        val run = Run(listOf(Fake("B")), defaultAccountId = null)
        assertEquals(listOf("B"), run.result)
    }

    @Test
    fun nullOrEmptyEntries_areSkipped_withoutThrowing() {
        val run = Run(listOf(null, Fake(null), Fake(""), Fake("B")))
        assertEquals(listOf("B"), run.result)
        assertEquals(3, run.warnings.size)
    }

    @Test
    fun customIdWithoutCustomIdsEnabled_warns_butStillCreates() {
        val run = Run(listOf(Fake("B", cleverTapID = "my-id", customIds = false), Fake("C", cleverTapID = "id-c", customIds = true)))
        assertEquals(listOf("B", "C"), run.result)
        assertTrue(run.warnings.single().contains("B"))
    }
}
