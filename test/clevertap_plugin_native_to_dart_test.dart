import 'dart:async';

import 'package:clevertap_plugin/clevertap_plugin.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

/// Tests for the native -> Dart direction: the events the Android and iOS
/// plugins send to Dart on `clevertap_plugin/native_to_dart`.
///
/// Every event here goes through the real [StandardMethodCodec], exactly as it
/// does in an app. That matters: after decoding, a map is a
/// `Map<Object?, Object?>`, not a `Map<String, dynamic>`, and the plugin has to
/// cast it before it calls the app's handler.
///
/// The payloads copy what the native plugins really send
/// (`CleverTapListenerProxy.kt` on Android, `CleverTapPlugin.m` on iOS).
/// Native code and the native SDKs are not run.
void main() {
  final binding = TestWidgetsFlutterBinding.ensureInitialized();
  const codec = StandardMethodCodec();
  const nativeToDart = 'clevertap_plugin/native_to_dart';
  const dartToNative = MethodChannel('clevertap_plugin/dart_to_native');

  /// Delivers [method] to the plugin the way the native side does and returns
  /// what the plugin sends back. Throws a [PlatformException] if the plugin's
  /// handler threw, because the engine reports that to native as an error.
  Future<dynamic> fromNative(String method, [dynamic arguments]) async {
    final message = codec.encodeMethodCall(MethodCall(method, arguments));
    final reply = Completer<ByteData?>();
    binding.defaultBinaryMessenger.handlePlatformMessage(
      nativeToDart,
      message,
      reply.complete,
    );
    final bytes = await reply.future;
    return bytes == null ? null : codec.decodeEnvelope(bytes);
  }

  /// One entry per handler call: which handler, and what it was given.
  final calls = <_Call>[];
  dynamic Function(MethodCall call)? dartToNativeResponder;

  void clearVariableHandlers() {
    CleverTapPlugin.cleverTapOnVariablesChangedHandlers.clear();
    CleverTapPlugin.cleverTapOnOneTimeVariablesChangedHandlers.clear();
    CleverTapPlugin.cleverTapOnValueChangedHandlers.clear();
    CleverTapPlugin.cleverTapOnVariablesChangedAndNoDownloadsPendingHandlers
        .clear();
    CleverTapPlugin.cleverTapOnceVariablesChangedAndNoDownloadsPendingHandlers
        .clear();
    CleverTapPlugin.cleverTapOnFileValueChangedHandlers.clear();
  }

  setUp(() {
    calls.clear();
    dartToNativeResponder = null;
    binding.defaultBinaryMessenger.setMockMethodCallHandler(
      dartToNative,
      (MethodCall call) async => dartToNativeResponder?.call(call),
    );
    clearVariableHandlers();

    // Register one handler for every event. Each handler records its own name,
    // so a test can check that an event reached exactly the right handler.
    final plugin = CleverTapPlugin();
    plugin.setCleverTapInAppNotificationDismissedHandler(
      (m) => calls.add(_Call('inAppDismissed', [m])),
    );
    plugin.setCleverTapInAppNotificationShowHandler(
      (m) => calls.add(_Call('inAppShow', [m])),
    );
    plugin.setCleverTapInAppNotificationButtonClickedHandler(
      (m) => calls.add(_Call('inAppButtonClick', [m])),
    );
    plugin.setCleverTapProfileDidInitializeHandler(
      () => calls.add(_Call('profileDidInitialize', [])),
    );
    plugin.setCleverTapProfileSyncHandler(
      (m) => calls.add(_Call('profileSync', [m])),
    );
    plugin.setCleverTapInboxDidInitializeHandler(
      () => calls.add(_Call('inboxDidInitialize', [])),
    );
    plugin.setCleverTapInboxMessagesDidUpdateHandler(
      () => calls.add(_Call('inboxMessagesDidUpdate', [])),
    );
    plugin.setCleverTapInboxNotificationButtonClickedHandler(
      (m) => calls.add(_Call('inboxButtonClick', [m])),
    );
    plugin.setCleverTapInboxNotificationMessageClickedHandler(
      (message, index, buttonIndex) =>
          calls.add(_Call('inboxMessageClick', [message, index, buttonIndex])),
    );
    plugin.setCleverTapDisplayUnitsLoadedHandler(
      (units) => calls.add(_Call('displayUnitsLoaded', [units])),
    );
    plugin.setCleverTapFeatureFlagUpdatedHandler(
      () => calls.add(_Call('featureFlagsUpdated', [])),
    );
    plugin.setCleverTapProductConfigInitializedHandler(
      () => calls.add(_Call('productConfigInitialized', [])),
    );
    plugin.setCleverTapProductConfigFetchedHandler(
      () => calls.add(_Call('productConfigFetched', [])),
    );
    plugin.setCleverTapProductConfigActivatedHandler(
      () => calls.add(_Call('productConfigActivated', [])),
    );
    plugin.setCleverTapPushAmpPayloadReceivedHandler(
      (m) => calls.add(_Call('pushAmpPayload', [m])),
    );
    plugin.setCleverTapPushClickedPayloadReceivedHandler(
      (m) => calls.add(_Call('pushClickedPayload', [m])),
    );
    plugin.setCleverTapPushPermissionResponseReceivedHandler(
      (accepted) => calls.add(_Call('pushPermissionResponse', [accepted])),
    );
    plugin.setCleverTapCustomTemplatePresentHandler(
      (name) => calls.add(_Call('customTemplatePresent', [name])),
    );
    plugin.setCleverTapCustomFunctionPresentHandler(
      (name) => calls.add(_Call('customFunctionPresent', [name])),
    );
    plugin.setCleverTapCustomTemplateCloseHandler(
      (name) => calls.add(_Call('customTemplateClose', [name])),
    );
  });

  tearDown(() {
    clearVariableHandlers();
    binding.defaultBinaryMessenger.setMockMethodCallHandler(dartToNative, null);
  });

  List<String> handlersCalled() => calls.map((c) => c.handler).toList();

  group('events that carry a map reach the right handler, cast for Dart', () {
    final cases = <_MapEvent>[
      _MapEvent(
        'Android in-app shown: the in-app JSON as a map',
        'inAppNotificationShow',
        'inAppShow',
        {
          'wzrk_id': '1700000000_20261126',
          'type': 'interstitial',
          'ti': 1700000000,
          'kv': {'campaign': 'sale', 'discount': 20},
        },
      ),
      _MapEvent(
        'Android in-app dismissed: extras can be null',
        'inAppNotificationDismissed',
        'inAppDismissed',
        {
          'extras': {'wzrk_id': '1700000000_20261126'},
          'actionExtras': null,
        },
      ),
      _MapEvent(
        'iOS in-app dismissed: empty maps instead of null',
        'inAppNotificationDismissed',
        'inAppDismissed',
        {'extras': <String, dynamic>{}, 'actionExtras': <String, dynamic>{}},
      ),
      _MapEvent(
        'in-app button click',
        'onInAppButtonClick',
        'inAppButtonClick',
        {'key1': 'value1', 'key2': 'value2'},
      ),
      _MapEvent(
        'inbox button click',
        'onInboxButtonClick',
        'inboxButtonClick',
        {'url': 'https://example.com', 'type': 'url'},
      ),
      _MapEvent(
        'push amplification payload',
        'pushAmpPayloadReceived',
        'pushAmpPayload',
        {'wzrk_pn': 'true', 'wzrk_id': '1700000000_20261126', 'nm': 'Hello'},
      ),
      _MapEvent(
        'push clicked payload with mixed value types',
        'pushClickedPayloadReceived',
        'pushClickedPayload',
        {
          'wzrk_pn': 'true',
          'wzrk_c2a': 'open',
          'count': 3,
          'amount': 9.5,
          'vip': true,
        },
      ),
    ];

    for (final c in cases) {
      test(c.description, () async {
        await fromNative(c.event, c.payload);

        expect(
          handlersCalled(),
          [c.handler],
          reason: '${c.event} must reach only the ${c.handler} handler',
        );
        final received = calls.single.args.single;
        expect(
          received,
          isA<Map<String, dynamic>>(),
          reason: 'the app handler is typed Map<String, dynamic>',
        );
        expect(received, c.payload);
      });
    }
  });

  group('profile', () {
    test(
      'profileDidInitialize fires the handler for Android and iOS payloads',
      () async {
        // Android sends the CleverTap ID as a string, iOS sends a map.
        await fromNative('profileDidInitialize', '__g1a2b3c');
        await fromNative('profileDidInitialize', {'CleverTapID': '__g1a2b3c'});

        expect(handlersCalled(), [
          'profileDidInitialize',
          'profileDidInitialize',
        ]);
      },
    );
  });

  group('events with no payload fire exactly their own handler', () {
    const events = <String, String>{
      'inboxDidInitialize': 'inboxDidInitialize',
      'inboxMessagesDidUpdate': 'inboxMessagesDidUpdate',
      'featureFlagsUpdated': 'featureFlagsUpdated',
      'productConfigInitialized': 'productConfigInitialized',
      'productConfigFetched': 'productConfigFetched',
      'productConfigActivated': 'productConfigActivated',
    };

    events.forEach((event, handler) {
      test(event, () async {
        // Android emits these with null params.
        await fromNative(event);

        expect(handlersCalled(), [handler]);
      });
    });
  });

  group('inbox message click', () {
    test('passes the message, content page index and button index', () async {
      // Shape from CleverTapListenerProxy.onInboxItemClicked (Android) and
      // inboxMessageTappedAtIndex (iOS).
      final message = {
        'id': '1700000000_1',
        'isRead': false,
        'msg': {
          'content': [
            {
              'title': {'text': 'Hi'},
            },
          ],
        },
      };

      await fromNative('onInboxMessageClick', {
        'data': message,
        'contentPageIndex': 0,
        'buttonIndex': 2,
      });

      expect(handlersCalled(), ['inboxMessageClick']);
      final args = calls.single.args;
      expect(args[0], isA<Map<String, dynamic>>());
      expect(args[0], message);
      expect(args[1], 0, reason: 'contentPageIndex');
      expect(args[2], 2, reason: 'buttonIndex');
    });

    test('keeps -1 as the index for a click on the message itself', () async {
      await fromNative('onInboxMessageClick', {
        'data': <String, dynamic>{'id': 'm1'},
        'contentPageIndex': 0,
        'buttonIndex': -1,
      });

      expect(calls.single.args[2], -1);
    });
  });

  group('display units', () {
    test('passes the list of units', () async {
      final units = [
        {'wzrk_id': 'u1', 'type': 'simple'},
        {'wzrk_id': 'u2', 'type': 'carousel'},
      ];

      await fromNative('onDisplayUnitsLoaded', units);

      expect(handlersCalled(), ['displayUnitsLoaded']);
      expect(calls.single.args.single, units);
    });

    test('passes null through when no units are available', () async {
      // The handler type is List<dynamic>?, so null is a valid payload.
      await fromNative('onDisplayUnitsLoaded');

      expect(handlersCalled(), ['displayUnitsLoaded']);
      expect(calls.single.args.single, isNull);
    });
  });

  group('push permission', () {
    test('passes true and false to the handler as bool', () async {
      await fromNative('pushPermissionResponseReceived', true);
      await fromNative('pushPermissionResponseReceived', false);

      expect(handlersCalled(), [
        'pushPermissionResponse',
        'pushPermissionResponse',
      ]);
      expect(calls.map((c) => c.args.single).toList(), [true, false]);
    });
  });

  group('custom templates', () {
    const events = <String, String>{
      'customTemplatePresent': 'customTemplatePresent',
      'customFunctionPresent': 'customFunctionPresent',
      'customTemplateClose': 'customTemplateClose',
    };

    events.forEach((event, handler) {
      test('$event passes the template name to its own handler', () async {
        await fromNative(event, 'my-template');

        expect(handlersCalled(), [handler]);
        expect(calls.single.args.single, 'my-template');
      });
    });
  });

  group('variables', () {
    // Types that matter: a double, a number above 2^31 (arrives on the Dart
    // side as a 64-bit int), a bool, a string and a nested structure.
    final variables = {
      'price': 9.99,
      'limit': 5000000000,
      'enabled': true,
      'title': 'Sale',
      'theme': {
        'colors': ['red', 'blue'],
      },
    };

    void registerAll() {
      CleverTapPlugin.onVariablesChanged(
        (v) => calls.add(_Call('onVariablesChanged', [v])),
      );
      CleverTapPlugin.onOneTimeVariablesChanged(
        (v) => calls.add(_Call('onOneTimeVariablesChanged', [v])),
      );
      CleverTapPlugin.onValueChanged(
        'price',
        (v) => calls.add(_Call('onValueChanged', [v])),
      );
      CleverTapPlugin.onVariablesChangedAndNoDownloadsPending(
        (v) => calls.add(_Call('onVariablesChangedAndNoDownloadsPending', [v])),
      );
      CleverTapPlugin.onceVariablesChangedAndNoDownloadsPending(
        (v) =>
            calls.add(_Call('onceVariablesChangedAndNoDownloadsPending', [v])),
      );
      CleverTapPlugin.onFileValueChanged(
        'banner',
        (v) => calls.add(_Call('onFileValueChanged', [v])),
      );
    }

    const events = <String>[
      'onVariablesChanged',
      'onOneTimeVariablesChanged',
      'onValueChanged',
      'onVariablesChangedAndNoDownloadsPending',
      'onceVariablesChangedAndNoDownloadsPending',
      'onFileValueChanged',
    ];

    for (final event in events) {
      test('$event reaches only its own handler with values intact', () async {
        registerAll();

        await fromNative(event, variables);

        expect(handlersCalled(), [event]);
        final received = calls.single.args.single;
        expect(received, isA<Map<String, dynamic>>());
        expect(received, variables);
        expect(
          received['limit'],
          5000000000,
          reason: 'a number above 2^31 must not be truncated',
        );
      });
    }

    test('every listener registered for an event is called', () async {
      CleverTapPlugin.onVariablesChanged((v) => calls.add(_Call('first', [v])));
      CleverTapPlugin.onVariablesChanged(
        (v) => calls.add(_Call('second', [v])),
      );

      await fromNative('onVariablesChanged', variables);

      expect(handlersCalled(), ['first', 'second']);
    });

    test(
      'an event with no listener registered is ignored without error',
      () async {
        // Native can emit before the app registers a listener.
        await fromNative('onVariablesChanged', variables);

        expect(calls, isEmpty);
      },
    );
  });

  group('robustness', () {
    test(
      'an event name this plugin version does not know is ignored',
      () async {
        // A newer native plugin can emit an event an older Dart side lacks.
        final result = await fromNative('someFutureEvent', {'a': 1});

        expect(result, isNull);
        expect(calls, isEmpty);
      },
    );
  });

  group('getAppLaunchNotification', () {
    test('app launched from a notification: flag and payload', () async {
      dartToNativeResponder = (call) => {
        'notificationLaunchedApp': true,
        'notificationPayload': {'wzrk_pn': 'true', 'wzrk_id': '17_1'},
      };

      final result = await CleverTapPlugin.getAppLaunchNotification();

      expect(result.didNotificationLaunchApp, isTrue);
      expect(result.payload, isA<Map<String, dynamic>>());
      expect(result.payload, {'wzrk_pn': 'true', 'wzrk_id': '17_1'});
    });

    test('app not launched from a notification: no payload', () async {
      dartToNativeResponder = (call) => {'notificationLaunchedApp': false};

      final result = await CleverTapPlugin.getAppLaunchNotification();

      expect(result.didNotificationLaunchApp, isFalse);
      expect(result.payload, isNull);
    });
  });
}

class _Call {
  _Call(this.handler, this.args);

  final String handler;
  final List<dynamic> args;
}

class _MapEvent {
  _MapEvent(this.description, this.event, this.handler, this.payload);

  final String description;
  final String event;
  final String handler;
  final Map<String, dynamic> payload;
}
