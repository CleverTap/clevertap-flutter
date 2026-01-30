---
name: native-sdk-changelog-analysis
description: Analyze CleverTap native SDK changelogs to identify API changes and generate implementation plans for Flutter wrapper updates. Use during SDK version updates, when investigating impact of version changes, planning API wrapper implementations, or reviewing breaking changes before updates.
---

# Native SDK Changelog Analysis

Extract and categorize changes from native Android and iOS SDK changelogs, verify method signatures from source code, and generate structured implementation plans for Flutter wrapper updates.

## Input Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `platform` | string | Yes | Target platform(s) | `"android"`, `"ios"`, or `"both"` |
| `old_version` | string | Yes | Starting version | `"7.0.0"` |
| `new_version` | string | Yes | Target version | `"7.1.0"` |
| `changelog_url` | string | No | Override default URL | Custom GitHub URL |

### Default Changelog URLs

- **Android**: `https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md`
- **iOS**: `https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md`


## Process Overview

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Fetch Changelog Content                            │
├─────────────────────────────────────────────────────────────┤
│ Step 2: Categorize Changes                                 │
├─────────────────────────────────────────────────────────────┤
│ Step 3: Extract Method Information                         │
├─────────────────────────────────────────────────────────────┤
│ Step 4: Determine Return Types (Priority Order)            │
│   → Priority 1: Extract from Changelog                     │
│   → Priority 2: Fetch Native SDK Files                     │
│   → Priority 3: Cross-Platform Inference                   │
│   → Priority 4: Verification Required                      │
├─────────────────────────────────────────────────────────────┤
│ Step 5: Determine Wrapper Requirements                     │
├─────────────────────────────────────────────────────────────┤
│ Step 6: Generate Implementation Plan                       │
│   → Wait for user acknowledgment                           │
└─────────────────────────────────────────────────────────────┘
```

## Detailed Steps

### Step 1: Fetch Changelog Content

**Objective**: Retrieve changelog content between version range (inclusive).

**Process**:
1. Use `web_fetch` to retrieve the changelog from GitHub
2. Extract all entries between `old_version` and `new_version` (inclusive)
3. Handle fetch errors with retry logic (3 attempts, exponential backoff)

**Error Handling**:
```
IF fetch fails after 3 retries THEN
    Report error with URL and last error message
    STOP - Do NOT proceed with guessed data
END IF
```

**Success Criteria**:
- ✅ Changelog content successfully retrieved
- ✅ Version range correctly identified and extracted
- ✅ All entries between versions captured

### Step 2: Categorize Changes

**Objective**: Classify each changelog entry into impact categories.

| Category | Trigger Keywords | Description | Impact Level |
|----------|------------------|-------------|--------------|
| `NEW_API` | "New", "Added", "Introduced" | New public methods/classes/properties | 🟢 Wrapper implementation needed |
| `BREAKING` | "Removed", "Breaking", "Changed signature" | Removed methods or changed signatures | 🟢 Wrapper implementation needed |
| `DEPRECATED` | "Deprecated", "Obsolete" | Marked for future removal but functional | 🟡 Documentation update + future removal warning |
| `BUG_FIX` | "Fixed", "Bug", "Issue" | Bug fixes with no API surface changes | 🔵 No wrapper changes needed |
| `INTERNAL` | "Refactored", "Optimized", "Internal" | Internal changes, no public API impact | 🔵 No wrapper changes needed |

### Step 3: Extract Method Information

**Objective**: For each `NEW_API` or `BREAKING` change, extract complete method details.

**Required Information**:

| Field | Description | Example |
|-------|-------------|---------|
| **Method Name** | Full qualified name | `CleverTapAPI.getAllInboxMessages()` |
| **Parameters** | Name, type, nullable/non-null | `flagName: String, defaultValue: bool` |
| **Platform Version** | SDK version where introduced | `Android 5.1.0+, iOS 5.1.0+` |
| **Return Type** | See Step 4 for determination process | `ArrayList<CTInboxMessage>` |

**Parameter Details to Capture**:
- Parameter name
- Parameter type (native platform type)
- Nullability (`@Nullable`, `_Nullable`, etc.)
- Default values (if any)
- Required vs optional

### Step 4: Determine Return Types

**⚠️ CRITICAL**: Follow this **priority order** to find return types efficiently. Do NOT skip steps or guess.

#### Priority 1: Extract from Changelog

**Check if the changelog entry contains explicit type information.**

**Look for**:
- ✅ Direct type mentions: `"returns ArrayList<String>"`, `"returns NSArray<NSDictionary *> *"`
- ✅ Method signature in code blocks showing the complete signature
- ✅ Code examples showing the return type
- ✅ Usage examples demonstrating the return type

**🚨 CRITICAL - Be Strict**:
Only consider the type "explicit" if you can extract the **complete native type signature**

**Decision**:
```
IF explicit type found in changelog THEN
    Use the explicit type
    Document source: "Type found in changelog entry"
    SKIP to Step 5
ELSE IF vague description (e.g., "returns variant data", "gets messages") THEN
    Proceed to Priority 2
END IF
```

---

#### Priority 2: Fetch Native SDK Files

**⚠️ MANDATORY**: Fetch and search **ONLY** the files listed below. Do NOT fetch or read any other `.h`, `.m`, `.java`, or `.kt` files.

##### For Android APIs

**Single file to fetch**:
```
https://raw.githubusercontent.com/CleverTap/clevertap-android-sdk/master/clevertap-core/src/main/java/com/clevertap/android/sdk/CleverTapAPI.java
```

**Process**:
1. Use `web_fetch` to fetch `CleverTapAPI.java`
2. Search the file content for the method name (case-insensitive, allow partial matches)
3. Extract the **complete** Java signature including:
   - Access modifier (`public`, `private`, `protected`)
   - Return type with generics (e.g., `ArrayList<CTInboxMessage>`)
   - Method name
   - Parameters with types and annotations

**Example signature**:
```java
@NonNull
public ArrayList<CTInboxMessage> getAllInboxMessages();
```

##### For iOS APIs

**Single file to fetch**:
```
https://raw.githubusercontent.com/CleverTap/clevertap-ios-sdk/master/CleverTapSDK/CleverTap.h
```

**Process**:
1. Use `web_fetch` to fetch `CleverTap.h`
2. Search the file content for the method name (case-insensitive, allow partial matches)
3. Extract the **complete** Objective-C signature including:
   - Return type with generics (e.g., `NSArray<CleverTapInboxMessage *> *`)
   - Nullability annotations (`_Nullable`, `_Nonnull`)
   - Method name and parameters

**Example signature**:
```objc
- (NSArray<CleverTapInboxMessage *> * _Nullable)getAllInboxMessages;
```

**Decision**:
```
IF method found in primary file THEN
    Use the native signature
    Document source: "Type verified from CleverTapAPI.java" or "Type verified from CleverTap.h"
    Proceed to Step 5
ELSE IF method NOT found THEN
    Proceed to Priority 3
END IF
```

---

#### Priority 3: Cross-Platform Inference

**Use ONLY when**:
- API exists in BOTH platforms
- Signature found for ONE platform but NOT the other
- Types can be reasonably mapped using the table below

##### Type Mapping Table

| iOS Type | Android Type | Flutter/Dart Type | Notes |
|----------|--------------|-------------------|-------|
| `NSArray<T *> *` | `ArrayList<T>`, `List<T>` | `List<T>`         | Ordered collection |
| `NSDictionary<K, V> *` | `Map<K, V>`, `HashMap<K, V>` | `Map<K, V>`       | Key-value pairs |
| `NSString *` | `String` | `String`          | Text |
| `NSNumber *` | `Integer`, `Long`, `Double` | `int`, `double`   | Numeric values |
| `int`, `NSInteger` | `int`, `Integer` | `int`             | Integers |
| `BOOL` | `boolean` | `bool`            | Boolean |
| `void` | `void` | `void`            | No return |
| `id` | `Object` | `dynamic`         | Any type |
| `NSArray<NSDictionary *> *` | `ArrayList<HashMap>`, `List<Map>` | `List?`           | List of maps |

**Process**:
```
IF Android signature found BUT iOS missing THEN
    Use mapping table to infer iOS type
    Document: "// Inferred from Android: ArrayList<CTInboxMessage> → NSArray<CleverTapInboxMessage *> *"
    Proceed to Step 5
ELSE IF iOS signature found BUT Android missing THEN
    Use mapping table to infer Android type
    Document: "// Inferred from iOS: NSArray<CleverTapInboxMessage *> * → ArrayList<CTInboxMessage>"
    Proceed to Step 5
ELSE
    Proceed to Priority 4
END IF
```

**Example Inference**:
- **Found in Android**: `public Map<String, Object> getVariants()`
- **Inferred for iOS**: `- (NSDictionary<NSString *, id> *)getVariants`
- **Dart Type**: `Map<String, dynamic>`

---

#### Priority 4: Method Not Found - Verification Required

**When to use**: After all previous priorities exhausted without finding the signature.

**Process**:

1. **Verify with user**:
   ```
   I couldn't find `methodName()` in the public API files:
   - iOS: CleverTap.h
   - Android: CleverTapAPI.java
   
   Could you verify:
   1. The exact method name from the changelog?
   2. Is this a public-facing API or internal/private?
   3. Could it be in a different class or module?
   4. Is the SDK version correct?
   ```

2. **Do NOT proceed** with implementation until confirmed

3. **Suggest alternatives**:
   - Search for similar method names in the files
   - Check if it's a property instead of a method
   - Verify the SDK version supports this API
   - Check if method is in a category/extension file

**Decision**:
```
IF user confirms method name and location THEN
    Re-fetch appropriate file and search again
ELSE IF user provides clarification THEN
    Adjust search and retry
ELSE
    Mark as "VERIFICATION_REQUIRED" in output
    Do NOT implement without confirmation
END IF
```

### Step 5: Determine Wrapper Requirements

**Objective**: Decide what action is needed for each identified change.

**Decision Tree**:
```
Is this API already exposed in Flutter wrapper?
├─ YES → Does signature or behavior need updating?
│  ├─ YES → Decision: UPDATE
│  └─ NO → Decision: NO_ACTION
└─ NO → Is this commonly used functionality?
   ├─ YES → Decision: NEW_IMPLEMENTATION
   ├─ MAYBE → Decision: DISCUSS
   └─ NO → Decision: SKIP
```

**Decision Categories**:

| Decision | Meaning | Action Required |
|----------|---------|-----------------|
| `NEW_IMPLEMENTATION` | Brand new API, wrapper needed | Implement Flutter method + platform channels + tests + docs |
| `UPDATE` | Existing wrapper needs changes | Update method signature + platform handlers + tests + docs |
| `DISCUSS` | Unclear if needed | Ask user: "Should we implement X?" |
| `NO_ACTION` | Already implemented, no changes | None |
| `SKIP` | Not commonly used or internal | None |

---

### Step 6: Generate Implementation Plan

**⚠️ CRITICAL**: The output table MUST show **native platform return types** (Android and iOS columns separate), NOT Dart types in those columns.

**Output Format**:

```markdown
## Wrapper Implementation Plan

### Summary
- Platform(s): Android, iOS
- Version Range: 5.0.0 → 5.1.0
- Total Changes: 8
  - NEW_API: 3
  - BREAKING: 1
  - DEPRECATED: 1
  - BUG_FIX: 2
  - INTERNAL: 1

---

### 🟢 APIs Requiring Implementation (NEW_API)

| # | API Name | Android Return Type | iOS Return Type | Dart Return Type | Parameters | Platforms | Decision |
|---|----------|---------------------|-----------------|------------------|------------|-----------|----------|
| 1 | `getAllInboxMessages()` | `ArrayList<CTInboxMessage>` | `NSArray<CleverTapInboxMessage *> *` | `List<dynamic>` | none | Android 5.0.0+<br>iOS 4.2.0+ | NEW_IMPLEMENTATION |
| 2 | `setOptOut(enabled)` | `void` | `void` | `void` | `enabled: bool` | Android 4.5.0+<br>iOS 4.5.0+ | NEW_IMPLEMENTATION |
| 3 | `getFeatureFlag(name, default)` | `boolean` | `BOOL` | `bool` | `name: String`<br>`defaultValue: bool` | Android 5.1.0+ (only) | NEW_IMPLEMENTATION |

**Notes**:
- API #1: Type verified from both CleverTapAPI.java and CleverTap.h
- API #2: Type verified from both native files
- API #3: Android-only API, no iOS equivalent

---

### 🔴 Breaking Changes (Immediate Attention Required)

| # | API Name | Change Description | Impact | Platforms | Decision |
|---|----------|-------------------|--------|-----------|----------|
| 1 | `oldMethod()` | **Removed** in favor of `newMethod()` | Existing Flutter wrapper will break | Android 7.1.0+ | UPDATE |

**Migration Required**:
- Update Flutter wrapper to use `newMethod()` instead
- Update example app and documentation

---

### 🟡 Deprecated APIs (Future Removal)

| # | API Name | Replacement | Estimated Removal | Platforms | Decision |
|---|----------|-------------|-------------------|-----------|----------|
| 1 | `legacyMethod()` | Use `modernMethod()` instead | 8.0.0 | Android 7.1.0+<br>iOS 7.1.0+ | UPDATE |

**Action Required**:
- Add `@deprecated` annotation to Flutter wrapper method
- Update documentation with migration path
- No immediate code changes needed

---

### 🔵 Bug Fixes (No Wrapper Changes)

- Fixed: Crash in push notification rendering on Android 14
- Fixed: Memory leak in InApp message caching

---

### ⚪ Internal Changes (No Action Required)

- Refactored network layer implementation
- Optimized JSON parsing performance

---

## Next Steps

**⚠️ IMPORTANT**: Please review this plan and confirm before I proceed with implementation.

Reply with:
- ✅ "Approved" - to proceed with all implementations
- 🔄 "Approved with changes" - specify which items to modify
- ❌ "Hold" - if you need to review further

Once approved, I will:
1. Implement each NEW_IMPLEMENTATION item
2. Update affected wrapper methods for UPDATE items
3. Add deprecation notices for DEPRECATED items
4. Update documentation and tests
```

**⚠️ CRITICAL**: Wait for user acknowledgment before proceeding with any implementation.

## Usage Examples

### Example 1: Analyze Android SDK Update

**Input**:
```
Platform: android
Old Version: 5.0.0
New Version: 5.1.0
```

**Process**:
1. Fetch Android changelog from GitHub
2. Extract entries between 5.0.0 and 5.1.0
3. Find NEW_API: `getFeatureFlag(String flagName, boolean defaultValue)`
4. Fetch `CleverTapAPI.java` using `web_fetch`
5. Search file content and find:
   ```java
   @NonNull
   public boolean getFeatureFlag(@NonNull String flagName, boolean defaultValue)
   ```
6. Categorize as `NEW_IMPLEMENTATION`

**Output**:
| # | API Name | Android Return Type | iOS Return Type | Dart Return Type | Parameters | Decision |
|---|----------|---------------------|-----------------|------------------|------------|----------|
| 1 | `getFeatureFlag()` | `boolean` | N/A (Android only) | `bool` | `flagName: String`<br>`defaultValue: bool` | NEW_IMPLEMENTATION |

---

### Example 2: Cross-Platform Analysis

**Input**:
```
Platform: both
Old Version: 5.0.0
New Version: 5.1.0
```

**Process**:
1. Analyze Android changelog → Find `suspendInAppNotifications()`
2. Fetch `CleverTapAPI.java`
3. Find signature:
   ```java
   public void suspendInAppNotifications()
   ```
4. Analyze iOS changelog → Find `suspendInAppNotifications`
5. Fetch `CleverTap.h`
6. Find signature:
   ```objc
   - (void)suspendInAppNotifications;
   ```
7. Confirm types match (both `void`)
8. Categorize as `NEW_IMPLEMENTATION` for both platforms

**Output**:
| # | API Name | Android Return Type | iOS Return Type | Dart Return Type | Platforms | Decision |
|---|----------|---------------------|-----------------|------------------|-----------|----------|
| 1 | `suspendInAppNotifications()` | `void` | `void` | `void` | Android 5.1.0+<br>iOS 5.1.0+ | NEW_IMPLEMENTATION |

---

### Example 3: Complex Return Types with Generics

**Input**:
```
Platform: both
Old Version: 4.1.0
New Version: 4.2.0
```

**Process**:
1. Find NEW_API: `getAllInboxMessages()`
2. Fetch `CleverTapAPI.java`
3. Extract full signature:
   ```java
   @NonNull
   public ArrayList<CTInboxMessage> getAllInboxMessages()
   ```
4. Fetch `CleverTap.h`
5. Extract full signature:
   ```objc
   - (NSArray<CleverTapInboxMessage *> * _Nullable)getAllInboxMessages;
   ```
6. Note full native types with generics and nullability
7. Map to Dart: `List<dynamic>` (messages converted to Maps in platform channel)

**Output**:
| # | API Name | Android Return Type | iOS Return Type | Dart Return Type | Decision |
|---|----------|---------------------|-----------------|------------------|----------|
| 1 | `getAllInboxMessages()` | `ArrayList<CTInboxMessage>` | `NSArray<CleverTapInboxMessage *> *` | `List<dynamic>` | NEW_IMPLEMENTATION |

**Note**: Output table correctly shows **native platform types** in Android/iOS columns, NOT the Dart type.

### Example 4: Method Not Found - Verification Required

**Input**:
```
Platform: android
Old Version: 6.0.0
New Version: 6.1.0
```

**Process**:
1. Changelog mentions: "Added getVariants() method"
2. Fetch `CleverTapAPI.java`
3. Search for "getVariants" → NOT FOUND
4. Search for "variant" → Found `getProductConfigVariants()` instead

**Output to User**:
```
I couldn't find `getVariants()` in CleverTapAPI.java.

However, I found a similar method: `getProductConfigVariants()`

Could you verify:
1. Is the correct method name `getVariants()` or `getProductConfigVariants()`?
2. Could this be in a different class (e.g., ProductConfig.java)?
3. Is this method public-facing?

Please confirm before I proceed with the implementation.
```

**Wait for user confirmation before continuing.**

## Success Criteria

Task is complete when:

**Content Verification**:
- ✅ All changes between versions extracted and categorized
- ✅ All NEW_API and BREAKING changes have verified native return types

**Output Quality**:
- ✅ Implementation plan table generated with complete details
- ✅ Table shows separate columns for Android and iOS **native return types**
- ✅ Dart return types in separate column (not mixed with native types)
- ✅ All parameters documented with types and nullability

**User Communication**:
- ✅ Implementation plan presented clearly
- ✅ User has acknowledged the plan before proceeding
- ✅ Any uncertainties flagged and verified with user
