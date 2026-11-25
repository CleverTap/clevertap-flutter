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

    /** Stamps the wrapper name and version on [instance]. */
    fun stamp(instance: T, library: CleverTapLibrary)

    fun warn(message: String)
}

/**
 * Finds the instance for an account.
 *
 * - `accountId == null`: the default slot (the AndroidManifest.xml account).
 * - `accountId != null`: that account's instance, or null after ONE warning naming the ID.
 *
 * We keep no map of instances: the SDK has one, so a copy here could only drift. (The SDK can also
 * rebuild an account from the config saved on disk, but only while it has no instance at all:
 * `fromAccountId` -> `createInstanceIfAvailable` when `instances == null`. With a manifest
 * account the default always exists first, so in practice an account exists only once created.)
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

    /**
     * Remembers the wrapper version and stamps it on every account wired so far. Accounts wired
     * later get it in [resolve]. Why both: a launch account (Phase 8) is wired in
     * Application.onCreate, before Dart sends setLibrary. Example: B wired at 0.1 s, setLibrary at
     * 1.5 s: without this loop B never got the version.
     */
    fun rememberLibrary(context: C, name: String?, version: Int) {
        val remembered = CleverTapLibrary(name, version)
        library = remembered
        // A snapshot: an account wired during the loop reads the new library in resolve().
        for (accountId in wiredAccountIds.toList()) {
            source.global(context, accountId)?.let { source.stamp(it, remembered) }
        }
    }

    /**
     * True when this plugin has already resolved [accountId] in this app run. createInstance uses it
     * to warn that a second config for the same account is ignored. An account the host app made in
     * native code without going through the plugin is not counted.
     */
    fun isWired(accountId: String): Boolean = wiredAccountIds.contains(accountId)

    /**
     * The default account's ID, or null when it has not been found (no AndroidManifest.xml
     * account, or not resolved yet). Never calls the SDK: it only reads the saved default, so it
     * is safe from any thread (the event emitter reads it on its worker thread).
     */
    fun defaultAccountId(): String? = defaultInstance?.let { source.accountIdOf(it) }

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
            // The name always; the version once Dart has sent it (else rememberLibrary stamps it).
            if (library != null) stamp(instance, library) else instance.setLibrary("Flutter")
            // The account's own listener, so its events reach Dart tagged with its ID. This is the
            // only attach for a created account. The default account is also re-attached on every
            // engine attach in CleverTapPlugin.setupPlugin, as before.
            CleverTapListenerProxy.attachToInstance(instance)
        }

        @SuppressLint("RestrictedApi")
        override fun stamp(instance: CleverTapAPI, library: CleverTapLibrary) {
            instance.setLibrary("Flutter")
            instance.setCustomSdkVersion(library.name, library.version)
        }

        override fun warn(message: String) {
            Log.w(TAG, message)
        }
    })

    @JvmStatic
    fun resolve(context: Context, accountId: String?): CleverTapAPI? = registry.resolve(context, accountId)

    @JvmStatic
    fun rememberLibrary(context: Context, name: String?, version: Int) =
        registry.rememberLibrary(context, name, version)

    @JvmStatic
    fun isWired(accountId: String): Boolean = registry.isWired(accountId)

    @JvmStatic
    fun defaultAccountId(): String? = registry.defaultAccountId()
}
