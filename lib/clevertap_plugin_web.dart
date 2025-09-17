import 'dart:async';
import 'dart:js_interop';
import 'dart:js_interop_unsafe';

import 'package:clevertap_plugin/src/clevertap_plugin_web_binding.dart';
import 'package:clevertap_plugin/src/typedefs.dart';
import 'package:flutter/services.dart';
import 'package:flutter_web_plugins/flutter_web_plugins.dart';
import 'clevertap_plugin.dart' as MainPlugin;

/// A web implementation of the CleverTapPlugin plugin.
class CleverTapPluginWeb {
  static void registerWith(Registrar registrar) {
    final MethodChannel _dartToNativeMethodChannel = MethodChannel(
      'clevertap_plugin/dart_to_native',
      const StandardMethodCodec(),
      registrar,
    );

    final pluginInstance = CleverTapPluginWeb();
    _dartToNativeMethodChannel
        .setMethodCallHandler(pluginInstance._handleMethodCall);

    setLibrary(MainPlugin.CleverTapPlugin.libName,
        MainPlugin.CleverTapPlugin.libVersion);
  }

  /// Handles method calls over the MethodChannel of this plugin.
  /// Note: Check the "federated" architecture for a new way of doing this:
  /// https://flutter.dev/go/federated-plugins
  Future<dynamic> _handleMethodCall(MethodCall call) async {
    switch (call.method) {
      case 'init':
        return _init(call);
      case 'setLibrary':
        return _setLibrary(call);
      case 'toggleInbox':
        return _toggleInbox(call);
      case 'recordEvent':
        return _recordEvent(call);
      case 'recordChargedEvent':
        return _recordChargedEvent(call);
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
      case 'defineVariables':
        return _defineVariables(call);
      case 'defineFileVariable':
        return _defineFileVariable(call);
      case 'syncVariables':
        return _syncVariables(call);
      case 'fetchVariables':
        return _fetchVariables(call);
      case 'getVariables':
        return _getVariables(call);
      case 'getVariable':
        return _getVariable(call);
      case 'getSDKVersion':
        return _getSDKVersion(call);
      case 'enableLocalStorageEncryption':
        return _enableLocalStorageEncryption(call);
      case 'isLocalStorageEncryptionEnabled':
        return _isLocalStorageEncryptionEnabled(call);
      case 'getAllQualifiedCampaignDetails':
        return _getAllQualifiedCampaignDetails(call);
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
    String? token = args['token'] as String?;
    print("actual call going to happen");
    init(accountId, region, targetDomain, token);
  }

  void _setLibrary(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    int libVersion = args['libVersion'] as int;
    setLibrary("Flutter", libVersion);
  }

  void _toggleInbox(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    final jsObj = _jsify({'rect': args['rect']});
    if (jsObj != null) {
      toggleInbox(jsObj);
    }
  }

  /// Pushes a basic event
  void _recordEvent(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String eventName = args['eventName'] as String;
    Object? eventData = args['eventData'];
    final jsEventData = _jsify(eventData ?? {});
    event_push(eventName, jsEventData);
  }

  /// Pushed a Charged event
  void _recordChargedEvent(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    Map chargeDetails = args['chargeDetails'] as Map;
    chargeDetails["Items"] = args['items'] as List;
    final jsChargeDetails = _jsify(chargeDetails);
    if (jsChargeDetails != null) {
      event_push("Charged", jsChargeDetails);
    }
  }

  /// OnUserLogin request
  void _onUserLogin(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    final jsProfile = _jsify({"Site": args['profile']});
    if (jsProfile != null) {
      onUserLogin_push(jsProfile);
    }
  }

  /// enable web push
  void _enableWebPush(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    final jsArgs = _jsify(args);
    if (jsArgs != null) {
      notifications_push(jsArgs);
    }
  }

  /// Profile push request
  void _profileSet(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    final jsProfile = _jsify({"Site": args['profile']});
    if (jsProfile != null) {
      onUserLogin_push(jsProfile);
    }
  }

  /// Set Optout flag
  void _setOptOut(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    bool value = args['value'] as bool;
    final jsPrivacy = _jsify({"optOut": value});
    if (jsPrivacy != null) {
      privacy_push(jsPrivacy);
    }
  }

  /// Set useIP flag
  void _setUseIP(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    bool value = args['value'] as bool;
    final jsPrivacy = _jsify({"useIP": value});
    if (jsPrivacy != null) {
      privacy_push(jsPrivacy);
    }
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
    setMultiValuesForKeyWrapper(key, value);
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
    addMultiValuesForKeyWrapper(key, value);
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
    removeMultiValuesForKeyWrapper(key, value);
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
    handleIncrementValueWrapper(key, value);
  }

  /// Decrement given num value. The value should be in positive range
  void _profileDecrementValue(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String key = args['key'] as String;
    num value = args['value'] as num;
    handleDecrementValueWrapper(key, value);
  }

  /// Set the user profile location in CleverTap
  void _setLocation(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    double latitude = args['latitude'] as double;
    double longitude = args['longitude'] as double;
    getLocationWrapper(latitude, longitude);
  }

  /// Method for notification viewed
  void _renderNotificationViewed(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String msgId = args['msgId'] as String;
    String pivotId = args['pivotId'] as String;
    final jsNotification = _jsify({"msgId": msgId, "pivotId": pivotId});
    if (jsNotification != null) {
      renderNotificationViewed(jsNotification);
    }
  }

  /// Method for notification clicked
  void _renderNotificationClicked(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String msgId = args['msgId'] as String;
    String pivotId = args['pivotId'] as String;
    final jsNotification = _jsify({"msgId": msgId, "pivotId": pivotId});
    if (jsNotification != null) {
      renderNotificationClicked(jsNotification);
    }
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
    return List.from((_dartify(getAllInboxMessages()) as Map).values);
  }

  /// Get All Inbox Unread Messages
  List _getUnreadInboxMessages(MethodCall call) {
    return List.from((_dartify(getUnreadInboxMessages()) as Map).values);
  }

  /// Get Inbox Message for the given message-id
  Object _getInboxMessageForId(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String messageId = args['messageId'] as String;
    return (_dartify(getInboxMessageForId(messageId)) as Map);
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
    markReadInboxMessagesForIdsWrapper(messageIds);
  }

  void _defineVariables(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    Object variables = args['variables'] as Object;
    final jsVariables = _jsify(variables);
    if (jsVariables != null) {
      defineVariables(jsVariables);
    }
  }

  void _defineFileVariable(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String fileVariable = args['fileVariable'] as String;
    defineFileVariable(fileVariable);
  }

  /// Sync Variables
  void _syncVariables(MethodCall call) {
    syncVariables();
  }

  /// Fetch Variables
  Future<bool> _fetchVariables(MethodCall call) async {
    var completer = Completer<bool>();
    fetchVariables((() => completer.complete(true)).toJS);
    return completer.future;
  }

  static void onValueChanged(
      String name, CleverTapOnValueChangedHandler handler) {
    onValueChangedImpl(
        name,
        ((JSAny object) {
          var dartObject = _dartify(object);
          var convertedMap = (dartObject as Map)
              .map((key, value) => MapEntry(key.toString(), value as dynamic));
          handler(convertedMap.cast<String, dynamic>());
        }).toJS);
  }

  static void onVariablesChanged(CleverTapOnVariablesChangedHandler handler) {
    onVariablesChangedImpl(((JSAny object) {
      var dartObject = _dartify(object);
      var convertedMap = (dartObject as Map)
          .map((key, value) => MapEntry(key.toString(), value as dynamic));
      handler(convertedMap.cast<String, dynamic>());
    }).toJS);
  }

  Future<Map<Object?, Object?>> _getVariables(MethodCall call) async {
    var completer = Completer<Map<Object?, Object?>>();
    getVariables(((JSAny object) =>
        completer.complete(_dartify(object) as Map<Object?, Object?>)).toJS);
    return completer.future;
  }

  Future<dynamic> _getVariable(MethodCall call) async {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String name = args['name'] as String;
    var completer = Completer<dynamic>();
    getVariable(
        name, ((JSAny object) => completer.complete(_dartify(object))).toJS);
    return completer.future;
  }

  static void addKVDataChangeListener(
      CleverTapOnKVDataChangedHandler handler) async {
    addDocumentEventListenerImpl(
        'CT_web_native_display',
        ((JSAny jsEvent) {
          try {
            // Extract the detail property from the event
            final jsObject = jsEvent as JSObject;
            final eventDetail = jsObject.getProperty('detail'.toJS);
            if (eventDetail != null) {
              var object_ = _dartify(eventDetail) as Map<Object?, Object?>;
              Map<String, Object?> data = Map.fromEntries(object_.entries
                  .map((entry) => MapEntry(entry.key.toString(), entry.value)));
              handler(data);
            } else {
              print('No detail in CleverTap event');
            }
          } catch (e) {
            print('Error processing CleverTap KV data: $e');
          }
        }).toJS);
  }

  /// Get Web SDK version
  String? _getSDKVersion(MethodCall call) {
    return getSDKVersion();
  }

  /// Enable/Disable local storage encryption
  void _enableLocalStorageEncryption(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    bool value = args['value'] as bool;
    enableLocalStorageEncryption(value);
  }

  /// Check if the local storage encryption is enabled
  bool? _isLocalStorageEncryptionEnabled(MethodCall call) {
    return isLocalStorageEncryptionEnabled();
  }

  /// Get All Qualified campaigns
  List _getAllQualifiedCampaignDetails(MethodCall call) {
    final jsArray = getAllQualifiedCampaignDetails();
    return _dartify(jsArray) as List;
  }

  // Helper methods for conversion between Dart and JS
  static JSAny? _jsify(Object? object) {
    if (object == null) return null;

    if (object is String) return object.toJS;
    if (object is num) return object.toJS;
    if (object is bool) return object.toJS;

    if (object is List) {
      return object.map((item) => _jsify(item)).toList().toJS;
    }

    if (object is Map) {
      final jsObject = JSObject();
      for (final entry in object.entries) {
        final jsValue = _jsify(entry.value);
        if (jsValue != null) {
          jsObject.setProperty(entry.key.toString().toJS, jsValue);
        }
      }
      return jsObject;
    }

    // Fallback for other types
    return object.toString().toJS;
  }

  static Object? _dartify(JSAny? jsObject) {
    if (jsObject == null) return null;

    // Check for null and undefined
    try {
      if (jsObject.isNull || jsObject.isUndefined) return null;
    } catch (e) {
      // If checking for null/undefined fails, treat as null
      return null;
    }

    // Check for primitive types
    if (jsObject.typeofEquals('string')) {
      return (jsObject as JSString).toDart;
    }
    if (jsObject.typeofEquals('number')) {
      return (jsObject as JSNumber).toDartDouble;
    }
    if (jsObject.typeofEquals('boolean')) {
      return (jsObject as JSBoolean).toDart;
    }

    // Check for Array
    try {
      if (jsObject.instanceof(globalContext['Array']! as JSFunction)) {
        final jsArray = jsObject as JSObject;
        final lengthProperty = jsArray.getProperty('length'.toJS) as JSNumber;
        final length = lengthProperty.toDartInt;
        final list = <Object?>[];
        for (int i = 0; i < length; i++) {
          final element = jsArray.getProperty(i.toJS);
          list.add(_dartify(element));
        }
        return list;
      }
    } catch (e) {
      // If array check fails, continue to object check
    }

    // Check for Object
    if (jsObject.typeofEquals('object')) {
      try {
        final jsObj = jsObject as JSObject;
        final map = <String, Object?>{};

        // Get all enumerable property names
        final objectConstructor = globalContext['Object'] as JSObject;
        final keysMethod =
            objectConstructor.getProperty('keys'.toJS) as JSFunction;
        final keys =
            keysMethod.callAsFunction(objectConstructor, jsObj) as JSObject;
        final keysLengthProperty = keys.getProperty('length'.toJS) as JSNumber;
        final keysLength = keysLengthProperty.toDartInt;

        for (int i = 0; i < keysLength; i++) {
          final keyProperty = keys.getProperty(i.toJS) as JSString;
          final key = keyProperty.toDart;
          final value = jsObj.getProperty(key.toJS);
          map[key] = _dartify(value);
        }
        return map;
      } catch (e) {
        // If object processing fails, return null
        return null;
      }
    }

    // Fallback - try to convert to string
    try {
      return jsObject.toString();
    } catch (e) {
      return null;
    }
  }
}
