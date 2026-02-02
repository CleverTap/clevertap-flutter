---
name: api-wrapper-patterns
description: Standard patterns for wrapping native CleverTap Android/iOS SDK APIs in Flutter. Use when adding new native SDK APIs, updating existing API signatures, implementing cross-platform features, or creating Flutter method channel bridges.
---

# API Wrapper Patterns

> **⚠️ MANDATORY READING**: This skill document MUST be read in full BEFORE implementing any API wrapper. Do NOT infer patterns from existing code - follow THIS document exactly. Violations lead to inconsistent code (e.g., using `List<Map<String, dynamic>>` instead of `List?`).

Standard patterns for wrapping native CleverTap Android/iOS SDK APIs in Flutter with proper method channels, error handling, and type conversions.

## Core Principle: Keep Dart Simple

The Dart layer should be a **thin pass-through**. All data transformation, type conversion, and complex logic should happen in the native layers (Android/iOS), not in Dart.

**Why?**
- Native layers have direct access to SDK types and utilities
- Reduces code duplication between Dart type handling
- Keeps the public API surface clean and predictable
- Avoids runtime type casting errors in Dart

## Decision Tree

```
Is this a public API that apps call directly?
├─ YES → Does it already exist in Flutter?
│  ├─ YES → Does signature need updating?
│  │  ├─ YES → UPDATE existing wrapper
│  │  └─ NO → NO ACTION
│  └─ NO → Is this commonly used functionality?
│     ├─ YES → CREATE new wrapper
│     └─ NO → DISCUSS with user
└─ NO (internal/config/payload) → NO wrapper needed
```

## Type Mapping

| Kotlin                  | Objective-C | Dart                   |
|-------------------------|-------------|------------------------|
| `Map<String, Any>`      | `NSDictionary` | `Map<String, dynamic>` |
| `List`                  | `NSArray` | `List?`                |
| `List<Map<String, Any>>` | `NSArray<NSDictionary *> *` | `List?`                |
| `String`                | `NSString` | `String`               |
| `Int`, `Long`           | `NSNumber` | `int`                  |
| `Double`                | `NSNumber` | `double`               |
| `Boolean`               | `BOOL` | `bool`                 |

**Key Rule**: For complex return types like arrays of objects, always use `List?` in Dart. Don't attempt to cast or transform the data in the Dart layer.

## Code Style Guidelines

### Dart Layer (IMPORTANT: Keep It Simple)
- Use `static Future<ReturnType>` for all public methods
- **AVOID transformations** - pass data directly to/from native without mapping
- **Use simple types** - prefer `List?` over `List<Map<String, dynamic>>` for complex returns
- Let native layers handle all data conversion and formatting
- Named optional parameters: `{Type? param}`
- 2-space indentation

**DO:**
```dart
static Future<List?> getAllInboxMessages() async {
  return await _dartToNativeMethodChannel.invokeMethod('getAllInboxMessages', {});
}
```

**DON'T:**
```dart
static Future<List<Map<String, dynamic>>> getAllInboxMessages() async {
  final List<dynamic>? result = await _dartToNativeMethodChannel.invokeMethod('getAllInboxMessages', {});
  if (result == null) return [];
  return result.map((e) => Map<String, dynamic>.from(e as Map)).toList();  // Avoid this!
}
```

### Naming
- **Dart**: camelCase (`recordEvent`, `getCleverTapID`)
- **Android**: camelCase for methods, UPPER_SNAKE_CASE for constants
- **iOS**: camelCase for methods

### Error Handling

Always include:
1. Null checks for required parameters
2. CleverTap API instance null check
3. Descriptive error messages

### Documentation

Every public Dart method must have:
```dart
/// [Brief description]
///
/// Parameters:
/// - [param1]: Description
/// - [param2]: Description (optional)
///
/// Returns: Description of return value
```

## Pattern 1: Simple Method (No Return Value)

**Use case**: Method that triggers an action but doesn't return data.

**Example**: `recordEvent(String eventName, {Map<String, dynamic>? properties})`

### Dart Layer (`lib/clevertap_plugin.dart`)

```dart
/// Records an event with the given name
///
/// Parameters:
/// - [eventName]: The name of the event to record
/// - [properties]: Optional properties for the event
static Future<void> recordEvent(
  String eventName,
  {Map<String, dynamic>? properties}
) async {
  return await _dartToNativeMethodChannel.invokeMethod(
    'recordEvent',
    {
      'eventName': eventName,
      'eventData': properties
    }
  );
}
```

### Android Layer (`DartToNativePlatformCommunicator.kt`)

Add to `onMethodCall` switch:
```kotlin
"recordEvent" -> {
    recordEvent(call, result)
}
```

Add implementation:
```kotlin
private fun recordEvent(call: MethodCall, result: MethodChannel.Result) {
   val eventData = call.argument<Map<String, Any>>("eventData")!!
   val eventName = call.argument<String>("eventName")
   if (cleverTapAPI != null) {
      this.cleverTapAPI.pushEvent(eventName, eventData)
      result.success(null)
   } else {
      result.error(TAG, ERROR_MSG, null)
   }
}
```

### iOS Layer (`CleverTapPlugin.m`)

Add to `handleMethodCall`:
```objectivec
if ([@"recordEvent" isEqualToString:call.method]) {
    [self recordEvent:call result:result];
    return;
}
```

Add implementation:
```objectivec
- (void)recordEvent:(FlutterMethodCall *)call result:(FlutterResult)result {
    [[CleverTap sharedInstance] recordEvent:call.arguments[@"eventName"] withProps:call.arguments[@"eventData"]];
    result(nil);
}
```

## Pattern 2: Method with Return Value

**Use case**: Method that retrieves data from native SDK.

**Example**: `profileGetProperty(String propertyName) -> dynamic`

### Dart Layer

```dart
/// Gets the value of a user profile property
///
/// Parameters:
/// - [propertyName]: The name of the property to retrieve
///
/// Returns: The property value, or null if not found
static Future<dynamic> profileGetProperty(String propertyName) async {
  return await _dartToNativeMethodChannel.invokeMethod(
    'profileGetProperty',
    {'propertyName': propertyName}
  );
}
```

### Android Layer

```kotlin
private fun profileGetProperty(call: MethodCall, result: MethodChannel.Result) {
    val propertyName = call.argument<String>("propertyName")
    if (cleverTapAPI != null) {
        val propertyValue = cleverTapAPI.getProperty(propertyName)
        result.success(propertyValue)
    } else {
        result.error(TAG, ERROR_MSG, null)
    }
}
```

### iOS Layer

```objectivec
- (void)profileGetProperty:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    result([[CleverTap sharedInstance] profileGet:call.arguments[@"propertyName"]]);
}
```

## Pattern 3: Method Returning Complex Data

**Use case**: Method that returns objects/collections from native SDKs.

**Example**: `getAllInboxMessages()` returns `List<CTInboxMessage>`

### Dart Layer

```dart
/// Retrieves all inbox messages
///
/// Returns: List of inbox message objects, or empty list if none
static Future<List?> getAllInboxMessages() async {
  return await _dartToNativeMethodChannel
        .invokeMethod('getAllInboxMessages', {});
}
```

### Android Layer

Add conversion utility if needed:
```kotlin
private fun getAllInboxMessages(result: MethodChannel.Result) {
   if (cleverTapAPI != null) {
      result.success(Utils.inboxMessageListToArrayList(cleverTapAPI.getAllInboxMessages()))
   } else {
      result.error(TAG, ERROR_MSG, null)
   }
}

// In Utils class
static ArrayList<Map<String, Object>> inboxMessageListToArrayList(
      ArrayList<CTInboxMessage> inboxMessageArrayList) {
  ArrayList<Map<String, Object>> inboxMessageList = new ArrayList<>();
  if (inboxMessageArrayList != null) {
      for (CTInboxMessage message : inboxMessageArrayList) {
          inboxMessageList.add(Utils.jsonToMap(message.getData()));
      }
  }
  return inboxMessageList;
}
```

### iOS Layer

```objectivec
- (void)getAllInboxMessages:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSArray *messages = [[CleverTap sharedInstance] getAllInboxMessages];
    NSArray *results = [self _cleverTapInboxMessagesToArray:messages];
    result(results);
}
```

## Common Issues

### Issue 1: Method Not Found
**Symptom**: `MissingPluginException`  
**Cause**: Method name mismatch  
**Solution**: Verify exact string match across all 3 files

### Issue 2: Type Conversion Error
**Symptom**: Cast exception  
**Cause**: Dart type doesn't map to native type  
**Solution**: Check type mapping table above

### Issue 3: Null Safety
**Symptom**: Crashes or unexpected nulls  
**Cause**: Missing null checks  
**Solution**: Always check for null before using values
