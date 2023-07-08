// This is the entrypoint for the background isolate. Since we can only enter
// an isolate once, we setup a MethodChannel to listen for method invocations
// from the native portion of the plugin. This allows for the plugin to perform
// any necessary processing in Dart (e.g., populating a custom object) before
// invoking the provided callback.
import 'dart:ui';

import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart';

@pragma('vm:entry-point')
void callbackDispatcher() {
  // Initialize state necessary for MethodChannels.
  WidgetsFlutterBinding.ensureInitialized();

  const MethodChannel _channel = MethodChannel(
    'clevertap_plugin/background_isolate_channel',
  );

  // This is where we handle background events from the native portion of the plugin.
  _channel.setMethodCallHandler((MethodCall call) async {
    if (call.method == 'onKilledNotificationClicked') {
      final CallbackHandle handle =
      CallbackHandle.fromRawHandle(call.arguments['userCallbackHandle']);

      // PluginUtilities.getCallbackFromHandle performs a lookup based on the
      // callback handle and returns a tear-off of the original callback.
      Function? callback = PluginUtilities.getCallbackFromHandle(handle);

      try {
        Map<String, dynamic> notificationClickedPayload = call.arguments['payload'];
        callback!(notificationClickedPayload);
      } catch (e) {
        debugPrint(
            'CleverTapPlugin: An error occurred in your background messaging handler:');
        debugPrint(e.toString());
      }
    } else {
      throw UnimplementedError('${call.method} has not been implemented');
    }
  });
}