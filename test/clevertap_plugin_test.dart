import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:clevertap_plugin/clevertap_plugin.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  const MethodChannel channel = MethodChannel('clevertap_plugin');

  Map<dynamic, dynamic> testMap = new Map();
  testMap.putIfAbsent("key1", () => "val1");

  Map<String, bool> defaultBoolMap = new Map();
  defaultBoolMap.putIfAbsent("key1", () => false);

  Map<String, bool> mockBoolMap = new Map();
  mockBoolMap.putIfAbsent("key1", () => true);

  Map<String, double> defaultDoubleMap = new Map();
  defaultDoubleMap.putIfAbsent("key1", () => 9.9);

  Map<String, double> mockDoubleMap = new Map();
  mockDoubleMap.putIfAbsent("key1", () => 1.1);

  Map<String, int> defaultIntegerMap = new Map();
  defaultIntegerMap.putIfAbsent("key1", () => 9);

  Map<String, int> mockIntegerMap = new Map();
  mockIntegerMap.putIfAbsent("key1", () => 1);

  Map<String, String> defaultStringMap = new Map();
  defaultStringMap.putIfAbsent("key1", () => "default");

  Map<String, String> mockStringMap = new Map();
  mockStringMap.putIfAbsent("key1", () => "mock");

  List<dynamic> testList = [];
  testList.add("message1");

  List<bool> defaultBoolList = [];
  defaultBoolList.add(true);

  List<double> defaultDoubleList = [];
  defaultDoubleList.add(9.9);

  List<int> defaultIntegerList = [];
  defaultIntegerList.add(9);

  List<String> defaultStringList = [];
  defaultStringList.add("defaultStrings");

  var eventName = 'Flutter Event';
  var messageId = '123_123';

  String defaultStringValue = "defaultString";
  String mockString = "mockString";
  String varName = "varName";

  bool defaultBoolValue = false;
  bool mockBool = true;

  double defaultDoubleValue = 9.9;
  double mockDouble = 1.1;

  int defaultIntegerValue = 9;
  int mockInteger = 1;
  int nowDateTime = (DateTime.now().millisecondsSinceEpoch / 1000).truncate();

  /// Cannot call Android/iOS code so have to mock return values here
  setUp(() {
    channel.setMockMethodCallHandler((MethodCall methodCall) async {
      switch (methodCall.method) {
        case "eventGetOccurrences":
          return 1;
          break;
        case "eventGetFirstTime":
          return nowDateTime;
          break;
        case "eventGetLastTime":
          return nowDateTime;
          break;
        case "eventGetDetail":
          return testMap;
          break;
        case "getEventHistory":
          return testMap;
          break;
        case "profileGetCleverTapAttributionIdentifier":
          return mockString;
          break;
        case "profileGetCleverTapID":
          return mockString;
          break;
        case "sessionGetTimeElapsed":
          return nowDateTime;
          break;
        case "sessionGetTotalVisits":
          return mockInteger;
          break;
        case "sessionGetScreenCount":
          return mockInteger;
          break;
        case "sessionGetPreviousVisitTime":
          return nowDateTime;
          break;
        case "sessionGetUTMDetails":
          return testMap;
          break;
        case "getInboxMessageCount":
          return mockInteger;
          break;
        case "getInboxMessageUnreadCount":
          return mockInteger;
          break;
        case "getAllInboxMessages":
          return testList;
          break;
        case "getUnreadInboxMessages":
          return testList;
          break;
        case "getInboxMessageForId":
          return testMap;
          break;
        case "getInitialUrl":
          return mockString;
          break;
        case "getAllDisplayUnits":
          return testList;
          break;
        case "getDisplayUnitForId":
          return testMap;
          break;
        case "getFeatureFlag":
          return mockBool;
          break;
        case "getLastFetchTimeStampInMillis":
          return nowDateTime;
          break;
        case "getString":
          return mockString;
          break;
        case "getBoolean":
          return mockBool;
          break;
        case "getLong":
          return mockInteger;
          break;
        case "getDouble":
          return mockDouble;
          break;
      }
      return null;
    });
  });

  /// Clean up
  tearDown(() {
    channel.setMockMethodCallHandler(null);
  });

  test('testing eventGetOccurences method', () async {
    await CleverTapPlugin.eventGetOccurrences(eventName).then((occurences) {
      expect(occurences, 1);
    });
  });

  test('testing eventGetFirstTime method', () async {
    await CleverTapPlugin.eventGetFirstTime(eventName).then((time) {
      expect(time, nowDateTime);
    });
  });

  test('testing eventGetLastTime method', () async {
    await CleverTapPlugin.eventGetLastTime(eventName).then((time) {
      expect(time, nowDateTime);
    });
  });

  test('testing eventGetLastTime method', () async {
    await CleverTapPlugin.eventGetLastTime(eventName).then((time) {
      expect(time, nowDateTime);
    });
  });

  test('testing eventGetDetail method', () async {
    await CleverTapPlugin.eventGetDetail(eventName).then((detailMap) {
      expect(detailMap, testMap);
    });
  });

  test('testing eventGetDetail method', () async {
    await CleverTapPlugin.eventGetDetail(eventName).then((detailMap) {
      expect(detailMap, testMap);
    });
  });

  test('testing getEventHistory method', () async {
    await CleverTapPlugin.getEventHistory(eventName).then((historyMap) {
      expect(historyMap, testMap);
    });
  });

  test('testing profileGetCleverTapAttributionIdentifier method', () async {
    await CleverTapPlugin.profileGetCleverTapAttributionIdentifier()
        .then((attribId) {
      expect(attribId, mockString);
    });
  });

  test('testing profileGetCleverTapID method', () async {
    await CleverTapPlugin.profileGetCleverTapID().then((attribId) {
      expect(attribId, mockString);
    });
  });

  test('testing sessionGetTimeElapsed method', () async {
    await CleverTapPlugin.sessionGetTimeElapsed().then((sessionTime) {
      expect(sessionTime, nowDateTime);
    });
  });

  test('testing sessionGetTotalVisits method', () async {
    await CleverTapPlugin.sessionGetTotalVisits().then((totalVisits) {
      expect(totalVisits, mockInteger);
    });
  });

  test('testing sessionGetScreenCount method', () async {
    await CleverTapPlugin.sessionGetScreenCount().then((screenCount) {
      expect(screenCount, mockInteger);
    });
  });

  test('testing sessionGetPreviousVisitTime method', () async {
    await CleverTapPlugin.sessionGetPreviousVisitTime().then((visitTime) {
      expect(visitTime, nowDateTime);
    });
  });

  test('testing sessionGetUTMDetails method', () async {
    await CleverTapPlugin.sessionGetUTMDetails().then((utmMap) {
      expect(utmMap, testMap);
    });
  });

  test('testing getInboxMessageCount method', () async {
    await CleverTapPlugin.getInboxMessageCount().then((count) {
      expect(count, mockInteger);
    });
  });

  test('testing getInboxMessageUnreadCount method', () async {
    await CleverTapPlugin.getInboxMessageUnreadCount().then((count) {
      expect(count, mockInteger);
    });
  });

  test('testing getAllInboxMessages method', () async {
    await CleverTapPlugin.getAllInboxMessages().then((messageList) {
      expect(messageList, testList);
    });
  });

  test('testing getUnreadInboxMessages method', () async {
    await CleverTapPlugin.getUnreadInboxMessages().then((messageList) {
      expect(messageList, testList);
    });
  });

  test('testing getInboxMessageForId method', () async {
    await CleverTapPlugin.getInboxMessageForId(messageId).then((message) {
      expect(message, testMap);
    });
  });

  test('testing getInitialUrl method', () async {
    await CleverTapPlugin.getInitialUrl().then((url) {
      expect(url, mockString);
    });
  });

  test('testing getAllDisplayUnits method', () async {
    await CleverTapPlugin.getAllDisplayUnits().then((unitList) {
      expect(unitList, testList);
    });
  });

  test('testing getDisplayUnitForId method', () async {
    await CleverTapPlugin.getDisplayUnitForId(mockString).then((unitMap) {
      expect(unitMap, testMap);
    });
  });

  test('testing getFeatureFlag method', () async {
    await CleverTapPlugin.getFeatureFlag(varName, defaultBoolValue)
        .then((boolFlag) {
      expect(boolFlag, mockBool);
    });
  });

  test('testing getLastFetchTimeStampInMillis method', () async {
    await CleverTapPlugin.getLastFetchTimeStampInMillis().then((timeStamp) {
      expect(timeStamp, nowDateTime);
    });
  });

  test('testing getProductConfigString method', () async {
    await CleverTapPlugin.getProductConfigString(varName).then((pcString) {
      expect(pcString, mockString);
    });
  });

  test('testing getProductConfigBoolean method', () async {
    await CleverTapPlugin.getProductConfigBoolean(varName).then((pcBool) {
      expect(pcBool, mockBool);
    });
  });

  test('testing getProductConfigLong method', () async {
    await CleverTapPlugin.getProductConfigLong(varName).then((pcLong) {
      expect(pcLong, mockInteger);
    });
  });

  test('testing getProductConfigDouble method', () async {
    await CleverTapPlugin.getProductConfigDouble(varName).then((pcDouble) {
      expect(pcDouble, mockDouble);
    });
  });
}
