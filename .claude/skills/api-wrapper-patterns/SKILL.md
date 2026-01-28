# Skill: API Wrapper Patterns

**Purpose**: Standard patterns for wrapping native CleverTap Android/iOS SDK APIs in Flutter

**When to use**:
- When new native SDK APIs are added
- When updating existing API signatures
- When implementing cross-platform features

---

## Decision Tree: Should This API Be Wrapped?

```
Is this a public API that apps call directly?
├─ YES → Does it already exist in Flutter?
│  ├─ YES → Does the signature need updating?
│  │  ├─ YES → UPDATE existing wrapper
│  │  └─ NO → NO ACTION needed
│  └─ NO → Is this commonly used functionality?
│     ├─ YES → CREATE new wrapper
│     └─ NO → DISCUSS with user
└─ NO (internal/config/payload) → NO wrapper needed
```

---

## Pattern 1: Simple Method (No Return Value)

### Use Case
Method that triggers an action but doesn't return data.

**Example**: `recordEvent(String eventName, {Map<String, dynamic>? properties})`

### Dart Layer (`lib/clevertap_plugin.dart`)

```dart
/// Records an event with the given name
///
/// Parameters:
/// - [eventName]: The name of the event to record
/// - [properties]: Optional properties for the event
///
/// ```
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
- (void)recordEvent:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    [[CleverTap sharedInstance] recordEvent:call.arguments[@"eventName"] withProps:call.arguments[@"eventData"]];
    result(nil);
}
```

---

## Pattern 2: Method with Return Value and Parameters

### Use Case
Method that retrieves data from native SDK based on input parameters.

**Example**: `profileGetProperty(String propertyName) -> dynamic`

### Dart Layer (`lib/clevertap_plugin.dart`)

```dart
/// Gets the value of a user profile property
///
/// Parameters:
/// - [propertyName]: The name of the property to retrieve
///
/// Returns: The property value, or null if not found
/// ```
static Future<dynamic> profileGetProperty(String propertyName) async {
  return await _dartToNativeMethodChannel.invokeMethod(
    'profileGetProperty',
    {'propertyName': propertyName}
  );
}
```

### Android Layer (`DartToNativePlatformCommunicator.kt`)

Add to `onMethodCall` switch:
```kotlin
"profileGetProperty" -> {
    profileGetProperty(call, result)
}
```

Add implementation:
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

### iOS Layer (`CleverTapPlugin.m`)

Add to `handleMethodCall`:
```objectivec
else if ([@"profileGetProperty" isEqualToString:call.method])
[self profileGetProperty:call withResult:result];
```

Add implementation:
```objectivec
- (void)profileGetProperty:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    result([[CleverTap sharedInstance] profileGet:call.arguments[@"propertyName"]]);
}
```

---

## Pattern 3: Method Returning Complex Data

### Use Case
Method that returns an Object data from the Native SDKs.

**Example**: `getAllInboxMessages()` returns `List<CTInboxMessage>` in the native layer

### Dart Layer (`lib/clevertap_plugin.dart`)

```dart
/// Retrieves all inbox messages
///
/// Returns: List of inbox message objects, or empty list if none
/// ```
static Future<List?> getAllInboxMessages() async {
  return await _dartToNativeMethodChannel
        .invokeMethod('getAllInboxMessages', {});
}
```

### Android Layer (`DartToNativePlatformCommunicator.kt`)

Add to `onMethodCall` switch:
```kotlin
"getAllInboxMessages" -> {
    getAllInboxMessages(result)
}
```

Add implementation:
```kotlin
private fun getAllInboxMessages(result: MethodChannel.Result) {
   if (cleverTapAPI != null) {
      result.success(Utils.inboxMessageListToArrayList(cleverTapAPI.getAllInboxMessages()))
   } else {
      result.error(TAG, ERROR_MSG, null)
   }
}
```

Also add a Utils function to convert the object type to to a native type, if applicable:
```kotlin
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
### iOS Layer (`CleverTapPlugin.m`)

Add to `handleMethodCall`:
```objectivec
if ([@"getAllInboxMessages" isEqualToString:call.method]) {
    [self getAllInboxMessages:result];
    return;
}
```

Add implementation:
```objectivec
- (void)getAllInboxMessages:(FlutterMethodCall *)call withResult:(FlutterResult)result {
    NSArray *messages = [[CleverTap sharedInstance] getAllInboxMessages];
    NSArray *results = [self _cleverTapInboxMessagesToArray:messages];
    result(results);
}
```

---

## Code Style Guidelines

### Dart Code Style
- Use `static Future<ReturnType>` for all public methods
- Use named optional parameters with `?` for optional params: `{Type? param}`
- Format with proper indentation (2 spaces)

### Naming Conventions
- **Dart**: camelCase for methods (`recordEvent`, `getCleverTapID`)
- **Android**: camelCase for methods, UPPER_SNAKE_CASE for constants
- **iOS**: camelCase for methods

### Error Handling
Always include:
1. Try-catch blocks
2. Null checks for required parameters
3. CleverTap API instance null check
4. Descriptive error messages

### Method Channel Names
- Must match exactly across Dart, Android, and iOS
- Use camelCase
- Keep consistent with CleverTap SDK naming when possible

### Documentation
Every public Dart method must have:
- `///` doc comment
- **Parameters** section describing each param
- **Returns** section (if applicable)

**Documentation Template**:
```dart
/// [Brief description of what the method does]
///
/// Parameters:
/// - [param1]: Description
/// - [param2]: Description (optional)
///
/// Returns: Description of return value
```
---

## Common Issues

### Issue 1: Method Not Found
**Symptom**: `MissingPluginException` on Android/iOS  
**Cause**: Method name mismatch between Dart and native  
**Solution**: Verify exact string match in all 3 files

### Issue 2: Type Conversion Error
**Symptom**: Cast exception or type mismatch  
**Cause**: Dart type doesn't map to native type  
**Solution**: Check type mapping:
- `Map<String, dynamic>` (Dart) ↔ `Map<String, Any>` (Kotlin) ↔ `NSDictionary` (ObjC)
- `List<dynamic>` (Dart) ↔ `List<Any>` (Kotlin) ↔ `NSArray` (ObjC)

### Issue 3: Null Safety Issues
**Symptom**: Crashes or unexpected null values  
**Cause**: Missing null checks  
**Solution**: Always check for null before using values

---

## Related Skills

- **version-detection** - Check which SDK versions support new APIs
- **changelog-generation** - Document new APIs in changelog
