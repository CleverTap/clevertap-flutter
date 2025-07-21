@JS("clevertap")
library clevertap;

import 'package:js/js.dart';

@JS('init')
external void init(
    String accountId, String? region, String? targetDomain, String? token);

@JS('setLibrary')
external void setLibrary(
  String libName,
  int libVersion,
);

@JS('toggleInbox')
external void toggleInbox(Object object);

@JS('event.push')
external void event_push(String event, Object? object);

@JS('onUserLogin.push')
external void onUserLogin_push(Object object);

@JS('notifications.push')
external void notifications_push(Object object);

@JS('notifications.enable')
external void notifications_enable(Object object);

@JS('profile.push')
external void profile_push(Object object);

@JS('privacy.push')
external void privacy_push(Object object);

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
external void renderNotificationViewed(Object object);

@JS('renderNotificationViewed')
external void renderNotificationClicked(Object object);

@JS('getInboxMessageCount')
external int getInboxMessageCount();

@JS('getInboxMessageUnreadCount')
external int getInboxMessageUnreadCount();

@JS('getAllInboxMessages')
external Map getAllInboxMessages();

@JS('getUnreadInboxMessages')
external Map getUnreadInboxMessages();

@JS('getInboxMessageForId')
external Object getInboxMessageForId(String messageId);

@JS('deleteInboxMessage')
external void deleteInboxMessage(String messageId);

@JS('markReadInboxMessage')
external void markReadInboxMessage(String messageId);

@JS('markReadAllInboxMessage')
external void markReadAllInboxMessage();

@JS('markReadInboxMessagesForIds')
external void markReadInboxMessagesForIds(List messageIds);

@JS('defineVariables')
external void defineVariables(Object object);

@JS('syncVariables')
external void syncVariables();

@JS('fetchVariables')
external void fetchVariables(Function callback);

@JS('onValueChanged')
external void onValueChangedImpl(String key, Function function);

@JS('onVariablesChanged')
external void onVariablesChangedImpl(Function function);

@JS('getVariables')
external void getVariables(Function function);

@JS('getVariable')
external void getVariable(String name, Function function);

@JS('addDocumentEventListener')
external void addDocumentEventListenerImpl(String name, Function callback);
