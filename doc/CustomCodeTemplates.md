# Custom Code Templates

CleverTap Flutter Native SDK 3.0.0 and above supports a custom presentation of in-app messages. This allows for utilizing the in-app notifications functionality with custom configuration and presentation logic. Two types of templates can be defined through the SDK: Templates and Functions. Templates can contain action arguments while Functions cannot and Functions can be used as actions while Templates cannot. Functions can be either "visual" or "non-visual". "Visual" functions can contain UI logic and will be part of the [In-App queue](#in-App-queue), while "non-visual" functions will be triggered directly when invoked and should not contain UI logic.

## Creating templates and functions
Templates consist of a name, type, and arguments (and isVisual for Functions). Type and arguments (and isVisual for Functions) are required and names must be unique across the application. The template definitions are validated for correctness and will throw `CustomTemplateException` when an invalid template is created on launching the application. Those exceptions should generally not be caught and template definitions must be valid to be triggered correctly.

The templates are defined in а JSON format with the following scheme:
```json
{
  "TemplateName": {
    "type": "template",
    "arguments": {
      "Argument1": {
        "type": "string|number|boolean|file|action|object",
        "value": "val"
        },
      "Argument2": {
        "type": "object",
        "value": {
          "Nested1": {
            "type": "string|number|boolean|object",
            "value": "val"
          },
          "Nested2": {
            "type": "string|number|boolean|object",
            "value": "val"
          }
        }
      }
    }
  },
  "functionName": {
    "type": "function",
    "isVisual": true|false,
    "arguments": {
      "a": {
      "type": "string|number|boolean|file|object",
      "value": "val"
      }
    }
  }
}
```
The JSON definitions should be placed in one or more files in the following locations:
 - Android: in `assets` directory
 - iOS: in any directory linked to the project

For a working example, see the Example project: `example/ios/Runner/templates.json` and `Example/android/app/src/main/assets/templates.json`.

### Arguments
An `argument` is a structure that represents the configuration of the custom code templates. It consists of a `type` and a `value`.
The supported argument types are:
- Primitives - `boolean`, `number`, and `string`. They must have a default value which would be used if no other value is configured for the notification.
- `object` - An `Object` where keys are the argument names and values are ```Arguments``` with supported primitive values.
- `file` - a file argument that will be downloaded when the template is triggered. Files don't have default values.
- `action` - an action argument that could be a function template or a built-in action like ‘close’ or ‘open url’. Actions don't have default values.

#### Hierarchical arguments
You can group arguments by either using an `object` argument or indicating the group in the argument's name by using a "." symbol. Both definitions are treated the same. `file` and `action` type arguments can only be added to a group by specifying the group in the argument's name.

The following code snippets define identical arguments:
```json
"arguments": {
    "map": {
        "type": "object",
        "value": {
            "a": {
                "type": "number",
                "value": 5
            },
            "b": {
                "type": "number",
                "value": 6
            }
        }
    }
}
```
and
```json
"arguments": {
    "map.a": {
        "type": "number",
        "value": 5
    },
    "map.b": {
        "type": "number",
        "value": 6
    }
}
```

### Template definition example
```json
"Example template": {
    "type": "template",
    "arguments": {
        "boolArg": {
            "type": "boolean",
            "value": false
        },
        "stringArg": {
            "type": "string",
            "value": "Default"
        },
        "mapArg": {
            "type": "object",
            "value": {
                "int": {
                    "type": "number",
                    "value": 0
                },
                "string": {
                    "type": "string",
                    "value": "Default"
                }
            }
        },
        "actionArg": {
            "type": "action"
        },
        "fileArg": {
            "type": "file"
        }
    }
}
```

## Registering custom templates

Templates must be registered within the native applications:

### For Android
Call `CleverTapCustomTemplates.registerCustomTemplates` in your `Application.onCreate` method.
 - If you are extending `CleverTapApplication` or otherwise add these lines before calling `super.onCreate()`:
```java
public class MainApplication extends CleverTapApplication {
    @Override
    public void onCreate() {
        ActivityLifecycleCallback.register(this);
        CleverTapCustomTemplates.registerCustomTemplates(this, "templates.json");
        super.onCreate();
    }
}
```

### For iOS
Call `[CleverTapPluginCustomTemplates registerCustomTemplates]` in your `AppDelegate.didFinishLaunchingWithOptions` before calling `[CleverTap autoIntegrate]`:
```objc
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [CleverTapPluginCustomTemplates registerCustomTemplates:@"templates", nil];
    [GeneratedPluginRegistrant registerWithRegistry:self];
    [[CleverTapPlugin sharedInstance] applicationDidLaunchWithOptions:launchOptions];
    [CleverTap autoIntegrate]; // integrate CleverTap SDK using the autoIntegrate option
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
```

## Syncing in-app templates to the dashboard

For the templates to be usable in campaigns they must be synced with the dashboard. When all templates and functions are defined and registered in the SDK, they can be synced by calling `CleverTap.syncCustomTemplates()` or `CleverTap.syncCustomTemplatesInProd()` in your Flutter application. The syncing can only be done in debug builds and with an SDK user marked as a "test user". We recommend only calling this function while developing the templates and deleting the invocation in release builds.

## Presenting templates

When a custom template is triggered, the corresponding event `CleverTap.CleverTapCustomTemplatePresent` or `CleverTap.CleverTapCustomFunctionPresent` will be raised. Applications with custom templates or functions must set the handlers `setCleverTapCustomTemplatePresentHandler` and `setCleverTapCustomFunctionPresentHandler`. When the event handler is invoked, this template will be considered "active" until `CleverTapPlugin.customTemplateSetDismissed(templateName)` is called. While a template is "active" the following functions can be used:

- Obtain argument values by using the appropriate `customTemplateGet*Arg(templateName: string, argName: string)` methods.
- Trigger actions by their name through `CleverTapPlugin.customTemplateRunAction(templateName: string, argName: string)`.
- Set the state of the template invocation. `CleverTapPlugin.customTemplateSetPresented(templateName: string)` and `CleverTap.customTemplateSetDismissed(templateName: string)` notify the SDK of the state of the current template invocation. The presented state is when an in-app is displayed to the user and the dismissed state is when the in-app is no longer displayed.

Only one visual template or other InApp message can be displayed at a time by the SDK and no new messages can be shown until the current one is dismissed.

Applications should also set another handler to `setCleverTapCustomTemplateCloseHandler` which will be raised when a template should be closed (this could occur when an action of type "close" is triggered). Use this handler to remove the UI associated with the template and call `CleverTap.customTemplateSetDismissed(templateName)` to close it.

### Example

```dart
void activateCleverTapFlutterPluginHandlers() {
  _clevertapPlugin.setCleverTapCustomTemplatePresentHandler(presentCustomTemplate);
  _clevertapPlugin.setCleverTapCustomTemplateCloseHandler(closeCustomTemplate);
  _clevertapPlugin.setCleverTapCustomFunctionPresentHandler(presentCustomFunction);
}

void presentCustomTemplate(String templateName) async {
  // some function which shows ui
  showDialog(
    data: Data,
    onClose: closeCustomTemplate(templateName),
    onPresented: setCustomTemplatePresented(templateName)
  );
}

void setCustomTemplatePresented(String templateName) {
  CleverTapPlugin.customTemplateSetPresented(templateName);
}

void closeCustomTemplate(String templateName) {
  CleverTapPlugin.customTemplateSetDismissed(templateName);
}

void presentCustomFunction(String templateName) {
  CleverTapPlugin.customTemplateSetPresented(templateName);
}
```

### In-App queue
When an in-app needs to be shown it is added to a queue (depending on its priority) and is displayed when all messages before it have been dismissed. The queue is saved in the storage and kept across app launches to ensure all messages are displayed when possible. The custom code in-apps behave in the same way. They will be triggered once their corresponding notification is the next one in the queue to be shown. However since the control of the dismissal is left to the application's code, the next in-app message will not be displayed until the current code template has called `CleverTapPlugin.customTemplateSetDismissed(templateName)`

### File downloading and caching
File arguments are automatically downloaded and are ready for use when an in-app template is presented. The files are downloaded when a file argument has changed and this file is not already cached. For client-side in-apps, this happens at App Launch and is retried if needed when an in-app should be presented. For server-side in-apps, the file downloading happens only before presenting the in-app. If any of the file arguments of an in-app fails to be downloaded, the whole in-app is skipped and the custom template will not be triggered.
