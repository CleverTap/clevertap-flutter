# Command: Update Native SDKs

**Purpose**: Update CleverTap Flutter SDK to use latest native Android and iOS SDK versions

**Usage**: Ask Claude to "run update-sdk command" or "update to latest native SDKs"

---

## Overview

This command orchestrates the complete SDK update workflow by:
1. Detecting current versions using **version-detection** skill
2. Fetching latest SDK versions from GitHub
3. Analyzing native SDK changelogs for API changes  
4. Updating all version files consistently
5. Implementing new API wrappers using **api-wrapper-patterns** skill
6. Update Example app using **example-app-patterns** skill
7. Generating changelog entry using **changelog-generation** skill
8. Validating builds

---

## Execution Modes

### Interactive Mode (Default)
- Prompts for confirmation at key decision points
- Allows manual version selection
- Best for: First-time updates, learning the process

### Auto-Confirm Mode  
- Automatically proceeds with detected versions
- No interactive prompts
- Best for: CI/CD pipelines, trusted automation

**Trigger**: Set environment variable `CLAUDE_AUTO_CONFIRM=true`

---

## Phase 0: Pre-Flight Checks

### 0.1 Detect Execution Mode

Check if `CLAUDE_AUTO_CONFIRM` environment variable is set:
```
IF CLAUDE_AUTO_CONFIRM == "true" THEN
    AUTO_CONFIRM_MODE = true
    Log: "[AUTO-CONFIRM] Running in automated mode"
ELSE
    AUTO_CONFIRM_MODE = false
    Log: "[INTERACTIVE] Running in interactive mode"
END IF
```

## Phase 1: Gather Version Information

### 1.1 Read Current Versions

**Use the version-detection skill** to extract:

```
OLD_FLUTTER_VERSION = Extract from pubspec.yaml
OLD_ANDROID_VERSION = Extract from android/build.gradle (SDK dependency)
OLD_IOS_VERSION = Extract from ios/clevertap_plugin.podspec (SDK dependency)
```

**Log current state**:
```
Current Flutter Plugin: v{OLD_FLUTTER_VERSION}
Current Android SDK:    v{OLD_ANDROID_VERSION}
Current iOS SDK:        v{OLD_IOS_VERSION}
```

### 1.2 Fetch Latest Native SDK Versions

**Android**:
1. Fetch: `https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md`
2. Parse first `Version X.Y.Z` entry
3. Store as `NEW_ANDROID_VERSION`

**iOS**:
1. Fetch: `https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md`
2. Parse first `Version X.Y.Z` entry  
3. Store as `NEW_IOS_VERSION`

**Error Handling**:
- Retry up to 3 times with exponential backoff
- If still failing, STOP and report error
- Do not proceed without version information

### 1.3 Version Confirmation

**If AUTO_CONFIRM_MODE = false (Interactive)**:
```
Detected latest Android SDK: {NEW_ANDROID_VERSION}
Current Android SDK: {OLD_ANDROID_VERSION}

Options:
1. Proceed with detected version ({NEW_ANDROID_VERSION})
2. Manually specify a different version
3. Cancel operation

Please select (1/2/3):
```

Wait for user input and validate.

**If AUTO_CONFIRM_MODE = true (Auto-Confirm)**:
```
[AUTO-CONFIRM] Detected latest Android SDK: {NEW_ANDROID_VERSION}
[AUTO-CONFIRM] Current: {OLD_ANDROID_VERSION}
[AUTO-CONFIRM] Proceeding automatically
```

Repeat for iOS.

### 1.4 Calculate New Flutter Version

Determine semantic version bump:

```
IF breaking changes in native SDKs THEN
    NEW_FLUTTER_VERSION = Increment MAJOR (X.0.0)
ELSE IF new APIs or features THEN  
    NEW_FLUTTER_VERSION = Increment MINOR (x.Y.0)
ELSE IF only bug fixes THEN
    NEW_FLUTTER_VERSION = Increment PATCH (x.y.Z)
END IF
```
---

## Phase 2: Update Version Files

**Use version-detection skill** to know which files to update.

Update all 6 locations:

### 2.1 pubspec.yaml
```yaml
version: {NEW_FLUTTER_VERSION}
```

### 2.2 android/build.gradle (Line 2)
```gradle
version = '{NEW_FLUTTER_VERSION}'
```

### 2.3 android/build.gradle (Dependency)
```gradle
api 'com.clevertap.android:clevertap-android-sdk:{NEW_ANDROID_VERSION}'
```

### 2.4 ios/clevertap_plugin.podspec (Version)
```ruby
s.version = '{NEW_FLUTTER_VERSION}'
```

### 2.5 ios/clevertap_plugin.podspec (Dependency)
```ruby
s.dependency 'CleverTap-iOS-SDK', '{NEW_IOS_VERSION}'
```

### 2.6 lib/clevertap_plugin.dart (Constant)
```dart
static const libVersion = {NEW_FLUTTER_VERSION_AS_INT};
```
Convert: 3.7.0 → 30700

### 2.7 README.md
```yaml
clevertap_plugin: {NEW_FLUTTER_VERSION}
```

**Verification**: Read back each file to confirm changes applied correctly.

---

## Phase 3: Analyze Native SDK Changes

**Use the native-sdk-changelog-analysis skill** to:

1. Extract changelog entries for both Android and iOS between version ranges:
   - Android: `OLD_ANDROID_VERSION` to `NEW_ANDROID_VERSION`
   - iOS: `OLD_IOS_VERSION` to `NEW_IOS_VERSION`

2. Categorize all changes (NEW_API, BREAKING, DEPRECATED, BUG_FIX, INTERNAL)

3. Verify method signatures from source code for all NEW_API and BREAKING changes

4. Generate wrapper implementation plan table

5. Present the plan to user and **wait for acknowledgment** before proceeding to Phase 3

**Output**: Structured implementation plan with:
- APIs requiring implementation (with verified signatures and return types)
- Breaking changes requiring immediate attention
- Deprecated APIs with migration paths
- Items requiring no action

---

## Phase 4: Implement API Wrappers

**MANDATORY**: Implement ALL items in wrapper implementation plan marked NEW_IMPLEMENTATION or UPDATE.

**Only if there is a need to implement/update a new API. **Do NOT skip this phase** without explicit user approval.**:
For each API:

1. **Use api-wrapper-patterns skill** for updating

## Phase 5: Update Example App

**MANDATORY**: Add ALL items sample usage which are marked as `NEW_IMPLEMENTATION` or `UPDATE` from the wrapper implementation plan.

- Use the **example-app-patterns** skill
- Update `example/lib/main.dart` with working examples

## Phase 5: Generate Changelog

**Use changelog-generation skill** for formatting rules.

---

## Phase 6: Build Validation

### 6.1 Flutter Dependencies
```bash
flutter pub get
```

### 6.2 Build Test
```bash
cd example
flutter build apk --debug --no-pub
cd ..
```

**Success Criteria**:
- ✅ No syntax errors
- ✅ Builds complete without errors
- ⚠️ Warnings acceptable

**If build fails**:
- Show full error output
- Analyze if error is related to version changes
- Ask user how to proceed

---

## Success Criteria

Task complete when:
- ✅ All 6 version files updated consistently
- ✅ Native SDK dependencies updated
- ✅ All new APIs analyzed
- ✅ Necessary wrappers implemented (or user confirmed not needed)
- ✅ Changelog entry added with correct format
- ✅ Changelog links validated
- ✅ All builds pass

---

## Error Handling

### Network Errors
- Retry changelog fetching up to 3 times
- If persistent failure, STOP and report error

### Version Parse Errors
- Report exact file and pattern searched
- Ask user to verify file format
- Do not make assumptions

### Build Failures
- Report full error output
- Analyze if related to version changes
- If uncertain, ask user before proceeding

---

## Related Skills

- **version-detection** - Used in Phases 1 and 3
- **native-sdk-changelog-analysis** - Used in Phase 2
- **api-wrapper-patterns** - Used in Phase 4 for SDK APIs
- **example-app-patterns** - Used in Phase 4 for example app updates
- **changelog-generation** - Used in Phase 5
