package com.clevertap.clevertap_plugin

import android.content.Context
import android.util.Log
import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.sdk.CleverTapInstanceConfig

/**
 * An extra CleverTap account to create when the app process starts, before Flutter runs.
 *
 * Why: the SDK handles a push when the process starts, long before Dart can call
 * `createInstance`. Example: account B was created from Dart, the app is killed, B's push arrives.
 * Android looks B up to show the push, finds only the default account, and never shows it; iOS drops
 * the tap. Listing B here creates it in `Application.onCreate` / `didFinishLaunching`, so B's push
 * is shown and B's tap reaches B (Dart then uses `CleverTapPlugin.getInstance('B')`).
 *
 * @param config the native config, so every SDK setting is available
 * @param cleverTapID a custom CleverTap ID; used only when `config` enables custom IDs
 */
class CleverTapLaunchConfig @JvmOverloads constructor(
    val config: CleverTapInstanceConfig,
    val cleverTapID: String? = null,
)

/** Creates the launch accounts. Called through [CleverTapPlugin.createLaunchInstances]. */
internal object CleverTapLaunchInstances {

    // At most 23 characters: longer tags make Log.isLoggable throw before Android 7.0 (API 24).
    private const val TAG = "CTLaunchInstances"

    /** Main thread only (CleverTapPlugin.createLaunchInstances makes sure). */
    fun create(context: Context, launchConfigs: List<CleverTapLaunchConfig?>) {
        // Only the default's ID, to skip it below. The default is NOT wired here: wiring sets our
        // push-click listener, which would replace CleverTapApplication's, and a tap that opened
        // the app would then never start the killed-state Dart isolate. The plugin wires the
        // default on engine attach, as before.
        val defaultAccountId = CleverTapAPI.getDefaultInstance(context)?.accountId
        createAll(
            launchConfigs,
            defaultAccountId,
            accountIdOf = { it.config.accountId },
            customIdIgnored = { it.cleverTapID != null && !it.config.enableCustomCleverTapId },
            create = {
                if (it.cleverTapID != null) {
                    CleverTapAPI.instanceWithConfig(context, it.config, it.cleverTapID)
                } else {
                    CleverTapAPI.instanceWithConfig(context, it.config)
                }
            },
            wire = { accountId -> CleverTapInstanceRegistry.resolve(context, accountId) },
            log = { error, message -> if (error) Log.e(TAG, message) else Log.w(TAG, message) },
        )
    }

    /**
     * The per-account rules, without Android, so tests can run them. Returns the accounts created.
     *
     * - A null entry, or one without an account ID: skipped with a warning.
     * - The default account's own ID: skipped with a warning (it already exists, with the
     *   AndroidManifest.xml config).
     * - A custom CleverTap ID while the config does not enable custom IDs: a warning that the SDK
     *   ignores the ID; the account is still created.
     * - Creation that throws or returns null: logged; the next account is still created. Example: a
     *   duplicate custom template name throws inside creation (Phase 7), and must not crash app start.
     */
    fun <L : Any> createAll(
        launchConfigs: List<L?>,
        defaultAccountId: String?,
        accountIdOf: (L) -> String?,
        customIdIgnored: (L) -> Boolean,
        create: (L) -> Any?,
        wire: (String) -> Unit,
        log: (error: Boolean, message: String) -> Unit,
    ): List<String> {
        val created = mutableListOf<String>()
        for (launchConfig in launchConfigs) {
            if (launchConfig == null) {
                log(false, "A launch config is null; skipped.")
                continue
            }
            val accountId = try {
                accountIdOf(launchConfig)
            } catch (t: Throwable) {
                null
            }
            if (accountId.isNullOrEmpty()) {
                log(false, "A launch config has no account ID; skipped.")
                continue
            }
            if (accountId == defaultAccountId) {
                log(false, "Launch config $accountId is the default account (AndroidManifest.xml), which already exists; skipped.")
                continue
            }
            try {
                if (customIdIgnored(launchConfig)) {
                    log(false, "Launch config $accountId has a CleverTap ID but its config does not enable custom IDs; the SDK will ignore the ID.")
                }
                if (create(launchConfig) == null) {
                    log(true, "Launch config $accountId: the SDK created no instance.")
                    continue
                }
                // Listener proxy and library stamp, exactly as for a Dart createInstance.
                wire(accountId)
                created.add(accountId)
            } catch (t: Throwable) {
                log(true, "Launch config $accountId could not be created; the other accounts continue: $t")
            }
        }
        return created
    }
}
