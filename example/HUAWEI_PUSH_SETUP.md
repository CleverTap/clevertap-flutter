# CleverTap + Huawei (HMS) Push — Flutter integration

This example shows how to use the [`huawei_push`](https://pub.dev/packages/huawei_push)
Flutter plugin to obtain a Huawei Push Kit (HMS) token and register it with CleverTap
so the device is reachable via HMS (i.e. CleverTap does **not** mark it as
`ddnd` / "do not disturb").

> Huawei Push Kit only works on genuine Huawei devices that have **HMS Core**
> installed. On Google-Play devices FCM is used instead. Both providers can be
> integrated at the same time; each is simply "unavailable" on the other's devices.

## Tested with

Verified end-to-end on a real **Huawei Nova 13** (HMS Core) via BrowserStack —
`Available Provider: HmsPushProvider` and `"ddnd":false` after token registration.

| Component | Version |
|---|---|
| Flutter | 3.44 stable (Dart 3.12) |
| clevertap_plugin | this repo (`path: ../`) |
| CleverTap Android core | 8.3.0 |
| clevertap-hms-sdk | 1.5.1 |
| huawei_push | 6.15.0+300 |
| com.huawei.hms:push | 6.11.0.300 |
| AGConnect plugin (agcp) | 1.9.1.301 |
| Android Gradle Plugin | 8.6.1 |

## 1. Add the plugin

`example/pubspec.yaml`:

```yaml
dependencies:
  huawei_push: ^6.12.0+300
```

## 2. Gradle wiring (AppGallery Connect Gradle plugin)

CleverTap's HMS provider reads the HMS `app_id` from the AGConnect config that is
generated **at build time** by the `com.huawei.agconnect` Gradle plugin (agcp).

`example/android/build.gradle` (root):

```gradle
buildscript {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://developer.huawei.com/repo/' }
    }
    dependencies {
        // Must match the Android Gradle Plugin version used by the app.
        classpath 'com.android.tools.build:gradle:8.6.1'
        classpath 'com.huawei.agconnect:agcp:1.9.1.301'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://developer.huawei.com/repo/' }
    }
}
```

`example/android/app/build.gradle`:

```gradle
dependencies {
    implementation 'com.clevertap.android:clevertap-hms-sdk:1.5.1'
    implementation 'com.huawei.hms:push:6.11.0.300'
}

// Apply at the bottom, after the Android plugin is applied to this module.
apply plugin: 'com.huawei.agconnect'
```

## 3. Register the HMS provider with CleverTap (manifest)

`example/android/app/src/main/AndroidManifest.xml`, inside `<application>`:

```xml
<meta-data
    android:name="CLEVERTAP_PROVIDER_1"
    android:value="hps,hps_token,com.clevertap.android.hms.HmsPushProvider,com.huawei.hms.push.HmsMessageService" />
```

This tells CleverTap core to discover the `hps` push type at init.

## 4. agconnect-services.json (REQUIRED — replace the placeholder)

`example/android/app/agconnect-services.json` in this repo is a **placeholder** with
dummy values. It will let the project build, but tokens will not be delivered and
CleverTap will still mark the device unreachable.

Replace it with the real file for your app:

1. In [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html),
   open (or create) an app whose **package name matches the app's `applicationId`**
   (`com.example.clevertap_plugin_example`, or change the `applicationId` to match yours).
2. Enable **Push Kit** for that app and add your app's signing certificate
   **SHA-256 fingerprint** (Project Settings → General information). Without it you
   get `6003: certificate fingerprint error` when fetching a token.
3. Download `agconnect-services.json` and drop it in `example/android/app/`.

## 5. Dart: fetch the token and hand it to CleverTap

See `example/lib/main.dart` (`_initHmsPush` / `_registerHmsTokenWithCleverTap`):

```dart
import 'package:huawei_push/huawei_push.dart' as hms;

void _initHmsPush() {
  hms.Push.getTokenStream.listen(_registerHmsTokenWithCleverTap, onError: (e) {
    print("HMS getTokenStream error: $e");
  });
  hms.Push.setAutoInitEnabled(true);
  hms.Push.getToken("");
}

void _registerHmsTokenWithCleverTap(String token) {
  if (token.isEmpty) return;
  CleverTapPlugin.pushRegistrationToken(token, {
    'type': 'hps',
    'prefKey': 'hps_token',
    'className': 'com.clevertap.android.hms.HmsPushProvider',
    'messagingSDKClassName': 'com.huawei.hms.push.HmsMessageService',
  });
}
```

## 6. Render incoming pushes (self-handled)

In this self-handled setup, `huawei_push` receives the HMS message and we hand the
payload to CleverTap to render the notification via `CleverTapPlugin.createNotification`
(it takes the push extras as a JSON string). See `_renderHmsMessageWithCleverTap` in
`example/lib/main.dart`:

```dart
// registered in _initHmsPush():
hms.Push.onMessageReceivedStream.listen(_renderHmsMessageWithCleverTap);

void _renderHmsMessageWithCleverTap(hms.RemoteMessage message) {
  final data = message.dataOfMap ?? <String, String>{};
  if (data.isEmpty) return;
  CleverTapPlugin.createNotification(jsonEncode(data)); // CleverTap builds the notification
}
```

Both `clevertap-hms` and `huawei_push` register an `HmsMessageService` for
`com.huawei.push.action.MESSAGING_EVENT`; HMS would route a message to only one of them
(non-deterministic). To make `huawei_push` the single receiver so the Dart handler above
always fires, disable `clevertap-hms`'s service in `AndroidManifest.xml`:

```xml
<service
    android:name="com.clevertap.android.hms.CTHmsMessageService"
    tools:node="remove" />
```

### Background / killed-state rendering

For pushes that arrive while the app is backgrounded or killed, `huawei_push` runs a
top-level handler in a background isolate. Register it in `_initHmsPush()` and define the
handler (same `createNotification` call as foreground):

```dart
hms.Push.registerBackgroundMessageHandler(hmsBackgroundMessageHandler);

@pragma('vm:entry-point')
void hmsBackgroundMessageHandler(hms.RemoteMessage message) {
  final data = message.dataOfMap ?? <String, String>{};
  if (data.isEmpty) return;
  CleverTapPlugin.createNotification(jsonEncode(data));
}
```

When the app is not in the foreground, `huawei_push` broadcasts the message to a
receiver that then starts the background isolate. **You must declare that receiver in
your app's `AndroidManifest.xml`** — without it, `onMessageReceivedStream` still works
in the foreground but the background handler never fires:

```xml
<receiver
    android:name="com.huawei.hms.flutter.push.receiver.BackgroundMessageBroadcastReceiver"
    android:exported="false">
    <intent-filter>
        <action android:name="com.huawei.hms.flutter.push.receiver.BACKGROUND_REMOTE_MESSAGE" />
    </intent-filter>
</receiver>
```

> Note: killed-state delivery of data messages on Huawei is also subject to the OS's
> power/auto-start management; verified working on a Huawei Nova 13 (BrowserStack).

> Alternative (CleverTap-managed): if you'd rather CleverTap auto-render CleverTap-sent
> pushes with no Dart code, keep `CTHmsMessageService` (don't remove it), drop the
> `onMessageReceivedStream` handler, and instead remove `huawei_push`'s
> `FlutterHmsMessageService`. Pick one owner of the message event — not both.

## 7. Verify

On a Huawei (HMS Core) device, run the app and check logcat:

```
SDK Class Available :com.huawei.hms.push.HmsMessageService
Found provider:com.clevertap.android.hms.HmsPushProvider
Available Provider: ...HmsPushProvider          <-- provider is available
[PushType:hps] Cached New Token successfully ...  <-- token registered
... "ddnd":false                                  <-- device is reachable
```

If you see `Unavailable Provider: ...HmsPushProvider` and `"ddnd":true` while a token
is fetched, the AGConnect Gradle plugin did not process `agconnect-services.json`.
Confirm agcp actually generated its resources in the built APK:

```bash
# 0 = agcp did not run (root cause); > 0 = config present
aapt2 dump resources <app.apk> | grep -c 'string/agc_'
```
