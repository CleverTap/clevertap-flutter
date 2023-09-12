import 'dart:async';

import 'package:clevertap_plugin/src/clevertap_plugin_web_binding.dart';
import 'package:flutter/services.dart';
import 'package:flutter_web_plugins/flutter_web_plugins.dart';

/// A web implementation of the CleverTapPlugin plugin.
class CleverTapPlugin {
  static void registerWith(Registrar registrar) {
    final MethodChannel channel = MethodChannel(
      'clevertap_plugin/dart_to_native',
      const StandardMethodCodec(),
      registrar,
    );

    final pluginInstance = CleverTapPlugin();
    channel.setMethodCallHandler(pluginInstance.handleMethodCall);
  }

  /// Handles method calls over the MethodChannel of this plugin.
  /// Note: Check the "federated" architecture for a new way of doing this:
  /// https://flutter.dev/go/federated-plugins
  Future<dynamic> handleMethodCall(MethodCall call) async {
    switch (call.method) {
      case 'init':
        _init(call);
        break;
      case 'recordEvent':
        _recordEvent(call);
        break;
      default:
        throw PlatformException(
          code: 'Unimplemented',
          details:
              'clevertap_plugin for web doesn\'t implement \'${call.method}\'',
        );
    }
  }

  void _init(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String accountId = args['accountId'] as String;
    String? region = args['region'] as String?;
    String? targetDomain = args['targetDomain'] as String?;
    print("actual call going to happen");
    init(accountId, region, targetDomain);
  }

  /// Pushes a basic event
  void _recordEvent(MethodCall call) {
    Map<Object?, Object?> args = call.arguments as Map<Object?, Object?>;
    String eventName = args['eventName'] as String;
    Object? eventData = args['eventData'];
    event_push(eventName, eventData);
  }
}
