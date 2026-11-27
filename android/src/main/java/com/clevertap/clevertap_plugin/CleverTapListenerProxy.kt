package com.clevertap.clevertap_plugin

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import com.clevertap.android.sdk.CTFeatureFlagsListener
import com.clevertap.android.sdk.CTInboxListener
import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.sdk.InAppNotificationButtonListener
import com.clevertap.android.sdk.InAppNotificationListener
import com.clevertap.android.sdk.InboxMessageButtonListener
import com.clevertap.android.sdk.InboxMessageListener
import com.clevertap.android.sdk.PushPermissionResponseListener
import com.clevertap.android.sdk.SyncListener
import com.clevertap.android.sdk.displayunits.DisplayUnitListener
import com.clevertap.android.sdk.displayunits.model.CleverTapDisplayUnit
import com.clevertap.android.sdk.inapp.CTInAppNotification
import com.clevertap.android.sdk.inbox.CTInboxMessage
import com.clevertap.android.sdk.isNotNullAndBlank
import com.clevertap.android.sdk.product_config.CTProductConfigListener
import com.clevertap.android.sdk.pushnotification.CTPushNotificationListener
import com.clevertap.android.sdk.pushnotification.amp.CTPushAmpListener
import com.clevertap.clevertap_plugin.CleverTapEvent.*
import java.util.concurrent.ConcurrentHashMap
import org.json.JSONObject

/**
 * Kept for source compatibility: [attachToInstance] is public API. The object itself is no longer
 * attached to any instance. Each account gets its own [AccountListenerProxy], so its events reach
 * Dart tagged with its account. Used directly as a listener, this object reports its events with
 * an unknown account, which Dart routes to the default handlers, as before.
 */
object CleverTapListenerProxy : AccountListenerProxy(null) {

    private const val LOG_TAG = "CleverTapListenerProxy"

    // ⚠️ The ONLY strong reference to each account's proxy. The SDK holds four listeners weakly
    // (Android SDK 8.5.0 CallbackManager.java:31, 37, 52, 59: display units, in-app button, feature
    // flags, product config). Without this map an account's proxy could be garbage-collected and
    // those four callbacks would stop silently. Entries live for the app's lifetime, like the
    // SDK's own instances. ConcurrentHashMap.putIfAbsent works on every API level.
    private val proxies = ConcurrentHashMap<String, AccountListenerProxy>()

    /**
     * Attaches this account's proxy to [instance]: one proxy per account, the same object every
     * time. Safe to call again for the same account.
     */
    @JvmStatic
    fun attachToInstance(instance: CleverTapAPI) {
        val accountId = instance.accountId
        if (accountId == null) {
            Log.e(LOG_TAG, "Cannot attach listeners: the instance has no accountId")
            return
        }
        val proxy = proxyFor(accountId)
        // The unregister + register pair in attachTo is not atomic. Two overlapping attaches of one
        // account could both unregister (nothing there) and both register, and one push-permission
        // tap would then reach Dart twice. Today every attach runs on the main thread; the lock
        // per account keeps it correct if that changes. It guards only listener assignments.
        synchronized(proxy) {
            proxy.attachTo(instance)
        }
    }

    /**
     * Sends [instance]'s Push Amp payloads to Dart. Called only when Dart sets a Push Amp handler
     * for this account, never in [attachToInstance].
     *
     * Why opt-in: with this listener set, the SDK no longer draws Push Amp notifications; it only
     * hands the payload over, and the app must draw it (Android SDK 8.6.0
     * PushAmpResponse.java:113-118). Native apps opt in by calling setCTPushAmpListener themselves.
     * Example: an app with no Push Amp handler keeps "50% off today" drawn by the SDK, as in 4.4.0.
     * Set for every account, the notification was drawn by nobody.
     */
    @JvmStatic
    fun attachPushAmpListener(instance: CleverTapAPI) {
        val accountId = instance.accountId
        if (accountId == null) {
            Log.e(LOG_TAG, "Cannot attach the Push Amp listener: the instance has no accountId")
            return
        }
        instance.setCTPushAmpListener(proxyFor(accountId))
    }

    /** The proxy for [accountId]: created once, then the same object every time. */
    internal fun proxyFor(accountId: String): AccountListenerProxy =
        proxies[accountId] ?: AccountListenerProxy(accountId).let { created ->
            proxies.putIfAbsent(accountId, created) ?: created
        }
}

/**
 * Forwards one account's SDK callbacks to Dart, tagged with [accountId] (null = unknown account).
 * Example: account B's profileDidInitialize reaches Dart as
 * `{"__ctEnvelope": true, "accountId": "B", "isDefault": false, "payload": "<CleverTap ID>"}`.
 */
open class AccountListenerProxy internal constructor(private val accountId: String?) : SyncListener,
    InAppNotificationListener, CTInboxListener, InboxMessageButtonListener, InboxMessageListener,
    InAppNotificationButtonListener, DisplayUnitListener, CTProductConfigListener,
    CTFeatureFlagsListener, CTPushNotificationListener, PushPermissionResponseListener,
    CTPushAmpListener {

    private val logTag = "CleverTapListenerProxy"

    internal fun attachTo(instance: CleverTapAPI) {
        instance.unregisterPushPermissionNotificationResponseListener(this)
        instance.registerPushPermissionNotificationResponseListener(this)
        instance.ctPushNotificationListener = this
        instance.inAppNotificationListener = this
        instance.syncListener = this
        instance.ctNotificationInboxListener = this
        instance.setInboxMessageButtonListener(this)
        instance.setCTInboxMessageListener(this)
        instance.setInAppNotificationButtonListener(this)
        instance.setDisplayUnitListener(this)
        instance.setCTProductConfigListener(this)
        instance.setCTFeatureFlagsListener(this)
        // ⚠️ NOT the Push Amp listener: see CleverTapListenerProxy.attachPushAmpListener.
    }

    // SyncListener
    override fun profileDataUpdated(updates: JSONObject?) {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_PROFILE_SYNC,
            accountId = accountId,
            params = Utils.jsonToMap(updates)
        )
    }

    // SyncListener
    override fun profileDidInitialize(cleverTapID: String?) {
        // we set it to null as this check was in invokeMethodOnUiThread in old code,
        // we can check and remove if not needed
        val id = if (cleverTapID.isNotNullAndBlank()) {
            cleverTapID
        } else {
            null
        }

        CleverTapEventEmitter.emit(
            event = CLEVERTAP_PROFILE_DID_INITIALIZE,
            accountId = accountId,
            params = id
        )
    }

    // InAppNotificationListener
    override fun beforeShow(extras: MutableMap<String, Any>?): Boolean {
        //no-op
        return true
    }

    // InAppNotificationListener
    @SuppressLint("RestrictedApi")
    override fun onShow(ctInAppNotification: CTInAppNotification) {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_IN_APP_NOTIFICATION_SHOWED,
            accountId = accountId,
            params = Utils.jsonToMap(ctInAppNotification.jsonDescription)
        )
    }

    // InAppNotificationListener
    override fun onDismissed(
        extras: MutableMap<String, Any>?,
        actionExtras: MutableMap<String, Any>?
    ) {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_IN_APP_NOTIFICATION_DISMISSED,
            accountId = accountId,
            params = mapOf(
                "extras" to extras,
                "actionExtras" to actionExtras
            )
        )
    }

    // CTInboxListener
    override fun inboxDidInitialize() {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_INBOX_DID_INITIALIZE,
            accountId = accountId,
            params = null
        )
    }

    // CTInboxListener
    override fun inboxMessagesDidUpdate() {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_INBOX_MESSAGES_DID_UPDATE,
            accountId = accountId,
            params = null
        )
    }

    // CTInboxListener
    override fun onInboxButtonClick(payload: HashMap<String, String>?) {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_ON_INBOX_BUTTON_CLICK,
            accountId = accountId,
            // Copy: the map belongs to the native SDK and the emitter reads it later, on its
            // worker thread. Keys and values are Strings, so a shallow copy is a full copy.
            params = payload?.let { HashMap(it) }
        )
    }

    // CTInboxListener
    override fun onInboxItemClicked(
        message: CTInboxMessage,
        contentPageIndex: Int,
        buttonIndex: Int
    ) {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_ON_INBOX_MESSAGE_CLICK,
            accountId = accountId,
            params = mapOf(
                "data" to Utils.jsonToMap(message.data),
                "contentPageIndex" to contentPageIndex,
                "buttonIndex" to buttonIndex,
            )
        )
    }

    // InAppNotificationButtonListener
    override fun onInAppButtonClick(payload: HashMap<String, String>?) {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_ON_INAPP_BUTTON_CLICK,
            accountId = accountId,
            // Copy: the map belongs to the native SDK and the emitter reads it later, on its
            // worker thread. Keys and values are Strings, so a shallow copy is a full copy.
            params = payload?.let { HashMap(it) }
        )
    }

    // DisplayUnitListener
    override fun onDisplayUnitsLoaded(units: ArrayList<CleverTapDisplayUnit>?) {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_ON_DISPLAY_UNITS_LOADED,
            accountId = accountId,
            params = Utils.displayUnitListToArrayList(units)
        )
    }

    // CTProductConfigListener
    override fun onActivated() {
        // passing an empty map
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_PRODUCT_CONFIG_DID_ACTIVATE,
            accountId = accountId,
            params = null
        )
    }

    // CTProductConfigListener
    override fun onFetched() {
        // passing an empty map
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_PRODUCT_CONFIG_DID_FETCH,
            accountId = accountId,
            params = null
        )
    }

    // CTProductConfigListener
    override fun onInit() {
        // passing an empty map
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_PRODUCT_CONFIG_DID_INITIALIZE,
            accountId = accountId,
            params = null
        )
    }

    override fun featureFlagsUpdated() {
        // passing an empty map
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_FEATURE_FLAGS_DID_UPDATE,
            accountId = accountId,
            params = null
        )
    }

    // CTPushNotificationListener
    override fun onNotificationClickedPayloadReceived(payload: HashMap<String, Any>?) {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_PUSH_NOTIFICATION_CLICKED,
            accountId = accountId,
            params = payload
        )
    }

    // PushPermissionResponseListener
    override fun onPushPermissionResponse(accepted: Boolean) {
        Log.i(logTag, "onPushPermissionResponse result: $accepted")
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_ON_PUSH_PERMISSION_RESPONSE,
            accountId = accountId,
            params = accepted
        )
    }

    override fun onPushAmpPayloadReceived(extras: Bundle?) {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_ON_PUSH_AMP_PAYLOAD_RECEIVED,
            accountId = accountId,
            params = Utils.bundleToMap(extras)
        )
    }
}
