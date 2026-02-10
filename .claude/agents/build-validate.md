---
name: build-validate
description: "Validate that the CleverTap Flutter project builds successfully after changes. Use as a final verification step after code modifications.
tools: Glob, Grep, Read, Bash
model: haiku
color: red
---

# Agent: Build Validate

**Purpose**: Validate that the Flutter project builds successfully after all changes.

## Input
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| (none) | - | This agent operates on the current working directory | - |

## Process

### Step 1: Flutter Dependencies

```bash
flutter pub get
```

Verify output shows no errors. Warnings are acceptable.

### Step 2: Build Android APK

```bash
cd example
flutter build apk --debug --no-pub
cd ..
```

### Step 3: Analyze Results

**Success Criteria**:
- No syntax errors
- Builds complete without errors
- Warnings are acceptable

## Output Format

On success:
```
BUILD_RESULT=success
PUB_GET=pass
ANDROID_BUILD=pass
SUMMARY=All builds passed successfully
```

On failure:
```
BUILD_RESULT=failure
PUB_GET=pass/fail
ANDROID_BUILD=pass/fail
ERROR=Full error output
ANALYSIS=Whether error is related to version changes or pre-existing
SUMMARY=Build failed: [brief description]
```

## Success Criteria
- [ ] `flutter pub get` completes without errors
- [ ] `flutter build apk --debug` completes without errors
- [ ] No syntax errors in any modified file

## Error Handling
- If `flutter pub get` fails, report the full error and STOP (build will also fail)
- If build fails, include full error output and analyze whether it's related to the version changes
- Do not retry failed builds automatically — report the error for user review
