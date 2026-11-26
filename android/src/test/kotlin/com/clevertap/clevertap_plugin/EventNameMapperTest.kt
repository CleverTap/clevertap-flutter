package com.clevertap.clevertap_plugin

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * The strings returned by [EventNameMapper] are the method names the Dart side
 * listens on (native_to_dart channel). Changing one silently breaks callbacks.
 */
class EventNameMapperTest {

    @Test
    fun `maps known events to the Dart callback names`() {
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
            CleverTapEvent.CLEVERTAP_PUSH_NOTIFICATION_CLICKED to "pushClickedPayloadReceived",
            CleverTapEvent.CLEVERTAP_ON_PUSH_PERMISSION_RESPONSE to "pushPermissionResponseReceived",
            CleverTapEvent.CLEVERTAP_ON_PUSH_AMP_PAYLOAD_RECEIVED to "pushAmpPayloadReceived",
            CleverTapEvent.CLEVERTAP_ON_VARIABLES_CHANGED to "onVariablesChanged",
            CleverTapEvent.CLEVERTAP_ON_VALUE_CHANGED to "onValueChanged",
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
