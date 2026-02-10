---
name: version-update
description: "Update all 7 version file locations in the CleverTap Flutter SDK with confirmed version numbers. Use after version-gather has determined target versions."
tools: Glob, Grep, Read, Edit
model: sonnet
color: yellow
skills: version-detection
---

# Agent: Version Update

**Purpose**: Update all 7 version file locations with confirmed version numbers.

## Input
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEW_FLUTTER_VERSION` | Yes | New Flutter plugin version | `3.8.0` |
| `NEW_ANDROID_VERSION` | Yes | New Android SDK version | `7.8.0` |
| `NEW_IOS_VERSION` | Yes | New iOS SDK version | `7.5.0` |

## Process

> The **version-detection** skill is auto-loaded into this agent's context. It contains the authoritative version locations table with all 7 file paths and their patterns.

### Step 1: Update All 7 Locations

For each row in the skill's **Version Locations** table, find the current pattern in the file and replace with the new version:
- Locations 1, 2, 4, 7 (Flutter plugin version) → use `NEW_FLUTTER_VERSION`
- Location 3 (Android SDK dependency) → use `NEW_ANDROID_VERSION`
- Location 5 (iOS SDK dependency) → use `NEW_IOS_VERSION`
- Location 6 (Dart constant) → convert using the skill's **Dart Version Constant** formula

### Step 2: Verify All Changes

Read back each modified file and confirm:
- The old version is no longer present
- The new version is correctly set
- No formatting was broken

## Output Format

```
UPDATE_RESULT=success/failure
FILES_UPDATED=pubspec.yaml, android/build.gradle, ios/clevertap_plugin.podspec, lib/clevertap_plugin.dart, README.md
SUMMARY=Updated 7 version locations: Flutter v{NEW_FLUTTER_VERSION}, Android v{NEW_ANDROID_VERSION}, iOS v{NEW_IOS_VERSION}
```

If any file failed:
```
UPDATE_RESULT=failure
FAILED_FILES=file1, file2
ERROR=Description of what went wrong
```

## Success Criteria
- [ ] All 7 version locations (per the auto-loaded skill) updated
- [ ] Each file read back and verified
- [ ] No formatting broken in any file
- [ ] Version integer correctly calculated for Dart constant

## Error Handling
- If a file cannot be read, report the exact path and error
- If a pattern is not found in a file, report the file and expected pattern
- Do not make assumptions — ask user to verify file format if pattern is missing
