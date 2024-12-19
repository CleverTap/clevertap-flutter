package com.clevertap.clevertap_plugin

import com.clevertap.clevertap_plugin.CleverTapEvent.*

object EventNameMapper {
    fun fromCleverTapEvent(event: CleverTapEvent) : String {
        return when (event) {
            CLEVERTAP_PROFILE_DID_INITIALIZE -> "profileDidInitialize"
            CLEVERTAP_PROFILE_SYNC -> "profileDataUpdated"
            CLEVERTAP_IN_APP_NOTIFICATION_DISMISSED -> "inAppNotificationDismissed"
            CLEVERTAP_IN_APP_NOTIFICATION_BEFORE_SHOW -> "beforeShow"
            CLEVERTAP_IN_APP_NOTIFICATION_SHOWED -> "inAppNotificationShow"
            CLEVERTAP_INBOX_DID_INITIALIZE -> "inboxDidInitialize"
            CLEVERTAP_INBOX_MESSAGES_DID_UPDATE -> "inboxMessagesDidUpdate"
            CLEVERTAP_ON_INBOX_BUTTON_CLICK -> "onInboxButtonClick"
            CLEVERTAP_ON_INBOX_MESSAGE_CLICK -> "onInboxMessageClick"
            CLEVERTAP_ON_INAPP_BUTTON_CLICK -> "onInAppButtonClick"
            CLEVERTAP_ON_DISPLAY_UNITS_LOADED -> "onDisplayUnitsLoaded"
            CLEVERTAP_FEATURE_FLAGS_DID_UPDATE -> "featureFlagsUpdated"
            CLEVERTAP_PRODUCT_CONFIG_DID_INITIALIZE -> "productConfigInitialized"
            CLEVERTAP_PRODUCT_CONFIG_DID_FETCH -> "productConfigFetched"
            CLEVERTAP_PRODUCT_CONFIG_DID_ACTIVATE -> "productConfigActivated"
            CLEVERTAP_PUSH_NOTIFICATION_CLICKED -> "pushClickedPayloadReceived"
            CLEVERTAP_ON_PUSH_PERMISSION_RESPONSE -> "pushPermissionResponseReceived"
            CLEVERTAP_ON_VARIABLES_CHANGED -> "onVariablesChanged"
            CLEVERTAP_ON_ONE_TIME_VARIABLES_CHANGED -> "onOneTimeVariablesChanged"
            CLEVERTAP_ON_VALUE_CHANGED -> "onValueChanged"
            CLEVERTAP_CUSTOM_TEMPLATE_PRESENT -> "customTemplatePresent"
            CLEVERTAP_CUSTOM_FUNCTION_PRESENT -> "customFunctionPresent"
            CLEVERTAP_CUSTOM_TEMPLATE_CLOSE -> "customTemplateClose"
            CLEVERTAP_ON_FILE_VALUE_CHANGED -> "onFileValueChanged"
            CLEVERTAP_ON_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING -> "onVariablesChangedAndNoDownloadsPending"
            CLEVERTAP_ONCE_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING -> "onceVariablesChangedAndNoDownloadsPending"
            CLEVERTAP_ON_PUSH_AMP_PAYLOAD_RECEIVED -> "pushAmpPayloadReceived"
            CLEVERTAP_UNKNOWN -> "noop"
        }
    }
}