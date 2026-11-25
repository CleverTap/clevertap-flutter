import 'package:clevertap_plugin/clevertap_plugin.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

/// Phase 4: CleverTapInstance handles and their handlers.
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final messenger =
      TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger;
  const dartToNative = MethodChannel('clevertap_plugin/dart_to_native');

  final toNative = <MethodCall>[];
  final received = <List<Object?>>[]; // [who, method, value]

  Future<void> fromNative(String method, Object? arguments) async {
    final data = const StandardMethodCodec()
        .encodeMethodCall(MethodCall(method, arguments));
    await messenger.handlePlatformMessage(
        'clevertap_plugin/native_to_dart', data, (_) {});
  }

  Map<String, Object?> envelope(Object? payload,
          {required String? accountId, required bool isDefault}) =>
      {
        '__ctEnvelope': true,
        'accountId': accountId,
        'isDefault': isDefault,
        'payload': payload,
      };

  // The 20 handle events: [method, payload as native sends it, value the handler receives,
  // native event name armed on Android, setter].
  final inApp = {'wzrk_id': 'c1'};
  final events = <List<Object?>>[
    [
      'profileDidInitialize',
      'ct-id',
      'called',
      'CleverTapProfileDidInitialize',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapProfileDidInitializeHandler(() => r('called'))
    ],
    [
      'profileDataUpdated',
      {
        'profile': {
          'Name': {'newValue': 'Jane'}
        }
      },
      {
        'profile': {
          'Name': {'newValue': 'Jane'}
        }
      },
      'CleverTapProfileSync',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapProfileSyncHandler((m) => r(m))
    ],
    [
      'inAppNotificationDismissed',
      inApp,
      inApp,
      'CleverTapInAppNotificationDismissed',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapInAppNotificationDismissedHandler((m) => r(m))
    ],
    [
      'inAppNotificationShow',
      inApp,
      inApp,
      'CleverTapInAppNotificationShowed',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapInAppNotificationShowHandler((m) => r(m))
    ],
    [
      'onInAppButtonClick',
      {'b': 'ok'},
      {'b': 'ok'},
      'CleverTapInAppNotificationButtonTapped',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapInAppNotificationButtonClickedHandler((m) => r(m))
    ],
    [
      'inboxDidInitialize',
      null,
      'called',
      'CleverTapInboxDidInitialize',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapInboxDidInitializeHandler(() => r('called'))
    ],
    [
      'inboxMessagesDidUpdate',
      null,
      'called',
      'CleverTapInboxMessagesDidUpdate',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapInboxMessagesDidUpdateHandler(() => r('called'))
    ],
    [
      'onInboxButtonClick',
      {'k': 'v'},
      {'k': 'v'},
      'CleverTapInboxMessageButtonTapped',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapInboxNotificationButtonClickedHandler((m) => r(m))
    ],
    [
      'onInboxMessageClick',
      {
        'data': {'id': 'm1'},
        'contentPageIndex': 2,
        'buttonIndex': 1
      },
      [
        {'id': 'm1'},
        2,
        1
      ],
      'CleverTapInboxMessageTapped',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapInboxNotificationMessageClickedHandler(
              (m, i, b) => r([m, i, b]))
    ],
    [
      'onDisplayUnitsLoaded',
      [
        {'u': 1}
      ],
      [
        {'u': 1}
      ],
      'CleverTapDisplayUnitsLoaded',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapDisplayUnitsLoadedHandler((l) => r(l))
    ],
    [
      'featureFlagsUpdated',
      null,
      'called',
      'CleverTapFeatureFlagsDidUpdate',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapFeatureFlagUpdatedHandler(() => r('called'))
    ],
    [
      'productConfigInitialized',
      null,
      'called',
      'CleverTapProductConfigDidInitialize',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapProductConfigInitializedHandler(() => r('called'))
    ],
    [
      'productConfigFetched',
      null,
      'called',
      'CleverTapProductConfigDidFetch',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapProductConfigFetchedHandler(() => r('called'))
    ],
    [
      'productConfigActivated',
      null,
      'called',
      'CleverTapProductConfigDidActivate',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapProductConfigActivatedHandler(() => r('called'))
    ],
    [
      'pushClickedPayloadReceived',
      {'wzrk_acct_id': 'B'},
      {'wzrk_acct_id': 'B'},
      'CleverTapPushNotificationClicked',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapPushClickedPayloadReceivedHandler((m) => r(m))
    ],
    [
      'pushPermissionResponseReceived',
      true,
      true,
      'CleverTapPushPermissionResponseReceived',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapPushPermissionResponseReceivedHandler((b) => r(b))
    ],
    [
      'pushAmpPayloadReceived',
      {'p': '1'},
      {'p': '1'},
      'CleverTapPushAmpPayloadReceived',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapPushAmpPayloadReceivedHandler((m) => r(m))
    ],
    // Phase 7: custom templates. The payload is the bare template name, as for the static handlers.
    [
      'customTemplatePresent',
      'Spin',
      'Spin',
      'CleverTapCustomTemplatePresent',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapCustomTemplatePresentHandler((n) => r(n))
    ],
    [
      'customFunctionPresent',
      'OpenWallet',
      'OpenWallet',
      'CleverTapCustomFunctionPresent',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapCustomFunctionPresentHandler((n) => r(n))
    ],
    [
      'customTemplateClose',
      'Spin',
      'Spin',
      'CleverTapCustomTemplateClose',
      (CleverTapInstance h, void Function(Object?) r) =>
          h.setCleverTapCustomTemplateCloseHandler((n) => r(n))
    ],
  ];

  late CleverTapPlugin plugin;
  setUpAll(() {
    messenger.setMockMethodCallHandler(dartToNative, (call) async {
      toNative.add(call);
      return call.method == 'createInstance' ? 'B' : null;
    });
    plugin = CleverTapPlugin();
  });

  setUp(() {
    received.clear();
    toNative.clear();
  });

  group('getInstance', () {
    test('returns the same object for the same ID, and never calls native', () {
      final a = CleverTapPlugin.getInstance('B');
      final b = CleverTapPlugin.getInstance('B');
      expect(identical(a, b), isTrue);
      expect(a.accountId, 'B');
      expect(identical(a, CleverTapPlugin.getInstance('C')), isFalse);
      expect(toNative, isEmpty);
    });

    test('an empty ID throws ArgumentError', () {
      expect(() => CleverTapPlugin.getInstance(''), throwsArgumentError);
    });

    test('createInstance returns the cached handle', () async {
      final created = await CleverTapPlugin.createInstance(
          const CleverTapInstanceConfig(accountId: 'B', accountToken: 'T'));
      expect(identical(created, CleverTapPlugin.getInstance('B')), isTrue);
    });
  });

  group('routing, all 20 handle events', () {
    for (final e in events) {
      final method = e[0] as String;
      final payload = e[1];
      final expected = e[2];
      final set =
          e[4] as void Function(CleverTapInstance, void Function(Object?));

      test('$method: B\'s event reaches only B\'s handle, unchanged', () async {
        set(CleverTapPlugin.getInstance('B'),
            (v) => received.add(['B', method, v]));
        set(CleverTapPlugin.getInstance('C'),
            (v) => received.add(['C', method, v]));
        await fromNative(
            method, envelope(payload, accountId: 'B', isDefault: false));
        expect(received, [
          ['B', method, expected]
        ]);
      });

      test('$method: the default account\'s event reaches its handle too',
          () async {
        set(CleverTapPlugin.getInstance('DEF'),
            (v) => received.add(['DEF', method, v]));
        set(CleverTapPlugin.getInstance('B'),
            (v) => received.add(['B', method, v]));
        await fromNative(
            method, envelope(payload, accountId: 'DEF', isDefault: true));
        expect(received, [
          ['DEF', method, expected]
        ]);
      });
    }
  });

  test('a default event reaches the static handler AND the default-ID handle',
      () async {
    plugin.setCleverTapProfileSyncHandler((m) => received.add(['static', m]));
    CleverTapPlugin.getInstance('DEF')
        .setCleverTapProfileSyncHandler((m) => received.add(['handle', m]));
    await fromNative('profileDataUpdated',
        envelope({'x': 1}, accountId: 'DEF', isDefault: true));
    expect(received, [
      [
        'handle',
        {'x': 1}
      ],
      [
        'static',
        {'x': 1}
      ],
    ]);
  });

  test('an unknown-account event reaches only the static handler', () async {
    plugin.setCleverTapProfileSyncHandler((m) => received.add(['static', m]));
    CleverTapPlugin.getInstance('DEF')
        .setCleverTapProfileSyncHandler((m) => received.add(['handle', m]));
    await fromNative('profileDataUpdated',
        envelope({'x': 2}, accountId: null, isDefault: true));
    expect(received, [
      [
        'static',
        {'x': 2}
      ],
    ]);
  });

  test('a throwing handle handler does not stop the static handler', () async {
    plugin.setCleverTapProfileSyncHandler((m) => received.add(['static', m]));
    CleverTapPlugin.getInstance('DEF')
        .setCleverTapProfileSyncHandler((m) => throw StateError('app bug'));
    await fromNative('profileDataUpdated',
        envelope({'x': 3}, accountId: 'DEF', isDefault: true));
    expect(received, [
      [
        'static',
        {'x': 3}
      ],
    ]);
  });

  test('setting a handler again replaces it', () async {
    final b = CleverTapPlugin.getInstance('B');
    b.setCleverTapProfileSyncHandler((m) => received.add(['first', m]));
    b.setCleverTapProfileSyncHandler((m) => received.add(['second', m]));
    await fromNative('profileDataUpdated',
        envelope({'x': 4}, accountId: 'B', isDefault: false));
    expect(received, [
      [
        'second',
        {'x': 4}
      ],
    ]);
  });

  test(
      'a handle handler does not receive another account\'s events after it is set (no replay)',
      () async {
    await fromNative('profileDataUpdated',
        envelope({'early': true}, accountId: 'LATE', isDefault: false));
    CleverTapPlugin.getInstance('LATE')
        .setCleverTapProfileSyncHandler((m) => received.add(['LATE', m]));
    expect(received, isEmpty,
        reason: 'standard observer behavior: earlier events are not replayed');
  });

  group('Android arms the native buffer for the handle\'s account', () {
    tearDown(() => debugDefaultTargetPlatformOverride = null);

    test('every setter sends startEmission {event, accountId}', () {
      debugDefaultTargetPlatformOverride = TargetPlatform.android;
      final b = CleverTapPlugin.getInstance('B');
      for (final e in events) {
        (e[4] as void Function(CleverTapInstance, void Function(Object?)))(
            b, (_) {});
      }
      expect(
        toNative.map((c) => [c.method, c.arguments]).toList(),
        events
            .map((e) => [
                  'startEmission',
                  {'event': e[3], 'accountId': 'B'}
                ])
            .toList(),
      );
    });

    test(
        'the static setters still send the plain event name (the default account)',
        () {
      debugDefaultTargetPlatformOverride = TargetPlatform.android;
      plugin.setCleverTapProfileDidInitializeHandler(() {});
      expect(toNative.single.method, 'startEmission');
      expect(toNative.single.arguments, 'CleverTapProfileDidInitialize');
    });

    test('iOS sends nothing (it has no native buffer)', () {
      debugDefaultTargetPlatformOverride = TargetPlatform.iOS;
      CleverTapPlugin.getInstance('B')
          .setCleverTapProfileDidInitializeHandler(() {});
      plugin.setCleverTapProfileDidInitializeHandler(() {});
      expect(toNative, isEmpty);
    });
  });

  group('Phase 5: methods on a handle', () {
    tearDown(
        () => messenger.setMockMethodCallHandler(dartToNative, (call) async {
              toNative.add(call);
              return call.method == 'createInstance' ? 'B' : null;
            }));

    test('each method sends the static method\'s arguments plus accountId',
        () async {
      final b = CleverTapPlugin.getInstance('B');
      await b.recordEvent('Purchase', {'amount': 10});
      await b.onUserLogin({'Identity': 'u1'});
      await b.profileSet({'Plan': 'gold'});
      await b.getCleverTapID();
      await CleverTapPlugin.recordEvent('Purchase', {'amount': 10});
      await CleverTapPlugin.onUserLogin({'Identity': 'u1'});
      await CleverTapPlugin.profileSet({'Plan': 'gold'});
      await CleverTapPlugin.getCleverTapID();
      expect(toNative.map((c) => [c.method, c.arguments]).toList(), [
        [
          'recordEvent',
          {
            'eventName': 'Purchase',
            'eventData': {'amount': 10},
            'accountId': 'B'
          }
        ],
        [
          'onUserLogin',
          {
            'profile': {'Identity': 'u1'},
            'accountId': 'B'
          }
        ],
        [
          'profileSet',
          {
            'profile': {'Plan': 'gold'},
            'accountId': 'B'
          }
        ],
        [
          'getCleverTapID',
          {'accountId': 'B'}
        ],
        // The static methods are unchanged: no accountId, so native uses the default account.
        [
          'recordEvent',
          {
            'eventName': 'Purchase',
            'eventData': {'amount': 10}
          }
        ],
        [
          'onUserLogin',
          {
            'profile': {'Identity': 'u1'}
          }
        ],
        [
          'profileSet',
          {
            'profile': {'Plan': 'gold'}
          }
        ],
        ['getCleverTapID', {}],
      ]);
    });

    test('getCleverTapID returns the account\'s ID from native', () async {
      messenger.setMockMethodCallHandler(
          dartToNative,
          (call) async => call.method == 'getCleverTapID'
              ? 'id-of-${call.arguments['accountId']}'
              : null);
      expect(
          await CleverTapPlugin.getInstance('B').getCleverTapID(), 'id-of-B');
    });

    test('an unknown account: a void call completes, a value call throws',
        () async {
      messenger.setMockMethodCallHandler(dartToNative, (call) async {
        // What native answers for an account it does not have (Q5.1).
        if (call.method == 'getCleverTapID') {
          throw PlatformException(
              code: 'DartToNative',
              message: 'CleverTap instance not found for accountId: TYPO');
        }
        return null;
      });
      final typo = CleverTapPlugin.getInstance('TYPO');
      await typo.recordEvent('X', {}); // completes normally
      await expectLater(
        typo.getCleverTapID(),
        throwsA(isA<PlatformException>().having((e) => e.message, 'message',
            'CleverTap instance not found for accountId: TYPO')),
      );
    });
  });
}
