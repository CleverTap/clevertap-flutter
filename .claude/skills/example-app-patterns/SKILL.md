---
name: example-app-patterns
description: Standard patterns for demonstrating new APIs in the Flutter example app. Use when implementing new API wrappers, updating existing API functionality, or adding new feature categories to the example app. Ensures all APIs have corresponding UI demonstrations.
---

# Example App Update Patterns

Standard patterns for demonstrating CleverTap Flutter SDK APIs in the example app with proper UI organization, implementation methods, and user feedback.

## Overview

The example app (`example/lib/main.dart`) serves as live demo and testing ground for all CleverTap Flutter SDK APIs. Every new or updated API MUST be demonstrated.

**Structure**:
- UI sections organized by feature category (ExpansionTiles)
- Individual API buttons (ListTiles)
- Implementation methods calling SDK APIs
- Helper methods for logging and user feedback

## Adding New APIs

### Step 1: Add UI Entry Point

Inside the appropriate `_buildExpansionTile` in the `build()` method:

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

Inside `_MyAppState` class, grouped with related methods.

**Methods returning data**:
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

**Methods without return values**:
```dart
void methodName() {
  CleverTapPlugin.apiMethod();
  showToast("Action triggered");
  print("API Name -> Called successfully");
}
```

**Methods with parameters**:
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

If API belongs to a new feature category:

```dart
_buildExpansionTile("New Feature Category", [
  _buildListTile("API Name", methodName, "Description"),
  _buildListTile("Another API", anotherMethod, "Description"),
]),
```

## Updating Existing APIs

### When Signature Changes

If API adds new optional parameters, create TWO buttons to demonstrate both use cases:

**Button 1: Original behavior**
```dart
_buildListTile(
    "Original API Name",
    methodNameOriginal,
    "Original description without new parameter."),
```

**Button 2: New parameter**
```dart
_buildListTile(
    "API Name (With New Feature)",
    methodNameWithNewParam,
    "Description highlighting the new parameter behavior."),
```

**Implementation methods**:
```dart
// Original method - backward compatibility
void methodNameOriginal() async {
  var result = await CleverTapPlugin.apiMethod();
  if (result == null) {
    showToast("No result found");
    print("API Name (Original) -> No result");
  } else {
    showToast("Result fetched, check console");
    print("API Name (Original) -> Result: " + result.toString());
  }
}

// New method - demonstrates new parameter
void methodNameWithNewParam() async {
  var result = await CleverTapPlugin.apiMethod(
    newParam: true
  );
  if (result == null) {
    showToast("No result found");
    print("API Name (With Param) -> No result");
  } else {
    showToast("Result with new parameter, check console");
    print("API Name (With Param) -> Result: " + result.toString());
  }
}
```

**Why two buttons?**
- Demonstrates backward compatibility
- Shows new feature clearly
- Allows testing both behaviors
- Makes parameter impact obvious

## Code Style Guidelines

### Method Naming
- Descriptive camelCase names
- Match SDK API name when possible
- Example: `getCleverTapId`, `recordCustomEvent`

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
Wrap platform-specific sections:
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

## Common Patterns

### Pattern 1: Simple Getter

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

## Testing Checklist

- [ ] New API has corresponding button in UI
- [ ] Button is in correct feature category
- [ ] Description is clear and helpful
- [ ] Implementation method exists and named correctly
- [ ] Method handles null/error cases
- [ ] Both `showToast` and `print` are used
- [ ] Platform checks added if needed
- [ ] Example data is realistic and helpful
- [ ] Code follows existing patterns
- [ ] App builds and runs without errors

## Common Issues

### Issue 1: Button Not Visible
**Cause**: Platform check filtering it out or wrong ExpansionTile  
**Solution**: Check `if (!kIsWeb)` wrapper, verify correct ExpansionTile, check for syntax errors

### Issue 2: Method Not Found
**Cause**: Method name mismatch  
**Solution**: Verify exact method name match, including case

### Issue 3: No User Feedback
**Cause**: Missing `showToast()` call  
**Solution**: Always add `showToast()` for user feedback

### Issue 4: Crash on Button Press
**Cause**: Missing null checks or type mismatch  
**Solution**: Add null checks, verify return type, wrap in try-catch if needed
