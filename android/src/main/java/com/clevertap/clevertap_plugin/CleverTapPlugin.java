package com.clevertap.clevertap_plugin;

import android.app.Activity;
import android.content.Context;
import android.location.Location;
import android.util.Log;

import com.clevertap.android.sdk.CTExperimentsListener;
import com.clevertap.android.sdk.CTInboxListener;
import com.clevertap.android.sdk.CTInboxMessage;
import com.clevertap.android.sdk.CTInboxStyleConfig;
import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.android.sdk.EventDetail;
import com.clevertap.android.sdk.InAppNotificationButtonListener;
import com.clevertap.android.sdk.InAppNotificationListener;
import com.clevertap.android.sdk.InboxMessageButtonListener;
import com.clevertap.android.sdk.SyncListener;
import com.clevertap.android.sdk.UTMDetail;
import com.clevertap.android.sdk.displayunits.DisplayUnitListener;
import com.clevertap.android.sdk.displayunits.model.CleverTapDisplayUnit;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.flutter.plugin.common.MethodCall;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugin.common.MethodChannel.MethodCallHandler;
import io.flutter.plugin.common.MethodChannel.Result;
import io.flutter.plugin.common.PluginRegistry;
import io.flutter.plugin.common.PluginRegistry.Registrar;

/**
 * CleverTapPlugin
 */
public class CleverTapPlugin implements MethodCallHandler, SyncListener,
        InAppNotificationListener, CTInboxListener,
        CTExperimentsListener, InAppNotificationButtonListener,
        InboxMessageButtonListener, DisplayUnitListener {

    private static final String TAG = "CleverTapPlugin";
    private static final String ERROR_MSG = "CleverTap Instance is not initialized";
    private static final String ERROR_MSG_ID = "Message Id is null or empty";
    private static final String ERROR_IOS = " method is only applicable for iOS";
    private CleverTapAPI cleverTapAPI;
    private Context context;
    private MethodChannel channel;
    private PluginRegistry.Registrar flutterRegistrar;

    private CleverTapPlugin(Activity activity) {
        this.context = activity.getApplicationContext();
        this.cleverTapAPI = CleverTapAPI.getDefaultInstance(activity.getApplicationContext());
        if (this.cleverTapAPI != null) {
            this.cleverTapAPI.setCTExperimentsListener(this);
            this.cleverTapAPI.setCTNotificationInboxListener(this);
            this.cleverTapAPI.setInboxMessageButtonListener(this);
            this.cleverTapAPI.setInAppNotificationButtonListener(this);
            this.cleverTapAPI.setInAppNotificationListener(this);
            this.cleverTapAPI.setSyncListener(this);
            this.cleverTapAPI.setDisplayUnitListener(this);
            this.cleverTapAPI.setLibrary("Flutter");
        }
    }

    /**
     * Plugin registration.
     */
    public static void registerWith(Registrar registrar) {
        CleverTapPlugin plugin = new CleverTapPlugin(registrar.activity());
        plugin.channel = new MethodChannel(registrar.messenger(), "clevertap_plugin");
        plugin.channel.setMethodCallHandler(plugin);
        plugin.flutterRegistrar = registrar;
    }

    private boolean isCleverTapNotNull(CleverTapAPI cleverTapAPI) {
        return cleverTapAPI != null;
    }

    @Override
    public void onMethodCall(MethodCall call, Result result) {
        switch (call.method) {

            case "setDebugLevel": {
                int debugLevelValue = call.argument("debugLevel");
                CleverTapAPI.setDebugLevel(debugLevelValue);
                result.success(null);
                break;
            }
            // Push Methods
            case "setPushToken": {
                String token = call.argument("token");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.pushFcmRegistrationId(token, true);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            case "createNotification": {
                JSONObject extras = call.argument("extras");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    try {
                        CleverTapAPI.createNotification(context, Utils.jsonToBundle(extras));
                    } catch (JSONException e) {
                        result.error(TAG, "Unable to render notification due to JSONException - " + e.getLocalizedMessage(), null);
                    }
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            //Baidu/Xiaomi/Huawei push notifications

            case "setXiaomiPushToken": {
                String token = call.argument("token");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.pushXiaomiRegistrationId(token, true);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            case "setBaiduPushToken": {
                String token = call.argument("token");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.pushBaiduRegistrationId(token, true);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            case "setHuaweiPushToken": {
                String token = call.argument("token");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.pushHuaweiRegistrationId(token, true);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            //UI Editor connection
            case "setUIEditorConnectionEnabled": {
                boolean enabled = call.argument("value");
                CleverTapAPI.setUIEditorConnectionEnabled(enabled);
                result.success(null);
                break;
            }

            //Notification channel/group methods for Android O
            case "createNotificationChannel": {
                String channelId = call.argument("channelId");
                String channelName = call.argument("channelName");
                String channelDescription = call.argument("channelDescription");
                int importance = call.argument("importance");
                boolean showBadge = call.argument("showBadge");
                CleverTapAPI.createNotificationChannel(context, channelId, channelName, channelDescription, importance, showBadge);
                result.success(null);
                break;
            }
            case "createNotificationChannelWithSound": {
                String channelId = call.argument("channelId");
                String channelName = call.argument("channelName");
                String channelDescription = call.argument("channelDescription");
                int importance = call.argument("importance");
                boolean showBadge = call.argument("showBadge");
                String sound = call.argument("sound");
                CleverTapAPI.createNotificationChannel(context, channelId, channelName, channelDescription, importance, showBadge, sound);
                result.success(null);
                break;
            }
            case "createNotificationChannelWithGroupId": {
                String channelId = call.argument("channelId");
                String channelName = call.argument("channelName");
                String channelDescription = call.argument("channelDescription");
                int importance = call.argument("importance");
                String groupId = call.argument("groupId");
                boolean showBadge = call.argument("showBadge");
                CleverTapAPI.createNotificationChannel(context, channelId, channelName, channelDescription, importance, groupId, showBadge);
                result.success(null);
                break;
            }
            case "createNotificationChannelWithGroupIdAndSound": {
                String channelId = call.argument("channelId");
                String channelName = call.argument("channelName");
                String channelDescription = call.argument("channelDescription");
                int importance = call.argument("importance");
                String groupId = call.argument("groupId");
                boolean showBadge = call.argument("showBadge");
                String sound = call.argument("sound");
                CleverTapAPI.createNotificationChannel(context, channelId, channelName, channelDescription, importance, groupId, showBadge, sound);
                result.success(null);
                break;
            }
            case "createNotificationChannelGroup": {
                String groupId = call.argument("groupId");
                String groupName = call.argument("groupName");
                CleverTapAPI.createNotificationChannelGroup(context, groupId, groupName);
                result.success(null);
                break;
            }
            case "deleteNotificationChannel": {
                String channelId = call.argument("channelId");
                CleverTapAPI.deleteNotificationChannel(context, channelId);
                result.success(null);
                break;
            }
            case "deleteNotificationChannelGroup": {
                String groupId = call.argument("groupId");
                CleverTapAPI.deleteNotificationChannelGroup(context, groupId);
                result.success(null);
                break;
            }

            //Enables tracking opt out for the currently active user.
            case "setOptOut": {
                boolean value = call.argument("value");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.setOptOut(value);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            //Sets the SDK to offline mode
            case "setOffline": {
                boolean value = call.argument("value");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.setOffline(value);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            //Enables the reporting of device network-related information, including IP address.  This reporting is disabled by default.
            case "enableDeviceNetworkInfoReporting": {
                boolean value = call.argument("value");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.enableDeviceNetworkInfoReporting(value);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            // Personalization
            case "enablePersonalization": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.enablePersonalization();
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "disablePersonalization": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.disablePersonalization();
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            // Event API
            case "recordScreenView": {
                String name = call.argument("screenName");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.recordScreen(name);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "recordEvent": {
                Map<String, Object> eventData = call.argument("eventData");
                String eventName = call.argument("eventName");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    this.cleverTapAPI.pushEvent(eventName, eventData);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "recordChargedEvent": {
                HashMap<String, Object> chargeDetails = call.argument("chargeDetails");
                ArrayList<HashMap<String, Object>> items = call.argument("items");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.pushChargedEvent(chargeDetails, items);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "eventGetFirstTime": {
                String eventName = call.argument("eventName");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getFirstTime(eventName));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "eventGetLastTime": {
                String eventName = call.argument("eventName");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getLastTime(eventName));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "eventGetOccurrences": {
                String eventName = call.argument("eventName");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getCount(eventName));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "eventGetDetail": {
                String eventName = call.argument("eventName");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    EventDetail eventDetail = cleverTapAPI.getDetails(eventName);
                    result.success(Utils.eventDetailToMap(eventDetail));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getEventHistory": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(Utils.historyEventDetailToMap(cleverTapAPI.getHistory()));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            //Profile API

            case "setLocation": {
                double lat = call.argument("latitude");
                double lon = call.argument("longitude");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    Location location = new Location("CleverTapFlutter");
                    location.setLatitude(lat);
                    location.setLongitude(lon);
                    cleverTapAPI.setLocation(location);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "profileGetCleverTapAttributionIdentifier": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getCleverTapAttributionIdentifier());
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "profileGetCleverTapID": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getCleverTapID());
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "onUserLogin": {
                Map<String, Object> profile = call.argument("profile");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.onUserLogin(profile);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "profileSet": {
                Map<String, Object> profile = call.argument("profile");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.pushProfile(profile);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "profileSetGraphUser": {
                Map<String, Object> profileMap = call.argument("profile");
                JSONObject profile = Utils.mapToJSONObject(profileMap);
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.pushFacebookUser(profile);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "profileGetProperty": {
                String propertyName = call.argument("propertyName");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getProperty(propertyName));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "profileRemoveValueForKey": {
                String key = call.argument("key");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.removeValueForKey(key);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "profileSetMultiValues": {
                String key = call.argument("key");
                ArrayList<String> values = call.argument("values");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.setMultiValuesForKey(key, values);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "profileAddMultiValue": {
                String key = call.argument("key");
                String value = call.argument("value");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.addMultiValueForKey(key, value);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "profileAddMultiValues": {
                String key = call.argument("key");
                ArrayList<String> values = call.argument("values");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.addMultiValuesForKey(key, values);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "profileRemoveMultiValue": {
                String key = call.argument("key");
                String value = call.argument("value");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.removeMultiValueForKey(key, value);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "profileRemoveMultiValues": {
                String key = call.argument("key");
                ArrayList<String> values = call.argument("values");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.removeMultiValuesForKey(key, values);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            //Session API

            case "pushInstallReferrer": {
                String source = call.argument("source");
                String medium = call.argument("medium");
                String campaign = call.argument("campaign");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.pushInstallReferrer(source, medium, campaign);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "sessionGetTimeElapsed": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getTimeElapsed());
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "sessionGetTotalVisits": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getTotalVisits());
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "sessionGetScreenCount": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getScreenCount());
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "sessionGetPreviousVisitTime": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getPreviousVisitTime());
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "sessionGetUTMDetails": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    UTMDetail detail = cleverTapAPI.getUTMDetails();
                    result.success(Utils.utmDetailsToMap(detail));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            //App Inbox Methods
            case "initializeInbox": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.initializeInbox();
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "showInbox": {
                Map<String, Object> styleConfigMap = call.argument("styleConfig");
                JSONObject styleConfigJson = Utils.mapToJSONObject(styleConfigMap);
                CTInboxStyleConfig styleConfig = new CTInboxStyleConfig();
                if (styleConfigJson != null) {
                    styleConfig = Utils.jsonToStyleConfig(styleConfigJson);
                }
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.showAppInbox(styleConfig);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getInboxMessageCount": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getInboxMessageCount());
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getInboxMessageUnreadCount": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getInboxMessageUnreadCount());
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getAllInboxMessages": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(Utils.inboxMessageListToArrayList(cleverTapAPI.getAllInboxMessages()));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            case "getUnreadInboxMessages": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(Utils.inboxMessageListToArrayList(cleverTapAPI.getUnreadInboxMessages()));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            case "getInboxMessageForId": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    String messageId = call.argument("messageId");

                    if (messageId == null || messageId.isEmpty()) {
                        result.error(TAG, ERROR_MSG_ID, null);
                        return;
                    }

                    CTInboxMessage inboxMessage = cleverTapAPI.getInboxMessageForId(messageId);

                    if (inboxMessage != null) {
                        result.success(Utils.jsonObjectToMap(inboxMessage.getData()));
                    } else {
                        result.success(null);
                    }

                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            case "deleteInboxMessageForId": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    String messageId = call.argument("messageId");

                    if (messageId == null || messageId.isEmpty()) {
                        result.error(TAG, ERROR_MSG_ID, null);
                        return;
                    }

                    cleverTapAPI.deleteInboxMessage(messageId);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            case "markReadInboxMessageForId": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    String messageId = call.argument("messageId");

                    if (messageId == null || messageId.isEmpty()) {
                        result.error(TAG, ERROR_MSG_ID, null);
                        return;
                    }

                    cleverTapAPI.markReadInboxMessage(messageId);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            case "pushInboxNotificationClickedEventForId": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    String messageId = call.argument("messageId");

                    if (messageId == null || messageId.isEmpty()) {
                        result.error(TAG, ERROR_MSG_ID, null);
                        return;
                    }

                    cleverTapAPI.pushInboxNotificationClickedEvent(messageId);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            case "pushInboxNotificationViewedEventForId": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    String messageId = call.argument("messageId");

                    if (messageId == null || messageId.isEmpty()) {
                        result.error(TAG, ERROR_MSG_ID, null);
                        return;
                    }

                    cleverTapAPI.pushInboxNotificationViewedEvent(messageId);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }


            //Dynamic Variables methods

            case "registerBooleanVariable": {
                String varName = call.argument("name");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.registerBooleanVariable(varName);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "registerDoubleVariable": {
                String varName = call.argument("name");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.registerDoubleVariable(varName);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "registerIntegerVariable": {
                String varName = call.argument("name");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.registerIntegerVariable(varName);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "registerStringVariable": {
                String varName = call.argument("name");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.registerStringVariable(varName);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "registerListOfBooleanVariable": {
                String varName = call.argument("name");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.registerListOfBooleanVariable(varName);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "registerListOfDoubleVariable": {
                String varName = call.argument("name");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.registerListOfDoubleVariable(varName);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "registerListOfIntegerVariable": {
                String varName = call.argument("name");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.registerListOfIntegerVariable(varName);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "registerListOfStringVariable": {
                String varName = call.argument("name");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.registerListOfStringVariable(varName);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "registerMapOfBooleanVariable": {
                String varName = call.argument("name");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.registerMapOfBooleanVariable(varName);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "registerMapOfDoubleVariable": {
                String varName = call.argument("name");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.registerMapOfDoubleVariable(varName);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "registerMapOfIntegerVariable": {
                String varName = call.argument("name");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.registerMapOfIntegerVariable(varName);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "registerMapOfStringVariable": {
                String varName = call.argument("name");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.registerMapOfStringVariable(varName);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getBooleanVariable": {
                String varName = call.argument("name");
                boolean defaultValue = call.argument("defaultValue");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getBooleanVariable(varName, defaultValue));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getDoubleVariable": {
                String varName = call.argument("name");
                double defaultValue = call.argument("defaultValue");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getDoubleVariable(varName, defaultValue));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getIntegerVariable": {
                String varName = call.argument("name");
                int defaultValue = call.argument("defaultValue");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getIntegerVariable(varName, defaultValue));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getStringVariable": {
                String varName = call.argument("name");
                String defaultValue = call.argument("defaultValue");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getStringVariable(varName, defaultValue));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getListOfBooleanVariable": {
                String varName = call.argument("name");
                List<Boolean> defaultValue = call.argument("defaultValue");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getListOfBooleanVariable(varName, defaultValue));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getListOfDoubleVariable": {
                String varName = call.argument("name");
                List<Double> defaultValue = call.argument("defaultValue");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getListOfDoubleVariable(varName, defaultValue));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getListOfIntegerVariable": {
                String varName = call.argument("name");
                List<Integer> defaultValue = call.argument("defaultValue");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getListOfIntegerVariable(varName, defaultValue));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getListOfStringVariable": {
                String varName = call.argument("name");
                List<String> defaultValue = call.argument("defaultValue");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getListOfStringVariable(varName, defaultValue));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getMapOfBooleanVariable": {
                String varName = call.argument("name");
                Map<String, Boolean> defaultValue = call.argument("defaultValue");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getMapOfBooleanVariable(varName, defaultValue));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getMapOfDoubleVariable": {
                String varName = call.argument("name");
                Map<String, Double> defaultValue = call.argument("defaultValue");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getMapOfDoubleVariable(varName, defaultValue));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getMapOfIntegerVariable": {
                String varName = call.argument("name");
                Map<String, Integer> defaultValue = call.argument("defaultValue");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getMapOfIntegerVariable(varName, defaultValue));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }
            case "getMapOfStringVariable": {
                String varName = call.argument("name");
                Map<String, String> defaultValue = call.argument("defaultValue");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(cleverTapAPI.getMapOfStringVariable(varName, defaultValue));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            //Native Display
            case "getAllDisplayUnits": {
                if (isCleverTapNotNull(cleverTapAPI)) {
                    result.success(Utils.displayUnitListToArrayList(cleverTapAPI.getAllDisplayUnits()));
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            case "getDisplayUnitForId": {
                String unitId = call.argument("unitId");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    if (cleverTapAPI.getDisplayUnitForId(unitId) != null) {
                        JSONObject displayUnit = cleverTapAPI.getDisplayUnitForId(unitId).getJsonObject();
                        if (displayUnit != null) {
                            result.success(Utils.jsonObjectToMap(displayUnit));
                        }
                    } else {
                        result.error(TAG, "Display Unit is NULL", null);
                    }
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
                break;
            }

            case "pushDisplayUnitViewedEvent": {
                String unitId = call.argument("unitId");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.pushDisplayUnitViewedEventForID(unitId);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
            }

            case "pushDisplayUnitClickedEvent": {
                String unitId = call.argument("unitId");
                if (isCleverTapNotNull(cleverTapAPI)) {
                    cleverTapAPI.pushDisplayUnitClickedEventForID(unitId);
                    result.success(null);
                } else {
                    result.error(TAG, ERROR_MSG, null);
                }
            }

            //no-op for android, methods only for iOS.
            case "registerForPush": {
                Log.d(TAG, "registerForPush" + ERROR_IOS);
                break;
            }

            case "getInitialUrl": {
                Log.d(TAG, "getInitialUrl" + ERROR_IOS);
                break;
            }

            default: {
                result.notImplemented();
            }
        }

    }

    private void runOnMainThread(final Runnable runnable) {
        ((Activity) flutterRegistrar.activeContext()).runOnUiThread(runnable);
    }

    private void invokeMethodOnUiThread(final String methodName, final String cleverTapID) {
        final MethodChannel channel = this.channel;
        runOnMainThread(() -> {
            if (!cleverTapID.isEmpty()) {
                channel.invokeMethod(methodName, cleverTapID);
            } else {
                channel.invokeMethod(methodName, null);
            }
        });
    }

    private void invokeMethodOnUiThread(final String methodName, final Map map) {
        final MethodChannel channel = this.channel;
        runOnMainThread(() -> channel.invokeMethod(methodName, map));
    }

    private void invokeMethodOnUiThread(final String methodName, final ArrayList list) {
        final MethodChannel channel = this.channel;
        runOnMainThread(() -> channel.invokeMethod(methodName, list));
    }


    @Override
    public void CTExperimentsUpdated() {
        invokeMethodOnUiThread("CTExperimentsUpdated", "");
    }

    @Override
    public void inboxDidInitialize() {
        invokeMethodOnUiThread("inboxDidInitialize", "");
    }

    @Override
    public void inboxMessagesDidUpdate() {
        invokeMethodOnUiThread("inboxMessagesDidUpdate", "");
    }

    @Override
    public boolean beforeShow(Map<String, Object> extras) {
        invokeMethodOnUiThread("beforeShow", extras);
        return true;
    }

    @Override
    public void onDismissed(Map<String, Object> extras, Map<String, Object> actionExtras) {
        Map<String, Object> map1 = new HashMap<>();
        map1.put("extras", extras);
        map1.put("actionExtras", actionExtras);
        invokeMethodOnUiThread("inAppNotificationDismissed", map1);
    }

    @Override
    public void profileDataUpdated(JSONObject updates) {
        invokeMethodOnUiThread("profileDataUpdated", Utils.jsonObjectToMap(updates));
    }

    @Override
    public void profileDidInitialize(String CleverTapID) {
        invokeMethodOnUiThread("profileDidInitialize", CleverTapID);
    }

    @Override
    public void onInAppButtonClick(HashMap<String, String> payload) {
        invokeMethodOnUiThread("onInAppButtonClick", payload);
    }

    @Override
    public void onInboxButtonClick(HashMap<String, String> payload) {
        invokeMethodOnUiThread("onInboxButtonClick", payload);
    }

    @Override
    public void onDisplayUnitsLoaded(ArrayList<CleverTapDisplayUnit> units) {
        invokeMethodOnUiThread("onDisplayUnitsLoaded", Utils.displayUnitListToArrayList(units));
    }
}
