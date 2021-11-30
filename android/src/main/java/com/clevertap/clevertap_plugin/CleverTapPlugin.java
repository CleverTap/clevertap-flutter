package com.clevertap.clevertap_plugin;

import android.app.Activity;
import android.content.Context;
import android.location.Location;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;
import com.clevertap.android.sdk.CTFeatureFlagsListener;
import com.clevertap.android.sdk.CTInboxListener;
import com.clevertap.android.sdk.CTInboxStyleConfig;
import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.android.sdk.InAppNotificationButtonListener;
import com.clevertap.android.sdk.InAppNotificationListener;
import com.clevertap.android.sdk.InboxMessageButtonListener;
import com.clevertap.android.sdk.SyncListener;
import com.clevertap.android.sdk.UTMDetail;
import com.clevertap.android.sdk.displayunits.DisplayUnitListener;
import com.clevertap.android.sdk.displayunits.model.CleverTapDisplayUnit;
import com.clevertap.android.sdk.events.EventDetail;
import com.clevertap.android.sdk.inbox.CTInboxMessage;
import com.clevertap.android.sdk.interfaces.OnInitCleverTapIDListener;
import com.clevertap.android.sdk.product_config.CTProductConfigListener;
import com.clevertap.android.sdk.pushnotification.CTPushNotificationListener;
import com.clevertap.android.sdk.pushnotification.PushConstants.PushType;
import com.clevertap.android.sdk.pushnotification.amp.CTPushAmpListener;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import io.flutter.embedding.engine.plugins.FlutterPlugin;
import io.flutter.embedding.engine.plugins.activity.ActivityAware;
import io.flutter.embedding.engine.plugins.activity.ActivityPluginBinding;
import io.flutter.plugin.common.BinaryMessenger;
import io.flutter.plugin.common.MethodCall;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugin.common.MethodChannel.MethodCallHandler;
import io.flutter.plugin.common.MethodChannel.Result;
import io.flutter.plugin.common.PluginRegistry.Registrar;

/**
 * CleverTapPlugin
 */
@SuppressWarnings({"ConstantConditions", "rawtypes"})
public class CleverTapPlugin implements ActivityAware,
        FlutterPlugin, MethodCallHandler,
        SyncListener, InAppNotificationListener, CTInboxListener,
        InAppNotificationButtonListener,
        InboxMessageButtonListener, DisplayUnitListener,
        CTFeatureFlagsListener, CTProductConfigListener,
        CTPushAmpListener, CTPushNotificationListener {

    private static final String TAG = "CleverTapPlugin";

    private static final String ANDROID_O_DELETE_NOTIFICATION_ERROR_MSG = "Unable to delete notification " +
            "for devices less than 26(O)";

    private static final String ERROR_MSG = "CleverTap Instance is not initialized";

    private static final String ANDROID_O_CREATE_CHANNEL_ERROR_MSG = "Unable to create notification channels" +
            "for devices less than 26(O)";

    private static final String ERROR_MSG_ID = "Message Id is null or empty";

    private static final String ERROR_IOS = " method is only applicable for iOS";

    private Activity activity;

    private MethodChannel channel;

    private CleverTapAPI cleverTapAPI;

    private Context context;

    /**
     * Plugin registration.
     */
    public static void registerWith(Registrar registrar) {
        CleverTapPlugin plugin = new CleverTapPlugin();
        plugin.setupPlugin(registrar.context(), null, registrar);
    }

    public CleverTapPlugin() {
    }

    @Override
    public boolean beforeShow(Map<String, Object> extras) {
        invokeMethodOnUiThread("beforeShow", extras);
        return true;
    }

    @Override
    public void featureFlagsUpdated() {
        invokeMethodOnUiThread("featureFlagsUpdated", "");
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
    public void onActivated() {
        invokeMethodOnUiThread("productConfigActivated", "");
    }

    @Override
    public void onAttachedToActivity(@NonNull ActivityPluginBinding binding) {
        activity = binding.getActivity();
    }

    @Override
    public void onAttachedToEngine(@NonNull FlutterPluginBinding binding) {
        setupPlugin(binding.getApplicationContext(), binding.getBinaryMessenger(), null);
    }

    @Override
    public void onDetachedFromActivity() {
        activity = null;
    }

    @Override
    public void onDetachedFromActivityForConfigChanges() {
        activity = null;
    }

    @Override
    public void onDetachedFromEngine(@NonNull FlutterPluginBinding binding) {
        channel = null;
    }

    @Override
    public void onDismissed(Map<String, Object> extras, Map<String, Object> actionExtras) {
        Map<String, Object> map1 = new HashMap<>();
        map1.put("extras", extras);
        map1.put("actionExtras", actionExtras);
        invokeMethodOnUiThread("inAppNotificationDismissed", map1);
    }

    @Override
    public void onDisplayUnitsLoaded(ArrayList<CleverTapDisplayUnit> units) {
        invokeMethodOnUiThread("onDisplayUnitsLoaded", Utils.displayUnitListToArrayList(units));
    }

    @Override
    public void onFetched() {
        invokeMethodOnUiThread("productConfigFetched", "");
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
    public void onInit() {
        invokeMethodOnUiThread("productConfigInitialized", "");
    }

    @SuppressWarnings("ConstantConditions")
    @Override
    public void onMethodCall(MethodCall call, @NonNull Result result) {
        switch (call.method) {
            case "setDebugLevel": {
                int debugLevelValue = call.argument("debugLevel");
                CleverTapAPI.setDebugLevel(debugLevelValue);
                result.success(null);
                break;
            }
            // Push Methods
            case "setPushToken": {
                setPushToken(call, result, PushType.FCM);
                break;
            }
            case "createNotification": {
                createNotification(call, result);
                break;
            }
            case "processPushNotification": {
                processPushNotification(call, result);
                break;
            }
            //Baidu/Xiaomi/Huawei push notifications
            case "setXiaomiPushToken": {
                setPushToken(call, result, PushType.XPS);
                break;
            }

            case "setBaiduPushToken": {
                setPushToken(call, result, PushType.BPS);
                break;
            }

            case "setHuaweiPushToken": {
                setPushToken(call, result, PushType.HPS);
                break;
            }
            //Notification channel/group methods for Android O
            case "createNotificationChannel": {
                createNotificationChannel(call, result);
                break;
            }
            case "createNotificationChannelWithSound": {
                createNotificationChannelWithSound(call, result);
                break;
            }
            case "createNotificationChannelWithGroupId": {
                createNotificationChannelWithGroupId(call, result);
                break;
            }
            case "createNotificationChannelWithGroupIdAndSound": {
                createNotificationChannelWithGroupIdAndSound(call, result);
                break;
            }
            case "createNotificationChannelGroup": {
                createNotificationChannelGroup(call, result);
                break;
            }
            case "deleteNotificationChannel": {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    String channelId = call.argument("channelId");
                    CleverTapAPI.deleteNotificationChannel(context, channelId);
                    result.success(null);
                }else{
                    result.error(TAG, ANDROID_O_DELETE_NOTIFICATION_ERROR_MSG, null);
                }
                break;
            }
            case "deleteNotificationChannelGroup": {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    String groupId = call.argument("groupId");
                    CleverTapAPI.deleteNotificationChannelGroup(context, groupId);
                    result.success(null);
                }else{
                    result.error(TAG, ANDROID_O_DELETE_NOTIFICATION_ERROR_MSG, null);
                }
                break;
            }
            //Enables tracking opt out for the currently active user.
            case "setOptOut": {
                setOptOut(call, result);
                break;
            }
            //Sets the SDK to offline mode
            case "setOffline": {
                setOffline(call, result);
                break;
            }
            //Enables the reporting of device network-related information, including IP address.  This reporting is disabled by default.
            case "enableDeviceNetworkInfoReporting": {
                enableDeviceNetworkInfoReporting(call, result);
                break;
            }
            // Personalization
            case "enablePersonalization": {
                setPersonalization(result, true);
                break;
            }
            case "disablePersonalization": {
                setPersonalization(result, false);
                break;
            }
            // Event API
            case "recordScreenView": {
                recordScreenView(call, result);
                break;
            }
            case "recordEvent": {
                recordEvent(call, result);
                break;
            }
            case "recordChargedEvent": {
                recordChargedEvent(call, result);
                break;
            }
            case "eventGetFirstTime": {
                eventGetFirstTime(call, result);
                break;
            }
            case "eventGetLastTime": {
                eventGetLastTime(call, result);
                break;
            }
            case "eventGetOccurrences": {
                eventGetOccurrences(call, result);
                break;
            }
            case "eventGetDetail": {
                eventGetDetail(call, result);
                break;
            }
            case "getEventHistory": {
                getEventHistory(result);
                break;
            }
            case "pushNotificationClickedEvent": {
                pushNotificationClickedEvent(call, result);
                break;
            }
            case "pushNotificationViewedEvent": {
                pushNotificationViewedEvent(call, result);
                break;
            }
            //Profile API
            case "setLocation": {
                setLocation(call, result);
                break;
            }
            case "profileGetCleverTapAttributionIdentifier": {
                profileGetCleverTapAttributionIdentifier(result);
                break;
            }
            case "profileGetCleverTapID": {
                profileGetCleverTapID(result);
                break;
            }
            case "getCleverTapID": {
                getCleverTapID(result);
                break;
            }
            case "onUserLogin": {
                onUserLogin(call, result);
                break;
            }
            case "profileSet": {
                profileSet(call, result);
                break;
            }
            case "profileGetProperty": {
                profileGetProperty(call, result);
                break;
            }
            case "profileRemoveValueForKey": {
                profileRemoveValueForKey(call, result);
                break;
            }
            case "profileSetMultiValues": {
                profileSetMultiValues(call, result);
                break;
            }
            case "profileAddMultiValue": {
                profileAddMultiValue(call, result);
                break;
            }
            case "profileIncrementValue": {
                profileIncrementValue(call, result);
                break;
            }
            case "profileDecrementValue": {
                profileDecrementValue(call, result);
                break;
            }
            case "profileAddMultiValues": {
                profileAddMultiValues(call, result);
                break;
            }
            case "profileRemoveMultiValue": {
                profileRemoveMultiValue(call, result);
                break;
            }
            case "profileRemoveMultiValues": {
                profileRemoveMultiValues(call, result);
                break;
            }
            //Session API
            case "pushInstallReferrer": {
                pushInstallReferrer(call, result);
                break;
            }
            case "sessionGetTimeElapsed": {
                sessionGetTimeElapsed(result);
                break;
            }
            case "sessionGetTotalVisits": {
                sessionGetTotalVisits(result);
                break;
            }
            case "sessionGetScreenCount": {
                sessionGetScreenCount(result);
                break;
            }
            case "sessionGetPreviousVisitTime": {
                sessionGetPreviousVisitTime(result);
                break;
            }
            case "sessionGetUTMDetails": {
                sessionGetUTMDetails(result);
                break;
            }
            //In App controls Methods
            case "suspendInAppNotifications": {
                suspendInAppNotifications(result);
                break;
            }
            case "discardInAppNotifications": {
                discardInAppNotifications(result);
                break;
            }
            case "resumeInAppNotifications": {
                resumeInAppNotifications(result);
                break;
            }
            //App Inbox Methods
            case "initializeInbox": {
                initializeInbox(result);
                break;
            }
            case "showInbox": {
                showInbox(call, result);
                break;
            }
            case "getInboxMessageCount": {
                getInboxMessageCount(result);
                break;
            }
            case "getInboxMessageUnreadCount": {
                getInboxMessageUnreadCount(result);
                break;
            }
            case "getAllInboxMessages": {
                getAllInboxMessages(result);
                break;
            }

            case "getUnreadInboxMessages": {
                getUnreadInboxMessages(result);
                break;
            }

            case "getInboxMessageForId": {
                getInboxMessageForId(call, result);
                break;
            }

            case "deleteInboxMessageForId": {
                deleteInboxMessageForId(call, result);
                break;
            }

            case "markReadInboxMessageForId": {
                markReadInboxMessageForId(call, result);
                break;
            }

            case "pushInboxNotificationClickedEventForId": {
                pushInboxNotificationClickedEventForId(call, result);
                break;
            }

            case "pushInboxNotificationViewedEventForId": {
                pushInboxNotificationViewedEventForId(call, result);
                break;
            }

            //Native Display
            case "getAllDisplayUnits": {
                getAllDisplayUnits(result);
                break;
            }

            case "getDisplayUnitForId": {
                getDisplayUnitForId(call, result);
                break;
            }

            case "pushDisplayUnitViewedEvent": {
                pushDisplayUnitViewedEvent(call, result);
                break;
            }

            case "pushDisplayUnitClickedEvent": {
                pushDisplayUnitClickedEvent(call, result);
                break;
            }

            case "getFeatureFlag": {
                getFeatureFlag(call, result);
                break;
            }

            case "setDefaultsMap": {
                setDefaultsMap(call, result);
                break;
            }

            case "fetch": {
                fetch(result);
                break;
            }

            case "fetchWithMinimumFetchIntervalInSeconds": {
                fetchWithMinimumFetchIntervalInSeconds(call, result);
                break;
            }

            case "activate": {
                activate(result);
                break;
            }

            case "fetchAndActivate": {
                fetchAndActivate(result);
                break;
            }

            case "setMinimumFetchIntervalInSeconds": {
                setMinimumFetchIntervalInSeconds(call, result);
                break;
            }

            case "getLastFetchTimeStampInMillis": {
                getLastFetchTimeStampInMillis(result);
                break;
            }

            case "getString": {
                getString(call, result);
                break;
            }

            case "getBoolean": {
                getBoolean(call, result);
                break;
            }

            case "getLong": {
                getLong(call, result);
                break;
            }

            case "getDouble": {
                getDouble(call, result);
                break;
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

    @Override
    public void onNotificationClickedPayloadReceived(HashMap<String, Object> hashMap) {
        invokeMethodOnUiThread("pushClickedPayloadReceived", hashMap);
    }

    @Override
    public void onPushAmpPayloadReceived(Bundle extras) {
        invokeMethodOnUiThread("pushAmpPayloadReceived", Utils.bundleToMap(extras));
    }

    @Override
    public void onReattachedToActivityForConfigChanges(@NonNull ActivityPluginBinding binding) {
        activity = binding.getActivity();
    }

    @Override
    public void profileDataUpdated(JSONObject updates) {
        invokeMethodOnUiThread("profileDataUpdated", Utils.jsonObjectToMap(updates));
    }

    @Override
    public void profileDidInitialize(String CleverTapID) {
        invokeMethodOnUiThread("profileDidInitialize", CleverTapID);
    }

    private void activate(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.productConfig().activate();
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void createNotification(MethodCall call, Result result) {
        String extras = call.argument("extras");
        if (isCleverTapNotNull(cleverTapAPI)) {
            try {
                Log.d(TAG, "createNotification Android");
                CleverTapAPI.createNotification(context, Utils.stringToBundle(extras));
            } catch (JSONException e) {
                result.error(TAG, "Unable to render notification due to JSONException - " + e.getLocalizedMessage(),
                        null);
            }
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void createNotificationChannel(MethodCall call, Result result) {
        CleverTapAPI.createNotificationChannel(context,
                call.argument("channelId"),
                call.argument("channelName"),
                call.argument("channelDescription"),
                call.argument("importance"),
                call.argument("showBadge"));
        result.success(null);
    }

    private void createNotificationChannelGroup(MethodCall call, Result result) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String groupId = call.argument("groupId");
            String groupName = call.argument("groupName");
            CleverTapAPI.createNotificationChannelGroup(context, groupId, groupName);
            result.success(null);
        }else{
            result.error(TAG, ANDROID_O_CREATE_CHANNEL_ERROR_MSG, null);
        }
    }

    private void createNotificationChannelWithGroupId(MethodCall call, Result result) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            boolean showBadge = call.argument("showBadge");
            CleverTapAPI.createNotificationChannel(context,
                    call.argument("channelId"),
                    call.argument("channelName"),
                    call.argument("channelDescription"),
                    call.argument("importance"),
                    call.argument("groupId"),
                    showBadge);
            result.success(null);
        }else{
            result.error(TAG, ANDROID_O_CREATE_CHANNEL_ERROR_MSG, null);
        }
    }

    private void createNotificationChannelWithGroupIdAndSound(MethodCall call, Result result) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CleverTapAPI.createNotificationChannel(context,
                    call.argument("channelId"),
                    call.argument("channelName"),
                    call.argument("channelDescription"),
                    call.argument("importance"),
                    call.argument("groupId"),
                    call.argument("showBadge"),
                    call.argument("sound"));
            result.success(null);
        }else{
            result.error(TAG, ANDROID_O_CREATE_CHANNEL_ERROR_MSG, null);
        }
    }

    private void createNotificationChannelWithSound(MethodCall call, Result result) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String sound = call.argument("sound");
            CleverTapAPI.createNotificationChannel(context,
                    call.argument("channelId"),
                    call.argument("channelName"),
                    call.argument("channelDescription"),
                    call.argument("importance"),
                    call.argument("showBadge"),
                    sound);
            result.success(null);
        }else{
            result.error(TAG, ANDROID_O_CREATE_CHANNEL_ERROR_MSG, null);
        }
    }

    private void deleteInboxMessageForId(MethodCall call, Result result) {
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
    }

    private void enableDeviceNetworkInfoReporting(MethodCall call, Result result) {
        boolean value = call.argument("value");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.enableDeviceNetworkInfoReporting(value);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void eventGetDetail(MethodCall call, Result result) {
        String eventName = call.argument("eventName");
        if (isCleverTapNotNull(cleverTapAPI)) {
            EventDetail eventDetail = cleverTapAPI.getDetails(eventName);
            result.success(Utils.eventDetailToMap(eventDetail));
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void eventGetFirstTime(MethodCall call, Result result) {
        String eventName = call.argument("eventName");
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.getFirstTime(eventName));
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void eventGetLastTime(MethodCall call, Result result) {
        String eventName = call.argument("eventName");
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.getLastTime(eventName));
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void eventGetOccurrences(MethodCall call, Result result) {
        String eventName = call.argument("eventName");
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.getCount(eventName));
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void fetch(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.productConfig().fetch();
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void fetchAndActivate(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.productConfig().fetchAndActivate();
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void fetchWithMinimumFetchIntervalInSeconds(MethodCall call, Result result) {
        int interval = call.argument("interval");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.productConfig().fetch(interval);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void getAllDisplayUnits(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(Utils.displayUnitListToArrayList(cleverTapAPI.getAllDisplayUnits()));
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void getAllInboxMessages(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(Utils.inboxMessageListToArrayList(cleverTapAPI.getAllInboxMessages()));
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void getBoolean(MethodCall call, Result result) {
        String key = call.argument("key");
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.productConfig().getBoolean(key));
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void getDisplayUnitForId(MethodCall call, Result result) {
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
    }

    private void getDouble(MethodCall call, Result result) {
        String key = call.argument("key");
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.productConfig().getDouble(key));
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void getEventHistory(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(Utils.historyEventDetailToMap(cleverTapAPI.getHistory()));
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void getFeatureFlag(MethodCall call, Result result) {
        String key = call.argument("key");
        boolean defaultValue = call.argument("defaultValue");
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.featureFlag().get(key, defaultValue));
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void getInboxMessageCount(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.getInboxMessageCount());
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void getInboxMessageForId(MethodCall call, Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            String messageId = call.argument("messageId");
            if (messageId == null || messageId.isEmpty()) {
                result.error(TAG, ERROR_MSG_ID, null);
                return;
            }
            CTInboxMessage inboxMessage = cleverTapAPI.getInboxMessageForId(messageId);
            if (inboxMessage != null) {
                result.success(Utils.jsonObjectToMap(inboxMessage.getData()));
            }
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void getInboxMessageUnreadCount(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.getInboxMessageUnreadCount());
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void getLastFetchTimeStampInMillis(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.productConfig().getLastFetchTimeStampInMillis());
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void getLong(MethodCall call, Result result) {
        String key = call.argument("key");
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.productConfig().getLong(key));
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void getString(MethodCall call, Result result) {
        String key = call.argument("key");
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.productConfig().getString(key));
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void getUnreadInboxMessages(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(Utils.inboxMessageListToArrayList(cleverTapAPI.getUnreadInboxMessages()));
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void suspendInAppNotifications(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.suspendInAppNotifications();
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void discardInAppNotifications(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.discardInAppNotifications();
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void resumeInAppNotifications(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.resumeInAppNotifications();
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void initializeInbox(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.initializeInbox();
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void invokeMethodOnUiThread(final String methodName, final String cleverTapID) {
        final MethodChannel channel = this.channel;
        if (channel == null) {
            Log.d(TAG, "methodChannel in invokeMethodOnUiThread(String) is null");
            return;
        }
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
        if (channel == null) {
            Log.d(TAG, "methodChannel in invokeMethodOnUiThread(Map) is null");
            return;
        }
        runOnMainThread(() -> channel.invokeMethod(methodName, map));
    }

    @SuppressWarnings("SameParameterValue")
    private void invokeMethodOnUiThread(final String methodName, final ArrayList list) {
        final MethodChannel channel = this.channel;
        if (channel == null) {
            Log.d(TAG, "methodChannel in invokeMethodOnUiThread(ArrayList) is null");
            return;
        }
        runOnMainThread(() -> channel.invokeMethod(methodName, list));
    }

    private boolean isCleverTapNotNull(CleverTapAPI cleverTapAPI) {
        return cleverTapAPI != null;
    }

    private void markReadInboxMessageForId(MethodCall call, Result result) {
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
    }

    private void onUserLogin(MethodCall call, Result result) {
        Map<String, Object> profile = Utils.dartMapToProfileMap(call.argument("profile"));
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.onUserLogin(profile);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void processPushNotification(MethodCall call, Result result) {
        JSONObject extras = call.argument("extras");
        if (isCleverTapNotNull(cleverTapAPI)) {
            try {
                CleverTapAPI.processPushNotification(context, Utils.jsonToBundle(extras));
            } catch (JSONException e) {
                result.error(TAG, "Unable to render notification due to JSONException - " + e.getLocalizedMessage(),
                        null);
            }
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void profileAddMultiValue(MethodCall call, Result result) {
        String key = call.argument("key");
        String value = call.argument("value");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.addMultiValueForKey(key, value);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void profileIncrementValue(MethodCall call, Result result) {
        String key = call.argument("key");
        Number value = call.argument("value");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.incrementValue(key, value);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void profileDecrementValue(MethodCall call, Result result) {
        String key = call.argument("key");
        Number value = call.argument("value");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.decrementValue(key, value);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void profileAddMultiValues(MethodCall call, Result result) {
        String key = call.argument("key");
        ArrayList<String> values = call.argument("values");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.addMultiValuesForKey(key, values);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void profileGetCleverTapAttributionIdentifier(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.getCleverTapAttributionIdentifier());
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void profileGetCleverTapID(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.getCleverTapID());
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void getCleverTapID(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.getCleverTapID(new OnInitCleverTapIDListener() {
                @Override
                public void onInitCleverTapID(String cleverTapID) {
                    runOnMainThread(new Runnable() {
                        @Override
                        public void run() {
                            result.success(cleverTapID);
                        }
                    });
                }
            });
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void profileGetProperty(MethodCall call, Result result) {
        String propertyName = call.argument("propertyName");
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.getProperty(propertyName));
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void profileRemoveMultiValue(MethodCall call, Result result) {
        String key = call.argument("key");
        String value = call.argument("value");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.removeMultiValueForKey(key, value);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void profileRemoveMultiValues(MethodCall call, Result result) {
        String key = call.argument("key");
        ArrayList<String> values = call.argument("values");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.removeMultiValuesForKey(key, values);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void profileRemoveValueForKey(MethodCall call, Result result) {
        String key = call.argument("key");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.removeValueForKey(key);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void profileSet(MethodCall call, Result result) {
        Map<String, Object> profile = Utils.dartMapToProfileMap(call.argument("profile"));
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.pushProfile(profile);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void profileSetMultiValues(MethodCall call, Result result) {
        String key = call.argument("key");
        ArrayList<String> values = call.argument("values");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.setMultiValuesForKey(key, values);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void pushDisplayUnitClickedEvent(MethodCall call, Result result) {
        String unitId = call.argument("unitId");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.pushDisplayUnitClickedEventForID(unitId);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void pushDisplayUnitViewedEvent(MethodCall call, Result result) {
        String unitId = call.argument("unitId");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.pushDisplayUnitViewedEventForID(unitId);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void pushInboxNotificationClickedEventForId(MethodCall call, Result result) {
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
    }

    private void pushInboxNotificationViewedEventForId(MethodCall call, Result result) {
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
    }

    private void pushInstallReferrer(MethodCall call, Result result) {
        String source = call.argument("source");
        String medium = call.argument("medium");
        String campaign = call.argument("campaign");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.pushInstallReferrer(source, medium, campaign);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void pushNotificationClickedEvent(MethodCall call, Result result) {
        HashMap<String, Object> extrasMap = call.argument("notificationData");
        Bundle extras = Utils.mapToBundle(extrasMap);
        if (isCleverTapNotNull(cleverTapAPI)) {
            this.cleverTapAPI.pushNotificationClickedEvent(extras);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void pushNotificationViewedEvent(MethodCall call, Result result) {
        HashMap<String, Object> extrasMap = call.argument("notificationData");
        Bundle extras = Utils.mapToBundle(extrasMap);
        if (isCleverTapNotNull(cleverTapAPI)) {
            this.cleverTapAPI.pushNotificationViewedEvent(extras);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void recordChargedEvent(MethodCall call, Result result) {
        HashMap<String, Object> chargeDetails = call.argument("chargeDetails");
        ArrayList<HashMap<String, Object>> items = call.argument("items");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.pushChargedEvent(chargeDetails, items);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void recordEvent(MethodCall call, Result result) {
        Map<String, Object> eventData = call.argument("eventData");
        String eventName = call.argument("eventName");
        if (isCleverTapNotNull(cleverTapAPI)) {
            this.cleverTapAPI.pushEvent(eventName, eventData);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void recordScreenView(MethodCall call, Result result) {
        String name = call.argument("screenName");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.recordScreen(name);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void runOnMainThread(final Runnable runnable) {
        if (activity != null) {
            activity.runOnUiThread(runnable);
        } else {
            try {
                Handler mainHandler = new Handler(Looper.getMainLooper());
                mainHandler.post(runnable);
            } catch (Exception e) {
                Log.e(TAG, "Exception while running on main thread - ");
                e.printStackTrace();
            }
        }


    }

    private void sessionGetPreviousVisitTime(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.getPreviousVisitTime());
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void sessionGetScreenCount(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.getScreenCount());
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void sessionGetTimeElapsed(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.getTimeElapsed());
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void sessionGetTotalVisits(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.getTotalVisits());
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void sessionGetUTMDetails(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            UTMDetail detail = cleverTapAPI.getUTMDetails();
            result.success(Utils.utmDetailsToMap(detail));
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void setDefaultsMap(MethodCall call, Result result) {
        HashMap<String, Object> defaults = call.argument("defaults");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.productConfig().setDefaults(defaults);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void setLocation(MethodCall call, Result result) {
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
    }

    private void setMinimumFetchIntervalInSeconds(MethodCall call, Result result) {
        long interval = call.argument("interval");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.productConfig().setMinimumFetchIntervalInSeconds(interval);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void setOffline(MethodCall call, Result result) {
        boolean value = call.argument("value");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.setOffline(value);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void setOptOut(MethodCall call, Result result) {
        boolean value = call.argument("value");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.setOptOut(value);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void setPersonalization(Result result, boolean enable) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            if (enable) {
                cleverTapAPI.enablePersonalization();
            } else {
                cleverTapAPI.disablePersonalization();
            }
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void setPushToken(MethodCall call, Result result, PushType type) {
        String token = call.argument("token");
        if (isCleverTapNotNull(cleverTapAPI)) {
            switch (type.getType()) {
                case "fcm":
                    cleverTapAPI.pushFcmRegistrationId(token, true);
                    break;
                case "xps":
                    cleverTapAPI.pushXiaomiRegistrationId(token, true);
                    break;
                case "hps":
                    cleverTapAPI.pushHuaweiRegistrationId(token, true);
                    break;
                case "bps":
                    cleverTapAPI.pushBaiduRegistrationId(token, true);
                    break;
            }
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void setupPlugin(Context context, BinaryMessenger messenger, Registrar registrar) {
        if (registrar != null) {
            //V1 setup
            this.channel = new MethodChannel(registrar.messenger(), "clevertap_plugin");
            this.activity = ((Activity) registrar.activeContext());
        } else {
            //V2 setup
            this.channel = new MethodChannel(messenger, "clevertap_plugin");
        }
        this.channel.setMethodCallHandler(this);
        this.context = context.getApplicationContext();
        this.cleverTapAPI = CleverTapAPI.getDefaultInstance(this.context);
        if (this.cleverTapAPI != null) {
            this.cleverTapAPI.setCTPushNotificationListener(this);
            this.cleverTapAPI.setCTNotificationInboxListener(this);
            this.cleverTapAPI.setInboxMessageButtonListener(this);
            this.cleverTapAPI.setInAppNotificationButtonListener(this);
            this.cleverTapAPI.setInAppNotificationListener(this);
            this.cleverTapAPI.setSyncListener(this);
            this.cleverTapAPI.setDisplayUnitListener(this);
            this.cleverTapAPI.setCTFeatureFlagsListener(this);
            this.cleverTapAPI.setCTProductConfigListener(this);
            this.cleverTapAPI.setCTPushAmpListener(this);
            this.cleverTapAPI.setLibrary("Flutter");
        }
    }

    private void showInbox(MethodCall call, Result result) {
        Map<String, Object> styleConfigMap = call.argument("styleConfig");
        JSONObject styleConfigJson = Utils.mapToJSONObject(styleConfigMap);
        CTInboxStyleConfig styleConfig;
        styleConfig = Utils.jsonToStyleConfig(styleConfigJson);
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.showAppInbox(styleConfig);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }
}
