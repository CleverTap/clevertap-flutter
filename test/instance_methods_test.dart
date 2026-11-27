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
    'getVariables',
  };

  final toNative = <MethodCall>[];
  setUpAll(() {
    messenger.setMockMethodCallHandler(dartToNative, (call) async {
      toNative.add(call);
      return mapAnswers.contains(call.method) ? {'k': 'v'} : null;
    });
    // Starts the plugin (one setLibrary) before the tests count calls. Same handle as `b` below.
    CleverTapPlugin.getInstance('B');
  });
  setUp(toNative.clear);

  // Lazy: getInstance starts the plugin (it sends setLibrary), so it must run after setUpAll
  // installs the mock native side.
  late final CleverTapInstance b = CleverTapPlugin.getInstance('B');
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
    // Phase 6, second part.
    ['enablePersonalization', () => CleverTapPlugin.enablePersonalization(), () => b.enablePersonalization()],
    ['disablePersonalization', () => CleverTapPlugin.disablePersonalization(), () => b.disablePersonalization()],
    ['suspendInAppNotifications', () => CleverTapPlugin.suspendInAppNotifications(), () => b.suspendInAppNotifications()],
    ['resumeInAppNotifications', () => CleverTapPlugin.resumeInAppNotifications(), () => b.resumeInAppNotifications()],
    ['initializeInbox', () => CleverTapPlugin.initializeInbox(), () => b.initializeInbox()],
    ['showInbox', () => CleverTapPlugin.showInbox({'navBarTitle': 'T'}), () => b.showInbox({'navBarTitle': 'T'})],
    ['dismissInbox', () => CleverTapPlugin.dismissInbox(), () => b.dismissInbox()],
    ['promptPushPrimer', () => CleverTapPlugin.promptPushPrimer({'inAppType': 'alert', 'titleText': 'T'}), () => b.promptPushPrimer({'inAppType': 'alert', 'titleText': 'T'})],
    ['unregisterPushPermissionNotificationResponseListener', () => CleverTapPlugin.unregisterPushPermissionNotificationResponseListener(), () => b.unregisterPushPermissionNotificationResponseListener()],
    ['syncVariables', () => CleverTapPlugin.syncVariables(), () => b.syncVariables()],
    ['syncVariablesinProd', () => CleverTapPlugin.syncVariablesinProd(true), () => b.syncVariablesinProd(true)],
    ['fetchVariables', () => CleverTapPlugin.fetchVariables(), () => b.fetchVariables()],
    ['defineVariables', () => CleverTapPlugin.defineVariables({'discount': 0}), () => b.defineVariables({'discount': 0})],
    ['defineFileVariable', () => CleverTapPlugin.defineFileVariable('banner'), () => b.defineFileVariable('banner')],
    ['getVariables', () => CleverTapPlugin.getVariables(), () => b.getVariables()],
    ['getVariable', () => CleverTapPlugin.getVariable('discount'), () => b.getVariable('discount')],
    // Phase 7: custom templates.
    ['syncCustomTemplates', () => CleverTapPlugin.syncCustomTemplates(), () => b.syncCustomTemplates()],
    ['syncCustomTemplatesInProd', () => CleverTapPlugin.syncCustomTemplatesInProd(true), () => b.syncCustomTemplatesInProd(true)],
    ['customTemplateRunAction', () => CleverTapPlugin.customTemplateRunAction('Spin', 'go'), () => b.customTemplateRunAction('Spin', 'go')],
    ['customTemplateGetStringArg', () => CleverTapPlugin.customTemplateGetStringArg('Spin', 'title'), () => b.customTemplateGetStringArg('Spin', 'title')],
    ['customTemplateGetNumberArg', () => CleverTapPlugin.customTemplateGetNumberArg('Spin', 'n'), () => b.customTemplateGetNumberArg('Spin', 'n')],
    ['customTemplateGetBooleanArg', () => CleverTapPlugin.customTemplateGetBooleanArg('Spin', 'on'), () => b.customTemplateGetBooleanArg('Spin', 'on')],
    ['customTemplateGetFileArg', () => CleverTapPlugin.customTemplateGetFileArg('Spin', 'img'), () => b.customTemplateGetFileArg('Spin', 'img')],
    ['customTemplateGetObjectArg', () => CleverTapPlugin.customTemplateGetObjectArg('Spin', 'map'), () => b.customTemplateGetObjectArg('Spin', 'map')],
    ['customTemplateContextToString', () => CleverTapPlugin.customTemplateContextToString('Spin'), () => b.customTemplateContextToString('Spin')],
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

  group('Phase 6: bare-value methods, second part', () {
    for (final c in <List<Object>>[
      ['promptForPushNotification', true, () => CleverTapPlugin.promptForPushNotification(true), () => b.promptForPushNotification(true)],
      ['clearInAppResources', false, () => CleverTapPlugin.clearInAppResources(false), () => b.clearInAppResources(false)],
      // Phase 7: the static call sends the bare template name.
      ['customTemplateSetDismissed', 'Spin', () => CleverTapPlugin.customTemplateSetDismissed('Spin'), () => b.customTemplateSetDismissed('Spin')],
      ['customTemplateSetPresented', 'Spin', () => CleverTapPlugin.customTemplateSetPresented('Spin'), () => b.customTemplateSetPresented('Spin')],
    ]) {
      test(c[0] as String, () async {
        await (c[2] as Future<Object?> Function())();
        await (c[3] as Future<Object?> Function())();
        expect(toNative.map((m) => [m.method, m.arguments]).toList(), [
          [c[0], c[1]],
          [
            c[0],
            {'value': c[1], 'accountId': 'B'}
          ],
        ]);
      });
    }
  });

  group('Variables listeners: one native callback per registration (doc section 11)', () {
    Future<void> fire(String method, String callbackId, Object values,
        {String accountId = 'DEF6', bool isDefault = true}) async {
      final data = const StandardMethodCodec().encodeMethodCall(MethodCall(method, {
        '__ctEnvelope': true,
        'accountId': accountId,
        'isDefault': isDefault,
        'payload': {'__ctCallbackId': callbackId, 'values': values},
      }));
      await messenger.handlePlatformMessage(
          'clevertap_plugin/native_to_dart', data, (_) {});
    }

    // The callbackId native received for the n-th registration in this test.
    String idOf(int n) => (toNative[n].arguments as Map)['callbackId'] as String;

    setUpAll(() => CleverTapPlugin()); // registers the native-to-Dart handler

    test('each registration sends its arguments, a unique callbackId and (handle) the accountId', () {
      final h = CleverTapPlugin.getInstance('L1');
      h.onVariablesChanged((_) {});
      h.onOneTimeVariablesChanged((_) {});
      h.onValueChanged('discount', (_) {});
      h.onVariablesChangedAndNoDownloadsPending((_) {});
      h.onceVariablesChangedAndNoDownloadsPending((_) {});
      h.onFileValueChanged('banner', (_) {});
      CleverTapPlugin.onValueChanged('discount', (_) {});
      final sent = toNative.map((m) => [m.method, Map.of(m.arguments as Map)..remove('callbackId')]).toList();
      expect(sent, [
        ['onVariablesChanged', {'accountId': 'L1'}],
        ['onOneTimeVariablesChanged', {'accountId': 'L1'}],
        ['onValueChanged', {'name': 'discount', 'accountId': 'L1'}],
        ['onVariablesChangedAndNoDownloadsPending', {'accountId': 'L1'}],
        ['onceVariablesChangedAndNoDownloadsPending', {'accountId': 'L1'}],
        ['onFileValueChanged', {'name': 'banner', 'accountId': 'L1'}],
        ['onValueChanged', {'name': 'discount'}], // static: no accountId, the default account
      ]);
      final ids = [for (var n = 0; n < 7; n++) idOf(n)];
      expect(ids.toSet(), hasLength(7));
      expect(ids, everyElement(matches(RegExp(r'^[0-9a-z]+-[0-9]+$'))));
    });

    test('two different handlers, one change: each runs once (before: a, b, a, b)', () async {
      final h = CleverTapPlugin.getInstance('L2');
      final got = <String>[];
      h.onVariablesChanged((v) => got.add('a ${v['discount']}'));
      h.onVariablesChanged((v) => got.add('b ${v['discount']}'));
      // One change: the SDK calls each of the two native callbacks once.
      await fire('onVariablesChanged', idOf(0), {'discount': 5}, accountId: 'L2', isDefault: false);
      await fire('onVariablesChanged', idOf(1), {'discount': 5}, accountId: 'L2', isDefault: false);
      expect(got, ['a 5', 'b 5']);
    });

    test('the same handler added twice runs twice per change (core SDK parity)', () async {
      final got = <String>[];
      void h1(Map<String, dynamic> _) => got.add('h1');
      CleverTapPlugin.onVariablesChanged(h1);
      CleverTapPlugin.onVariablesChanged(h1);
      await fire('onVariablesChanged', idOf(0), {'v': 1});
      await fire('onVariablesChanged', idOf(1), {'v': 1});
      expect(got, ['h1', 'h1']);
    });

    test('a once handler runs once; a later once handler does not rerun the earlier one', () async {
      final got = <String>[];
      CleverTapPlugin.onOneTimeVariablesChanged((_) => got.add('h1'));
      await fire('onOneTimeVariablesChanged', idOf(0), {'v': 1});
      await fire('onOneTimeVariablesChanged', idOf(0), {'v': 1}); // never expected from native; still once
      CleverTapPlugin.onOneTimeVariablesChanged((_) => got.add('h2'));
      await fire('onOneTimeVariablesChanged', idOf(1), {'v': 1}); // the SDK runs h2's callback at once
      expect(got, ['h1', 'h2']);
      expect(CleverTapPlugin.cleverTapOnOneTimeVariablesChangedHandlers, isEmpty,
          reason: 'a once handler leaves the public list after it runs');
    });

    test('a throwing once handler does not run again; a throwing persistent one keeps running', () async {
      var onceRuns = 0, persistentRuns = 0;
      final h = CleverTapPlugin.getInstance('L4');
      h.onceVariablesChangedAndNoDownloadsPending((_) {
        onceRuns++;
        throw StateError('app bug');
      });
      h.onVariablesChangedAndNoDownloadsPending((_) {
        persistentRuns++;
        throw StateError('app bug');
      });
      for (var i = 0; i < 2; i++) {
        await fire('onceVariablesChangedAndNoDownloadsPending', idOf(0), {}, accountId: 'L4', isDefault: false);
        await fire('onVariablesChangedAndNoDownloadsPending', idOf(1), {}, accountId: 'L4', isDefault: false);
      }
      expect(onceRuns, 1);
      expect(persistentRuns, 2);
    });

    test('onValueChanged: a handler sees only its own variable', () async {
      final got = <String>[];
      final h = CleverTapPlugin.getInstance('L5');
      h.onValueChanged('a', (v) => got.add('a-handler $v'));
      h.onValueChanged('b', (v) => got.add('b-handler $v'));
      await fire('onValueChanged', idOf(1), {'b': 2}, accountId: 'L5', isDefault: false); // only b changed
      expect(got, ['b-handler {b: 2}']);
    });

    test('an unknown ID (another engine, or from before a hot restart) runs nothing', () async {
      final got = <String>[];
      CleverTapPlugin.onFileValueChanged('banner', (_) => got.add('h'));
      await fire('onFileValueChanged', 'oldsession-1', {'banner': 'x'});
      expect(got, isEmpty);
    });

    test('clearing a public static list stops those handlers, as before', () async {
      final got = <String>[];
      CleverTapPlugin.onVariablesChangedAndNoDownloadsPending((_) => got.add('h'));
      await fire('onVariablesChangedAndNoDownloadsPending', idOf(0), {});
      CleverTapPlugin.cleverTapOnVariablesChangedAndNoDownloadsPendingHandlers.clear();
      await fire('onVariablesChangedAndNoDownloadsPending', idOf(0), {});
      expect(got, ['h']);
    });

    test('an ID arriving under another account runs nothing', () async {
      final got = <String>[];
      CleverTapPlugin.onVariablesChanged((_) => got.add('static'));
      CleverTapPlugin.getInstance('L7').onVariablesChanged((_) => got.add('L7'));
      await fire('onVariablesChanged', idOf(0), {}, accountId: 'B', isDefault: false); // static's ID, B's account
      await fire('onVariablesChanged', idOf(1), {}, accountId: 'L8', isDefault: false); // L7's ID, L8's account
      expect(got, isEmpty);
      await fire('onVariablesChanged', idOf(0), {}); // the default account
      await fire('onVariablesChanged', idOf(1), {}, accountId: 'L7', isDefault: false);
      expect(got, ['static', 'L7']);
    });

    test('the handler receives exactly the values map, as before', () async {
      Map<String, dynamic>? got;
      CleverTapPlugin.getInstance('L6').onVariablesChanged((v) => got = v);
      await fire('onVariablesChanged', idOf(0), {'discount': 10, 'theme': {'color': 'red'}},
          accountId: 'L6', isDefault: false);
      expect(got, {'discount': 10, 'theme': {'color': 'red'}});
    });
  });

  group('F2: an unknown inbox message or display unit', () {
    test('a null answer is an empty map, static and handle alike', () async {
      messenger.setMockMethodCallHandler(dartToNative, (call) async => null);
      addTearDown(() => messenger.setMockMethodCallHandler(dartToNative, (call) async {
            toNative.add(call);
            return mapAnswers.contains(call.method) ? {'k': 'v'} : null;
          }));
      expect(await CleverTapPlugin.getInboxMessageForId('no-such-id'), isEmpty);
      expect(await b.getInboxMessageForId('no-such-id'), isEmpty);
      expect(await CleverTapPlugin.getDisplayUnitForId('no-such-unit'), isEmpty);
      expect(await b.getDisplayUnitForId('no-such-unit'), isEmpty);
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
