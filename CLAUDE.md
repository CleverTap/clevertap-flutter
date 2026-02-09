# Claude Context for CleverTap Flutter SDK

## Project Overview

**Project**: CleverTap Flutter SDK  
**Type**: Flutter Plugin (Wrapper)  
**Purpose**: Provides Flutter/Dart bindings for native CleverTap Android, Web and iOS SDKs  
**Repository**: https://github.com/CleverTap/clevertap-flutter

**Native SDK Repositories**:
- Android: https://github.com/CleverTap/clevertap-android-sdk
- iOS: https://github.com/CleverTap/clevertap-ios-sdk
- Web: https://github.com/CleverTap/clevertap-web-sdk

This is a **wrapper SDK** - it doesn't implement analytics functionality directly but bridges Flutter to the native CleverTap SDKs on Android, Web and iOS.

---

## Architecture

```
Flutter/Dart Layer (lib/)
         ↕ Platform Channels (MethodChannel)
         ↕
Native Android Layer (android/src/)  ←→  CleverTap Android SDK (via Gradle dependency)
Native iOS Layer (ios/Classes/)      ←→  CleverTap iOS SDK (via CocoaPods)
Native Web Layer (lib/)              ←→  CleverTap Web SDK (via JS interop)
```

**Key Point**: When the native SDKs update, we update our dependency versions and expose new features through the Flutter API.

---

## Project Structure

```
clevertap-flutter/
├── lib/                                    # Dart/Flutter public API
│   ├── clevertap_plugin.dart              # Main entry point, all public methods
│   ├── clevertap_plugin_web_wrapper.dart  # Web platform implementation
│   └── src/                               # Internal implementation
│       ├── types.dart                     # Data models (CleverTapInboxMessage, etc.)
│       └── typedefs.dart                  # Callback type definitions
│
├── android/                                # Android implementation
│   ├── build.gradle                       # ⚠️ 2 VERSION NUMBERS HERE
│   └── src/main/java/com/clevertap/clevertap_plugin/
│       ├── CleverTapPlugin.java           # Main plugin class, handles MethodChannel
│       ├── DartToNativePlatformCommunicator.kt  # Dart→Native calls
│       ├── CleverTapEventEmitter.kt       # Native→Dart callbacks/events
│       ├── CleverTapListenerProxy.kt      # Native SDK event listeners
│       ├── Constants.java                 # Method channel names
│       ├── EventNameMapper.kt             # Maps events to Dart callbacks
│       ├── CleverTapTypeUtils.java        # Type conversions (Map↔Bundle)
│       ├── Utils.java                     # Utility methods
│       ├── CleverTapEvent.kt              # Event data models
│       ├── ClevertapCustomTemplates.kt    # Custom template handling
│       ├── CleverTapAppContextHolder.java # Application context holder
│       └── CleverTapApplication.java      # Application class setup
│
├── ios/                                    # iOS implementation
│   ├── Classes/
│   │   └── CleverTapPlugin.m              # Main plugin, handles MethodChannel
│   └── clevertap_plugin.podspec           # ⚠️ iOS SDK VERSION HERE
│
├── example/                                # Example Flutter app for testing
├── doc/                                    # Integration guides
│   ├── Usage.md                           # Complete API documentation
│   ├── Integrate-Android.md              # Android setup instructions
│   └── Integrate-iOS.md                  # iOS setup instructions
│
├── test/                                   # Unit tests
├── pubspec.yaml                           # ⚠️ VERSION NUMBER HERE
├── CHANGELOG.md                           # ⚠️ ADD ENTRIES AT TOP
└── README.md                              # ⚠️ VERSION NUMBER HERE
```

### Key Android Files Explained

- **CleverTapPlugin.java**: Flutter plugin entry point
  - Implements `FlutterPlugin` and `ActivityAware`
  - Creates MethodChannel for Dart↔Native communication
  - Delegates calls to `DartToNativePlatformCommunicator`
  
- **DartToNativePlatformCommunicator.kt**: Handles all Dart→Native method calls
  - Maps Flutter method calls to CleverTap Android SDK APIs
  - Examples: `recordEvent()`, `onUserLogin()`, `pushInstallReferrer()`
  
- **CleverTapEventEmitter.kt**: Handles all Native→Dart callbacks
  - Buffers events until Dart listeners are ready
  - Sends events like InApp shown/dismissed, profile updates, etc.
  
- **CleverTapListenerProxy.kt**: Bridges CleverTap SDK callbacks to Flutter
  - Implements CleverTap SDK listener interfaces
  - Forwards events to `CleverTapEventEmitter`

---

## Code Conventions

### Dart/Flutter
- Follow [Dart style guide](https://dart.dev/guides/language/effective-dart/style)
- Use `dartfmt` for formatting
- Document public methods with `///` comments
- Keep public API surface minimal and clean

### Android (Java/Kotlin)
- Package: `com.clevertap.clevertap_plugin`
- Follow Android SDK code style
- Use Kotlin for new code when possible
- Handle platform channel calls via proper delegation pattern

### iOS (Objective-C)
- Prefix classes with `CleverTapPlugin`
- Follow iOS SDK conventions
- Handle platform channel calls in `CleverTapPlugin.m`

### Git Commits
Use conventional commits format:
```
type(scope): subject

Examples:
feat(android): add push notification support
fix(ios): resolve in-app crash
chore: bump version to 3.7.0
docs: update integration guide
test: add event tracking tests
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## Resources

### Native SDK Documentation
- [CleverTap Android SDK](https://github.com/CleverTap/clevertap-android-sdk)
- [Android SDK Changelog](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md)
- [CleverTap iOS SDK](https://github.com/CleverTap/clevertap-ios-sdk)
- [iOS SDK Changelog](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md)
- [CleverTap Web SDK](https://github.com/CleverTap/clevertap-web-sdk)

### Developer Documentation
- [CleverTap Developer Docs](https://developer.clevertap.com/docs)
- [Flutter Documentation](https://flutter.dev/docs)
- [Writing Platform Channels](https://flutter.dev/docs/development/platform-integration/platform-channels)
