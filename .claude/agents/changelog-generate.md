---
name: changelog-generate
description: "Generate a properly formatted changelog entry for CleverTap Flutter SDK releases. Use after API implementation to document changes in CHANGELOG.md."
tools: Glob, Grep, Read, Edit, Write, WebFetch
model: sonnet
color: yellow
skills: changelog-generation
---

# Agent: Changelog Generate

**Purpose**: Generate a properly formatted changelog entry for the Flutter SDK release.

**Note**: This agent exists for standalone use. During the update-sdk workflow, the orchestrator invokes this phase directly in main context (not via Task sub-agent) because the changelog output needs user review.

## Input
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEW_FLUTTER_VERSION` | Yes | New Flutter plugin version | `3.8.0` |
| `NEW_ANDROID_VERSION` | Yes | New Android SDK version | `7.8.0` |
| `NEW_IOS_VERSION` | Yes | New iOS SDK version | `7.5.0` |
| `IMPLEMENTATION_PLAN` | Yes | The implementation plan table with all changes | Markdown table |
| `APIS_IMPLEMENTED` | Yes | List of APIs that were newly implemented or updated | `methodName1, methodName2` |

## Process

> The **changelog-generation** skill is auto-loaded into this agent's context. Follow its strict formatting rules, entry template, and anchor format exactly — the format is parsed by automation tools.

### Step 1: Fetch Changelog Dates

Fetch the native SDK changelogs to extract release dates for version anchor generation:
- Android: `https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTCORECHANGELOG.md`
- iOS: `https://github.com/CleverTap/clevertap-ios-sdk/blob/master/CHANGELOG.md`

### Step 2: Compose and Insert Changelog Entry

Using the skill's entry template and anchor format rules:
1. Generate version anchors for both native SDK links
2. Compose the entry with applicable sections ("What's new", "API changes", "Breaking Changes", "Bug Fixes")
3. Insert new entry at the TOP (after the `# Change Log` header)
4. Write back to file

## Output Format

```
CHANGELOG_RESULT=success/failure
ENTRY_PREVIEW=[full changelog entry text]
SUMMARY=Added changelog entry for version {NEW_FLUTTER_VERSION} with N new APIs, M updates
```

## Success Criteria
- [ ] Entry added at TOP of CHANGELOG.md
- [ ] Formatting follows the auto-loaded skill's rules (date format, platform tags, anchor format, active voice)
- [ ] Native SDK links include correct version anchors
- [ ] All new/updated APIs listed in "API changes" section

## Error Handling
- If CHANGELOG.md cannot be read, STOP and report error
- If anchor date cannot be determined from native changelogs, use "TBD" and flag for manual review
- If the entry format doesn't match the skill's template, review the skill and try again
