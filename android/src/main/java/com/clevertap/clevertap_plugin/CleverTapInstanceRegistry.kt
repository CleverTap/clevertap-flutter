package com.clevertap.clevertap_plugin

import android.annotation.SuppressLint
import android.content.Context
import android.util.Log
import com.clevertap.android.sdk.CleverTapAPI
import java.util.Collections
import java.util.concurrent.ConcurrentHashMap

/** The wrapper name and version Dart sends through `setLibrary`, for example ("Flutter", 40300). */
internal data class CleverTapLibrary(val name: String?, val version: Int)

/**
 * Where [InstanceRegistry] gets instances from. Production uses [CleverTapAPI]; tests use fakes,
 * so the lookup logic is tested without mocking SDK statics.
 */
internal interface InstanceSource<C, T : Any> {
    /** The default account (AndroidManifest.xml), or null if the manifest has none. */
    fun default(context: C): T?

    /** The instance for [accountId], or null if the SDK does not know it. */
    fun global(context: C, accountId: String): T?

    fun accountIdOf(instance: T): String?

    /** Runs once per account, the first time it is resolved. */
    fun wire(instance: T, library: CleverTapLibrary?)

    fun warn(message: String)
}

/**
 * Finds the instance for an account.
 *
 * - `accountId == null`: the default slot (the AndroidManifest.xml account).
 * - `accountId != null`: that account's instance, or null after ONE warning naming the ID.
 *
 * We keep no map of instances: the SDK has one, and it can bring an account back from disk on a
 * cold start (`fromAccountId` -> `createInstanceIfAvailable`), so a copy here could only drift.
 * We keep only the default pointer, which accounts are wired, and the wrapper version.
 *
 * Today every caller runs on the main thread (Flutter delivers method calls there). The fields
 * are still safe to read from any thread, because SDK callback threads may reach them later.
 */
internal class InstanceRegistry<C, T : Any>(private val source: InstanceSource<C, T>) {

    // Saved only when found, so a missing manifest account is looked up again next time, as today.
    @Volatile
    private var defaultInstance: T? = null

    // Accounts already wired. Built with newSetFromMap, NOT ConcurrentHashMap.newKeySet():
    // newKeySet needs API 24 (Android 7.0) and crashed Android 6.0 apps in the React Native SDK.
    // newSetFromMap needs API 9 (Android 2.3). Lint flags it only because this plugin's
    // build.gradle sets no minSdk, so lint assumes API 1. Apps cannot go below API 23 (Android 6.0),
    // because the CleverTap SDK's own minSdk is 23. The suppression covers this one field only.
    @SuppressLint("NewApi")
    private val wiredAccountIds: MutableSet<String> =
        Collections.newSetFromMap(ConcurrentHashMap<String, Boolean>())

    // One reference, not two fields: a reader can never see the name from one call and the
    // version from another.
    @Volatile
    private var library: CleverTapLibrary? = null

    fun resolve(context: C, accountId: String?): T? {
        val instance = if (accountId == null) resolveDefault(context) else source.global(context, accountId)
        if (instance == null) {
            source.warn(
                if (accountId == null) {
                    "CleverTap default instance not found. Add your CleverTap account ID and token " +
                        "to AndroidManifest.xml."
                } else {
                    "CleverTap instance not found for accountId: $accountId. Call ignored. " +
                        "Check the ID, and create the instance before using it."
                }
            )
            return null
        }
        val id = source.accountIdOf(instance)
        // add() is true for exactly one caller, so wire runs once per account even across
        // threads. A separate "contains, then add" check would let two threads both wire.
        if (id != null && wiredAccountIds.add(id)) {
            source.wire(instance, library)
        }
        return instance
    }

    /** Remembers the wrapper version, so accounts wired after Dart's setLibrary report it too. */
    fun rememberLibrary(name: String?, version: Int) {
        library = CleverTapLibrary(name, version)
    }

    private fun resolveDefault(context: C): T? {
        defaultInstance?.let { return it }
        val found = source.default(context) ?: return null
        defaultInstance = found
        return found
    }
}

/** The one registry for the process, shared by every Flutter engine. */
internal object CleverTapInstanceRegistry {

    // At most 23 characters: longer tags make Log.isLoggable throw before Android 7.0 (API 24).
    private const val TAG = "CTInstanceRegistry"

    private val registry = InstanceRegistry(object : InstanceSource<Context, CleverTapAPI> {
        override fun default(context: Context): CleverTapAPI? = CleverTapAPI.getDefaultInstance(context)

        override fun global(context: Context, accountId: String): CleverTapAPI? =
            CleverTapAPI.getGlobalInstance(context, accountId)

        override fun accountIdOf(instance: CleverTapAPI): String? = instance.accountId

        @SuppressLint("RestrictedApi")
        override fun wire(instance: CleverTapAPI, library: CleverTapLibrary?) {
            instance.setLibrary("Flutter")
            if (library != null) {
                instance.setCustomSdkVersion(library.name, library.version)
            }
        }

        override fun warn(message: String) {
            Log.w(TAG, message)
        }
    })

    @JvmStatic
    fun resolve(context: Context, accountId: String?): CleverTapAPI? = registry.resolve(context, accountId)

    @JvmStatic
    fun rememberLibrary(name: String?, version: Int) = registry.rememberLibrary(name, version)
}
