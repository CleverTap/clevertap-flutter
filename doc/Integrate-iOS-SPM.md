## 📦 iOS Integration via Swift Package Manager (SPM)

Starting from Flutter 3.27, Flutter supports resolving plugin dependencies via Swift Package Manager in addition to CocoaPods. The CleverTap Flutter plugin ships a `Package.swift` alongside its podspec, so both package managers resolve the same native SDK version (`CleverTap-iOS-SDK 7.7.1`).

> **Minimum requirements**
> - Flutter 3.27+
> - Xcode 15+
> - iOS deployment target: 13.0+

---

### How it works

Flutter's SPM support detects plugins that declare a `swiftPackageName` in their `pubspec.yaml`. The CleverTap plugin sets:

```yaml
# pubspec.yaml (inside the plugin)
ios:
  pluginClass: CleverTapPlugin
  swiftPackageName: clevertap_plugin
```

Flutter then looks for a `Package.swift` under `ios/<swiftPackageName>/` (`ios/clevertap_plugin/Package.swift`). That manifest pins the CleverTap iOS SDK:

```swift
.package(
    url: "https://github.com/CleverTap/clevertap-ios-sdk",
    exact: "7.7.1"
)
```

When your app is built, Flutter resolves this package automatically — no manual entry in `Package.swift` of your app is required.

---

### Enabling SPM in your Flutter app

SPM support in Flutter is opt-in. Enable it by setting the `FLTEnableSwiftPackageManagerIntegration` flag in your iOS app's `Info.plist`:

```xml
<key>FLTEnableSwiftPackageManagerIntegration</key>
<true/>
```

Or via the Flutter CLI environment variable when running or building:

```bash
flutter run --enable-swift-package-manager
flutter build ios --enable-swift-package-manager
```

After enabling, run `flutter pub get` and then open your `.xcworkspace` in Xcode. Xcode will resolve the CleverTap iOS SDK via SPM automatically.

---

### AppDelegate changes when using SPM

When Flutter resolves the plugin via SPM, the module name changes. Use conditional imports in your `AppDelegate` to support both CocoaPods and SPM builds:

###### Objective-C

```objc
#if __has_include(<CleverTapSDK/CleverTap.h>)
#import <CleverTapSDK/CleverTap.h>
#else
#import "CleverTap.h"
#endif

#if __has_include(<clevertap_plugin/CleverTapPlugin.h>)
#import <clevertap_plugin/CleverTapPlugin.h>
#else
#import "CleverTapPlugin.h"
#endif
```

###### Swift

```swift
import CleverTapSDK
import clevertap_plugin
```

These guards ensure your app compiles correctly regardless of which package manager resolved the dependency.

---

### CocoaPods vs SPM

| | CocoaPods | SPM |
|---|---|---|
| Config file | `ios/clevertap_plugin.podspec` | `ios/clevertap_plugin/Package.swift` |
| SDK version pinned | `7.7.1` | `7.7.1` |
| Deployment target | `13.0` | `13.0` |
| Opt-in required | No (default) | Yes (see above) |

Both package managers resolve the same CleverTap iOS SDK version to ensure no drift between the two integration paths.

---

### Troubleshooting

- **Xcode doesn't resolve the package**: Run `flutter pub get`, then in Xcode go to **File → Packages → Resolve Package Versions**.
- **Duplicate symbol errors**: Ensure you are not using both CocoaPods and SPM for the same plugin simultaneously. If you have a `Podfile` and SPM enabled, Flutter will prefer SPM for plugins that support it.
- **Build fails with missing headers**: Verify your deployment target is set to `13.0` or higher in both your Xcode project and `Podfile`/`Package.swift`.
