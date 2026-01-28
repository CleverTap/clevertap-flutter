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
6. Generating changelog entry using **changelog-generation** skill
7. Validating builds

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

## Phase 2: Analyze Native SDK Changes

### 2.1 Extract Android SDK Changelog

**Input**:
- URL: Android SDK changelog  
- Version range: `OLD_ANDROID_VERSION` to `NEW_ANDROID_VERSION`

**Process**:
1. Fetch entire changelog
2. Extract all entries between versions (inclusive)
3. Categorize each change:
   - `NEW_API` - New public methods/classes
   - `DEPRECATED` - Methods marked deprecated
   - `BREAKING` - Methods removed or signatures changed
   - `BUG_FIX` - Bug fixes (no API impact)
   - `INTERNAL` - Internal changes (no public API impact)

**Output**: List of changes with categories

### 2.2 Extract iOS SDK Changelog

Same process as 2.1, but for iOS SDK.

### 2.3 Identify APIs Requiring Wrappers

For each change marked `NEW_API` or `BREAKING`:

**Decision Logic**:
```
Is this API already exposed in Flutter?
├─ YES → Does it need updating?
│  ├─ YES → Mark for UPDATE
│  └─ NO → Mark as NO_ACTION
└─ NO → Is this commonly used?
   ├─ YES → Mark for NEW_IMPLEMENTATION
   └─ NO → DISCUSS with user
```

**MANDATORY OUTPUT**:
```markdown
## Wrapper Implementation Plan

### APIs Requiring Implementation

| API Name | Category | Platforms | Decision |
|----------|----------|-----------|----------|
| methodName() | NEW_API | Android 7.x+, iOS 7.x+ | NEW_IMPLEMENTATION |

### Implementation Details
[For each API marked NEW_IMPLEMENTATION or UPDATE]
```

**CRITICAL**: Output this plan to user and get acknowledgment before Phase 3.

---

## Phase 3: Update Version Files

**Use version-detection skill** to know which files to update.

Update all 6 locations:

### 3.1 pubspec.yaml
```yaml
version: {NEW_FLUTTER_VERSION}
```

### 3.2 android/build.gradle (Line 2)
```gradle
version = '{NEW_FLUTTER_VERSION}'
```

### 3.3 android/build.gradle (Dependency)
```gradle
api 'com.clevertap.android:clevertap-android-sdk:{NEW_ANDROID_VERSION}'
```

### 3.4 ios/clevertap_plugin.podspec (Version)
```ruby
s.version = '{NEW_FLUTTER_VERSION}'
```

### 3.5 ios/clevertap_plugin.podspec (Dependency)
```ruby
s.dependency 'CleverTap-iOS-SDK', '{NEW_IOS_VERSION}'
```

### 3.6 lib/clevertap_plugin.dart (Constant)
```dart
static const libVersion = {NEW_FLUTTER_VERSION_AS_INT};
```
Convert: 3.7.0 → 30700

### 3.7 README.md
```yaml
clevertap_plugin: {NEW_FLUTTER_VERSION}
```

**Verification**: Read back each file to confirm changes applied correctly.

---

## Phase 4: Implement API Wrappers

**MANDATORY**: Implement ALL items in wrapper implementation plan marked NEW_IMPLEMENTATION or UPDATE.

**For each API**:

1. **Read existing similar implementations** to match patterns
2. **Use api-wrapper-patterns skill** for templates
3. **Implement in Dart layer** (`lib/clevertap_plugin.dart`)
4. **Implement in Android layer** (`DartToNativePlatformCommunicator.kt`)
5. **Implement in iOS layer** (`CleverTapPlugin.m`)
6. **Update example app** using **example-app-patterns skill** (`example/lib/main.dart`)

**Do NOT skip this phase** without explicit user approval.

---

## Phase 5: Generate Changelog

**Use changelog-generation skill** for formatting rules.

### 5.1 Create Entry

Calculate release date (current date + 3 days):
```bash
RELEASE_DATE=$(date -v+3d +'%-d %B %Y')  # macOS
# or
RELEASE_DATE=$(date -d '+3 days' +'%-d %B %Y')  # Linux
```

Generate entry following the template from changelog-generation skill.

### 5.2 Insert at Top of CHANGELOG.md

Read entire file, insert new entry after header, write back.

### 5.3 Validate Changelog Links

Test each native SDK changelog link:
```bash
curl -s -o /dev/null -w "%{http_code}" {LINK}
```

Expected: 200

**If 404**: Adjust anchor format and retry.

---

## Phase 6: Build Validation

### 6.1 Flutter Dependencies
```bash
flutter pub get
```

### 6.2 Static Analysis
```bash
flutter analyze
```

### 6.3 Build Test
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
- **changelog-generation** - Used in Phase 5
- **api-wrapper-patterns** - Used in Phase 4 for SDK APIs
- **example-app-patterns** - Used in Phase 4 for example app updates
