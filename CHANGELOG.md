## CHANGE LOG

### Version 1.7.0 *(5th June 2023)*
-------------------------------------------
- Adds support for Remote Config Variables. Please refer to the [Remote Config Variables doc](/docs/Variables.md) to read more on how to integrate this to your app.
- The following methods related to Product Config and Feature Flags have been marked as deprecated in this release. These methods will be removed in the future with prior notice
    - Feature Flags
        - `getFeatureFlag`
    - Product Config
        - `setDefaultsMap`
        - `fetch`
        - `activate`
        - `fetchAndActivate`
        - `setMinimumFetchIntervalInSeconds`
        - `resetProductConfig`
        - `getProductConfigString`
        - `getProductConfigBoolean`
        - `getNumber`
        - `getLastFetchTimeStampInMillis`

### Version 1.6.1 (April 4, 2023)
* Fixed compilation errors in Xcode 14.3+ in iOS.
* Streamlined the argument of `onDisplayUnitsLoaded` callback method in iOS to directly pass display unit array.
* Supports [CleverTap iOS SDK v4.2.2](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-422-april-03-2023)

### Version 1.6.0 (February 14, 2023)
* Adds below new public APIs to support [CleverTap Android SDK v4.7.4](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-474-january-27-2023) and [CleverTap iOS SDK v4.2.0](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-420-december-13-2022)
    - `getPushNotificationPermissionStatus()`, `promptPushPrimer(object)`, `promptForPushNotification(boolean)`
* Adds push permission callback method `setCleverTapPushPermissionResponseReceivedHandler` which returns true/false after user allows/denies the notification permission.
* Adds `setCleverTapInAppNotificationShowHandler` to handle InApp notification shown - Only for Android.
* Streamlined the format of native display payload across Android and iOS.
* Fixes the FCM Plugin's [onBackgroundMessage handler bug](https://github.com/CleverTap/clevertap-flutter/commit/8db6f34eec83e7f14990359f88c65a50e966acb3) which was breaking the CleverTap Plugin's platform channel for sending method calls from Android.

### Version 1.5.6 (April 5, 2023)
#### Added
* Supports [CleverTap Android SDK v4.6.9](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-469-march-31-2023)
* Supports [CleverTap iOS SDK v4.2.2](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-422-april-03-2023)
* Adds the new public API `dismissInbox()` to dismiss the App Inbox.
* **Note**: This release is being done for Android 12 targeted users.

#### Changed
* **[Breaking change to the signature of the `CleverTapInboxNotificationMessageClickedHandler` callback]**:
  It is changed from `CleverTapInboxNotificationMessageClickedHandler(Map<String, dynamic>? data)` to `CleverTapInboxNotificationMessageClickedHandler(Map<String, dynamic>? data, int contentPageIndex, int buttonIndex)`. The `contentPageIndex` corresponds to the page index of the content, which ranges from 0 to the total number of pages for carousel templates. For non-carousel templates, the `contentPageIndex` value is always 0, as they only have one page of content. The `buttonIndex` corresponds to the the App Inbox button clicked (0, 1, or 2). A value of -1 in `buttonIndex` field indicates the entire App Inbox Item is clicked.
* **[Behavioral change of the `CleverTapInboxNotificationMessageClickedHandler` callback]**:
  Previously, the callback was raised when the App Inbox Item is clicked. Now, it is also raised when the App Inbox button is clicked besides the item click.
* **[Native Display parity changes]**:
  - Streamlines the format of native display payload across Android and iOS.
  - Streamlines the argument of `onDisplayUnitsLoaded` callback method in iOS to pass the list of displayUnits.

#### Fixed
* Fixes the FCM Plugin's [onBackgroundMessage handler bug](https://github.com/CleverTap/clevertap-flutter/commit/8db6f34eec83e7f14990359f88c65a50e966acb3) which was breaking the CleverTap Plugin's platform channel for sending method calls from Android to Dart platform.
* Fixes the Xcode 14.3+ compilation errors in iOS.

### Version 1.5.5 (January 23, 2023)
* Adds fix for closing App Inbox controller when deeplink is present in iOS.
* Supports [add-to-app](https://docs.flutter.dev/development/add-to-app) feature for Android platform to embed the CleverTap plugin in a flutter module.

### Version 1.5.4 (November 4, 2022)
* Supports [CleverTap iOS SDK v4.1.4](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-414-october-24-2022)

### Version 1.5.3 (October 28, 2022)
* Fixes incorrect API being called in `profileAddMultiValues` in iOS.

### Version 1.5.2 (October 7, 2022)
* Supports [CleverTap Android SDK v4.6.3](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/corev4.6.3)
* [Breaking Change] `setXiaomiPushToken` API has been modified to accept region to comply with new Mi Push Region changes. Refer to [CleverTap Xiaomi Push SDK v1.5.0 Changelog](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTXIAOMIPUSHCHANGELOG.md)
* Supports [CleverTap iOS SDK v4.1.2](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-412-september-16-2022)

### Version 1.5.1 (April 7, 2022)
* Adds the missing getter methods for Product Config in iOS.

### Version 1.5.0 (March 8, 2022)
* Supports [CleverTap Android SDK v4.4.0](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/core-v4.4.0)
* Supports [CleverTap iOS SDK v4.0.0](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/4.0.0) 

### Version 1.4.0 (December 1, 2021)
* Adds fix for NPE [#61](https://github.com/CleverTap/clevertap-flutter/issues/61)
* Adds `result.success(null)` for all method calls [#81](https://github.com/CleverTap/clevertap-flutter/issues/81)
* Supports [CleverTap Android SDK v4.3.1](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/core-v4.3.1)

### Version 1.3.0 (September 13, 2021)
* Adds public methods for suspending, discarding & resuming InApp Notifications
* Adds public methods to increment/decrement values set via User properties
* Deprecates `profileGetCleverTapID()` and `profileGetCleverTapAttributionIdentifier()` methods
* Adds a new public method `getCleverTapID()` as an alternative to above deprecated methods
* Supports [CleverTap iOS SDK v3.10.0](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/3.10.0)

### Version 1.2.3 (July 20, 2021)
* Supports [CleverTap Android SDK v4.2.0](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/core-v4.2.0)
* Adds fix for NPE [#58](https://github.com/CleverTap/clevertap-flutter/issues/58)
* Adds fix for `recordScreen` NPE [#54](https://github.com/CleverTap/clevertap-flutter/issues/54)

### Version 1.2.2 (May 21, 2021)
* Supports [CleverTap Android SDK v4.1.1](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/core-v4.1.1)
* Supports [CleverTap iOS SDK v3.9.4](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/3.9.4)
* Removes Product A/B Testing (Dynamic Variables) code
* Removes `profileSetGraphUser` method
* Adds `pushNotificationViewedEvent` and `pushNotificationClickedEvent`

### Version 1.2.1 (April 23, 2021)
* Update and Freeze [CleverTap Plugin Podspec](https://github.com/CleverTap/clevertap-flutter/blob/master/ios/clevertap_plugin.podspec) to a specific version of a CleverTap iOS SDK

### Version 1.2.0 (October 13, 2020)
* Supports [CleverTap Android SDK v4.0.0](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/core-v4.0.0)
* Supports [CleverTap iOS SDK v3.9.1](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/3.9.1)

### Version 1.1.4 (August 4, 2020)
* Supports [CleverTap Android SDK v3.8.2](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/3.8.2)

### Version 1.1.3 (July 17, 2020)
* Use v1.1.4
* Adds a callback to provide Push Notifications custom key-value pairs
* Supports CleverTap [Android](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/3.8.1) and [iOS](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/3.8.1) SDK v3.8.1
* Sample App Updated

### Version 1.1.2 (May 20, 2020)
* Use v1.1.4
* Adds support for Product Config and Feature Flags
* Adds support for Custom Handling Push Amplification Campaigns
* Supports CleverTap [Android](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/3.8.0) and [iOS](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/3.8.0) SDK v3.8.0

### Version 1.1.1 (March 30, 2020)
* Use v1.1.4
* Adds support for Custom App Inbox
* Adds support for InApp/Inbox button click listeners
* Adds support for Notification Clicked/Viewed for App Inbox
* Adds support for passing Xiaomi/Baidu tokens.
* Supports [CleverTap Android SDK v3.7.2](https://github.com/CleverTap/clevertap-android-sdk/releases/tag/3.7.2)
* Supports [CleverTap iOS SDK v3.7.3](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/3.7.3)

### Version 1.1.0 (February 27, 2020)
* Adds support for Dynamic Variables & Native Display
* Adds support for Google Play Install Referrer Library v1.0
* Supports CleverTap Android SDK v3.6.4
* Supports CleverTap iOS SDK v3.7.2

### Version 1.0.0 (January 20, 2020)
* Initial Release.
* Supports CleverTap Android SDK v3.6.1
* Supports CleverTap iOS SDK v3.7.2
