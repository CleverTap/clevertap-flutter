## CHANGE LOG

Version 3.4.0 *(27 June 2025)*
-------------------------------------------
**What's new**
* **[Android Platform]**
  * Supports [CleverTap Android SDK v7.4.1](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-741-june-27-2025).

* **[iOS Platform]**
  * Supports [CleverTap iOS SDK v7.2.1](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-721-june-27-2025).

Version 3.3.1 *(18 April 2025)*
-------------------------------------------
**What's new**
* **[iOS Platform]**
  * Supports [CleverTap iOS SDK v7.1.1](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/7.1.1).
  * Adds `dismissInAppNotification` action to dismiss custom HTML in-Apps

**Bug Fixes**
* **[Android Platform]**
  * Fixes an issue where images failed to render in push templates when using a custom FCM integration.

* **[iOS Platform]**
  * Fixes app freezing issue when using await with `defineVariables()`.
  * Fixes custom in-app device orientation check.

Version 3.3.0 *(28 March 2025)*
-------------------------------------------
> ⚠️ **NOTE**  
> Please refer to [this guide](https://developer.clevertap.com/docs/clevertap-huawei-push-integration) for changed integration steps for Huawei PushProvider.

**What's new**
* **[Android Platform]**
  * Supports [CleverTap Android SDK v7.3.1](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-731-march-27-2025).
  * Adds new API to register push tokens for providers other than `FCM`
    * `pushRegistrationToken(String value, Map<String, String> pushType)`: Register the token for the specified PushType. Refer [here](doc/Usage.md#registering-fcm-baidu-huawei-token) for example usage.

**Breaking API Changes**
* **[Android Platform]**
  - **Removes:** The legacy token registration APIs have been removed to make push providers injectable. The removed APIs include:
    - `setBaiduPushToken(String value)`
    - `setHuaweiPushToken(String value)`
  

Version 3.2.0 *(3 March 2025)*
-------------------------------------------
> ⚠️ **NOTE**
After upgrading the SDK to v3.2.0, don't downgrade in subsequent app releases. If you encounter any issues, please contact the CleverTap support team for assistance. 

**What's new**
* **[Android Platform]**
  * Supports [CleverTap Android SDK v7.2.2](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-722-january-21-2025).
  * Adds support for Android 15, making it compliant with Android 15 requirements. Details [here](https://developer.android.com/about/versions/15/summary).
  * Upgrades the algorithm used for encryption of PII data, making it compliant with [OWASP](https://mas.owasp.org/MASTG/0x04g-Testing-Cryptography/). Uses `AndroidKeyStore` for securely backing up encryption key on API levels 23+.
  * Updates `minSdkVersion` to API 21 (Android 5.0).
  * Upgrades `Android Gradle Plugin (A.G.P)` to 8.6.1 as [recommended for Android 15](https://developer.android.com/about/versions/15/setup-sdk#:~:text=Update%20your%20app's%20build%20configuration,-Warning%3A%20If%20your&text=1%20or%20higher%2C%20first%20run,1.)


Version 3.1.0 *(3 March 2025)*
-------------------------------------------
**What's new**
* **[Android Platform]**
  * Supports [CleverTap Android SDK v7.1.2](https://github.com/CleverTap/clevertap-android-sdk/blob/develop/docs/CTCORECHANGELOG.md#version-712-january-29-2025).
  * Adds support for Flutter 3.29 by removing Embedding v1 support, which was deprecated long ago. If your project still relies on Embedding v1, follow the [migration guide](https://github.com/flutter/flutter/blob/main/docs/platforms/android/Upgrading-pre-1.12-Android-projects.md) to update it. (by [@rwrz](https://github.com/rwrz))
  * Adds support to hide large icon in android notifications by sending `wzrk_hide_large_icon` key in notification payload. 

* **[iOS Platform]**
  * Supports [CleverTap iOS SDK v7.1.0](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-710-january-21-2024).

* **[Android and iOS Platform]**
  - Adds support for triggering InApps based on first-time event filtering in multiple triggers. Now you can create campaign triggers that combine recurring and first-time events. For example: Trigger a campaign when "Charged" occurs (every time) OR "App Launched" occurs (first time only).
  - Adds new user-level event log tracking system to store and manage user event history. New APIs include:
    - `getUserEventLog(<eventName>)`: Get details about a specific event
    - `getUserEventLogCount(<eventName>)`: Get count of times an event occurred
    - `getUserLastVisitTs()`: Get timestamp of user's last app visit
    - `getUserAppLaunchCount()`: Get total number of times user has launched the app
    - `getUserEventLogHistory()`: Get full event history for current user

  - **API Changes**
    - **Deprecates:**  The old event tracking APIs tracked events at the device level rather than the user level, making it difficult to maintain accurate user-specific event histories, especially in multi-user scenarios. The following methods have been deprecated in favor of new user-specific event tracking APIs that provide more accurate, user-level analytics. These deprecated methods will be removed in future versions with prior notice:
      - `eventGetDetail()`: Use `getUserEventLog()` instead for user-specific event details
      - `eventGetOccurrences()`: Use `getUserEventLogCount()` instead for user-specific event counts
      - `eventGetFirstTime()`: Use `getUserEventLog()` instead for user-specific first occurrence timestamp
      - `eventGetLastTime()`: Use `getUserEventLog()` instead for user-specific last occurrence timestamp
      - `sessionGetPreviousVisitTime()`: Use `getUserLastVisitTs()` instead for user-specific last visit timestamp
      - `sessionGetTotalVisits()`: Use `getUserAppLaunchCount()` instead for user-specific app launch count
      - `getEventHistory()`: Use `getUserEventLogHistory()` instead for user-specific event history

Version 3.0.0 *(19 December 2024)*
-------------------------------------------
**What's new**
* **[Android Platform]**
  * Supports [CleverTap Android SDK v7.0.3](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-703-november-29-2024).
  * Adds support for custom handshake domain configuration in android manifest.
  
* **[iOS Platform]**
  * Supports [CleverTap iOS SDK v7.0.3](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-703-november-29-2024).
  * Adds support for custom handshake domains.
  
* **[Android and iOS Platform]**
  * Adds support for File Type Variables in Remote Config. Please refer to the [Remote Config Variables](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/docs/Variables.md) doc to read more on how to integrate this in your app.
  * Adds support for Custom Code Templates. Please refer to the [CustomCodeTemplates.md](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CustomCodeTemplates.md) doc to read more on how to integrate this in your app.
  * Adds support for custom code in-app templates definitions through a json scheme.

**Bug Fixes**
* **[Android Platform]**
* Fixes [#275](https://github.com/CleverTap/clevertap-flutter/issues/275) - Fixes NPE when casting object to string for PN clicked event.

### Version 2.5.0 *(17th October 2024)*
-------------------------------------------
**What's new**
* **[Android Platform]**
  * Supports [CleverTap Android SDK v7.0.1](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-701-september-2-2024).
  * Adds support for triggering InApps based on user attribute changes.
  * Removes character limit of maximum 3 lines from AppInbox messages.
  * Adds support for `AndroidX Media3` in lieu of the [deprecation](https://developer.android.com/media/media3/exoplayer/migration-guide) of `ExoPlayer`. While Clevertap continues to support `ExoPlayer`, migration is recommended. For migration refer [here](doc/Integrate-Android.md#migrateExoplayer).

* **[iOS Platform]**
  * Supports [CleverTap iOS SDK v7.0.1](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/7.0.1).
  * Adds support for triggering in-app notifications on User Attribute Change.

* **[Web Platform]**
  *  Adds the method 'enableWebPushNotifications()' to support custom Web Push Prompt
  *  Supports [CleverTap Web SDK v1.11.2](https://github.com/CleverTap/clevertap-web-sdk/releases/tag/v1.11.2) 

**Bug Fixes**
* **[All Platforms]**
  * Fixes [#260](https://github.com/CleverTap/clevertap-flutter/issues/260) - an issue related when running `pub get` from a **Windows Machine**


* **[Android Platform]**
  * Fixes an ANR caused by extremely old InApp campaigns. 
  * Fixes an issue where incorrect callbacks were sent for InApps when the phone was rotated. 
  * Fixes an issue where an InApp was displayed even after all the campaigns were stopped. 
  * Fixes an issue where the InApp image was not shown when the phone was rotated to landscape. 
  * Fixes an issue where certain URLs loaded incorrectly in custom HTML InApp templates.

* **[iOS Platform]**
  * Fix HTML view controller CTInAppHTMLViewController presented before scene became active. Use keyWindow supported orientations for CTInAppDisplayViewController.

### Version 2.4.1 *(2nd September 2024)*
-------------------------------------------
**Bug Fixes**
* **[Web Platform]**
  *  Adds the method 'addKVDataChangeListener()' to get the custom KV Pair data
  *  Supports [CleverTap Web SDK v1.9.1](https://github.com/CleverTap/clevertap-web-sdk/releases/tag/v1.9.1) 

* **[Android Platform]**
  * Fixes a date conversion issue for dates before January 1, 1970.
  * Fixes a `ClassCastException` for `setMinimumFetchIntervalInSeconds` in `ProductConfig`.
  * Fixes the missing support for `profileGetProperty`.

* **[iOS Platform]**
  * Fixes iOS platform channel messages must be sent on the platform thread issue.
  * Fixes the missing support for `profileGetProperty`.
  
### Version 2.4.0 *(10th May 2024)*
-------------------------------------------
**What's new**
* **[Web Platform]**
  * Added the method 'recordChargedEvent' for web

**Bug Fixes**
* **[Web Platform]**
  *  Added [JS package](https://pub.dev/packages/js) dependency to handle latest versions.

* **[Android Platform]**
  * Fixes [#114](https://github.com/CleverTap/clevertap-flutter/issues/114) - an issue related to callbacks from native to dart when a 3rd party plugin like `flutter_workmanager` is used.

### Version 2.3.1 *(19th April 2024)*
-------------------------------------------
**Bug Fixes**
* **[Web Platform]**
  *  Removes [JS package](https://pub.dev/packages/js) dependency

### Version 2.3.0 *(15th April 2024)*
-------------------------------------------
**What's new**
* **[Web Platform]**
  * Supports [CleverTap Web SDK v1.7.3](https://github.com/CleverTap/clevertap-web-sdk/releases/tag/v1.7.3). 
  * Adds support for **Remote Config Variables**. Please refer to the [Remote Config Variables doc](https://github.com/CleverTap/clevertap-flutter/blob/master/doc/Variables.md) to read more on how to integrate this to your app.

* **[Android Platform]**
  * Supports [CleverTap Android SDK v6.2.1](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-621-april-11-2024).

* **[iOS Platform]**
  * Supports [CleverTap iOS SDK v6.2.1](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/6.2.1).

**Breaking Changes**
* Removes all Xiaomi related public methods as the Xiaomi SDK has been discontinued. Details [here](https://developer.clevertap.com/docs/discontinuation-of-xiaomi-push-service).

**Bug Fixes**
* **[Android Platform]**
  * Extends the push primer callback to notify permission denial when cancel button is clicked on `PromptForSettings` alert dialog.
  * Fixes a crash due to `NullPointerException` related to `deviceInfo.deviceId`.
  * Fixes an ANR related to `isMainProcess` check.
  * Fixes an ANR due to eager initialisation of `CtApi` triggered by DeviceId generation.

* **[iOS Platform]**
  * Fixes a build error related to privacy manifests when statically linking the SDK using Cocoapods.

### Version 2.2.0 *(19 March 2024)*
-------------------------------------------
**What's new**
* **[Android Platform]**
  * Supports [CleverTap Android SDK v6.1.1](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-611-february-27-2024).
  * Supports Android 14, made it compliant with Android 14 requirements. Details [here](https://developer.android.com/about/versions/14/summary)
  * Upgrades AGP to 8.3.0 for building the SDK and adds related consumer proguard rules
  * Deprecates Xiaomi public methods as we are sunsetting SDK. Details [here](https://dev.mi.com/distribute/doc/details?pId=1555).
  * Adds Accessibility ids for UI components of SDK
  * Migrates JobScheduler to WorkManager for Pull Notifications.

* **[iOS Platform]**
  * Supports [CleverTap iOS SDK v6.1.0](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/6.1.0).
  * Adds privacy manifests.

**Bug Fixes**
* **[Android Platform]**
  * Fixes InApps crash in a rare activity destroyed race condition 
  * Fixes Potential ANR in a race condition of SDK initialisation in multithreaded setup
  * Fixes [#211](https://github.com/CleverTap/clevertap-flutter/issues/211)

* **[iOS Platform]**
  * Fixes crash due to out of bounds in NSLocale implementation.

### Version 2.1.0 *(26 February 2024)*
-------------------------------------------
**What's new**
* **[Android Platform]**
  * Supports [CleverTap Android SDK v6.0.0](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-600-january-15-2024).

* **[iOS Platform]**
  * Supports [CleverTap iOS SDK v6.0.0](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/6.0.0).
  
* **[Android and iOS Platform]**
  * Adds support for client-side in-apps.
  * Adds new API `clearInAppResources(boolean)` to delete images and gifs which are preloaded for inapps in cs mode
  * Adds new API `fetchInApps()` to explicitly fetch InApps from the server

**Bug Fixes**
* **[Android Platform]**
  * Fixes a bug where JavaScript was not working for custom-html InApp header/footer templates.
  * Fixes an NPE related to AppInbox APIs.
  * Fixes a ClassCastException in defineVariable API of Product Experiences.
  * Fixes a resource name conflict with the firebase library in fcm_fallback_notification_channel_label
  * Fixes a StrictMode Violation spawning from ctVariables.init().
  * Removes use of lossy conversions leading to an issue in PushTemplates.
  * Handles an edge case related to migration of encryption level when local db is out of memory

* **[iOS Platform]**
  * Fixes a bug where some in-apps were not being dismissed.

### Version 2.0.1 *(1st February 2024)*
-------------------------------------------
**What's new**
* **[Web Platform]**
  * Supports [CleverTap Web SDK v1.6.10](https://github.com/CleverTap/clevertap-web-sdk/releases/tag/v1.6.10). 

**Bug Fixes**
* **[Web Platform]**
  *  Fixes [#213](https://github.com/CleverTap/clevertap-flutter/issues/213) - Event structure invalid error. 


### Version 2.0.0 *(15th December 2023)*
-------------------------------------------
**What's new**
* **[iOS Platform]**
  * Supports [CleverTap iOS SDK v5.2.2](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/5.2.2)

* **[Web Platform]**
  * Supports [CleverTap Web SDK v1.6.9](https://github.com/CleverTap/clevertap-web-sdk/releases/tag/v1.6.9). Please refer to [Usage-Web.md](https://github.com/CleverTap/clevertap-flutter/blob/master/doc/Usage-Web.md) to integrate and use Clevertap Web SDK in flutter.


### Version 1.9.1 *(20th October 2023)*
-------------------------------------------
**What's new**
* **[Android Platform]**
  * Supports [CleverTap Android SDK v5.2.1](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-521-october-12-2023).
  * Adds Custom Proxy Domain functionality for Push Impressions and Events raised from CleverTap Android SDK. Please refer to [Usage.md](doc/Usage.md#integrate-custom-proxy-domain) file to read more on how to configure custom proxy domains in Android.

* **[iOS Platform]**
  * Supports [CleverTap iOS SDK v5.2.1](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/5.2.1).
  * Adds support to enable `NSFileProtectionComplete` to secure App’s document directory.
  
* **[Android and iOS Platform]**
  * Adds in-built support to send the default locale(i.e.language and country) data to the dashboard and exposed public API `CleverTapPlugin.setLocale(Locale locale)` to set the custom locale, for LP Parity.
  * Adds support for Integration Debugger to view errors and events on the dashboard when the debugLevel is set to 3 using `CleverTapPlugin.setDebugLevel(3)`.

**Changes**
* **[iOS Platform]**
  * Updated logic to retrieve country code using NSLocale above iOS 16 as `CTCarrier` is deprecated above iOS 16 with no replacements, see [Apple Doc](https://developer.apple.com/documentation/coretelephony/ctcarrier).
  * Updated logic to not send carrier name above iOS 16 in CTCarrier field.

**Bug Fixes**
* **[iOS Platform]**
  * Fixes a crash in iOS 17/Xcode 15 related to alert inapps.


### Version 1.9.0 *(29th August 2023)*
-------------------------------------------
**What's new**
* **[Android Platform]**
  * Supports [CleverTap Android SDK v5.2.0](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-520-august-10-2023).

* **[iOS Platform]**
  * Supports [CleverTap iOS SDK v5.2.0](https://github.com/CleverTap/clevertap-ios-sdk/releases/tag/5.2.0).

* **[Android and iOS Platform]**
  * Adds support for encryption of PII data wiz. Email, Identity, Name and Phone. Please refer to [Usage.md](https://github.com/CleverTap/clevertap-flutter/blob/master/doc/Usage.md#encryption-of-pii-data) file to read more on how to enable/disable encryption of PII data.
  * Adds support for custom KV pairs common to all inbox messages in App Inbox.

**Bug Fixes**
* **[Android Platform]**
  * Fixes [#393](https://github.com/CleverTap/clevertap-android-sdk/issues/393) - push permission flow crash when context in CoreMetadata is null.
  * Fixes a bug where addMultiValueForKey and addMultiValuesForKey were overwriting the current values of the user properties instead of appending it.

### Version 1.8.1 *(31st July 2023)*
-------------------------------------------
**What's new**
* Supports [CleverTap iOS SDK v5.1.2](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-512-july-28-2023)

**Bug Fixes**
* **[iOS Platform]**
  * Fixed a bug where the App Inbox would appear empty.

### Version 1.8.0 *(17th July 2023)*
-------------------------------------------
**What's new**
* Supports [CleverTap Android SDK v5.1.0](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-510-june-28-2023)
* Supports [CleverTap iOS SDK v5.1.1](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-511-july-13-2023)
* ***Note: RenderMax Push SDK functionality is now supported directly within the CleverTap Core SDK***. Please remove the integrated *RenderMax SDK* before you upgrade to CleverTap Flutter SDK for this 1.8.0 version.
* Adds support for **notification click handling when the app is terminated or killed**. The CleverTap plugin provides two ways to handle user interactions with notifications, depending on whether the app needs to perform UI or non-UI operations. 
  * Use `CleverTapPlugin.getAppLaunchNotification()` to perform UI impacting operation like redirecting the user to a specific page.
  * Use `CleverTapPlugin.onKilledStateNotificationClicked(_onKilledStateNotificationClickedHandler)` to perform non-UI operation like performing HTTP requests, IO operations with local storage etc.
  Please refer to the [Notification Click Handling](https://github.com/CleverTap/clevertap-flutter/blob/master/doc/Usage.md#handle-notification-click) to learn more about properly handling notification clicks.
* ***[Android Platform]:*** Adds support for developer defined default notification channel. Please refer to the [Usage.md](https://github.com/CleverTap/clevertap-flutter/blob/master/doc/Usage.md#default-notification-channel) file to read more on how to setup default channel in your app.Also please note that this is only supported for clevertap core notifications. Support for push templates will be released soon.

**Changes**
* The `CleverTapPlugin.createNotification(data)` API now supports rendering push template notifications and handling VoIP push for the SignedCall SDK.

**Bug Fixes**
* **[iOS Platform]**
  * Fixed Cocoapods generated duplicate UUIDs warnings.
  * Mitigates potential App Inbox errors.
* **[Android Platform]**
  * Fixes [#428](https://github.com/CleverTap/clevertap-android-sdk/issues/428) - Race-condition when detecting if an in-app message should show.
  * Fixes Push primer alert dialog freeze behavior, which became unresponsive when clicked outside the window.

### Version 1.7.0 *(8th June 2023)*
-------------------------------------------
**What's new**
* Adds support for **Remote Config Variables**. Please refer to the [Remote Config Variables doc](https://github.com/CleverTap/clevertap-flutter/blob/master/doc/Variables.md) to read more on how to integrate this to your app.
* Adds new API `dismissInbox()` to dismiss the App Inbox screen.
* Adds new APIs, `markReadInboxMessagesForIDs(List<String>)` and `deleteInboxMessagesForIDs(List<String>)` to mark read and delete an array of Inbox Messages respectively.
* Supports [CleverTap Android SDK v5.0.0](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-500-may-5-2023)
* Supports [CleverTap iOS SDK v5.0.1](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-501-may-17-2023)

**API Changes**

***Deprecated:*** The following methods and classes related to Product Config and Feature Flags have been marked as deprecated in this release, instead use new Remote Config Variables feature. These methods and classes will be removed in the future versions with prior notice.

* Product config
    * `setDefaultsMap`
    * `fetch`
    * `activate`
    * `fetchAndActivate`
    * `setMinimumFetchIntervalInSeconds`
    * `resetProductConfig`
    * `getProductConfigString`
    * `getProductConfigBoolean`
    * `getNumber`
    * `getLastFetchTimeStampInMillis`

* Feature flags
    * `getFeatureFlag`

**Breaking Change**
* Streamlines the payload for various callbacks across Android and iOS platform. Refer [doc](https://github.com/CleverTap/clevertap-flutter/blob/master/doc/callbackPayloadFormat.md) for detailed changes.
* ***[Android and iOS platforms] Signature change of the `CleverTapInboxNotificationMessageClickedHandler` callback]***:
  It is changed from `CleverTapInboxNotificationMessageClickedHandler(Map<String, dynamic>? data)` to `CleverTapInboxNotificationMessageClickedHandler(Map<String, dynamic>? data, int contentPageIndex, int buttonIndex)`. The `contentPageIndex` corresponds to the page index of the content, which ranges from 0 to the total number of pages for carousel templates. For non-carousel templates, the `contentPageIndex` value is always 0, as they only have one page of content. The `buttonIndex` corresponds to the the App Inbox button clicked (0, 1, or 2). A value of -1 in `buttonIndex` field indicates the entire App Inbox Item is clicked.

**Changes**
- ***[Android Platform] Behavioral change of CleverTap.CleverTapInboxMessageTapped listener:*** Previously, the callback was raised when the App Inbox item is clicked. Now, it is also raised when the App Inbox button is clicked. It matches the behavior in iOS platform.

**Bug Fixes**
* Fixes a bug where App Inbox was not respecting the App Inbox background color when no tabs are provided.
* Fixes the non-EU retry mechanism bug.
* Fixes the data handling exception that is thrown by the `processPushNotification(dynamic data)` API.

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
