## CHANGE LOG

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
