import 'dart:async';

import 'package:flutter/services.dart';

typedef void CleverTapInAppNotificationDismissedHandler(
    Map<String, dynamic> mapList);
typedef void CleverTapInAppNotificationButtonClickedHandler(
    Map<String, String> mapList);
typedef void CleverTapProfileDidInitializeHandler();
typedef void CleverTapProfileSyncHandler(Map<String, dynamic> map);
typedef void CleverTapInboxDidInitializeHandler();
typedef void CleverTapInboxMessagesDidUpdateHandler();
typedef void CleverTapInboxNotificationButtonClickedHandler(
    Map<String, String> mapList);
typedef void CleverTapExperimentsDidUpdateHandler();
typedef void CleverTapDisplayUnitsLoadedHandler(List<dynamic> displayUnitList);
typedef void CleverTapFeatureFlagUpdatedHandler();
typedef void CleverTapProductConfigInitializedHandler();
typedef void CleverTapProductConfigFetchedHandler();
typedef void CleverTapProductConfigActivatedHandler();
typedef void CleverTapPushAmpPayloadReceivedHandler(Map<String, dynamic> map);
typedef void CleverTapPushClickedPayloadReceivedHandler(
    Map<String, dynamic> map);

class CleverTapPlugin {
  CleverTapInAppNotificationDismissedHandler
      cleverTapInAppNotificationDismissedHandler;
  CleverTapInAppNotificationButtonClickedHandler
      cleverTapInAppNotificationButtonClickedHandler;
  CleverTapProfileDidInitializeHandler cleverTapProfileDidInitializeHandler;
  CleverTapProfileSyncHandler cleverTapProfileSyncHandler;
  CleverTapInboxDidInitializeHandler cleverTapInboxDidInitializeHandler;
  CleverTapInboxMessagesDidUpdateHandler cleverTapInboxMessagesDidUpdateHandler;
  CleverTapInboxNotificationButtonClickedHandler
      cleverTapInboxNotificationButtonClickedHandler;
  CleverTapExperimentsDidUpdateHandler cleverTapExperimentsDidUpdateHandler;
  CleverTapDisplayUnitsLoadedHandler cleverTapDisplayUnitsLoadedHandler;
  CleverTapFeatureFlagUpdatedHandler cleverTapFeatureFlagUpdatedHandler;
  CleverTapProductConfigInitializedHandler
      cleverTapProductConfigInitializedHandler;
  CleverTapProductConfigFetchedHandler cleverTapProductConfigFetchedHandler;
  CleverTapProductConfigActivatedHandler cleverTapProductConfigActivatedHandler;
  CleverTapPushAmpPayloadReceivedHandler cleverTapPushAmpPayloadReceivedHandler;
  CleverTapPushClickedPayloadReceivedHandler
      cleverTapPushClickedPayloadReceivedHandler;

  static const MethodChannel _channel = const MethodChannel('clevertap_plugin');

  static final CleverTapPlugin _clevertapPlugin =
      new CleverTapPlugin._internal();

  factory CleverTapPlugin() => _clevertapPlugin;

  CleverTapPlugin._internal() {
    _channel.setMethodCallHandler(_platformCallHandler);
  }

  Future _platformCallHandler(MethodCall call) async {
    print("_platformCallHandler call ${call.method} ${call.arguments}");
    switch (call.method) {
      case "inAppNotificationDismissed":
        Map<dynamic, dynamic> args = call.arguments;
        cleverTapInAppNotificationDismissedHandler(
            args.cast<String, dynamic>());
        break;
      case "onInAppButtonClick":
        Map<String, String> args = call.arguments;
        cleverTapInAppNotificationButtonClickedHandler(args);
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
        Map<String, String> args = call.arguments;
        cleverTapInboxNotificationButtonClickedHandler(args);
        break;
      case "CTExperimentsUpdated":
        cleverTapExperimentsDidUpdateHandler();
        break;
      case "onDisplayUnitsLoaded":
        List<dynamic> args = call.arguments;
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
    }
  }

  /// Define a method to handle inApp notification dismissed
  void setCleverTapInAppNotificationDismissedHandler(
          CleverTapInAppNotificationDismissedHandler handler) =>
      cleverTapInAppNotificationDismissedHandler = handler;

  /// Define a method to handle inApp notification button clicked
  void setCleverTapInAppNotificationButtonClickedHandler(
          CleverTapInAppNotificationButtonClickedHandler handler) =>
      cleverTapInAppNotificationButtonClickedHandler = handler;

  /// Define a method to handle profile initialization
  void setCleverTapProfileDidInitializeHandler(
          CleverTapProfileDidInitializeHandler handler) =>
      cleverTapProfileDidInitializeHandler = handler;

  /// Define a method to handle profile sync
  void setCleverTapProfileSyncHandler(CleverTapProfileSyncHandler handler) =>
      cleverTapProfileSyncHandler = handler;

  /// Define a method to handle inbox initialization
  void setCleverTapInboxDidInitializeHandler(
          CleverTapInboxDidInitializeHandler handler) =>
      cleverTapInboxDidInitializeHandler = handler;

  /// Define a method to handle inbox update
  void setCleverTapInboxMessagesDidUpdateHandler(
          CleverTapInboxMessagesDidUpdateHandler handler) =>
      cleverTapInboxMessagesDidUpdateHandler = handler;

  /// Define a method to handle inbox notification button clicked
  void setCleverTapInboxNotificationButtonClickedHandler(
          CleverTapInboxNotificationButtonClickedHandler handler) =>
      cleverTapInboxNotificationButtonClickedHandler = handler;

  /// Define a method to handle dynamic variable experiments update
  void setCleverTapExperimentsDidUpdateHandler(
          CleverTapExperimentsDidUpdateHandler handler) =>
      cleverTapExperimentsDidUpdateHandler = handler;

  /// Define a method to handle Native Display Unit updates
  void setCleverTapDisplayUnitsLoadedHandler(
          CleverTapDisplayUnitsLoadedHandler handler) =>
      cleverTapDisplayUnitsLoadedHandler = handler;

  /// Define a method to handle Feature Flag updates
  void setCleverTapFeatureFlagUpdatedHandler(
          CleverTapFeatureFlagUpdatedHandler handler) =>
      cleverTapFeatureFlagUpdatedHandler = handler;

  /// Define a method to handle Product config initialization
  void setCleverTapProductConfigInitializedHandler(
          CleverTapProductConfigInitializedHandler handler) =>
      cleverTapProductConfigInitializedHandler = handler;

  /// Define a method to handle Product config fetch updates
  void setCleverTapProductConfigFetchedHandler(
          CleverTapProductConfigFetchedHandler handler) =>
      cleverTapProductConfigFetchedHandler = handler;

  /// Define a method to handle Product config activation updates
  void setCleverTapProductConfigActivatedHandler(
          CleverTapProductConfigActivatedHandler handler) =>
      cleverTapProductConfigActivatedHandler = handler;

  /// Define a method to handle Push Amplification payload
  void setCleverTapPushAmpPayloadReceivedHandler(
          CleverTapPushAmpPayloadReceivedHandler handler) =>
      cleverTapPushAmpPayloadReceivedHandler = handler;

  /// Define a method to handle Push Clicked payload
  void setCleverTapPushClickedPayloadReceivedHandler(
          CleverTapPushClickedPayloadReceivedHandler handler) =>
      cleverTapPushClickedPayloadReceivedHandler = handler;

  /// Sets debug level to show logs on Android Studio/Xcode console
  static Future<void> setDebugLevel(int value) async {
    return await _channel.invokeMethod('setDebugLevel', {'debugLevel': value});
  }

  /// Only for iOS - Registers the application to receive push notifications
  static Future<void> registerForPush() async {
    return await _channel.invokeMethod('registerForPush', {});
  }

  /// Set the FCM Token for Push Notifications
  static Future<void> setPushToken(String value) async {
    return await _channel.invokeMethod('setPushToken', {'token': value});
  }

  /// Set the Xiaomi Token for Push Notifications
  static Future<void> setXiaomiPushToken(String value) async {
    return await _channel.invokeMethod('setXiaomiPushToken', {'token': value});
  }

  /// Set the Baidu Token for Push Notifications
  static Future<void> setBaiduPushToken(String value) async {
    return await _channel.invokeMethod('setBaiduPushToken', {'token': value});
  }

  /// Set the Huawei Token for Push Notifications
  static Future<void> setHuaweiPushToken(String value) async {
    return await _channel.invokeMethod('setHuaweiPushToken', {'token': value});
  }

  // Set true to connect app to dashboard to see variables defined by app
  static Future<void> setUIEditorConnectionEnabled(bool value) async {
    return await _channel
        .invokeMethod('setUIEditorConnectionEnabled', {'value': value});
  }

  /// Method to create Notification Channel
  static Future<void> createNotificationChannel(
      String channelId,
      String channelName,
      String channelDescription,
      int importance,
      bool showBadge) async {
    return await _channel.invokeMethod('createNotificationChannel', {
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
    return await _channel.invokeMethod('createNotificationChannelWithSound', {
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
    return await _channel.invokeMethod('createNotificationChannelWithGroupId', {
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
    return await _channel.invokeMethod('createNotificationChannelWithGroupId', {
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
    return await _channel.invokeMethod('createNotificationChannelGroup',
        {'groupId': groupId, 'groupName': groupName});
  }

  /// Method to delete Notification Channel
  static Future<void> deleteNotificationChannel(String channelId) async {
    return await _channel
        .invokeMethod('deleteNotificationChannel', {'channelId': channelId});
  }

  /// Method to delete Notification Channel Group
  static Future<void> deleteNotificationChannelGroup(String groupId) async {
    return await _channel
        .invokeMethod('deleteNotificationChannelGroup', {'groupId': groupId});
  }

  /// Method to create Notification using CleverTap
  static Future<void> createNotification(dynamic data) async {
    print("inside createNotification Dart");
    return await _channel.invokeMethod('createNotification', {'extras': data});
  }

  /// Method to process Notification using CleverTap to avoid duplicates using Push Amplification
  static Future<void> processPushNotification(dynamic data) async {
    return await _channel
        .invokeMethod('processPushNotification', {'extras': data});
  }

  /// Method to allow user to Opt out of sending data to CleverTap as per GDPR rules
  static Future<void> setOptOut(bool value) async {
    return await _channel.invokeMethod('setOptOut', {'value': value});
  }

  /// Sets the CleverTap SDK to offline
  static Future<void> setOffline(bool value) async {
    return await _channel.invokeMethod('setOffline', {'value': value});
  }

  /// Enables Device & Networking Information Reporting to CleverTap
  static Future<void> enableDeviceNetworkInfoReporting(bool value) async {
    return await _channel
        .invokeMethod('enableDeviceNetworkInfoReporting', {'value': value});
  }

  /// Enables the Profile/Events Read and Synchronization API
  static Future<void> enablePersonalization() async {
    return await _channel.invokeMethod('enablePersonalization', {});
  }

  /// Disables the Profile/Events Read and Synchronization API
  static Future<void> disablePersonalization() async {
    return await _channel.invokeMethod('disablePersonalization', {});
  }

  /// Record a Screen View event
  static Future<void> recordScreenView(String screenName) async {
    return await _channel
        .invokeMethod('recordScreenView', {'screenName': screenName});
  }

  /// Pushes a basic event.
  static Future<void> recordEvent(
      String eventName, Map<String, dynamic> properties) async {
    return await _channel.invokeMethod(
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
    return await _channel.invokeMethod(
        'recordChargedEvent', {'chargeDetails': chargeDetails, 'items': items});
  }

  /// Returns the timestamp of the first time the given event was raised
  static Future<dynamic> eventGetFirstTime(String eventName) async {
    return await _channel
        .invokeMethod('eventGetFirstTime', {'eventName': eventName});
  }

  /// Returns the timestamp of the last time the given event was raised
  static Future<dynamic> eventGetLastTime(String eventName) async {
    return await _channel
        .invokeMethod('eventGetLastTime', {'eventName': eventName});
  }

  /// Returns the total count of the specified event
  static Future<int> eventGetOccurrences(String eventName) async {
    return await _channel
        .invokeMethod('eventGetOccurrences', {'eventName': eventName});
  }

  /// Returns a Map object for the particular event passed. EventDetail consists of event name, count, first time
  //  and last time timestamp of the event.
  static Future<Map<String, dynamic>> eventGetDetail(String eventName) async {
    Map<dynamic, dynamic> response =
        await _channel.invokeMethod('eventGetDetail', {'eventName': eventName});
    return response.cast<String, dynamic>();
  }

  /// Returns a Map of event names and corresponding event details of all the events raised
  static Future<Map<String, dynamic>> getEventHistory(String eventName) async {
    Map<dynamic, dynamic> response = await _channel
        .invokeMethod('getEventHistory', {'eventName': eventName});
    return response.cast<String, dynamic>();
  }

  /// Set the user profile location in CleverTap
  static Future<void> setLocation(double latitude, double longitude) async {
    return await _channel.invokeMethod(
        'setLocation', {'latitude': latitude, 'longitude': longitude});
  }

  /// Returns a unique CleverTap identifier suitable for use with install attribution providers.
  static Future<String> profileGetCleverTapAttributionIdentifier() async {
    return await _channel
        .invokeMethod('profileGetCleverTapAttributionIdentifier', {});
  }

  /// Returns a unique identifier by which CleverTap identifies this user.
  static Future<String> profileGetCleverTapID() async {
    return await _channel.invokeMethod('profileGetCleverTapID', {});
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
    return await _channel.invokeMethod('onUserLogin', {'profile': profile});
  }

  /// Push a profile update.
  static Future<void> profileSet(Map<String, dynamic> profile) async {
    return await _channel.invokeMethod('profileSet', {'profile': profile});
  }

  /// Pushes everything available in the JSON object returned by the Facebook GraphRequest
  /// Convert JSON to Map<String,dynamic> before passing it to this method.
  static Future<void> profileSetGraphUser(Map<String, dynamic> profile) async {
    return await _channel
        .invokeMethod('profileSetGraphUser', {'profile': profile});
  }

  ///Remove the user profile property value specified by key from the user profile
  static Future<void> profileRemoveValueForKey(String key) async {
    return await _channel
        .invokeMethod('profileRemoveValueForKey', {'key': key});
  }

  /// Set a collection of unique values as a multi-value user profile property, any existing value will be overwritten.
  /// Max 100 values, on reaching 100 cap, oldest value(s) will be removed.
  /// Values must be Strings and are limited to 512 characters.
  static Future<void> profileSetMultiValues(String key, List values) async {
    return await _channel
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
    return await _channel
        .invokeMethod('profileAddMultiValue', {'key': key, 'value': value});
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
    return await _channel
        .invokeMethod('profileAddMultiValues', {'key': key, 'values': values});
  }

  /// Remove a unique value from a multi-value user profile property
  /// <p/>
  /// If the key currently contains a scalar value, prior to performing the remove operation
  /// the key will be promoted to a multi-value property with the current value cast to a string.
  /// If the multi-value property is empty after the remove operation, the key will be removed.
  static Future<void> profileRemoveMultiValue(String key, String value) async {
    return await _channel
        .invokeMethod('profileRemoveMultiValue', {'key': key, 'value': value});
  }

  /// Remove a collection of unique values from a multi-value user profile property
  /// <p/>
  /// If the key currently contains a scalar value, prior to performing the remove operation
  /// the key will be promoted to a multi-value property with the current value cast to a string.
  /// If the multi-value property is empty after the remove operation, the key will be removed.
  static Future<void> profileRemoveMultiValues(String key, List values) async {
    return await _channel.invokeMethod(
        'profileRemoveMultiValues', {'key': key, 'values': values});
  }

  /// This method is used to push install referrer via UTM source, medium & campaign parameters
  static Future<void> pushInstallReferrer(
      String source, String medium, String campaign) async {
    return await _channel.invokeMethod('pushInstallReferrer',
        {'source': source, 'medium': medium, 'campaign': campaign});
  }

  /// Returns the time elapsed by the user on the app
  static Future<dynamic> sessionGetTimeElapsed() async {
    return await _channel.invokeMethod('sessionGetTimeElapsed', {});
  }

  /// Returns the total number of times the app has been launched
  static Future<int> sessionGetTotalVisits() async {
    return await _channel.invokeMethod('sessionGetTotalVisits', {});
  }

  /// Returns the number of screens which have been displayed by the app
  static Future<int> sessionGetScreenCount() async {
    return await _channel.invokeMethod('sessionGetScreenCount', {});
  }

  /// Returns the timestamp of the previous visit
  static Future<dynamic> sessionGetPreviousVisitTime() async {
    return await _channel.invokeMethod('sessionGetPreviousVisitTime', {});
  }

  /// Returns a Map of UTMDetail object which consists of UTM parameters like source, medium & campaign
  static Future<Map<String, dynamic>> sessionGetUTMDetails() async {
    Map<dynamic, dynamic> response =
        await _channel.invokeMethod('sessionGetUTMDetails', {});
    return response.cast<String, dynamic>();
  }

  /// Initializes the inbox controller and sends a callback
  static Future<void> initializeInbox() async {
    return await _channel.invokeMethod('initializeInbox', {});
  }

  /// Opens CTInboxActivity to display Inbox Messages
  static Future<void> showInbox(Map<String, dynamic> styleConfig) async {
    return await _channel
        .invokeMethod('showInbox', {'styleConfig': styleConfig});
  }

  /// Returns the count of all inbox messages for the user
  static Future<int> getInboxMessageCount() async {
    return await _channel.invokeMethod('getInboxMessageCount', {});
  }

  /// Returns the count of total number of unread inbox messages for the user
  static Future<int> getInboxMessageUnreadCount() async {
    return await _channel.invokeMethod('getInboxMessageUnreadCount', {});
  }

  /// Returns a list of json string representation of all CTInboxMessage

  static Future<List> getAllInboxMessages() async {
    return await _channel.invokeMethod('getAllInboxMessages', {});
  }

  /// Returns a list of json string representation of unread CTInboxMessage
  static Future<List> getUnreadInboxMessages() async {
    return await _channel.invokeMethod('getUnreadInboxMessages', {});
  }

  /// Returns a json string representation of CTInboxMessage for given messageId
  static Future<Map<String, dynamic>> getInboxMessageForId(
      String messageId) async {
    Map<dynamic, dynamic> response = await _channel
        .invokeMethod('getInboxMessageForId', {'messageId': messageId});
    return response.cast<String, dynamic>();
  }

  /// Deletes the CTInboxMessage object for given messageId
  static Future<void> deleteInboxMessageForId(String messageId) async {
    return await _channel
        .invokeMethod('deleteInboxMessageForId', {'messageId': messageId});
  }

  /// Marks the given messageId of CTInboxMessage object as read
  static Future<void> markReadInboxMessageForId(String messageId) async {
    return await _channel
        .invokeMethod('markReadInboxMessageForId', {'messageId': messageId});
  }

  /// Pushes the Notification Clicked event for App Inbox to CleverTap.
  static Future<void> pushInboxNotificationClickedEventForId(
      String messageId) async {
    return await _channel.invokeMethod(
        'pushInboxNotificationClickedEventForId', {'messageId': messageId});
  }

  /// Pushes the Notification Viewed event for App Inbox to CleverTap.
  static Future<void> pushInboxNotificationViewedEventForId(
      String messageId) async {
    return await _channel.invokeMethod(
        'pushInboxNotificationViewedEventForId', {'messageId': messageId});
  }

  /// only iOS - If an application is launched from a push notification click, returns the CleverTap deep link included in the push notification
  static Future<String> getInitialUrl() async {
    return await _channel.invokeMethod('getInitialUrl', {});
  }

  ///Dynamic Variables
  ///Registers Boolean Variable
  static Future<void> registerBooleanVariable(String name) async {
    return await _channel
        .invokeMethod('registerBooleanVariable', {'name': name});
  }

  ///Registers Double Variable
  static Future<void> registerDoubleVariable(String name) async {
    return await _channel
        .invokeMethod('registerDoubleVariable', {'name': name});
  }

  ///Registers Integer Variable
  static Future<void> registerIntegerVariable(String name) async {
    return await _channel
        .invokeMethod('registerIntegerVariable', {'name': name});
  }

  ///Registers String Variable
  static Future<void> registerStringVariable(String name) async {
    return await _channel
        .invokeMethod('registerStringVariable', {'name': name});
  }

  ///Registers List of Boolean Variable
  static Future<void> registerListOfBooleanVariable(String name) async {
    return await _channel
        .invokeMethod('registerListOfBooleanVariable', {'name': name});
  }

  ///Registers List of Double Variable
  static Future<void> registerListOfDoubleVariable(String name) async {
    return await _channel
        .invokeMethod('registerListOfDoubleVariable', {'name': name});
  }

  ///Registers List of Integer Variable
  static Future<void> registerListOfIntegerVariable(String name) async {
    return await _channel
        .invokeMethod('registerListOfIntegerVariable', {'name': name});
  }

  ///Registers List of String Variable
  static Future<void> registerListOfStringVariable(String name) async {
    return await _channel
        .invokeMethod('registerListOfStringVariable', {'name': name});
  }

  ///Registers Map of Boolean Variable
  static Future<void> registerMapOfBooleanVariable(String name) async {
    return await _channel
        .invokeMethod('registerMapOfBooleanVariable', {'name': name});
  }

  ///Registers Map of Double Variable
  static Future<void> registerMapOfDoubleVariable(String name) async {
    return await _channel
        .invokeMethod('registerMapOfDoubleVariable', {'name': name});
  }

  ///Registers Map of Integer Variable
  static Future<void> registerMapOfIntegerVariable(String name) async {
    return await _channel
        .invokeMethod('registerMapOfIntegerVariable', {'name': name});
  }

  ///Registers Map of String Variable
  static Future<void> registerMapOfStringVariable(String name) async {
    return await _channel
        .invokeMethod('registerMapOfStringVariable', {'name': name});
  }

  ///Returns Boolean Variable registered
  static Future<bool> getBooleanVariable(String name, bool defaultValue) async {
    return await _channel.invokeMethod(
        'getBooleanVariable', {'name': name, 'defaultValue': defaultValue});
  }

  ///Returns Double Variable registered
  static Future<double> getDoubleVariable(
      String name, double defaultValue) async {
    return await _channel.invokeMethod(
        'getDoubleVariable', {'name': name, 'defaultValue': defaultValue});
  }

  ///Returns Integer Variable registered
  static Future<int> getIntegerVariable(String name, int defaultValue) async {
    return await _channel.invokeMethod(
        'getIntegerVariable', {'name': name, 'defaultValue': defaultValue});
  }

  ///Returns String Variable registered
  static Future<String> getStringVariable(
      String name, String defaultValue) async {
    return await _channel.invokeMethod(
        'getStringVariable', {'name': name, 'defaultValue': defaultValue});
  }

  ///Returns List of Boolean Variable registered
  static Future<List> getListOfBooleanVariable(
      String name, List defaultValue) async {
    return await _channel.invokeMethod('getListOfBooleanVariable',
        {'name': name, 'defaultValue': defaultValue});
  }

  ///Returns List of Double Variable registered
  static Future<List> getListOfDoubleVariable(
      String name, List defaultValue) async {
    return await _channel.invokeMethod('getListOfDoubleVariable',
        {'name': name, 'defaultValue': defaultValue});
  }

  static Future<List> getListOfIntegerVariable(
      String name, List defaultValue) async {
    return await _channel.invokeMethod('getListOfIntegerVariable',
        {'name': name, 'defaultValue': defaultValue});
  }

  ///Returns List of String Variable registered
  static Future<List> getListOfStringVariable(
      String name, List defaultValue) async {
    return await _channel.invokeMethod('getListOfStringVariable',
        {'name': name, 'defaultValue': defaultValue});
  }

  ///Returns Map of Boolean Variable registered
  static Future<Map<String, bool>> getMapOfBooleanVariable(
      String name, Map<String, bool> defaultValue) async {
    Map<dynamic, dynamic> response = await _channel.invokeMethod(
        'getMapOfBooleanVariable',
        {'name': name, 'defaultValue': defaultValue});
    return response.cast<String, bool>();
  }

  ///Returns Map of Double Variable registered
  static Future<Map<String, double>> getMapOfDoubleVariable(
      String name, Map<String, double> defaultValue) async {
    Map<dynamic, dynamic> response = await _channel.invokeMethod(
        'getMapOfDoubleVariable', {'name': name, 'defaultValue': defaultValue});
    return response.cast<String, double>();
  }

  ///Returns Map of Integer Variable registered
  static Future<Map<String, int>> getMapOfIntegerVariable(
      String name, Map<String, int> defaultValue) async {
    Map<dynamic, dynamic> response = await _channel.invokeMethod(
        'getMapOfIntegerVariable',
        {'name': name, 'defaultValue': defaultValue});
    return response.cast<String, int>();
  }

  ///Returns Map of String Variable registered
  static Future<Map<String, String>> getMapOfStringVariable(
      String name, Map<String, String> defaultValue) async {
    Map<dynamic, dynamic> response = await _channel.invokeMethod(
        'getMapOfStringVariable', {'name': name, 'defaultValue': defaultValue});
    return response.cast<String, String>();
  }

  ///Display units
  ///Returns a List of Display units as a Map
  static Future<List> getAllDisplayUnits() async {
    return await _channel.invokeMethod('getAllDisplayUnits', {});
  }

  ///Returns Display unit info as a Map
  static Future<Map<String, dynamic>> getDisplayUnitForId(String unitId) async {
    Map<dynamic, dynamic> response =
        await _channel.invokeMethod('getDisplayUnitForId', {'unitId': unitId});
    return response.cast<String, dynamic>();
  }

  ///Raise Notification Viewed for Display Unit id passed
  static Future<void> pushDisplayUnitViewedEvent(String unitId) async {
    return await _channel
        .invokeMethod('pushDisplayUnitViewedEvent', {'unitId': unitId});
  }

  ///Raise Notification Clicked for Display Unit id passed
  static Future<void> pushDisplayUnitClickedEvent(String unitId) async {
    return await _channel
        .invokeMethod('pushDisplayUnitClickedEvent', {'unitId': unitId});
  }

  ///Feature Flags
  ///Returns boolean value of Feature Flag
  static Future<bool> getFeatureFlag(String key, bool defaultValue) async {
    return await _channel.invokeMethod(
        'getFeatureFlag', {'key': key, 'defaultValue': defaultValue});
  }

  ///Product Config
  ///Sets Default Values for Product Config using the passed Map
  static Future<void> setDefaultsMap(Map<String, dynamic> defaults) async {
    return await _channel
        .invokeMethod('setDefaultsMap', {'defaults': defaults});
  }

  ///Fetches the Product Configs from CleverTap
  static Future<void> fetch() async {
    return await _channel.invokeMethod('fetch', {});
  }

  ///Fetches Product configs, adhering to the specified minimum fetch interval in seconds.
  static Future<void> fetchWithMinimumIntervalInSeconds(int interval) async {
    return await _channel.invokeMethod(
        'fetchWithMinimumFetchIntervalInSeconds', {'interval': interval});
  }

  ///Activates the most recently fetched Product configs
  static Future<void> activate() async {
    return await _channel.invokeMethod('activate', {});
  }

  ///Fetches and then activates the fetched Product configs.
  static Future<void> fetchAndActivate() async {
    return await _channel.invokeMethod('fetchAndActivate', {});
  }

  ///Sets the minimum interval between successive fetch calls.
  static Future<void> setMinimumFetchIntervalInSeconds(int interval) async {
    return await _channel.invokeMethod(
        'setMinimumFetchIntervalInSeconds', {'interval': interval});
  }

  ///Returns the last fetched timestamp in millis.
  static Future<int> getLastFetchTimeStampInMillis() async {
    return await _channel.invokeMethod('getLastFetchTimeStampInMillis', {});
  }

  ///Returns the parameter value for the given key as a String.
  static Future<String> getProductConfigString(String key) async {
    return await _channel.invokeMethod('getString', {'key': key});
  }

  ///Returns the parameter value for the given key as a boolean.
  static Future<bool> getProductConfigBoolean(String key) async {
    return await _channel.invokeMethod('getBoolean', {'key': key});
  }

  ///Returns the parameter value for the given key as a long (int for Dart).
  static Future<int> getProductConfigLong(String key) async {
    return await _channel.invokeMethod('getLong', {'key': key});
  }

  ///Returns the parameter value for the given key as a double.
  static Future<double> getProductConfigDouble(String key) async {
    return await _channel.invokeMethod('getDouble', {'key': key});
  }

  ///Deletes all activated, fetched and defaults configs as well as all Product Config settings.
  static Future<void> resetProductConfig() async {
    return await _channel.invokeMethod('reset', {});
  }
}
