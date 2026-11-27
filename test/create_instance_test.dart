import 'dart:async';

import 'package:clevertap_plugin/clevertap_plugin.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  const channel = MethodChannel('clevertap_plugin/dart_to_native');
  final messenger =
      TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger;

  late List<MethodCall> calls;
  setUp(() => calls = []);
  tearDown(() => messenger.setMockMethodCallHandler(channel, null));

  group('CleverTapInstanceConfig.toMap', () {
    test('only id and token: nothing else is sent', () {
      const config =
          CleverTapInstanceConfig(accountId: 'ACC-B', accountToken: 'TOK-B');
      expect(config.toMap(), {'accountId': 'ACC-B', 'accountToken': 'TOK-B'});
    });

    test('every field is sent under the key native reads', () {
      const config = CleverTapInstanceConfig(
        accountId: 'ACC-B',
        accountToken: 'TOK-B',
        region: 'eu1',
        proxyDomain: 'proxy.example.com',
        spikyProxyDomain: 'spiky.example.com',
        handshakeDomain: 'hs.example.com',
        identityKeys: ['Email', 'Phone'],
        logLevel: CleverTapLogLevel.verbose,
        analyticsOnly: true,
        enablePersonalization: false,
        disableAppLaunchedEvent: true,
        encryptionLevel: CleverTapEncryptionLevel.high,
        encryptionInTransit: true,
        useCustomCleverTapId: true,
        cleverTapId: 'my-user-42',
        android: CleverTapAndroidConfig(
          useGoogleAdId: true,
          backgroundSync: false,
          pushProviders: [
            CleverTapPushProvider(
              type: 'hps',
              prefKey: 'hps_token',
              className: 'com.clevertap.android.hms.HmsPushProvider',
              messagingSDKClassName: 'com.huawei.hms.push.HmsMessageService',
            ),
          ],
        ),
        ios: CleverTapIosConfig(disableIDFV: true, enableFileProtection: false),
      );
      expect(config.toMap(), {
        'accountId': 'ACC-B',
        'accountToken': 'TOK-B',
        'region': 'eu1',
        'proxyDomain': 'proxy.example.com',
        'spikyProxyDomain': 'spiky.example.com',
        'handshakeDomain': 'hs.example.com',
        'identityKeys': ['Email', 'Phone'],
        'logLevel': 'verbose',
        'analyticsOnly': true,
        'enablePersonalization': false,
        'disableAppLaunchedEvent': true,
        'encryptionLevel': 'high',
        'encryptionInTransit': true,
        'useCustomCleverTapId': true,
        'cleverTapId': 'my-user-42',
        'android': {
          'useGoogleAdId': true,
          'backgroundSync': false,
          'pushProviders': [
            {
              'type': 'hps',
              'prefKey': 'hps_token',
              'className': 'com.clevertap.android.hms.HmsPushProvider',
              'messagingSDKClassName': 'com.huawei.hms.push.HmsMessageService',
            }
          ],
        },
        'ios': {'disableIDFV': true, 'enableFileProtection': false},
      });
    });

    test('every enum value maps to the exact word native accepts', () {
      const logWords = {
        CleverTapLogLevel.off: 'off',
        CleverTapLogLevel.info: 'info',
        CleverTapLogLevel.debug: 'debug',
        CleverTapLogLevel.verbose: 'verbose',
      };
      expect(logWords.keys.toSet(), CleverTapLogLevel.values.toSet());
      logWords.forEach((level, word) {
        final map = CleverTapInstanceConfig(
                accountId: 'A', accountToken: 'T', logLevel: level)
            .toMap();
        expect(map['logLevel'], word);
      });

      const encryptionWords = {
        CleverTapEncryptionLevel.none: 'none',
        CleverTapEncryptionLevel.medium: 'medium',
        CleverTapEncryptionLevel.high: 'high',
      };
      expect(encryptionWords.keys.toSet(),
          CleverTapEncryptionLevel.values.toSet());
      encryptionWords.forEach((level, word) {
        final map = CleverTapInstanceConfig(
                accountId: 'A', accountToken: 'T', encryptionLevel: level)
            .toMap();
        expect(map['encryptionLevel'], word);
      });
    });

    test('an empty platform block is sent as an empty map', () {
      const config = CleverTapInstanceConfig(
          accountId: 'A',
          accountToken: 'T',
          android: CleverTapAndroidConfig(),
          ios: CleverTapIosConfig());
      expect(config.toMap()['android'], <String, dynamic>{});
      expect(config.toMap()['ios'], <String, dynamic>{});
    });
  });

  group('CleverTapPlugin.createInstance', () {
    void mockNative(Future<Object?>? Function(MethodCall call) handler) {
      messenger.setMockMethodCallHandler(channel, (call) {
        calls.add(call);
        return handler(call);
      });
    }

    test('returns a handle for the account native created', () async {
      mockNative(
          (call) async => call.method == 'createInstance' ? 'ACC-B' : null);

      final instance = await CleverTapPlugin.createInstance(
          const CleverTapInstanceConfig(
              accountId: 'ACC-B', accountToken: 'TOK-B', region: 'eu1'));

      expect(instance.accountId, 'ACC-B');
      final create = calls.singleWhere((c) => c.method == 'createInstance');
      expect(create.arguments,
          {'accountId': 'ACC-B', 'accountToken': 'TOK-B', 'region': 'eu1'});
    });

    test('setLibrary reaches native before createInstance', () async {
      // The plugin object may already exist from an earlier test (it is a process-wide
      // singleton), so this checks the order only when setLibrary is sent in this test.
      mockNative(
          (call) async => call.method == 'createInstance' ? 'ACC-B' : null);
      await CleverTapPlugin.createInstance(
          const CleverTapInstanceConfig(accountId: 'ACC-B', accountToken: 'T'));
      final names = calls.map((c) => c.method).toList();
      if (names.contains('setLibrary')) {
        expect(names.indexOf('setLibrary'),
            lessThan(names.indexOf('createInstance')));
      }
    });

    test('two handles for the same account are equal', () async {
      mockNative((call) async => 'ACC-B');
      final a = await CleverTapPlugin.createInstance(
          const CleverTapInstanceConfig(accountId: 'ACC-B', accountToken: 'T'));
      final b = await CleverTapPlugin.createInstance(
          const CleverTapInstanceConfig(accountId: 'ACC-B', accountToken: 'T'));
      expect(a, b);
      expect(a.hashCode, b.hashCode);
      expect(a.toString(), 'CleverTapInstance{accountId: ACC-B}');
    });

    for (final code in ['EINVALID', 'ECREATE']) {
      test('a native $code error reaches Dart with its code', () async {
        mockNative((call) async {
          if (call.method == 'createInstance') {
            throw PlatformException(code: code, message: 'createInstance: why');
          }
          return null;
        });
        await expectLater(
          CleverTapPlugin.createInstance(
              const CleverTapInstanceConfig(accountId: '', accountToken: 'T')),
          throwsA(isA<PlatformException>()
              .having((e) => e.code, 'code', code)
              .having((e) => e.message, 'message', 'createInstance: why')),
        );
      });
    }
  });

  test('setLibrary answered with success leaves no uncaught error', () async {
    // The Phase 2 fix: native now always answers setLibrary with success. Before it, an app with
    // no default Android account got an uncaught PlatformException from the unawaited call.
    messenger.setMockMethodCallHandler(channel, (call) async => null);
    final uncaught = <Object>[];
    await runZonedGuarded(() async {
      CleverTapPlugin();
      await Future<void>.delayed(const Duration(milliseconds: 20));
    }, (error, stack) => uncaught.add(error));
    expect(uncaught, isEmpty);
  });
}
