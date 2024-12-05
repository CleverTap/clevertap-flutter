package com.clevertap.clevertap_plugin;

import static com.clevertap.clevertap_plugin.Constants.CALLBACK_HANDLE;
import static com.clevertap.clevertap_plugin.Constants.DISPATCHER_HANDLE;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
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
import com.clevertap.android.sdk.InboxMessageListener;
import com.clevertap.android.sdk.PushPermissionResponseListener;
import com.clevertap.android.sdk.SyncListener;
import com.clevertap.android.sdk.UTMDetail;
import com.clevertap.android.sdk.displayunits.DisplayUnitListener;
import com.clevertap.android.sdk.displayunits.model.CleverTapDisplayUnit;
import com.clevertap.android.sdk.events.EventDetail;
import com.clevertap.android.sdk.inapp.CTInAppNotification;
import com.clevertap.android.sdk.inapp.callbacks.FetchInAppsCallback;
import com.clevertap.android.sdk.inapp.customtemplates.CustomTemplateContext;
import com.clevertap.android.sdk.inbox.CTInboxMessage;
import com.clevertap.android.sdk.interfaces.OnInitCleverTapIDListener;
import com.clevertap.android.sdk.product_config.CTProductConfigListener;
import com.clevertap.android.sdk.pushnotification.CTPushNotificationListener;
import com.clevertap.android.sdk.pushnotification.PushConstants.PushType;
import com.clevertap.android.sdk.pushnotification.PushNotificationHandler;
import com.clevertap.android.sdk.pushnotification.amp.CTPushAmpListener;
import com.clevertap.android.sdk.variables.Var;
import com.clevertap.android.sdk.variables.callbacks.FetchVariablesCallback;
import com.clevertap.android.sdk.variables.callbacks.VariableCallback;
import com.clevertap.android.sdk.variables.callbacks.VariablesChangedCallback;
import com.clevertap.clevertap_plugin.CleverTapTypeUtils.LongUtil;
import com.clevertap.clevertap_plugin.isolate.IsolateHandlePreferences;

import java.util.HashSet;
import java.util.Set;
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
        InAppNotificationButtonListener, InboxMessageListener,
        InboxMessageButtonListener, DisplayUnitListener,
        CTFeatureFlagsListener, CTProductConfigListener,
        CTPushAmpListener, CTPushNotificationListener, PushPermissionResponseListener {

    private static final String TAG = "CleverTapPlugin";

    private static final String ANDROID_O_DELETE_NOTIFICATION_ERROR_MSG = "Unable to delete notification " +
            "for devices less than 26(O)";

    private static final String ERROR_MSG = "CleverTap Instance is not initialized";

    private static final String ANDROID_O_CREATE_CHANNEL_ERROR_MSG = "Unable to create notification channels" +
            "for devices less than 26(O)";

    private static final String ERROR_MSG_ID = "Message Id is null or empty";

    private static final String ERROR_IOS = " method is only applicable for iOS";

    private static final String ERROR_TEMPLATE_NAME = "Custom template: " + " is not currently being presented";
    public static final String KEY_TEMPLATE_NAME_CC = "templateName";
    public static final String KEY_TEMPLATE_ARGUMENT_CC = "argName";

    private Activity activity;

    private MethodChannel dartToNativeMethodChannel;

    private MethodChannel lastNativeToDartMethodChannel;

    private CleverTapAPI cleverTapAPI;

    private Context context;

    public static Map<String, Object> variables = new HashMap<>();
    public static final Set<MethodChannel> nativeToDartMethodChannelSet = new HashSet<>();

    /**
     * Plugin registration.
     */
    public static void registerWith(Registrar registrar) {
        CleverTapPlugin plugin = new CleverTapPlugin();
        plugin.setupPlugin(registrar.context(), null, registrar);
        plugin.activity = ((Activity) registrar.activeContext());
    }

    public CleverTapPlugin() {
    }

    @Override
    public boolean beforeShow(Map<String, Object> extras) {
        invokeMethodOnUiThread("beforeShow", extras);
        return true;
    }

    @SuppressLint("RestrictedApi")
    @Override
    public void onShow(CTInAppNotification ctInAppNotification) {
        invokeMethodOnUiThread("inAppNotificationShow",
                Utils.jsonToMap(ctInAppNotification.getJsonDescription()));
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
        Log.d(TAG,"onAttachedToEngine");
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
        Log.d(TAG,"onDetachedFromEngine");
        nativeToDartMethodChannelSet.remove(this.lastNativeToDartMethodChannel);
        this.lastNativeToDartMethodChannel = null;
        dartToNativeMethodChannel = null;
        context = null;
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
    public void onInboxItemClicked(CTInboxMessage message, int contentPageIndex, int buttonIndex) {
        Map<String, Object> payloadMap = new HashMap<>();
        payloadMap.put("data", Utils.jsonToMap(message.getData()));
        payloadMap.put("contentPageIndex", contentPageIndex);
        payloadMap.put("buttonIndex", buttonIndex);
        invokeMethodOnUiThread("onInboxMessageClick", payloadMap);
    }

    @Override
    public void onInit() {
        invokeMethodOnUiThread("productConfigInitialized", "");
    }

    @SuppressWarnings("ConstantConditions")
    @Override
    public void onMethodCall(MethodCall call, @NonNull Result result) {
        switch (call.method) {
            case "getAppLaunchNotification": {
                getAppLaunchNotification(result);
                break;
            }
            case "setLibrary": {
                setLibrary(call, result);
                break;
            }
            case "setDebugLevel": {
                int debugLevelValue = call.argument("debugLevel");
                CleverTapAPI.setDebugLevel(debugLevelValue);
                result.success(null);
                break;
            }
            case "registerKilledStateNotificationClickedHandler": {
                Long dispatcherHandle = LongUtil.parseLong(call.argument(DISPATCHER_HANDLE));
                Long callbackHandle = LongUtil.parseLong(call.argument(CALLBACK_HANDLE));
                if (dispatcherHandle != null && callbackHandle != null) {
                    IsolateHandlePreferences.saveCallbackKeys(context, dispatcherHandle, callbackHandle);
                }
                break;
            }
            case "setLocale": {
                setLocale(call, result);
                break;
            }
            // Push Methods
            case "setPushToken": {
                setPushToken(call, result, PushType.FCM);
                break;
            }
            case "createNotification": {
                renderNotification(call, result);
                break;
            }
            case "processPushNotification": {
                processPushNotification(call, result);
                break;
            }
            //Baidu/Huawei push notifications
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
                } else {
                    result.error(TAG, ANDROID_O_DELETE_NOTIFICATION_ERROR_MSG, null);
                }
                break;
            }
            case "deleteNotificationChannelGroup": {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    String groupId = call.argument("groupId");
                    CleverTapAPI.deleteNotificationChannelGroup(context, groupId);
                    result.success(null);
                } else {
                    result.error(TAG, ANDROID_O_DELETE_NOTIFICATION_ERROR_MSG, null);
                }
                break;
            }
            //Android 13 push primer methods
            case "promptPushPrimer": {
                promptPushPrimer(call, result);
                break;
            }

            case "promptForPushNotification": {
                promptForPushNotification(call, result);
                break;
            }

            case "getPushNotificationPermissionStatus": {
                getPushNotificationPermissionStatus(result);
                break;
            }

            case "unregisterPushPermissionNotificationResponseListener": {
                unregisterPushPermissionNotificationResponseListener(result);
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
            case "dismissInbox": {
                dismissInbox(result);
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

            case "deleteInboxMessagesForIds": {
                deleteInboxMessagesForIds(call, result);
                break;
            }

            case "markReadInboxMessageForId": {
                markReadInboxMessageForId(call, result);
                break;
            }

            case "markReadInboxMessagesForIds": {
                markReadInboxMessagesForIds(call, result);
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

            case "syncVariables": {
                syncVariables(result);
                break;
            }

            //no-op for android, methods only for iOS.
            case "syncVariablesinProd": {
                Log.d(TAG, "syncVariablesinProd" + ERROR_IOS);
                break;
            }

            case "defineVariables": {
                defineVariables(call, result);
                break;
            }

            case "defineFileVariable": {
                defineFileVariable(call, result);
                break;
            }

            case "fetchVariables": {
                fetchVariables(result);
                break;
            }

            case "getVariable": {
                getVariable(call, result);
                break;
            }

            case "getVariables": {
                getVariables(result);
                break;
            }

            case "onVariablesChanged": {
                onVariablesChanged();
                break;
            }

            case "onOneTimeVariablesChanged": {
                onOneTimeVariablesChanged();
                break;
            }

            case "onVariablesChangedAndNoDownloadsPending": {
                onVariablesChangedAndNoDownloadsPending();
                break;
            }

            case "onceVariablesChangedAndNoDownloadsPending": {
                onceVariablesChangedAndNoDownloadsPending();
                break;
            }

            case "onValueChanged": {
                onValueChanged(call);
                break;
            }

            case "onFileValueChanged": {
                onFileValueChanged(call);
                break;
            }

            case "fetchInApps": {
                fetchInApps(result);
                break;
            }

            case "clearInAppResources": {
                clearInAppResources(call, result);
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

            case "syncCustomTemplatesInProd":
            case "syncCustomTemplates" : {
                syncCustomTemplates(result);
                break;
            }

            case "customTemplateSetDismissed": {
                String templateName = call.arguments();
                customTemplateSetDismissed(templateName, result);
                break;
            }
            case "customTemplateSetPresented": {
                String templateName = call.arguments();
                customTemplateSetPresented(templateName, result);
                break;
            }
            case "customTemplateRunAction": {
                String templateName = call.argument(KEY_TEMPLATE_NAME_CC);
                String argumentName = call.argument(KEY_TEMPLATE_ARGUMENT_CC);
                customTemplateRunAction(templateName, argumentName, result);
                break;
            }
            case "customTemplateGetStringArg": {
                String templateName = call.argument(KEY_TEMPLATE_NAME_CC);
                String argumentName = call.argument(KEY_TEMPLATE_ARGUMENT_CC);
                customTemplateGetStringArg(templateName, argumentName, result);
                break;
            }
            case "customTemplateGetNumberArg": {
                String templateName = call.argument(KEY_TEMPLATE_NAME_CC);
                String argumentName = call.argument(KEY_TEMPLATE_ARGUMENT_CC);
                customTemplateGetNumberArg(templateName, argumentName, result);
                break;
            }
            case "customTemplateGetBooleanArg": {
                String templateName = call.argument(KEY_TEMPLATE_NAME_CC);
                String argumentName = call.argument(KEY_TEMPLATE_ARGUMENT_CC);
                customTemplateGetBooleanArg(templateName, argumentName, result);
                break;
            }
            case "customTemplateGetFileArg": {
                String templateName = call.argument(KEY_TEMPLATE_NAME_CC);
                String argumentName = call.argument(KEY_TEMPLATE_ARGUMENT_CC);
                customTemplateGetFileArg(templateName, argumentName, result);
                break;
            }
            case "customTemplateGetObjectArg": {
                String templateName = call.argument(KEY_TEMPLATE_NAME_CC);
                String argumentName = call.argument(KEY_TEMPLATE_ARGUMENT_CC);
                customTemplateGetObjectArg(templateName, argumentName, result);
                break;
            }
            case "customTemplateContextToString": {
                String templateName = call.arguments();
                customTemplateContextToString(templateName, result);
                break;
            }

            default: {
                result.notImplemented();
            }
        }




    }


    private void setLocale(MethodCall call, Result result) {
        String locale = call.arguments();
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.setLocale(locale);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    /**************************************************
     *  Product Experience Remote Config methods starts
     *************************************************/
    private void syncVariables(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.syncVariables();
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    public void defineVariables(MethodCall call, Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            Map<String, Object> variablesMap = call.argument("variables");
            for (Map.Entry<String, Object> entry : variablesMap.entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();
                variables.put(key, cleverTapAPI.defineVariable(key, value));
            }
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    public void defineFileVariable(MethodCall call, Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            String fileVar = call.argument("fileVariable");
            variables.put(fileVar, cleverTapAPI.defineFileVariable(fileVar));
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    public void fetchVariables(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.fetchVariables(new FetchVariablesCallback() {
                @Override
                public void onVariablesFetched(final boolean isSuccess) {
                    result.success(isSuccess);
                }
            });
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    public void getVariable(MethodCall call, Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            try {
                String key = call.argument("name");
                result.success(getVariableValue(key));
            } catch (Exception e) {
                result.error(TAG, "Unable to get the variable value: " + e.getLocalizedMessage(), null);
            }
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    public void getVariables(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            try {
                result.success(getVariablesValues());
            } catch (Exception e) {
                result.error(TAG, "Unable to get the variable value: " + e.getLocalizedMessage(), null);
            }
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    public void onVariablesChanged() {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.addVariablesChangedCallback(new VariablesChangedCallback() {
                @Override
                public void variablesChanged() {
                    invokeMethodOnUiThread("onVariablesChanged", getVariablesValues());
                }
            });
        } else {
            Log.d(TAG, ERROR_MSG);
        }
    }

    public void onOneTimeVariablesChanged() {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.addOneTimeVariablesChangedCallback(new VariablesChangedCallback() {
                @Override
                public void variablesChanged() {
                    invokeMethodOnUiThread("onOneTimeVariablesChanged", getVariablesValues());
                }
            });
        } else {
            Log.d(TAG, ERROR_MSG);
        }
    }

    public void onVariablesChangedAndNoDownloadsPending() {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.onVariablesChangedAndNoDownloadsPending(new VariablesChangedCallback() {
                @Override
                public void variablesChanged() {
                    invokeMethodOnUiThread("onVariablesChangedAndNoDownloadsPending", getVariablesValues());
                }
            });
        } else {
            Log.d(TAG, ERROR_MSG);
        }
    }

    public void onceVariablesChangedAndNoDownloadsPending() {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.onceVariablesChangedAndNoDownloadsPending(new VariablesChangedCallback() {
                @Override
                public void variablesChanged() {
                    invokeMethodOnUiThread("onceVariablesChangedAndNoDownloadsPending", getVariablesValues());
                }
            });
        } else {
            Log.d(TAG, ERROR_MSG);
        }
    }

    public void onValueChanged(MethodCall call) {
        String name = call.argument("name");
        if (variables.containsKey(name)) {

            Var<Object> var = (Var<Object>) variables.get(name);
            if (var != null) {
                var.addValueChangedCallback(new VariableCallback<Object>() {
                    @SuppressLint("RestrictedApi")
                    @Override
                    public void onValueChanged(final Var<Object> variable) {
                        Map<String, Object> variablesMap = new HashMap<>();
                        try {
                            variablesMap = getVariableValueAsMap(name);
                        } catch (Exception e) {
                            Log.d(TAG, "Unable to handle onValueChanged callback: " + e.getLocalizedMessage(), null);
                        }
                        invokeMethodOnUiThread("onValueChanged", variablesMap);
                    }
                });
            } else {
                String errorMessage = "Variable value with name = " + name + " contains null value. Not setting onValueChanged callback.";
                Log.d(TAG, errorMessage);
            }
        } else {
            String errorMessage = "Variable name = " + name + " does not exist. Make sure you set variable first.";
            Log.e(TAG, errorMessage);
        }
    }

    public void onFileValueChanged(MethodCall call) {
        String name = call.argument("name");
        if (variables.containsKey(name)) {

            Var<Object> var = (Var<Object>) variables.get(name);
            if (var != null) {
                var.addFileReadyHandler(new VariableCallback<Object>() {
                    @SuppressLint("RestrictedApi")
                    @Override
                    public void onValueChanged(final Var<Object> variable) {
                        Map<String, Object> variablesMap = new HashMap<>();
                        try {
                            variablesMap = getVariableValueAsMap(name);
                        } catch (Exception e) {
                            Log.d(TAG, "Unable to handle onValueChanged callback: " + e.getLocalizedMessage(), null);
                        }
                        invokeMethodOnUiThread("onFileValueChanged", variablesMap);
                    }
                });
            } else {
                String errorMessage = "Variable value with name = " + name + " contains null value. Not setting onValueChanged callback.";
                Log.d(TAG, errorMessage);
            }
        } else {
            String errorMessage = "Variable name = " + name + " does not exist. Make sure you set variable first.";
            Log.e(TAG, errorMessage);
        }
    }

    public void fetchInApps(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.fetchInApps(new FetchInAppsCallback() {
                @Override
                public void onInAppsFetched(final boolean isSuccess) {
                    result.success(isSuccess);
                }
            });
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }
    public void clearInAppResources(MethodCall call, Result result) {
        boolean expiredOnly = call.arguments();
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.clearInAppResources(expiredOnly);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }


    /************************************************
     *  Product Experience Remote Config methods ends
     ************************************************/

    @SuppressLint("RestrictedApi")
    private Object getVariableValue(String name) {
        if (variables.containsKey(name)) {
            Var<?> variable = (Var<?>) variables.get(name);
            return variable.value();
        }
        throw new IllegalArgumentException(
                "Variable name = " + name + " does not exist. Make sure you set variable first.");
    }

    private Map<String, Object> getVariablesValues() {
        Map<String, Object> variablesMapObject = new HashMap<>();
        for (Map.Entry<String, Object> entry : variables.entrySet()) {
            String key = entry.getKey();
            Var<?> variable = (Var<?>) entry.getValue();

            Map<String, Object> variableWritableMap = CleverTapTypeUtils.MapUtil.addValue(key, variable.value());
            variablesMapObject.putAll(variableWritableMap);
        }
        return variablesMapObject;
    }

    @SuppressLint("RestrictedApi")
    private Map<String, Object> getVariableValueAsMap(String name) {
        if (variables.containsKey(name)) {
            Var<?> variable = (Var<?>) variables.get(name);
            return CleverTapTypeUtils.MapUtil.addValue(name, variable.value());
        }
        throw new IllegalArgumentException(
                "Variable name = " + name + " does not exist.");
    }

    /**
     * Returns the notification payload as a Map if the application is opened from a terminated (killed) state.
     * It determines whether the app is launched from a notification click rendered by the CleverTap SDK.
     * If so, it adds a {@code notificationLaunchedApp} flag with a value of true to the result map; otherwise,
     * the flag remains false.
     *
     * @param result The result object used for communicating the launch notification data.
     */
    private void getAppLaunchNotification(Result result) {
        Map<String, Object> appLaunchNotificationMap = new HashMap<>();
        boolean notificationLaunchedApp = false;

        if(activity != null) {
            Intent launchIntent = activity.getIntent();
            if (launchIntent != null) {
                Bundle intentExtras = launchIntent.getExtras();
                // notificationLaunchedApp is true when intentExtras is non-null and app is launched from a
                // notification click which was rendered by the CleverTap SDK.
                notificationLaunchedApp = intentExtras != null &&
                        intentExtras.containsKey("wzrk_pn") && intentExtras.containsKey("nm");
                if (notificationLaunchedApp) {
                    Map notificationPayload = Utils.bundleToMap(intentExtras);
                    appLaunchNotificationMap.put("notificationPayload", notificationPayload);
                }
            }
        }
        appLaunchNotificationMap.put("notificationLaunchedApp", notificationLaunchedApp);
        result.success(appLaunchNotificationMap);
    }

    @SuppressLint("RestrictedApi")
    private void setLibrary(MethodCall call, Result result) {
        String libName = call.argument("libName");
        int libVersion = call.argument("libVersion");
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.setCustomSdkVersion(libName, libVersion);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
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
        invokeMethodOnUiThread("profileDataUpdated", Utils.jsonToMap(updates));
    }

    @Override
    public void profileDidInitialize(String CleverTapID) {
        invokeMethodOnUiThread("profileDidInitialize", CleverTapID);
    }

    @Override
    public void onPushPermissionResponse(boolean accepted) {
        invokeMethodOnUiThread("pushPermissionResponseReceived", accepted);
    }

    private void activate(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.productConfig().activate();
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    /**
     * Renders both core and push template notifications and also handles the signedcall push
     */
    private void renderNotification(MethodCall call, Result result) {
        String extras = call.argument("extras");
        if (isCleverTapNotNull(cleverTapAPI)) {
            boolean isSuccess;
            try {
                Log.d(TAG, "renderNotification Android");
                Bundle messageBundle = Utils.stringToBundle(extras);
                isSuccess = PushNotificationHandler.getPushNotificationHandler()
                        .onMessageReceived(context, messageBundle, PushType.FCM.toString());
                if (isSuccess) {
                    result.success(null);
                } else {
                    throw new Exception("Unable to process notification rendering");
                }
            } catch (JSONException e) {
                result.error(TAG, "Unable to render notification due to JSONException - " + e.getLocalizedMessage(),
                        null);
            } catch (Exception e) {
                result.error(TAG, e.getLocalizedMessage(), null);
            }
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
        } else {
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
        } else {
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
        } else {
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
        } else {
            result.error(TAG, ANDROID_O_CREATE_CHANNEL_ERROR_MSG, null);
        }
    }

    private void promptPushPrimer(MethodCall call, Result result) {
        Map<String, Object> localInAppAttributeMap = call.arguments();
        if (isCleverTapNotNull(cleverTapAPI)) {
            JSONObject jsonObject = Utils.localInAppFromMap(localInAppAttributeMap);
            cleverTapAPI.promptPushPrimer(jsonObject);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void promptForPushNotification(MethodCall call, Result result) {
        boolean fallbackToSettings = call.arguments();
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.promptForPushPermission(fallbackToSettings);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void getPushNotificationPermissionStatus(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            result.success(cleverTapAPI.isPushPermissionGranted());
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    private void unregisterPushPermissionNotificationResponseListener(Result result){
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.unregisterPushPermissionNotificationResponseListener(this);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
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

    public void deleteInboxMessagesForIds(MethodCall call, Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            ArrayList<String> messageIds = call.argument("messageIds");
            cleverTapAPI.deleteInboxMessagesForIDs(messageIds);
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
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

    public void markReadInboxMessagesForIds(MethodCall call, Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            ArrayList<String> messageIds = call.argument("messageIds");
            cleverTapAPI.markReadInboxMessagesForIDs(messageIds);
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
                    result.success(Utils.jsonToMap(displayUnit));
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
                result.success(Utils.jsonToMap(inboxMessage.getData()));
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
        Log.d(TAG, "methodChannelSet in invokeMethodOnUiThread(String) is of size " + nativeToDartMethodChannelSet.size());

        for(MethodChannel channel : nativeToDartMethodChannelSet) {
            if (channel != null) {
                Log.d(TAG, "methodChannelSet in invokeMethodOnUiThread(String) " +  channel);
                runOnMainThread(() -> {
                    if (!cleverTapID.isEmpty()) {
                        channel.invokeMethod(methodName, cleverTapID);
                    } else {
                        channel.invokeMethod(methodName, null);
                    }
                });
            }
        }
    }

    @SuppressWarnings("SameParameterValue")
    private void invokeMethodOnUiThread(final String methodName, final boolean params) {
        Log.d(TAG, "methodChannelSet in invokeMethodOnUiThread(boolean) is of size" + nativeToDartMethodChannelSet.size());

        for(MethodChannel channel : nativeToDartMethodChannelSet) {
            if (channel != null) {
                Log.d(TAG, "methodChannelSet in invokeMethodOnUiThread(boolean) " + channel);
                runOnMainThread(() -> channel.invokeMethod(methodName, params));
            }
        }
    }

    private void invokeMethodOnUiThread(final String methodName, final Map map) {
        Log.d(TAG, "methodChannelSet in invokeMethodOnUiThread(Map) is of size " + nativeToDartMethodChannelSet.size());

        for(MethodChannel channel : nativeToDartMethodChannelSet) {
            if (channel != null) {
                Log.d(TAG, "methodChannel in invokeMethodOnUiThread(Map) " + channel);
                runOnMainThread(() -> channel.invokeMethod(methodName, map));
            }
        }
    }

    @SuppressWarnings("SameParameterValue")
    private void invokeMethodOnUiThread(final String methodName, final ArrayList list) {
        Log.d(TAG, "methodChannelSet in invokeMethodOnUiThread(ArrayList) is of size " + nativeToDartMethodChannelSet.size());

        for(MethodChannel channel : nativeToDartMethodChannelSet) {
            if (channel != null) {
                Log.d(TAG, "methodChannel in invokeMethodOnUiThread(ArrayList)" + channel);
                runOnMainThread(() -> channel.invokeMethod(methodName, list));
            }
        }
    }

    private boolean isCleverTapNotNull(CleverTapAPI cleverTapAPI) {
        return cleverTapAPI != null;
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
        Map<String, Object> extras = call.argument("extras");
        if (isCleverTapNotNull(cleverTapAPI)) {
            try {
                CleverTapAPI.processPushNotification(context, Utils.jsonToBundle(new JSONObject(extras)));
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
        int interval = call.argument("interval");
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
        String region = call.argument("region");
        if (isCleverTapNotNull(cleverTapAPI)) {
            switch (type.getType()) {
                case "fcm":
                    cleverTapAPI.pushFcmRegistrationId(token, true);
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

    private MethodChannel getMethodChannel(String channelName, BinaryMessenger messenger, Registrar registrar) {
        if (registrar != null) {
            //V1 setup
            return new MethodChannel(registrar.messenger(), channelName);
        } else {
            //V2 setup
            return new MethodChannel(messenger, channelName);
        }
    }

    private void setupPlugin(Context context, BinaryMessenger messenger, Registrar registrar) {
        this.dartToNativeMethodChannel = getMethodChannel("clevertap_plugin/dart_to_native", messenger, registrar);

        // lastNativeToDartMethodChannel is added to a set and not kept as a static field to ensure callbacks work when a background isolate is spawned
        // Background Isolates are spawned by several libraries like flutter_workmanager and flutter_firebasemessaging
        lastNativeToDartMethodChannel = getMethodChannel("clevertap_plugin/native_to_dart", messenger, registrar);
        nativeToDartMethodChannelSet.add(lastNativeToDartMethodChannel);

        this.dartToNativeMethodChannel.setMethodCallHandler(this);
        this.context = context.getApplicationContext();
        this.cleverTapAPI = CleverTapAPI.getDefaultInstance(this.context);
        if (this.cleverTapAPI != null) {
            this.cleverTapAPI.setCTPushNotificationListener(this);
            this.cleverTapAPI.setCTNotificationInboxListener(this);
            this.cleverTapAPI.setInboxMessageButtonListener(this);
            this.cleverTapAPI.setCTInboxMessageListener(this);
            this.cleverTapAPI.setInAppNotificationButtonListener(this);
            this.cleverTapAPI.setInAppNotificationListener(this);
            this.cleverTapAPI.setSyncListener(this);
            this.cleverTapAPI.setDisplayUnitListener(this);
            this.cleverTapAPI.setCTFeatureFlagsListener(this);
            this.cleverTapAPI.setCTProductConfigListener(this);
            this.cleverTapAPI.setCTPushAmpListener(this);
            this.cleverTapAPI.setLibrary("Flutter");
            this.cleverTapAPI.registerPushPermissionNotificationResponseListener(this);
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

    private void dismissInbox(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.dismissAppInbox();
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    public void syncCustomTemplates(Result result) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            cleverTapAPI.syncRegisteredInAppTemplates();
            result.success(null);
        } else {
            result.error(TAG, ERROR_MSG, null);
        }
    }

    public void customTemplateSetDismissed(String templateName, Result result) {
        resolveWithTemplateContext(templateName, result, templateContext -> {
            templateContext.setDismissed();
            return null;
        });
    }

    public void customTemplateSetPresented(String templateName, Result result) {
        resolveWithTemplateContext(templateName, result, templateContext -> {
            templateContext.setPresented();
            return null;
        });
    }

    public void customTemplateRunAction(String templateName, String argName, Result result) {
        resolveWithTemplateContext(
                templateName,
                result,
                customTemplateContext -> {
                    if (customTemplateContext instanceof CustomTemplateContext.TemplateContext) {
                        ((CustomTemplateContext.TemplateContext) customTemplateContext).triggerActionArgument(argName, null);
                    }
                    return null;
                }
        );
    }

    public void customTemplateGetStringArg(String templateName, String argName, Result result) {
        resolveWithTemplateContext(
                templateName,
                result,
                templateContext -> templateContext.getString(argName)
        );
    }

    public void customTemplateGetNumberArg(String templateName, String argName, Result result) {
        resolveWithTemplateContext(
                templateName,
                result,
                templateContext -> templateContext.getDouble(argName)
        );
    }

    public void customTemplateGetBooleanArg(String templateName, String argName, Result result) {
        resolveWithTemplateContext(
                templateName,
                result,
                templateContext -> templateContext.getBoolean(argName)
        );
    }

    public void customTemplateGetFileArg(String templateName, String argName, Result result) {
        resolveWithTemplateContext(
                templateName,
                result,
                templateContext -> templateContext.getFile(argName)
        );
    }

    public void customTemplateGetObjectArg(String templateName, String argName, Result result) {
        resolveWithTemplateContext(
                templateName,
                result,
                templateContext -> {
                    Map<String, Object> mapArg = templateContext.getMap(argName);
                    /*if (mapArg != null) {
                        return CleverTapUtils.MapUtil.toWritableMap(mapArg);
                    } else {
                        return null;
                    }*/

                    return mapArg;
                }
        );
    }

    public void customTemplateContextToString(String templateName, Result result) {
        resolveWithTemplateContext(
                templateName,
                result,
                templateContext -> templateContext.toString()
        );
    }

    private void resolveWithTemplateContext(
            String templateName,
            Result result,
            TemplateContextAction action
    ) {
        if (isCleverTapNotNull(cleverTapAPI)) {
            CustomTemplateContext templateContext = cleverTapAPI.getActiveContextForTemplate(templateName);
            if (templateContext != null) {
                result.success(action.execute(templateContext));
            } else {
                result.error(
                        TAG,
                        ERROR_TEMPLATE_NAME,
                        "For template" + templateName
                );
            }
        } else {
            result.error(
                    TAG,
                    ERROR_MSG,
                    "Cannot resolve template with context" // todo check if needed
            );
        }
    }

    @FunctionalInterface
    private interface TemplateContextAction {
        Object execute(CustomTemplateContext context);
    }
}
