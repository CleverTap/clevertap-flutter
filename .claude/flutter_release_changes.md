# Task: Sync CleverTap Flutter SDK with Native SDKs

**Target Executor**: Claude Code (AI Agent)  
**Task Type**: Automated SDK version bump with API analysis

---

## Task Objective

Update the CleverTap Flutter wrapper SDK to use the latest native Android and iOS SDK versions. Analyze native SDK changelogs for API changes and implement necessary wrapper code.

---

## Phase 1: Information Gathering

### 1.1 Read Current Versions

Extract current native SDK versions from:

**Android SDK**:
- **File**: `android/build.gradle`
- **Search for**: `api 'com.clevertap.android:clevertap-android-sdk:`
- **Extract**: The version number that follows (format: X.Y.Z)
- **Example**: If line is `api 'com.clevertap.android:clevertap-android-sdk:7.6.0'`, extract `7.6.0`
- **Store as**: `OLD_ANDROID_VERSION`

**iOS SDK**:
- **File**: `ios/clevertap_plugin.podspec`
- **Search for**: `s.dependency 'CleverTap-iOS-SDK', '`
- **Extract**: The version number that follows (format: X.Y.Z)
- **Example**: If line is `s.dependency 'CleverTap-iOS-SDK', '7.3.3'`, extract `7.3.3`
- **Store as**: `OLD_IOS_VERSION`

**Flutter Plugin**:
- **File**: `pubspec.yaml`
- **Search for**: `version: `
- **Extract**: The version number that follows (format: x.y.z)
- **Example**: If line is `version: 3.6.0`, extract `3.6.0`
- **Store as**: `OLD_FLUTTER_VERSION`

### 1.2 Fetch Latest Native SDK Versions

**Android**:
1. Fetch URL: `https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md`
2. Parse the first version entry (most recent)
3. Store as: `NEW_ANDROID_VERSION`
4. **⚠️ USER CONFIRMATION REQUIRED**: Present the detected version to the user:
   ```
   Detected latest Android SDK version: {NEW_ANDROID_VERSION}
   Current version in Flutter: {OLD_ANDROID_VERSION}
   
   Options:
   1. Proceed with detected version ({NEW_ANDROID_VERSION})
   2. Manually specify a different version
   3. Cancel operation
   
   Please select an option (1/2/3):
   ```
5. Wait for user input:
   - If option 1: Proceed with `NEW_ANDROID_VERSION`
   - If option 2: Prompt for version input and validate format (X.Y.Z)
   - If option 3: Exit gracefully
6. Store final version as: `NEW_ANDROID_VERSION`

**iOS**:
1. Fetch URL: `https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md`
2. Parse the first version entry (most recent)
3. Store as: `NEW_IOS_VERSION`
4. **⚠️ USER CONFIRMATION REQUIRED**: Present the detected version to the user:
   ```
   Detected latest iOS SDK version: {NEW_IOS_VERSION}
   Current version in Flutter: {OLD_IOS_VERSION}
   
   Options:
   1. Proceed with detected version ({NEW_IOS_VERSION})
   2. Manually specify a different version
   3. Cancel operation
   
   Please select an option (1/2/3):
   ```
5. Wait for user input:
   - If option 1: Proceed with `NEW_IOS_VERSION`
   - If option 2: Prompt for version input and validate format (X.Y.Z)
   - If option 3: Exit gracefully
6. Store final version as: `NEW_IOS_VERSION`

**Version Validation**:
When user manually enters a version:
- Verify format matches `X.Y.Z` pattern (e.g., 7.7.1, 8.0.0)
- Verify the version exists in the respective changelog
- If invalid or not found, prompt again with error message

**Example Interaction**:
```
=== Android SDK Version Selection ===
Detected latest Android SDK version: 7.7.1
Current version in Flutter: 7.6.0

Options:
1. Proceed with detected version (7.7.1)
2. Manually specify a different version  
3. Cancel operation

Please select an option (1/2/3): 2

Enter Android SDK version (format X.Y.Z): 7.7.0

Validating version 7.7.0...
✓ Version 7.7.0 found in changelog
✓ Using Android SDK version: 7.7.0

=== iOS SDK Version Selection ===
...
```

### 1.3 Determine New Flutter Version

**Logic**:
- If only bug fixes in native SDKs → Patch bump (x.y.Z)
- If new APIs or features → Minor bump (x.Y.0)
- If breaking changes → Major bump (X.0.0)

Calculate and store as: `NEW_FLUTTER_VERSION`

Format for Dart constant: `NEW_FLUTTER_VERSION_CONST` (e.g., 3.7.0 → 30700)

---

## Phase 2: Native SDK Changelog Analysis

### 2.1 Extract Android SDK Changes

**Input**: 
- Start version: `OLD_ANDROID_VERSION`
- End version: `NEW_ANDROID_VERSION`
- Changelog URL: `https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md`

**Process**:
1. Fetch the entire changelog
2. Extract all version entries between `OLD_ANDROID_VERSION` and `NEW_ANDROID_VERSION` (inclusive)
3. For each version entry, categorize changes:
   - `NEW_API`: Methods/classes added to public API
   - `DEPRECATED`: Methods marked as deprecated
   - `BREAKING`: Methods removed or signatures changed
   - `BUG_FIX`: Bug fixes (no API impact)
   - `INTERNAL`: Internal changes (no public API impact)

**Output Format**:
```json
{
  "android_changes": [
    {
      "version": "7.7.0",
      "category": "NEW_API",
      "method": "setCustomInAppNotificationListener",
      "description": "Adds listener for custom in-app notifications",
      "needs_wrapper": true,
      "reasoning": "Public API that apps would use"
    },
    {
      "version": "7.6.1", 
      "category": "BUG_FIX",
      "description": "Fixed crash in push notification handling",
      "needs_wrapper": false,
      "reasoning": "Internal fix, no API change"
    }
  ]
}
```

### 2.2 Extract iOS SDK Changes

**Input**:
- Start version: `OLD_IOS_VERSION`
- End version: `NEW_IOS_VERSION`
- Changelog URL: `https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md`

**Process**: Same as 2.1, but for iOS

**Output Format**: Same as 2.1

### 2.3 Determine Wrapper Implementation Needs

**⚠️ CRITICAL**: This step is MANDATORY. You MUST create a formal `wrapper_implementation_plan` and output it to the user before proceeding to Phase 3.

For each change marked `needs_wrapper: true`:

**Decision Tree**:
```
Is this API already exposed in Flutter?
├─ YES → Does the implementation need updating?
│  ├─ YES → Mark for UPDATE
│  └─ NO → Mark as NO_ACTION
└─ NO → Is this a commonly used API pattern?
   ├─ YES → Mark for NEW_IMPLEMENTATION
   └─ NO → Mark for DISCUSS (ask user if needed)
```

**REQUIRED OUTPUT**: You MUST output the `wrapper_implementation_plan` to the user in this exact format:

```markdown
## Wrapper Implementation Plan

### APIs Requiring Implementation

| # | API Name | Category | Platforms | Current Flutter Status | Decision |
|---|----------|----------|-----------|----------------------|----------|
| 1 | `methodName()` | NEW_API | Android 7.x+, iOS 7.x+ | Not implemented | NEW_IMPLEMENTATION |
| 2 | `existingMethod(newParam)` | UPDATED_API | Android 7.x+, iOS 7.x+ | Exists without new param | UPDATE |

### Implementation Details

#### 1. `methodName()` - NEW_IMPLEMENTATION
- **Native Android method**: `CleverTapAPI.methodName()`
- **Native iOS method**: `[CleverTap methodName]`
- **Return type**: Map/List/void/etc.
- **Parameters**: description of params
- **Reasoning**: Why this needs a wrapper

#### 2. `existingMethod(newParam)` - UPDATE
- **Current signature**: `existingMethod()`
- **New signature**: `existingMethod({bool? newParam})`
- **Reasoning**: Native SDK added optional parameter
```

**If there are NO APIs requiring implementation**, explicitly state:
```markdown
## Wrapper Implementation Plan
No new APIs require wrapper implementation in this release.
- All new features are configuration-based (dashboard/manifest)
- No programmatic API changes detected
```

**DO NOT PROCEED TO PHASE 3 WITHOUT**:
1. Outputting the wrapper_implementation_plan
2. Getting user acknowledgment if there are APIs to implement

**Categorizing API Changes**:
- **Configuration-based features** (encryption settings, dashboard previews): NO wrapper needed
- **Payload-based features** (push notification keys like `wzrk_sif`): NO wrapper needed
- **Programmatic APIs** (methods apps call directly): WRAPPER REQUIRED
- **Extended method signatures** (new optional parameters): UPDATE REQUIRED

---

## Phase 3: Version Updates

### 3.1 Update Flutter Plugin Version (4 files)

**File 1**: `pubspec.yaml`
- **Find**: `version: {OLD_FLUTTER_VERSION}`
- **Replace with**: `version: {NEW_FLUTTER_VERSION}`
- **Example**: `version: 3.6.0` → `version: 3.7.0`

**File 2**: `README.md`
- **Find**: `clevertap_plugin: {OLD_FLUTTER_VERSION}`
- **Replace with**: `clevertap_plugin: {NEW_FLUTTER_VERSION}`
- **Example**: `clevertap_plugin: 3.6.0` → `clevertap_plugin: 3.7.0`

**File 3**: `ios/clevertap_plugin.podspec`
- **Find**: `s.version = '{OLD_FLUTTER_VERSION}'`
- **Replace with**: `s.version = '{NEW_FLUTTER_VERSION}'`
- **Example**: `s.version = '3.6.0'` → `s.version = '3.7.0'`

**File 4**: `lib/clevertap_plugin.dart`
- **Find**: `static const libVersion = {OLD_FLUTTER_VERSION_CONST};`
- **Replace with**: `static const libVersion = {NEW_FLUTTER_VERSION_CONST};`
- **Example**: `static const libVersion = 30600;` → `static const libVersion = 30700;`
- **Note**: Remove dots and zero-pad (3.6.0 → 30600, 3.7.0 → 30700)

**Verification**: Execute `grep -r "{OLD_FLUTTER_VERSION}" .` to catch any missed occurrences (exclude `.git` directory).

### 3.2 Update Android Native SDK Version

**File**: `android/build.gradle`
- **Find**: `api 'com.clevertap.android:clevertap-android-sdk:{OLD_ANDROID_VERSION}'`
- **Replace with**: `api 'com.clevertap.android:clevertap-android-sdk:{NEW_ANDROID_VERSION}'`
- **Example**: `api 'com.clevertap.android:clevertap-android-sdk:7.6.0'` → `api 'com.clevertap.android:clevertap-android-sdk:7.7.1'`

### 3.3 Update iOS Native SDK Version

**File**: `ios/clevertap_plugin.podspec`
- **Find**: `s.dependency 'CleverTap-iOS-SDK', '{OLD_IOS_VERSION}'`
- **Replace with**: `s.dependency 'CleverTap-iOS-SDK', '{NEW_IOS_VERSION}'`
- **Example**: `s.dependency 'CleverTap-iOS-SDK', '7.3.3'` → `s.dependency 'CleverTap-iOS-SDK', '7.4.2'`

---

## Phase 4: API Wrapper Implementation

**⚠️ MANDATORY**: You MUST implement all items in `wrapper_implementation_plan` marked as NEW_IMPLEMENTATION or UPDATE. Do NOT skip this phase or mark it as "deferred" without explicit user approval.

**For each item in `wrapper_implementation_plan` marked NEW_IMPLEMENTATION or UPDATE:**

### 4.0 Pre-Implementation Checklist

Before implementing each API:
1. **Read the existing native implementation** - Check how similar APIs are implemented in:
   - `android/src/main/java/com/clevertap/clevertap_plugin/DartToNativePlatformCommunicator.kt`
   - `ios/Classes/CleverTapPlugin.m`
2. **Identify the exact native SDK method signature** - Fetch native SDK documentation if needed
3. **Determine return type and parameter mapping** - How Dart types map to native types

### 4.1 Implementation Template

**Dart Layer** (`lib/clevertap_plugin.dart`):

Location: After existing methods, before private methods section

```dart
/// {DESCRIPTION_FROM_CHANGELOG}
///
/// Platform Support:
/// - Android: {NEW_ANDROID_VERSION}+
/// - iOS: {NEW_IOS_VERSION}+
///
/// Parameters:
/// - [param1]: Description
///
/// Returns: Description of return value
///
/// Example:
/// ```dart
/// await CleverTapPlugin.{methodName}({...});
/// ```
Future<ReturnType?> {methodName}(ParamType params) async {
  return await _dartToNativeMethodChannel.invokeMethod('{methodName}', params);
}
```

**Android Layer** (`android/src/main/java/com/clevertap/clevertap_plugin/DartToNativePlatformCommunicator.kt`):

Add to `onMethodCall` switch:
```kotlin
"{methodName}" -> {
    {methodName}(call, result)
}
```

Add private method:
```kotlin
private fun {methodName}(call: MethodCall, result: MethodChannel.Result) {
    try {
        val params = call.arguments as? Map<String, Any>
        
        if (cleverTapAPI != null) {
            // Call native SDK method - adapt based on actual API
            cleverTapAPI.{nativeMethodName}(params)
            result.success(null)
        } else {
            result.error(TAG, ERROR_MSG, null)
        }
    } catch (e: Exception) {
        result.error(TAG, "Error in {methodName}: ${e.message}", null)
    }
}
```

**iOS Layer** (`ios/Classes/CleverTapPlugin.m`):

Add to `handleMethodCall`:
```objectivec
if ([@"{methodName}" isEqualToString:call.method]) {
    [self {methodName}:call result:result];
    return;
}
```

Add implementation:
```objectivec
- (void){methodName}:(FlutterMethodCall *)call result:(FlutterResult)result {
    @try {
        NSDictionary *params = call.arguments;
        
        if (![params isKindOfClass:[NSDictionary class]]) {
            result([FlutterError errorWithCode:@"INVALID_PARAMS"
                                       message:@"Parameters must be a dictionary"
                                       details:nil]);
            return;
        }
        
        // Call native SDK method - adapt based on actual API
        [[CleverTap sharedInstance] {nativeMethodName}:params];
        
        result(nil);
    } @catch (NSException *exception) {
        result([FlutterError errorWithCode:@"ERROR"
                                   message:exception.reason
                                   details:nil]);
    }
}
```

### 4.2 Code Style Matching
**Reference Examples**:
- Look at existing similar methods in each file
- Copy error handling patterns exactly
- Use same constant naming (TAG, ERROR_MSG)

### 4.3 Update Example App

**⚠️ MANDATORY**: After implementing wrapper APIs, you MUST update the example app to demonstrate the new functionality.

**Location**: `example/lib/main.dart`

**For each new or updated API**:

1. **Add UI entry point** - Add a new `_buildListTile` in the appropriate `_buildExpansionTile` section:
```dart
_buildListTile(
    "API Display Name",
    methodImplementationName,
    "Brief description of what this does."),
```

2. **Add implementation method** - Add the corresponding method in the `_MyAppState` class:
```dart
void methodImplementationName() async {
  var result = await CleverTapPlugin.newApiMethod();
  if (result == null) {
    showToast("No result found");
    print("API Name -> No result");
  } else {
    showToast("Result fetched, check console");
    print("API Name -> Result: " + result.toString());
  }
}
```

3. **Create new section if needed** - If the API belongs to a new feature category, add a new `_buildExpansionTile`:
```dart
_buildExpansionTile("New Feature Category", [
  _buildListTile("API Name", methodName, "Description"),
]),
```

**Example for A/B Experiments API**:
```dart
// In build() method, add new section:
if (!kIsWeb)
  _buildExpansionTile("A/B Experiments", [
    _buildListTile(
        "Get Experiment Variants",
        getExperimentVariants,
        "Returns all active A/B experiment variants."),
  ]),

// Add implementation method:
void getExperimentVariants() async {
  List<dynamic>? variants = await CleverTapPlugin.getExperimentVariants();
  if (variants == null || variants.isEmpty) {
    showToast("No experiment variants found");
    print("A/B Experiments -> No variants found");
  } else {
    showToast("Experiment variants fetched, check console");
    print("A/B Experiments -> Variants: " + variants.toString());
  }
}
```

**Checklist for Example App Updates**:
- [ ] Each NEW_IMPLEMENTATION API has a corresponding UI button and method
- [ ] Each UPDATE API demonstrates the new functionality (e.g., new optional parameters)
- [ ] New feature categories have their own `_buildExpansionTile` section
- [ ] Methods follow existing patterns (showToast for user feedback, print for console logging)
- [ ] Platform-specific APIs are wrapped with `if (!kIsWeb)` or platform checks as needed

---

## Phase 5: Changelog Generation

### 5.1 Generate Changelog Entry

**Location**: `CHANGELOG.md` - **INSERT AT THE VERY TOP**

**Date Format**: Current date + 3 days, format as `DD Month YYYY` (e.g., "26 January 2026")

**Template**:
```markdown
Version {NEW_FLUTTER_VERSION} *({DATE})*
-------------------------------------------
**What's new**

* **[Android Platform]**/Users/anush/clevertap/clevertap-flutter/.claude/flutter_release_changes.md
  * Supports [CleverTap Android SDK v{NEW_ANDROID_VERSION}](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-{VERSION_ANCHOR}).
  {ANDROID_CHANGES}

* **[iOS Platform]**
  * Supports [CleverTap iOS SDK v{NEW_IOS_VERSION}](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-{VERSION_ANCHOR}).
  {IOS_CHANGES}

{COMMON_CHANGES_IF_ANY}
```

**Version Anchor Format**:
- Android: Remove dots, lowercase, add month-day-year
  - Example: 7.7.1 → `#version-771-december-2-2025`
- iOS: Keep dots, lowercase, add month-day-year
  - Example: 7.4.2 → `#version-742-january-14-2026`

**Change Descriptions**:

For each implemented wrapper:
```markdown
  * [NEW] Added `{methodName}()` method - {DESCRIPTION}
```

For deprecated APIs:
```markdown
  * [DEPRECATED] `{oldMethod}()` is deprecated, use `{newMethod}()` instead.
```

For breaking changes:
```markdown
  * [BREAKING] Changed `{method}()` signature - {MIGRATION_NOTES}
```

For bug fixes from native SDKs:
```markdown
  * [FIXED] {BUG_DESCRIPTION}
```

### 5.2 Validate Changelog Links

After generation, **fetch each link** to verify it returns 200 OK:
- Android changelog link
- iOS changelog link

If 404, adjust anchor format and retry.

---

## Phase 6: Testing & Validation

### 6.1 Build Validation

```bash
# Flutter dependencies
flutter pub get

# Android build check
cd example
flutter build apk --debug --no-pub
cd ..
```

**Success Criteria**:
- ✅ No syntax errors
- ✅ No version string mismatches found
- ✅ Builds complete without errors
- ⚠️ Warnings are acceptable

---

## Execution Notes for Claude Code

### Working Directory
Base path: `/Users/anush/clevertap/clevertap-flutter/`

### Dependencies Required
- Network access to fetch GitHub URLs
- File system read/write access
- Ability to execute shell commands (`flutter`, `dart`)

### Error Handling

**If changelog fetching fails**:
1. Retry up to 3 times with exponential backoff
2. If still failing, STOP and report error to user
3. Do not proceed with version updates without changelog analysis

**If version string not found**:
1. Report exact file and pattern searched
2. Ask user to verify file paths and patterns
3. Do not make assumptions

**If build validation fails**:
1. Report full error output
2. Analyze if error is related to version changes
3. If uncertain, ask user before proceeding

### Parallelization
These can run in parallel:
- Phase 1.2 (Android and iOS changelog fetching)
- Phase 2.1 and 2.2 (changelog analysis)
- Phase 6.2 (Android and iOS builds, if on macOS)

These must run sequentially:
- Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7

---

## Success Criteria

Task is complete when:
- ✅ All 6 version files updated consistently
- ✅ Native SDK dependencies updated
- ✅ All new public APIs analyzed
- ✅ All new public APIs added
- ✅ Necessary wrapper code implemented (or user confirmed not needed)
- ✅ Changelog entry added with correct format and working links
- ✅ All builds pass
- ✅ No syntax errors in any ``modified file
