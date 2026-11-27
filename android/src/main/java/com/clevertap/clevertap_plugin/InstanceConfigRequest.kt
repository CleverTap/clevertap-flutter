package com.clevertap.clevertap_plugin

/**
 * The checked input of `createInstance(config)`, read from the Dart map BEFORE any SDK object is
 * built. Plain data (no Context, no CleverTapAPI), so it is unit tested on the JVM.
 *
 * The Dart side sends a typed `CleverTapInstanceConfig`, so a wrong type cannot come from it. These
 * checks are the backup for a hand-written `invokeMethod('createInstance', ...)`. The rules match the
 * React Native SDK's `InstanceConfigRequest` and the iOS `CleverTapPluginInstanceConfigRequest`:
 *  - a missing key or `null` means "not set", and the SDK keeps its default;
 *  - a value of the wrong type throws [InvalidConfigException] naming the field, which
 *    createInstance turns into an `EINVALID` error.
 *
 * Example: `{"accountId": "ACC-B", "accountToken": "TOK-B", "logLevel": "HIGH"}` is rejected with
 * "logLevel must be one of off, info, debug, verbose" instead of quietly using a default level.
 */
internal class InstanceConfigRequest private constructor(
    val accountId: String,
    val accountToken: String,
    /** Non-blank region, or null for "no region". */
    val region: String?,
    val proxyDomain: String?,
    val spikyProxyDomain: String?,
    val handshakeDomain: String?,
    val identityKeys: List<String>?,
    /** One of [LOG_LEVELS], or null. */
    val logLevel: String?,
    val analyticsOnly: Boolean?,
    val enablePersonalization: Boolean?,
    val disableAppLaunchedEvent: Boolean?,
    /** One of [ENCRYPTION_LEVELS], or null. */
    val encryptionLevel: String?,
    val encryptionInTransit: Boolean?,
    val useCustomCleverTapId: Boolean?,
    /** Non-blank custom ID, or null. Non-null means `useCustomCleverTapId == true`. */
    val cleverTapId: String?,
    val useGoogleAdId: Boolean?,
    val backgroundSync: Boolean?,
    val pushProviders: List<PushProvider>,
) {

    /** One extra push provider. All four parts are required by the SDK's PushType. */
    class PushProvider(
        val type: String,
        val prefKey: String,
        val className: String,
        val messagingSDKClassName: String,
    )

    /** A config value that cannot be accepted. The message names the field. */
    class InvalidConfigException(message: String) : IllegalArgumentException(message)

    companion object {

        /** Accepted `logLevel` words. iOS has no verbose level and uses debug for it. */
        val LOG_LEVELS = listOf("off", "info", "debug", "verbose")

        /** Accepted `encryptionLevel` words: none, PII only, all data. */
        val ENCRYPTION_LEVELS = listOf("none", "medium", "high")

        @Throws(InvalidConfigException::class)
        fun parse(config: Map<*, *>?): InstanceConfigRequest {
            if (config == null) {
                throw InvalidConfigException("a config object is required")
            }
            val accountId = optString(config, "accountId")
            val accountToken = optString(config, "accountToken")
            // Empty is rejected as well as missing: the SDK only checks for null, so an empty ID
            // would create an account whose data goes nowhere while every call looks fine.
            if (accountId.isNullOrBlank() || accountToken.isNullOrBlank()) {
                throw InvalidConfigException("accountId and accountToken must be non-empty strings")
            }

            // The SDK ignores a custom ID without the flag (validation error 514), and the flag
            // without an ID leaves an error device ID. Neither fails loudly, and identity cannot be
            // fixed later, so a mismatch is rejected here.
            val useCustomCleverTapId = optBoolean(config, "useCustomCleverTapId")
            val cleverTapId = optString(config, "cleverTapId")?.takeIf { it.isNotBlank() }
            if ((useCustomCleverTapId == true) != (cleverTapId != null)) {
                throw InvalidConfigException(
                    "cleverTapId and useCustomCleverTapId: true must be given together (or both left" +
                        " out). The SDK ignores an ID without the flag, and the flag without an ID" +
                        " leaves the account with an error device ID"
                )
            }

            // Each platform reads only its own block, so the "ios" block is not read here.
            val android = optMap(config, "android")

            return InstanceConfigRequest(
                accountId = accountId,
                accountToken = accountToken,
                region = optString(config, "region")?.takeIf { it.isNotBlank() },
                proxyDomain = optString(config, "proxyDomain"),
                spikyProxyDomain = optString(config, "spikyProxyDomain"),
                handshakeDomain = optString(config, "handshakeDomain"),
                identityKeys = optStringList(config, "identityKeys"),
                logLevel = optEnum(config, "logLevel", LOG_LEVELS),
                analyticsOnly = optBoolean(config, "analyticsOnly"),
                enablePersonalization = optBoolean(config, "enablePersonalization"),
                disableAppLaunchedEvent = optBoolean(config, "disableAppLaunchedEvent"),
                encryptionLevel = optEnum(config, "encryptionLevel", ENCRYPTION_LEVELS),
                encryptionInTransit = optBoolean(config, "encryptionInTransit"),
                useCustomCleverTapId = useCustomCleverTapId,
                cleverTapId = cleverTapId,
                useGoogleAdId = android?.let { optBoolean(it, "useGoogleAdId", "android.") },
                backgroundSync = android?.let { optBoolean(it, "backgroundSync", "android.") },
                pushProviders = android?.let { parsePushProviders(it) } ?: emptyList(),
            )
        }

        // Typed readers. Missing key or null -> null. Wrong type -> InvalidConfigException.
        // `prefix` names the enclosing block in the message, for example "android.".

        private fun optBoolean(map: Map<*, *>, key: String, prefix: String = ""): Boolean? =
            when (val value = map[key]) {
                null -> null
                is Boolean -> value
                else -> throw InvalidConfigException("$prefix$key must be a boolean")
            }

        private fun optString(map: Map<*, *>, key: String, prefix: String = ""): String? =
            when (val value = map[key]) {
                null -> null
                is String -> value
                else -> throw InvalidConfigException("$prefix$key must be a string")
            }

        private fun optMap(map: Map<*, *>, key: String): Map<*, *>? =
            when (val value = map[key]) {
                null -> null
                is Map<*, *> -> value
                else -> throw InvalidConfigException("$key must be a map")
            }

        private fun optList(map: Map<*, *>, key: String, prefix: String = ""): List<*>? =
            when (val value = map[key]) {
                null -> null
                is List<*> -> value
                else -> throw InvalidConfigException("$prefix$key must be a list")
            }

        /** A string that must be exactly one of [allowed]: "HIGH" or a typo is an error, not a default. */
        private fun optEnum(map: Map<*, *>, key: String, allowed: List<String>): String? {
            val value = optString(map, key) ?: return null
            if (value !in allowed) {
                throw InvalidConfigException("$key must be one of ${allowed.joinToString(", ")}")
            }
            return value
        }

        private fun optStringList(map: Map<*, *>, key: String): List<String>? {
            val list = optList(map, key) ?: return null
            return list.map { it as? String ?: throw InvalidConfigException("$key must be a list of strings") }
        }

        private fun requiredString(map: Map<*, *>, key: String, prefix: String): String =
            optString(map, key, prefix)?.takeIf { it.isNotBlank() }
                ?: throw InvalidConfigException("$prefix$key is required")

        private fun parsePushProviders(android: Map<*, *>): List<PushProvider> {
            val list = optList(android, "pushProviders", "android.") ?: return emptyList()
            return list.mapIndexed { index, item ->
                val name = "android.pushProviders[$index]"
                val provider = item as? Map<*, *> ?: throw InvalidConfigException("$name must be a map")
                PushProvider(
                    type = requiredString(provider, "type", "$name."),
                    prefKey = requiredString(provider, "prefKey", "$name."),
                    className = requiredString(provider, "className", "$name."),
                    messagingSDKClassName = requiredString(provider, "messagingSDKClassName", "$name."),
                )
            }
        }
    }
}
