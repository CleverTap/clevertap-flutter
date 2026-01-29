# Skill: Native SDK Changelog Analysis

**Purpose**: Analyze CleverTap native SDK changelogs to identify API changes and generate implementation plans for Flutter wrapper updates.

**When to Use**:
- During SDK version updates (called by update-sdk command)
- Investigating impact of specific version changes
- Planning API wrapper implementations
- Reviewing breaking changes before updates

---

## Overview

This skill extracts and categorizes changes from native Android and iOS SDK changelogs, verifies method signatures from source code, and generates a structured implementation plan for Flutter wrapper updates.

**Key Capabilities**:
- Parse changelog entries between version ranges
- Categorize changes by impact type
- Verify exact method signatures from source code
- Generate wrapper implementation decision matrix
- Identify breaking changes requiring immediate attention

---

## Input Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `platform` | string | Target platform | "android" or "ios" |
| `old_version` | string | Starting version | "7.0.0" |
| `new_version` | string | Target version | "7.1.0" |
| `changelog_url` | string (optional) | Override default URL | Custom URL |

**Default Changelog URLs**:
- **Android**: `https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md`
- **iOS**: `https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md`

---

## Process

### Step 1: Fetch Changelog Content

1. Fetch changelog from GitHub
2. Extract content between version range (inclusive)
3. Handle fetch errors with retry logic (3 attempts, exponential backoff)

**Error Handling**:
```
IF fetch fails after 3 retries THEN
    Report error with URL and last error message
    STOP - Do not proceed with guessed data
END IF
```

### Step 2: Categorize Changes

Parse each changelog entry and categorize:

| Category | Criteria | Impact |
|----------|----------|--------|
| `NEW_API` | New public methods/classes introduced | Wrapper implementation needed |
| `DEPRECATED` | Methods marked deprecated but still functional | Documentation update, future removal warning |
| `BREAKING` | Methods removed or signatures changed | Immediate wrapper update required |
| `BUG_FIX` | Bug fixes with no API surface changes | No wrapper changes needed |
| `INTERNAL` | Internal refactoring, no public API impact | No action needed |

**Parsing Rules**:
- Look for keywords: "New", "Added", "Introduced", "Deprecated", "Removed", "Breaking"
- Check method signatures in code blocks
- Identify class/method names in backticks or code formatting

### Step 3: Extract Method Signatures

**For each NEW_API or BREAKING change**, extract complete signature details:

#### Required Information

1. **Method Name**:
   - Full qualified name if applicable: `CleverTapAPI.methodName()`

2. **Return Type**:
   - Primitive types: `void`, `boolean`, `int`, `long`, `double`, `float`
   - Objects: `String`, `JSONObject`, `JSONArray`
   - Collections: `List<T>`, `Map<K,V>`, `Set<T>` (include generic types)
   - SDK-specific types: `CTInboxMessage`, `EventDetail`, `UTMDetail`, etc.
   - Nullable annotations: `@Nullable` or `@NonNull`

3. **Parameters**:
   - Name and type for each parameter
   - Nullable/NonNull annotations
   - Default values (Kotlin methods)
   - Required vs optional indicators

4. **Platform Version**:
   - Android SDK version where introduced/changed
   - iOS SDK version where introduced/changed

### Step 4: Verify Return Types from Source Code

**⚠️ CRITICAL: NEVER assume or guess return types from changelog descriptions.**

Changelogs use vague language like "returns variant data" without specifying exact types. You **MUST** verify from native SDK source code.

#### Verification Process (MANDATORY)

**For iOS APIs**:

1. Fetch the main public header file:
   ```
   URL: https://raw.githubusercontent.com/CleverTap/clevertap-ios-sdk/master/CleverTapSDK/CleverTap.h
   ```

2. Search for the exact method name

3. Extract complete Objective-C signature:
   ```objc
   - (NSArray<NSDictionary<NSString *, id> *> * _Nonnull)variants;
   ```

4. Parse return type:
   - `NSArray` → Dart `List`
   - `NSDictionary` → Dart `Map`
   - `NSArray<NSDictionary*>` → Dart `List<Map>`
   - Note nullability: `_Nonnull`, `_Nullable`

**For Android APIs**:

1. Search in priority order:
   ```
   Primary: https://raw.githubusercontent.com/CleverTap/clevertap-android-sdk/master/clevertap-core/src/main/java/com/clevertap/android/sdk/CleverTapAPI.java
   ```

2. Search for method name in file content

3. Extract Java/Kotlin signature:
   ```java
   public List<Map<String, Object>> getVariants();
   ```

4. Parse return type and generics

**Cross-Platform Verification**:

Compare return types across platforms - they should be equivalent:

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
- ❌ Trusting changelog descriptions like "returns variant information"
- ❌ Guessing based on method name semantics
- ❌ Assuming types without checking source code
- ❌ Using incorrect generic type parameters

**If Source Code Not Found**:
1. Report exact search performed
2. List files checked
3. Ask user to manually verify or provide signature
4. Do NOT proceed with implementation until confirmed

### Step 5: Determine Wrapper Requirements

For each API change, decide on action needed:

```
Decision Tree:

Is this API already exposed in Flutter?
├─ YES → Does signature/behavior need updating?
│  ├─ YES → Mark for UPDATE
│  └─ NO → Mark as NO_ACTION (already handled)
└─ NO → Is this commonly used functionality?
   ├─ YES → Mark for NEW_IMPLEMENTATION
   ├─ MAYBE → Mark for DISCUSS (low priority, ask user)
   └─ NO → Mark as SKIP (internal/rare use case)
```

---

## Output Format

### Wrapper Implementation Plan

Generate a structured table for ALL APIs requiring action:

```markdown
## Wrapper Implementation Plan

### APIs Requiring Implementation

| # | API Name | Return Type | Parameters | Category | Platforms | Decision |
|---|----------|-------------|------------|----------|-----------|----------|
| 1 | `getVariants()` | `List<Map<String, dynamic>>` | none | NEW_API | Android 7.1.0+, iOS 7.1.0+ | NEW_IMPLEMENTATION |
| 2 | `setOptOut(enabled)` | `void` | enabled: bool | NEW_API | Android 7.1.0+, iOS 7.1.0+ | NEW_IMPLEMENTATION |
| 3 | `recordEvent(name, props)` | `void` | name: String, props: Map? | UPDATED_API | Android 7.1.0+, iOS 7.1.0+ | UPDATE (added optional param) |

### Breaking Changes (Immediate Attention)

| # | API Name | Change Description | Impact | Platforms |
|---|----------|-------------------|--------|-----------|
| 1 | `oldMethod()` | Removed in favor of `newMethod()` | BREAKING | Android 7.1.0+ |

### Deprecated APIs (Future Removal)

| # | API Name | Replacement | Removal Version | Platforms |
|---|----------|-------------|-----------------|-----------|
| 1 | `legacyMethod()` | Use `modernMethod()` instead | 8.0.0 (estimated) | Android 7.1.0+, iOS 7.1.0+ |

### No Action Required

- Bug fix: Crash in push notification rendering on Android 14
- Internal: Refactored network layer implementation
- Performance: Optimized event batching logic
```

**CRITICAL**: Output this plan and **wait for user acknowledgment** before proceeding with implementation.

---

## Change Category Details

### NEW_API
**Characteristics**:
- Brand new public method/class/property
- Not previously available in any form
- Adds new functionality

**Action Required**:
- Implement Flutter wrapper method
- Add platform channel handlers (Android/iOS)
- Update example app with usage
- Document in README/API docs

**Example**:
```
Added getVariants() method to retrieve product variants
→ NEW_IMPLEMENTATION required
```

### BREAKING
**Characteristics**:
- Existing API removed entirely
- Method signature changed (params, return type)
- Behavior fundamentally altered

**Action Required**:
- Update existing Flutter wrapper
- Migrate existing Flutter code
- Add migration notes to changelog
- Consider deprecation path for Flutter API

**Example**:
```
recordEvent() now requires Map<String, dynamic> instead of JSONObject
→ UPDATE required with migration guide
```

### DEPRECATED
**Characteristics**:
- Method marked for future removal
- Still functional but discouraged
- Alternative method available

**Action Required**:
- Add deprecation warning to Flutter wrapper
- Document replacement in dartdoc
- Plan future removal in Flutter SDK

**Example**:
```
setLocation() deprecated, use setUserLocation() instead
→ Add @deprecated annotation, update docs
```

### BUG_FIX
**Characteristics**:
- Fixes incorrect behavior
- No API signature changes
- No new functionality

**Action Required**:
- Usually no wrapper changes needed
- May need to update example app if bug affected demo
- Note in changelog if user-facing

**Example**:
```
Fixed crash when recording events with null properties
→ NO_ACTION (Flutter wrapper unchanged)
```

### INTERNAL
**Characteristics**:
- Refactoring/optimization
- No public API changes
- Implementation details only

**Action Required**:
- No wrapper changes needed
- May note in changelog as "Updated native SDK"

**Example**:
```
Refactored internal threading model for better performance
→ NO_ACTION (transparent to Flutter layer)
```

---

## Verification Checklist

Before outputting the implementation plan, verify:

- ✅ All NEW_API entries have verified return types from source code
- ✅ Platform versions correctly noted (Android X.Y.Z+, iOS X.Y.Z+)
- ✅ Method signatures include full parameter details
- ✅ Cross-platform consistency checked (iOS ↔ Android types match)
---

## Error Scenarios

### Changelog Fetch Failure
```
❌ Error: Failed to fetch Android changelog after 3 attempts
URL: https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md
Last error: Network timeout

Action: Cannot proceed with analysis. Please check network or provide changelog manually.
```

### Version Not Found
```
❌ Error: Version 7.5.0 not found in changelog
Available versions: 7.0.0, 7.0.1, 7.1.0, 7.2.0

Action: Please verify version number or specify a different version range.
```

### Source Code Signature Not Found
```
⚠️ Warning: Could not verify return type for getVariants()
Searched: CleverTapAPI.java, CleverTap.h
Changelog description: "Returns variant information"

Action: Manual verification needed. Please provide method signature or skip this API.
```

### Ambiguous Categorization
```
⚠️ Warning: Unclear if API change is BREAKING or NEW_API
Entry: "Updated recordEvent to accept optional metadata parameter"

Action: Need clarification - is this backward compatible or breaking change?
```

---

## Usage Examples

### Example 1: Analyze Android SDK Update

```
Input:
- Platform: android
- Old Version: 7.0.0
- New Version: 7.1.0

Process:
1. Fetch Android changelog
2. Extract entries between 7.0.0 and 7.1.0
3. Find NEW_API: getVariants()
4. Verify signature from CleverTapAPI.java:
   public List<Map<String, Object>> getVariants()
5. Categorize as NEW_IMPLEMENTATION

Output:
| # | API Name | Return Type | Parameters | Category | Decision |
|---|----------|-------------|------------|----------|----------|
| 1 | `getVariants()` | `List<Map<String, dynamic>>` | none | NEW_API | NEW_IMPLEMENTATION |
```

### Example 2: Identify Breaking Changes

```
Input:
- Platform: ios
- Old Version: 6.9.0
- New Version: 7.0.0

Process:
1. Fetch iOS changelog
2. Detect major version bump (6.x → 7.x)
3. Find BREAKING: Removed deprecated setLocation()
4. Find NEW_API: setUserLocation() as replacement
5. Generate migration guidance

Output:
Breaking Changes:
| # | API Name | Change | Impact |
|---|----------|--------|--------|
| 1 | `setLocation()` | Removed | Use setUserLocation() instead |

Migration: Update Flutter wrapper to use new method, add deprecation warning
```

### Example 3: Cross-Platform Analysis

```
Input:
- Platforms: both (android + ios)
- Old Version: 7.0.0
- New Version: 7.1.0

Process:
1. Analyze Android changelog → Find getVariants()
2. Analyze iOS changelog → Find getVariants()
3. Verify signatures match:
   - Android: List<Map<String, Object>>
   - iOS: NSArray<NSDictionary<NSString *, id> *>
   - Dart equivalent: List<Map<String, dynamic>>
4. Confirm NEW_IMPLEMENTATION needed for both platforms

Output:
| # | API Name | Return Type | Platforms | Decision |
|---|----------|-------------|-----------|----------|
| 1 | `getVariants()` | `List<Map<String, dynamic>>` | Android 7.1.0+, iOS 7.1.0+ | NEW_IMPLEMENTATION |
```

---

## Integration with Other Skills

This skill is designed to integrate with:

- **update-sdk command**: Called during Phase 2 of SDK update process
- **api-wrapper-patterns**: Uses output to guide wrapper implementation
- **changelog-generation**: Provides categorized changes for Flutter changelog entries

---

## Success Criteria

Task complete when:
- ✅ All changes between versions extracted and categorized
- ✅ All NEW_API and BREAKING changes have verified signatures from source code
- ✅ Implementation plan table generated with complete details
- ✅ User has acknowledge``d the plan before proceeding

---
