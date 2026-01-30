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
2. **Return Type**: See Step 4 for how to determine
3. **Parameters**: Name, type, nullable/non-null, default values, required vs optional
4. **Platform Version**: SDK version where introduced/changed

### Step 4: Determine Return Types

**⚠️ CRITICAL: Follow this priority order to find return types efficiently.**

#### Priority 1: Extract from Changelog (If Explicit)

First, check if the changelog entry contains explicit type information:

**Look for:**
- Direct type mentions: "returns `ArrayList<String>`", "returns `NSArray<NSDictionary *> *`"
- Method signature showing the signature
- Code snippets showing the signature
- Example usage showing the return type

**If found:** Use the explicit type and skip to implementation.

**If vague** (e.g., "returns variant data", "gets inbox messages"): Proceed to Priority 2.

---

#### Priority 2: Check Native SDK Files

**For iOS APIs - Fetch ONLY this file:**
```
https://raw.githubusercontent.com/CleverTap/clevertap-ios-sdk/master/CleverTapSDK/CleverTap.h
```

**For Android APIs - Fetch ONLY this file:**
```
https://raw.githubusercontent.com/CleverTap/clevertap-android-sdk/master/clevertap-core/src/main/java/com/clevertap/android/sdk/CleverTapAPI.java
```

**Process:**
1. Use `web_fetch` with `text_content_token_limit: 50000` to fetch the appropriate file
2. Search for the method name (case-insensitive, allow partial matches)
3. Extract the complete signature:

   **iOS Example:**
```objc
   - (NSArray<CleverTapInboxMessage *> * _Nullable)getAllInboxMessages;
```

**Android Example:**
```java
   public ArrayList<CTInboxMessage> getAllInboxMessages();
```

4. Note the native return type including generics and nullability annotations

**If method found:** Use the native signature and proceed to implementation.

**If method NOT found in primary file:** Proceed to Priority 3.

---

#### Priority 3: Cross-Platform Inference

**If the API exists in BOTH platforms and you found ONE signature:**

Use type mapping to infer the other:

| iOS Type | Android Type | Flutter/Dart Type |
|----------|--------------|-------------------|
| `NSArray<T *> *` | `ArrayList<T>` | `List<T>` |
| `NSDictionary<K, V> *` | `Map<K, V>` | `Map<K, V>` |
| `NSString *` | `String` | `String` |
| `NSNumber *` / `int` | `int` / `Integer` | `int` |
| `BOOL` | `boolean` | `bool` |
| `void` | `void` | `void` |
| `id` | `Object` | `dynamic` |

**Process:**
1. If Android signature found but iOS missing → infer iOS type using table
2. If iOS signature found but Android missing → infer Android type using table
3. Document the inference: "// Inferred from Android: ArrayList<CTInboxMessage>"

**Example:**
- **Found in Android:** `public Map<String, Object> getVariants()`
- **Infer for iOS:** `- (NSDictionary<NSString *, id> *)getVariants`

---

#### Priority 4: Method Not Found - Verification Required

**If method not found after all steps:**

1. **Verify the method name with user:**
```
   I couldn't find `methodName()` in the public API files:
   - iOS: CleverTap.h
   - Android: CleverTapAPI.java
   
   Could you verify:
   - The exact method name from the changelog?
   - Whether this is a public-facing API?
   - If it might be in a different class/module?
```

2. **Do NOT proceed with implementation until confirmed**

3. **Suggest alternatives:**
   - Check if it's an internal/private API
   - Look for similar method names in the files
   - Verify the SDK version in the changelog

---

#### Special Cases

**1. File too large / truncated:**
- If `web_fetch` truncates the file, use `web_search`:
```
  site:github.com/CleverTap/clevertap-android-sdk "methodName"
```
- Fetch the specific file from search results

**2. Method has multiple overloads:**
- Extract ALL signatures
- Ask user which variant to implement
- Document all variants in comments

**3. Deprecated methods:**
- Note deprecation in comments
- Suggest modern alternative if available
- Proceed with implementation unless user objects

---

#### Quality Checklist

Before proceeding to implementation, verify:
- [ ] Return type explicitly found OR reasonably inferred
- [ ] Generics/type parameters included (e.g., `ArrayList<T>` not just `ArrayList`)
- [ ] Nullability annotations captured (iOS: `_Nullable`, `_Nonnull`)
- [ ] Method signature is complete (access modifier, return type, name, parameters)
- [ ] If inferred, inference is documented in code comments

#### Type Mapping Reference

| iOS Type | Android Type | Dart Type |
|----------|--------------|-----------|
| `NSArray` | `List`, `ArrayList` | `List` |
| `NSDictionary` | `Map`, `HashMap` | `Map` |
| `NSString` | `String` | `String` |
| `NSNumber` | `Integer`, `Long`, `Double` | `int`, `double` |
| `BOOL` | `boolean` | `bool` |
| `void` | `void` | `void` |
| `NSArray<NSDictionary*>` | `List<Map>`, `ArrayList<HashMap>` | `List<Map<String, dynamic>>` |

**Common Mistakes to Avoid**:
- ❌ Trusting changelog descriptions like "returns user profile data"
- ❌ Guessing based on method name semantics
- ❌ Assuming types without checking source code
- ❌ Fetching or reading files other than the two main files listed above
- ❌ Using incorrect generic type parameters

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

**CRITICAL**: The "Native Return Type" columns MUST show the actual native SDK return types (e.g., `ArrayList<CTInboxMessage>` for Android, `NSArray<CleverTapInboxMessage *> *` for iOS), NOT the Dart types.

```markdown
## Wrapper Implementation Plan

### APIs Requiring Implementation

| # | API Name | Android Return Type | iOS Return Type | Dart Return Type | Parameters | Category | Platforms | Decision |
|---|----------|---------------------|-----------------|------------------|------------|----------|-----------|----------|
| 1 | `getAllInboxMessages()` | `ArrayList<CTInboxMessage>` | `NSArray<CleverTapInboxMessage *> *` | `List<dynamic>` | none | NEW_API | Android 5.0.0+, iOS 4.2.0+ | NEW_IMPLEMENTATION |
| 2 | `setOptOut(enabled)` | `void` | `void` | `void` | enabled: bool | NEW_API | Android 4.5.0+, iOS 4.5.0+ | NEW_IMPLEMENTATION |
| 3 | `getFeatureFlag(name, default)` | `boolean` | `BOOL` | `bool` | name: String, default: bool | NEW_API | Android 5.1.0+, iOS 5.1.0+ | NEW_IMPLEMENTATION |

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

- ✅ All NEW_API entries have verified native return types from source code
- ✅ Native return types were found by reading ONLY the two main files (CleverTap.h and CleverTapAPI.java)
- ✅ Native return types shown in output table (Android and iOS columns separate)
- ✅ Platform versions correctly noted (Android X.Y.Z+, iOS X.Y.Z+)
- ✅ Method signatures include full parameter details
- ✅ Cross-platform consistency checked (iOS ↔ Android types are equivalent)

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
4. Fetch CleverTapAPI.java using web_fetch
5. Search in file content and find signature:
   public boolean getFeatureFlag(String flagName, boolean defaultValue)
6. Categorize as NEW_IMPLEMENTATION

Output:
| # | API Name | Android Return Type | iOS Return Type | Dart Return Type | Parameters | Category | Decision |
|---|----------|---------------------|-----------------|------------------|------------|----------|----------|
| 1 | `getFeatureFlag()` | `boolean` | N/A (Android only) | `bool` | flagName: String, defaultValue: bool | NEW_API | NEW_IMPLEMENTATION |
```

### Example 2: Cross-Platform Analysis

```
Input:
- Platforms: both (android + ios)
- Old Version: 5.0.0
- New Version: 5.1.0

Process:
1. Analyze Android changelog → Find suspendInAppNotifications()
2. Fetch CleverTapAPI.java using web_fetch
3. Search in file and find:
   public void suspendInAppNotifications()
4. Analyze iOS changelog → Find suspendInAppNotifications()
5. Fetch CleverTap.h using web_fetch
6. Search in file and find:
   - (void)suspendInAppNotifications
7. Confirm types match (both void)
8. Confirm NEW_IMPLEMENTATION needed for both

Output:
| # | API Name | Android Return Type | iOS Return Type | Dart Return Type | Platforms | Decision |
|---|----------|---------------------|-----------------|------------------|-----------|----------|
| 1 | `suspendInAppNotifications()` | `void` | `void` | `void` | Android 5.1.0+, iOS 5.1.0+ | NEW_IMPLEMENTATION |
```

### Example 3: Complex Return Types

```
Input:
- Platform: both
- Old Version: 4.1.0
- New Version: 4.2.0

Process:
1. Find NEW_API: getAllInboxMessages()
2. Fetch CleverTapAPI.java using web_fetch
3. Search in file and extract full signature:
   public ArrayList<CTInboxMessage> getAllInboxMessages()
4. Fetch CleverTap.h using web_fetch
5. Search in file and extract full signature:
   - (NSArray<CleverTapInboxMessage *> * _Nullable)getAllInboxMessages
6. Note full native types with generics
7. Map to Dart: List<dynamic> (since we convert messages to Maps)

Output:
| # | API Name | Android Return Type | iOS Return Type | Dart Return Type | Decision |
|---|----------|---------------------|-----------------|------------------|----------|
| 1 | `getAllInboxMessages()` | `ArrayList<CTInboxMessage>` | `NSArray<CleverTapInboxMessage *> *` | `List<dynamic>` | NEW_IMPLEMENTATION |
```

## Success Criteria

Task complete when:
- ✅ All changes between versions extracted and categorized
- ✅ All NEW_API and BREAKING changes have verified native return types from source code
- ✅ Return types were determined by reading ONLY the two main files (no other files were fetched)
- ✅ Implementation plan table shows separate columns for Android and iOS native return types
- ✅ Implementation plan table generated with complete details
- ✅ User has acknowledged the plan before proceeding