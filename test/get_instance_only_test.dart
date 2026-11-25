import 'package:clevertap_plugin/clevertap_plugin.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

/// An app that only uses getInstance: account B is a launch config (created in native code at app
/// start), and the app never calls CleverTapPlugin() or createInstance. This file must never
/// construct CleverTapPlugin itself: each test file runs in its own isolate, so this isolate starts
/// exactly like such an app.
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final messenger =
      TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger;
  const dartToNative = MethodChannel('clevertap_plugin/dart_to_native');
  final toNative = <MethodCall>[];

  setUpAll(() {
    messenger.setMockMethodCallHandler(dartToNative, (call) async {
      toNative.add(call);
      return null;
    });
  });

  Future<void> fromNative(String method, Object? arguments) async {
    final data = const StandardMethodCodec()
        .encodeMethodCall(MethodCall(method, arguments));
    await messenger.handlePlatformMessage(
        'clevertap_plugin/native_to_dart', data, (_) {});
  }

  test('a handle from getInstance receives its account\'s events', () async {
    final received = <String>[];
    CleverTapPlugin.getInstance('INS-111')
        .setCleverTapProfileDidInitializeHandler(() => received.add('B ready'));

    await fromNative('profileDidInitialize', {
      '__ctEnvelope': true,
      'accountId': 'INS-111',
      'isDefault': false,
      'payload': {'CleverTapID': 'ct-b'},
    });

    expect(received, ['B ready']);
  });

  test('getInstance sends setLibrary, so the account reports the Flutter version', () {
    CleverTapPlugin.getInstance('INS-111');
    expect(toNative.where((c) => c.method == 'setLibrary'), isNotEmpty);
  });
}
