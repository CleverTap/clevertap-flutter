<p align="center">
  <img src="https://github.com/CleverTap/clevertap-ios-sdk/blob/master/docs/images/clevertap-logo.png" width = "50%"/>
</p>

# CleverTap Flutter SDK
[![pub package](https://img.shields.io/pub/v/clevertap_plugin.svg)](https://pub.dartlang.org/packages/clevertap_plugin)
<a href="https://github.com/CleverTap/clevertap-flutter/releases">
    <img src="https://img.shields.io/github/release/CleverTap/clevertap-flutter.svg" />
</a>

## 👋 Introduction
The CleverTap Flutter SDK for Mobile Customer Engagement and Analytics solutions.

For more information check out our [website](https://clevertap.com/ "CleverTap")  and  [documentation](https://developer.clevertap.com/docs/ "CleverTap Technical Documentation").

To get started, sign up [here](https://clevertap.com/live-product-demo/).

## 🚀 Installation and Quick Start

- To add the **CleverTap Flutter SDK** to your project, edit your project's `pubspec.yaml` file:

```yaml
dependencies:
clevertap_plugin: 3.2.0
```

- Run `flutter packages get` to install the SDK

- Now, in your Dart code, you can use:

```dart
import 'package:clevertap_plugin/clevertap_plugin.dart';
```

### Initialize CleverTap

You can initialize CleverTap using either:

1. Platform-specific configuration files (recommended):
   - Follow the instructions in [Technical Documentation for Android](doc/Integrate-Android.md) and [Technical Documentation for iOS](doc/Integrate-iOS.md)

2. Or using environment variables:
   - Copy `.env.example` to `.env` in your project root:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your CleverTap credentials:
     ```
     CLEVERTAP_ACCOUNT_ID=your_account_id_here
     CLEVERTAP_ACCOUNT_TOKEN=your_token_here
     CLEVERTAP_ACCOUNT_REGION=your_region_here      # Optional
     CLEVERTAP_HANDSHAKE_DOMAIN=your_domain_here    # Optional
     ```
   - ⚠️ Security Measures:
     - Always add `.env` to your `.gitignore` to prevent committing sensitive credentials
     - Never commit actual credentials to version control
     - Use different credentials for development and production environments
     - Regularly rotate your account tokens as a security best practice
     - Restrict environment variable access to only necessary team members

3. Or programmatically in your Flutter code:
```dart
await CleverTapPlugin.initialize(
  accountId: 'YOUR_ACCOUNT_ID',
  token: 'YOUR_ACCOUNT_TOKEN',
  region: 'YOUR_REGION',  // Optional
  targetDomain: 'YOUR_DOMAIN'  // Optional
);
```

See our [Technical Documentation for Android](doc/Integrate-Android.md) and [Technical Documentation for iOS](doc/Integrate-iOS.md) for complete instructions on integrating CleverTap into your Flutter app.

## 📑 Documentation & Example

- Checkout our [CleverTap Flutter Usage documentation](doc/Usage.md)
- Checkout our [Example Dart project](./example)

## 📲 CleverTap Push Templates SDK (Available only for Android OS)
[(Back to top)](#-table-of-contents)

CleverTap Push Templates SDK helps you engage with your users using fancy push notification templates built specifically to work with [CleverTap](https://www.clevertap.com).
Find the integration steps for the CleverTap Push Templates SDK [here](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTPUSHTEMPLATES.md)

## 🆕 Changelog

Refer to the [CleverTap Flutter SDK Change Log](./CHANGELOG.md).

## ❓Questions

 If you have questions or concerns, you can reach out to the CleverTap support team from the CleverTap Dashboard.

