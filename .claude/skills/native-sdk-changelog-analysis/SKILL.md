---
name: native-sdk-changelog-analysis
description: Analyze CleverTap native SDK changelogs to identify API changes and generate implementation plans for Flutter wrapper updates. Use during SDK version updates, when investigating impact of version changes, planning API wrapper implementations, or reviewing breaking changes before updates.
---

# Native SDK Changelog Analysis

Extract and categorize changes from native Android and iOS SDK changelogs, verify method signatures from source code, and generate structured implementation plans for Flutter wrapper updates.

## Input Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `platform` | string | Target platform | "android" or "ios" |
| `old_version` | string | Starting version | "7.0.0" |
| `new_version` | string | Target version | "7.1.0" |
| `changelog_url` | string (optional) | Override default URL | Custom URL |

**Default URLs**:
- **Android**: `https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md`
- **iOS**: `https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md`

## Process

### Step 1: Fetch Changelog Content

1. Fetch changelog from GitHub
2. Extract content between version range (inclusive)
3. Handle errors with retry logic (3 attempts, exponential backoff)

**Error Handling**:
```
IF fetch fails after 3 retries THEN
    Report error with URL and last error message
    STOP - Do not proceed with guessed data
END IF
```

### Step 2: Categorize Changes

| Category | Criteria | Impact |
|----------|----------|--------|
| `NEW_API` | New public methods/classes | Wrapper implementation needed |
| `DEPRECATED` | Methods marked deprecated but functional | Documentation update, future removal warning |
| `BREAKING` | Methods removed or signatures changed | Immediate wrapper update required |
| `BUG_FIX` | Bug fixes with no API surface changes | No wrapper changes needed |
| `INTERNAL` | Internal refactoring, no public API impact | No action needed |

**Parsing keywords**: "New", "Added", "Introduced", "Deprecated", "Removed", "Breaking"

### Step 3: Extract Method Signatures

**For each NEW_API or BREAKING change**, extract:

1. **Method Name**: Full qualified name (e.g., `CleverTapAPI.methodName()`)
2. **Return Type**: Include generics, nullability annotations
3. **Parameters**: Name, type, nullable/non-null, default values, required vs optional
4. **Platform Version**: SDK version where introduced/changed

### Step 4: Verify Return Types from Source Code

**⚠️ CRITICAL: NEVER assume or guess return types from changelog descriptions.**

Changelogs use vague language like "returns variant data". You **MUST** verify from native SDK source code.

#### iOS Verification (MANDATORY)

1. **Try to extract return type from Changelog first**
   - Look for explicit method signatures (e.g., `- (NSArray *)methodName`)
   - If complete Objective-C signature is present with return type, use it directly
   - If only vague descriptions like "returns user data", proceed to step 2

2. **Fetch main public header file** (if step 1 didn't provide explicit signature)
   - **ONLY fetch this single file**:
   ```
   https://raw.githubusercontent.com/CleverTap/clevertap-ios-sdk/master/CleverTapSDK/CleverTap.h
   ```
   - Do NOT search other files

3. Search for exact method name

4. Extract complete Objective-C signature:
   ```objc
   - (NSArray<CleverTapInboxMessage *> * _Nullable)getAllInboxMessages;
   ```

5. Parse return type with nullability

#### Android Verification (MANDATORY)

1. **Try to extract return type from Changelog first**
   - Look for explicit method signatures (e.g., `public ArrayList<T> methodName()`)
   - If complete Java/Kotlin signature is present, use it directly
   - If only vague descriptions, proceed to step 2

2. **Fetch main entry file** (if step 1 didn't provide explicit signature)
   - **ONLY fetch this single file**:
   ```
   https://raw.githubusercontent.com/CleverTap/clevertap-android-sdk/master/clevertap-core/src/main/java/com/clevertap/android/sdk/CleverTapAPI.java
   ```
   - Do NOT search other files

3. Search for method name

4. Extract Java/Kotlin signature:
   ```java
   public ArrayList<CTMessageType> getAllInboxMessages();
   ```

5. Parse return type and generics

#### Type Mapping

| iOS Type | Android Type | Dart Type |
|----------|--------------|-----------|
| `NSArray` | `List` | `List` |
| `NSDictionary` | `Map` | `Map` |
| `NSString` | `String` | `String` |
| `NSNumber` | `Integer`, `Long`, `Double` | `int`, `double` |
| `BOOL` | `boolean` | `bool` |
| `void` | `void` | `void` |
| `NSArray<NSDictionary*>` | `List<Map>` | `List<Map<String, dynamic>>` |

**Common Mistakes to Avoid**:
- ❌ Trusting changelog descriptions like "returns user profile data"
- ❌ Guessing based on method name semantics
- ❌ Assuming types without checking source code
- ❌ Using incorrect generic type parameters

**If Source Code Not Found**:
1. Report exact search performed
2. Ask user to manually verify or provide signature
3. Do NOT proceed with implementation until confirmed

### Step 5: Determine Wrapper Requirements

```
Decision Tree:

Is this API already exposed in Flutter?
├─ YES → Does signature/behavior need updating?
│  ├─ YES → Mark for UPDATE
│  └─ NO → Mark as NO_ACTION
└─ NO → Is this commonly used functionality?
   ├─ YES → Mark for NEW_IMPLEMENTATION
   ├─ MAYBE → Mark for DISCUSS
   └─ NO → Mark as SKIP
```

## Output Format

### Wrapper Implementation Plan

```markdown
## Wrapper Implementation Plan

### APIs Requiring Implementation

| # | API Name | Return Type | Parameters | Category | Platforms | Decision |
|---|----------|-------------|------------|----------|-----------|----------|
| 1 | `getAllInboxMessages()` | `List<dynamic>` | none | NEW_API | Android 5.0.0+, iOS 4.2.0+ | NEW_IMPLEMENTATION |
| 2 | `setOptOut(enabled)` | `void` | enabled: bool | NEW_API | Android 4.5.0+, iOS 4.5.0+ | NEW_IMPLEMENTATION |

### Breaking Changes (Immediate Attention)

| # | API Name | Change Description | Impact | Platforms |
|---|----------|-------------------|--------|-----------|
| 1 | `oldMethod()` | Removed in favor of `newMethod()` | BREAKING | Android 7.1.0+ |

### Deprecated APIs (Future Removal)

| # | API Name | Replacement | Removal Version | Platforms |
|---|----------|-------------|-----------------|-----------|
| 1 | `legacyMethod()` | Use `modernMethod()` | 8.0.0 (estimated) | Android 7.1.0+, iOS 7.1.0+ |

### No Action Required

- Bug fix: Crash in push notification rendering on Android 14
- Internal: Refactored network layer implementation
```

**CRITICAL**: Output this plan and **wait for user acknowledgment** before proceeding.

## Change Category Details

### NEW_API
- Brand new public method/class/property
- Adds new functionality
- **Action**: Implement Flutter wrapper, add platform channel handlers, update example app

### BREAKING
- Existing API removed entirely
- Method signature changed
- Behavior fundamentally altered
- **Action**: Update Flutter wrapper, migrate code, add migration notes

### DEPRECATED
- Method marked for future removal
- Still functional but discouraged
- **Action**: Add deprecation warning, document replacement

### BUG_FIX
- Fixes incorrect behavior
- No API signature changes
- **Action**: Usually no wrapper changes

### INTERNAL
- Refactoring/optimization
- No public API changes
- **Action**: No wrapper changes

## Verification Checklist

Before outputting implementation plan:

- ✅ All NEW_API entries have verified return types from source code
- ✅ Platform versions correctly noted (Android X.Y.Z+, iOS X.Y.Z+)
- ✅ Method signatures include full parameter details
- ✅ Cross-platform consistency checked (iOS ↔ Android types match)

## Usage Examples

### Example 1: Analyze Android SDK Update

```
Input:
- Platform: android
- Old Version: 5.0.0
- New Version: 5.1.0

Process:
1. Fetch Android changelog
2. Extract entries between 5.0.0 and 5.1.0
3. Find NEW_API: getFeatureFlag(String flagName, boolean defaultValue)
4. Verify signature from CleverTapAPI.java:
   public boolean getFeatureFlag(String flagName, boolean defaultValue)
5. Categorize as NEW_IMPLEMENTATION

Output:
| # | API Name | Return Type | Parameters | Category | Decision |
|---|----------|-------------|------------|----------|----------|
| 1 | `getFeatureFlag()` | `bool` | flagName: String, defaultValue: bool | NEW_API | NEW_IMPLEMENTATION |
```

### Example 2: Cross-Platform Analysis

```
Input:
- Platforms: both (android + ios)
- Old Version: 5.0.0
- New Version: 5.1.0

Process:
1. Analyze Android changelog → Find suspendInAppNotifications()
2. Analyze iOS changelog → Find suspendInAppNotifications()
3. Verify signatures match:
   - Android: void suspendInAppNotifications()
   - iOS: - (void)suspendInAppNotifications
   - Dart equivalent: void (Future<void>)
4. Confirm NEW_IMPLEMENTATION needed for both

Output:
| # | API Name | Return Type | Platforms | Decision |
|---|----------|-------------|-----------|----------|
| 1 | `suspendInAppNotifications()` | `void` | Android 5.1.0+, iOS 5.1.0+ | NEW_IMPLEMENTATION |
```

## Success Criteria

Task complete when:
- ✅ All changes between versions extracted and categorized
- ✅ All NEW_API and BREAKING changes have verified signatures from source code
- ✅ Implementation plan table generated with complete details
- ✅ User has acknowledged the plan before proceeding
