<p align="center">
  <img src="https://github.com/CleverTap/clevertap-ios-sdk/blob/master/docs/images/clevertap-logo.png" width="50%"/>
</p>

# CleverTap Flutter SDK
[![pub package](https://img.shields.io/pub/v/clevertap_plugin.svg)](https://pub.dartlang.org/packages/clevertap_plugin)
<a href="https://github.com/CleverTap/clevertap-flutter/releases">
    <img src="https://img.shields.io/github/release/CleverTap/clevertap-flutter.svg" />
</a>

## Introduction
The CleverTap Flutter SDK for Mobile Customer Engagement and Analytics solutions.

For more information, check out our [website](https://clevertap.com/) and [documentation](https://developer.clevertap.com/docs/).

To get started, sign up [here](https://clevertap.com/live-product-demo/).

## Installation and Quick Start

- To add the **CleverTap Flutter SDK** to your project, edit your project's `pubspec.yaml` file:

```yaml
dependencies:
  clevertap_plugin: 3.2.0
```

- Run `flutter packages get` to install the SDK.

- Now, in your Dart code, you can use:

```dart
import 'package:clevertap_plugin/clevertap_plugin.dart';
```

### Initialize CleverTap

You can initialize CleverTap using either:

1. **Platform-specific configuration files (recommended):**
   - Follow the instructions in [Technical Documentation for Android](doc/Integrate-Android.md) and [Technical Documentation for iOS](doc/Integrate-iOS.md)

2. **Using environment variables:**
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

3. **Programmatically in your Flutter code:**
   ```dart
   await CleverTapPlugin.initialize(
     accountId: 'YOUR_ACCOUNT_ID',
     token: 'YOUR_ACCOUNT_TOKEN',
     region: 'YOUR_REGION',  // Optional
     targetDomain: 'YOUR_DOMAIN'  // Optional
   );
   ```

See our [Technical Documentation for Android](doc/Integrate-Android.md) and [Technical Documentation for iOS](doc/Integrate-iOS.md) for complete instructions on integrating CleverTap into your Flutter app.

## Security Measures

To ensure secure handling of CleverTap credentials and sensitive data, follow these best practices:

- **Environment Variable Management:**
  - Always add `.env` to your `.gitignore` to prevent accidental commits of sensitive credentials.
  - Never store production credentials in the source code or version control.
  - Use separate credentials for development, staging, and production environments.

- **Secure Credential Handling:**
  - Utilize secret management tools such as AWS Secrets Manager, Google Secret Manager, or environment variable injection via CI/CD pipelines.
  - Ensure access to credentials is restricted to authorized team members only.
  - Regularly rotate API keys and tokens to minimize security risks.

- **CI/CD Pipeline Security:**
  - Store secrets in a secure vault instead of hardcoding them in configuration files.
  - Use least privilege access policies for CI/CD tools interacting with CleverTap.
  - Monitor logs for unauthorized access attempts.

By implementing these security practices, you can safeguard your application and user data.

## Documentation & Example

- Checkout our [CleverTap Flutter Usage documentation](doc/Usage.md).
- Checkout our [Example Dart project](./example).

## CleverTap Push Templates SDK (Available only for Android OS)

CleverTap Push Templates SDK helps you engage with your users using dynamic push notification templates built specifically for [CleverTap](https://www.clevertap.com).
Find the integration steps for the CleverTap Push Templates SDK [here](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTPUSHTEMPLATES.md).

## Changelog

Refer to the [CleverTap Flutter SDK Change Log](./CHANGELOG.md).

## Questions

If you have questions or concerns, you can reach out to the CleverTap support team from the CleverTap Dashboard.
