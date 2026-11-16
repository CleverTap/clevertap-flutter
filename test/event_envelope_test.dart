import 'package:clevertap_plugin/clevertap_plugin.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

/// Phase 3: native sends every event as
/// `{__ctEnvelope: true, accountId, isDefault, payload}`. These tests send all 26 event names
/// through the real codec and the real handler, and check that the static (default-account)
/// handlers receive exactly what they received before the envelope existed.
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final messenger =
      TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger;
  const dartToNative = MethodChannel('clevertap_plugin/dart_to_native');

  /// What each handler received, as `[methodName, value]`.
  final received = <List<Object?>>[];
  void record(String method, Object? value) => received.add([method, value]);

  Future<void> fromNative(String method, Object? arguments) async {
    final data = const StandardMethodCodec()
        .encodeMethodCall(MethodCall(method, arguments));
    await messenger.handlePlatformMessage(
        'clevertap_plugin/native_to_dart', data, (_) {});
  }

  Map<String, Object?> envelope(Object? payload,
          {String? accountId = 'DEF', bool isDefault = true}) =>
      {
        '__ctEnvelope': true,
        'accountId': accountId,
        'isDefault': isDefault,
        'payload': payload,
      };

  // Every event the plugin handles, with a payload of the shape native sends today, and the value
  // the handler is expected to receive.
  final inApp = {'wzrk_id': 'campaign-1', 'title': 'Hello'};
  final cases = <String, List<Object?>>{
    // method: [payload sent by native, value the handler should receive]
    'inAppNotificationDismissed': [inApp, inApp],
    'inAppNotificationShow': [inApp, inApp],
    'onInAppButtonClick': [
      {'button': 'ok'},
      {'button': 'ok'}
    ],
    'profileDidInitialize': ['ct-id-123', 'called'],
    // The iOS SDK's shape (CleverTapSyncDelegate.h); the Android SDK no longer calls this listener
    // (removed in Android core 7.0.0). Before the cast fix the handler never ran (TypeError).
    'profileDataUpdated': [
      {
        'profile': {
          'Name': {'oldValue': 'Jo', 'newValue': 'Jane'}
        }
      },
      {
        'profile': {
          'Name': {'oldValue': 'Jo', 'newValue': 'Jane'}
        }
      }
    ],
    'inboxDidInitialize': [null, 'called'],
    'inboxMessagesDidUpdate': [null, 'called'],
    'onInboxButtonClick': [
      {'key': 'v'},
      {'key': 'v'}
    ],
    'onInboxMessageClick': [
      {
        'data': {'id': 'm1'},
        'contentPageIndex': 2,
        'buttonIndex': 1
      },
      [
        {'id': 'm1'},
        2,
        1
      ]
    ],
    'onDisplayUnitsLoaded': [
      [
        {'wzrk_id': 'u1'}
      ],
      [
        {'wzrk_id': 'u1'}
      ]
    ],
    'featureFlagsUpdated': [null, 'called'],
    'productConfigInitialized': [null, 'called'],
    'productConfigFetched': [null, 'called'],
    'productConfigActivated': [null, 'called'],
    'pushAmpPayloadReceived': [
      {'wzrk_pn': 'true'},
      {'wzrk_pn': 'true'}
    ],
    'pushClickedPayloadReceived': [
      // An app-defined push payload that uses the envelope's own key names: must stay intact.
      {'accountId': 'not-an-envelope', 'payload': 'x', 'wzrk_acct_id': 'DEF'},
      {'accountId': 'not-an-envelope', 'payload': 'x', 'wzrk_acct_id': 'DEF'}
    ],
    'pushPermissionResponseReceived': [true, true],
    'onVariablesChanged': [
      {'v': 1},
      {'v': 1}
    ],
    'onOneTimeVariablesChanged': [
      {'v': 2},
      {'v': 2}
    ],
    'onValueChanged': [
      {'v': 3},
      {'v': 3}
    ],
    'onVariablesChangedAndNoDownloadsPending': [
      {'v': 4},
      {'v': 4}
    ],
    'onceVariablesChangedAndNoDownloadsPending': [
      {'v': 5},
      {'v': 5}
    ],
    'onFileValueChanged': [
      {'f': '/path'},
      {'f': '/path'}
    ],
    'customTemplatePresent': ['Promo', 'Promo'],
    'customFunctionPresent': ['Fn', 'Fn'],
    'customTemplateClose': ['Promo', 'Promo'],
  };

  setUpAll(() {
    // Native side of Dart-to-native calls (setLibrary, handler registrations): answer success.
    messenger.setMockMethodCallHandler(dartToNative, (call) async => null);
    final plugin = CleverTapPlugin();
    plugin.setCleverTapInAppNotificationDismissedHandler(
        (m) => record('inAppNotificationDismissed', m));
    plugin.setCleverTapInAppNotificationShowHandler(
        (m) => record('inAppNotificationShow', m));
    plugin.setCleverTapInAppNotificationButtonClickedHandler(
        (m) => record('onInAppButtonClick', m));
    plugin.setCleverTapProfileDidInitializeHandler(
        () => record('profileDidInitialize', 'called'));
    plugin
        .setCleverTapProfileSyncHandler((m) => record('profileDataUpdated', m));
    plugin.setCleverTapInboxDidInitializeHandler(
        () => record('inboxDidInitialize', 'called'));
    plugin.setCleverTapInboxMessagesDidUpdateHandler(
        () => record('inboxMessagesDidUpdate', 'called'));
    plugin.setCleverTapInboxNotificationButtonClickedHandler(
        (m) => record('onInboxButtonClick', m));
    plugin.setCleverTapInboxNotificationMessageClickedHandler(
        (m, i, b) => record('onInboxMessageClick', [m, i, b]));
    plugin.setCleverTapDisplayUnitsLoadedHandler(
        (l) => record('onDisplayUnitsLoaded', l));
    plugin.setCleverTapFeatureFlagUpdatedHandler(
        () => record('featureFlagsUpdated', 'called'));
    plugin.setCleverTapProductConfigInitializedHandler(
        () => record('productConfigInitialized', 'called'));
    plugin.setCleverTapProductConfigFetchedHandler(
        () => record('productConfigFetched', 'called'));
    plugin.setCleverTapProductConfigActivatedHandler(
        () => record('productConfigActivated', 'called'));
    plugin.setCleverTapPushAmpPayloadReceivedHandler(
        (m) => record('pushAmpPayloadReceived', m));
    plugin.setCleverTapPushClickedPayloadReceivedHandler(
        (m) => record('pushClickedPayloadReceived', m));
    plugin.setCleverTapPushPermissionResponseReceivedHandler(
        (b) => record('pushPermissionResponseReceived', b));
    CleverTapPlugin.onVariablesChanged((m) => record('onVariablesChanged', m));
    CleverTapPlugin.onOneTimeVariablesChanged(
        (m) => record('onOneTimeVariablesChanged', m));
    CleverTapPlugin.onValueChanged('v', (m) => record('onValueChanged', m));
    CleverTapPlugin.onVariablesChangedAndNoDownloadsPending(
        (m) => record('onVariablesChangedAndNoDownloadsPending', m));
    CleverTapPlugin.onceVariablesChangedAndNoDownloadsPending(
        (m) => record('onceVariablesChangedAndNoDownloadsPending', m));
    CleverTapPlugin.onFileValueChanged(
        'f', (m) => record('onFileValueChanged', m));
    plugin.setCleverTapCustomTemplatePresentHandler(
        (n) => record('customTemplatePresent', n));
    plugin.setCleverTapCustomFunctionPresentHandler(
        (n) => record('customFunctionPresent', n));
    plugin.setCleverTapCustomTemplateCloseHandler(
        (n) => record('customTemplateClose', n));
  });

  setUp(() => received.clear());

  test('all 26 events are covered', () {
    expect(cases.length, 26);
  });

  for (final entry in cases.entries) {
    final method = entry.key;
    final payload = entry.value[0];
    final expected = entry.value[1];

    test(
        '$method: default-account envelope reaches the static handler unchanged',
        () async {
      await fromNative(method, envelope(payload));
      expect(
          received,
          expected == null
              ? isEmpty
              : [
                  [method, expected]
                ]);
    });

    test(
        '$method: unknown-account envelope (accountId null) is treated as default',
        () async {
      await fromNative(method, envelope(payload, accountId: null));
      expect(
          received,
          expected == null
              ? isEmpty
              : [
                  [method, expected]
                ]);
    });

    test(
        '$method: another account\'s envelope does not reach the static handler',
        () async {
      await fromNative(
          method, envelope(payload, accountId: 'B', isDefault: false));
      expect(received, isEmpty);
    });

    test(
        '$method: a value without the envelope still reaches the static handler',
        () async {
      await fromNative(method, payload);
      expect(
          received,
          expected == null
              ? isEmpty
              : [
                  [method, expected]
                ]);
    });
  }
}
