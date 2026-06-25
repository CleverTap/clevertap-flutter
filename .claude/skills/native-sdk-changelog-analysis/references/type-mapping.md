# Type Mapping Reference

Cross-platform type mappings for Android, iOS, and Dart.

## Native Type Mapping Table

| Android Type | iOS Type | Dart Type |
|--------------|----------|-----------|
| `ArrayList<T>`, `List<T>` | `NSArray<T *> *` | `List?` |
| `Map<K, V>`, `HashMap<K, V>` | `NSDictionary<K, V> *` | `Map<String, dynamic>` |
| `String` | `NSString *` | `String` |
| `Integer`, `Long` | `NSNumber *`, `NSInteger` | `int` |
| `Double` | `NSNumber *` | `double` |
| `boolean` | `BOOL` | `bool` |
| `void` | `void` | `void` |
| `Object` | `id` | `dynamic` |
| `ArrayList<HashMap>` | `NSArray<NSDictionary *> *` | `List?` |

## Common CleverTap Type Mappings

| Android Type | iOS Type |
|--------------|----------|
| `CTInboxMessage` | `CleverTapInboxMessage` |
| `ArrayList<CTInboxMessage>` | `NSArray<CleverTapInboxMessage *> *` |
| `CTInboxStyleConfig` | `CleverTapInboxStyleConfig` |

## Cross-Platform Inference Rules

When signature found for ONE platform but not the other:

### Android Found → Infer iOS

```
ArrayList<CTInboxMessage> → NSArray<CleverTapInboxMessage *> *
Map<String, Object> → NSDictionary<NSString *, id> *
boolean → BOOL
void → void
```

### iOS Found → Infer Android

```
NSArray<CleverTapInboxMessage *> * → ArrayList<CTInboxMessage>
NSDictionary<NSString *, id> * → Map<String, Object>
BOOL → boolean
void → void
```

## Nullability Annotations

| Android | iOS | Meaning |
|---------|-----|---------|
| `@NonNull` | `_Nonnull` | Never null |
| `@Nullable` | `_Nullable` | May be null |
| (no annotation) | (no annotation) | Assume nullable |

## Documentation Format

When documenting inferred types:

```
// Inferred from Android: ArrayList<CTInboxMessage> → NSArray<CleverTapInboxMessage *> *
// Inferred from iOS: NSArray<CleverTapInboxMessage *> * → ArrayList<CTInboxMessage>
// Type verified from CleverTapAPI.java
// Type verified from CleverTap.h
```