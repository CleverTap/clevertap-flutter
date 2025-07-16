import 'dart:js_interop';

// Direct external function declarations for CleverTap JavaScript API
@JS('clevertap.init')
external void init(
    String accountId, String? region, String? targetDomain, String? token);

@JS('clevertap.setLibrary')
external void setLibrary(String libName, int libVersion);

@JS('clevertap.toggleInbox')
external void toggleInbox(JSAny object);

@JS('clevertap.event.push')
external void event_push(String event, JSAny? object);

@JS('clevertap.onUserLogin.push')
external void onUserLogin_push(JSAny object);

@JS('clevertap.notifications.push')
external void notifications_push(JSAny object);

@JS('clevertap.notifications.enable')
external void notifications_enable(JSAny object);

@JS('clevertap.profile.push')
external void profile_push(JSAny object);

@JS('clevertap.privacy.push')
external void privacy_push(JSAny object);

@JS('clevertap.setLogLevel')
external void setLogLevel(int value);

@JS('clevertap.getCleverTapID')
external String? getCleverTapID();

@JS('clevertap.getAccountID')
external String? getAccountID();

@JS('clevertap.setOffline')
external void setOffline(bool value);

@JS('clevertap.setMultiValuesForKey')
external void setMultiValuesForKey(String key, JSArray<JSString>? values);

@JS('clevertap.addMultiValueForKey')
external void addMultiValueForKey(String key, String value);

@JS('clevertap.addMultiValuesForKey')
external void addMultiValuesForKey(String key, JSArray<JSString>? values);

@JS('clevertap.removeMultiValueForKey')
external void removeMultiValueForKey(String key, String value);

@JS('clevertap.removeMultiValuesForKey')
external void removeMultiValuesForKey(String key, JSArray<JSString>? values);

@JS('clevertap.removeValueForKey')
external void removeValueForKey(String key);

@JS('clevertap.handleIncrementValue')
external void handleIncrementValue(String key, JSNumber value);

@JS('clevertap.handleDecrementValue')
external void handleDecrementValue(String key, JSNumber value);

@JS('clevertap.getLocation')
external void getLocation(JSNumber latitude, JSNumber longitude);

@JS('clevertap.renderNotificationViewed')
external void renderNotificationViewed(JSAny object);

@JS('clevertap.renderNotificationClicked')
external void renderNotificationClicked(JSAny object);

@JS('clevertap.getInboxMessageCount')
external int getInboxMessageCount();

@JS('clevertap.getInboxMessageUnreadCount')
external int getInboxMessageUnreadCount();

@JS('clevertap.getAllInboxMessages')
external JSObject getAllInboxMessages();

@JS('clevertap.getUnreadInboxMessages')
external JSObject getUnreadInboxMessages();

@JS('clevertap.getInboxMessageForId')
external JSAny getInboxMessageForId(String messageId);

@JS('clevertap.deleteInboxMessage')
external void deleteInboxMessage(String messageId);

@JS('clevertap.markReadInboxMessage')
external void markReadInboxMessage(String messageId);

@JS('clevertap.markReadAllInboxMessage')
external void markReadAllInboxMessage();

@JS('clevertap.markReadInboxMessagesForIds')
external void markReadInboxMessagesForIds(JSArray<JSString> messageIds);

@JS('clevertap.defineVariables')
external void defineVariables(JSAny object);

@JS('clevertap.defineFileVariable_')
external void defineFileVariable(String fileVariable);

@JS('clevertap.syncVariables')
external void syncVariables();

@JS('clevertap.fetchVariables')
external void fetchVariables(JSFunction callback);

@JS('clevertap.onValueChanged')
external void onValueChangedImpl(String key, JSFunction function);

@JS('clevertap.onVariablesChanged')
external void onVariablesChangedImpl(JSFunction function);

@JS('clevertap.getVariables')
external void getVariables(JSFunction function);

@JS('clevertap.getVariable')
external void getVariable(String name, JSFunction function);

@JS('clevertap.getSDKVersion')
external String? getSDKVersion();

@JS('clevertap.enableLocalStorageEncryption')
external void enableLocalStorageEncryption(bool value);

@JS('clevertap.isLocalStorageEncryptionEnabled')
external bool? isLocalStorageEncryptionEnabled();

@JS('clevertap.getAllQualifiedCampaignDetails')
external JSArray<JSObject> getAllQualifiedCampaignDetails();

@JS('document.addEventListener')
external void addDocumentEventListenerImpl(String name, JSFunction callback);

// Wrapper functions for List handling
void setMultiValuesForKeyWrapper(String key, List? values) {
  if (values == null) {
    setMultiValuesForKey(key, null);
  } else {
    final jsValues = values.map((v) => v.toString().toJS).toList().toJS;
    setMultiValuesForKey(key, jsValues);
  }
}

void addMultiValuesForKeyWrapper(String key, List? values) {
  if (values != null) {
    final jsValues = values.map((v) => v.toString().toJS).toList().toJS;
    addMultiValuesForKey(key, jsValues);
  }
}

void removeMultiValuesForKeyWrapper(String key, List? values) {
  if (values != null) {
    final jsValues = values.map((v) => v.toString().toJS).toList().toJS;
    removeMultiValuesForKey(key, jsValues);
  }
}

void handleIncrementValueWrapper(String key, num value) {
  handleIncrementValue(key, value.toJS);
}

void handleDecrementValueWrapper(String key, num value) {
  handleDecrementValue(key, value.toJS);
}

void getLocationWrapper(double latitude, double longitude) {
  getLocation(latitude.toJS, longitude.toJS);
}

void markReadInboxMessagesForIdsWrapper(List messageIds) {
  final jsMessageIds = messageIds.map((id) => id.toString().toJS).toList().toJS;
  markReadInboxMessagesForIds(jsMessageIds);
}
