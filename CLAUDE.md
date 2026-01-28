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

## Version Update Workflow

**⚠️ IMPORTANT**: For AI-assisted version updates, see the detailed task document:
**`.claude/flutter_release_changes.md`**

That document contains the complete automation workflow for Claude Code to:
- Fetch and analyze native SDK changelogs
- Determine version bump semantics
- Update all version strings automatically
- Analyze API changes and generate wrapper implementation plans
- Create changelog entries with proper formatting
- Validate builds and syntax

For manual updates, follow the steps below:

### Step 1: Update Flutter Plugin Version (5 files)

Update to version `x.y.z` in:

1. `/Users/anush/clevertap/clevertap-flutter/README.md`
   - Update: `clevertap_plugin: x.y.z`

2. `/Users/anush/clevertap/clevertap-flutter/ios/clevertap_plugin.podspec`
   - Update: `s.version = 'x.y.z'`

3. `/Users/anush/clevertap/clevertap-flutter/lib/clevertap_plugin.dart`
   - Update: `static const libVersion = x0y0z;` (zero-padded format)
   - Example: 3.6.0 becomes `30600`

4. `/Users/anush/clevertap/clevertap-flutter/pubspec.yaml`
   - Update: `version: x.y.z`

5. `/Users/anush/clevertap/clevertap-flutter/android/build.gradle`
   - Update: `version = 'x.y.z'` (line 2)

### Step 2: Update Native SDK Dependencies

#### Android SDK
**File**: `/Users/anush/clevertap/clevertap-flutter/android/build.gradle`
- Update: `api 'com.clevertap.android:clevertap-android-sdk:A.B.C'`
- Check latest version: https://github.com/CleverTap/clevertap-android-sdk/releases
- Changelog: https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md

#### iOS SDK
**File**: `/Users/anush/clevertap/clevertap-flutter/ios/clevertap_plugin.podspec`
- Update: `s.dependency 'CleverTap-iOS-SDK', 'X.Y.Z'`
- Check latest version: https://github.com/CleverTap/clevertap-ios-sdk/releases
- Changelog: https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md

#### Update CHANGELOG.md
Add entry at the **TOP** of the file following this format:

```markdown
Version x.y.z *(DD Month YYYY)*
-------------------------------------------
**What's new**
* **[Android Platform]**
  * Supports [CleverTap Android SDK vA.B.C](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-A-B-C-month-day-year).

* **[iOS Platform]**
  * Supports [CleverTap iOS SDK vX.Y.Z](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-X-Y-Z-month-day-year).
```

**IMPORTANT**: Changelog hyperlinks must include version anchors:
- Format: `#version-X-Y-Z-month-day-year`
- Example: `#version-7-6-0-october-17-2025`

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

## Changelog Format (STRICT)

The `CHANGELOG.md` has a **strict format** that must be preserved. It's parsed by automation tools.

### Critical Rules

1. ✅ **Always add new entries at the TOP** (before all existing entries)
2. ✅ **Date format**: `(DD Month YYYY)` - e.g., `(23 January 2026)`
   - ❌ NOT: `(2026-01-23)` or `(Jan 23, 2026)`
3. ✅ **Platform tags**: Use exactly these:
   - `[Android Platform]`
   - `[iOS Platform]`
   - `[Web Platform]`
   - `[Android and iOS Platform]` (when both affected)
4. ✅ **Link to native SDK changelogs with version anchors**
5. ✅ **Use issue links** for bug fixes: `Fixes [#123](url)`
6. ✅ **Maintain indentation**: 2 spaces for nested bullets

### Format Template

```markdown
Version X.X.X *(DD Month YYYY)*
-------------------------------------------
**What's new**
* **[Platform Name]**
  * Supports [CleverTap Platform SDK vX.X.X](link-with-anchor).
  * Additional feature details...

**API changes** (if applicable)
* **[Platform Name]**
  * New API: `methodName(params)` - Description
  * Deprecated: `oldMethod()` - Use `newMethod()` instead

**Breaking Changes** (if applicable)
* **[Platform Name]**
  * Removed: `deprecatedAPI()` - Migration guide

**Bug Fixes** (if applicable)
* **[Platform Name]**
  * Fixes [#123](issue-link) - Description of fix
```

---

## Semantic Versioning

Follow [semver](https://semver.org/):

- **MAJOR** (3.0.0 → 4.0.0): Breaking changes
  - Removed APIs
  - Changed method signatures
  - Behavioral changes that break existing code

- **MINOR** (3.6.0 → 3.7.0): New features, backwards compatible
  - New APIs
  - New functionality
  - Native SDK updates (usually)

- **PATCH** (3.6.0 → 3.6.1): Bug fixes only
  - Bug fixes
  - Documentation updates
  - Internal improvements

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
