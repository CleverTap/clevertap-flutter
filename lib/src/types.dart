/// Contains details on the notification that launched the application.
class CleverTapAppLaunchNotification {
  /// Constructs an instance of [CleverTapAppLaunchNotification].
  const CleverTapAppLaunchNotification(
    this.didNotificationLaunchApp, {
    this.payload,
  });

  /// True, if the app was launched via notification otherwise false.
  final bool didNotificationLaunchApp;

  /// Contains a Map of the notification that launched the app.
  final Map<String, dynamic>? payload;

  @override
  String toString() {
    return 'CleverTapAppLaunchNotification{didNotificationLaunchApp: $didNotificationLaunchApp, payload: $payload}';
  }
}
