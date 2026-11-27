package com.clevertap.clevertap_plugin

import android.annotation.SuppressLint
import android.content.Context
import android.location.Location
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.annotation.VisibleForTesting
import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.sdk.CleverTapInstanceConfig
import com.clevertap.android.sdk.UTMDetail
import com.clevertap.android.sdk.interfaces.OnInitCleverTapIDListener
import com.clevertap.android.sdk.cryption.EncryptionLevel
import com.clevertap.android.sdk.events.EventDetail
import com.clevertap.android.sdk.inapp.callbacks.FetchInAppsCallback
import com.clevertap.android.sdk.inapp.customtemplates.CustomTemplateContext
import com.clevertap.android.sdk.FetchInboxCallback
import com.clevertap.android.sdk.inbox.CTInboxMessage
import com.clevertap.android.sdk.pushnotification.PushConstants
import com.clevertap.android.sdk.pushnotification.PushNotificationHandler
import com.clevertap.android.sdk.pushnotification.PushType
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
import java.util.concurrent.atomic.AtomicBoolean

@Suppress("DEPRECATION")
class DartToNativePlatformCommunicator(
    private val context: Context,
    private val cleverTapAPI: CleverTapAPI?
) : MethodCallHandler {

    private val notificationExecutor = Executors.newSingleThreadExecutor()

    private val mainHandler = Handler(Looper.getMainLooper())

    companion object {
        const val TAG = "DartToNative"

        const val ANDROID_O_DELETE_NOTIFICATION_ERROR_MSG: String =
            "Unable to delete notification " +
                    "for devices less than 26(O)"


        private const val ERROR_MSG: String = "CleverTap Instance is not initialized"

        /**
         * The accountId a CleverTapInstance (handle) call sends, or null for a static call. Read
         * without a cast that could throw: anything that is not a non-empty String counts as absent,
         * which means the default account, as before.
         */
        @VisibleForTesting
        internal fun accountIdOf(arguments: Any?): String? =
            ((arguments as? Map<*, *>)?.get("accountId") as? String)?.takeIf { it.isNotEmpty() }

        /**
         * The value of a method whose static call sends one bare value instead of a map. A handle call
         * must also send its accountId, so it sends {"value": ..., "accountId": "B"} instead.
         *
         * Example: setLocale sends "en_US" from CleverTapPlugin and
         * {"value": "en_US", "accountId": "B"} from a handle; both read as "en_US".
         */
        /**
         * A variables event's payload: the registration ID Dart sent with onVariablesChanged etc.,
         * and the values as before. Dart runs only the handler of that registration, so each
         * handler runs once per change, as with the native SDK.
         * Example: {"__ctCallbackId": "k3f9q2-7", "values": {"discount": 10}}.
         */
        @VisibleForTesting
        internal fun variablesPayload(callbackId: String?, values: Any?): Map<String, Any?> =
            linkedMapOf("__ctCallbackId" to callbackId, "values" to values)

        @VisibleForTesting
        internal fun scalarArgumentOf(arguments: Any?): Any? =
            if (arguments is Map<*, *>) arguments["value"] else arguments

        /** What Dart's startEmission asks for: an event, and the account whose handler was set. */
        internal data class StartEmissionRequest(val eventName: String, val accountId: String?)

        /**
         * Reads startEmission's argument. Two shapes:
         *  - a String event name, sent when a static handler is set: the default account (as before);
         *  - {"event": name, "accountId": "B"}, sent when a handle's handler is set: that account.
         * Returns null for anything else.
         *
         * Example: "CleverTapProfileDidInitialize" arms the default account;
         * {"event": "CleverTapProfileDidInitialize", "accountId": "B"} arms B.
         */
        @VisibleForTesting
        internal fun parseStartEmission(arguments: Any?): StartEmissionRequest? = when (arguments) {
            is String -> StartEmissionRequest(arguments, null)
            is Map<*, *> -> (arguments["event"] as? String)?.let { event ->
                StartEmissionRequest(event, (arguments["accountId"] as? String)?.takeIf { it.isNotEmpty() })
            }
            else -> null
        }

        // createInstance error codes, the same as the React Native SDK and the iOS side. Apps can
        // switch on PlatformException.code, so these strings must never change.
        // EINVALID: the config is unacceptable. ECREATE: the SDK could not create the account.
        const val ERROR_CODE_INVALID_CONFIG = "EINVALID"
        const val ERROR_CODE_CREATE_FAILED = "ECREATE"

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

        /** The default account's variables, by name (see [variablesFor]). */
        val variables: HashMap<String, Any> = java.util.HashMap()

        /** Every other account's variables: account ID -> (name -> Var). See [variablesFor]. */
        private val accountVariables: HashMap<String, HashMap<String, Any>> = java.util.HashMap()

        /**
         * The variables map of [accountId]: [variables] when it is the default account
         * ([defaultAccountId]), otherwise that account's own map, created on first use.
         * Example: "DEF" -> variables; "B" -> B's map, the same object every time.
         */
        @VisibleForTesting
        internal fun variablesOf(accountId: String, defaultAccountId: String?): HashMap<String, Any> {
            if (accountId == defaultAccountId) {
                return variables
            }
            return accountVariables.getOrPut(accountId) { java.util.HashMap() }
        }

        /**
         * Returns a copy of [value] that shares no Map, List or array with the original, so the
         * native SDK can no longer change what Dart receives.
         *
         * Why: a dictionary variable's value() is a node of the SDK's VarCache tree, which
         * defineVariable changes in place (VarCache.registerVariable -> updateValuesAndKinds puts
         * the new key into the existing map). Payloads are now encoded a moment later, on the
         * main thread after the emitter's worker, instead of inside the SDK callback. Example:
         * the callback sees theme = {color: red}; before the encode, Dart defines theme.size = L
         * and the SDK puts size into that same map. Without the copy Dart could receive
         * {color: red, size: L} - a value that did not exist when the event fired.
         *
         * The copy must not change a single byte of what Dart receives, so:
         *  - Map -> LinkedHashMap filled in the source's iteration order. A new HashMap could
         *    iterate in a different order (it depends on the table size), and Dart keeps the
         *    order the map was encoded in.
         *  - List -> ArrayList, same order. The Flutter codec writes every List the same way.
         *  - byte[] / int[] / long[] / double[] / float[] (the arrays the codec supports) and
         *    Object[] keep their exact runtime type; their elements are numbers or leaves.
         *  - Everything else is returned as is: String, Boolean and the Number types are
         *    immutable, and any other type is rejected by the codec exactly as before.
         *
         * Callers apply it AFTER CleverTapTypeUtils.MapUtil.addValue, so addValue keeps deciding
         * on the SDK's original object (for example its `instanceof ArrayList` check).
         */
        @VisibleForTesting
        internal fun detachedCopy(value: Any?): Any? = when (value) {
            is Map<*, *> -> {
                val copy = LinkedHashMap<Any?, Any?>()
                for ((k, v) in value) {
                    copy[k] = detachedCopy(v)
                }
                copy
            }
            is List<*> -> {
                val copy = ArrayList<Any?>(value.size)
                for (item in value) {
                    copy.add(detachedCopy(item))
                }
                copy
            }
            is Array<*> -> value.copyOf()
            is ByteArray -> value.copyOf()
            is IntArray -> value.copyOf()
            is LongArray -> value.copyOf()
            is DoubleArray -> value.copyOf()
            is FloatArray -> value.copyOf()
            else -> value
        }
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

            "createInstance" -> {
                createInstance(call, result)
            }

            "getDefaultAccountId" -> {
                result.success(CleverTapInstanceRegistry.resolve(context, null)?.accountId)
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
                result.success(null) // answered, so the Dart Future completes (it never did)
            }

            "setLocale" -> {
                setLocale(call, result)
            }

            "getVariants" -> {
                getVariants(call, result)
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
                getPushNotificationPermissionStatus(call, result)
            }

            "unregisterPushPermissionNotificationResponseListener" -> {
                unregisterPushPermissionNotificationResponseListener(call, result)
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
                setPersonalization(call, result, true)
            }

            "disablePersonalization" -> {
                setPersonalization(call, result, false)
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
                getEventHistory(call, result)
            }

            "getUserEventLog" -> {
                val eventName = call.argument<String>(KEY_EVENT_NAME)
                getUserEventLog(call, eventName, result)
            }
            "getUserEventLogCount" -> {
                val eventName = call.argument<String>(KEY_EVENT_NAME)
                getUserEventLogCount(call, eventName, result)
            }
            "getUserEventLogHistory" -> {
                getUserEventLogHistory(call, result)
            }
            "getUserAppLaunchCount" -> {
                getUserAppLaunchCount(call, result)
            }
            "getUserLastVisitTs" -> {
                getUserLastVisitTs(call, result)
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
                profileGetCleverTapAttributionIdentifier(call, result)
            }

            "profileGetCleverTapID" -> {
                profileGetCleverTapID(call, result)
            }

            "getCleverTapID" -> {
                getCleverTapID(call, result)
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
                sessionGetTimeElapsed(call, result)
            }

            "sessionGetTotalVisits" -> {
                sessionGetTotalVisits(call, result)
            }

            "sessionGetScreenCount" -> {
                sessionGetScreenCount(call, result)
            }

            "sessionGetPreviousVisitTime" -> {
                sessionGetPreviousVisitTime(call, result)
            }

            "sessionGetUTMDetails" -> {
                sessionGetUTMDetails(call, result)
            }

            "suspendInAppNotifications" -> {
                suspendInAppNotifications(call, result)
            }

            "discardInAppNotifications" -> {
                discardInAppNotifications(call, result)
            }

            "resumeInAppNotifications" -> {
                resumeInAppNotifications(call, result)
            }

            "dismissPipInApp" -> {
                dismissPipInApp(call, result)
            }

            "initializeInbox" -> {
                initializeInbox(call, result)
            }

            "showInbox" -> {
                showInbox(call, result)
            }

            "dismissInbox" -> {
                dismissInbox(call, result)
            }

            "fetchInbox" -> {
                fetchInbox(call, result)
            }

            "fetchInboxWithCallback" -> {
                fetchInboxWithCallback(call, result)
            }

            "getInboxMessageCount" -> {
                getInboxMessageCount(call, result)
            }

            "getInboxMessageUnreadCount" -> {
                getInboxMessageUnreadCount(call, result)
            }

            "getAllInboxMessages" -> {
                getAllInboxMessages(call, result)
            }

            "getUnreadInboxMessages" -> {
                getUnreadInboxMessages(call, result)
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
                syncVariables(call, result)
            }

            "syncVariablesinProd" -> {
                Log.d(TAG, "syncVariablesinProd$ERROR_IOS")
                result.success(null) // answered, so an awaiting Dart Future completes
            }

            "defineVariables" -> {
                defineVariables(call, result)
            }

            "defineFileVariable" -> {
                defineFileVariable(call, result)
            }

            "fetchVariables" -> {
                fetchVariables(call, result)
            }

            "getVariable" -> {
                getVariable(call, result)
            }

            "getVariables" -> {
                getVariables(call, result)
            }

            "onVariablesChanged" -> {
                onVariablesChanged(call)
            }

            "onOneTimeVariablesChanged" -> {
                onOneTimeVariablesChanged(call)
            }

            "onVariablesChangedAndNoDownloadsPending" -> {
                onVariablesChangedAndNoDownloadsPending(call)
            }

            "onceVariablesChangedAndNoDownloadsPending" -> {
                onceVariablesChangedAndNoDownloadsPending(call)
            }

            "onValueChanged" -> {
                onValueChanged(call)
            }

            "onFileValueChanged" -> {
                onFileValueChanged(call)
            }

            "fetchInApps" -> {
                fetchInApps(call, result)
            }

            "clearInAppResources" -> {
                clearInAppResources(call, result)
            }

            "getAllDisplayUnits" -> {
                getAllDisplayUnits(call, result)
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

            "pushDisplayUnitElementViewedEvent" -> {
                pushDisplayUnitElementViewedEvent(call, result)
            }

            "fetchNativeDisplayMeta" -> {
                fetchNativeDisplayMeta(call, result)
            }

            "pushDisplayUnitElementClickedEvent" -> {
                pushDisplayUnitElementClickedEvent(call, result)
            }

            "getFeatureFlag" -> {
                getFeatureFlag(call, result)
            }

            "setDefaultsMap" -> {
                setDefaultsMap(call, result)
            }

            "fetch" -> {
                fetch(call, result)
            }

            "fetchWithMinimumFetchIntervalInSeconds" -> {
                fetchWithMinimumFetchIntervalInSeconds(call, result)
            }

            "activate" -> {
                activate(call, result)
            }

            "fetchAndActivate" -> {
                fetchAndActivate(call, result)
            }

            "setMinimumFetchIntervalInSeconds" -> {
                setMinimumFetchIntervalInSeconds(call, result)
            }

            "getLastFetchTimeStampInMillis" -> {
                getLastFetchTimeStampInMillis(call, result)
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
                result.success(null) // answered, so an awaiting Dart Future completes
            }

            "getInitialUrl" -> {
                Log.d(TAG, "getInitialUrl$ERROR_IOS")
                result.success(null) // answered, so an awaiting Dart Future completes
            }

            "syncCustomTemplatesInProd", "syncCustomTemplates" -> {
                syncCustomTemplates(call, result)
            }

            "customTemplateSetDismissed" -> {
                // A bare name from CleverTapPlugin, {value, accountId} from a handle.
                val templateName = scalarArgumentOf(call.arguments) as? String
                customTemplateSetDismissed(call, templateName, result)
            }

            "customTemplateSetPresented" -> {
                val templateName = scalarArgumentOf(call.arguments) as? String
                customTemplateSetPresented(call, templateName, result)
            }

            "customTemplateRunAction" -> {
                val templateName = call.argument<String>(KEY_TEMPLATE_NAME_CC)
                val argumentName = call.argument<String>(KEY_TEMPLATE_ARGUMENT_CC)
                customTemplateRunAction(
                    call = call,
                    templateName = templateName,
                    argName = argumentName,
                    result = result
                )
            }

            "customTemplateGetStringArg" -> {
                val templateName = call.argument<String>(KEY_TEMPLATE_NAME_CC)
                val argumentName = call.argument<String>(KEY_TEMPLATE_ARGUMENT_CC)
                customTemplateGetStringArg(
                    call = call,
                    templateName = templateName,
                    argName = argumentName,
                    result = result
                )
            }

            "customTemplateGetNumberArg" -> {
                val templateName = call.argument<String>(KEY_TEMPLATE_NAME_CC)
                val argumentName = call.argument<String>(KEY_TEMPLATE_ARGUMENT_CC)
                customTemplateGetNumberArg(
                    call = call,
                    templateName = templateName,
                    argName = argumentName,
                    result = result
                )
            }

            "customTemplateGetBooleanArg" -> {
                val templateName = call.argument<String>(KEY_TEMPLATE_NAME_CC)
                val argumentName = call.argument<String>(KEY_TEMPLATE_ARGUMENT_CC)
                customTemplateGetBooleanArg(
                    call = call,
                    templateName = templateName,
                    argName = argumentName,
                    result = result
                )
            }

            "customTemplateGetFileArg" -> {
                val templateName = call.argument<String>(KEY_TEMPLATE_NAME_CC)
                val argumentName = call.argument<String>(KEY_TEMPLATE_ARGUMENT_CC)
                customTemplateGetFileArg(
                    call = call,
                    templateName = templateName,
                    argName = argumentName,
                    result = result
                )
            }

            "customTemplateGetObjectArg" -> {
                val templateName = call.argument<String>(KEY_TEMPLATE_NAME_CC)
                val argumentName = call.argument<String>(KEY_TEMPLATE_ARGUMENT_CC)
                customTemplateGetObjectArg(
                    call = call,
                    templateName = templateName,
                    argName = argumentName,
                    result = result
                )
            }

            "customTemplateContextToString" -> {
                // Dart sends {templateName}. Reading the whole argument as a String threw a
                // ClassCastException on every call, from the first version until Phase 7.
                val templateName = call.argument<String>(KEY_TEMPLATE_NAME_CC)
                customTemplateContextToString(
                    call = call,
                    templateName = templateName,
                    result = result
                )
            }

            "unmute" -> {
                unmute(call, result)
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
        val request = parseStartEmission(call.arguments)
        if (request == null) {
            result.error(TAG, ERROR_EMIT_EVENT_PROBLEM(call.arguments?.toString()), null)
            return
        }

        val ctEvent = CleverTapEvent.fromName(request.eventName)
        if (ctEvent == CleverTapEvent.CLEVERTAP_UNKNOWN) {
            result.error(TAG, ERROR_EMIT_EVENT_PROBLEM(request.eventName), null)
            return
        }

        // Setting a Push Amp handler is the app's opt-in to draw Push Amp notifications itself, so
        // only then does the account get the listener (see attachPushAmpListener). A missing
        // account has nothing to attach to; the handler simply never fires.
        if (ctEvent == CleverTapEvent.CLEVERTAP_ON_PUSH_AMP_PAYLOAD_RECEIVED) {
            instanceFor(call)?.let { CleverTapListenerProxy.attachPushAmpListener(it) }
        }

        // One call on purpose: "stop buffering" and "send what was held" must run as one step,
        // or an event emitted between them is left in a disabled buffer and lost.
        if (request.accountId == null) {
            CleverTapEventEmitter.startEmission(ctEvent) // a static handler: the default account
        } else {
            CleverTapEventEmitter.startEmission(ctEvent, request.accountId)
        }
        result.success(true)
    }

    private fun setLocale(call: MethodCall, result: MethodChannel.Result) {
        val locale = scalarArgumentOf(call.arguments) as String?
        val instance = instanceFor(call)
        if (instance != null) {
            instance.setLocale(locale)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun getVariants(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            val variants = instance.variants()
            result.success(variants)
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun syncVariables(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.syncVariables()
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun defineVariables(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            val accountVariables = variablesFor(instance)
            val variablesMap = call.argument<Map<String, Any>>("variables")!!
            for ((key, value) in variablesMap) {
                accountVariables[key] = instance.defineVariable<Any>(key, value)
            }
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun defineFileVariable(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            val fileVar = call.argument<String>("fileVariable")
            variablesFor(instance)[fileVar!!] = instance.defineFileVariable(fileVar)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun fetchVariables(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.fetchVariables { isSuccess ->
                result.success(
                    isSuccess
                )
            }
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getVariable(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            try {
                val key = call.argument<String>("name")
                result.success(getVariableValue(variablesFor(instance), key!!))
            } catch (e: Exception) {
                result.error(
                    TAG,
                    "Unable to get the variable value: " + e.localizedMessage,
                    null
                )
            }
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getVariables(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            try {
                result.success(getVariablesValues(variablesFor(instance)))
            } catch (e: Exception) {
                result.error(
                    TAG,
                    "Unable to get the variable value: " + e.localizedMessage,
                    null
                )
            }
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    // The six variables callbacks below are registered on the call's account (the default account
    // for a static call), read that account's variables and emit with its accountId.
    private fun onVariablesChanged(call: MethodCall) {
        val instance = instanceFor(call)
        val callbackId = call.argument<String>("callbackId")
        if (instance != null) {
            val accountVariables = variablesFor(instance)
            instance.addVariablesChangedCallback(object : VariablesChangedCallback() {
                override fun variablesChanged() {
                    CleverTapEventEmitter.emit(
                        CleverTapEvent.CLEVERTAP_ON_VARIABLES_CHANGED,
                        instance.accountId,
                        variablesPayload(callbackId, getVariablesValues(accountVariables))
                    )
                }
            })
        } else {
            Log.d(TAG, ERROR_MSG)
        }
    }

    private fun onOneTimeVariablesChanged(call: MethodCall) {
        val instance = instanceFor(call)
        val callbackId = call.argument<String>("callbackId")
        if (instance != null) {
            val accountVariables = variablesFor(instance)
            instance.addOneTimeVariablesChangedCallback(object : VariablesChangedCallback() {
                override fun variablesChanged() {
                    CleverTapEventEmitter.emit(
                        CleverTapEvent.CLEVERTAP_ON_ONE_TIME_VARIABLES_CHANGED,
                        instance.accountId,
                        variablesPayload(callbackId, getVariablesValues(accountVariables))
                    )
                }
            })
        } else {
            Log.d(TAG, ERROR_MSG)
        }
    }

    private fun onVariablesChangedAndNoDownloadsPending(call: MethodCall) {
        val instance = instanceFor(call)
        val callbackId = call.argument<String>("callbackId")
        if (instance != null) {
            val accountVariables = variablesFor(instance)
            instance.onVariablesChangedAndNoDownloadsPending(object :
                VariablesChangedCallback() {
                override fun variablesChanged() {
                    CleverTapEventEmitter.emit(
                        CleverTapEvent.CLEVERTAP_ON_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING,
                        instance.accountId,
                        variablesPayload(callbackId, getVariablesValues(accountVariables))
                    )
                }
            })
        } else {
            Log.d(TAG, ERROR_MSG)
        }
    }

    private fun onceVariablesChangedAndNoDownloadsPending(call: MethodCall) {
        val instance = instanceFor(call)
        val callbackId = call.argument<String>("callbackId")
        if (instance != null) {
            val accountVariables = variablesFor(instance)
            instance.onceVariablesChangedAndNoDownloadsPending(object :
                VariablesChangedCallback() {
                override fun variablesChanged() {
                    CleverTapEventEmitter.emit(
                        CleverTapEvent.CLEVERTAP_ONCE_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING,
                        instance.accountId,
                        variablesPayload(callbackId, getVariablesValues(accountVariables))
                    )
                }
            })
        } else {
            Log.d(TAG, ERROR_MSG)
        }
    }

    private fun onValueChanged(call: MethodCall) {
        val name = call.argument<String>("name")
        val callbackId = call.argument<String>("callbackId")
        val instance = instanceFor(call)
        if (instance == null) {
            Log.d(TAG, ERROR_MSG)
            return
        }
        val accountVariables = variablesFor(instance)
        if (accountVariables.containsKey(name)) {
            val `var` = accountVariables[name] as Var<Any>?
            if (`var` != null) {
                `var`.addValueChangedCallback(object : VariableCallback<Any?>() {
                    @SuppressLint("RestrictedApi")
                    override fun onValueChanged(variable: Var<Any?>) {
                        var variablesMap: Map<String, Any> = HashMap()
                        try {
                            variablesMap = getVariableValueAsMap(accountVariables, name!!)
                        } catch (e: Exception) {
                            Log.d(
                                TAG,
                                "Unable to handle onValueChanged callback: " + e.localizedMessage,
                                null
                            )
                        }
                        CleverTapEventEmitter.emit(CleverTapEvent.CLEVERTAP_ON_VALUE_CHANGED, instance.accountId, variablesPayload(callbackId, variablesMap))
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
        val callbackId = call.argument<String>("callbackId")
        val instance = instanceFor(call)
        if (instance == null) {
            Log.d(TAG, ERROR_MSG)
            return
        }
        val accountVariables = variablesFor(instance)
        if (accountVariables.containsKey(name)) {
            val `var` = accountVariables[name] as Var<Any>?
            if (`var` != null) {
                `var`.addFileReadyHandler(object : VariableCallback<Any?>() {
                    @SuppressLint("RestrictedApi")
                    override fun onValueChanged(variable: Var<Any?>) {
                        var variablesMap: Map<String, Any> = HashMap()
                        try {
                            variablesMap = getVariableValueAsMap(accountVariables, name!!)
                        } catch (e: Exception) {
                            Log.d(
                                TAG,
                                "Unable to handle onValueChanged callback: " + e.localizedMessage,
                                null
                            )
                        }
                        CleverTapEventEmitter.emit(CleverTapEvent.CLEVERTAP_ON_FILE_VALUE_CHANGED, instance.accountId, variablesPayload(callbackId, variablesMap))
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

    private fun fetchInApps(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.fetchInApps(object : FetchInAppsCallback {
                override fun onInAppsFetched(isSuccess: Boolean) {
                    result.success(isSuccess)
                }
            })
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun clearInAppResources(call: MethodCall, result: MethodChannel.Result) {
        val expiredOnly = (scalarArgumentOf(call.arguments) as Boolean?)!!
        val instance = instanceFor(call)
        if (instance != null) {
            instance.clearInAppResources(expiredOnly)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    /************************************************
     * Product Experience Remote Config methods ends
     */

    /**
     * The variables this plugin defined for [instance]'s account, by name. The default account uses
     * [variables], the same map as before multi-instance; every other account gets its own map.
     *
     * Why: with one map, account B defining "discount" replaced the default account's "discount",
     * and CleverTapPlugin.getVariable("discount") then returned B's value.
     * Main thread only: the handlers run there, and the SDK posts variable callbacks there
     * (Android SDK 8.5.0 CTVariables.java and Var.java use Utils.runOnUiThread).
     */
    private fun variablesFor(instance: CleverTapAPI): HashMap<String, Any> =
        variablesOf(instance.accountId, cleverTapAPI?.accountId)
    @SuppressLint("RestrictedApi")
    private fun getVariableValue(accountVariables: Map<String, Any>, name: String): Any {
        if (accountVariables.containsKey(name)) {
            val variable = accountVariables[name] as Var<*>?
            return variable!!.value()
        }
        throw IllegalArgumentException(
            "Variable name = $name does not exist. Make sure you set variable first."
        )
    }

    private fun getVariablesValues(accountVariables: Map<String, Any>): Map<String, Any> {
        val variablesMapObject: MutableMap<String, Any> = java.util.HashMap()
        for ((key, value) in accountVariables) {
            val variable = value as Var<*>

            // Copy after addValue: addValue decides on the SDK's original object.
            @Suppress("UNCHECKED_CAST")
            val variableWritableMap = detachedCopy(
                CleverTapTypeUtils.MapUtil.addValue(key, variable.value())
            ) as Map<String, Any>
            variablesMapObject.putAll(variableWritableMap)
        }
        return variablesMapObject
    }

    @SuppressLint("RestrictedApi")
    private fun getVariableValueAsMap(accountVariables: Map<String, Any>, name: String): Map<String, Any> {
        if (accountVariables.containsKey(name)) {
            val variable = accountVariables[name] as Var<*>?
            // Copy after addValue: addValue decides on the SDK's original object.
            @Suppress("UNCHECKED_CAST")
            return detachedCopy(
                CleverTapTypeUtils.MapUtil.addValue(name, variable!!.value())
            ) as Map<String, Any>
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
        // Remembered even when there is no default account, so accounts created later report it,
        // and stamped on the accounts wired already (launch accounts are wired before Dart runs).
        CleverTapInstanceRegistry.rememberLibrary(context, libName, libVersion)
        cleverTapAPI?.setCustomSdkVersion(libName, libVersion)
        // Always success: remembering the version above is this call's job, and it worked. An app
        // with no AndroidManifest.xml account (every account created from Dart) used to get an
        // error here. Dart does not await this call, so the error surfaced as an uncaught
        // PlatformException on every launch.
        result.success(null)
    }

    /**
     * Creates an additional CleverTap account. Answers Dart with the account ID, or with an
     * `EINVALID` / `ECREATE` error. Every path answers exactly once.
     *
     * Example: `{"accountId": "ACC-B", "accountToken": "TOK-B", "region": "eu1"}` answers "ACC-B",
     * and `CleverTapInstanceRegistry.resolve(context, "ACC-B")` finds the account from then on.
     *
     * Calling it again for the same account returns that account and ignores the new config (the
     * SDK keeps the first one for the whole app run). A warning says so.
     */
    private fun createInstance(call: MethodCall, result: MethodChannel.Result) {
        // 1. Check the input before building anything, so a bad config only fails the call.
        val request = try {
            InstanceConfigRequest.parse(call.arguments as? Map<*, *>)
        } catch (e: InstanceConfigRequest.InvalidConfigException) {
            result.error(ERROR_CODE_INVALID_CONFIG, "createInstance: ${e.message}", null)
            return
        }
        val accountId = request.accountId

        // 2. Build the SDK config. It reads AndroidManifest.xml defaults (ManifestInfo); the
        //    fields given from Dart override them.
        val config = CleverTapInstanceConfig.createInstance(
            context, accountId, request.accountToken, request.region
        )
        if (config == null) {
            result.error(ERROR_CODE_CREATE_FAILED, "createInstance could not build a config for accountId $accountId", null)
            return
        }
        try {
            applyOptionalConfig(config, request)
        } catch (t: Throwable) {
            // For example a push provider the SDK refuses. Fail the call, never the app.
            result.error(ERROR_CODE_CREATE_FAILED, "createInstance could not apply the config for accountId $accountId: $t", null)
            return
        }
        val alreadyCreated = CleverTapInstanceRegistry.isWired(accountId)

        // 3. Create on the MAIN thread. instanceWithConfig does get, new, put on a static map with
        //    no lock, and the new instance posts deviceIDCreated to main, which calls
        //    instanceWithConfig again. Off main, that can build two objects for one account. Flutter
        //    already calls this handler on main, so this normally runs inline.
        CleverTapPlugin.runOnMainThread {
            // Creation can throw, not just return null: custom template producers run inside it,
            // and a duplicate template name throws CustomTemplateException. On main, an uncaught
            // throw would crash the app.
            val instance = try {
                if (request.cleverTapId != null) {
                    CleverTapAPI.instanceWithConfig(context, config, request.cleverTapId)
                } else {
                    CleverTapAPI.instanceWithConfig(context, config)
                }
            } catch (t: Throwable) {
                result.error(ERROR_CODE_CREATE_FAILED, "createInstance failed for accountId $accountId: $t", null)
                return@runOnMainThread
            }
            if (instance == null) {
                result.error(ERROR_CODE_CREATE_FAILED, "createInstance failed for accountId $accountId", null)
                return@runOnMainThread
            }
            if (alreadyCreated) {
                Log.w(TAG, "createInstance: account $accountId already exists in this app run; the new config was ignored. Restart the app to apply a new config.")
            }
            // Stamps the wrapper name and version once per account (Phase 1 registry).
            CleverTapInstanceRegistry.resolve(context, accountId)
            result.success(accountId)
        }
    }

    // Copies the checked optional fields onto the SDK config. Region was passed to the factory.
    // null means "not given": the config keeps its default.
    private fun applyOptionalConfig(config: CleverTapInstanceConfig, request: InstanceConfigRequest) {
        request.proxyDomain?.let { config.setProxyDomain(it) }
        request.spikyProxyDomain?.let { config.setSpikyProxyDomain(it) }
        request.handshakeDomain?.let { config.setCustomHandshakeDomain(it) }
        request.identityKeys?.takeIf { it.isNotEmpty() }?.let { setIdentityKeys(config, it) }
        request.logLevel?.let { config.setDebugLevel(toLogLevel(it)) }
        request.analyticsOnly?.let { config.setAnalyticsOnly(it) }
        request.enablePersonalization?.let { config.enablePersonalization(it) }
        request.disableAppLaunchedEvent?.let { config.setDisableAppLaunchedEvent(it) }
        request.encryptionLevel?.let { config.setEncryptionLevel(toEncryptionLevel(it)) }
        request.encryptionInTransit?.let { config.setEncryptionInTransit(it) }
        request.useCustomCleverTapId?.let { config.setEnableCustomCleverTapId(it) }
        request.useGoogleAdId?.let { config.useGoogleAdId(it) }
        request.backgroundSync?.let { config.setBackgroundSync(it) }
        for (provider in request.pushProviders) {
            config.addPushType(
                PushType(provider.type, provider.prefKey, provider.className, provider.messagingSDKClassName)
            )
        }
    }

    // setIdentityKeys is marked @IdentityType (only "Email", "Phone", "Identity"), but these strings
    // come from Dart, so lint cannot check them. The SDK filters them itself at run time: IdentitySet
    // keeps only known keys, ignoring case, so ["Email", "Mail"] works as ["Email"] and never
    // crashes. The React Native SDK passes them the same way.
    @SuppressLint("WrongConstant")
    private fun setIdentityKeys(config: CleverTapInstanceConfig, keys: List<String>) {
        config.setIdentityKeys(*keys.toTypedArray())
    }

    // "off" -> OFF(-1), "info" -> INFO(0), "debug" -> DEBUG(2), "verbose" -> VERBOSE(3).
    private fun toLogLevel(level: String): CleverTapAPI.LogLevel = when (level) {
        "off" -> CleverTapAPI.LogLevel.OFF
        "debug" -> CleverTapAPI.LogLevel.DEBUG
        "verbose" -> CleverTapAPI.LogLevel.VERBOSE
        else -> CleverTapAPI.LogLevel.INFO
    }

    // "none" -> NONE, "medium" -> MEDIUM (PII only), "high" -> FULL_DATA (all data).
    private fun toEncryptionLevel(level: String): EncryptionLevel = when (level) {
        "medium" -> EncryptionLevel.MEDIUM
        "high" -> EncryptionLevel.FULL_DATA
        else -> EncryptionLevel.NONE
    }

    private fun activate(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.productConfig().activate()
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    /**
     * Renders both core and push template notifications and also handles the signedcall push
     */
    private fun renderNotification(call: MethodCall, result: MethodChannel.Result) {
        val extras = call.argument<String>("extras")
        // No default-account check: the SDK finds the account from the push itself (wzrk_acct_id,
        // PushNotificationHandler.onMessageReceived -> getGlobalInstance). The old check answered an
        // error but did not return, so processNotification answered a second time on the executor
        // thread, where Flutter's "Reply already submitted" crashed the app on every push when there
        // was no default account (since 739c475).
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
    }

    // Answers exactly once, and catches everything itself: on the executor thread nothing else
    // would, and an uncaught exception there crashes the app. Example: a payload that is not JSON.
    private fun processNotification(extras: String?, result: MethodChannel.Result) {
        val isSuccess = try {
            val messageBundle = Utils.stringToBundle(extras)
            PushNotificationHandler.getPushNotificationHandler()
                .onMessageReceived(context, messageBundle, PushConstants.FCM.type)
        } catch (e: JSONException) {
            result.error(
                TAG,
                "Unable to render notification due to JSONException - " + e.localizedMessage,
                null
            )
            return
        } catch (t: Throwable) {
            result.error(TAG, t.localizedMessage, null)
            return
        }

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
        val instance = instanceFor(call)
        if (instance != null) {
            val jsonObject = Utils.localInAppFromMap(localInAppAttributeMap)
            instance.promptPushPrimer(jsonObject)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun promptForPushNotification(call: MethodCall, result: MethodChannel.Result) {
        val fallbackToSettings = (scalarArgumentOf(call.arguments) as Boolean?)!!
        val instance = instanceFor(call)
        if (instance != null) {
            instance.promptForPushPermission(fallbackToSettings)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun getPushNotificationPermissionStatus(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.isPushPermissionGranted)
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun unregisterPushPermissionNotificationResponseListener(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            // The listener registered on this account is its own proxy (CleverTapListenerProxy.attachTo),
            // and the SDK removes by identity. Passing the CleverTapListenerProxy object here removed
            // nothing since Phase 3, so the events kept coming.
            instance.unregisterPushPermissionNotificationResponseListener(
                CleverTapListenerProxy.proxyFor(instance.accountId)
            )
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun deleteInboxMessageForId(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            val messageId = call.argument<String>("messageId")
            if (messageId.isNullOrEmpty()) {
                result.error(TAG, ERROR_MSG_ID, null)
                return
            }
            instance.deleteInboxMessage(messageId)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun deleteInboxMessagesForIds(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            val messageIds = call.argument<ArrayList<String>>("messageIds")!!
            instance.deleteInboxMessagesForIDs(messageIds)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun markReadInboxMessageForId(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            val messageId = call.argument<String>("messageId")
            if (messageId.isNullOrEmpty()) {
                result.error(TAG, ERROR_MSG_ID, null)
                return
            }
            instance.markReadInboxMessage(messageId)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun markReadInboxMessagesForIds(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            val messageIds = call.argument<ArrayList<String>>("messageIds")!!
            instance.markReadInboxMessagesForIDs(messageIds)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun enableDeviceNetworkInfoReporting(call: MethodCall, result: MethodChannel.Result) {
        val value = call.argument<Boolean>("value")!!
        val instance = instanceFor(call)
        if (instance != null) {
            instance.enableDeviceNetworkInfoReporting(value)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun getUserEventLog(call: MethodCall, eventName: String?, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance == null) {
            answerValueWithoutInstance(call, result)
        } else if (eventName != null) {
            val eventLog: UserEventLog? = instance.getUserEventLog(eventName)
            result.success(Utils.eventLogToMap(eventLog))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getUserEventLogCount(call: MethodCall, eventName: String?, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance == null) {
            answerValueWithoutInstance(call, result)
        } else if (eventName != null) {
            result.success(instance.getUserEventLogCount(eventName))
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    }

    private fun getUserEventLogHistory(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(Utils.historyEventLogToMap(instance.userEventLogHistory))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getUserAppLaunchCount(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.userAppLaunchCount)
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getUserLastVisitTs(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.userLastVisitTs)
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    @Deprecated(message = "Deprecated Since v3.1.0")
    private fun eventGetDetail(call: MethodCall, result: MethodChannel.Result) {
        val eventName = call.argument<String>("eventName")
        val instance = instanceFor(call)
        if (instance != null) {
            val eventDetail: EventDetail = instance.getDetails(eventName)
            result.success(Utils.eventDetailToMap(eventDetail))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    @Deprecated(message = "Deprecated Since v3.1.0")
    private fun eventGetFirstTime(call: MethodCall, result: MethodChannel.Result) {
        val eventName = call.argument<String>("eventName")
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.getFirstTime(eventName))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    @Deprecated(message = "Deprecated Since v3.1.0")
    private fun eventGetLastTime(call: MethodCall, result: MethodChannel.Result) {
        val eventName = call.argument<String>("eventName")
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.getLastTime(eventName))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    @Deprecated(message = "Deprecated Since v3.1.0")
    private fun eventGetOccurrences(call: MethodCall, result: MethodChannel.Result) {
        val eventName = call.argument<String>("eventName")
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.getCount(eventName))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun fetch(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.productConfig().fetch()
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun fetchAndActivate(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.productConfig().fetchAndActivate()
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun fetchWithMinimumFetchIntervalInSeconds(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        val interval = call.argument<Int>("interval")!!
        val instance = instanceFor(call)
        if (instance != null) {
            instance.productConfig().fetch(interval.toLong())
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun getAllDisplayUnits(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(Utils.displayUnitListToArrayList(instance.allDisplayUnits))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getAllInboxMessages(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(Utils.inboxMessageListToArrayList(instance.getAllInboxMessages()))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getBoolean(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.productConfig().getBoolean(key))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getDisplayUnitForId(call: MethodCall, result: MethodChannel.Result) {
        val unitId = call.argument<String>("unitId")
        val instance = instanceFor(call)
        if (instance != null) {
            val displayUnit: JSONObject? = instance.getDisplayUnitForId(unitId)?.jsonObject
            // null for an unknown unit (or one without JSON), as iOS answers; Dart turns it into {}.
            // Before: an unknown unit answered an error (iOS: nil), and a unit without JSON never
            // answered, so Dart's await waited forever.
            result.success(displayUnit?.let { Utils.jsonToMap(it) })
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getDouble(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.productConfig().getDouble(key))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    @Deprecated(message = "Deprecated Since v3.1.0")
    private fun getEventHistory(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(Utils.historyEventDetailToMap(instance.history))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getFeatureFlag(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val defaultValue = call.argument<Boolean>("defaultValue")!!
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.featureFlag().get(key, defaultValue))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getInboxMessageCount(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.inboxMessageCount)
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getInboxMessageForId(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            val messageId = call.argument<String>("messageId")
            if (messageId.isNullOrEmpty()) {
                result.error(TAG, ERROR_MSG_ID, null)
                return
            }
            val inboxMessage: CTInboxMessage? = instance.getInboxMessageForId(messageId)
            // null for an unknown messageId, as iOS (message.json is nil) and React Native answer;
            // Dart turns it into {}. Before, this path never answered: Dart's await waited forever.
            result.success(inboxMessage?.let { Utils.jsonToMap(it.data) })
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getInboxMessageUnreadCount(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.inboxMessageUnreadCount)
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getLastFetchTimeStampInMillis(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.productConfig().lastFetchTimeStampInMillis)
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getLong(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.productConfig().getLong(key))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getString(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.productConfig().getString(key))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getUnreadInboxMessages(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(Utils.inboxMessageListToArrayList(instance.getUnreadInboxMessages()))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun suspendInAppNotifications(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.suspendInAppNotifications()
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun discardInAppNotifications(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            val dismissInAppIfVisible = call.argument<Boolean>("dismissInAppIfVisible")
            if (dismissInAppIfVisible != null) {
                instance.discardInAppNotifications(dismissInAppIfVisible)
            } else {
                instance.discardInAppNotifications()
            }
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun resumeInAppNotifications(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.resumeInAppNotifications()
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun dismissPipInApp(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.dismissPipInApp()
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun initializeInbox(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.initializeInbox()
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun fetchInbox(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.fetchInbox()
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun fetchInboxWithCallback(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.fetchInbox(object : FetchInboxCallback {
                override fun onInboxFetched(isSuccess: Boolean) {
                    result.success(isSuccess)
                }
            })
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun onUserLogin(call: MethodCall, result: MethodChannel.Result) {
        val profile: Map<String, Any> = Utils.dartMapToProfileMap(call.argument("profile"))
        val instance = instanceFor(call)
        if (instance != null) {
            instance.onUserLogin(profile)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun processPushNotification(call: MethodCall, result: MethodChannel.Result) {
        val extras = call.argument<Map<String?, Any?>>("extras")!!
        // No default-account check: CleverTapAPI.processPushNotification is static and finds the
        // account from the push (fromBundle). An app with no default account used to get an error
        // here, and the push was not processed.
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
            return // answered once; it used to answer success as well
        }
        result.success(null)
    }

    private fun profileAddMultiValue(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val value = call.argument<String>("value")
        val instance = instanceFor(call)
        if (instance != null) {
            instance.addMultiValueForKey(key, value)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun profileIncrementValue(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val value = call.argument<Number>("value")
        val instance = instanceFor(call)
        if (instance != null) {
            instance.incrementValue(key, value)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun profileDecrementValue(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val value = call.argument<Number>("value")
        val instance = instanceFor(call)
        if (instance != null) {
            instance.decrementValue(key, value)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun profileAddMultiValues(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val values = call.argument<ArrayList<String>>("values")!!
        val instance = instanceFor(call)
        if (instance != null) {
            instance.addMultiValuesForKey(key, values)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun profileGetCleverTapAttributionIdentifier(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.cleverTapAttributionIdentifier)
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun profileGetCleverTapID(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.cleverTapID)
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun getCleverTapID(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.getCleverTapID(
                SingleReplyCleverTapIDListener(
                    // Posted, not run here: the SDK calls listeners while looping over its list,
                    // and removing during that loop throws ConcurrentModificationException.
                    remove = { listener -> mainHandler.post { instance.removeCleverTapIDListener(listener) } },
                    reply = { cleverTapID -> CleverTapPlugin.runOnMainThread { result.success(cleverTapID) } },
                )
            )
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun profileGetProperty(call: MethodCall, result: MethodChannel.Result) {
        val propertyName = call.argument<String>("propertyName")
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.getProperty(propertyName))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun profileRemoveMultiValue(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val value = call.argument<String>("value")
        val instance = instanceFor(call)
        if (instance != null) {
            instance.removeMultiValueForKey(key, value)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun profileRemoveMultiValues(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val values = call.argument<ArrayList<String>>("values")!!
        val instance = instanceFor(call)
        if (instance != null) {
            instance.removeMultiValuesForKey(key, values)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun profileRemoveValueForKey(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val instance = instanceFor(call)
        if (instance != null) {
            instance.removeValueForKey(key)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun profileSet(call: MethodCall, result: MethodChannel.Result) {
        val profile: Map<String, Any> = Utils.dartMapToProfileMap(call.argument("profile"))
        val instance = instanceFor(call)
        if (instance != null) {
            instance.pushProfile(profile)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun profileSetMultiValues(call: MethodCall, result: MethodChannel.Result) {
        val key = call.argument<String>("key")
        val values = call.argument<ArrayList<String>>("values")!!
        val instance = instanceFor(call)
        if (instance != null) {
            instance.setMultiValuesForKey(key, values)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun pushDisplayUnitClickedEvent(call: MethodCall, result: MethodChannel.Result) {
        val unitId = call.argument<String>("unitId")
        val instance = instanceFor(call)
        if (instance != null) {
            instance.pushDisplayUnitClickedEventForID(unitId)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun pushDisplayUnitElementClickedEvent(call: MethodCall, result: MethodChannel.Result) {
        val unitId = call.argument<String>("unitId")
        val additionalProperties = call.argument<HashMap<String, Any>>("additionalProperties")
        val instance = instanceFor(call)
        if (instance != null) {
            instance.pushDisplayUnitElementClickedEventForID(unitId, additionalProperties)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun pushDisplayUnitElementViewedEvent(call: MethodCall, result: MethodChannel.Result) {
        val unitId = call.argument<String>("unitId")
        val additionalProperties = call.argument<HashMap<String, Any>>("additionalProperties")
        val instance = instanceFor(call)
        if (instance != null) {
            instance.pushDisplayUnitElementViewedEventForID(unitId, additionalProperties)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun fetchNativeDisplayMeta(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.fetchNativeDisplayMeta()
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun pushDisplayUnitViewedEvent(call: MethodCall, result: MethodChannel.Result) {
        val unitId = call.argument<String>("unitId")
        val instance = instanceFor(call)
        if (instance != null) {
            instance.pushDisplayUnitViewedEventForID(unitId)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun pushInboxNotificationClickedEventForId(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        val instance = instanceFor(call)
        if (instance != null) {
            val messageId = call.argument<String>("messageId")
            if (messageId.isNullOrEmpty()) {
                result.error(TAG, ERROR_MSG_ID, null)
                return
            }
            instance.pushInboxNotificationClickedEvent(messageId)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun pushInboxNotificationViewedEventForId(
        call: MethodCall,
        result: MethodChannel.Result
    ) {
        val instance = instanceFor(call)
        if (instance != null) {
            val messageId = call.argument<String>("messageId")
            if (messageId.isNullOrEmpty()) {
                result.error(TAG, ERROR_MSG_ID, null)
                return
            }
            instance.pushInboxNotificationViewedEvent(messageId)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun pushInstallReferrer(call: MethodCall, result: MethodChannel.Result) {
        val source = call.argument<String>("source")
        val medium = call.argument<String>("medium")
        val campaign = call.argument<String>("campaign")
        val instance = instanceFor(call)
        if (instance != null) {
            instance.pushInstallReferrer(source, medium, campaign)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun pushNotificationClickedEvent(call: MethodCall, result: MethodChannel.Result) {
        val extrasMap = call.argument<java.util.HashMap<String, Any>>("notificationData")!!
        val extras = Utils.mapToBundle(extrasMap)
        val instance = instanceFor(call)
        if (instance != null) {
            instance.pushNotificationClickedEvent(extras)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun pushNotificationViewedEvent(call: MethodCall, result: MethodChannel.Result) {
        val extrasMap = call.argument<java.util.HashMap<String, Any>>("notificationData")!!
        val extras = Utils.mapToBundle(extrasMap)
        val instance = instanceFor(call)
        if (instance != null) {
            instance.pushNotificationViewedEvent(extras)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun recordChargedEvent(call: MethodCall, result: MethodChannel.Result) {
        val chargeDetails = call.argument<java.util.HashMap<String, Any>>("chargeDetails")!!
        val items = call.argument<ArrayList<java.util.HashMap<String, Any>>>("items")!!
        val instance = instanceFor(call)
        if (instance != null) {
            instance.pushChargedEvent(chargeDetails, items)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun recordEvent(call: MethodCall, result: MethodChannel.Result) {
        val eventData = call.argument<Map<String, Any>>("eventData")!!
        val eventName = call.argument<String>("eventName")
        val instance = instanceFor(call)
        if (instance != null) {
            instance.pushEvent(eventName, eventData)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    /**
     * The instance a call addresses. A static CleverTapPlugin call sends no accountId and gets this
     * engine's default instance, exactly as before. A CleverTapInstance (handle) call sends its
     * accountId and gets that account through the registry, or null after the registry's one
     * warning ("CleverTap instance not found for accountId: ...").
     *
     * Example: {"eventName": "Purchase", "eventData": {}} -> the default account;
     * {"eventName": "Purchase", "eventData": {}, "accountId": "B"} -> account B, never the default.
     */
    private fun instanceFor(call: MethodCall): CleverTapAPI? {
        val accountId = accountIdOf(call.arguments) ?: return cleverTapAPI
        return CleverTapInstanceRegistry.resolve(context, accountId)
    }

    // No instance for a void call. A static call keeps its old answer (an error). A handle call
    // completes normally: the registry already logged the warning, and apps usually do not await
    // these calls, so an error would surface as an uncaught exception on every call (React Native
    // parity: warn and do nothing).
    private fun answerVoidWithoutInstance(call: MethodCall, result: MethodChannel.Result) {
        if (accountIdOf(call.arguments) == null) {
            result.error(TAG, ERROR_MSG, null)
        } else {
            result.success(null)
        }
    }

    // No instance for a call that returns a value: always an error, naming the account for a
    // handle call. The caller awaits it, so the error is delivered, not lost.
    private fun answerValueWithoutInstance(call: MethodCall, result: MethodChannel.Result) {
        val accountId = accountIdOf(call.arguments)
        result.error(TAG, if (accountId == null) ERROR_MSG else "CleverTap instance not found for accountId: $accountId", null)
    }

    private fun recordScreenView(call: MethodCall, result: MethodChannel.Result) {
        val name = call.argument<String>("screenName")
        val instance = instanceFor(call)
        if (instance != null) {
            instance.recordScreen(name)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    @Deprecated(message = "Deprecated Since v3.1.0")
    private fun sessionGetPreviousVisitTime(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.previousVisitTime)
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun sessionGetScreenCount(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.screenCount)
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun sessionGetTimeElapsed(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.getTimeElapsed())
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    @Deprecated(message = "Deprecated Since v3.1.0")
    private fun sessionGetTotalVisits(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            result.success(instance.getTotalVisits())
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun sessionGetUTMDetails(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            val detail: UTMDetail = instance.getUTMDetails()
            result.success(Utils.utmDetailsToMap(detail))
        } else {
            answerValueWithoutInstance(call, result)
        }
    }

    private fun setDefaultsMap(call: MethodCall, result: MethodChannel.Result) {
        val defaults = call.argument<java.util.HashMap<String, Any>>("defaults")!!
        val instance = instanceFor(call)
        if (instance != null) {
            instance.productConfig().setDefaults(defaults)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun setLocation(call: MethodCall, result: MethodChannel.Result) {
        val lat = call.argument<Double>("latitude")!!
        val lon = call.argument<Double>("longitude")!!
        val instance = instanceFor(call)
        if (instance != null) {
            val location = Location("CleverTapFlutter")
            location.latitude = lat
            location.longitude = lon
            instance.location = location
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun setMinimumFetchIntervalInSeconds(call: MethodCall, result: MethodChannel.Result) {
        val interval = call.argument<Int>("interval")!!
        val instance = instanceFor(call)
        if (instance != null) {
            instance.productConfig().setMinimumFetchIntervalInSeconds(interval.toLong())
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun setOffline(call: MethodCall, result: MethodChannel.Result) {
        val value = call.argument<Boolean>("value")!!
        val instance = instanceFor(call)
        if (instance != null) {
            instance.setOffline(value)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun setOptOut(call: MethodCall, result: MethodChannel.Result) {
        val value = call.argument<Boolean>("value")!!
        val allowSystemEvents = call.argument<Boolean>("allowSystemEvents")
        val instance = instanceFor(call)
        if (instance != null) {
            if (allowSystemEvents != null) {
                instance.setOptOut(value, allowSystemEvents)
            } else {
                instance.setOptOut(value)
            }
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun setPersonalization(call: MethodCall, result: MethodChannel.Result, enable: Boolean) {
        val instance = instanceFor(call)
        if (instance != null) {
            if (enable) {
                instance.enablePersonalization()
            } else {
                instance.disablePersonalization()
            }
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun setFCMPushToken(call: MethodCall, result: MethodChannel.Result) {
        val token = call.argument<String>("token")
        val instance = instanceFor(call)
        if (instance != null) {
            instance.pushFcmRegistrationId(token, true)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun pushRegistrationToken(call: MethodCall, result: MethodChannel.Result) {
        val token = call.argument<String>("token")
        val pushType = Utils.mapToPushType(call.argument("pushType"))
        if (pushType == null) {
            result.error(TAG, ERROR_MSG_PUSH_TYPE, null)
            return
        }
        val instance = instanceFor(call)
        if (instance != null) {
            instance.pushRegistrationToken(token, pushType, true)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun showInbox(call: MethodCall, result: MethodChannel.Result) {
        val styleConfigMap = call.argument<Map<String, Any>>("styleConfig")!!
        val styleConfigJson = Utils.mapToJSONObject(styleConfigMap)
        val styleConfig = Utils.jsonToStyleConfig(styleConfigJson)
        val instance = instanceFor(call)
        if (instance != null) {
            instance.showAppInbox(styleConfig)
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun dismissInbox(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.dismissAppInbox()
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun syncCustomTemplates(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.syncRegisteredInAppTemplates()
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    private fun customTemplateSetDismissed(call: MethodCall, templateName: String?, result: MethodChannel.Result) {
        resolveWithTemplateContext(
            call,
            templateName,
            result
        ) { templateContext: CustomTemplateContext ->
            templateContext.setDismissed()
            null
        }
    }

    private fun customTemplateSetPresented(call: MethodCall, templateName: String?, result: MethodChannel.Result) {
        resolveWithTemplateContext(
            call,
            templateName,
            result
        ) { templateContext: CustomTemplateContext ->
            templateContext.setPresented()
            null
        }
    }

    private fun customTemplateRunAction(
        call: MethodCall,
        templateName: String?,
        argName: String?,
        result: MethodChannel.Result
    ) {
        resolveWithTemplateContext(
            call,
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
        call: MethodCall,
        templateName: String?,
        argName: String?,
        result: MethodChannel.Result
    ) {
        resolveWithTemplateContext(
            call,
            templateName,
            result
        ) { templateContext: CustomTemplateContext ->
            templateContext.getString(
                argName!!
            )
        }
    }

    private fun customTemplateGetNumberArg(
        call: MethodCall,
        templateName: String?,
        argName: String?,
        result: MethodChannel.Result
    ) {
        resolveWithTemplateContext(
            call,
            templateName,
            result
        ) { templateContext: CustomTemplateContext ->
            templateContext.getDouble(
                argName!!
            )
        }
    }

    private fun customTemplateGetBooleanArg(
        call: MethodCall,
        templateName: String?,
        argName: String?,
        result: MethodChannel.Result
    ) {
        resolveWithTemplateContext(
            call,
            templateName,
            result
        ) { templateContext: CustomTemplateContext ->
            templateContext.getBoolean(
                argName!!
            )
        }
    }

    private fun customTemplateGetFileArg(
        call: MethodCall,
        templateName: String?,
        argName: String?,
        result: MethodChannel.Result
    ) {
        resolveWithTemplateContext(
            call,
            templateName,
            result
        ) { templateContext: CustomTemplateContext ->
            templateContext.getFile(
                argName!!
            )
        }
    }

    private fun customTemplateGetObjectArg(
        call: MethodCall,
        templateName: String?,
        argName: String?,
        result: MethodChannel.Result
    ) {
        resolveWithTemplateContext(
            call,
            templateName,
            result
        ) { templateContext: CustomTemplateContext ->
            val mapArg = templateContext.getMap(
                argName!!
            )
            mapArg
        }
    }

    private fun customTemplateContextToString(call: MethodCall, templateName: String?, result: MethodChannel.Result) {
        resolveWithTemplateContext(
            call,
            templateName,
            result
        ) { templateContext: CustomTemplateContext -> templateContext.toString() }
    }

    private fun unmute(call: MethodCall, result: MethodChannel.Result) {
        val instance = instanceFor(call)
        if (instance != null) {
            instance.unmute()
            result.success(null)
        } else {
            answerVoidWithoutInstance(call, result)
        }
    }

    // Looks the template up in the call's account: the default for CleverTapPlugin, the handle's
    // account otherwise. Each account keeps its own shown templates, so B's "Spin" is found only
    // through B. A handle whose account does not exist gets an error naming it.
    private fun resolveWithTemplateContext(
        call: MethodCall,
        templateName: String?,
        result: MethodChannel.Result,
        action: TemplateContextAction?
    ) {
        val instance = instanceFor(call)
        if (instance == null) {
            answerValueWithoutInstance(call, result)
            return
        }
        if (templateName != null) {
            val templateContext: CustomTemplateContext? =
                instance.getActiveContextForTemplate(templateName)
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

/**
 * Answers one getCleverTapID call exactly once.
 *
 * Why: the SDK keeps a getCleverTapID listener and calls it again when a new account's device ID is
 * created (Android SDK 8.5.0 CleverTapAPI.deviceIDCreated -> CallbackManager.notifyCleverTapIDChanged).
 * Example: createInstance(B), then getCleverTapID() on B at once: the listener runs with B's ID, and
 * again a moment later. Flutter allows one reply per call, so the second reply threw
 * "Reply already submitted" (caught and logged by CleverTapPlugin.runOnMainThread).
 * Every call also asks to [remove] the listener, so the SDK does not keep it for the whole app run.
 */
internal class SingleReplyCleverTapIDListener(
    private val remove: (OnInitCleverTapIDListener) -> Unit,
    private val reply: (String?) -> Unit,
) : OnInitCleverTapIDListener {

    private val answered = AtomicBoolean(false)

    override fun onInitCleverTapID(cleverTapID: String?) {
        remove(this)
        if (answered.compareAndSet(false, true)) {
            reply(cleverTapID)
        }
    }
}

private fun interface TemplateContextAction {
    fun execute(context: CustomTemplateContext): Any?
}