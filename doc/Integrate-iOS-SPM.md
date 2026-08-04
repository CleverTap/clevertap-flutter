## 📦 iOS Integration via Swift Package Manager (SPM)

Flutter introduced Swift Package Manager support as an **opt-in** feature in Flutter 3.24, and it became the **default** package manager in Flutter 3.44. The CleverTap Flutter plugin ships a `Package.swift` alongside its podspec, so both package managers resolve the same native SDK version (`CleverTap-iOS-SDK 7.7.1`).

> **Minimum requirements for SPM integration**
> - Flutter 3.24+ (opt-in) - enabled by default from Flutter 3.44
> - Xcode 15+ (required for `swift-tools-version: 5.9`)
> - iOS deployment target: 13.0+
>
> If you are on Flutter < 3.24, the plugin continues to work via CocoaPods - no action required.

---

### How it works

The plugin ships a Swift package that pins `CleverTap-iOS-SDK 7.7.1`. When your app is built with SPM enabled, Flutter resolves it automatically - you don't add anything to your app's own `Package.swift` or edit any plugin files.

---

### Enabling SPM in your Flutter app

SPM is opt-in on Flutter 3.24–3.43 (and on by default from 3.44). There is **no** `flutter run`/`flutter build` flag and **no** `Info.plist` key for this - you enable it through Flutter configuration.

**Per project (recommended for testing)** - add to your app's `pubspec.yaml`:

```yaml
flutter:
  config:
    enable-swift-package-manager: true
```

**Globally for your machine:**

```bash
flutter config --enable-swift-package-manager
```

To turn it back off, use `enable-swift-package-manager: false` in `pubspec.yaml`, or `flutter config --no-enable-swift-package-manager` globally.

---

### Migrating an existing CocoaPods app to SPM

Once SPM is enabled, Flutter migrates the Xcode project automatically the next time you build or run. To migrate cleanly on an app that already uses CocoaPods:

**1. Enable SPM** (per-project block above, or global flag).

**2. Clear the existing CocoaPods state** (run from your app root):

```bash
flutter clean
cd ios
rm -rf Pods Podfile.lock .symlinks build
rm -rf ~/Library/Developer/Xcode/DerivedData/Runner-*
cd ..
```

**3. Re-resolve and trigger the migration:**

```bash
flutter pub get
flutter build ios --config-only   # or: flutter run
```

On this build Flutter adds a `FlutterGeneratedPluginSwiftPackage` to the Xcode project and resolves every plugin that ships a `Package.swift` (including `clevertap_plugin`) via SPM. Plugins that only ship a podspec stay on CocoaPods - a hybrid setup is expected.

**4. Verify SPM took over.** Open `ios/Runner.xcworkspace` and confirm:
- **Package Dependencies** lists `clevertap_plugin` and, transitively, `clevertap-ios-sdk` at `7.7.1`.
- The regenerated `Podfile.lock` no longer contains a `clevertap_plugin` pod entry.

**5. Build and run** on a simulator/device and smoke-test CleverTap initialization plus a `recordEvent` to confirm native symbols link.

---

### AppDelegate changes when using SPM

When Flutter resolves the plugin via SPM, the module name changes. Use conditional imports in your `AppDelegate` to support both CocoaPods and SPM builds:

**Objective-C**

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

**Swift**

```swift
import CleverTapSDK
import clevertap_plugin
```

These guards ensure your app compiles correctly regardless of which package manager resolved the dependency.

---

### CocoaPods vs SPM

| | CocoaPods | SPM |
|---|---|---|
| SDK version pinned | `7.7.1` | `7.7.1` |
| Deployment target | `13.0` | `13.0` |
| Opt-in required | No | Yes on Flutter 3.24–3.43; default from 3.44 |

Both package managers resolve the same CleverTap iOS SDK version to ensure no drift between the two integration paths.

---

### Troubleshooting

- **Xcode doesn't resolve the package**: Run `flutter pub get`, then in Xcode go to **File → Packages → Resolve Package Versions**.
- **Automatic migration didn't add the package**: In Xcode, add it manually - **Package Dependencies → Add Local…** → select `ios/Flutter/ephemeral/Packages/FlutterGeneratedPluginSwiftPackage` and add it to the `Runner` target. Then under **Product → Scheme → Edit Scheme → Build → Pre-actions**, add a Run Script (with build settings from `Runner`): `"$FLUTTER_ROOT/packages/flutter_tools/bin/xcode_backend.sh" prepare`.
- **Duplicate symbol errors**: Don't use both CocoaPods and SPM for the same plugin at once. If a `Podfile` exists and SPM is enabled, Flutter prefers SPM for plugins that support it.
- **Build fails with missing headers**: Verify your deployment target is `13.0` or higher in both your Xcode project and `Podfile`/`Package.swift`.
- **Stale CocoaPods references after migrating**: If the build still runs `[CP]` Pods build phases (or duplicate-embeds a framework) for a plugin that has moved to SPM, run `pod deintegrate` in your app's `ios/` directory, then `flutter clean && flutter build ios` so Flutter re-integrates cleanly. Use this only as a recovery step - it is not part of the normal migration flow. Flutter regenerates the CocoaPods integration on every build, so a manual `pod deintegrate` is otherwise undone on the next build.
