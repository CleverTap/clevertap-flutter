@JS("clevertap")
library clevertap;

import 'dart:js_interop';

@JS('init')
external void init(
    String accountId, String? region, String? targetDomain, String? token);

@JS('setLibrary')
external void setLibrary(
  String libName,
  int libVersion,
);

@JS('toggleInbox')
external void toggleInbox(JSObject object);

@JS('event.push')
external void event_push(String event, JSObject? object);

@JS('onUserLogin.push')
external void onUserLogin_push(JSObject object);

@JS('notifications.push')
external void notifications_push(JSObject object);

@JS('profile.push')
external void profile_push(JSObject object);

@JS('privacy.push')
external void privacy_push(JSObject object);

@JS('setLogLevel')
external void setLogLevel(int value);

@JS('getCleverTapID')
external String? getCleverTapID();

@JS('getAccountID')
external String? getAccountID();

@JS('setOffline')
external void setOffline(bool value);

@JS('setMultiValuesForKey')
external void setMultiValuesForKey(String key, List? values);

@JS('addMultiValueForKey')
external void addMultiValueForKey(String key, String value);

@JS('addMultiValuesForKey')
external void addMultiValuesForKey(String key, List? values);

@JS('removeMultiValueForKey')
external void removeMultiValueForKey(String key, String value);

@JS('removeMultiValuesForKey')
external void removeMultiValuesForKey(String key, List? values);

@JS('removeValueForKey')
external void removeValueForKey(String key);

@JS('handleIncrementValue')
external void handleIncrementValue(String key, num value);

@JS('handleDecrementValue')
external void handleDecrementValue(String key, num value);

@JS('getLocation')
external void getLocation(double latitude, double longitude);

@JS('renderNotificationViewed')
external void renderNotificationViewed(JSObject object);

@JS('renderNotificationViewed')
external void renderNotificationClicked(JSObject object);

@JS('getInboxMessageCount')
external int getInboxMessageCount();

@JS('getInboxMessageUnreadCount')
external int getInboxMessageUnreadCount();

@JS('getAllInboxMessages')
external JSAny getAllInboxMessages();

@JS('getUnreadInboxMessages')
external JSAny getUnreadInboxMessages();

@JS('getInboxMessageForId')
external JSAny getInboxMessageForId(String messageId);

@JS('deleteInboxMessage')
external void deleteInboxMessage(String messageId);

@JS('markReadInboxMessage')
external void markReadInboxMessage(String messageId);

@JS('markReadAllInboxMessage')
external void markReadAllInboxMessage();

@JS('markReadInboxMessagesForIds')
external void markReadInboxMessagesForIds(List messageIds);

@JS('defineVariables')
external void defineVariables(JSObject object);

@JS('syncVariables')
external void syncVariables();

@JS('fetchVariables')
external void fetchVariables(Function callback);

@JS('onValueChanged')
external void onValueChanged(String key, Function function);

@JS('onVariablesChanged')
external void onVariablesChanged(Function function);

@JS('getVariables')
external void getVariables(Function function);

@JS('getVariable')
external void getVariable(String name, Function function);
