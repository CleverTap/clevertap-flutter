##  🔖 Overview

Push Primer allows you to enable runtime push permission for sending notifications from an app.

Starting with the v1.6.0 release, CleverTap Flutter SDK supports Push primer for push notification runtime permission through local in-app.

For Push Primer, minimum supported version for iOS platform is 10.0 while android 13 for the android platform.

### Push Primer using Half-Interstitial local In-app
```Dart
var pushPrimerJSON = {
  'inAppType': 'half-interstitial',
  'titleText': 'Get Notified',
  'messageText': 'Please enable notifications on your device to use Push Notifications.',
  'followDeviceOrientation': false,
  'positiveBtnText': 'Allow',
  'negativeBtnText': 'Cancel',
  'fallbackToSettings': true,
  'backgroundColor': '#FFFFFF',
  'btnBorderColor': '#000000',
  'titleTextColor': '#000000',
  'messageTextColor': '#000000',
  'btnTextColor': '#000000',
  'btnBackgroundColor': '#FFFFFF',
  'btnBorderRadius': '4',
  'imageUrl': 'https://icons.iconarchive.com/icons/treetog/junior/64/camera-icon.png',
  'altText': 'Alternate Image'
};
CleverTapPlugin.promptPushPrimer(pushPrimerJSON);
```

### Push Primer using Alert local In-app
```Dart
var pushPrimerJSON = {
  'inAppType': 'alert',
  'titleText': 'Get Notified',
  'messageText': 'Enable Notification permission',
  'followDeviceOrientation': true,
  'positiveBtnText': 'Allow',
  'negativeBtnText': 'Cancel',
  'fallbackToSettings': true
};
CleverTapPlugin.promptPushPrimer(pushPrimerJSON);
```

### Prompt the Notification Permission Dialog (without push primer)
It takes boolean as a parameter. If the value passed is true and permission is denied then we fallback to app’s notification settings. If false then we just give the callback saying permission is denied.

```Dart
var fallbackToSettings = false;
CleverTapPlugin.promptForPushNotification(fallbackToSettings);
```

### Get the Push notification permission status
Returns the status of the push notification permission.

```Dart
bool? isPushPermissionEnabled = await CleverTapPlugin.getPushNotificationPermissionStatus();
if (isPushPermissionEnabled == null) return;

if (!isPushPermissionEnabled) {
  // call Push Primer here.
} else {
  print("Push Permission is already enabled.");
}
```

###  Description of the pushPrimerJSON Object passed inside the promptPushPrimer method

Key Name| Parameters | Description | Required
:---:|:---:|:---:|:---
`inAppType` | "half-interstitial" or "alert" | Accepts only half-interstitial & alert type to display the local in-app | Required
`titleText` | String | Sets the title of the local in-app | Required
`messageText` | String | Sets the subtitle of the local in-app | Required
`followDeviceOrientation` | true or false | If true then the local InApp is shown for both portrait and landscape. If it sets false then local InApp only displays for portrait mode | Required
`positiveBtnText` | String | Sets the text of the positive button | Required
`negativeBtnText` | String | Sets the text of the negative button | Required
`fallbackToSettings` | true or false | If true and the permission is denied then we fallback to app’s notification settings, if it’s false then we just give the callback saying permission is denied. | Optional
`backgroundColor` | Accepts Hex color as String | Sets the background color of the local in-app | Optional
`btnBorderColor` | Accepts Hex color as String | Sets the border color of both positive/negative buttons | Optional
`titleTextColor` | Accepts Hex color as String | Sets the title color of the local in-app | Optional
`messageTextColor` | Accepts Hex color as String | Sets the sub-title color of the local in-app | Optional
`btnTextColor` | Accepts Hex color as String | Sets the color of text for both positive/negative buttons | Optional
`btnBackgroundColor` | Accepts Hex color as String | Sets the background color for both positive/negative buttons | Optional
`btnBorderRadius` | String | Sets the radius for both positive/negative buttons. Default radius is “2” if not set | Optional
`imageUrl` | String | Sets the background image url | Optional
`altText` | String | Alt text for background image | Optional


###  Available Callback for Push Primer
Based on notification permission grant/deny, CleverTap Flutter SDK provides a callback with the permission accepted status.

```Dart
_clevertapPlugin.setCleverTapPushPermissionResponseReceivedHandler(pushPermissionResponseReceived);

void pushPermissionResponseReceived(bool accepted) {
  print("Push Permission response called ---> accepted = " + (accepted ? "true" : "false"));
}
```
