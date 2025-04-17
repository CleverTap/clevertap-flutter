package com.clevertap.clevertap_plugin

import android.annotation.SuppressLint
import android.content.Context
import android.location.Location
import android.os.Build
import android.os.Looper
import android.util.Log
import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.sdk.UTMDetail
import com.clevertap.android.sdk.events.EventDetail
import com.clevertap.android.sdk.inapp.callbacks.FetchInAppsCallback
import com.clevertap.android.sdk.inapp.customtemplates.CustomTemplateContext
import com.clevertap.android.sdk.inbox.CTInboxMessage
import com.clevertap.android.sdk.pushnotification.PushConstants
import com.clevertap.android.sdk.pushnotification.PushNotificationHandler
import com.clevertap.android.sdk.usereventlogs.UserEventLog
import com.clevertap.android.sdk.variables.Var
import com.clevertap.android.sdk.variables.callbacks.VariableCallback
import com.clevertap.android.sdk.variables.callbacks.VariablesChangedCallback
import com.clevertap.clevertap_plugin.CleverTapTypeUtils.LongUtil
import com.clevertap.clevertap_plugin.isolate.IsolateHandlePreferences
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import io.flutter.plugin.common.MethodChannel.MethodCallHandler
import org.json.JSONException
import org.json.JSONObject
import java.util.concurrent.Executors

@Suppress("DEPRECATION")
class DartToNativePlatformCommunicator(
    private val context: Context,
    private val cleverTapAPI: CleverTapAPI?
) : MethodCallHandler {

    private val notificationExecutor = Executors.newSingleThreadExecutor()

    companion object {
        const val TAG = "DartToNative"

        const val ANDROID_O_DELETE_NOTIFICATION_ERROR_MSG: String =
            "Unable to delete notification " +
                    "for devices less than 26(O)"


        private const val ERROR_MSG: String = "CleverTap Instance is not initialized"

        private const val ERROR_MSG_PUSH_TYPE: String = "Couldn't parse PushType. Please provide a non-null type and prefKey"

        private const val ANDROID_O_CREATE_CHANNEL_ERROR_MSG: String =
            "Unable to create notification channels" +
                    "for devices less than 26(O)"


        private const val ERROR_MSG_ID: String = "Message Id is null or empty"


        private const val ERROR_IOS: String = " method is only applicable for iOS"


        private val ERROR_TEMPLATE_NAME: (templateName: String) -> String = { templateName ->
            "Custom template: $templateName not currently being presented"
        }

        private val ERROR_EMIT_EVENT_PROBLEM: (name: String?) -> String = { methodName ->
            "Incorrect Clevertap event disabled, no such event - $methodName"
        }

        private const val KEY_TEMPLATE_NAME_CC: String = "templateName"

        private const val KEY_TEMPLATE_ARGUMENT_CC: String = "argName"

        private const val KEY_EVENT_NAME: String = "eventName"

        val variables: HashMap<String, Any> = java.util.HashMap()
    }

    override fun onMethodCall(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        when (call.method) {
            "startEmission" -> {
                startEmission(call = call, result = result)
            }
            "getAppLaunchNotification" -> {
                getAppLaunchNotification(result)
            }

            "setLibrary" -> {
                setLibrary(call, result)
            }

            "setDebugLevel" -> {
                val debugLevelValue = call.argument<Int>("debugLevel")!!
                CleverTapAPI.setDebugLevel(debugLevelValue)
                result.success(null)
            }

            "registerKilledStateNotificationClickedHandler" -> {
                val dispatcherHandle =
                    LongUtil.parseLong(call.argument(Constants.DISPATCHER_HANDLE))
                val callbackHandle = LongUtil.parseLong(call.argument(Constants.CALLBACK_HANDLE))
                if (dispatcherHandle != null && callbackHandle != null) {
                    IsolateHandlePreferences.saveCallbackKeys(
                        context,
                        dispatcherHandle,
                        callbackHandle
                    )
                }
            }

            "setLocale" -> {
                setLocale(call, result)
            }

            "setPushToken" -> {
                setFCMPushToken(call, result)
            }

            "createNotification" -> {
                renderNotification(call, result)
            }

            "processPushNotification" -> {
                processPushNotification(call, result)
            }

            "pushRegistrationToken" -> {
                pushRegistrationToken(call, result)
            }

            "createNotificationChannel" -> {
                createNotificationChannel(call, result)
            }

            "createNotificationChannelWithSound" -> {
                createNotificationChannelWithSound(call, result)
            }

            "createNotificationChannelWithGroupId" -> {
                createNotificationChannelWithGroupId(call, result)
            }

            "createNotificationChannelWithGroupIdAndSound" -> {
                createNotificationChannelWithGroupIdAndSound(call, result)
            }

            "createNotificationChannelGroup" -> {
                createNotificationChannelGroup(call, result)
            }

            "deleteNotificationChannel" -> {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    val channelId = call.argument<String>("channelId")
                    CleverTapAPI.deleteNotificationChannel(context, channelId)
                    result.success(null)
                } else {
                    result.error(
                        TAG,
                        ANDROID_O_DELETE_NOTIFICATION_ERROR_MSG,
                        null
                    )
                }
            }

            "deleteNotificationChannelGroup" -> {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    val groupId = call.argument<String>("groupId")
                    CleverTapAPI.deleteNotificationChannelGroup(context, groupId)
                    result.success(null)
                } else {
                    result.error(
                        TAG,
                        ANDROID_O_DELETE_NOTIFICATION_ERROR_MSG,
                        null
                    )
                }
            }

            "promptPushPrimer" -> {
                promptPushPrimer(call, result)
            }

            "promptForPushNotification" -> {
                promptForPushNotification(call, result)
            }

            "getPushNotificationPermissionStatus" -> {
                getPushNotificationPermissionStatus(result)
            }

            "unregisterPushPermissionNotificationResponseListener" -> {
                unregisterPushPermissionNotificationResponseListener(result)
            }

            "setOptOut" -> {
                setOptOut(call, result)
            }

            "setOffline" -> {
                setOffline(call, result)
            }

            "enableDeviceNetworkInfoReporting" -> {
                enableDeviceNetworkInfoReporting(call, result)
            }

            "enablePersonalization" -> {
                setPersonalization(result, true)
            }

            "disablePersonalization" -> {
                setPersonalization(result, false)
            }

            "recordScreenView" -> {
                recordScreenView(call, result)
            }

            "recordEvent" -> {
                recordEvent(call, result)
            }

            "recordChargedEvent" -> {
                recordChargedEvent(call, result)
            }

            "eventGetFirstTime" -> {
                eventGetFirstTime(call, result)
            }

            "eventGetLastTime" -> {
                eventGetLastTime(call, result)
            }

            "eventGetOccurrences" -> {
                eventGetOccurrences(call, result)
            }

            "eventGetDetail" -> {
                eventGetDetail(call, result)
            }

            "getEventHistory" -> {
                getEventHistory(result)
            }

            "getUserEventLog" -> {
                val eventName = call.argument<String>(KEY_EVENT_NAME)
                getUserEventLog(eventName, result)
            }
            "getUserEventLogCount" -> {
                val eventName = call.argument<String>(KEY_EVENT_NAME)
                getUserEventLogCount(eventName, result)
            }
            "getUserEventLogHistory" -> {
                getUserEventLogHistory(result)
            }
            "getUserAppLaunchCount" -> {
                getUserAppLaunchCount(result)
            }
            "getUserLastVisitTs" -> {
                getUserLastVisitTs(result)
            }

            "pushNotificationClickedEvent" -> {
                pushNotificationClickedEvent(call, result)
            }

            "pushNotificationViewedEvent" -> {
                pushNotificationViewedEvent(call, result)
            }

            "setLocation" -> {
                setLocation(call, result)
            }

            "profileGetCleverTapAttributionIdentifier" -> {
                profileGetCleverTapAttributionIdentifier(result)
            }

            "profileGetCleverTapID" -> {
                profileGetCleverTapID(result)
            }

            "getCleverTapID" -> {
                getCleverTapID(result)
            }

            "onUserLogin" -> {
                onUserLogin(call, result)
            }

            "profileSet" -> {
                profileSet(call, result)
            }

            "profileGetProperty" -> {
                profileGetProperty(call, result)
            }

            "profileRemoveValueForKey" -> {
                profileRemoveValueForKey(call, result)
            }

            "profileSetMultiValues" -> {
                profileSetMultiValues(call, result)
            }

            "profileAddMultiValue" -> {
                profileAddMultiValue(call, result)
            }

            "profileIncrementValue" -> {
                profileIncrementValue(call, result)
            }

            "profileDecrementValue" -> {
                profileDecrementValue(call, result)
            }

            "profileAddMultiValues" -> {
                profileAddMultiValues(call, result)
            }

            "profileRemoveMultiValue" -> {
                profileRemoveMultiValue(call, result)
            }

            "profileRemoveMultiValues" -> {
                profileRemoveMultiValues(call, result)
            }

            "pushInstallReferrer" -> {
                pushInstallReferrer(call, result)
            }

            "sessionGetTimeElapsed" -> {
                sessionGetTimeElapsed(result)
            }

            "sessionGetTotalVisits" -> {
                sessionGetTotalVisits(result)
            }

            "sessionGetScreenCount" -> {
                sessionGetScreenCount(result)
            }

            "sessionGetPreviousVisitTime" -> {
                sessionGetPreviousVisitTime(result)
            }

            "sessionGetUTMDetails" -> {
                sessionGetUTMDetails(result)
            }

            "suspendInAppNotifications" -> {
                suspendInAppNotifications(result)
            }

            "discardInAppNotifications" -> {
                discardInAppNotifications(result)
            }

            "resumeInAppNotifications" -> {
                resumeInAppNotifications(result)
            }

            "initializeInbox" -> {
                initializeInbox(result)
            }

            "showInbox" -> {
                showInbox(call, result)
            }

            "dismissInbox" -> {
                dismissInbox(result)
            }

            "getInboxMessageCount" -> {
                getInboxMessageCount(result)
            }

            "getInboxMessageUnreadCount" -> {
                getInboxMessageUnreadCount(result)
            }

            "getAllInboxMessages" -> {
                getAllInboxMessages(result)
            }

            "getUnreadInboxMessages" -> {
                getUnreadInboxMessages(result)
            }

            "getInboxMessageForId" -> {
                getInboxMessageForId(call, result)
            }

            "deleteInboxMessageForId" -> {
                deleteInboxMessageForId(call, result)
            }

            "deleteInboxMessagesForIds" -> {
                deleteInboxMessagesForIds(call, result)
            }

            "markReadInboxMessageForId" -> {
                markReadInboxMessageForId(call, result)
            }

            "markReadInboxMessagesForIds" -> {
                markReadInboxMessagesForIds(call, result)
            }

            "pushInboxNotificationClickedEventForId" -> {
                pushInboxNotificationClickedEventForId(call, result)
            }

            "pushInboxNotificationViewedEventForId" -> {
                pushInboxNotificationViewedEventForId(call, result)
            }

            "syncVariables" -> {
                syncVariables(result)
            }

            "syncVariablesinProd" -> {
                Log.d(TAG, "syncVariablesinProd$ERROR_IOS")
            }

            "defineVariables" -> {
                defineVariables(call, result)
            }

            "defineFileVariable" -> {
                defineFileVariable(call, result)
            }

            "fetchVariables" -> {
                fetchVariables(result)
            }

            "getVariable" -> {
                getVariable(call, result)
            }

            "getVariables" -> {
                getVariables(result)
            }

            "onVariablesChanged" -> {
                onVariablesChanged()
            }

            "onOneTimeVariablesChanged" -> {
                onOneTimeVariablesChanged()
            }

            "onVariablesChangedAndNoDownloadsPending" -> {
                onVariablesChangedAndNoDownloadsPending()
            }

            "onceVariablesChangedAndNoDownloadsPending" -> {
                onceVariablesChangedAndNoDownloadsPending()
            }

            "onValueChanged" -> {
                onValueChanged(call)
            }

            "onFileValueChanged" -> {
                onFileValueChanged(call)
            }

            "fetchInApps" -> {
                fetchInApps(result)
            }

            "clearInAppResources" -> {
                clearInAppResources(call, result)
            }

            "getAllDisplayUnits" -> {
                getAllDisplayUnits(result)
            }

            "getDisplayUnitForId" -> {
                getDisplayUnitForId(call, result)
            }

            "pushDisplayUnitViewedEvent" -> {
                pushDisplayUnitViewedEvent(call, result)
            }

            "pushDisplayUnitClickedEvent" -> {
                pushDisplayUnitClickedEvent(call, result)
            }

            "getFeatureFlag" -> {
                getFeatureFlag(call, result)
            }

            "setDefaultsMap" -> {
                setDefaultsMap(call, result)
            }

            "fetch" -> {
                fetch(result)
            }

            "fetchWithMinimumFetchIntervalInSeconds" -> {
                fetchWithMinimumFetchIntervalInSeconds(call, result)
            }

            "activate" -> {
                activate(result)
            }

            "fetchAndActivate" -> {
                fetchAndActivate(result)
            }

            "setMinimumFetchIntervalInSeconds" -> {
                setMinimumFetchIntervalInSeconds(call, result)
            }

            "getLastFetchTimeStampInMillis" -> {
                getLastFetchTimeStampInMillis(result)
            }

            "getString" -> {
                getString(call, result)
            }

            "getBoolean" -> {
                getBoolean(call, result)
            }

            "getLong" -> {
                getLong(call, result)
            }

            "getDouble" -> {
                getDouble(call, result)
            }

            "registerForPush" -> {
                Log.d(TAG, "registerForPush$ERROR_IOS")
            }

            "getInitialUrl" -> {
                Log.d(TAG, "getInitialUrl$ERROR_IOS")
            }

            "syncCustomTemplatesInProd", "syncCustomTemplates" -> {
                syncCustomTemplates(result)
            }

            "customTemplateSetDismissed" -> {
                val templateName = call.arguments<String>()
                customTemplateSetDismissed(templateName, result)
            }

            "customTemplateSetPresented" -> {
                val templateName = call.arguments<String>()
                customTemplateSetPresented(templateName, result)
            }

            "customTemplateRunAction" -> {
                val templateName = call.argument<String>(KEY_TEMPLATE_NAME_CC)
                val argumentName = call.argument<String>(KEY_TEMPLATE_ARGUMENT_CC)
                customTemplateRunAction(
                    templateName = templateName,
                    argName = argumentName,
                    result = result
                )
            }

            "customTemplateGetStringArg" -> {
                val templateName = call.argument<String>(KEY_TEMPLATE_NAME_CC)
                val argumentName = call.argument<String>(KEY_TEMPLATE_ARGUMENT_CC)
                customTemplateGetStringArg(
                    templateName = templateName,
                    argName = argumentName,
                    result = result
                )
            }

            "customTemplateGetNumberArg" -> {
                val templateName = call.argument<String>(KEY_TEMPLATE_NAME_CC)
                val argumentName = call.argument<String>(KEY_TEMPLATE_ARGUMENT_CC)
                customTemplateGetNumberArg(
                    templateName = templateName,
                    argName = argumentName,
                    result = result
                )
            }

            "customTemplateGetBooleanArg" -> {
                val templateName = call.argument<String>(KEY_TEMPLATE_NAME_CC)
                val argumentName = call.argument<String>(KEY_TEMPLATE_ARGUMENT_CC)
                customTemplateGetBooleanArg(
                    templateName = templateName,
                    argName = argumentName,
                    result = result
                )
            }

            "customTemplateGetFileArg" -> {
                val templateName = call.argument<String>(KEY_TEMPLATE_NAME_CC)
                val argumentName = call.argument<String>(KEY_TEMPLATE_ARGUMENT_CC)
                customTemplateGetFileArg(
                    templateName = templateName,
                    argName = argumentName,
                    result = result
                )
            }

            "customTemplateGetObjectArg" -> {
                val templateName = call.argument<String>(KEY_TEMPLATE_NAME_CC)
                val argumentName = call.argument<String>(KEY_TEMPLATE_ARGUMENT_CC)
                customTemplateGetObjectArg(
                    templateName = templateName,
                    argName = argumentName,
                    result = result
                )
            }

            "customTemplateContextToString" -> {
                val templateName = call.arguments<String>()
                customTemplateContextToString(
                    templateName = templateName,
                    result = result
                )
            }

            else -> {
                result.notImplemented()
            }
        }
    }

    private fun startEmission(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        val flushForEvent = call.arguments<String>()

        if (flushForEvent == null) {
            result.error(TAG, ERROR_EMIT_EVENT_PROBLEM(flushForEvent), null)
            return
        }

        val ctEvent = CleverTapEvent.fromName(flushForEvent)
        if (ctEvent == CleverTapEvent.CLEVERTAP_UNKNOWN) {
            result.error(TAG, ERROR_EMIT_EVENT_PROBLEM(flushForEvent), null)
            return
        }

        CleverTapEventEmitter.flushBuffer(ctEvent)
        CleverTapEventEmitter.disableBuffer(ctEvent)
        result.success(true)
    }

    private fun setLocale(call: MethodCall, result: MethodChannel.Result) {
        val locale = call.arguments<String>()
        if (cleverTapAPI != null) {
            cleverTapAPI.setLocale(locale)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun syncVariables(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            cleverTapAPI.syncVariables()
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun defineVariables(call: MethodCall, result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            val variablesMap = call.argument<Map<String, Any>>("variables")!!
            for ((key, value) in variablesMap) {
                variables[key] = cleverTapAPI.defineVariable<Any>(key, value)
            }
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun defineFileVariable(call: MethodCall, result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            val fileVar = call.argument<String>("fileVariable")
            variables[fileVar!!] = cleverTapAPI.defineFileVariable(fileVar)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun fetchVariables(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            cleverTapAPI.fetchVariables { isSuccess ->
                result.success(
                    isSuccess
                )
            }
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getVariable(call: MethodCall, result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            try {
                val key = call.argument<String>("name")
                result.success(getVariableValue(key!!))
            } catch (e: Exception) {
                result.error(
                    TAG,
                    "Unable to get the variable value: " + e.localizedMessage,
                    null
                )
            }
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getVariables(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            try {
                result.success(getVariablesValues())
            } catch (e: Exception) {
                result.error(
                    TAG,
                    "Unable to get the variable value: " + e.localizedMessage,
                    null
                )
            }
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun onVariablesChanged() {
        if (cleverTapAPI != null) {
            cleverTapAPI.addVariablesChangedCallback(object : VariablesChangedCallback() {
                override fun variablesChanged() {
                    CleverTapPlugin.invokeMethodOnUiThread(
                        "onVariablesChanged",
                        getVariablesValues()
                    )
                }
            })
        } else {
            Log.d(TAG, ERROR_MSG)
        }
    }

    private fun onOneTimeVariablesChanged() {
        if (cleverTapAPI != null) {
            cleverTapAPI.addOneTimeVariablesChangedCallback(object : VariablesChangedCallback() {
                override fun variablesChanged() {
                    CleverTapPlugin.invokeMethodOnUiThread(
                        "onOneTimeVariablesChanged",
                        getVariablesValues()
                    )
                }
            })
        } else {
            Log.d(TAG, ERROR_MSG)
        }
    }

    private fun onVariablesChangedAndNoDownloadsPending() {
        if (cleverTapAPI != null) {
            cleverTapAPI.onVariablesChangedAndNoDownloadsPending(object :
                VariablesChangedCallback() {
                override fun variablesChanged() {
                    CleverTapPlugin.invokeMethodOnUiThread(
                        "onVariablesChangedAndNoDownloadsPending",
                        getVariablesValues()
                    )
                }
            })
        } else {
            Log.d(TAG, ERROR_MSG)
        }
    }

    private fun onceVariablesChangedAndNoDownloadsPending() {
        if (cleverTapAPI != null) {
            cleverTapAPI.onceVariablesChangedAndNoDownloadsPending(object :
                VariablesChangedCallback() {
                override fun variablesChanged() {
                    CleverTapPlugin.invokeMethodOnUiThread(
                        "onceVariablesChangedAndNoDownloadsPending",
                        getVariablesValues()
                    )
                }
            })
        } else {
            Log.d(TAG, ERROR_MSG)
        }
    }

    private fun onValueChanged(call: MethodCall) {
        val name = call.argument<String>("name")
        if (variables.containsKey(name)) {
            val `var` = variables[name] as Var<Any>?
            if (`var` != null) {
                `var`.addValueChangedCallback(object : VariableCallback<Any?>() {
                    @SuppressLint("RestrictedApi")
                    override fun onValueChanged(variable: Var<Any?>) {
                        var variablesMap: Map<String, Any> = HashMap()
                        try {
                            variablesMap = getVariableValueAsMap(name!!)
                        } catch (e: Exception) {
                            Log.d(
                                TAG,
                                "Unable to handle onValueChanged callback: " + e.localizedMessage,
                                null
                            )
                        }
                        CleverTapPlugin.invokeMethodOnUiThread("onValueChanged", variablesMap)
                    }
                })
            } else {
                val errorMessage =
                    "Variable value with name = $name contains null value. Not setting onValueChanged callback."
                Log.d(TAG, errorMessage)
            }
        } else {
            val errorMessage =
                "Variable name = $name does not exist. Make sure you set variable first."
            Log.e(TAG, errorMessage)
        }
    }

    private fun onFileValueChanged(call: MethodCall) {
        val name = call.argument<String>("name")
        if (variables.containsKey(name)) {
            val `var` = variables[name] as Var<Any>?
            if (`var` != null) {
                `var`.addFileReadyHandler(object : VariableCallback<Any?>() {
                    @SuppressLint("RestrictedApi")
                    override fun onValueChanged(variable: Var<Any?>) {
                        var variablesMap: Map<String, Any> = HashMap()
                        try {
                            variablesMap = getVariableValueAsMap(name!!)
                        } catch (e: Exception) {
                            Log.d(
                                TAG,
                                "Unable to handle onValueChanged callback: " + e.localizedMessage,
                                null
                            )
                        }
                        CleverTapPlugin.invokeMethodOnUiThread("onFileValueChanged", variablesMap)
                    }
                })
            } else {
                val errorMessage =
                    "Variable value with name = $name contains null value. Not setting onValueChanged callback."
                Log.d(TAG, errorMessage)
            }
        } else {
            val errorMessage =
                "Variable name = $name does not exist. Make sure you set variable first."
            Log.e(TAG, errorMessage)
        }
    }

    private fun fetchInApps(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            cleverTapAPI.fetchInApps(object : FetchInAppsCallback {
                override fun onInAppsFetched(isSuccess: Boolean) {
                    result.success(isSuccess)
                }
            })
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun clearInAppResources(call: MethodCall, result: MethodChannel.Result) {
        val expiredOnly = call.arguments<Boolean>()!!
        if (cleverTapAPI != null) {
            cleverTapAPI.clearInAppResources(expiredOnly)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    /************************************************
     * Product Experience Remote Config methods ends
     */
    @SuppressLint("RestrictedApi")
    private fun getVariableValue(name: String): Any {
        if (variables.containsKey(name)) {
            val variable = variables[name] as Var<*>?
            return variable!!.value()
        }
        throw IllegalArgumentException(
            "Variable name = $name does not exist. Make sure you set variable first."
        )
    }

    private fun getVariablesValues(): Map<String, Any> {
        val variablesMapObject: MutableMap<String, Any> = java.util.HashMap()
        for ((key, value) in variables) {
            val variable = value as Var<*>

            val variableWritableMap = CleverTapTypeUtils.MapUtil.addValue(key, variable.value())
            variablesMapObject.putAll(variableWritableMap)
        }
        return variablesMapObject
    }

    @SuppressLint("RestrictedApi")
    private fun getVariableValueAsMap(name: String): Map<String, Any> {
        if (variables.containsKey(name)) {
            val variable = variables[name] as Var<*>?
            return CleverTapTypeUtils.MapUtil.addValue(name, variable!!.value())
        }
        throw IllegalArgumentException(
            "Variable name = $name does not exist."
        )
    }

    /**
     * Returns the notification payload as a Map if the application is opened from a terminated (killed) state.
     * It determines whether the app is launched from a notification click rendered by the CleverTap SDK.
     * If so, it adds a `notificationLaunchedApp` flag with a value of true to the result map; otherwise,
     * the flag remains false.
     *
     * @param result The result object used for communicating the launch notification data.
     */
    private fun getAppLaunchNotification(result: MethodChannel.Result) {
        val appLaunchNotificationMap: MutableMap<String, Any> = java.util.HashMap()
        var notificationLaunchedApp = false

        if (CleverTapPlugin.activity != null && CleverTapPlugin.activity.get() != null) {
            val launchIntent = CleverTapPlugin.activity.get()?.intent
            if (launchIntent != null) {
                val intentExtras = launchIntent.extras
                // notificationLaunchedApp is true when intentExtras is non-null and app is launched from a
                // notification click which was rendered by the CleverTap SDK.
                notificationLaunchedApp = intentExtras != null &&
                        intentExtras.containsKey("wzrk_pn") && intentExtras.containsKey("nm")
                if (notificationLaunchedApp) {
                    val notificationPayload: Map<*, *> = Utils.bundleToMap(intentExtras)
                    appLaunchNotificationMap["notificationPayload"] = notificationPayload
                }
            }
        }
        appLaunchNotificationMap["notificationLaunchedApp"] = notificationLaunchedApp
        result.success(appLaunchNotificationMap)
    }

    @SuppressLint("RestrictedApi")
    private fun setLibrary(call: MethodCall, result: MethodChannel.Result) {
        val libName = call.argument<String>("libName")
        val libVersion = call.argument<Int>("libVersion")!!
        if (cleverTapAPI != null) {
            cleverTapAPI.setCustomSdkVersion(libName, libVersion)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun activate(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            cleverTapAPI.productConfig().activate()
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    /**
     * Renders both core and push template notifications and also handles the signedcall push
     */
    private fun renderNotification(call: MethodCall, result: MethodChannel.Result) {
        val extras = call.argument<String>("extras")
        if (cleverTapAPI == null) {
            result.error(TAG, ERROR_MSG, null)
        }
        try {
            Log.d(TAG, "renderNotification Android")
            // Check if we're on the main thread. Needed since plugins like FCM provide on message received on the main thread
            if (Looper.myLooper() == Looper.getMainLooper()) {
                // We're on the main thread, execute on a background thread
                notificationExecutor.execute {
                    processNotification(extras, result)
                }
            } else {
                processNotification(extras, result)
            }
        } catch (e: JSONException) {
            result.error(
                TAG,
                "Unable to render notification due to JSONException - " + e.localizedMessage,
                null
            )
        } catch (e: Exception) {
            result.error(TAG, e.localizedMessage, null)
        }
    }

    private fun processNotification(extras: String?, result: MethodChannel.Result) {
        val messageBundle = Utils.stringToBundle(extras)
        val isSuccess = PushNotificationHandler.getPushNotificationHandler()
            .onMessageReceived(context, messageBundle, PushConstants.FCM.type)

        if (isSuccess) {
            result.success(null)
        } else {
            result.error(TAG, "Unable to process notification rendering", null)
        }
    }

    private fun createNotificationChannel(call: MethodCall, result: MethodChannel.Result) {
        CleverTapAPI.createNotificationChannel(
            context,
            call.argument<String>("channelId"),
            call.argument<CharSequence>("channelName"),
            call.argument<String>("channelDescription"),
            call.argument<Int>("importance")!!,
            call.argument<Boolean>("showBadge")!!
        )
        result.success(null)
    }

    private fun createNotificationChannelGroup(call: MethodCall, result: MethodChannel.Result) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val groupId = call.argument<String>("groupId")
            val groupName = call.argument<String>("groupName")
            CleverTapAPI.createNotificationChannelGroup(context, groupId, groupName)
            result.success(null)
        } else {
            result.error(
                TAG,
                ANDROID_O_CREATE_CHANNEL_ERROR_MSG,
                null
            )
        }
    }

    private fun createNotificationChannelWithGroupId(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val showBadge = call.argument<Boolean>("showBadge")!!
            CleverTapAPI.createNotificationChannel(
                context,
                call.argument<String>("channelId"),
                call.argument<CharSequence>("channelName"),
                call.argument<String>("channelDescription"),
                call.argument<Int>("importance")!!,
                call.argument<String>("groupId"),
                showBadge
            )
            result.success(null)
        } else {
            result.error(
                TAG,
                ANDROID_O_CREATE_CHANNEL_ERROR_MSG,
                null
            )
        }
    }

    private fun createNotificationChannelWithGroupIdAndSound(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CleverTapAPI.createNotificationChannel(
                context,
                call.argument<String>("channelId"),
                call.argument<CharSequence>("channelName"),
                call.argument<String>("channelDescription"),
                call.argument<Int>("importance")!!,
                call.argument<String>("groupId"),
                call.argument<Boolean>("showBadge")!!,
                call.argument<String>("sound")
            )
            result.success(null)
        } else {
            result.error(
                TAG,
                ANDROID_O_CREATE_CHANNEL_ERROR_MSG,
                null
            )
        }
    }

    private fun createNotificationChannelWithSound(call: MethodCall, result: MethodChannel.Result) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val sound = call.argument<String>("sound")
            CleverTapAPI.createNotificationChannel(
                context,
                call.argument<String>("channelId"),
                call.argument<CharSequence>("channelName"),
                call.argument<String>("channelDescription"),
                call.argument<Int>("importance")!!,
                call.argument<Boolean>("showBadge")!!,
                sound
            )
            result.success(null)
        } else {
            result.error(
                TAG,
                ANDROID_O_CREATE_CHANNEL_ERROR_MSG,
                null
            )
        }
    }

    private fun promptPushPrimer(call: MethodCall, result: MethodChannel.Result) {
        val localInAppAttributeMap = call.arguments<Map<String, Any>>()!!
        if (cleverTapAPI != null) {
            val jsonObject = Utils.localInAppFromMap(localInAppAttributeMap)
            cleverTapAPI.promptPushPrimer(jsonObject)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun promptForPushNotification(call: MethodCall, result: MethodChannel.Result) {
        val fallbackToSettings = call.arguments<Boolean>()!!
        if (cleverTapAPI != null) {
            cleverTapAPI.promptForPushPermission(fallbackToSettings)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getPushNotificationPermissionStatus(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.isPushPermissionGranted)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun unregisterPushPermissionNotificationResponseListener(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            cleverTapAPI.unregisterPushPermissionNotificationResponseListener(CleverTapListenerProxy)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun deleteInboxMessageForId(call: MethodCall, result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            val messageId = call.argument<String>("messageId")
            if (messageId.isNullOrEmpty()) {
                result.error(TAG, ERROR_MSG_ID, null)
                return
            }
            cleverTapAPI.deleteInboxMessage(messageId)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun deleteInboxMessagesForIds(call: MethodCall, result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            val messageIds = call.argument<ArrayList<String>>("messageIds")!!
            cleverTapAPI.deleteInboxMessagesForIDs(messageIds)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun markReadInboxMessageForId(call: MethodCall, result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            val messageId = call.argument<String>("messageId")
            if (messageId.isNullOrEmpty()) {
                result.error(TAG, ERROR_MSG_ID, null)
                return
            }
            cleverTapAPI.markReadInboxMessage(messageId)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun markReadInboxMessagesForIds(call: MethodCall, result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            val messageIds = call.argument<ArrayList<String>>("messageIds")!!
            cleverTapAPI.markReadInboxMessagesForIDs(messageIds)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun enableDeviceNetworkInfoReporting(call: MethodCall, result: MethodChannel.Result) {
        val value = call.argument<Boolean>("value")!!
        if (cleverTapAPI != null) {
            cleverTapAPI.enableDeviceNetworkInfoReporting(value)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getUserEventLog(eventName: String?, result: MethodChannel.Result) {
        if (cleverTapAPI != null && eventName != null) {
            val eventLog: UserEventLog? = cleverTapAPI.getUserEventLog(eventName)
            result.success(Utils.eventLogToMap(eventLog))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getUserEventLogCount(eventName: String?, result: MethodChannel.Result) {
        if (cleverTapAPI != null && eventName != null) {
            result.success(cleverTapAPI.getUserEventLogCount(eventName))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getUserEventLogHistory(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(Utils.historyEventLogToMap(cleverTapAPI.userEventLogHistory))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getUserAppLaunchCount(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.userAppLaunchCount)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getUserLastVisitTs(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.userLastVisitTs)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    @Deprecated(message = "Deprecated Since v3.1.0")
    private fun eventGetDetail(call: MethodCall, result: MethodChannel.Result) {
        val eventName = call.argument<String>("eventName")
        if (cleverTapAPI != null) {
            val eventDetail: EventDetail = cleverTapAPI.getDetails(eventName)
            result.success(Utils.eventDetailToMap(eventDetail))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    @Deprecated(message = "Deprecated Since v3.1.0")
    private fun eventGetFirstTime(call: MethodCall, result: MethodChannel.Result) {
        val eventName = call.argument<String>("eventName")
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.getFirstTime(eventName))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    @Deprecated(message = "Deprecated Since v3.1.0")
    private fun eventGetLastTime(call: MethodCall, result: MethodChannel.Result) {
        val eventName = call.argument<String>("eventName")
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.getLastTime(eventName))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    @Deprecated(message = "Deprecated Since v3.1.0")
    private fun eventGetOccurrences(call: MethodCall, result: MethodChannel.Result) {
        val eventName = call.argument<String>("eventName")
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.getCount(eventName))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun fetch(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            cleverTapAPI.productConfig().fetch()
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun fetchAndActivate(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            cleverTapAPI.productConfig().fetchAndActivate()
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun fetchWithMinimumFetchIntervalInSeconds(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        val interval = call.argument<Int>("interval")!!
        if (cleverTapAPI != null) {
            cleverTapAPI.productConfig().fetch(interval.toLong())
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getAllDisplayUnits(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(Utils.displayUnitListToArrayList(cleverTapAPI.allDisplayUnits))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getAllInboxMessages(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(Utils.inboxMessageListToArrayList(cleverTapAPI.getAllInboxMessages()))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getBoolean(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.productConfig().getBoolean(key))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getDisplayUnitForId(call: MethodCall, result: MethodChannel.Result) {
        val unitId = call.argument<String>("unitId")
        if (cleverTapAPI != null) {
            if (cleverTapAPI.getDisplayUnitForId(unitId) != null) {
                val displayUnit: JSONObject? = cleverTapAPI.getDisplayUnitForId(unitId)?.jsonObject
                if (displayUnit != null) {
                    result.success(Utils.jsonToMap(displayUnit))
                }
            } else {
                result.error(TAG, "Display Unit is NULL", null)
            }
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getDouble(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.productConfig().getDouble(key))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    @Deprecated(message = "Deprecated Since v3.1.0")
    private fun getEventHistory(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(Utils.historyEventDetailToMap(cleverTapAPI.history))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getFeatureFlag(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val defaultValue = call.argument<Boolean>("defaultValue")!!
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.featureFlag().get(key, defaultValue))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getInboxMessageCount(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.inboxMessageCount)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getInboxMessageForId(call: MethodCall, result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            val messageId = call.argument<String>("messageId")
            if (messageId.isNullOrEmpty()) {
                result.error(TAG, ERROR_MSG_ID, null)
                return
            }
            val inboxMessage: CTInboxMessage? = cleverTapAPI.getInboxMessageForId(messageId)
            if (inboxMessage != null) {
                result.success(Utils.jsonToMap(inboxMessage.data))
            }
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getInboxMessageUnreadCount(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.inboxMessageUnreadCount)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getLastFetchTimeStampInMillis(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.productConfig().lastFetchTimeStampInMillis)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getLong(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.productConfig().getLong(key))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getString(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.productConfig().getString(key))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getUnreadInboxMessages(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(Utils.inboxMessageListToArrayList(cleverTapAPI.getUnreadInboxMessages()))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun suspendInAppNotifications(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            cleverTapAPI.suspendInAppNotifications()
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun discardInAppNotifications(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            cleverTapAPI.discardInAppNotifications()
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun resumeInAppNotifications(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            cleverTapAPI.resumeInAppNotifications()
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun initializeInbox(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            cleverTapAPI.initializeInbox()
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun onUserLogin(call: MethodCall, result: MethodChannel.Result) {
        val profile: Map<String, Any> = Utils.dartMapToProfileMap(call.argument("profile"))
        if (cleverTapAPI != null) {
            cleverTapAPI.onUserLogin(profile)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun processPushNotification(call: MethodCall, result: MethodChannel.Result) {
        val extras = call.argument<Map<String?, Any?>>("extras")!!
        if (cleverTapAPI != null) {
            try {
                CleverTapAPI.processPushNotification(
                    context,
                    Utils.jsonToBundle(JSONObject(extras))
                )
            } catch (e: JSONException) {
                result.error(
                    TAG,
                    "Unable to render notification due to JSONException - " + e.localizedMessage,
                    null
                )
            }
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun profileAddMultiValue(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val value = call.argument<String>("value")
        if (cleverTapAPI != null) {
            cleverTapAPI.addMultiValueForKey(key, value)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun profileIncrementValue(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val value = call.argument<Number>("value")
        if (cleverTapAPI != null) {
            cleverTapAPI.incrementValue(key, value)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun profileDecrementValue(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val value = call.argument<Number>("value")
        if (cleverTapAPI != null) {
            cleverTapAPI.decrementValue(key, value)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun profileAddMultiValues(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val values = call.argument<ArrayList<String>>("values")!!
        if (cleverTapAPI != null) {
            cleverTapAPI.addMultiValuesForKey(key, values)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun profileGetCleverTapAttributionIdentifier(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.cleverTapAttributionIdentifier)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun profileGetCleverTapID(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.cleverTapID)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getCleverTapID(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            cleverTapAPI.getCleverTapID { cleverTapID ->
                CleverTapPlugin.runOnMainThread { result.success(cleverTapID) }
            }
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun profileGetProperty(call: MethodCall, result: MethodChannel.Result) {
        val propertyName = call.argument<String>("propertyName")
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.getProperty(propertyName))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun profileRemoveMultiValue(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val value = call.argument<String>("value")
        if (cleverTapAPI != null) {
            cleverTapAPI.removeMultiValueForKey(key, value)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun profileRemoveMultiValues(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val values = call.argument<ArrayList<String>>("values")!!
        if (cleverTapAPI != null) {
            cleverTapAPI.removeMultiValuesForKey(key, values)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun profileRemoveValueForKey(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        if (cleverTapAPI != null) {
            cleverTapAPI.removeValueForKey(key)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun profileSet(call: MethodCall, result: MethodChannel.Result) {
        val profile: Map<String, Any> = Utils.dartMapToProfileMap(call.argument("profile"))
        if (cleverTapAPI != null) {
            cleverTapAPI.pushProfile(profile)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun profileSetMultiValues(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val values = call.argument<ArrayList<String>>("values")!!
        if (cleverTapAPI != null) {
            cleverTapAPI.setMultiValuesForKey(key, values)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun pushDisplayUnitClickedEvent(call: MethodCall, result: MethodChannel.Result) {
        val unitId = call.argument<String>("unitId")
        if (cleverTapAPI != null) {
            cleverTapAPI.pushDisplayUnitClickedEventForID(unitId)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun pushDisplayUnitViewedEvent(call: MethodCall, result: MethodChannel.Result) {
        val unitId = call.argument<String>("unitId")
        if (cleverTapAPI != null) {
            cleverTapAPI.pushDisplayUnitViewedEventForID(unitId)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun pushInboxNotificationClickedEventForId(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        if (cleverTapAPI != null) {
            val messageId = call.argument<String>("messageId")
            if (messageId.isNullOrEmpty()) {
                result.error(TAG, ERROR_MSG_ID, null)
                return
            }
            cleverTapAPI.pushInboxNotificationClickedEvent(messageId)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun pushInboxNotificationViewedEventForId(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        if (cleverTapAPI != null) {
            val messageId = call.argument<String>("messageId")
            if (messageId.isNullOrEmpty()) {
                result.error(TAG, ERROR_MSG_ID, null)
                return
            }
            cleverTapAPI.pushInboxNotificationViewedEvent(messageId)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun pushInstallReferrer(call: MethodCall, result: MethodChannel.Result) {
        val source = call.argument<String>("source")
        val medium = call.argument<String>("medium")
        val campaign = call.argument<String>("campaign")
        if (cleverTapAPI != null) {
            cleverTapAPI.pushInstallReferrer(source, medium, campaign)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun pushNotificationClickedEvent(call: MethodCall, result: MethodChannel.Result) {
        val extrasMap = call.argument<java.util.HashMap<String, Any>>("notificationData")!!
        val extras = Utils.mapToBundle(extrasMap)
        if (cleverTapAPI != null) {
            this.cleverTapAPI.pushNotificationClickedEvent(extras)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun pushNotificationViewedEvent(call: MethodCall, result: MethodChannel.Result) {
        val extrasMap = call.argument<java.util.HashMap<String, Any>>("notificationData")!!
        val extras = Utils.mapToBundle(extrasMap)
        if (cleverTapAPI != null) {
            this.cleverTapAPI.pushNotificationViewedEvent(extras)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun recordChargedEvent(call: MethodCall, result: MethodChannel.Result) {
        val chargeDetails = call.argument<java.util.HashMap<String, Any>>("chargeDetails")!!
        val items = call.argument<ArrayList<java.util.HashMap<String, Any>>>("items")!!
        if (cleverTapAPI != null) {
            cleverTapAPI.pushChargedEvent(chargeDetails, items)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun recordEvent(call: MethodCall, result: MethodChannel.Result) {
        val eventData = call.argument<Map<String, Any>>("eventData")!!
        val eventName = call.argument<String>("eventName")
        if (cleverTapAPI != null) {
            this.cleverTapAPI.pushEvent(eventName, eventData)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun recordScreenView(call: MethodCall, result: MethodChannel.Result) {
        val name = call.argument<String>("screenName")
        if (cleverTapAPI != null) {
            cleverTapAPI.recordScreen(name)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    @Deprecated(message = "Deprecated Since v3.1.0")
    private fun sessionGetPreviousVisitTime(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.previousVisitTime)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun sessionGetScreenCount(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.screenCount)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun sessionGetTimeElapsed(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.getTimeElapsed())
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    @Deprecated(message = "Deprecated Since v3.1.0")
    private fun sessionGetTotalVisits(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            result.success(cleverTapAPI.getTotalVisits())
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun sessionGetUTMDetails(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            val detail: UTMDetail = cleverTapAPI.getUTMDetails()
            result.success(Utils.utmDetailsToMap(detail))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun setDefaultsMap(call: MethodCall, result: MethodChannel.Result) {
        val defaults = call.argument<java.util.HashMap<String, Any>>("defaults")!!
        if (cleverTapAPI != null) {
            cleverTapAPI.productConfig().setDefaults(defaults)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun setLocation(call: MethodCall, result: MethodChannel.Result) {
        val lat = call.argument<Double>("latitude")!!
        val lon = call.argument<Double>("longitude")!!
        if (cleverTapAPI != null) {
            val location = Location("CleverTapFlutter")
            location.latitude = lat
            location.longitude = lon
            cleverTapAPI.location = location
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun setMinimumFetchIntervalInSeconds(call: MethodCall, result: MethodChannel.Result) {
        val interval = call.argument<Int>("interval")!!
        if (cleverTapAPI != null) {
            cleverTapAPI.productConfig().setMinimumFetchIntervalInSeconds(interval.toLong())
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun setOffline(call: MethodCall, result: MethodChannel.Result) {
        val value = call.argument<Boolean>("value")!!
        if (cleverTapAPI != null) {
            cleverTapAPI.setOffline(value)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun setOptOut(call: MethodCall, result: MethodChannel.Result) {
        val value = call.argument<Boolean>("value")!!
        if (cleverTapAPI != null) {
            cleverTapAPI.setOptOut(value)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun setPersonalization(result: MethodChannel.Result, enable: Boolean) {
        if (cleverTapAPI != null) {
            if (enable) {
                cleverTapAPI.enablePersonalization()
            } else {
                cleverTapAPI.disablePersonalization()
            }
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun setFCMPushToken(call: MethodCall, result: MethodChannel.Result) {
        val token = call.argument<String>("token")
        if (cleverTapAPI != null) {
            cleverTapAPI.pushFcmRegistrationId(token, true)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun pushRegistrationToken(call: MethodCall, result: MethodChannel.Result) {
        val token = call.argument<String>("token")
        val pushType = Utils.mapToPushType(call.argument("pushType"))
        if (pushType == null) {
            result.error(TAG, ERROR_MSG_PUSH_TYPE, null)
            return
        }
        if (cleverTapAPI != null) {
            cleverTapAPI.pushRegistrationToken(token, pushType, true)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun showInbox(call: MethodCall, result: MethodChannel.Result) {
        val styleConfigMap = call.argument<Map<String, Any>>("styleConfig")!!
        val styleConfigJson = Utils.mapToJSONObject(styleConfigMap)
        val styleConfig = Utils.jsonToStyleConfig(styleConfigJson)
        if (cleverTapAPI != null) {
            cleverTapAPI.showAppInbox(styleConfig)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun dismissInbox(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            cleverTapAPI.dismissAppInbox()
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun syncCustomTemplates(result: MethodChannel.Result) {
        if (cleverTapAPI != null) {
            cleverTapAPI.syncRegisteredInAppTemplates()
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun customTemplateSetDismissed(templateName: String?, result: MethodChannel.Result) {
        resolveWithTemplateContext(
            templateName,
            result
        ) { templateContext: CustomTemplateContext ->
            templateContext.setDismissed()
            null
        }
    }

    private fun customTemplateSetPresented(templateName: String?, result: MethodChannel.Result) {
        resolveWithTemplateContext(
            templateName,
            result
        ) { templateContext: CustomTemplateContext ->
            templateContext.setPresented()
            null
        }
    }

    private fun customTemplateRunAction(
        templateName: String?,
        argName: String?,
        result: MethodChannel.Result
    ) {
        resolveWithTemplateContext(
            templateName,
            result
        ) { customTemplateContext: CustomTemplateContext ->
            if (customTemplateContext is CustomTemplateContext.TemplateContext) {
                argName?.let {
                    customTemplateContext.triggerActionArgument(
                        it,
                        null
                    )
                }
            }
            null
        }
    }

    private fun customTemplateGetStringArg(
        templateName: String?,
        argName: String?,
        result: MethodChannel.Result
    ) {
        resolveWithTemplateContext(
            templateName,
            result
        ) { templateContext: CustomTemplateContext ->
            templateContext.getString(
                argName!!
            )
        }
    }

    private fun customTemplateGetNumberArg(
        templateName: String?,
        argName: String?,
        result: MethodChannel.Result
    ) {
        resolveWithTemplateContext(
            templateName,
            result
        ) { templateContext: CustomTemplateContext ->
            templateContext.getDouble(
                argName!!
            )
        }
    }

    private fun customTemplateGetBooleanArg(
        templateName: String?,
        argName: String?,
        result: MethodChannel.Result
    ) {
        resolveWithTemplateContext(
            templateName,
            result
        ) { templateContext: CustomTemplateContext ->
            templateContext.getBoolean(
                argName!!
            )
        }
    }

    private fun customTemplateGetFileArg(
        templateName: String?,
        argName: String?,
        result: MethodChannel.Result
    ) {
        resolveWithTemplateContext(
            templateName,
            result
        ) { templateContext: CustomTemplateContext ->
            templateContext.getFile(
                argName!!
            )
        }
    }

    private fun customTemplateGetObjectArg(
        templateName: String?,
        argName: String?,
        result: MethodChannel.Result
    ) {
        resolveWithTemplateContext(
            templateName,
            result
        ) { templateContext: CustomTemplateContext ->
            val mapArg = templateContext.getMap(
                argName!!
            )
            mapArg
        }
    }

    private fun customTemplateContextToString(templateName: String?, result: MethodChannel.Result) {
        resolveWithTemplateContext(
            templateName,
            result
        ) { templateContext: CustomTemplateContext -> templateContext.toString() }
    }


    private fun resolveWithTemplateContext(
        templateName: String?,
        result: MethodChannel.Result,
        action: TemplateContextAction?
    ) {
        if (templateName != null && cleverTapAPI != null) {
            val templateContext: CustomTemplateContext? =
                cleverTapAPI.getActiveContextForTemplate(templateName)
            if (templateContext != null && action != null) {
                result.success(action.execute(templateContext))
            } else {
                result.error(
                    TAG,
                    ERROR_TEMPLATE_NAME(templateName),
                    null
                )
            }
        } else {
            result.error(
                TAG,
                ERROR_MSG,
                null
            )
        }
    }

}

private fun interface TemplateContextAction {
    fun execute(context: CustomTemplateContext): Any?
}