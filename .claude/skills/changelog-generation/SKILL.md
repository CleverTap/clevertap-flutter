# Skill: Changelog Generation

**Purpose**: Generate properly formatted changelog entries for CleverTap Flutter SDK releases

**When to use**:
- After updating native SDK versions
- When adding new features
- When fixing bugs
- For any release

---

## Critical Rules

### Rule 1: Always Add at TOP
New entries MUST be added at the very top of `CHANGELOG.md`, before all existing entries.

### Rule 2: Strict Date Format
Date format: `(DD Month YYYY)`
- ✅ Correct: `(23 January 2026)`
- ❌ Wrong: `(2026-01-23)`, `(Jan 23, 2026)`, `(23/01/2026)`

### Rule 3: Platform Tags
Use exactly these tags:
- `[Android Platform]`
- `[iOS Platform]`
- `[Web Platform]`
- `[Android and iOS Platform]` (when both affected)

### Rule 4: Link Native SDK Changelogs
Always link to native SDK changelogs with version anchors.

### Rule 5: Maintain Indentation
Use 2 spaces for nested bullets.

---

## Entry Template

```markdown
Version X.X.X *(DD Month YYYY)*
-------------------------------------------
**What's new**
* **[Platform Name]**
  * Supports [CleverTap Platform SDK vX.X.X](link-with-anchor).
  * Additional feature details...

**API changes** (if applicable)
* **[Platform Name]**
  * New API: `methodName(params)` - Description
  * Deprecated: `oldMethod()` - Use `newMethod()` instead

**Breaking Changes** (if applicable)
* **[Platform Name]**
  * Removed: `deprecatedAPI()` - Migration guide

**Bug Fixes** (if applicable)
* **[Platform Name]**
  * Fixes description of fix
```

---

## Version Anchor Format

### Android SDK
Format: `#version-XYZ-month-day-year` (no dots, lowercase month)

**How to generate**:
1. Remove dots from version: `7.7.1` → `771`
2. Convert month to lowercase: `December` → `december`
3. Use day as-is: `2`
4. Use year as-is: `2025`
5. Combine: `#version-771-december-2-2025`

**Examples**:
| Version | Date | Anchor |
|---------|------|--------|
| `7.7.1` | Dec 2, 2025 | `#version-771-december-2-2025` |
| `7.6.0` | Oct 17, 2025 | `#version-760-october-17-2025` |
| `8.0.0` | Jan 1, 2026 | `#version-800-january-1-2026` |

### iOS SDK
Format: `#version-X-Y-Z-month-day-year` (keeps dots as dashes, lowercase month)

**How to generate**:
1. Replace dots with dashes: `7.4.2` → `7-4-2`
2. Convert month to lowercase: `January` → `january`
3. Use day as-is: `14`
4. Use year as-is: `2026`
5. Combine: `#version-742-january-14-2026`

**Examples**:
| Version | Date | Anchor |
|---------|------|--------|
| `7.4.2` | Jan 14, 2026 | `#version-742-january-14-2026` |
| `7.3.3` | Sep 20, 2025 | `#version-733-september-20-2025` |
| `8.0.0` | Feb 1, 2026 | `#version-800-february-1-2026` |

---

## Complete Examples

### Example 1: Native SDK Update Only

```markdown
Version 3.7.0 *(23 January 2026)*
-------------------------------------------
**What's new**

* **[Android Platform]**
  * Supports [CleverTap Android SDK v7.7.1](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-771-december-2-2025).

* **[iOS Platform]**
  * Supports [CleverTap iOS SDK v7.4.2](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-742-january-14-2026).
```

### Example 2: With New API

```markdown
Version 3.8.0 *(15 February 2026)*
-------------------------------------------
**What's new**

* **[Android Platform]**
  * Supports [CleverTap Android SDK v7.8.0](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-780-january-30-2026).

* **[iOS Platform]**
  * Supports [CleverTap iOS SDK v7.5.0](https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-750-february-1-2026).

**API changes**
* **[Android and iOS Platform]**
  * New API: `getExperimentVariants()` - Returns all active A/B experiment variants
  * New API: `setCustomInAppListener(callback)` - Allows custom handling of in-app notifications
```

### Example 3: With Bug Fix

```markdown
Version 3.6.1 *(5 February 2026)*
-------------------------------------------
**Bug Fixes**
* **[Android Platform]**
  * Fixes a crash in push notification handling on Android 15
```

### Example 4: Breaking Changes

```markdown
Version 4.0.0 *(1 March 2026)*
-------------------------------------------
**What's new**

* **[Android Platform]**
  * Supports [CleverTap Android SDK v8.0.0](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-800-february-20-2026).

**Breaking Changes**
* **[Android and iOS Platform]**
  * Removed: `recordEvent(String eventName, Map<String, dynamic> properties)` signature deprecated in v3.5.0
  * Migration: Use `recordEvent(String eventName, {Map<String, dynamic>? properties})` instead
  * Minimum Flutter SDK version increased to 3.0.0
```

---

## Changelog Link Validation

After generating changelog entry, verify links are accessible:

**Links to validate**:
1. Android SDK changelog link
2. iOS SDK changelog link

**How to validate**:

Using curl:
```bash
# Android changelog link
curl -s -o /dev/null -w "%{http_code}" "https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md#version-771-december-2-2025"
# Expected: 200

# iOS changelog link
curl -s -o /dev/null -w "%{http_code}" "https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md#version-7-4-2-january-14-2026"
# Expected: 200
```

**Common anchor format issues**:
| Wrong | Right | Issue |
|-------|-------|-------|
| `#version-7.7.1-december-2-2025` | `#version-771-december-2-2025` | Android should not have dots |
| `#Version-771-December-2-2025` | `#version-771-december-2-2025` | Should be all lowercase |
| `#version-771-Dec-2-2025` | `#version-771-december-2-2025` | Month should be full name |

---

## Content Guidelines

### For "What's new" Section
- Start with native SDK support line
- Add bullet points for major features
- Be concise but descriptive
- Use active voice: "Adds support for..." not "Support for... was added"

### For "API changes" Section
- List new public methods/classes
- Include parameter descriptions for complex APIs
- Add code examples for non-obvious usage

### For "Breaking Changes" Section
- Clearly mark as BREAKING
- Explain what changed

### For "Bug Fixes" Section
- Briefly describe the fix
- Mention affected platforms

---

## Release Date Calculation

**Default**: Current date + 3 days

**How to calculate**:
1. Get current date
2. Add 3 days to it
3. Format as: `DD Month YYYY`

**Examples**:
| Today | Release Date |
|-------|--------------|
| January 28, 2026 | `31 January 2026` |
| January 30, 2026 | `2 February 2026` |
| February 28, 2026 | `3 March 2026` |

**Format requirements**:
- Day: No leading zero (use `5` not `05`, use `28` not `028`)
- Month: Full name (use `January` not `Jan` or `01`)
- Year: 4 digits (use `2026` not `26`)

---

## Common Mistakes to Avoid

❌ **Wrong**: Date with slashes `(01/23/2026)`  
✅ **Right**: `(23 January 2026)`

❌ **Wrong**: Generic platform tag `[Android]`  
✅ **Right**: `[Android Platform]`

❌ **Wrong**: Link without anchor `...CHANGELOG.md`  
✅ **Right**: `...CHANGELOG.md#version-742-january-14-2026`

❌ **Wrong**: Adding entry at bottom of file  
✅ **Right**: Adding entry at TOP of file

❌ **Wrong**: 4-space or tab indentation  
✅ **Right**: 2-space indentation

---

## Insertion Process

1. Read entire `CHANGELOG.md`
2. Find the position after the header (after first `#` line)
3. Insert new entry with blank line before/after
4. Write back to file

**Example**:
```markdown
# Change Log

Version 3.7.0 *(23 January 2026)*     # ← NEW ENTRY HERE
-------------------------------------------
**What's new**
...

Version 3.6.0 *(15 December 2025)*    # ← EXISTING ENTRIES BELOW
-------------------------------------------
...
```

---

## Related Skills

- **version-detection** - Provides version numbers for changelog
- **api-wrapper-patterns** - Informs what APIs to document in "API changes"
