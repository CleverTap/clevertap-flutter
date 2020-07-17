<p align="center">
  <img src="https://github.com/CleverTap/clevertap-flutter/blob/master/clevertap-logo.png" width="300"/>
</p>

# CleverTap Flutter SDK

The CleverTap Flutter SDK for Mobile Customer Engagement and Analytics solutions 

CleverTap brings together real-time user insights, an advanced segmentation engine, and easy-to-use marketing tools in one mobile marketing platform — giving your team the power to create amazing experiences that deepen customer relationships. Our intelligent mobile marketing platform provides the insights you need to keep users engaged and drive long-term retention and growth.

For more information check out our [website](https://clevertap.com "CleverTap") and [documentation](https://developer.clevertap.com/docs/ "CleverTap Technical Documentation").

## Install and Integration

To add the CleverTap Flutter SDK to your project, edit your project's `pubspec.yaml` file:

```yaml
    dependencies:
    clevertap_plugin: 1.1.3
```

Run `flutter packages get` to install the SDK

Now, in your Dart code, you can use :

```dart
    import 'package:clevertap_plugin/clevertap_plugin.dart';
```

## Android

Add the following to your `dependencies` section in `project/build.gradle`

```groovy
    dependencies {
            classpath 'com.android.tools.build:gradle:3.5.1'
            classpath 'com.google.gms:google-services:4.3.2' //<--- Mandatory for using Firebase Messaging, skip if not using FCM
        }
```

Add the following to your `dependencies` section in `app/build.gradle`
```groovy
    implementation 'com.clevertap.android:clevertap-android-sdk:3.8.1'
        implementation 'com.android.support:support-v4:28.0.0'
        implementation 'com.google.firebase:firebase-messaging:17.3.4'//Mandatory for using FCM push notifications, skip if not using FCM
        implementation 'com.android.support:appcompat-v7:28.0.0'//MANDATORY for App Inbox
        implementation 'com.android.support:design:28.0.0'//MANDATORY for App Inbox
        implementation 'com.github.bumptech.glide:glide:4.9.0'//MANDATORY for App Inbox
    //For CleverTap Android SDK v3.6.4 and above add the following -
        implementation 'com.android.installreferrer:installreferrer:1.0'
    //Optional ExoPlayer Libraries for Audio/Video Inbox Messages. Audio/Video messages will be dropped without these dependencies
        implementation 'com.google.android.exoplayer:exoplayer:2.8.4'
        implementation 'com.google.android.exoplayer:exoplayer-hls:2.8.4'
        implementation 'com.google.android.exoplayer:exoplayer-ui:2.8.4'
```

At the end of the `app/build.gradle` file add the following 

```groovy
    apply plugin: 'com.google.gms.google-services' //skip if not using FCM
```

In your app's Android Application class add the following code.

```java
    public class MyApplication extends FlutterApplication {
        @java.lang.Override
        public void onCreate() {
            ActivityLifecycleCallback.register(this); //<--- Add this before super.onCreate()
            super.onCreate();
        }
    }

```

If you do not have an Application class, add this to your `AndroidManifest.xml`

```xml
    <application
        android:label="@string/app_name"
        android:icon="@drawable/ic_launcher"
        android:name="com.clevertap.android.sdk.Application"> 
```

Add the following permissions which are needed by the CleverTap SDK

```xml
    <!-- Required to allow the app to send events and user profile information -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <!-- Recommended so that CleverTap knows when to attempt a network call -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
```

Add your CleverTap Account ID and Token to your `AndroidManifest.xml`, within the <application></application> tags.

```xml
    <meta-data
        android:name="CLEVERTAP_ACCOUNT_ID"
        android:value="Your CleverTap Account ID"/>
    <meta-data
        android:name="CLEVERTAP_TOKEN"
        android:value="Your CleverTap Account Token"/>
    <!-- IMPORTANT: To force use Google AD ID to uniquely identify  users, use the following meta tag. GDPR mandates that if you are using this tag, there is prominent disclousure to your end customer in their application. Read more about GDPR here - https://clevertap.com/blog/in-preparation-of-gdpr-compliance/ -->
    <meta-data
        android:name="CLEVERTAP_USE_GOOGLE_AD_ID"
        android:value="1"/> 

```
## iOS

After install, you will need to integrate the CleverTap SDK into your apps.

1. Follow the integration instructions [starting with Step 2 here](https://developer.clevertap.com/docs/ios-quickstart-guide#section-step-2-add-clever-tap-credentials).
2. In your `AppDelegate didFinishLaunchingWithOptions:` notify the CleverTap Flutter SDK of application launch:

*Objective-C*
```objc
[CleverTap autoIntegrate]; // integrate CleverTap SDK using the autoIntegrate option
[[CleverTapPlugin sharedInstance] applicationDidLaunchWithOptions:launchOptions];
```

*Swift*
```swift
CleverTap.autoIntegrate() // integrate CleverTap SDK using the autoIntegrate option
CleverTapPlugin.sharedInstance()?.applicationDidLaunch(options: launchOptions)
```

NOTE:  Don't forget to add the CleverTap imports at the top of the file.

*Objective-C*
```objc
#import "CleverTap.h"
#import "CleverTapPlugin.h"
```

*Swift*
```swift
import CleverTapSDK
import clevertap_plugin
```

## For more

- Checkout our [Example Dart Usage](https://github.com/CleverTap/clevertap-flutter/tree/master/example) directory for the sample app.
- Checkout our [CleverTap developer docs](https://developer.clevertap.com/docs/ "CleverTap Technical Documentation")

## Changelog

Check out the [CleverTap Flutter SDK Change Log](https://github.com/CleverTap/clevertap-flutter/blob/master/CHANGELOG.md).

## Questions?

 If you have questions or concerns, you can reach out to the CleverTap support team at [support@clevertap.com](mailto:support@clevertap.com).

