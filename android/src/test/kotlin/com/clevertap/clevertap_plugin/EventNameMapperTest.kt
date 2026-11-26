package com.clevertap.clevertap_plugin

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * The strings returned by [EventNameMapper] are the method names sent to Dart on
 * the native_to_dart channel. Changing one silently breaks the Dart callback.
 */
class EventNameMapperTest {

    @Test
    fun `maps every event to the expected Dart callback name`() {
        val expected = mapOf(
            CleverTapEvent.CLEVERTAP_PROFILE_DID_INITIALIZE to "profileDidInitialize",
            CleverTapEvent.CLEVERTAP_PROFILE_SYNC to "profileDataUpdated",
            CleverTapEvent.CLEVERTAP_IN_APP_NOTIFICATION_DISMISSED to "inAppNotificationDismissed",
            CleverTapEvent.CLEVERTAP_IN_APP_NOTIFICATION_BEFORE_SHOW to "beforeShow",
            CleverTapEvent.CLEVERTAP_IN_APP_NOTIFICATION_SHOWED to "inAppNotificationShow",
            CleverTapEvent.CLEVERTAP_INBOX_DID_INITIALIZE to "inboxDidInitialize",
            CleverTapEvent.CLEVERTAP_INBOX_MESSAGES_DID_UPDATE to "inboxMessagesDidUpdate",
            CleverTapEvent.CLEVERTAP_ON_INBOX_BUTTON_CLICK to "onInboxButtonClick",
            CleverTapEvent.CLEVERTAP_ON_INBOX_MESSAGE_CLICK to "onInboxMessageClick",
            CleverTapEvent.CLEVERTAP_ON_INAPP_BUTTON_CLICK to "onInAppButtonClick",
            CleverTapEvent.CLEVERTAP_ON_DISPLAY_UNITS_LOADED to "onDisplayUnitsLoaded",
            CleverTapEvent.CLEVERTAP_FEATURE_FLAGS_DID_UPDATE to "featureFlagsUpdated",
            CleverTapEvent.CLEVERTAP_PRODUCT_CONFIG_DID_INITIALIZE to "productConfigInitialized",
            CleverTapEvent.CLEVERTAP_PRODUCT_CONFIG_DID_FETCH to "productConfigFetched",
            CleverTapEvent.CLEVERTAP_PRODUCT_CONFIG_DID_ACTIVATE to "productConfigActivated",
            CleverTapEvent.CLEVERTAP_PUSH_NOTIFICATION_CLICKED to "pushClickedPayloadReceived",
            CleverTapEvent.CLEVERTAP_ON_PUSH_PERMISSION_RESPONSE to "pushPermissionResponseReceived",
            CleverTapEvent.CLEVERTAP_ON_VARIABLES_CHANGED to "onVariablesChanged",
            CleverTapEvent.CLEVERTAP_ON_ONE_TIME_VARIABLES_CHANGED to "onOneTimeVariablesChanged",
            CleverTapEvent.CLEVERTAP_ON_VALUE_CHANGED to "onValueChanged",
            CleverTapEvent.CLEVERTAP_CUSTOM_TEMPLATE_PRESENT to "customTemplatePresent",
            CleverTapEvent.CLEVERTAP_CUSTOM_FUNCTION_PRESENT to "customFunctionPresent",
            CleverTapEvent.CLEVERTAP_CUSTOM_TEMPLATE_CLOSE to "customTemplateClose",
            CleverTapEvent.CLEVERTAP_ON_FILE_VALUE_CHANGED to "onFileValueChanged",
            CleverTapEvent.CLEVERTAP_ON_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING to "onVariablesChangedAndNoDownloadsPending",
            CleverTapEvent.CLEVERTAP_ONCE_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING to "onceVariablesChangedAndNoDownloadsPending",
            CleverTapEvent.CLEVERTAP_ON_PUSH_AMP_PAYLOAD_RECEIVED to "pushAmpPayloadReceived",
        )
        // The table above must list every real event, so a new event cannot be added unnoticed.
        assertEquals(
            CleverTapEvent.values().filter { it != CleverTapEvent.CLEVERTAP_UNKNOWN }.toSet(),
            expected.keys
        )
        expected.forEach { (event, name) ->
            assertEquals("wrong mapping for $event", name, EventNameMapper.fromCleverTapEvent(event))
        }
    }

    @Test
    fun `unknown event maps to noop`() {
        assertEquals("noop", EventNameMapper.fromCleverTapEvent(CleverTapEvent.CLEVERTAP_UNKNOWN))
    }

    @Test
    fun `every event has a non blank mapping`() {
        CleverTapEvent.values().forEach {
            assertTrue("blank mapping for $it", EventNameMapper.fromCleverTapEvent(it).isNotBlank())
        }
    }

    @Test
    fun `no two real events share a Dart callback name`() {
        val names = CleverTapEvent.values()
            .filter { it != CleverTapEvent.CLEVERTAP_UNKNOWN }
            .map { EventNameMapper.fromCleverTapEvent(it) }
        assertEquals("duplicate Dart names would merge two events", names.size, names.toSet().size)
    }

    @Test
    fun `fromName round trips every event`() {
        CleverTapEvent.values().forEach {
            assertEquals(it, CleverTapEvent.fromName(it.eventName))
        }
    }

    @Test
    fun `fromName returns UNKNOWN for an unrecognised name`() {
        assertEquals(CleverTapEvent.CLEVERTAP_UNKNOWN, CleverTapEvent.fromName("not-an-event"))
        assertNotEquals(CleverTapEvent.CLEVERTAP_PROFILE_SYNC, CleverTapEvent.fromName(""))
    }
}
