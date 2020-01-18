import 'dart:async';

import 'package:flutter/services.dart';

typedef void CleverTapInAppNotificationDismissedHandler(List<Map<String,dynamic>> mapList);
typedef void CleverTapProfileDidInitializeHandler();
typedef void CleverTapProfileSyncHandler(Map<String,dynamic> map);
typedef void CleverTapInboxDidInitializeHandler();
typedef void CleverTapInboxMessagesDidUpdateHandler();
typedef void CleverTapExperimentsDidUpdateHandler();

class CleverTapPlugin {
	CleverTapInAppNotificationDismissedHandler cleverTapInAppNotificationDismissedHandler;
	CleverTapProfileDidInitializeHandler cleverTapProfileDidInitializeHandler;
	CleverTapProfileSyncHandler cleverTapProfileSyncHandler;
	CleverTapInboxDidInitializeHandler cleverTapInboxDidInitializeHandler;
	CleverTapInboxMessagesDidUpdateHandler cleverTapInboxMessagesDidUpdateHandler;
	CleverTapExperimentsDidUpdateHandler cleverTapExperimentsDidUpdateHandler;

	static const MethodChannel _channel =
	const MethodChannel('clevertap_plugin');

	static final CleverTapPlugin _clevertapPlugin = new CleverTapPlugin._internal();

	factory CleverTapPlugin() => _clevertapPlugin;

	CleverTapPlugin._internal(){
		_channel.setMethodCallHandler(_platformCallHandler);
	}

	Future _platformCallHandler(MethodCall call) async {
		print("_platformCallHandler call ${call.method} ${call.arguments}");
		switch (call.method) {
			case "inAppNotificationDismissed":
				print("inAppNotificationDismissed called in CleverTap Flutter");
				cleverTapInAppNotificationDismissedHandler(call.arguments);
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
			case "CTExperimentsUpdated":
				cleverTapExperimentsDidUpdateHandler();
				break;
		}
	}

	// define a method to handle inApp notification dismissed
	void setCleverTapInAppNotificationDismissedHandler(CleverTapInAppNotificationDismissedHandler handler) =>
		cleverTapInAppNotificationDismissedHandler = handler;

	// define a method to handle profile initialization
	void setCleverTapProfileDidInitializeHandler(CleverTapProfileDidInitializeHandler handler) =>
		cleverTapProfileDidInitializeHandler = handler;

	// define a method to handle profile sync
	void setCleverTapProfileSyncHandler(CleverTapProfileSyncHandler handler) =>
		cleverTapProfileSyncHandler = handler;

	// define a method to handle inbox initialization
	void setCleverTapInboxDidInitializeHandler(CleverTapInboxDidInitializeHandler handler) =>
		cleverTapInboxDidInitializeHandler = handler;

	// define a method to handle inbox update
	void setCleverTapInboxMessagesDidUpdateHandler(CleverTapInboxMessagesDidUpdateHandler handler) =>
		cleverTapInboxMessagesDidUpdateHandler = handler;

	// define a method to handle inbox update
	void setCleverTapExperimentsDidUpdateHandler(CleverTapExperimentsDidUpdateHandler handler) =>
		cleverTapExperimentsDidUpdateHandler = handler;

	static Future<void> setDebugLevel(int value) async {
		return await _channel.invokeMethod('setDebugLevel', {'debugLevel':value});
	}

	static Future<void> registerForPush() async {
    	return await _channel.invokeMethod('registerForPush', {});
	}

	static Future<void> setPushToken(String value) async {
		return await _channel.invokeMethod('setPushToken', {'token':value});
	}

//	static Future<void> setUIEditorConnectionEnabled(bool value) async {
//		return await _channel.invokeMethod('setUIEditorConnectionEnabled', {'value':value});
//	}

	static Future<void> createNotificationChannel(String channelId, String channelName, String channelDescription, int importance, bool showBadge) async {
		return await _channel.invokeMethod('createNotificationChannel', {'channelId':channelId,'channelName':channelName, 'channelDescription':channelDescription, 'importance':importance, 'showBadge':showBadge});
	}

	static Future<void> createNotificationChannelWithSound(String channelId, String channelName, String channelDescription, int importance, bool showBadge, String sound) async {
		return await _channel.invokeMethod('createNotificationChannelWithSound', {'channelId':channelId,'channelName':channelName, 'channelDescription':channelDescription, 'importance':importance, 'showBadge':showBadge, 'sound':sound});
	}

	static Future<void> createNotificationChannelWithGroupId(String channelId, String channelName, String channelDescription, int importance, String groupId, bool showBadge) async {
		return await _channel.invokeMethod('createNotificationChannelWithGroupId', {'channelId':channelId,'channelName':channelName, 'channelDescription':channelDescription, 'importance':importance, 'groupId':groupId, 'showBadge':showBadge});
	}

	static Future<void> createNotificationChannelWithGroupIdAndSound(String channelId, String channelName, String channelDescription, int importance, String groupId, bool showBadge, String sound) async {
		return await _channel.invokeMethod('createNotificationChannelWithGroupId', {'channelId':channelId,'channelName':channelName, 'channelDescription':channelDescription, 'importance':importance, 'groupId':groupId, 'showBadge':showBadge, 'sound':sound});
	}

	static Future<void> createNotificationChannelGroup(String groupId, String groupName) async {
		return await _channel.invokeMethod('createNotificationChannelGroup', {'groupId':groupId,'groupName':groupName});
	}

	static Future<void> deleteNotificationChannel(String channelId) async {
		return await _channel.invokeMethod('deleteNotificationChannel', {'channelId':channelId});
	}

	static Future<void> deleteNotificationChannelGroup(String groupId) async {
		return await _channel.invokeMethod('deleteNotificationChannelGroup', {'groupId':groupId});
	}

	static Future<void> setOptOut(bool value) async {
		return await _channel.invokeMethod('setOptOut', {'value':value});
	}

	static Future<void> setOffline(bool value) async {
		return await _channel.invokeMethod('setOffline', {'value':value});
	}

	static Future<void> enableDeviceNetworkInfoReporting(bool value) async {
		return await _channel.invokeMethod('enableDeviceNetworkInfoReporting', {'value':value});
	}

	static Future<void> enablePersonalization() async {
		return await _channel.invokeMethod('enablePersonalization',{});
	}

	static Future<void> disablePersonalization() async {
		return await _channel.invokeMethod('disablePersonalization',{});
	}

	static Future<void> recordScreenView(String screenName) async {
		return await _channel.invokeMethod('recordScreenView',{'screenName':screenName});
	}

	static Future<void> recordEvent(String eventName, Map<String, dynamic> properties) async {
		return await _channel.invokeMethod('recordEvent',{'eventName':eventName,'eventData':properties});
	}

	static Future<void> recordChargedEvent(Map<String, dynamic> chargeDetails, List<Map<String,dynamic>> items) async {
		return await _channel.invokeMethod('recordChargedEvent',{'chargeDetails':chargeDetails,'items':items});
	}

	static Future<double> eventGetFirstTime(String eventName) async {
		return await _channel.invokeMethod('eventGetFirstTime',{'eventName':eventName});
	}

	static Future<double> eventGetLastTime(String eventName) async {
		return await _channel.invokeMethod('eventGetLastTime',{'eventName':eventName});
	}

	static Future<int> eventGetOccurrences(String eventName) async {
		return await _channel.invokeMethod('eventGetOccurrences',{'eventName':eventName});
	}

	static Future<Map<String,dynamic>> eventGetDetail(String eventName) async {
		Map<dynamic, dynamic> response = await _channel.invokeMethod('eventGetDetail',{'eventName':eventName});
		return response.cast<String, dynamic>();
	}

	static Future<Map<String,dynamic>> getEventHistory(String eventName) async {
		Map<dynamic, dynamic> response = await _channel.invokeMethod('getEventHistory',{'eventName':eventName});
		return response.cast<String, dynamic>();
	}

	static Future<void> setLocation(double latitude, double longitude) async {
		return await _channel.invokeMethod('setLocation',{'latitude':latitude,'longitude':longitude});
	}

	static Future<String> profileGetCleverTapAttributionIdentifier() async {
		return await _channel.invokeMethod('profileGetCleverTapAttributionIdentifier',{});
	}

	static Future<String> profileGetCleverTapID() async {
		return await _channel.invokeMethod('profileGetCleverTapID',{});
	}

	static Future<void> onUserLogin(Map<String,dynamic> profile) async {
		return await _channel.invokeMethod('onUserLogin',{'profile':profile});
	}

	static Future<void> profileSet(Map<String,dynamic> profile) async {
		return await _channel.invokeMethod('profileSet',{'profile':profile});
	}

	static Future<void> profileSetGraphUser(Map<String,dynamic> profile) async {
		return await _channel.invokeMethod('profileSetGraphUser',{'profile':profile});
	}

	static Future<void> profileRemoveValueForKey(String key) async {
		return await _channel.invokeMethod('profileRemoveValueForKey',{'key':key});
	}

	static Future<void> profileSetMultiValues(String key, List values) async {
		return await _channel.invokeMethod('profileSetMultiValues',{'key':key,'values':values});
	}

	static Future<void> profileAddMultiValue(String key, String value) async {
		return await _channel.invokeMethod('profileAddMultiValue',{'key':key,'value':value});
	}

	static Future<void> profileAddMultiValues(String key, List values) async {
		return await _channel.invokeMethod('profileAddMultiValues',{'key':key,'values':values});
	}

	static Future<void> profileRemoveMultiValue(String key, String value) async {
		return await _channel.invokeMethod('profileRemoveMultiValue',{'key':key,'value':value});
	}

	static Future<void> profileRemoveMultiValues(String key, List values) async {
		return await _channel.invokeMethod('profileRemoveMultiValues',{'key':key,'values':values});
	}

	static Future<void> pushInstallReferrer(String source, String medium, String campaign) async {
		return await _channel.invokeMethod('pushInstallReferrer',{'source':source,'medium':medium,'campaign':campaign});
	}

	static Future<double> sessionGetTimeElapsed() async {
		return await _channel.invokeMethod('sessionGetTimeElapsed',{});
	}

	static Future<int> sessionGetTotalVisits() async {
		return await _channel.invokeMethod('sessionGetTotalVisits',{});
	}

	static Future<int> sessionGetScreenCount() async {
		return await _channel.invokeMethod('sessionGetScreenCount',{});
	}

	static Future<double> sessionGetPreviousVisitTime() async {
		return await _channel.invokeMethod('sessionGetPreviousVisitTime',{});
	}

	static Future<Map<String,dynamic>> sessionGetUTMDetails() async {
		Map<dynamic, dynamic> response = await _channel.invokeMethod('sessionGetUTMDetails',{});
		return response.cast<String, dynamic>();
	}

	static Future<void> initializeInbox() async {
		return await _channel.invokeMethod('initializeInbox',{});
	}

	static Future<void> showInbox(Map<String,dynamic> styleConfig) async {
		return await _channel.invokeMethod('showInbox',{'styleConfig':styleConfig});
	}

	static Future<int> getInboxMessageCount() async {
		return await _channel.invokeMethod('getInboxMessageCount',{});
	}

	static Future<int> getInboxMessageUnreadCount() async {
		return await _channel.invokeMethod('getInboxMessageUnreadCount',{});
	}

	static Future<String> getInitialUrl() async {
		return await _channel.invokeMethod('getInitialUrl',{});
	}

//	static Future<void> registerBooleanVariable(String name) async {
//		return await _channel.invokeMethod('registerBooleanVariable',{'name':name});
//	}
//
//	static Future<void> registerDoubleVariable(String name) async {
//		return await _channel.invokeMethod('registerDoubleVariable',{'name':name});
//	}
//
//	static Future<void> registerIntegerVariable(String name) async {
//		return await _channel.invokeMethod('registerIntegerVariable',{'name':name});
//	}
//
//	static Future<void> registerStringVariable(String name) async {
//		return await _channel.invokeMethod('registerStringVariable',{'name':name});
//	}
//
//	static Future<void> registerListOfBooleanVariable(String name) async {
//		return await _channel.invokeMethod('registerListOfBooleanVariable',{'name':name});
//	}
//
//	static Future<void> registerListOfDoubleVariable(String name) async {
//		return await _channel.invokeMethod('registerListOfDoubleVariable',{'name':name});
//	}
//
//	static Future<void> registerListOfIntegerVariable(String name) async {
//		return await _channel.invokeMethod('registerListOfIntegerVariable',{'name':name});
//	}
//
//	static Future<void> registerListOfStringVariable(String name) async {
//		return await _channel.invokeMethod('registerListOfStringVariable',{'name':name});
//	}
//
//	static Future<void> registerMapOfBooleanVariable(String name) async {
//		return await _channel.invokeMethod('registerMapOfBooleanVariable',{'name':name});
//	}
//
//	static Future<void> registerMapOfDoubleVariable(String name) async {
//		return await _channel.invokeMethod('registerMapOfDoubleVariable',{'name':name});
//	}
//
//	static Future<void> registerMapOfIntegerVariable(String name) async {
//		return await _channel.invokeMethod('registerMapOfIntegerVariable',{'name':name});
//	}
//
//	static Future<void> registerMapOfStringVariable(String name) async {
//		return await _channel.invokeMethod('registerMapOfStringVariable',{'name':name});
//	}
//
//	static Future<bool> getBooleanVariable(String name, bool defaultValue) async {
//		return await _channel.invokeMethod('getBooleanVariable',{'name':name,'defaultValue':defaultValue});
//	}
//
//	static Future<double> getDoubleVariable(String name, double defaultValue) async {
//		return await _channel.invokeMethod('getDoubleVariable',{'name':name,'defaultValue':defaultValue});
//	}
//
//	static Future<int> getIntegerVariable(String name, int defaultValue) async {
//		return await _channel.invokeMethod('getIntegerVariable',{'name':name,'defaultValue':defaultValue});
//	}
//
//	static Future<String> getStringVariable(String name, String defaultValue) async {
//		return await _channel.invokeMethod('getStringVariable',{'name':name,'defaultValue':defaultValue});
//	}
//
//	static Future<List> getListOfBooleanVariable(String name, List defaultValue) async {
//		return await _channel.invokeMethod('getListOfBooleanVariable',{'name':name,'defaultValue':defaultValue});
//	}
//
//	static Future<List> getListOfDoubleVariable(String name, List defaultValue) async {
//		return await _channel.invokeMethod('getListOfDoubleVariable',{'name':name,'defaultValue':defaultValue});
//	}
//
//	static Future<List> getListOfIntegerVariable(String name, List defaultValue) async {
//		return await _channel.invokeMethod('getListOfIntegerVariable',{'name':name,'defaultValue':defaultValue});
//	}
//
//	static Future<List> getListOfStringVariable(String name, List defaultValue) async {
//		return await _channel.invokeMethod('getListOfStringVariable',{'name':name,'defaultValue':defaultValue});
//	}
//
//	static Future<Map<String,bool>> getMapOfBooleanVariable(String name, Map<String,bool> defaultValue) async {
//		return await _channel.invokeMethod('getMapOfBooleanVariable',{'name':name,'defaultValue':defaultValue});
//	}
//
//	static Future<Map<String,double>> getMapOfDoubleVariable(String name, Map<String,double> defaultValue) async {
//		return await _channel.invokeMethod('getMapOfDoubleVariable',{'name':name,'defaultValue':defaultValue});
//	}
//
//	static Future<Map<String,int>> getMapOfIntegerVariable(String name, Map<String,int> defaultValue) async {
//		return await _channel.invokeMethod('getMapOfIntegerVariable',{'name':name,'defaultValue':defaultValue});
//	}
//
//	static Future<Map<String,String>> getMapOfStringVariable(String name, Map<String,String> defaultValue) async {
//		return await _channel.invokeMethod('getMapOfStringVariable',{'name':name,'defaultValue':defaultValue});
//	}
}
