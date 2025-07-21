import 'dart:async';
import 'dart:ui';
import 'dart:io';

import 'package:clevertap_plugin/clevertap_plugin_web_wrapper.dart';
import 'package:clevertap_plugin/src/types.dart';
import 'package:clevertap_plugin/src/typedefs.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

import 'src/clevertap_callback_dispatcher.dart';

export 'src/types.dart';

class CleverTapPlugin {
  late CleverTapInAppNotificationDismissedHandler
      cleverTapInAppNotificationDismissedHandler;
  late CleverTapInAppNotificationShowHandler
      cleverTapInAppNotificationShowHandler;
  late CleverTapInAppNotificationButtonClickedHandler
      cleverTapInAppNotificationButtonClickedHandler;
  late CleverTapProfileDidInitializeHandler
      cleverTapProfileDidInitializeHandler;
  late CleverTapProfileSyncHandler cleverTapProfileSyncHandler;
  late CleverTapInboxDidInitializeHandler cleverTapInboxDidInitializeHandler;
  late CleverTapInboxMessagesDidUpdateHandler
      cleverTapInboxMessagesDidUpdateHandler;
  late CleverTapInboxNotificationButtonClickedHandler
      cleverTapInboxNotificationButtonClickedHandler;
  late CleverTapInboxNotificationMessageClickedHandler
      cleverTapInboxNotificationMessageClickedHandler;
  late CleverTapDisplayUnitsLoadedHandler cleverTapDisplayUnitsLoadedHandler;
  late CleverTapFeatureFlagUpdatedHandler cleverTapFeatureFlagUpdatedHandler;
  late CleverTapProductConfigInitializedHandler
      cleverTapProductConfigInitializedHandler;
  late CleverTapProductConfigFetchedHandler
      cleverTapProductConfigFetchedHandler;
  late CleverTapProductConfigActivatedHandler
      cleverTapProductConfigActivatedHandler;
  late CleverTapPushAmpPayloadReceivedHandler
      cleverTapPushAmpPayloadReceivedHandler;
  late CleverTapPushClickedPayloadReceivedHandler
      cleverTapPushClickedPayloadReceivedHandler;
  late CleverTapPushPermissionResponseReceivedHandler
      cleverTapPushPermissionResponseReceivedHandler;

  static List<CleverTapOnVariablesChangedHandler>
      cleverTapOnVariablesChangedHandlers = [];
  static List<CleverTapOnOneTimeVariablesChangedHandler>
      cleverTapOnOneTimeVariablesChangedHandlers = [];
  static List<CleverTapOnValueChangedHandler> cleverTapOnValueChangedHandlers = [];
  static List<CleverTapOnVariablesChangedAndNoDownloadsPendingHandler> cleverTapOnVariablesChangedAndNoDownloadsPendingHandlers = [];
  static List<CleverTapOnceVariablesChangedAndNoDownloadsPendingHandler> cleverTapOnceVariablesChangedAndNoDownloadsPendingHandlers = [];
  static List<CleverTapOnFileValueChangedHandler> cleverTapOnFileValueChangedHandlers = [];

  late CleverTapCustomTemplatePresentHandler cleverTapCustomTemplatePresentHandler;
  late CleverTapCustomFunctionPresentHandler cleverTapCustomFunctionPresentHandler;
  late CleverTapCustomTemplateCloseHandler cleverTapCustomTemplateCloseHandler;

  static const MethodChannel _dartToNativeMethodChannel =
      const MethodChannel('clevertap_plugin/dart_to_native');
  static const MethodChannel _nativeToDartMethodChannel =
      const MethodChannel('clevertap_plugin/native_to_dart');

  static final CleverTapPlugin _clevertapPlugin =
      new CleverTapPlugin._internal();

  factory CleverTapPlugin() {
    print("CleverTapPlugin() called");
    return _clevertapPlugin;
  }

  static const libName = 'Flutter';

  static const libVersion =
      30400; // If the current version is X.X.X then pass as X0X0X

  CleverTapPlugin._internal() {
    /// Set the CleverTap Flutter library name and the current version for version tracking
    _dartToNativeMethodChannel.invokeMethod('setLibrary', {'libName': libName, 'libVersion': libVersion});
    _nativeToDartMethodChannel.setMethodCallHandler(_platformCallHandler);
  }

  Future _platformCallHandler(MethodCall call) async {
    print("_platformCallHandler call ${call.method} ${call.arguments}");
    switch (call.method) {
      case "inAppNotificationDismissed":
        Map<dynamic, dynamic> args = call.arguments;
        cleverTapInAppNotificationDismissedHandler(
            args.cast<String, dynamic>());
        break;
      case "inAppNotificationShow":
        Map<dynamic, dynamic> args = call.arguments;
        cleverTapInAppNotificationShowHandler(args.cast<String, dynamic>());
        break;
      case "onInAppButtonClick":
        Map<dynamic, dynamic> args = call.arguments;
        cleverTapInAppNotificationButtonClickedHandler(
            args.cast<String, dynamic>());
        break;
      case "profileDidInitialize":
        cleverTapProfileDidInitializeHandler();
        break;
      case "profileDataUpdated":
        cleverTapProfileSyncHandler(call.arguments);
        break;
      case "inboxDidInitialize":
        cleverTapInboxDidInitializeHandler();
        break;
      case "inboxMessagesDidUpdate":
        cleverTapInboxMessagesDidUpdateHandler();
        break;
      case "onInboxButtonClick":
        Map<dynamic, dynamic> args = call.arguments;
        cleverTapInboxNotificationButtonClickedHandler(
            args.cast<String, dynamic>());
        break;
      case "onInboxMessageClick":
        Map<dynamic, dynamic> args = call.arguments;
        Map<dynamic, dynamic> message = args["data"];
        int contentPageIndex = args["contentPageIndex"];
        int buttonIndex = args["buttonIndex"];
        cleverTapInboxNotificationMessageClickedHandler(
            message.cast<String, dynamic>(), contentPageIndex, buttonIndex);
        break;
      case "onDisplayUnitsLoaded":
        List<dynamic>? args = call.arguments;
        cleverTapDisplayUnitsLoadedHandler(args);
        break;
      case "featureFlagsUpdated":
        cleverTapFeatureFlagUpdatedHandler();
        break;
      case "productConfigInitialized":
        cleverTapProductConfigInitializedHandler();
        break;
      case "productConfigFetched":
        cleverTapProductConfigFetchedHandler();
        break;
      case "productConfigActivated":
        cleverTapProductConfigActivatedHandler();
        break;
      case "pushAmpPayloadReceived":
        Map<dynamic, dynamic> args = call.arguments;
        cleverTapPushAmpPayloadReceivedHandler(args.cast<String, dynamic>());
        break;

      case "pushClickedPayloadReceived":
        Map<dynamic, dynamic> args = call.arguments;
        cleverTapPushClickedPayloadReceivedHandler(
            args.cast<String, dynamic>());
        break;
      case "pushPermissionResponseReceived":
        bool accepted = call.arguments;
        cleverTapPushPermissionResponseReceivedHandler(accepted);
        break;
      case "onVariablesChanged":
        Map<dynamic, dynamic> args = call.arguments;
        cleverTapOnVariablesChangedHandlers
            .forEach((cleverTapOnVariablesChangedHandler) {
          cleverTapOnVariablesChangedHandler(args.cast<String, dynamic>());
        });
        break;
      case "onOneTimeVariablesChanged":
        Map<dynamic, dynamic> args = call.arguments;
        cleverTapOnOneTimeVariablesChangedHandlers
            .forEach((cleverTapOnOneTimeVariablesChangedHandler) {
          cleverTapOnOneTimeVariablesChangedHandler(args.cast<String, dynamic>());
        });
        break;
      case "onValueChanged":
        Map<dynamic, dynamic> args = call.arguments;
        cleverTapOnValueChangedHandlers
            .forEach((cleverTapOnValueChangedHandler) {
          cleverTapOnValueChangedHandler(args.cast<String, dynamic>());
        });
        break;
      case "onVariablesChangedAndNoDownloadsPending":
        Map<dynamic, dynamic> args = call.arguments;
        cleverTapOnVariablesChangedAndNoDownloadsPendingHandlers
            .forEach((cleverTapOnVariablesChangedAndNoDownloadsPendingHandler) {
          cleverTapOnVariablesChangedAndNoDownloadsPendingHandler(args.cast<String, dynamic>());
        });
        break;      
      case "onceVariablesChangedAndNoDownloadsPending":
        Map<dynamic, dynamic> args = call.arguments;
        cleverTapOnceVariablesChangedAndNoDownloadsPendingHandlers
            .forEach((cleverTapOnceVariablesChangedAndNoDownloadsPendingHandler) {
          cleverTapOnceVariablesChangedAndNoDownloadsPendingHandler(args.cast<String, dynamic>());
        });
        break;      
      case "onFileValueChanged":
        Map<dynamic, dynamic> args = call.arguments;
        cleverTapOnFileValueChangedHandlers
            .forEach((cleverTapOnFileValueChangedHandler) {
          cleverTapOnFileValueChangedHandler(args.cast<String, dynamic>());
        });
        break;
      case "customTemplatePresent":
        String templateName = call.arguments;
        cleverTapCustomTemplatePresentHandler(templateName);
        break;
      case "customFunctionPresent":
        String templateName = call.arguments;
        cleverTapCustomFunctionPresentHandler(templateName);
        break;
      case "customTemplateClose":
        String templateName = call.arguments;
        cleverTapCustomTemplateCloseHandler(templateName);
        break;
      default:
        print('error');
        break;
    }
  }

  /**
   * Flushes any finished events on clevertap sdk side, maybe the client attaches
   * listener at a later point and sdk has already tried to provide callback and
   * failed
   */
  void invokeStartEmission(String name) {
    if (Platform.isAndroid) {
    _dartToNativeMethodChannel.invokeMethod('startEmission', name);
    }
  }
  
  void setCleverTapCustomTemplatePresentHandler(CleverTapCustomTemplatePresentHandler handler) {
    invokeStartEmission('CleverTapCustomTemplatePresent');
    cleverTapCustomTemplatePresentHandler = handler;
  }
  void setCleverTapCustomFunctionPresentHandler(CleverTapCustomTemplateCloseHandler handler) {
    invokeStartEmission('CleverTapCustomFunctionPresent');
    cleverTapCustomFunctionPresentHandler = handler;
  }
  void setCleverTapCustomTemplateCloseHandler(CleverTapCustomFunctionPresentHandler handler) {
    invokeStartEmission('CleverTapCustomTemplateClose');
    cleverTapCustomTemplateCloseHandler = handler;
  }

  /// Define a method to handle inApp notification dismissed
  void setCleverTapInAppNotificationDismissedHandler(CleverTapInAppNotificationDismissedHandler handler) {
    invokeStartEmission('CleverTapInAppNotificationDismissed');
    cleverTapInAppNotificationDismissedHandler = handler;
  }

  /// Only for Android - Define a method to handle inApp notification shown
  void setCleverTapInAppNotificationShowHandler(CleverTapInAppNotificationShowHandler handler) {
    invokeStartEmission('CleverTapInAppNotificationShowed');
    cleverTapInAppNotificationShowHandler = handler;
  }

  /// Define a method to handle inApp notification button clicked
  void setCleverTapInAppNotificationButtonClickedHandler(CleverTapInAppNotificationButtonClickedHandler handler) {
    invokeStartEmission('CleverTapInAppNotificationButtonTapped');
    cleverTapInAppNotificationButtonClickedHandler = handler;
  }

  /// Define a method to handle profile initialization
  void setCleverTapProfileDidInitializeHandler(CleverTapProfileDidInitializeHandler handler) {
    invokeStartEmission('CleverTapProfileDidInitialize');
    cleverTapProfileDidInitializeHandler = handler;
  }

  /// Define a method to handle profile sync
  void setCleverTapProfileSyncHandler(CleverTapProfileSyncHandler handler) {
    invokeStartEmission('CleverTapProfileSync');
    cleverTapProfileSyncHandler = handler;
  }

  /// Define a method to handle inbox initialization
  void setCleverTapInboxDidInitializeHandler(CleverTapInboxDidInitializeHandler handler) {
    invokeStartEmission('CleverTapInboxDidInitialize');
    cleverTapInboxDidInitializeHandler = handler;
  }

  /// Define a method to handle inbox update
  void setCleverTapInboxMessagesDidUpdateHandler(CleverTapInboxMessagesDidUpdateHandler handler) {
    invokeStartEmission('CleverTapInboxMessagesDidUpdate');
    cleverTapInboxMessagesDidUpdateHandler = handler;
  }

  /// Define a method to handle inbox notification button clicked
  void setCleverTapInboxNotificationButtonClickedHandler(CleverTapInboxNotificationButtonClickedHandler handler) {
    invokeStartEmission('CleverTapInboxMessageButtonTapped');
    cleverTapInboxNotificationButtonClickedHandler = handler;
  }

  /// Define a method to handle inbox notification message clicked
  void setCleverTapInboxNotificationMessageClickedHandler(CleverTapInboxNotificationMessageClickedHandler handler) {
    invokeStartEmission('CleverTapInboxMessageTapped');
    cleverTapInboxNotificationMessageClickedHandler = handler;
  }

  /// Define a method to handle Native Display Unit updates
  void setCleverTapDisplayUnitsLoadedHandler(CleverTapDisplayUnitsLoadedHandler handler) {
    invokeStartEmission('CleverTapDisplayUnitsLoaded');
    cleverTapDisplayUnitsLoadedHandler = handler;
  }

  /// Define a method to handle Feature Flag updates
  void setCleverTapFeatureFlagUpdatedHandler(CleverTapFeatureFlagUpdatedHandler handler) {
    invokeStartEmission('CleverTapFeatureFlagsDidUpdate');
    cleverTapFeatureFlagUpdatedHandler = handler;
  }

  /// Define a method to handle Product config initialization
  void setCleverTapProductConfigInitializedHandler(CleverTapProductConfigInitializedHandler handler) {
    invokeStartEmission('CleverTapProductConfigDidInitialize');
    cleverTapProductConfigInitializedHandler = handler;
  }

  /// Define a method to handle Product config fetch updates
  void setCleverTapProductConfigFetchedHandler(CleverTapProductConfigFetchedHandler handler) {
    invokeStartEmission('CleverTapProductConfigDidFetch');
    cleverTapProductConfigFetchedHandler = handler;
  }

  /// Define a method to handle Product config activation updates
  void setCleverTapProductConfigActivatedHandler(CleverTapProductConfigActivatedHandler handler) {
    invokeStartEmission('CleverTapProductConfigDidActivate');
    cleverTapProductConfigActivatedHandler = handler;
  }

  /// Define a method to handle Push Amplification payload
  void setCleverTapPushAmpPayloadReceivedHandler(CleverTapPushAmpPayloadReceivedHandler handler) {
    invokeStartEmission('CleverTapPushAmpPayloadReceived');
    cleverTapPushAmpPayloadReceivedHandler = handler;
  }

  /// Define a method to handle Push Clicked payload
  void setCleverTapPushClickedPayloadReceivedHandler(CleverTapPushClickedPayloadReceivedHandler handler) {
    invokeStartEmission('CleverTapPushNotificationClicked');
    cleverTapPushClickedPayloadReceivedHandler = handler;
  }

  /// Define a method to handle Push permission response
  void setCleverTapPushPermissionResponseReceivedHandler(CleverTapPushPermissionResponseReceivedHandler handler) {
    invokeStartEmission('CleverTapPushPermissionResponseReceived');
    cleverTapPushPermissionResponseReceivedHandler = handler;
  }

  /// Set a message handler function which is called when the app is in the
  /// terminated or killed state.
  ///
  /// This provided handler must be a top-level function and cannot be
  /// anonymous otherwise an [ArgumentError] will be thrown.
  static void onKilledStateNotificationClicked(
      CleverTapOnKilledStateNotificationClickedHandler handler) {
    _registerKilledStateNotificationClickedHandler(handler);
  }

  static bool _killedStateNotificationClickedHandlerInitialized = false;

  static void _registerKilledStateNotificationClickedHandler(
      CleverTapOnKilledStateNotificationClickedHandler handler) async {
    if (defaultTargetPlatform != TargetPlatform.android) {
      return;
    }

    if (!_killedStateNotificationClickedHandlerInitialized) {
      _killedStateNotificationClickedHandlerInitialized = true;
      final CallbackHandle pluginCallbackHandle =
          PluginUtilities.getCallbackHandle(callbackDispatcher)!;
      final CallbackHandle userCallbackHandle =
          PluginUtilities.getCallbackHandle(handler)!;
      await _dartToNativeMethodChannel
          .invokeMapMethod('registerKilledStateNotificationClickedHandler', {
        'pluginCallbackHandle': pluginCallbackHandle.toRawHandle(),
        'userCallbackHandle': userCallbackHandle.toRawHandle(),
      });
    }
  }

  static Future<CleverTapAppLaunchNotification>
      getAppLaunchNotification() async {
    Map<dynamic, dynamic> result = await _dartToNativeMethodChannel
        .invokeMethod('getAppLaunchNotification');
    return CleverTapAppLaunchNotification.fromMap(result);
  }

  /// Only for Web - Initialize clevertap sdk
  static Future<void> init(String accountId,
      [String? region, String? targetDomain, String? token]) async {
    if (!kIsWeb) {
      return;
    }
    var allProperties = <String, dynamic>{
      'accountId': accountId,
      'region': region,
      'targetDomain': targetDomain,
      'token': token
    };
    await _dartToNativeMethodChannel.invokeMethod<void>('init', allProperties);
  }

  static Future<void> toggleInbox(Object rect) async {
    if (!kIsWeb) {
      return null;
    }
    return await _dartToNativeMethodChannel
        .invokeMethod('toggleInbox', {'rect': rect});
  }

  /// Only for Web - Return the accountId
  static Future<String?> getAccountID() async {
    if (!kIsWeb) {
      return null;
    }
    return await _dartToNativeMethodChannel.invokeMethod('getAccountID', {});
  }

  /// Only for Web - Return the Web Native Display KV pair data
  static void addKVDataChangeListener(CleverTapOnKVDataChangedHandler handler) {
    if (!kIsWeb) {
      return null;
    }
    CleverTapPluginWeb.addKVDataChangeListener(handler);
  }

  /// Only for Web - Method to ensure that clevertap does not auto collect the device IP as per GDPR rules
  static Future<void> setUseIP(bool value) async {
    if (!kIsWeb) {
      return;
    }
    return await _dartToNativeMethodChannel
        .invokeMethod('setUseIP', {'value': value});
  }

  /// Only for Web - Render notification viewed
  static Future<void> renderNotificationViewed(
      Map<String, dynamic> viewedData) async {
    if (!kIsWeb) {
      return;
    }
    await _dartToNativeMethodChannel.invokeMethod<void>(
        'renderNotificationViewed', viewedData);
  }

  /// Only for Web - Render notification clicked
  static Future<void> renderNotificationClicked(
      Map<String, dynamic> clickedData) async {
    if (!kIsWeb) {
      return;
    }
    await _dartToNativeMethodChannel.invokeMethod<void>(
        'renderNotificationClicked', clickedData);
  }

  /// Only for Web - enable web push
  static Future<void> enableWebPush(Map<String, dynamic> pushData) async {
    if (!kIsWeb) {
      return;
    }
    await _dartToNativeMethodChannel.invokeMethod<void>(
        'enableWebPush', pushData);
  }

  /// Only for Web - enable web push for customized prompt
  static Future<void> enableWebPushNotifications(
      Map<String, dynamic> pushData) async {
    if (!kIsWeb) {
      return;
    }
    await _dartToNativeMethodChannel.invokeMethod<void>(
        'enableWebPushNotifications', pushData);
  }

  /// Only for Web - Mark all messages as read
  static Future<void> markReadAllInboxMessage() async {
    if (!kIsWeb) {
      return;
    }
    return await _dartToNativeMethodChannel
        .invokeMethod('markReadAllInboxMessage', {});
  }

  /// Sets debug level to show logs on Android Studio/Xcode console
  static Future<void> setDebugLevel(int value) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('setDebugLevel', {'debugLevel': value});
  }

  /// Only for iOS - Registers the application to receive push notifications
  static Future<void> registerForPush() async {
    return await _dartToNativeMethodChannel.invokeMethod('registerForPush', {});
  }

  /// Set the FCM Token for Push Notifications
  static Future<void> setPushToken(String value) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('setPushToken', {'token': value});
  }

  /// Set the Token for Push Notifications for push providers other than FCM
  static Future<void> pushRegistrationToken(String value, Map<String, String> pushType) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('pushRegistrationToken', {'token': value, 'pushType': pushType});
  }

  /// Method to create Notification Channel
  static Future<void> createNotificationChannel(
      String channelId,
      String channelName,
      String channelDescription,
      int importance,
      bool showBadge) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('createNotificationChannel', {
      'channelId': channelId,
      'channelName': channelName,
      'channelDescription': channelDescription,
      'importance': importance,
      'showBadge': showBadge
    });
  }

  /// Method to create Notification Channel With Sound
  static Future<void> createNotificationChannelWithSound(
      String channelId,
      String channelName,
      String channelDescription,
      int importance,
      bool showBadge,
      String sound) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('createNotificationChannelWithSound', {
      'channelId': channelId,
      'channelName': channelName,
      'channelDescription': channelDescription,
      'importance': importance,
      'showBadge': showBadge,
      'sound': sound
    });
  }

  /// Method to create Notification Channel with Group
  static Future<void> createNotificationChannelWithGroupId(
      String channelId,
      String channelName,
      String channelDescription,
      int importance,
      String groupId,
      bool showBadge) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('createNotificationChannelWithGroupId', {
      'channelId': channelId,
      'channelName': channelName,
      'channelDescription': channelDescription,
      'importance': importance,
      'groupId': groupId,
      'showBadge': showBadge
    });
  }

  /// Method to create Notification Channel with Group and Sound
  static Future<void> createNotificationChannelWithGroupIdAndSound(
      String channelId,
      String channelName,
      String channelDescription,
      int importance,
      String groupId,
      bool showBadge,
      String sound) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('createNotificationChannelWithGroupId', {
      'channelId': channelId,
      'channelName': channelName,
      'channelDescription': channelDescription,
      'importance': importance,
      'groupId': groupId,
      'showBadge': showBadge,
      'sound': sound
    });
  }

  /// Method to create Notification Channel Group
  static Future<void> createNotificationChannelGroup(
      String groupId, String groupName) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'createNotificationChannelGroup',
        {'groupId': groupId, 'groupName': groupName});
  }

  /// Method to delete Notification Channel
  static Future<void> deleteNotificationChannel(String channelId) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('deleteNotificationChannel', {'channelId': channelId});
  }

  /// Method to delete Notification Channel Group
  static Future<void> deleteNotificationChannelGroup(String groupId) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('deleteNotificationChannelGroup', {'groupId': groupId});
  }

  /// Method to create Notification using CleverTap
  static Future<void> createNotification(dynamic data) async {
    print("inside createNotification Dart");
    return await _dartToNativeMethodChannel
        .invokeMethod('createNotification', {'extras': data});
  }

  /// Method to process Notification using CleverTap to avoid duplicates using Push Amplification
  static Future<void> processPushNotification(dynamic data) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('processPushNotification', {'extras': data});
  }

  /// Method to allow user to Opt out of sending data to CleverTap as per GDPR rules
  static Future<void> setOptOut(bool value) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('setOptOut', {'value': value});
  }

  /// Sets the CleverTap SDK to offline
  static Future<void> setOffline(bool value) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('setOffline', {'value': value});
  }

  /// Enables Device & Networking Information Reporting to CleverTap
  static Future<void> enableDeviceNetworkInfoReporting(bool value) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('enableDeviceNetworkInfoReporting', {'value': value});
  }

  /// Enables the Profile/Events Read and Synchronization API
  static Future<void> enablePersonalization() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('enablePersonalization', {});
  }

  /// Disables the Profile/Events Read and Synchronization API
  static Future<void> disablePersonalization() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('disablePersonalization', {});
  }

  ///Record Notification Clicked event
  static Future<void> pushNotificationClickedEvent(
      Map<String, dynamic> extras) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'pushNotificationClickedEvent', {'notificationData': extras});
  }

  ///Record Notification Viewed event
  static Future<void> pushNotificationViewedEvent(
      Map<String, dynamic> extras) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'pushNotificationViewedEvent', {'notificationData': extras});
  }

  /// Record a Screen View event
  static Future<void> recordScreenView(String screenName) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('recordScreenView', {'screenName': screenName});
  }

  /// Pushes a basic event.
  static Future<void> recordEvent(
      String eventName, Map<String, dynamic> properties) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'recordEvent', {'eventName': eventName, 'eventData': properties});
  }

  ///**
  /// * Push Charged event, which describes a purchase made.
  /// *
  /// * @param chargeDetails A Map, with keys as strings, and values as String,
  /// *                      Integer, Long,  Boolean}, Float, Double,
  /// *                      java.util.Date, or Character
  /// * @param items         A List which contains up to 15 Map objects,
  /// *                      where each Map object describes a particular item purchased
  ///
  static Future<void> recordChargedEvent(Map<String, dynamic> chargeDetails,
      List<Map<String, dynamic>> items) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'recordChargedEvent', {'chargeDetails': chargeDetails, 'items': items});
  }

  @Deprecated("This method is deprecated since 3.1.0. User getUserEventLog() instead")
  /// Returns the timestamp of the first time the given event was raised
  static Future<dynamic> eventGetFirstTime(String eventName) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('eventGetFirstTime', {'eventName': eventName});
  }

  @Deprecated("This method is deprecated since 3.1.0. User getUserEventLog() instead")
  /// Returns the timestamp of the last time the given event was raised
  static Future<dynamic> eventGetLastTime(String eventName) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('eventGetLastTime', {'eventName': eventName});
  }

  @Deprecated("This method is deprecated since 3.1.0. User getUserEventLogCount() instead")
  /// Returns the total count of the specified event
  static Future<int?> eventGetOccurrences(String eventName) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('eventGetOccurrences', {'eventName': eventName});
  }

  @Deprecated("This method is deprecated since 3.1.0. User getUserEventLog() instead")
  /// Returns a Map object for the particular event passed. EventDetail consists of event name, count, first time
  //  and last time timestamp of the event.
  static Future<Map<String, dynamic>> eventGetDetail(String eventName) async {
    Map<dynamic, dynamic> response = await _dartToNativeMethodChannel
        .invokeMethod('eventGetDetail', {'eventName': eventName});
    return response.cast<String, dynamic>();
  }

  @Deprecated("This method is deprecated since 3.1.0. User getUserEventLogHistory() instead")
  /// Returns a Map of event names and corresponding event details of all the events raised
  static Future<Map<String, dynamic>> getEventHistory(String eventName) async {
    Map<dynamic, dynamic> response = await _dartToNativeMethodChannel
        .invokeMethod('getEventHistory', {'eventName': eventName});
    return response.cast<String, dynamic>();
  }

  /// Returns a Map object for the particular event passed. UserEventLog consists of eventName, normalizedEventName, count, deviceID, firstTime and lastTime timestamp of the event.
  static Future<Map<String, dynamic>> getUserEventLog(String eventName) async {
    Map<dynamic, dynamic> response = await _dartToNativeMethodChannel
        .invokeMethod('getUserEventLog', {'eventName': eventName});
    return response.cast<String, dynamic>();
  }

  /// Returns the total count of the specified event
  static Future<int?> getUserEventLogCount(String eventName) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('getUserEventLogCount', {'eventName': eventName});
  }

  /// Returns a Map of event names and corresponding UserEventLog of all the events raised
  static Future<Map<String, dynamic>> getUserEventLogHistory() async {
    Map<dynamic, dynamic> response = await _dartToNativeMethodChannel
        .invokeMethod('getUserEventLogHistory', {});
    return response.cast<String, dynamic>();
  }

  /// Returns the total number of times user has launched the app
  static Future<int?> getUserAppLaunchCount() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('getUserAppLaunchCount', {});
  }

  /// Returns the timestamp of user's last app visit
  static Future<num?> getUserLastVisitTs() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('getUserLastVisitTs', {});
  }


  /// Set the user profile location in CleverTap
  static Future<void> setLocation(double latitude, double longitude) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'setLocation', {'latitude': latitude, 'longitude': longitude});
  }

  /// Returns the user profile property value for the specified key.
  static Future<Object?> profileGetProperty(String propertyName) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('profileGetProperty', {'propertyName': propertyName});
  }

  @Deprecated(
      "This method is deprecated since v1.3.0. Use getCleverTapID() instead")

  /// Returns a unique CleverTap identifier suitable for use with install attribution providers.
  static Future<String?> profileGetCleverTapAttributionIdentifier() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('profileGetCleverTapAttributionIdentifier', {});
  }

  @Deprecated(
      "This method is deprecated since v1.3.0. Use getCleverTapID() instead")

  /// Returns a unique identifier by which CleverTap identifies this user.
  static Future<String?> profileGetCleverTapID() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('profileGetCleverTapID', {});
  }

  /// Returns a unique identifier through callback by which CleverTap identifies this user
  static Future<String?> getCleverTapID() async {
    return await _dartToNativeMethodChannel.invokeMethod('getCleverTapID', {});
  }

  ///  Creates a separate and distinct user profile identified by one or more of Identity,
  ///  Email, FBID or GPID values,
  ///  and populated with the key-values included in the profile map argument.
  ///  <p>
  ///  If your app is used by multiple users, you can use this method to assign them each a
  ///  unique profile to track them separately.
  ///  <p>
  ///  If instead you wish to assign multiple Identity, Email, FBID and/or GPID values to the same
  ///  user profile,
  ///  use profileSet rather than this method.
  ///  <p>
  ///  If none of Identity, Email, FBID or GPID is included in the profile map,
  ///  all profile map values will be associated with the current user profile.
  ///  <p>
  ///  When initially installed on this device, your app is assigned an "anonymous" profile.
  ///  The first time you identify a user on this device (whether via onUserLogin or profileSet),
  ///  the "anonymous" history on the device will be associated with the newly identified user.
  ///  <p>
  ///  Then, use this method to switch between subsequent separate identified users.
  ///  <p>
  ///  Please note that switching from one identified user to another is a costly operation
  ///  in that the current session for the previous user is automatically closed
  ///  and data relating to the old user removed, and a new session is started
  ///  for the new user and data for that user refreshed via a network call to CleverTap.
  ///  In addition, any global frequency caps are reset as part of the switch.
  ///
  ///  @param profile The map keyed by the type of identity, with the value as the identity
  ///
  static Future<void> onUserLogin(Map<String, dynamic> profile) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('onUserLogin', {'profile': profile});
  }

  /// Push a profile update.
  static Future<void> profileSet(Map<String, dynamic> profile) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('profileSet', {'profile': profile});
  }

  ///Remove the user profile property value specified by key from the user profile
  static Future<void> profileRemoveValueForKey(String key) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('profileRemoveValueForKey', {'key': key});
  }

  /// Set a collection of unique values as a multi-value user profile property, any existing value will be overwritten.
  /// Max 100 values, on reaching 100 cap, oldest value(s) will be removed.
  /// Values must be Strings and are limited to 512 characters.
  static Future<void> profileSetMultiValues(String key, List values) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('profileSetMultiValues', {'key': key, 'values': values});
  }

  /// Add a unique value to a multi-value user profile property
  /// If the property does not exist it will be created
  /// <p/>
  /// Max 100 values, on reaching 100 cap, oldest value(s) will be removed.
  /// Values must be Strings and are limited to 512 characters.
  /// <p/>
  /// If the key currently contains a scalar value, the key will be promoted to a multi-value property
  /// with the current value cast to a string and the new value(s) added
  static Future<void> profileAddMultiValue(String key, String value) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('profileAddMultiValue', {'key': key, 'value': value});
  }

  ///Increment given num value. The value should be in positive range
  static Future<void> profileIncrementValue(String key, num value) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('profileIncrementValue', {'key': key, 'value': value});
  }

  ///Decrement given num value. The value should be in positive range
  static Future<void> profileDecrementValue(String key, num value) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('profileDecrementValue', {'key': key, 'value': value});
  }

  /// Add a collection of unique values to a multi-value user profile property
  /// If the property does not exist it will be created
  /// <p/>
  /// Max 100 values, on reaching 100 cap, oldest value(s) will be removed.
  /// Values must be Strings and are limited to 512 characters.
  /// <p/>
  /// If the key currently contains a scalar value, the key will be promoted to a multi-value property
  /// with the current value cast to a string and the new value(s) added
  static Future<void> profileAddMultiValues(String key, List values) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('profileAddMultiValues', {'key': key, 'values': values});
  }

  /// Remove a unique value from a multi-value user profile property
  /// <p/>
  /// If the key currently contains a scalar value, prior to performing the remove operation
  /// the key will be promoted to a multi-value property with the current value cast to a string.
  /// If the multi-value property is empty after the remove operation, the key will be removed.
  static Future<void> profileRemoveMultiValue(String key, String value) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('profileRemoveMultiValue', {'key': key, 'value': value});
  }

  /// Remove a collection of unique values from a multi-value user profile property
  /// <p/>
  /// If the key currently contains a scalar value, prior to performing the remove operation
  /// the key will be promoted to a multi-value property with the current value cast to a string.
  /// If the multi-value property is empty after the remove operation, the key will be removed.
  static Future<void> profileRemoveMultiValues(String key, List values) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'profileRemoveMultiValues', {'key': key, 'values': values});
  }

  /// This method is used to push install referrer via UTM source, medium & campaign parameters
  static Future<void> pushInstallReferrer(
      String source, String medium, String campaign) async {
    return await _dartToNativeMethodChannel.invokeMethod('pushInstallReferrer',
        {'source': source, 'medium': medium, 'campaign': campaign});
  }

  /// Returns the time elapsed by the user on the app
  static Future<dynamic> sessionGetTimeElapsed() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('sessionGetTimeElapsed', {});
  }

  @Deprecated("This method is deprecated since 3.1.0. User getUserAppLaunchCount() instead")
  /// Returns the total number of times the app has been launched
  static Future<int?> sessionGetTotalVisits() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('sessionGetTotalVisits', {});
  }

  /// Returns the number of screens which have been displayed by the app
  static Future<int?> sessionGetScreenCount() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('sessionGetScreenCount', {});
  }

  @Deprecated("This method is deprecated since 3.1.0. User getUserLastVisitTs() instead")
  /// Returns the timestamp of the previous visit
  static Future<dynamic> sessionGetPreviousVisitTime() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('sessionGetPreviousVisitTime', {});
  }

  /// Returns a Map of UTMDetail object which consists of UTM parameters like source, medium & campaign
  static Future<Map<String, dynamic>> sessionGetUTMDetails() async {
    Map<dynamic, dynamic> response = await _dartToNativeMethodChannel
        .invokeMethod('sessionGetUTMDetails', {});
    return response.cast<String, dynamic>();
  }

  /// In-App Controls

  /// Suspends display of InApp Notifications.
  /// The InApp Notifications are queued once this method is called
  /// and will be displayed once resumeInAppNotifications() is called.
  static Future<void> suspendInAppNotifications() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('suspendInAppNotifications', {});
  }

  /// Suspends the display of InApp Notifications and discards any new InApp Notifications to be shown
  /// after this method is called.
  /// The InApp Notifications will be displayed only once resumeInAppNotifications() is called.
  static Future<void> discardInAppNotifications() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('discardInAppNotifications', {});
  }

  /// Resumes display of InApp Notifications.
  /// If suspendInAppNotifications() was called previously, calling this method will instantly show
  /// all queued InApp Notifications and also resume InApp Notifications on events raised after this
  /// method is called.
  /// If discardInAppNotifications() was called previously, calling this method will only resume
  /// InApp Notifications on events raised after this method is called.
  static Future<void> resumeInAppNotifications() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('resumeInAppNotifications', {});
  }

  /// Initializes the inbox controller and sends a callback
  static Future<void> initializeInbox() async {
    return await _dartToNativeMethodChannel.invokeMethod('initializeInbox', {});
  }

  /// Opens CTInboxActivity to display Inbox Messages
  static Future<void> showInbox(Map<String, dynamic> styleConfig) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('showInbox', {'styleConfig': styleConfig});
  }

  ///Dismisses the App Inbox screen
  static Future<void> dismissInbox() async {
    return await _dartToNativeMethodChannel.invokeMethod('dismissInbox', {});
  }

  /// Returns the count of all inbox messages for the user
  static Future<int?> getInboxMessageCount() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('getInboxMessageCount', {});
  }

  /// Returns the count of total number of unread inbox messages for the user
  static Future<int?> getInboxMessageUnreadCount() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('getInboxMessageUnreadCount', {});
  }

  /// Returns a list of json string representation of all CTInboxMessage

  static Future<List?> getAllInboxMessages() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('getAllInboxMessages', {});
  }

  /// Returns a list of json string representation of unread CTInboxMessage
  static Future<List?> getUnreadInboxMessages() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('getUnreadInboxMessages', {});
  }

  /// Returns a json string representation of CTInboxMessage for given messageId
  static Future<Map<String, dynamic>> getInboxMessageForId(
      String messageId) async {
    Map<dynamic, dynamic> response = await _dartToNativeMethodChannel
        .invokeMethod('getInboxMessageForId', {'messageId': messageId});
    return response.cast<String, dynamic>();
  }

  /// Deletes the CTInboxMessage object for given messageId
  static Future<void> deleteInboxMessageForId(String messageId) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('deleteInboxMessageForId', {'messageId': messageId});
  }

  /// Deletes the CTInboxMessage objects for given messageIds
  static Future<void> deleteInboxMessagesForIds(List<String> messageIds) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('deleteInboxMessagesForIds', {'messageIds': messageIds});
  }

  /// Marks the given messageId of CTInboxMessage object as read
  static Future<void> markReadInboxMessageForId(String messageId) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('markReadInboxMessageForId', {'messageId': messageId});
  }

  /// Marks the given messageIds of CTInboxMessage objects as read
  static Future<void> markReadInboxMessagesForIds(
      List<String> messageIds) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'markReadInboxMessagesForIds', {'messageIds': messageIds});
  }

  /// Pushes the Notification Clicked event for App Inbox to CleverTap.
  static Future<void> pushInboxNotificationClickedEventForId(
      String messageId) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'pushInboxNotificationClickedEventForId', {'messageId': messageId});
  }

  /// Pushes the Notification Viewed event for App Inbox to CleverTap.
  static Future<void> pushInboxNotificationViewedEventForId(
      String messageId) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'pushInboxNotificationViewedEventForId', {'messageId': messageId});
  }

  /// only iOS - If an application is launched from a push notification click, returns the CleverTap deep link included in the push notification
  static Future<String?> getInitialUrl() async {
    return await _dartToNativeMethodChannel.invokeMethod('getInitialUrl', {});
  }

  ///Display units
  ///Returns a List of Display units as a Map
  static Future<List?> getAllDisplayUnits() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('getAllDisplayUnits', {});
  }

  ///Returns Display unit info as a Map
  static Future<Map<String, dynamic>> getDisplayUnitForId(String unitId) async {
    Map<dynamic, dynamic> response = await _dartToNativeMethodChannel
        .invokeMethod('getDisplayUnitForId', {'unitId': unitId});
    return response.cast<String, dynamic>();
  }

  ///Raise Notification Viewed for Display Unit id passed
  static Future<void> pushDisplayUnitViewedEvent(String unitId) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('pushDisplayUnitViewedEvent', {'unitId': unitId});
  }

  ///Raise Notification Clicked for Display Unit id passed
  static Future<void> pushDisplayUnitClickedEvent(String unitId) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('pushDisplayUnitClickedEvent', {'unitId': unitId});
  }

  ///Feature Flags
  @Deprecated(
      "This method is deprecated since v1.3.0. Use getCleverTapID() instead")

  ///Returns boolean value of Feature Flag
  static Future<bool?> getFeatureFlag(String key, bool defaultValue) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'getFeatureFlag', {'key': key, 'defaultValue': defaultValue});
  }

  ///Product Config
  @Deprecated(
      "This method is deprecated since version 1.7.0 and will be removed in the future versions of this SDK.")

  ///Sets Default Values for Product Config using the passed Map
  static Future<void> setDefaultsMap(Map<String, dynamic> defaults) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('setDefaultsMap', {'defaults': defaults});
  }

  @Deprecated(
      "This method is deprecated since version 1.7.0 and will be removed in the future versions of this SDK.")

  ///Fetches the Product Configs from CleverTap
  static Future<void> fetch() async {
    return await _dartToNativeMethodChannel.invokeMethod('fetch', {});
  }

  @Deprecated(
      "This method is deprecated since version 1.7.0 and will be removed in the future versions of this SDK.")

  ///Fetches Product configs, adhering to the specified minimum fetch interval in seconds.
  static Future<void> fetchWithMinimumIntervalInSeconds(int interval) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'fetchWithMinimumFetchIntervalInSeconds', {'interval': interval});
  }

  @Deprecated(
      "This method is deprecated since version 1.7.0 and will be removed in the future versions of this SDK.")

  ///Activates the most recently fetched Product configs
  static Future<void> activate() async {
    return await _dartToNativeMethodChannel.invokeMethod('activate', {});
  }

  @Deprecated(
      "This method is deprecated since version 1.7.0 and will be removed in the future versions of this SDK.")

  ///Fetches and then activates the fetched Product configs.
  static Future<void> fetchAndActivate() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('fetchAndActivate', {});
  }

  @Deprecated(
      "This method is deprecated since version 1.7.0 and will be removed in the future versions of this SDK.")

  ///Sets the minimum interval between successive fetch calls.
  static Future<void> setMinimumFetchIntervalInSeconds(int interval) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'setMinimumFetchIntervalInSeconds', {'interval': interval});
  }

  @Deprecated(
      "This method is deprecated since version 1.7.0 and will be removed in the future versions of this SDK.")

  ///Returns the last fetched timestamp in millis.
  static Future<int?> getLastFetchTimeStampInMillis() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('getLastFetchTimeStampInMillis', {});
  }

  @Deprecated(
      "This method is deprecated since version 1.7.0 and will be removed in the future versions of this SDK.")

  ///Returns the parameter value for the given key as a String.
  static Future<String?> getProductConfigString(String key) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('getString', {'key': key});
  }

  @Deprecated(
      "This method is deprecated since version 1.7.0 and will be removed in the future versions of this SDK.")

  ///Returns the parameter value for the given key as a boolean.
  static Future<bool?> getProductConfigBoolean(String key) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('getBoolean', {'key': key});
  }

  @Deprecated(
      "This method is deprecated since version 1.7.0 and will be removed in the future versions of this SDK.")

  ///Returns the parameter value for the given key as a long (int for Dart).
  static Future<int?> getProductConfigLong(String key) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('getLong', {'key': key});
  }

  @Deprecated(
      "This method is deprecated since version 1.7.0 and will be removed in the future versions of this SDK.")

  ///Returns the parameter value for the given key as a double.
  static Future<double?> getProductConfigDouble(String key) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('getDouble', {'key': key});
  }

  @Deprecated(
      "This method is deprecated since version 1.7.0 and will be removed in the future versions of this SDK.")

  ///Deletes all activated, fetched and defaults configs as well as all Product Config settings.
  static Future<void> resetProductConfig() async {
    return await _dartToNativeMethodChannel.invokeMethod('reset', {});
  }

  static String getCleverTapDate(DateTime dateTime) {
    return '\$D_' + (dateTime.millisecondsSinceEpoch ~/ 1000).toString();
  }

  // Push Primer
  ///Creates a push primer asking user to enable push notification.
  static Future<void> promptPushPrimer(
      Map<String, dynamic> pushPrimerJSON) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'promptPushPrimer', pushPrimerJSON);
  }

  ///Directly calls OS hard dialog for requesting push permission.
  static Future<void> promptForPushNotification(bool fallbackToSettings) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'promptForPushNotification', fallbackToSettings);
  }

  ///Returns true if push permission is enabled.
  static Future<bool?> getPushNotificationPermissionStatus() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('getPushNotificationPermissionStatus', {});
  }

  ///Only for Android - Unregisters PushPermissionNotificationResponseListener
  static Future<void>
      unregisterPushPermissionNotificationResponseListener() async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'unregisterPushPermissionNotificationResponseListener', {});
  }

  // Product Experiences - Vars

  ///Uploads variables to the server. Requires Development/Debug build/configuration.
  static Future<void> syncVariables() async {
    return await _dartToNativeMethodChannel.invokeMethod('syncVariables', {});
  }

  ///Uploads variables to the server.
  /// * @param isProduction Provide `true` if variables must be sync in Production build/configuration.
  static Future<void> syncVariablesinProd(bool isProduction) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('syncVariablesinProd', {'isProduction': isProduction});
  }

  ///Forces variables to update from the server.
  static Future<bool?> fetchVariables() async {
    return await _dartToNativeMethodChannel.invokeMethod('fetchVariables', {});
  }

  ///Create variables.
  /// * @param {object} variables The JSON Object specifying the varibles to be created.
  static Future<void> defineVariables(Map<String, dynamic> variables) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('defineVariables', {'variables': variables});
  }

  ///Create File variable.
  /// * @param {object} variables The JSON Object specifying the varibles to be created.
  static Future<void> defineFileVariable(String fileVariable) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('defineFileVariable', {'fileVariable': fileVariable});
  }

  ///Get all variables via a JSON object.
  static Future<Map<Object?, Object?>> getVariables() async {
    return await _dartToNativeMethodChannel.invokeMethod('getVariables', {});
  }

  ///Get a variable or a group for the specified name.
  /// * @param {string} name - name.
  static Future<dynamic> getVariable(String name) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('getVariable', {'name': name});
  }

  static void onVariablesChanged(CleverTapOnVariablesChangedHandler handler) {
    if (!kIsWeb) {
      cleverTapOnVariablesChangedHandlers.add(handler);
      _dartToNativeMethodChannel.invokeMethod('onVariablesChanged', {});
    } else {
      CleverTapPluginWeb.onVariablesChanged(handler);
    }
  }

  static void onOneTimeVariablesChanged(CleverTapOnOneTimeVariablesChangedHandler handler) {
      cleverTapOnOneTimeVariablesChangedHandlers.add(handler);
      _dartToNativeMethodChannel.invokeMethod('onOneTimeVariablesChanged', {});
  }

  static void onValueChanged(
      String name, CleverTapOnValueChangedHandler handler) {
    if (!kIsWeb) {
      cleverTapOnValueChangedHandlers.add(handler);
      _dartToNativeMethodChannel.invokeMethod('onValueChanged', {'name': name});
    } else {
      CleverTapPluginWeb.onValueChanged(name, handler);
    }
  }

  static void onVariablesChangedAndNoDownloadsPending(CleverTapOnVariablesChangedAndNoDownloadsPendingHandler handler) {
      cleverTapOnVariablesChangedAndNoDownloadsPendingHandlers.add(handler);
      _dartToNativeMethodChannel.invokeMethod('onVariablesChangedAndNoDownloadsPending', {});
  }

  static void onceVariablesChangedAndNoDownloadsPending(CleverTapOnceVariablesChangedAndNoDownloadsPendingHandler handler) {
      cleverTapOnceVariablesChangedAndNoDownloadsPendingHandlers.add(handler);
      _dartToNativeMethodChannel.invokeMethod('onceVariablesChangedAndNoDownloadsPending', {});
  }

  static void onFileValueChanged(String name, CleverTapOnFileValueChangedHandler handler) {
      cleverTapOnFileValueChangedHandlers.add(handler);
      _dartToNativeMethodChannel.invokeMethod('onFileValueChanged', {'name': name});
  }

  ///Sets the user locale.
  static Future<void> setLocale(Locale locale) async {
    String localeString = locale.toString();
    return await _dartToNativeMethodChannel.invokeMethod(
        'setLocale', localeString);
  }

  ///Fetch Client Side In-Apps
  static Future<bool?> fetchInApps() async {
    return await _dartToNativeMethodChannel.invokeMethod('fetchInApps', {});
  }

  static Future<void> clearInAppResources(bool expiredOnly) async {
    return await _dartToNativeMethodChannel.invokeMethod(
        'clearInAppResources', expiredOnly);
  }


  /**
     * Uploads Custom in-app templates and app functions to the server.
     * Requires Development/Debug build/configuration.
     */
  
  static Future<void> syncCustomTemplates() async {
    return await _dartToNativeMethodChannel
        .invokeMethod('syncCustomTemplates', {});
  }

  static Future<void> syncCustomTemplatesInProd(bool isProduction) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('syncCustomTemplatesInProd', {'isProduction': isProduction});
  }

  static Future<void> customTemplateSetDismissed(String templateName) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('customTemplateSetDismissed', templateName);
  }

  static Future<void> customTemplateSetPresented(String templateName) async {
    return await _dartToNativeMethodChannel
        .invokeMethod('customTemplateSetPresented', templateName);
  }

  static Future<void> customTemplateRunAction(String templateName, String argName) async {
    return await _dartToNativeMethodChannel.invokeMethod('customTemplateRunAction',
        {'templateName': templateName, 'argName': argName});
  }

  static Future<String?> customTemplateGetStringArg(String templateName, String argName) async {
    return await _dartToNativeMethodChannel.invokeMethod('customTemplateGetStringArg',
        {'templateName': templateName, 'argName': argName});
  }

  static Future<num?> customTemplateGetNumberArg(String templateName, String argName) async {
    return await _dartToNativeMethodChannel.invokeMethod('customTemplateGetNumberArg',
        {'templateName': templateName, 'argName': argName});
  }

  static Future<bool?> customTemplateGetBooleanArg(String templateName, String argName) async {
    return await _dartToNativeMethodChannel.invokeMethod('customTemplateGetBooleanArg',
        {'templateName': templateName, 'argName': argName});
  }

  static Future<String?> customTemplateGetFileArg(String templateName, String argName) async {
    return await _dartToNativeMethodChannel.invokeMethod('customTemplateGetFileArg',
        {'templateName': templateName, 'argName': argName});
  }

  static Future<Object?> customTemplateGetObjectArg(String templateName, String argName) async {
    return await _dartToNativeMethodChannel.invokeMethod('customTemplateGetObjectArg',
        {'templateName': templateName, 'argName': argName});
  }

  static Future<String?> customTemplateContextToString(String templateName) async {
    return await _dartToNativeMethodChannel.invokeMethod('customTemplateContextToString',
        {'templateName': templateName});
  }
}
