/// Contains details on the notification that launched the application.
class CleverTapAppLaunchNotification {
  /// True, if the app was launched via notification otherwise false.
  late bool didNotificationLaunchApp;

  /// Contains a Map of the notification that launched the app.
  late Map<String, dynamic>? payload;

  CleverTapAppLaunchNotification.fromMap(Map resultMap) {
    didNotificationLaunchApp = resultMap['notificationLaunchedApp'];
    payload = resultMap.containsKey('notificationPayload')
        ? Map<String, dynamic>.from(resultMap['notificationPayload'])
        : null;
  }

  @override
  String toString() {
    return 'CleverTapAppLaunchNotification{didNotificationLaunchApp: $didNotificationLaunchApp, payload: $payload}';
  }
}
