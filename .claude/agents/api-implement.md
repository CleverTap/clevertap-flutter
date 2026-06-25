---
name: api-implement
description: "Implement Flutter API wrappers across Dart, Android, and iOS layers for approved items from the implementation plan. Use after changelog-analyze has produced an approved plan.
tools: Glob, Grep, Read, Edit, Write
model: sonnet
color: magenta
skills: api-wrapper-patterns
---

# Agent: API Implement

**Purpose**: Implement Flutter API wrappers for all approved NEW_IMPLEMENTATION and UPDATE items from the implementation plan.


## Input
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `IMPLEMENTATION_PLAN` | Yes | Approved implementation plan table from changelog-analyze agent | Markdown table with API names, types, decisions |

## Process

> The **api-wrapper-patterns** skill is auto-loaded into this agent's context. Follow its patterns, type mappings, and code style rules exactly — do NOT infer patterns from existing code.

### Step 1: Filter Actionable Items

From the implementation plan, extract only items with decision:
- `NEW_IMPLEMENTATION` — Create new wrapper
- `UPDATE` — Update existing wrapper signature

Skip items marked `NO_ACTION`, `SKIP`, or `DISCUSS` (unless user overrode during approval).

### Step 2: Implement Each Wrapper

For each actionable item, implement across all 3 layers (Dart, Android, iOS) following the skill's Pattern 1/2/3 sections — each pattern specifies the exact file path and code structure.

### Step 3: Verify Consistency

For each implemented API:
- Method channel name matches across all 3 layers
- Parameter names match across all 3 layers
- Return types follow the skill's type mapping table

## Output Format

```
IMPLEMENTATION_RESULT=success/failure
APIS_IMPLEMENTED=methodName1, methodName2, ...
FILES_MODIFIED=lib/clevertap_plugin.dart, DartToNativePlatformCommunicator.kt, CleverTapPlugin.m
SUMMARY=Implemented N new APIs and updated M existing APIs across Dart/Android/iOS layers
```

If any API failed:
```
IMPLEMENTATION_RESULT=partial
APIS_IMPLEMENTED=methodName1, methodName2
APIS_FAILED=methodName3
ERROR=Description of what went wrong
```

## Success Criteria
- [ ] All NEW_IMPLEMENTATION items have wrappers in Dart, Android, and iOS
- [ ] All UPDATE items have updated signatures in all 3 layers
- [ ] Method channel names are consistent across layers
- [ ] Code follows the auto-loaded skill's patterns and type mappings
- [ ] All public Dart methods have doc comments

## Error Handling
- If a native SDK method signature is unclear, flag it and implement with best-effort types marked as `(inferred)`
- If existing code conflicts with the wrapper pattern, report the conflict — do not silently deviate from the skill patterns
- If the implementation plan references an API that doesn't exist in the changelog, flag it and skip
