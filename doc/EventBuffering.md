# Flutter Event Buffering Implementation for CleverTap iOS Plugin

## Table of Contents
1. [Background](#background)
2. [Problem Statement](#problem-statement)
3. [Solution Overview](#solution-overview)
4. [Implementation Details](#implementation-details)
5. [Technical Architecture](#technical-architecture)

---

## Background

This PR introduces an intelligent event buffering mechanism for the CleverTap iOS Flutter plugin that solves the critical issue of events being lost during app initialization. The solution ensures 100% event delivery reliability without requiring any changes to existing Flutter implementations.

---

## Problem Statement

### The Race Condition

In Flutter applications using CleverTap, there's a critical timing issue where native iOS events are dispatched before the Dart/Flutter layer has fully initialized and registered its event listeners. 

```
Timeline:
T0: App launches
T1: CleverTap SDK initializes (native)
T2: Events start firing (e.g., ProfileDidInitialize)
T3: Flutter engine boots up
T4: Dart code registers event listeners
T5: Events between T2-T4 are LOST ❌
```

### Affected Events

This race condition particularly affects:
- `CleverTapProfileDidInitialize` events
- Push notification clicked events during app launch  
- Display unit loaded events
- Product config initialization events
- Custom template events

---

## Solution Overview

We've implemented an intelligent event buffering mechanism that temporarily stores critical events until the Flutter layer signals it's ready to receive them.

### Core Concept

```
Event Generated → Buffer (if needed) → Wait for Flutter → Flush to Dart
```

This ensures no important events are lost during the app initialization phase while maintaining optimal performance and memory usage.

---

## Implementation Details

### 1. Selective Event Buffering

Not all events require buffering. We've carefully identified events that are prone to being sent during initialization:

```objc
// Only these events are buffered
static NSMutableSet<NSString *> *bufferableEvents = [NSMutableSet setWithObjects:
    kCleverTapPushNotificationClicked,
    kCleverTapProfileDidInitialize,
    kCleverTapDisplayUnitsLoaded,
    kCleverTapInAppNotificationDismissed,
    kCleverTapInAppNotificationButtonTapped,
    kCleverTapProductConfigInitialized,
    kCleverTapCustomTemplatePresent,
    kCleverTapCustomFunctionPresent,
    kCleverTapCustomTemplateClose,
    kCleverTapFeatureFlagsUpdated, 
    nil
];
```

### 2. Smart Event Routing Logic

The enhanced `sendEventOnObserving` method intelligently routes events:

```objc
- (void)sendEventOnObserving:(NSString *)name andBody:(NSDictionary *)body {
    // Decision tree:
    // 1. Is it a bufferable event?
    // 2. Is Flutter already listening?
    // 3. Is buffering still enabled?
    
    if ([bufferableEvents containsObject:name] &&
        ![observedEvents containsObject:name] &&
        isBufferingEnabled) {
        
        // Buffer the event
        if (!pendingEvents[name]) {
            pendingEvents[name] = [NSMutableArray array];
        }
        
        CleverTapPluginPendingEvent *event = [[CleverTapPluginPendingEvent alloc] 
                                              initWithName:name body:body];
        [pendingEvents[name] addObject:event];
        NSLog(@"CleverTapFlutter: Buffering event %@ for later emission", name);
        return;
    }
    
    // Post immediately if not bufferable or already observed
    [[NSNotificationCenter defaultCenter] postNotificationName:name 
                                                        object:nil 
                                                      userInfo:body];
}
```

### 3. Flutter-Initiated Event Flushing

When Flutter registers an event listener, it signals readiness:

**Dart Side:**
```dart
void setCleverTapCustomTemplatePresentHandler(CleverTapCustomTemplatePresentHandler handler) {
    // Signal to native that we're ready for this event
    invokeStartEmission('customTemplatePresent');
    cleverTapCustomTemplatePresentHandler = handler;
}

void invokeStartEmission(String name) {
    _dartToNativeMethodChannel.invokeMethod('startEmission', name);
}
```

**Native Side:**
```objc
- (void)startObservingEvent:(NSString *)eventName {
    // Mark as observed
    [observedEvents addObject:eventName];
    
    // Flush any pending events
    NSMutableArray *events = pendingEvents[eventName];
    if (events && events.count > 0) {
        NSLog(@"CleverTapFlutter: Flushing %lu pending events for %@", 
              (unsigned long)events.count, eventName);
        
        for (CleverTapPluginPendingEvent *event in events) {
            [self.nativeToDartMethodChannel invokeMethod:event.name 
                                               arguments:event.body];
        }
        [pendingEvents removeObjectForKey:eventName];
    }
}
```

### 4. Automatic Cleanup Mechanism

To prevent memory leaks and ensure clean state:

```objc
// 5-second timeout for cleanup
static const NSTimeInterval kEventBufferTimeoutSeconds = 5.0;

// In init method
resetBufferBlock = dispatch_block_create(0, ^{
    [pendingEvents removeAllObjects];
    isBufferingEnabled = NO;
});

// Schedule cleanup
dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 
              (int64_t)(kEventBufferTimeoutSeconds * NSEC_PER_SEC)),
              dispatch_get_main_queue(),
              resetBufferBlock);
```

---

## Technical Architecture

### State Flow Diagram

```
                    ┌─────────────┐
                    │   START     │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │Event Created│
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Bufferable? │
                    └──┬───────┬──┘
                       │ Yes   │ No
                       ▼       ▼
                ┌──────────┐ ┌──────────┐
                │ Observed?│ │   Post   │
                └──┬────┬──┘ │Immediately│
                   │Yes │No  └──────────┘
                   ▼    ▼
             ┌──────┐ ┌────────┐
             │ Post │ │ Buffer │
             │      │ │ Event  │
             └──────┘ └───┬────┘
                          │
                    ┌─────▼──────┐
                    │Wait for    │
                    │startEmission│
                    └─────┬──────┘
                          │
                    ┌─────▼──────┐
                    │Flush Buffer│
                    │  to Dart   │
                    └────────────┘
```

---
