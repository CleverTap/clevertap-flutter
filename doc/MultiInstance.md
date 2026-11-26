## 🔖 Overview

*Available from CleverTap Flutter SDK v4.5.0, on Android and iOS.*

Multi-instance means **one app sending data to two or more CleverTap accounts**.

- Every CleverTap account has an **account ID** and an **account token**.
- `CleverTapPlugin` works with your **default account**, the one in `AndroidManifest.xml` / `Info.plist`. It works exactly as before.
- Every other account gets a **handle**: a `CleverTapInstance` object with the same methods and event handlers as `CleverTapPlugin`. Every call and every event on a handle belongs to that one account only.

```dart
import 'package:clevertap_plugin/clevertap_plugin.dart';

// Default account (AndroidManifest.xml / Info.plist): unchanged
CleverTapPlugin.recordEvent('App Opened', {});

// A second account, created from Dart
final insurance = await CleverTapPlugin.createInstance(
  const CleverTapInstanceConfig(
    accountId: 'INSURANCE-ACCOUNT-ID',
    accountToken: 'INSURANCE-TOKEN',
    region: 'eu1',
  ),
);
insurance.recordEvent('Policy Viewed', {'plan': 'gold'});

// Runs for the insurance account's profile only
insurance.setCleverTapProfileDidInitializeHandler(() {
  print('Insurance profile ready');
});
```

| Line | Which account receives it |
|---|---|
| `CleverTapPlugin.recordEvent('App Opened', {})` | Default account only |
| `insurance.recordEvent('Policy Viewed', ...)` | Insurance account only |
| `insurance.setCleverTapProfileDidInitializeHandler(...)` | Runs for the insurance account's event only. The default account's event never reaches it. |

### Do you need this?

| Your app | What to do |
|---|---|
| One CleverTap account (most apps) | Nothing. Keep using `CleverTapPlugin` as before. |
| Two or more accounts used at the same time | Use handles, as shown in this guide. |

> Web does not support additional accounts. On Web, `createInstance` throws a `PlatformException` with code `Unimplemented`, and handle methods print a warning and do nothing.

-----------

## The three ways an account can exist

| Way | Who creates it | When | How you get it in Dart |
|---|---|---|---|
| **Default account** | The native SDK, from `AndroidManifest.xml` / `Info.plist` | App start | `CleverTapPlugin` (static methods) |
| **Launch config** (native code) | Your `Application` / `AppDelegate` | App start, before Flutter runs | `CleverTapPlugin.getInstance(accountId)` |
| **`createInstance`** (Dart) | Your Dart code | When your Dart code runs (about 1 to 2 seconds into a cold start) | `await CleverTapPlugin.createInstance(config)` |

Which one for an extra account?

- The account sends **push notifications** to this app → use a **launch config**. When the app was killed, Android shows the push of an extra account only if that account already exists, and iOS sends the tap that opened the app only to accounts that already exist. See [Create accounts at app start](#create-accounts-at-app-start-launch-configs).
- The credentials are known only at runtime (for example fetched from your server) → use **`createInstance`**.
- Anything else → either works. `createInstance` needs no native code.

-----------

## Create an account from Dart: `createInstance(config)`

```dart
try {
  final insurance = await CleverTapPlugin.createInstance(
    const CleverTapInstanceConfig(
      accountId: 'INSURANCE-ACCOUNT-ID',
      accountToken: 'INSURANCE-TOKEN',
      region: 'eu1',
      logLevel: CleverTapLogLevel.debug,
    ),
  );
  // Set this account's handlers right away, so its first events are not missed.
  insurance.setCleverTapPushClickedPayloadReceivedHandler((payload) => print(payload));
} on PlatformException catch (e) {
  print('Could not create the account: ${e.code} ${e.message}');
}
```

#### Config reference

Only `accountId` and `accountToken` are required. A setting left `null` keeps the SDK's default. On Android that default comes from `AndroidManifest.xml`; on iOS it is the SDK's built-in default.

| Field | Type | Meaning |
|---|---|---|
| `accountId`, `accountToken` | `String` | The account. Required, not empty. |
| `region` | `String?` | For example `eu1`, `in1`, `us1`. |
| `proxyDomain`, `spikyProxyDomain` | `String?` | Custom proxy domains. On iOS a `region` wins over the proxy domains (a warning is logged); Android applies both. |
| `handshakeDomain` | `String?` | Custom handshake domain. |
| `identityKeys` | `List<String>?` | Profile identity keys for this account, for example `['Email', 'Phone']`. |
| `logLevel` | `CleverTapLogLevel?` | `off`, `info`, `debug`, `verbose` for this account. iOS has no verbose level and uses debug. |
| `analyticsOnly` | `bool?` | Record data only: no in-apps, inbox or push handling. |
| `enablePersonalization` | `bool?` | Turn personalization on or off for this account. |
| `disableAppLaunchedEvent` | `bool?` | Do not send App Launched for this account. |
| `encryptionLevel` | `CleverTapEncryptionLevel?` | `none`, `medium` (personal data only), `high` (all data). |
| `encryptionInTransit` | `bool?` | Encrypt the network payload. |
| `useCustomCleverTapId`, `cleverTapId` | `bool?`, `String?` | Use your own CleverTap ID. Give both together, or neither. |
| `android` | `CleverTapAndroidConfig?` | `useGoogleAdId`, `backgroundSync`, `pushProviders` (`CleverTapPushProvider`). Ignored on iOS. |
| `ios` | `CleverTapIosConfig?` | `disableIDFV`, `enableFileProtection`. Ignored on Android. |

#### Calling it twice

`createInstance` for an account that already exists returns the same account and **ignores the new config**. A native warning says so. A new config takes effect on the next app launch.

| Call | Result |
|---|---|
| `createInstance(B, region: 'eu1')` | B is created with `eu1` |
| `createInstance(B, region: 'in1')` later, same app run | Returns B, still `eu1`. Warning: `createInstance: account B already exists in this app run; the new config was ignored.` |

#### Errors

`createInstance` throws a `PlatformException`:

| Code | Meaning | Example |
|---|---|---|
| `EINVALID` | The config is not acceptable. The message names the field. | An empty `accountId`; `cleverTapId` without `useCustomCleverTapId: true`; a wrong type for a field |
| `ECREATE` | The native SDK could not create the account. | Two custom templates with the same name (see [Custom templates per account](#custom-templates-per-account)) |
| `Unimplemented` | Web, which does not support additional accounts. | — |

-----------

## Get a handle for an existing account: `getInstance(accountId)`

```dart
final insurance = CleverTapPlugin.getInstance('INSURANCE-ACCOUNT-ID');
```

- It returns the **same object** every time for the same ID. The first call in the app starts the plugin, as `CleverTapPlugin()` and `createInstance` do, so the handle receives its account's events even if your app never calls `CleverTapPlugin()`.
- Use it for an account that already exists: a launch-config account, or one created earlier with `createInstance` (which returns this same object).
- An empty ID throws an `ArgumentError`.
- A method called on a handle whose account does not exist logs `CleverTap instance not found for accountId: X` natively. Methods that return nothing then complete; methods that return a value throw a `PlatformException` with that message.

-----------

## Create accounts at app start (launch configs)

#### Why this exists

Push handling runs as soon as the app process starts, before your Dart code. Example: account B was created with `createInstance`, the user swipes the app away, and B sends a push.

| | Android | iOS |
|---|---|---|
| B's push arrives while the app is killed | **Not shown.** The SDK looks B up, but only the default account exists yet. | Shown by iOS. |
| The user taps it | — | **Lost.** The tap goes only to the accounts that exist when the app finishes launching. |

A launch config creates B in native code at app start, so B exists before any push code runs. B's push is shown, the tap is recorded on B, and B's `setCleverTapPushClickedPayloadReceivedHandler` receives it.

#### Android

If your `Application` class extends `CleverTapApplication`, override `launchConfigs()`:

```java
import com.clevertap.android.sdk.ActivityLifecycleCallback;
import com.clevertap.android.sdk.CleverTapInstanceConfig;
import com.clevertap.clevertap_plugin.CleverTapApplication;
import com.clevertap.clevertap_plugin.CleverTapLaunchConfig;
import java.util.Collections;
import java.util.List;

public class MyApplication extends CleverTapApplication {

    @Override
    public void onCreate() {
        ActivityLifecycleCallback.register(this);
        super.onCreate(); // creates the default account, then the launch configs
    }

    @Override
    protected List<CleverTapLaunchConfig> launchConfigs() {
        CleverTapInstanceConfig insurance =
                CleverTapInstanceConfig.createInstance(this, "INSURANCE-ACCOUNT-ID", "INSURANCE-TOKEN", "eu1");
        return Collections.singletonList(new CleverTapLaunchConfig(insurance));
    }
}
```

Otherwise, call `CleverTapPlugin.createLaunchInstances` in your own `Application.onCreate()`:

```java
import com.clevertap.clevertap_plugin.CleverTapPlugin;

@Override
public void onCreate() {
    ActivityLifecycleCallback.register(this);
    super.onCreate();
    CleverTapInstanceConfig insurance =
            CleverTapInstanceConfig.createInstance(this, "INSURANCE-ACCOUNT-ID", "INSURANCE-TOKEN", "eu1");
    CleverTapPlugin.createLaunchInstances(this, Collections.singletonList(new CleverTapLaunchConfig(insurance)));
}
```

- Call it on the main thread, in `Application.onCreate()`. A call from another thread is moved to the main thread with an error log, and a push that opened the app may then be missed.
- The config is the native `CleverTapInstanceConfig`, so every native setting is available.
- If you use custom templates, register them before `super.onCreate()` (see [Custom templates per account](#custom-templates-per-account)).
- An account that cannot be created is logged and skipped. The other accounts are still created, and app start never crashes because of it.

#### iOS

In `didFinishLaunchingWithOptions`, call `applicationDidLaunchWithOptions:launchConfigs:` instead of `applicationDidLaunchWithOptions:`:

```objc
#import <clevertap_plugin/CleverTapPlugin.h>
#import <clevertap_plugin/CleverTapPluginLaunchConfig.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [GeneratedPluginRegistrant registerWithRegistry:self];
    CleverTapInstanceConfig *insurance = [[CleverTapInstanceConfig alloc] initWithAccountId:@"INSURANCE-ACCOUNT-ID"
                                                                               accountToken:@"INSURANCE-TOKEN"
                                                                              accountRegion:@"eu1"];
    [[CleverTapPlugin sharedInstance] applicationDidLaunchWithOptions:launchOptions
                                                       launchConfigs:@[[[CleverTapPluginLaunchConfig alloc] initWithConfig:insurance]]];
    [CleverTap autoIntegrate];
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
```

If your `AppDelegate` uses the `__has_include` import pattern from [Integrate-iOS-SPM.md](Integrate-iOS-SPM.md#appdelegate-changes-when-using-spm), import `CleverTapPluginLaunchConfig.h` the same way as `CleverTapPlugin.h`.

#### Dart side

Reach a launch-config account with `getInstance`, and set its handlers when the app starts:

```dart
final insurance = CleverTapPlugin.getInstance('INSURANCE-ACCOUNT-ID');
insurance.setCleverTapPushClickedPayloadReceivedHandler((payload) {
  // The push that opened the app, if it was the insurance account's
});
```

Do not call `createInstance` for a launch-config account: the account already exists, so your Dart config would be ignored.

#### Custom CleverTap ID at launch

Pass the ID as the second argument and enable custom IDs on the config:

| Platform | Code |
|---|---|
| Android | `config.setEnableCustomCleverTapId(true);` and `new CleverTapLaunchConfig(config, "my-clevertap-id")` |
| iOS | `config.useCustomCleverTapId = YES;` and `[[CleverTapPluginLaunchConfig alloc] initWithConfig:config cleverTapID:@"my-clevertap-id"]` |

Without the flag the SDK ignores the ID, and a warning is logged.

-----------

## What a handle can do

A handle has the per-account methods of `CleverTapPlugin`, with the same names and arguments: events, user profiles, login, session and event history, App Inbox, Native Display, product config and feature flags, push permission and push primer, in-app controls, location, opt-out and offline mode, personalization, variables, and custom templates.

These stay on `CleverTapPlugin` only, because they belong to the app or the operating system, not to one account. They are not on the handle, so calling them on a handle does not compile:

| Method | Why |
|---|---|
| `registerForPush`, `getInitialUrl`, `createNotification`, `processPushNotification`, the notification channel methods | The OS has one of each per app |
| `setDebugLevel` | One SDK log level per app. For one account, use `logLevel` in its config. |
| `getAppLaunchNotification`, `onKilledStateNotificationClicked` | One app launch, one handler |
| `createInstance`, `getInstance` | They create or find handles |

-----------

## Event handlers per account

A handle has the same 20 handler setters as `CleverTapPlugin` (for example `setCleverTapInAppNotificationShowHandler`, `setCleverTapPushClickedPayloadReceivedHandler`, `setCleverTapCustomTemplatePresentHandler`). Setting one replaces the handle's previous handler for that event.

| Event comes from | `CleverTapPlugin` handler | Default account's handle | Account B's handle |
|---|---|---|---|
| Default account | ✅ | ✅ | — |
| Account B | — | — | ✅ |

**Set each account's handlers when the app starts.** Events that arrive before a handler is set are not kept for long:

- Android holds early events until that account's handler is set, but discards them 5 seconds after the first screen opens.
- iOS does not hold them: an event that arrives before the handler is set is dropped (a log line names it).

-----------

## Variables per account

Each account has its own variables. Defining `discount` on the default account and on B keeps two separate values:

```dart
await CleverTapPlugin.defineVariables({'discount': 10});
await insurance.defineVariables({'discount': 0});
print(await CleverTapPlugin.getVariable('discount')); // 10
print(await insurance.getVariable('discount'));       // 0
```

The variables callbacks (`onVariablesChanged`, `onValueChanged`, and the others) are on the handle too, and run only for that account's changes. Each registration runs once per change, as in the native SDKs. See [Variables.md](Variables.md#setup-callbacks).

-----------

## Custom templates per account

- **Definitions are app-wide.** Register your `templates.json` once, in native code, as described in [CustomCodeTemplates.md](CustomCodeTemplates.md). Every account gets the same templates, including accounts created later.
- **Each account presents its own.** When account B shows a template, only B's handle receives it, and only B's handle can read its arguments and dismiss it:

```dart
insurance.setCleverTapCustomTemplatePresentHandler((templateName) async {
  final title = await insurance.customTemplateGetStringArg(templateName, 'title');
  showMyDialog(title, onClose: () => insurance.customTemplateSetDismissed(templateName));
  await insurance.customTemplateSetPresented(templateName);
});
```

- **Register templates before any account is created**: before `super.onCreate()` on Android, and before `applicationDidLaunchWithOptions:` on iOS. An account created earlier never gets them.
- Set template handlers on every account that has template campaigns. A template that is never dismissed keeps that account's in-app messages waiting.

-----------

## Push taps on Android when the app is in the background

On Android 12 and above, a tap on a notification while the app is in the background reaches `onNewIntent`. Forward it to the account the push belongs to, not always to the default account:

```kotlin
override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        val extras = intent.extras ?: return
        // The push names its account; a push without one belongs to the default account.
        val accountId = extras.getString("wzrk_acct_id")
        val instance = if (accountId != null) CleverTapAPI.getGlobalInstance(this, accountId)
                       else CleverTapAPI.getDefaultInstance(this)
        instance?.pushNotificationClickedEvent(extras)
    }
}
```

Forwarding every tap to the default account loses B's taps: the default account refuses a push that is not its own.

-----------

## Rules you must follow

| Rule | What goes wrong if you skip it |
|---|---|
| `createInstance`, or a launch config, must be the **first** thing that touches an account in every app run. | A handle call before it finds no account: values throw `CleverTap instance not found for accountId: X`, void calls do nothing. |
| Launch-config accounts: use `getInstance` only. | A Dart config passed to `createInstance` is ignored, so a difference between the two configs stays hidden. |
| `createInstance` twice in the same run returns the existing account and ignores the new config. | You think the new config applied. It did not; it applies at the next launch. |
| `cleverTapId` and `useCustomCleverTapId: true` go together. | `createInstance` throws `EINVALID`. |
| Accounts that send push should be launch-config accounts. | A `createInstance`-only account misses its pushes while the app is killed. |
| Set each account's handlers when the app starts. | Early events (for example the push that opened the app) are dropped. |
| Register custom templates before any account is created. | Accounts created earlier have no templates. |
| OS-level methods stay on `CleverTapPlugin`. | They are not on the handle (compile error). |

-----------

## What each message means

Native messages appear in Logcat (Android) or the Xcode console (iOS). Dart messages appear in the Flutter console.

| Message | Where | Meaning | Fix |
|---|---|---|---|
| `CleverTap instance not found for accountId: X. Call ignored. Check the ID, and create the instance before using it.` | Native | A handle call for an account that does not exist in this app run. | Create it first (`createInstance` or a launch config). Check the ID. |
| `CleverTap default instance not found. Add your CleverTap account ID and token to AndroidManifest.xml.` / `... Add CleverTapAccountID and CleverTapToken to Info.plist.` | Native | A `CleverTapPlugin` call, but the app has no default account. | Add the default account, or use handles for everything. |
| `createInstance: account X already exists in this app run; the new config was ignored. Restart the app to apply a new config.` | Native | `createInstance` for an account that exists. | Expected for a second call. For a launch-config account, use `getInstance`. |
| `createInstance: iOS cannot combine region with proxyDomain/spikyProxyDomain; region applied, proxy settings ignored (Android applies both)` | iOS | Both `region` and a proxy domain were given. | Pass only one of them on iOS. |
| `createInstance: spikyProxyDomain requires proxyDomain; ignored` | iOS | `spikyProxyDomain` without `proxyDomain`. | Pass both. |
| `Launch config X has a CleverTap ID but its config does not enable custom IDs; the SDK will ignore the ID.` (Android) / `launch config X has a CleverTap ID but useCustomCleverTapId is NO; ...` (iOS) | Native, at app start | A custom ID without the flag. | Enable custom IDs on the config. |
| `Launch config X could not be created; the other accounts continue: ...` / `Launch config X: the SDK created no instance.` | Native, at app start | That account could not be created. The other accounts were. | Check the config and the error in the log. |
| `Launch config X is the default account (AndroidManifest.xml), which already exists; skipped.` | Native, at app start | The default account was listed as a launch config. | Remove it from the list. |
| `createLaunchInstances must be called on the main thread, in Application.onCreate(). ...` | Android | Called from a background thread. | Call it in `Application.onCreate()`. |
| `CleverTapPlugin: <event> for account X has no handler (set one on CleverTapPlugin.getInstance('X'))` | Dart | Account X sent an event, but its handle has no handler for it. | Set the handler at app start, if you need the event. |
| `CleverTapPlugin: account handles are not supported on Web; ...` / `CleverTapPlugin: account handlers are not supported on Web; ...` | Dart | A handle method or handler setter was used on Web. | Use `CleverTapPlugin` on Web. |

-----------

## Limits

| Limit | Details |
|---|---|
| Web | No additional accounts. |
| No `destroyInstance` | An account lives as long as the app process. Neither native SDK can remove one. |
| Killed-app pushes for Dart-created accounts | Not shown (Android) or not tapped through (iOS). Use launch configs. |
| `onKilledStateNotificationClicked` (Android) | Runs for the default account's pushes only. Other accounts' taps reach their handle's `setCleverTapPushClickedPayloadReceivedHandler`. |
| Push Amplification handler (Android) | Per account. Setting `setCleverTapPushAmpPayloadReceivedHandler` on B's handle means your handler draws B's Push Amplification notifications; accounts without the handler keep SDK drawing. See [Custom Push Amplification](Usage.md#custom-push-amplification). |
| iOS once-callbacks for variables | With iOS SDK 7.9.0, `onOneTimeVariablesChanged` and `onceVariablesChangedAndNoDownloadsPending` registered before the values arrive run only for the first account that registers one. Registered after the values arrived, they run for every account. This is a bug in the iOS SDK. |
| One visual in-app at a time | The native SDKs show one in-app at a time for the whole app, across accounts. Another account's in-app waits. |

-----------

## Upgrading from an older version

Nothing changes for an app that uses one account. Two fixes in 4.5.0 change behavior you might notice:

| Change | Before 4.5.0 | From 4.5.0 |
|---|---|---|
| Variables callbacks | With two `onVariablesChanged` callbacks, each ran twice per change. A `onOneTimeVariablesChanged` callback could run again. `onValueChanged('a')` also ran for other variables. | Each registration runs once per change, as in the native SDKs. `onValueChanged('a')` runs only for `a`. |
| iOS app functions | An app function ran the custom template handler. | It runs `setCleverTapCustomFunctionPresentHandler`, as on Android. |

-----------

## Try it in the example app

The [example app](../example/lib/main.dart) has a **Multi-Instance** section: create a second account, record an event, log in a user, set a profile, read the CleverTap ID, call an unknown account, use the inbox, variables, product config and personalization on the second account, and its custom templates. The account is a test ID (`TEST-ACC-B`); replace it with your own test account to see the data on your dashboard.

Launch configs for the same account are in [MyApplication.java](../example/android/app/src/main/java/com/example/clevertap_plugin_example/MyApplication.java) and [AppDelegate.m](../example/ios/Runner/AppDelegate.m), commented out. Uncomment them to try a killed-app push.
