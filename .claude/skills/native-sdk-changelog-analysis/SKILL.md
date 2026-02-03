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
│   → Priority 1: Fetch Native SDK Files ⚠️ MANDATORY        │
│   → Priority 2: Cross-Platform Inference (if one missing)  │
│   → Priority 3: Ask user (if method not found)             │
├─────────────────────────────────────────────────────────────┤
│ Step 5: Determine Wrapper Requirements                     │
├─────────────────────────────────────────────────────────────┤
│ Step 6: Generate Implementation Plan (SINGLE TABLE)        │
│   → Wait for user acknowledgment                           │
└─────────────────────────────────────────────────────────────┘
```

**⚠️ KEY RULE**: For ALL `NEW_API` items, you MUST fetch and verify return types from `CleverTapAPI.java` (Android) and/or `CleverTap.h` (iOS). NEVER assume types from changelog descriptions alone.

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

**⚠️ CRITICAL**: For ALL `NEW_API` and `BREAKING` changes, you MUST determine return types from native source code. Do NOT rely solely on changelog descriptions. 
Make sure this SKILL doesn't determine the return type for the Dart layer. Follow the priorities strictly

#### Priority 1: Fetch Native SDK Files (MANDATORY)

**⚠️ MANDATORY FOR ALL NEW_API ITEMS**: You MUST fetch and determine return types from native source code. Skipping this step leads to incorrect type assumptions.

Fetch and search **ONLY** the files listed below. Do NOT fetch or read any other `.h`, `.m`, `.java`, or `.kt` files.

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

##### For Android APIs

**Single file to fetch**:
```
https://raw.githubusercontent.com/CleverTap/clevertap-android-sdk/master/clevertap-core/src/main/java/com/clevertap/android/sdk/CleverTapAPI.java
```

**Process**:
1. Use `web_fetch` to fetch `CleverTapAPI.java` and read from the bottom
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

**Decision**:
```
IF method found in primary file THEN
    Use the native signature
    Document source: "Type verified from CleverTapAPI.java" or "Type verified from CleverTap.h"
    Proceed to Step 5
ELSE IF method NOT found THEN
    Proceed to Priority 2
END IF
```

#### Priority 2: Cross-Platform Inference

**Use when**:
- API exists in BOTH platforms as deduced from the Changelog URLs
- Signature found for ONE platform in the primary file but NOT the other
- Types can be reasonably mapped using the table below

##### Type Mapping Table

| Android Type | iOS Type | Notes                    |
|--------------|----------|--------------------------|
| `ArrayList<T>`, `List<T>` | `NSArray<T *> *` | Ordered collection       |
| `Map<K, V>`, `HashMap<K, V>` | `NSDictionary<K, V> *` | Key-value pairs          |
| `String` | `NSString *` | Text                     |
| `Integer`, `Long` | `NSNumber *`, `NSInteger` | Integers                 |
| `Double` | `NSNumber *` | Floating point           |
| `boolean` | `BOOL` | Boolean                  |
| `void` | `void` | No return                |
| `Object` | `id` | Any type                 |
| `ArrayList<HashMap>` | `NSArray<NSDictionary *> *` | List of maps of any type |

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
    Proceed to Priority 3
END IF
```

#### Priority 3: Method Not Found - Verification Required

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
   3. Is the SDK version correct?
   ```

2. **Do NOT proceed** with implementation until confirmed

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

### Step 6: Generate Implementation Plan (SINGLE TABLE OUTPUT)

**⚠️ CRITICAL**: The table MUST show **native platform return types** (Android and iOS columns separate) as determined in Step 4

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
   
### All Changes (Single Unified Table)

| # | Category | API Name | Android Type | iOS Type | Parameters | Platforms | Decision | Notes |
|---|----------|----------|--------------|----------|------------|-----------|----------|-------|
| 1 | 🟢 NEW_API | `getAllInboxMessages()` | `ArrayList<CTInboxMessage>` | `NSArray<CleverTapInboxMessage *> *` | none | Android 5.0.0+<br>iOS 4.2.0+ | NEW_IMPLEMENTATION | Type verified from both native files |
| 2 | 🟢 NEW_API | `setOptOut(enabled)` | `void` | `void` | `enabled: bool` | Android 4.5.0+<br>iOS 4.5.0+ | NEW_IMPLEMENTATION | |
| 3 | 🟢 NEW_API | `getFeatureFlag(name, default)` | `boolean` | N/A | `name: String`<br>`defaultValue: bool` | Android 5.1.0+ | NEW_IMPLEMENTATION | Android-only API |
| 4 | 🔴 BREAKING | `oldMethod()` | N/A | N/A | none | Android 7.1.0+ | UPDATE | Removed – use `newMethod()` instead. Update wrapper. |
| 5 | 🟡 DEPRECATED | `legacyMethod()` | `String` | `NSString *` | none | Android 7.1.0+<br>iOS 7.1.0+ | UPDATE | Add `@deprecated`, document replacement: `modernMethod()` |
| 6 | 🔵 BUG_FIX | Push notification crash | - | - | - | Android 14+ | NO_ACTION | Fixed crash in rendering |
| 7 | 🔵 BUG_FIX | InApp memory leak | - | - | - | Android, iOS | NO_ACTION | Fixed memory leak in caching |
| 8 | ⚪ INTERNAL | Network layer refactor | - | - | - | Android, iOS | NO_ACTION | Internal optimization |

**Legend**:
- 🟢 NEW_API: New functionality requiring implementation
- 🔴 BREAKING: Breaking change requiring immediate wrapper update
- 🟡 DEPRECATED: Deprecated but functional, needs documentation
- 🔵 BUG_FIX: Bug fix, usually no wrapper changes
- ⚪ INTERNAL: Internal change, no action needed

## Next Steps

**⚠️ IMPORTANT**: Please review this plan and confirm before I proceed with implementation.

Reply with:
- ✅ "Approved" - to proceed with all implementations
- 🔄 "Approved with changes" - specify which items to modify
- ❌ "Hold" - if you need to review further

Once approved, I will:
1. Implement each item marked `NEW_IMPLEMENTATION`
2. Update items marked `UPDATE`
3. Update documentation and tests for all changes
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

**Output (Single Table)**:
| # | Category | API Name | Android Type | iOS Type | Parameters | Decision | Notes |
|---|----------|----------|--------------|----------|------------|----------|-------|
| 1 | 🟢 NEW_API | `getFeatureFlag()` | `boolean` | N/A | `flagName: String`<br>`defaultValue: bool` | NEW_IMPLEMENTATION | Android-only API

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
3. Find signature: `public void suspendInAppNotifications()`
4. Analyze iOS changelog → Find `suspendInAppNotifications`
5. Fetch `CleverTap.h`
6. Find signature: `- (void)suspendInAppNotifications;`
7. Confirm types match (both `void`)
8. Categorize as `NEW_IMPLEMENTATION` for both platforms

**Output (Single Table)**:
| # | Category | API Name | Android Type | iOS Type | Parameters | Decision | Notes |
|---|----------|----------|--------------|----------|------------|----------|-------|
| 1 | 🟢 NEW_API | `getFeatureFlag()` | `boolean` | N/A | `flagName: String`<br>`defaultValue: bool` | NEW_IMPLEMENTATION | Android-only API |

### Example 3: Mixed Categories

**Input**:
```
Platform: both
Old Version: 6.0.0
New Version: 6.2.0
```

**Output (Single Table showing all categories)**:
| # | Category | API Name | Android Type | iOS Type | Platforms | Decision | Notes |
|---|----------|----------|--------------|----------|-----------|----------|-------|
| 1 | 🟢 NEW_API | `getVariants()` | `Map<String, Object>` | `NSDictionary<NSString *, id> *` | Android 6.1.0+<br>iOS 6.1.0+ | NEW_IMPLEMENTATION | |
| 2 | 🔴 BREAKING | `pushEvent()` | Signature changed | Signature changed | Both | UPDATE | Added required parameter |
| 3 | 🟡 DEPRECATED | `getLocation()` | `String` | `NSString *` | Both | UPDATE | Use `getCurrentLocation()` |
| 4 | 🔵 BUG_FIX | Image caching | - | - | iOS 15+ | NO_ACTION | Fixed memory issue |
| 5 | ⚪ INTERNAL | Database upgrade | - | - | Both | NO_ACTION | Performance improvement |

## Success Criteria

Task is complete when:

**Content Verification**:
- ✅ All changes between versions extracted and categorized
- ✅ All NEW_API and BREAKING changes have verified native return types
- ✅ Return types verified by fetching CleverTapAPI.java and/or CleverTap.h (NOT assumed from changelog)

**Output Quality**:
- ✅ **SINGLE table** generated showing all changes
- ✅ Table shows separate columns for Android and iOS **native return types**
- ✅ All parameters documented with types and nullability
- ✅ Category clearly indicated with emoji and text

**User Communication**:
- ✅ Implementation plan presented clearly
- ✅ User has acknowledged the plan before proceeding
- ✅ Any uncertainties flagged and verified with user
