import 'dart:ui';

import 'package:clevertap_plugin/clevertap_plugin.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

/// Phase 6: every per-account method on a CleverTapInstance handle sends exactly what the static
/// CleverTapPlugin method sends, plus the handle's accountId.
///
/// Example: CleverTapPlugin.profileIncrementValue('Points', 10) sends
/// profileIncrementValue {key: Points, value: 10}; the handle for B sends
/// profileIncrementValue {key: Points, value: 10, accountId: B}. Same method, same keys, plus one.
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final messenger =
      TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger;
  const dartToNative = MethodChannel('clevertap_plugin/dart_to_native');

  // Methods whose static version casts a map from native; the mock must answer them with a map.
  const mapAnswers = {
    'eventGetDetail',
    'getEventHistory',
    'getUserEventLog',
    'getUserEventLogHistory',
    'sessionGetUTMDetails',
    'getInboxMessageForId',
    'getDisplayUnitForId',
  };

  final toNative = <MethodCall>[];
  setUpAll(() {
    messenger.setMockMethodCallHandler(dartToNative, (call) async {
      toNative.add(call);
      return mapAnswers.contains(call.method) ? {'k': 'v'} : null;
    });
  });
  setUp(toNative.clear);

  final b = CleverTapPlugin.getInstance('B');
  final extras = {'wzrk_id': 'n1'};
  final pushType = {'type': 'hps', 'prefKey': 'hps_token'};

  // [label, static call, the same call on handle B].
  final cases = <List<Object>>[
    ['setPushToken', () => CleverTapPlugin.setPushToken('t'), () => b.setPushToken('t')],
    ['pushRegistrationToken', () => CleverTapPlugin.pushRegistrationToken('t', pushType), () => b.pushRegistrationToken('t', pushType)],
    ['setOptOut', () => CleverTapPlugin.setOptOut(true), () => b.setOptOut(true)],
    ['setOptOut + allowSystemEvents', () => CleverTapPlugin.setOptOut(true, true), () => b.setOptOut(true, true)],
    ['setOffline', () => CleverTapPlugin.setOffline(true), () => b.setOffline(true)],
    ['enableDeviceNetworkInfoReporting', () => CleverTapPlugin.enableDeviceNetworkInfoReporting(true), () => b.enableDeviceNetworkInfoReporting(true)],
    ['pushNotificationClickedEvent', () => CleverTapPlugin.pushNotificationClickedEvent(extras), () => b.pushNotificationClickedEvent(extras)],
    ['pushNotificationViewedEvent', () => CleverTapPlugin.pushNotificationViewedEvent(extras), () => b.pushNotificationViewedEvent(extras)],
    ['recordScreenView', () => CleverTapPlugin.recordScreenView('Home'), () => b.recordScreenView('Home')],
    ['recordChargedEvent', () => CleverTapPlugin.recordChargedEvent({'Amount': 5}, [{'Item': 'x'}]), () => b.recordChargedEvent({'Amount': 5}, [{'Item': 'x'}])],
    // ignore: deprecated_member_use_from_same_package
    ['eventGetFirstTime', () => CleverTapPlugin.eventGetFirstTime('E'), () => b.eventGetFirstTime('E')],
    // ignore: deprecated_member_use_from_same_package
    ['eventGetLastTime', () => CleverTapPlugin.eventGetLastTime('E'), () => b.eventGetLastTime('E')],
    // ignore: deprecated_member_use_from_same_package
    ['eventGetOccurrences', () => CleverTapPlugin.eventGetOccurrences('E'), () => b.eventGetOccurrences('E')],
    // ignore: deprecated_member_use_from_same_package
    ['eventGetDetail', () => CleverTapPlugin.eventGetDetail('E'), () => b.eventGetDetail('E')],
    // ignore: deprecated_member_use_from_same_package
    ['getEventHistory', () => CleverTapPlugin.getEventHistory('E'), () => b.getEventHistory('E')],
    ['getUserEventLog', () => CleverTapPlugin.getUserEventLog('E'), () => b.getUserEventLog('E')],
    ['getUserEventLogCount', () => CleverTapPlugin.getUserEventLogCount('E'), () => b.getUserEventLogCount('E')],
    ['getUserEventLogHistory', () => CleverTapPlugin.getUserEventLogHistory(), () => b.getUserEventLogHistory()],
    ['getUserAppLaunchCount', () => CleverTapPlugin.getUserAppLaunchCount(), () => b.getUserAppLaunchCount()],
    ['getUserLastVisitTs', () => CleverTapPlugin.getUserLastVisitTs(), () => b.getUserLastVisitTs()],
    ['setLocation', () => CleverTapPlugin.setLocation(1.5, 2.5), () => b.setLocation(1.5, 2.5)],
    ['profileGetProperty', () => CleverTapPlugin.profileGetProperty('Name'), () => b.profileGetProperty('Name')],
    // ignore: deprecated_member_use_from_same_package
    ['profileGetCleverTapAttributionIdentifier', () => CleverTapPlugin.profileGetCleverTapAttributionIdentifier(), () => b.profileGetCleverTapAttributionIdentifier()],
    // ignore: deprecated_member_use_from_same_package
    ['profileGetCleverTapID', () => CleverTapPlugin.profileGetCleverTapID(), () => b.profileGetCleverTapID()],
    ['profileRemoveValueForKey', () => CleverTapPlugin.profileRemoveValueForKey('k'), () => b.profileRemoveValueForKey('k')],
    ['profileSetMultiValues', () => CleverTapPlugin.profileSetMultiValues('k', ['a']), () => b.profileSetMultiValues('k', ['a'])],
    ['profileAddMultiValue', () => CleverTapPlugin.profileAddMultiValue('k', 'a'), () => b.profileAddMultiValue('k', 'a')],
    ['profileIncrementValue', () => CleverTapPlugin.profileIncrementValue('k', 10), () => b.profileIncrementValue('k', 10)],
    ['profileDecrementValue', () => CleverTapPlugin.profileDecrementValue('k', 2.5), () => b.profileDecrementValue('k', 2.5)],
    ['profileAddMultiValues', () => CleverTapPlugin.profileAddMultiValues('k', ['a']), () => b.profileAddMultiValues('k', ['a'])],
    ['profileRemoveMultiValue', () => CleverTapPlugin.profileRemoveMultiValue('k', 'a'), () => b.profileRemoveMultiValue('k', 'a')],
    ['profileRemoveMultiValues', () => CleverTapPlugin.profileRemoveMultiValues('k', ['a']), () => b.profileRemoveMultiValues('k', ['a'])],
    ['pushInstallReferrer', () => CleverTapPlugin.pushInstallReferrer('s', 'm', 'c'), () => b.pushInstallReferrer('s', 'm', 'c')],
    ['sessionGetTimeElapsed', () => CleverTapPlugin.sessionGetTimeElapsed(), () => b.sessionGetTimeElapsed()],
    // ignore: deprecated_member_use_from_same_package
    ['sessionGetTotalVisits', () => CleverTapPlugin.sessionGetTotalVisits(), () => b.sessionGetTotalVisits()],
    ['sessionGetScreenCount', () => CleverTapPlugin.sessionGetScreenCount(), () => b.sessionGetScreenCount()],
    // ignore: deprecated_member_use_from_same_package
    ['sessionGetPreviousVisitTime', () => CleverTapPlugin.sessionGetPreviousVisitTime(), () => b.sessionGetPreviousVisitTime()],
    ['sessionGetUTMDetails', () => CleverTapPlugin.sessionGetUTMDetails(), () => b.sessionGetUTMDetails()],
    ['discardInAppNotifications', () => CleverTapPlugin.discardInAppNotifications(), () => b.discardInAppNotifications()],
    ['discardInAppNotifications + flag', () => CleverTapPlugin.discardInAppNotifications(dismissInAppIfVisible: true), () => b.discardInAppNotifications(dismissInAppIfVisible: true)],
    ['dismissPipInApp', () => CleverTapPlugin.dismissPipInApp(), () => b.dismissPipInApp()],
    ['unmute', () => CleverTapPlugin.unmute(), () => b.unmute()],
    ['fetchInbox', () => CleverTapPlugin.fetchInbox(), () => b.fetchInbox()],
    ['fetchInboxWithCallback', () => CleverTapPlugin.fetchInboxWithCallback(), () => b.fetchInboxWithCallback()],
    ['getInboxMessageCount', () => CleverTapPlugin.getInboxMessageCount(), () => b.getInboxMessageCount()],
    ['getInboxMessageUnreadCount', () => CleverTapPlugin.getInboxMessageUnreadCount(), () => b.getInboxMessageUnreadCount()],
    ['getAllInboxMessages', () => CleverTapPlugin.getAllInboxMessages(), () => b.getAllInboxMessages()],
    ['getUnreadInboxMessages', () => CleverTapPlugin.getUnreadInboxMessages(), () => b.getUnreadInboxMessages()],
    ['getInboxMessageForId', () => CleverTapPlugin.getInboxMessageForId('m'), () => b.getInboxMessageForId('m')],
    ['deleteInboxMessageForId', () => CleverTapPlugin.deleteInboxMessageForId('m'), () => b.deleteInboxMessageForId('m')],
    ['deleteInboxMessagesForIds', () => CleverTapPlugin.deleteInboxMessagesForIds(['m']), () => b.deleteInboxMessagesForIds(['m'])],
    ['markReadInboxMessageForId', () => CleverTapPlugin.markReadInboxMessageForId('m'), () => b.markReadInboxMessageForId('m')],
    ['markReadInboxMessagesForIds', () => CleverTapPlugin.markReadInboxMessagesForIds(['m']), () => b.markReadInboxMessagesForIds(['m'])],
    ['pushInboxNotificationClickedEventForId', () => CleverTapPlugin.pushInboxNotificationClickedEventForId('m'), () => b.pushInboxNotificationClickedEventForId('m')],
    ['pushInboxNotificationViewedEventForId', () => CleverTapPlugin.pushInboxNotificationViewedEventForId('m'), () => b.pushInboxNotificationViewedEventForId('m')],
    ['getAllDisplayUnits', () => CleverTapPlugin.getAllDisplayUnits(), () => b.getAllDisplayUnits()],
    ['getDisplayUnitForId', () => CleverTapPlugin.getDisplayUnitForId('u'), () => b.getDisplayUnitForId('u')],
    ['pushDisplayUnitViewedEvent', () => CleverTapPlugin.pushDisplayUnitViewedEvent('u'), () => b.pushDisplayUnitViewedEvent('u')],
    ['pushDisplayUnitClickedEvent', () => CleverTapPlugin.pushDisplayUnitClickedEvent('u'), () => b.pushDisplayUnitClickedEvent('u')],
    ['pushDisplayUnitElementClickedEvent', () => CleverTapPlugin.pushDisplayUnitElementClickedEvent('u', {'e': 1}), () => b.pushDisplayUnitElementClickedEvent('u', {'e': 1})],
    ['pushDisplayUnitElementViewedEvent', () => CleverTapPlugin.pushDisplayUnitElementViewedEvent('u', {'e': 1}), () => b.pushDisplayUnitElementViewedEvent('u', {'e': 1})],
    ['fetchNativeDisplayMeta', () => CleverTapPlugin.fetchNativeDisplayMeta(), () => b.fetchNativeDisplayMeta()],
    // ignore: deprecated_member_use_from_same_package
    ['getFeatureFlag', () => CleverTapPlugin.getFeatureFlag('f', true), () => b.getFeatureFlag('f', true)],
    // ignore: deprecated_member_use_from_same_package
    ['setDefaultsMap', () => CleverTapPlugin.setDefaultsMap({'d': 1}), () => b.setDefaultsMap({'d': 1})],
    // ignore: deprecated_member_use_from_same_package
    ['fetch', () => CleverTapPlugin.fetch(), () => b.fetch()],
    // ignore: deprecated_member_use_from_same_package
    ['fetchWithMinimumIntervalInSeconds', () => CleverTapPlugin.fetchWithMinimumIntervalInSeconds(60), () => b.fetchWithMinimumIntervalInSeconds(60)],
    // ignore: deprecated_member_use_from_same_package
    ['activate', () => CleverTapPlugin.activate(), () => b.activate()],
    // ignore: deprecated_member_use_from_same_package
    ['fetchAndActivate', () => CleverTapPlugin.fetchAndActivate(), () => b.fetchAndActivate()],
    // ignore: deprecated_member_use_from_same_package
    ['setMinimumFetchIntervalInSeconds', () => CleverTapPlugin.setMinimumFetchIntervalInSeconds(60), () => b.setMinimumFetchIntervalInSeconds(60)],
    // ignore: deprecated_member_use_from_same_package
    ['getLastFetchTimeStampInMillis', () => CleverTapPlugin.getLastFetchTimeStampInMillis(), () => b.getLastFetchTimeStampInMillis()],
    // ignore: deprecated_member_use_from_same_package
    ['getProductConfigString', () => CleverTapPlugin.getProductConfigString('k'), () => b.getProductConfigString('k')],
    // ignore: deprecated_member_use_from_same_package
    ['getProductConfigBoolean', () => CleverTapPlugin.getProductConfigBoolean('k'), () => b.getProductConfigBoolean('k')],
    // ignore: deprecated_member_use_from_same_package
    ['getProductConfigLong', () => CleverTapPlugin.getProductConfigLong('k'), () => b.getProductConfigLong('k')],
    // ignore: deprecated_member_use_from_same_package
    ['getProductConfigDouble', () => CleverTapPlugin.getProductConfigDouble('k'), () => b.getProductConfigDouble('k')],
    // ignore: deprecated_member_use_from_same_package
    ['resetProductConfig', () => CleverTapPlugin.resetProductConfig(), () => b.resetProductConfig()],
    ['getPushNotificationPermissionStatus', () => CleverTapPlugin.getPushNotificationPermissionStatus(), () => b.getPushNotificationPermissionStatus()],
    ['getVariants', () => CleverTapPlugin.getVariants(), () => b.getVariants()],
    ['fetchInApps', () => CleverTapPlugin.fetchInApps(), () => b.fetchInApps()],
  ];

  group('Phase 6: each handle method = the static method + accountId', () {
    for (final c in cases) {
      test(c[0] as String, () async {
        await (c[1] as Future<Object?> Function())();
        final sentByStatic = toNative.length;
        await (c[2] as Future<Object?> Function())();
        if (sentByStatic == 0) {
          // getAllDisplayUnits calls native only on Android and iOS (dart:io Platform); the test
          // host is neither, so both versions must skip the call alike.
          expect(toNative, isEmpty);
          return;
        }
        expect(toNative, hasLength(2));
        final static = toNative[0], handle = toNative[1];
        expect(handle.method, static.method);
        expect(static.arguments, isA<Map>());
        expect((static.arguments as Map).containsKey('accountId'), isFalse,
            reason: 'a static call must keep reaching the default account');
        expect(handle.arguments, {...static.arguments as Map, 'accountId': 'B'});
      });
    }
  });

  group('Phase 6: methods whose static call sends a bare value', () {
    test('setLocale: static sends the string, the handle wraps it with accountId', () async {
      await CleverTapPlugin.setLocale(const Locale('en', 'US'));
      await b.setLocale(const Locale('en', 'US'));
      expect(toNative.map((c) => [c.method, c.arguments]).toList(), [
        ['setLocale', 'en_US'],
        [
          'setLocale',
          {'value': 'en_US', 'accountId': 'B'}
        ],
      ]);
    });
  });

  group('Phase 6: results', () {
    test('a map result is cast exactly as by the static method', () async {
      expect(await b.getUserEventLog('E'), {'k': 'v'});
      expect(await b.getUserEventLog('E'), isA<Map<String, dynamic>>());
    });

    test('a value result passes through', () async {
      messenger.setMockMethodCallHandler(dartToNative,
          (call) async => call.method == 'getInboxMessageCount' ? 7 : null);
      addTearDown(() => messenger.setMockMethodCallHandler(dartToNative, (call) async {
            toNative.add(call);
            return mapAnswers.contains(call.method) ? {'k': 'v'} : null;
          }));
      expect(await b.getInboxMessageCount(), 7);
    });
  });
}
