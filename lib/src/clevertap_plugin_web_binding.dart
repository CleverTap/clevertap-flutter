import 'dart:js_interop';
import 'dart:js_interop_unsafe';

/// Resolves the JS CleverTap instance for the given accountId.
/// Returns window.clevertap for default (null), or window.clevertap_{safeId} for additional.
JSObject getInstanceRef(String? accountId) {
  if (accountId == null) {
    return globalContext.getProperty('clevertap'.toJS) as JSObject;
  }
  final safeId = accountId.replaceAll(RegExp(r'[^a-zA-Z0-9_]'), '_');
  return globalContext.getProperty('clevertap_$safeId'.toJS) as JSObject;
}

/// Creates a new CleverTap instance via clevertap.CleverTap.createInstance().
JSObject? createInstance(
    String accountId, String? region, String? targetDomain, String? token) {
  final ct = globalContext.getProperty('clevertap'.toJS) as JSObject;
  final cleverTapClass = ct.getProperty('CleverTap'.toJS) as JSObject;
  final config = JSObject();
  config.setProperty('accountId'.toJS, accountId.toJS);
  if (region != null) config.setProperty('region'.toJS, region.toJS);
  if (targetDomain != null) {
    config.setProperty('targetDomain'.toJS, targetDomain.toJS);
  }
  if (token != null) config.setProperty('token'.toJS, token.toJS);
  final result = cleverTapClass.callMethod('createInstance'.toJS, config);
  if (result == null || result.isUndefinedOrNull) return null;
  return result as JSObject;
}

// --- Initialization & Library ---

void init(String? accountId, String initAccountId, String? region,
    String? targetDomain, String? token,
    [JSAny? options]) {
  final instance = getInstanceRef(accountId);
  final args = <JSAny?>[initAccountId.toJS];
  if (region != null) args.add(region.toJS);
  if (targetDomain != null) args.add(targetDomain.toJS);
  if (token != null) args.add(token.toJS);
  if (options != null) args.add(options);
  instance.callMethodVarArgs('init'.toJS, args);
}

void setLibrary(String? accountId, String libName, int libVersion) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('setLibrary'.toJS, libName.toJS, libVersion.toJS);
}

// --- Event Tracking ---

void event_push(String? accountId, String event, JSAny? object) {
  final instance = getInstanceRef(accountId);
  final handler = instance.getProperty('event'.toJS) as JSObject;
  if (object != null) {
    handler.callMethod('push'.toJS, event.toJS, object);
  } else {
    handler.callMethod('push'.toJS, event.toJS);
  }
}

// --- User Login & Profile ---

void onUserLogin_push(String? accountId, JSAny object) {
  final instance = getInstanceRef(accountId);
  final handler = instance.getProperty('onUserLogin'.toJS) as JSObject;
  handler.callMethod('push'.toJS, object);
}

void profile_push(String? accountId, JSAny object) {
  final instance = getInstanceRef(accountId);
  final handler = instance.getProperty('profile'.toJS) as JSObject;
  handler.callMethod('push'.toJS, object);
}

// --- Notifications ---

void notifications_push(String? accountId, JSAny object) {
  final instance = getInstanceRef(accountId);
  final handler = instance.getProperty('notifications'.toJS) as JSObject;
  handler.callMethod('push'.toJS, object);
}

void notifications_enable(String? accountId, JSAny object) {
  final instance = getInstanceRef(accountId);
  final handler = instance.getProperty('notifications'.toJS) as JSObject;
  handler.callMethod('enable'.toJS, object);
}

// --- Privacy ---

void privacy_push(String? accountId, JSAny object) {
  final instance = getInstanceRef(accountId);
  final handler = instance.getProperty('privacy'.toJS) as JSObject;
  handler.callMethod('push'.toJS, object);
}

// --- Settings ---

void setLogLevel(String? accountId, int value) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('setLogLevel'.toJS, value.toJS);
}

void setOffline(String? accountId, bool value) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('setOffline'.toJS, value.toJS);
}

// --- Identity ---

String? getCleverTapID(String? accountId) {
  final instance = getInstanceRef(accountId);
  final result = instance.callMethod('getCleverTapID'.toJS);
  if (result == null || result.isUndefinedOrNull) return null;
  return (result as JSString).toDart;
}

String? getAccountID(String? accountId) {
  final instance = getInstanceRef(accountId);
  final result = instance.callMethod('getAccountID'.toJS);
  if (result == null || result.isUndefinedOrNull) return null;
  return (result as JSString).toDart;
}

// --- Profile Multi-Value ---

void setMultiValuesForKey(
    String? accountId, String key, JSArray<JSString>? values) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('setMultiValuesForKey'.toJS, key.toJS, values);
}

void addMultiValueForKey(String? accountId, String key, String value) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('addMultiValueForKey'.toJS, key.toJS, value.toJS);
}

void addMultiValuesForKey(
    String? accountId, String key, JSArray<JSString>? values) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('addMultiValuesForKey'.toJS, key.toJS, values);
}

void removeMultiValueForKey(String? accountId, String key, String value) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('removeMultiValueForKey'.toJS, key.toJS, value.toJS);
}

void removeMultiValuesForKey(
    String? accountId, String key, JSArray<JSString>? values) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('removeMultiValuesForKey'.toJS, key.toJS, values);
}

void removeValueForKey(String? accountId, String key) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('removeValueForKey'.toJS, key.toJS);
}

void handleIncrementValue(String? accountId, String key, JSNumber value) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('handleIncrementValue'.toJS, key.toJS, value);
}

void handleDecrementValue(String? accountId, String key, JSNumber value) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('handleDecrementValue'.toJS, key.toJS, value);
}

// --- Location ---

void getLocation(String? accountId, JSNumber latitude, JSNumber longitude) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('getLocation'.toJS, latitude, longitude);
}

// --- Notification Rendering ---

void renderNotificationViewed(String? accountId, JSAny object) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('renderNotificationViewed'.toJS, object);
}

void renderNotificationClicked(String? accountId, JSAny object) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('renderNotificationClicked'.toJS, object);
}

// --- Inbox ---

void toggleInbox(String? accountId, JSAny object) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('toggleInbox'.toJS, object);
}

int getInboxMessageCount(String? accountId) {
  final instance = getInstanceRef(accountId);
  final result = instance.callMethod('getInboxMessageCount'.toJS);
  if (result == null || result.isUndefinedOrNull) return 0;
  return (result as JSNumber).toDartInt;
}

int getInboxMessageUnreadCount(String? accountId) {
  final instance = getInstanceRef(accountId);
  final result = instance.callMethod('getInboxMessageUnreadCount'.toJS);
  if (result == null || result.isUndefinedOrNull) return 0;
  return (result as JSNumber).toDartInt;
}

JSObject getAllInboxMessages(String? accountId) {
  final instance = getInstanceRef(accountId);
  final result = instance.callMethod('getAllInboxMessages'.toJS);
  if (result == null || result.isUndefinedOrNull) return JSObject();
  return result as JSObject;
}

JSObject getUnreadInboxMessages(String? accountId) {
  final instance = getInstanceRef(accountId);
  final result = instance.callMethod('getUnreadInboxMessages'.toJS);
  if (result == null || result.isUndefinedOrNull) return JSObject();
  return result as JSObject;
}

JSAny getInboxMessageForId(String? accountId, String messageId) {
  final instance = getInstanceRef(accountId);
  final result =
      instance.callMethod('getInboxMessageForId'.toJS, messageId.toJS);
  if (result == null || result.isUndefinedOrNull) return JSObject();
  return result;
}

void deleteInboxMessage(String? accountId, String messageId) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('deleteInboxMessage'.toJS, messageId.toJS);
}

void markReadInboxMessage(String? accountId, String messageId) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('markReadInboxMessage'.toJS, messageId.toJS);
}

void markReadAllInboxMessage(String? accountId) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('markReadAllInboxMessage'.toJS);
}

void markReadInboxMessagesForIds(
    String? accountId, JSArray<JSString> messageIds) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('markReadInboxMessagesForIds'.toJS, messageIds);
}

// --- Variables & Product Experiences ---

void defineVariables(String? accountId, JSAny object) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('defineVariables'.toJS, object);
}

void defineFileVariable(String? accountId, String fileVariable) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('defineFileVariable_'.toJS, fileVariable.toJS);
}

void syncVariables(String? accountId) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('syncVariables'.toJS);
}

void fetchVariables(String? accountId, JSFunction callback) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('fetchVariables'.toJS, callback);
}

void onValueChangedImpl(String? accountId, String key, JSFunction function) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('onValueChanged'.toJS, key.toJS, function);
}

void onVariablesChangedImpl(String? accountId, JSFunction function) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('onVariablesChanged'.toJS, function);
}

void getVariables(String? accountId, JSFunction function) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('getVariables'.toJS, function);
}

void getVariable(String? accountId, String name, JSFunction function) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('getVariable'.toJS, name.toJS, function);
}

// --- Version & Encryption ---

String? getSDKVersion(String? accountId) {
  final instance = getInstanceRef(accountId);
  final result = instance.callMethod('getSDKVersion'.toJS);
  if (result == null || result.isUndefinedOrNull) return null;
  return (result as JSString).toDart;
}

void enableLocalStorageEncryption(String? accountId, bool value) {
  final instance = getInstanceRef(accountId);
  instance.callMethod('enableLocalStorageEncryption'.toJS, value.toJS);
}

bool? isLocalStorageEncryptionEnabled(String? accountId) {
  final instance = getInstanceRef(accountId);
  final result = instance.callMethod('isLocalStorageEncryptionEnabled'.toJS);
  if (result == null || result.isUndefinedOrNull) return null;
  return (result as JSBoolean).toDart;
}

// --- Campaigns & Variants ---

JSAny getAllQualifiedCampaignDetails(String? accountId) {
  final instance = getInstanceRef(accountId);
  final result = instance.callMethod('getAllQualifiedCampaignDetails'.toJS);
  if (result == null || result.isUndefinedOrNull) {
    return <JSObject>[].toJS;
  }
  return result;
}

JSAny getVariants(String? accountId) {
  final instance = getInstanceRef(accountId);
  final result = instance.callMethod('getVariants'.toJS);
  if (result == null || result.isUndefinedOrNull) return <JSObject>[].toJS;
  return result;
}

// --- Document Event Listener (global, not per-instance) ---

@JS('document.addEventListener')
external void addDocumentEventListenerImpl(String name, JSFunction callback);

// --- Wrapper functions for type conversion ---

void setMultiValuesForKeyWrapper(String? accountId, String key, List? values) {
  if (values == null) {
    setMultiValuesForKey(accountId, key, null);
  } else {
    final jsValues = values.map((v) => v.toString().toJS).toList().toJS;
    setMultiValuesForKey(accountId, key, jsValues);
  }
}

void addMultiValuesForKeyWrapper(String? accountId, String key, List? values) {
  if (values != null) {
    final jsValues = values.map((v) => v.toString().toJS).toList().toJS;
    addMultiValuesForKey(accountId, key, jsValues);
  }
}

void removeMultiValuesForKeyWrapper(
    String? accountId, String key, List? values) {
  if (values != null) {
    final jsValues = values.map((v) => v.toString().toJS).toList().toJS;
    removeMultiValuesForKey(accountId, key, jsValues);
  }
}

void handleIncrementValueWrapper(String? accountId, String key, num value) {
  handleIncrementValue(accountId, key, value.toJS);
}

void handleDecrementValueWrapper(String? accountId, String key, num value) {
  handleDecrementValue(accountId, key, value.toJS);
}

void getLocationWrapper(
    String? accountId, double latitude, double longitude) {
  getLocation(accountId, latitude.toJS, longitude.toJS);
}

void markReadInboxMessagesForIdsWrapper(
    String? accountId, List messageIds) {
  final jsMessageIds =
      messageIds.map((id) => id.toString().toJS).toList().toJS;
  markReadInboxMessagesForIds(accountId, jsMessageIds);
}
