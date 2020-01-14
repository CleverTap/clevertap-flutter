import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:clevertap_plugin/clevertap_plugin.dart';

void main() {
  const MethodChannel channel = MethodChannel('clevertap_plugin');

  setUp(() {
    channel.setMockMethodCallHandler((MethodCall methodCall) async {
      return '42';
    });
  });

  tearDown(() {
    channel.setMockMethodCallHandler(null);
  });

//  test('getPlatformVersion', () async {
//    expect(await CleverTapPlugin.platformVersion, '42');
//  });

}
