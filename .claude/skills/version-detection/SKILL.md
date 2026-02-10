---
name: version-detection
description: Version locations, patterns, and conversion logic for the CleverTap Flutter SDK. Single source of truth for all 7 version file locations. Used by version-gather (read) and version-update (write) agents.
---

# Version Detection

Version locations, extraction patterns, and conversion logic for the CleverTap Flutter SDK.

## Version Locations

The CleverTap Flutter SDK maintains version numbers in 7 locations that must stay synchronized:

| # | File | Location       | Pattern |
|---|------|----------------|---------|
| 1 | `pubspec.yaml` | Root           | `version: X.Y.Z` |
| 2 | `android/build.gradle` | Top            | `version = 'X.Y.Z'` |
| 3 | `android/build.gradle` | Dependencies   | `clevertap-android-sdk:X.Y.Z` |
| 4 | `ios/clevertap_plugin.podspec` | Top            | `s.version = 'X.Y.Z'` |
| 5 | `ios/clevertap_plugin.podspec` | Dependencies   | `CleverTap-iOS-SDK', 'X.Y.Z'` |
| 6 | `lib/clevertap_plugin.dart` | Class constant | `static const libVersion = XXXXX;` |
| 7 | `README.md` | Installation   | `clevertap_plugin: X.Y.Z` |

## Extraction Process

### Flutter Plugin Version (1, 2, 4, 7)

**Files**: `pubspec.yaml`, `android/build.gradle`, `ios/clevertap_plugin.podspec`, `README.md`

Read file, find version pattern, extract `X.Y.Z` format.

### Native SDK Versions (3, 5)

**Android**: `android/build.gradle` → `api 'com.clevertap.android:clevertap-android-sdk:X.Y.Z'`  
**iOS**: `ios/clevertap_plugin.podspec` → `s.dependency 'CleverTap-iOS-SDK', 'X.Y.Z'`

### Dart Version Constant (6)

**File**: `lib/clevertap_plugin.dart`  
**Pattern**: `static const libVersion = XXXXX;`

**Format**: Zero-padded integer (5 digits)
- `3.6.0` → `30600`
- `3.10.2` → `31002`

**Convert integer to version**:
1. Pad to 6 digits: `30600` → `030600`
2. Split into pairs: `03|06|00`
3. Remove leading zeros: `3.6.0`

## Version Consistency Check

**Flutter Plugin versions** (1, 2, 4, 6, 7) should all match.  
**Native SDK versions** (3, 5) are independent.

**Validation**:
1. Extract all Flutter Plugin versions
2. Convert Dart constant to `X.Y.Z` format
3. Compare all values
4. Report any mismatches

## Valid Version Format

Pattern: `X.Y.Z` where X, Y, Z are integers

✅ Valid: `3.6.0`, `3.10.2`, `4.0.0`  
❌ Invalid: `3.6`, `v3.6.0`, `3.6.0-beta`
