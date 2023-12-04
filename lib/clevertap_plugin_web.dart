import 'dart:async';

import 'package:clevertap_plugin/src/clevertap_plugin_web_binding.dart';
import 'package:flutter/services.dart';
import 'package:flutter_web_plugins/flutter_web_plugins.dart';
import 'package:js/js_util.dart' as js;

/// A web implementation of the CleverTapPlugin plugin.
class CleverTapPlugin {
  static void registerWith(Registrar registrar) {
    final MethodChannel channel = MethodChannel(
      'clevertap_plugin/dart_to_native',
      const StandardMethodCodec(),
      registrar,
    );

    final pluginInstance = CleverTapPlugin();
    channel.setMethodCallHandler(pluginInstance.handleMethodCall);
  }

  /// Handles method calls over the MethodChannel of this plugin.
  /// Note: Check the "federated" architecture for a new way of doing this:
  /// https://flutter.dev/go/federated-plugins
  Future<dynamic> handleMethodCall(MethodCall call) async {
    switch (call.method) {
      case 'init':
        return _init(call);
      case 'setLibrary':
        return _setLibrary(call);
      case 'toggleInbox':
        return _toggleInbox(call);
      case 'recordEvent':
        return _recordEvent(call);
      case 'onUserLogin':
        return _onUserLogin(call);
      case 'profileSet':
        return _profileSet(call);
      case 'enableWebPush':
        return _enableWebPush(call);
      case 'setOptOut':
        return _setOptOut(call);
      case 'setUseIP':
        return _setUseIP(call);
      case 'setDebugLevel':
        return _setDebugLevel(call);
      case 'getCleverTapID':
        return _getCleverTapID(call);
      case 'getAccountID':
        return _getAccountID(call);
      case 'setOffline':
        return _setOffline(call);
      case 'profileSetMultiValues':
        return _profileSetMultiValues(call);
      case 'profileAddMultiValue':
        return _profileAddMultiValue(call);
      case 'profileAddMultiValues':
        return _profileAddMultiValues(call);
      case 'profileRemoveMultiValue':
        return _profileRemoveMultiValue(call);
      case 'profileRemoveMultiValues':
        return _profileRemoveMultiValues(call);
      case 'profileRemoveValueForKey':
        return _profileRemoveValueForKey(call);
      case 'profileIncrementValue':
        return _profileIncrementValue(call);
      case 'profileDecrementValue':
        return _profileDecrementValue(call);
      case 'setLocation':
        return _setLocation(call);
      case 'renderNotificationViewed':
        return _renderNotificationViewed(call);
      case 'renderNotificationClicked':
        return _renderNotificationClicked(call);
      case 'getInboxMessageCount':
        return _getInboxMessageCount(call);
      case 'getInboxMessageUnreadCount':
        return _getInboxMessageUnreadCount(call);
      case 'getAllInboxMessages':
        return _getAllInboxMessages(call);
      case 'getUnreadInboxMessages':
        return _getUnreadInboxMessages(call);
      case 'getInboxMessageForId':
        return _getInboxMessageForId(call);
      case 'deleteInboxMessageForId':
        return _deleteInboxMessageForId(call);
      case 'markReadInboxMessageForId':
        return _markReadInboxMessageForId(call);
      case 'markReadAllInboxMessage':
        return _markReadAllInboxMessage(call);
      case 'markReadInboxMessagesForIds':
        return _markReadInboxMessagesForIds(call);
      default:
        throw PlatformException(
          code: 'Unimplemented',
          details:
              'clevertap_plugin for web doesn\'t implement \'${call.method}\'',
        );
    }
  }

  void _init(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String accountId = args['accountId'] as String;
    String? region = args['region'] as String?;
    String? targetDomain = args['targetDomain'] as String?;
    print("actual call going to happen");
    init(accountId, region, targetDomain);
  }

  void _setLibrary(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    int libVersion = args['libVersion'] as int;
    setLibrary("Flutter", libVersion);
  }

  void _toggleInbox(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    toggleInbox(js.jsify({'rect': args['rect']}));
  }

  /// Pushes a basic event
  void _recordEvent(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String eventName = args['eventName'] as String;
    Object? eventData = args['eventData'];
    event_push(eventName, eventData);
  }

  /// OnUserLogin request
  void _onUserLogin(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    onUserLogin_push(js.jsify({"Site": args['profile']}));
  }

  /// enable web push
  void _enableWebPush(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    print(args);
    notifications_push(js.jsify(args));
  }

  /// Profile push request
  void _profileSet(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    onUserLogin_push(js.jsify({"Site": args['profile']}));
  }

  /// Set Optout flag
  void _setOptOut(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    bool value = args['value'] as bool;
    privacy_push(js.jsify({"optOut": value}));
  }

  /// Set useIP flag
  void _setUseIP(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    bool value = args['value'] as bool;
    privacy_push(js.jsify({"useIP": value}));
  }

  /// Set Log Level
  void _setDebugLevel(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    int value = args['debugLevel'] as int;
    setLogLevel(value);
  }

  /// Get ClevertapId
  String? _getCleverTapID(MethodCall call) {
    return getCleverTapID();
  }

  /// Get AccountId
  String? _getAccountID(MethodCall call) {
    return getAccountID();
  }

  /// Sets the CleverTap SDK to offline
  void _setOffline(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    bool value = args['value'] as bool;
    setOffline(value);
  }

  /// Set a multi-value property
  void _profileSetMultiValues(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String key = args['key'] as String;
    List value = args['values'] as List;
    setMultiValuesForKey(key, value);
  }

  /// Add a unique value to a multi-value user profile property
  void _profileAddMultiValue(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String key = args['key'] as String;
    String value = args['value'] as String;
    addMultiValueForKey(key, value);
  }

  /// Add a collection of unique values to a multi-value user profile property
  void _profileAddMultiValues(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String key = args['key'] as String;
    List value = args['values'] as List;
    addMultiValuesForKey(key, value);
  }

  /// Remove a unique value from a multi-value user profile property
  void _profileRemoveMultiValue(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String key = args['key'] as String;
    String value = args['value'] as String;
    removeMultiValueForKey(key, value);
  }

  /// Remove a collection of unique values from a multi-value user profile property
  void _profileRemoveMultiValues(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String key = args['key'] as String;
    List value = args['values'] as List;
    removeMultiValuesForKey(key, value);
  }

  /// Remove the user profile property value specified by key from the user profile
  void _profileRemoveValueForKey(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String key = args['key'] as String;
    removeValueForKey(key);
  }

  /// Increment given num value. The value should be in positive range
  void _profileIncrementValue(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String key = args['key'] as String;
    num value = args['value'] as num;
    handleIncrementValue(key, value);
  }

  /// Decrement given num value. The value should be in positive range
  void _profileDecrementValue(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String key = args['key'] as String;
    num value = args['value'] as num;
    handleDecrementValue(key, value);
  }

  /// Set the user profile location in CleverTap
  void _setLocation(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    double latitude = args['latitude'] as double;
    double longitude = args['longitude'] as double;
    getLocation(latitude, longitude);
  }

  /// Method for notification viewed
  void _renderNotificationViewed(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String msgId = args['msgId'] as String;
    String pivotId = args['pivotId'] as String;
    renderNotificationViewed(js.jsify({"msgId": msgId, "pivotId": pivotId}));
  }

  /// Method for notification clicked
  void _renderNotificationClicked(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String msgId = args['msgId'] as String;
    String pivotId = args['pivotId'] as String;
    renderNotificationClicked(js.jsify({"msgId": msgId, "pivotId": pivotId}));
  }

  /// Get total inbox message count
  int _getInboxMessageCount(MethodCall call) {
    return getInboxMessageCount();
  }

  /// Get Total Inbox Unread Count
  int _getInboxMessageUnreadCount(MethodCall call) {
    return getInboxMessageUnreadCount();
  }

  /// Get All Inbox Messages
  List _getAllInboxMessages(MethodCall call) {
    return List.from((js.dartify(getAllInboxMessages()) as Map).values);
  }

  /// Get All Inbox Unread Messages
  List _getUnreadInboxMessages(MethodCall call) {
    return List.from((js.dartify(getUnreadInboxMessages()) as Map).values);
  }

  /// Get Inbox Message for the given message-id
  Object _getInboxMessageForId(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String messageId = args['messageId'] as String;
    return (js.dartify(getInboxMessageForId(messageId)) as Map);
  }

  /// Delete Message for the given message-id
  void _deleteInboxMessageForId(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String messageId = args['messageId'] as String;
    deleteInboxMessage(messageId);
  }

  /// Mark Message as Read for the given message-id
  void _markReadInboxMessageForId(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String messageId = args['messageId'] as String;
    markReadInboxMessage(messageId);
  }

  /// Mark all inbox Message as Read
  void _markReadAllInboxMessage(MethodCall call) {
    markReadAllInboxMessage();
  }

  void _markReadInboxMessagesForIds(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    List messageIds = args['messageIds'] as List;
    markReadInboxMessagesForIds(messageIds);
  }
}
