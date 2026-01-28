# Skill: Example App Update Patterns

**Purpose**: Standard patterns for demonstrating new APIs in the Flutter example app

**When to use**:
- After implementing new API wrappers
- When updating existing API functionality
- When adding new feature categories

---

## Overview

The example app (`example/lib/main.dart`) serves as a live demo and testing ground for all CleverTap Flutter SDK APIs. Every new or updated API MUST be demonstrated in the example app.

---

## File Structure

### Main File
`example/lib/main.dart` contains:
- UI sections organized by feature category (ExpansionTiles)
- Individual API buttons (ListTiles)
- Implementation methods that call SDK APIs
- Helper methods for logging and user feedback

### Pattern
```
_buildExpansionTile("Feature Category", [
  _buildListTile("API Display Name", methodName, "Description"),
  _buildListTile("Another API", anotherMethod, "Description"),
])
```

---

## Adding New APIs

### Step 1: Add UI Entry Point

**Location**: Inside the appropriate `_buildExpansionTile` in the `build()` method

**Template**:
```dart
_buildListTile(
    "User-Facing API Name",
    implementationMethodName,
    "Brief description of what this API does."),
```

**Examples**:
```dart
// Simple getter
_buildListTile(
    "Get CleverTap ID",
    getCleverTapId,
    "Returns the unique CleverTap installation ID."),

// Method with behavior
_buildListTile(
    "Record Event",
    recordCustomEvent,
    "Records a custom event with properties."),

// Async operation
_buildListTile(
    "Fetch Inbox Messages", 
    getAllInboxMessages,
    "Retrieves all inbox messages from the server."),
```

### Step 2: Add Implementation Method

**Location**: Inside `_MyAppState` class, grouped with related methods

**Template for Methods Returning Data**:
```dart
void methodName() async {
  var result = await CleverTapPlugin.apiMethod();
  if (result == null) {
    showToast("No result found");
    print("API Name -> No result");
  } else {
    showToast("Result fetched, check console");
    print("API Name -> Result: " + result.toString());
  }
}
```

**Template for Methods Without Return Values**:
```dart
void methodName() {
  CleverTapPlugin.apiMethod();
  showToast("Action triggered");
  print("API Name -> Called successfully");
}
```

**Template for Methods with Parameters**:
```dart
void methodName() async {
  Map<String, dynamic> params = {
    "key1": "value1",
    "key2": 123,
  };
  
  var result = await CleverTapPlugin.apiMethod(params);
  if (result == null) {
    showToast("Operation failed");
    print("API Name -> Failed");
  } else {
    showToast("Success, check console");
    print("API Name -> Result: " + result.toString());
  }
}
```

### Step 3: Create New Section (If Needed)

If the API belongs to a new feature category:

**Location**: In the `build()` method, add new `_buildExpansionTile`

**Template**:
```dart
_buildExpansionTile("New Feature Category", [
  _buildListTile("API Name", methodName, "Description"),
  _buildListTile("Another API", anotherMethod, "Description"),
]),
```

**Example**:
```dart
if (!kIsWeb)
  _buildExpansionTile("Product Experiences", [
    _buildListTile(
        "Fetch Variables",
        fetchVariables,
        "Fetches all product experience variables."),
    _buildListTile(
        "Get Variable",
        getVariable,
        "Gets a specific variable value."),
  ]),
```

---

## Updating Existing APIs

### When Signature Changes

If an API adds new optional parameters:

**Before**:
```dart
void methodName() async {
  var result = await CleverTapPlugin.apiMethod();
  // ...
}
```

**After**:
```dart
void methodName() async {
  // Demonstrate new optional parameter
  var result = await CleverTapPlugin.apiMethod(
    newParam: true  // Show the new parameter
  );
  // ...
}
```
---

## Code Style Guidelines

### Method Naming
- Use descriptive camelCase names
- Match the SDK API name when possible
- Example: `getCleverTapId`, `recordCustomEvent`, `fetchInboxMessages`

### User Feedback
Always provide dual feedback:
1. **Visual**: `showToast()` for immediate user feedback
2. **Console**: `print()` for detailed debugging

### Error Handling
Always check for null/empty results:
```dart
if (result == null) {
  showToast("No result found");
  print("API Name -> No result");
} else {
  showToast("Result fetched, check console");
  print("API Name -> Result: " + result.toString());
}
```

### Platform-Specific APIs
Wrap platform-specific sections with checks:
```dart
if (!kIsWeb)
  _buildExpansionTile("Mobile-Only Feature", [
    // APIs that don't work on web
  ]),
```

### Async/Await
- Always use `async` for methods calling SDK APIs
- Always `await` the SDK call
- Handle potential null returns

---

## Common Patterns

### Pattern 1: Simple Getter

**Use Case**: API that returns a single value (String, int, bool)

```dart
void getCleverTapId() async {
  String? clevertapId = await CleverTapPlugin.getCleverTapID();
  if (clevertapId == null) {
    showToast("CleverTap ID = NULL");
    print("CleverTap ID -> NULL");
  } else {
    showToast("CleverTap ID = " + clevertapId);
    print("CleverTap ID -> " + clevertapId);
  }
}
```

### Pattern 2: List Fetcher

**Use Case**: API that returns a list of items

```dart
void getAllInboxMessages() async {
  List<dynamic>? messages = await CleverTapPlugin.getAllInboxMessages();
  if (messages == null || messages.isEmpty) {
    showToast("No messages found");
    print("Inbox Messages -> Empty");
  } else {
    showToast("${messages.length} messages found, check console");
    print("Inbox Messages -> Count: ${messages.length}");
    print("Inbox Messages -> Data: " + messages.toString());
  }
}
```

### Pattern 3: Action Trigger

**Use Case**: API that performs an action without returning data

```dart
void recordCustomEvent() {
  Map<String, dynamic> eventData = {
    "Product Name": "Casio Chronograph Watch",
    "Category": "Mens Watch",
    "Price": 59.99,
    "Date": "2024-01-28"
  };
  CleverTapPlugin.recordEvent("Product Viewed", eventData);
  showToast("Event recorded");
  print("Product Viewed -> Event Data: " + eventData.toString());
}
```

### Pattern 4: Complex Operation

**Use Case**: API with multiple parameters or complex logic

```dart
void setMultiValueForKey() async {
  List<String> values = ["Apple", "Orange", "Banana"];
  String key = "Favorite Fruits";
  
  CleverTapPlugin.profileSetMultiValues(key, values);
  showToast("Multi-values set for $key");
  print("Profile -> Set $key = " + values.toString());
}
```

### Pattern 5: Platform-Specific API

**Use Case**: API that only works on mobile platforms

```dart
void registerForPush() {
  if (!kIsWeb) {
    CleverTapPlugin.registerForPush();
    showToast("Registered for push notifications");
    print("Push -> Registered");
  } else {
    showToast("Not available on web");
    print("Push -> Not supported on web");
  }
}
```
---
## Testing Checklist

After adding/updating example app code:

- [ ] New API has a corresponding button in the UI
- [ ] Button is in the correct feature category
- [ ] Description is clear and helpful
- [ ] Implementation method exists and is named correctly
- [ ] Method handles null/error cases
- [ ] Both `showToast` and `print` are used for feedback
- [ ] Platform checks are added if needed
- [ ] Example data is realistic and helpful
- [ ] Code follows existing patterns in the file
- [ ] App builds and runs without errors

---

## Common Issues

### Issue 1: Button Not Visible
**Symptom**: Added ListTile but not showing in app  
**Cause**: Platform check filtering it out or wrong ExpansionTile  
**Solution**: 
- Check if wrapped in `if (!kIsWeb)` and running on web
- Verify correct ExpansionTile section
- Check for syntax errors in build method

### Issue 2: Method Not Found
**Symptom**: Clicking button shows error  
**Cause**: Method name mismatch between ListTile and implementation  
**Solution**: Verify exact method name match, including case

### Issue 3: No User Feedback
**Symptom**: Button works but no visible confirmation  
**Cause**: Missing `showToast()` call  
**Solution**: Always add `showToast()` for user feedback

### Issue 4: Crash on Button Press
**Symptom**: App crashes when testing  
**Cause**: Missing null checks or type mismatch  
**Solution**: 
- Add null checks before using results
- Verify return type matches expected type
- Wrap in try-catch if needed

---

## Related Skills

- **api-wrapper-patterns** - For implementing the underlying SDK APIs
- **version-detection** - For checking compatibility
- **changelog-generation** - For documenting new example app additions
