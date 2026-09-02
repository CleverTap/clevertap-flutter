## 👩‍💻 iOS Integration

After installation, you will need to integrate CleverTap SDK into your app.

* Follow the integration instructions [starting with Step 2 here](https://developer.clevertap.com/docs/ios-quickstart-guide#section-step-2-add-clever-tap-credentials).
* Initialize CleverTap SDK by adding the following code snippet:
  + Import the CleverTap header in your AppDelegate file

#### Objective-C
  ```objc
  #import "CleverTap.h"
  #import "CleverTapPlugin.h"
  ```

#### Swift
  ```swift
  import CleverTapSDK
  import clevertap_plugin
  ```

  + In your `didFinishLaunchingWithOptions:` method notify the CleverTap Flutter SDK of application launch

#### Objective-C
  ```objc
  [CleverTap autoIntegrate]; // integrate CleverTap SDK using the autoIntegrate option
  [[CleverTapPlugin sharedInstance] applicationDidLaunchWithOptions:launchOptions];
  ```

#### Swift
  ```swift
  CleverTap.autoIntegrate() // integrate CleverTap SDK using the autoIntegrate option
  CleverTapPlugin.sharedInstance()?.applicationDidLaunch(options: launchOptions)
  ```

### Handling deep links under the UIScene lifecycle

If your app uses the `UIScene` lifecycle (a `SceneDelegate` with a `UIApplicationSceneManifest` in `Info.plist`), the cold-launch push payload is delivered to `scene(_:willConnectTo:options:)` rather than `didFinishLaunchingWithOptions:`. In that case `launchOptions` is `nil`, so you must ALSO notify the plugin from your SceneDelegate for `getInitialUrl` to return the deep link on a cold launch.

#### Objective-C
  ```objc
  - (void)scene:(UIScene *)scene willConnectToSession:(UISceneSession *)session options:(UISceneConnectionOptions *)connectionOptions {
      [[CleverTapPlugin sharedInstance] sceneWillConnectWithOptions:connectionOptions];
  }
  ```

#### Swift
  ```swift
  func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
      CleverTapPlugin.sharedInstance()?.sceneWillConnect(withOptions: connectionOptions)
  }
  ```

> Apps that do NOT use the `UIScene` lifecycle need no changes - keep calling `applicationDidLaunchWithOptions:` from `didFinishLaunchingWithOptions:` as shown above.

### Set up and register for push notifications

1. [Set up push notifications for your app](https://developer.apple.com/documentation/usernotifications/registering_your_app_with_apns).

2. Call the following from your Dart.

  ```dart
  CleverTapPlugin.registerForPush(); 
  ```


