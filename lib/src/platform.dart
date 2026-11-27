import 'dart:io' show Platform;

import 'package:flutter/foundation.dart';

/// True when the app runs on Android: the real OS, not the platform Flutter pretends to be.
///
/// Decides whether Dart sends `startEmission`, which releases Android's native event buffer.
/// `defaultTargetPlatform` follows `debugDefaultTargetPlatformOverride`, a debug-only setting
/// that previews another platform's look. Example: an Android phone previewing the iOS look must
/// still send `startEmission`, or push-clicked events stay held and are discarded after 5
/// seconds. An iPhone previewing the Android look must not, or iOS answers "not implemented".
///
/// Not exported by clevertap_plugin.dart, so apps never see it. Tests replace it.
bool Function() isAndroidHost = () => !kIsWeb && Platform.isAndroid;
