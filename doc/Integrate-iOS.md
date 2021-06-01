## 👩‍💻 iOS Integration

After installation, you will need to integrate CleverTap SDK into your app.

* Follow the integration instructions [starting with Step 2 here](https://developer.clevertap.com/docs/ios-quickstart-guide#section-step-2-add-clever-tap-credentials).
* Initialize CleverTap SDK by adding the following code snippet:
  + Import the CleverTap header in your AppDelegate file

  ###### Objective-C
  ```objc
  #import "CleverTap.h"
  #import "CleverTapPlugin.h"
  ```

  ###### Swift
  ```swift
  import CleverTapSDK
  import clevertap_plugin
  ```

  + In your `didFinishLaunchingWithOptions:` method notify the CleverTap Flutter SDK of application launch

  ###### Objective-C
  ```objc
  [CleverTap autoIntegrate]; // integrate CleverTap SDK using the autoIntegrate option
  [[CleverTapPlugin sharedInstance] applicationDidLaunchWithOptions:launchOptions];
  ```

  ###### Swift
  ```swift
  CleverTap.autoIntegrate() // integrate CleverTap SDK using the autoIntegrate option
  CleverTapPlugin.sharedInstance()?.applicationDidLaunch(options: launchOptions)
  ```
