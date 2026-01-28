# Skill: Version Detection

**Purpose**: Extract current version numbers from CleverTap Flutter SDK files

**When to use**: 
- Before updating SDK versions
- Checking version consistency across files
- Generating version reports

---

## Version Locations

The CleverTap Flutter SDK maintains version numbers in 6 locations that must stay synchronized:

### 1. Flutter Plugin Version (pubspec.yaml)

**File**: `pubspec.yaml`  
**Location**: Root of project  
**Pattern**: `version: X.Y.Z`

**How to extract**:
1. Read `pubspec.yaml`
2. Find line starting with `version:`
3. Extract the version number after the colon

**Example**:
```yaml
name: clevertap_plugin
version: 3.6.0  # ← Extract "3.6.0"
```

---

### 2. Android Plugin Version (build.gradle)

**File**: `android/build.gradle`  
**Location**: Line 2 of the file  
**Pattern**: `version = 'X.Y.Z'`

**How to extract**:
1. Read `android/build.gradle`
2. Find line starting with `version =`
3. Extract the version

**Example**:
```gradle
group 'com.clevertap.clevertap_plugin'
version = '3.6.0'  # ← Extract "3.6.0"
```

---

### 3. Android SDK Dependency Version (build.gradle)

**File**: `android/build.gradle`  
**Location**: In dependencies block  
**Pattern**: `api 'com.clevertap.android:clevertap-android-sdk:X.Y.Z'`

**How to extract**:
1. Read `android/build.gradle`
2. Find line containing `clevertap-android-sdk:`
3. Extract the version number after the last colon

**Example**:
```gradle
dependencies {
    api 'com.clevertap.android:clevertap-android-sdk:7.6.0'  # ← Extract "7.6.0"
}
```

---

### 4. iOS Plugin Version (clevertap_plugin.podspec)

**File**: `ios/clevertap_plugin.podspec`  
**Location**: Near top of file  
**Pattern**: `s.version = 'X.Y.Z'`

**How to extract**:
1. Read `ios/clevertap_plugin.podspec`
2. Find line containing `s.version`
3. Extract the version string between quotes

**Example**:
```ruby
Pod::Spec.new do |s|
  s.name             = 'clevertap_plugin'
  s.version          = '3.6.0'  # ← Extract "3.6.0"
```

---

### 5. iOS SDK Dependency Version (clevertap_plugin.podspec)

**File**: `ios/clevertap_plugin.podspec`  
**Location**: In dependency declarations  
**Pattern**: `s.dependency 'CleverTap-iOS-SDK', 'X.Y.Z'`

**How to extract**:
1. Read `ios/clevertap_plugin.podspec`
2. Find line containing `CleverTap-iOS-SDK`
3. Extract the version string between the last pair of quotes

**Example**:
```ruby
s.dependency 'CleverTap-iOS-SDK', '7.3.3'  # ← Extract "7.3.3"
```

---

### 6. Dart Version Constant (clevertap_plugin.dart)

**File**: `lib/clevertap_plugin.dart`  
**Location**: In CleverTapPlugin class  
**Pattern**: `static const libVersion = XXXXX;` (zero-padded integer)

**Format**: Removes dots and zero-pads to 5 digits
- `3.6.0` → `30600`
- `3.10.2` → `301002`

**How to extract**:
1. Read `lib/clevertap_plugin.dart`
2. Find line containing `static const libVersion`
3. Extract the integer value

**Example**:
```dart
class CleverTapPlugin {
  static const libVersion = 30600;  # ← Extract "30600" (represents 3.6.0)
}
```

**How to convert from integer (30600) to version (3.6.0)**:

**Step 1**: Pad to 6 digits
- `30600` → `030600`

**Step 2**: Split into 3 pairs
- `03` | `06` | `00`

**Step 3**: Convert each pair to decimal
- `03` → `3`
- `06` → `6`
- `00` → `0`

**Step 4**: Join with dots
- `3.6.0`

**More examples**:
- `31002` → `03|10|02` → `3.10.2`
- `100305` → `10|03|05` → `10.3.5`


---

### 7. README Usage Example (README.md)

**File**: `README.md`  
**Location**: In installation instructions  
**Pattern**: `clevertap_plugin: X.Y.Z`

**How to extract**:
1. Read `README.md`
2. Find line containing `clevertap_plugin:`
3. Extract the version number after the colon

**Example**:
```yaml
dependencies:
  clevertap_plugin: 3.6.0  # ← Extract "3.6.0"
```

---

## Extraction Process

For each file:
1. **Extract the version** using the pattern for that file
2. **Store the result** with a clear variable name

---

## Version Consistency Check

All Flutter Plugin versions should match (files 1, 2, 4, 6, 7):
- `pubspec.yaml` → `3.6.0`
- `android/build.gradle` (line 2) → `3.6.0`
- `ios/clevertap_plugin.podspec` → `3.6.0`
- `lib/clevertap_plugin.dart` → `30600` (3.6.0)
- `README.md` → `3.6.0`

Native SDK versions are independent:
- Android SDK → `7.6.0`
- iOS SDK → `7.3.3`

**How to validate consistency**:
1. Extract all 5 Flutter Plugin versions
2. Convert dart constant to X.Y.Z format
3. Compare all values
4. If all match → ✅ Consistent
5. If any differ → ❌ Inconsistent, report which files differ

---

## Validation Rules

### Valid Version Format
- Must match pattern: `X.Y.Z` where X, Y, Z are integers
- Examples: `3.6.0`, `3.10.2`, `4.0.0`
- Invalid: `3.6`, `v3.6.0`, `3.6.0-beta`

---

## Common Issues

### Issue 1: Version Not Found
**Symptom**: Cannot find version in file  
**Cause**: File format changed or looking at wrong line  
**Solution**: Read the entire file and search more broadly

### Issue 2: Dart Version Conversion Error
**Symptom**: 30600 doesn't convert to 3.6.0 correctly  
**Cause**: Ambiguity in conversion  
**Solution**: Report an error

---

## Related Skills

- **changelog-generation** - Uses version numbers for changelog entries
- **version-update** - Updates all version locations consistently
