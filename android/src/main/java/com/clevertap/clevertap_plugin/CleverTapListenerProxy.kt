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
import org.json.JSONObject

object CleverTapListenerProxy : SyncListener, InAppNotificationListener, CTInboxListener,
    InboxMessageButtonListener, InboxMessageListener, InAppNotificationButtonListener,
    DisplayUnitListener, CTProductConfigListener, CTFeatureFlagsListener,
    CTPushNotificationListener, PushPermissionResponseListener, CTPushAmpListener {

    private const val LOG_TAG = "CleverTapListenerProxy"

    @JvmStatic
    fun attachToInstance(instance: CleverTapAPI) {
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
    }

    // SyncListener
    override fun profileDataUpdated(updates: JSONObject?) {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_PROFILE_SYNC,
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
            params = null
        )
    }

    // CTInboxListener
    override fun inboxMessagesDidUpdate() {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_INBOX_MESSAGES_DID_UPDATE,
            params = null
        )
    }

    // CTInboxListener
    override fun onInboxButtonClick(payload: HashMap<String, String>?) {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_ON_INBOX_BUTTON_CLICK,
            params = payload
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
            params = payload
        )
    }

    // DisplayUnitListener
    override fun onDisplayUnitsLoaded(units: ArrayList<CleverTapDisplayUnit>?) {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_ON_DISPLAY_UNITS_LOADED,
            params = Utils.displayUnitListToArrayList(units)
        )
    }

    // CTProductConfigListener
    override fun onActivated() {
        // passing an empty map
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_PRODUCT_CONFIG_DID_ACTIVATE,
            params = null
        )
    }

    // CTProductConfigListener
    override fun onFetched() {
        // passing an empty map
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_PRODUCT_CONFIG_DID_FETCH,
            params = null
        )
    }

    // CTProductConfigListener
    override fun onInit() {
        // passing an empty map
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_PRODUCT_CONFIG_DID_INITIALIZE,
            params = null
        )
    }

    override fun featureFlagsUpdated() {
        // passing an empty map
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_FEATURE_FLAGS_DID_UPDATE,
            params = null
        )
    }

    // CTPushNotificationListener
    override fun onNotificationClickedPayloadReceived(payload: HashMap<String, Any>?) {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_PUSH_NOTIFICATION_CLICKED,
            params = payload
        )
    }

    // PushPermissionResponseListener
    override fun onPushPermissionResponse(accepted: Boolean) {
        Log.i(LOG_TAG, "onPushPermissionResponse result: $accepted")
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_ON_PUSH_PERMISSION_RESPONSE,
            params = accepted
        )
    }

    override fun onPushAmpPayloadReceived(extras: Bundle?) {
        CleverTapEventEmitter.emit(
            event = CLEVERTAP_ON_PUSH_AMP_PAYLOAD_RECEIVED,
            params = Utils.bundleToMap(extras)
        )
    }
}
