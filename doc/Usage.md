# Example Usage

## User Profiles

#### Update User Profile(Push Profile)

```Dart
var stuff = ["bags", "shoes"];
var profile = {
    'Name': 'John Wick',
    'Identity': '100',
    'DOB': '22-04-2000',
    //Key always has to be "DOB" and format should always be dd-MM-yyyy
    'Email': 'john@gmail.com',
    'Phone': '14155551234',
    'props': 'property1',
    'stuff': stuff
};
CleverTapPlugin.profileSet(profile);
```

#### Set Multi Values For Key 

```Dart
var values = ["value1", "value2"];
CleverTapPlugin.profileSetMultiValues("props", values);
```

#### Remove Multi Value For Key

```Dart
var values = ["value1", "value2"];
CleverTapPlugin.profileRemoveMultiValues("props", values);
```

#### Add Multi Value For Key

```Dart
var values = ["value1", "value2"];
CleverTapPlugin.profileAddMultiValues("props", values);
```

#### Increment Value For Key

```Dart
CleverTapPlugin.profileIncrementValue("score", value);
```

#### Decrement Value For Key

```Dart
CleverTapPlugin.profileDecrementValue("score", value);
```

#### Create a User profile when user logs in (On User Login)

```Dart
var stuff = ["bags", "shoes"];
var profile = {
    'Name': 'Captain America',
    'Identity': '100',
    'Email': 'captain@america.com',
    'Phone': '+14155551234',
    'stuff': stuff
};
CleverTapPlugin.onUserLogin(profile);
```

#### Get CleverTap Reference id

```Dart
CleverTapPlugin.getCleverTapID().then((clevertapId) {})
```

#### Set Location to User Profile

```Dart
var lat = 19.07;
var long = 72.87;
CleverTapPlugin.setLocation(lat, long);
```
----

## User Events

#### Record an event 

```Dart
var eventData = {
    // Key:    Value
   'first': 'partridge',
   'second': 'turtledoves'
};
CleverTapPlugin.recordEvent("Flutter Event", eventData);
```

#### Record Charged event

```Dart
var item1 = {
    // Key:    Value
    'name': 'thing1',
    'amount': '100'
};
var item2 = {
   // Key:    Value
   'name': 'thing2',
   'amount': '100'
};
var items = [item1, item2];
var chargeDetails = {
    // Key:    Value
    'total': '200',
    'payment': 'cash'
};
CleverTapPlugin.recordChargedEvent(chargeDetails, items);
```
-------

## In-App Notifications

#### On In App Button Click

```Dart
_clevertapPlugin.setCleverTapInAppNotificationButtonClickedHandler(inAppNotificationButtonClicked);

void inAppNotificationButtonClicked(Map<String, dynamic> map) {
    this.setState(() {
      print("inAppNotificationButtonClicked called = ${map.toString()}");
    });
}
```

#### On Dismissed

```Dart
_clevertapPlugin.setCleverTapInAppNotificationDismissedHandler(inAppNotificationDismissed)

void inAppNotificationDismissed(Map<String, dynamic> map) {
    this.setState(() {
      print("inAppNotificationDismissed called");
    });
}
```

#### Suspend InApp Notifications

```Dart
CleverTapPlugin.suspendInAppNotifications();
```

#### Discard InApp Notifications

```Dart
CleverTapPlugin.discardInAppNotifications();
```

#### Resume InApp Notifications

```Dart
CleverTapPlugin.resumeInAppNotifications();
```
------

## App Inbox

#### Initialize App Inbox

```Dart
CleverTapPlugin.initializeInbox();	
```

#### Show App Inbox

```Dart
var styleConfig = {
  'noMessageTextColor': '#ff6600',
  'noMessageText': 'No message(s) to show.',
  'navBarTitle': 'App Inbox'
};
CleverTapPlugin.showInbox(styleConfig);
```

#### App Inbox Item Click Callback

```Dart
_clevertapPlugin.setCleverTapInboxNotificationMessageClickedHandler(inboxNotificationMessageClicked);

void inboxNotificationMessageClicked(Map<String, dynamic>? data, int contentPageIndex, int buttonIndex) {
    this.setState(() {
      print("App Inbox item: ${data.toString()}");
      print("Content Page index: $contentPageIndex");
      print("Button index: $buttonIndex");
    });
}
```

#### App Inbox Button Click Callback
```Dart
_clevertapPlugin.setCleverTapInboxNotificationButtonClickedHandler(inboxNotificationButtonClicked);

void inboxNotificationButtonClicked(Map<String, dynamic>? map) {
  this.setState(() {
    print("inboxNotificationButtonClicked called = ${map.toString()}");
  });
}
```

#### Dismiss the App Inbox
```Dart
CleverTapPlugin.dismissInbox();
```

#### Get Total Inbox Message Count

```Dart
int total = await CleverTapPlugin.getInboxMessageCount();
print("Total count = " + total.toString());
```

#### Get Total Inbox Unread Count

```Dart
int unread = await CleverTapPlugin.getInboxMessageUnreadCount();
print("Unread count = " + unread.toString());
	      
```

#### Get All Inbox Messages

```Dart
List messages = await CleverTapPlugin.getAllInboxMessages();
```

#### Get All Inbox Unread Messages

```Dart
List messages = await CleverTapPlugin.getUnreadInboxMessages();
```

#### Get Inbox Message for the given message id

```Dart
var messageForId = await CleverTapPlugin.getInboxMessageForId(messageId);				
```

#### Delete Message for the given message id

```Dart
await CleverTapPlugin.deleteInboxMessageForId(messageId);	
```

#### Mark Message as Read for the given message id

```Dart
var messageList = await CleverTapPlugin.getUnreadInboxMessages();
    if (messageList == null || messageList.length == 0) return;
    Map<dynamic, dynamic> itemFirst = messageList[0];
    if (Platform.isAndroid) {
      await CleverTapPlugin.markReadInboxMessageForId(itemFirst["id"]);
    } else if (Platform.isIOS) {
      await CleverTapPlugin.markReadInboxMessageForId(itemFirst["_id"]);
    }
```

#### Raise Notification Viewed event for Inbox Message. Message id should be a String

```Dart
await CleverTapPlugin.pushInboxNotificationViewedEventForId(messageId);
```

#### Raise Notification Clicked event for Inbox Message. Message id should be a String

```Dart
await CleverTapPlugin.pushInboxNotificationClickedEventForId(messageId);		
```
## Debugging

#### Set Debug Level

```Dart
CleverTapPlugin.setDebugLevel(3);
```

## Push Notifications

#### **Handle Notification Click**
Register a `setCleverTapPushClickedPayloadReceivedHandler` handler to get a notification click callback along with the entire payload.

```Dart
_clevertapPlugin.setCleverTapPushClickedPayloadReceivedHandler(pushClickedPayloadReceived);

void pushClickedPayloadReceived(Map<String, dynamic> notificationPayload) {
  print("pushClickedPayloadReceived called with notification payload: " + notificationPayload.toString());
  // You may perform UI operation like redirecting the user to a specific page based on custom key-value pairs
  // passed in the notificationPayload. You may also perform non UI operation such as HTTP requests, IO with local storage etc.
  handleNotificationClick(notificationPayload); 
}
```
> **Note:**
>
> Please note that the `pushClickedPayloadReceived` handler is triggered in Android platform only when the app is in the foreground or background states, and not when it has been terminated(killed).
> However, in the case of iOS platform, this handler is supported regardless of whether the app is in the foreground, background, or has been terminated (killed).

#### **[Android Platform] Handle Notification Trampoline Restrictions to support `pushClickedPayloadReceived` handler in Android 12 and Above**
Due to [notification trampoline restrictions](https://developer.android.com/about/versions/12/behavior-changes-12#notification-trampolines), Android 12 and above do not directly support the `pushClickedPayloadReceived` callback.
Hence, apps need to add manual handling for Android 12 and above to inform the CleverTap SDK about the notification click and get the `pushClickedPayloadReceived` callback.

Add the following code in the `onNewIntent()` method of the Launcher `FlutterActivity` class in android:
```kotlin
class MainActivity : FlutterActivity() {

override fun onNewIntent(intent: Intent?) {
   super.onNewIntent(intent)

   // On Android 12 and above, inform the notification click to get the pushClickedPayloadReceived callback on dart side.
   if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
       cleverTapDefaultInstance?.pushNotificationClickedEvent(intent!!.extras)
   }
 }
}
```

#### **[Android Platform] Handle Notification Clicks When the App Is Killed**
The CleverTap Plugin provides two ways to handle user interactions with notifications, depending on whether the app needs to perform UI or non-UI operations.

##### **1. Perform UI impacting operation using `CleverTapPlugin.getAppLaunchNotification()`:**
The default behavior on Android is to launch the application if the application is terminated(killed).
Use `CleverTapPlugin.getAppLaunchNotification()` to get a Future containing a notification-payload of `Map` type if the application is opened from a terminated(killed) state.
Depending on the content of a notification-payload, you may perform UI operation like redirecting the user to a specific page. 

```Dart
class Application extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _Application();
}

class _Application extends State<Application> {
  void _handleKilledStateNotificationInteraction() async {
    // Retrieve the notification-payload in a 'CleverTapAppLaunchNotification' class object 
    // which caused the application to open from a terminated state.
    CleverTapAppLaunchNotification appLaunchNotification = await CleverTapPlugin
        .getAppLaunchNotification();

    if (appLaunchNotification.didNotificationLaunchApp) {
      //App is launched from a notification click which was rendered by the CleverTap SDK. 
      Map<String, dynamic> notificationPayload = appLaunchNotification.payload!;
      _handleDeeplink();
    }
  }
  
  void _handleDeeplink() {
    // It is assumed that all notifications contain a data field with the key 'type' but you may also have 
    // a different key for deeplink handling.
    var type = notificationPayload["type"];

    if (type != null) {
      print(
          "_handleKilledStateNotificationInteraction => Type: $type");
      Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) =>
                  DeepLinkPage(type: type)));
    }
  }
  
  @override
  void initState() {
    super.initState();

    // Run CleverTapPlugin.getAppLaunchNotification in an async function
    // as initState() must not be async
    _handleKilledStateNotificationInteraction();
  }

  @override
  Widget build(BuildContext context) {
    return Text("...");
  }
}
```

##### **2. Perform non-UI operation using `onKilledStateNotificationClicked` handler:**
There are two steps to setup the `onKilledStateNotificationClicked` handler:
1. Your `Application` class should extend the `CleverTapApplication` class instead of the `FlutterApplication` class.
2. Register the `onKilledStateNotificationClicked` handler to get a notification click callback along with the entire payload. When notification is clicked, an isolate is spawned (Android only) allowing you to handle notification click even when your application is not running.
There are a few things to keep in mind about your `onKilledStateNotificationClicked` handler:
 - It must not be an anonymous function.
 - It must be a top-level function (e.g. not a class method which requires initialization).
 - When using Flutter version 3.3.0 or higher, the `onKilledStateNotificationClicked` handler must be annotated with `@pragma('vm:entry-point')` right above the function declaration (otherwise it may be removed during tree shaking for release mode).

Add the following method to your `main.dart` file, right after the import statements, and outside any Widget class declaration, to process push notifications in the killed state via a Flutter background isolate:

```Dart
@pragma('vm:entry-point')
void _onKilledStateNotificationClickedHandler(Map<String, dynamic> map) async {
  print("Notification Payload received: " + map.toString());
}

void main() {
  CleverTapPlugin.onKilledStateNotificationClicked(_onKilledStateNotificationClickedHandler);
  runApp(MyApp());
}
```

> **Note:**
> Since the `_onKilledStateNotificationClickedHandler` handler runs in its own isolate outside your applications context, it is not possible to update application state or execute any UI operation from the handler itself. 
> You can, however, perform HTTP requests, IO operations with local storage etc.

#### Creating Notification Channel

```Dart
CleverTapPlugin.createNotificationChannel("fluttertest", "Flutter Test", "Flutter Test", 3, true);			
```

#### Delete Notification Channel

```Dart
CleverTapPlugin.deleteNotificationChannel(“channelId”);
```

#### Creating a group notification channel

```Dart
CleverTapPlugin.createNotificationChannelGroup(“groupId”, “groupName”);
```

#### Delete a group notification channel

```Dart
CleverTapPlugin.deleteNotificationChannelGroup(“channelId”);
```

#### Registering Fcm, Baidu, Xiaomi, Huawei Token

```Dart
CleverTapPlugin.setPushToken(“value”);
CleverTapPlugin.setBaiduPushToken(“value”);
CleverTapPlugin.setXiaomiPushToken(“value”);
CleverTapPlugin.setHuaweiPushToken(“value”);
```

 #### Create Notification
 
```Dart
CleverTapPlugin.createNotification(data);
```

------

## Custom Push Amplification

#### Process Push Notification

```Dart
 CleverTapPlugin.processPushNotification(data);
```

---------

## Native Display

#### On Display Units Loaded

```Dart
void onDisplayUnitsLoaded(List<dynamic> displayUnits) {
    this.setState(() {
      print("Display Units = " + displayUnits.toString());
   });
}
```

#### Get All Display Units

```Dart
void onDisplayUnitsLoaded(List<dynamic> displayUnits) {
    this.setState(() async {
      List displayUnits = await CleverTapPlugin.getAllDisplayUnits();
      print("Display Units = " + displayUnits.toString());
   });
}
```

#### Display unit viewed event for ID

```Dart
CleverTapPlugin.pushDisplayUnitViewedEvent(“unitId”);
```
#### Display unit clicked event for ID

```Dart
CleverTapPlugin.pushDisplayUnitClickedEvent(“unitId”);
```

## Product Config 

#### Set Product Configuration to default

```Dart
void productConfigInitialized() {
    print("Product Config Initialized");
    this.setState(() async {
      await CleverTapPlugin.fetch();
    });
}
```

#### Fetching product configs

```Dart
void fetch() {
    CleverTapPlugin.fetch();
    // CleverTapPlugin.fetchWithMinimumIntervalInSeconds(0);
}
```

#### Activate the most recently fetched product config

```Dart
void activate() {
    CleverTapPlugin.activate();
}
```

#### Fetch And Activate product config

```Dart
void fetchAndActivate() {
    CleverTapPlugin.fetchAndActivate();
 }
```

#### Fetch Minimum Time Interval

```Dart
CleverTapPlugin.setMinimumFetchIntervalInSeconds(interval);
```

#### Get Boolean key

```Dart
 CleverTapPlugin.getProductConfigBoolean(“key”);
```

#### Get last fetched timestamp in millis

```Dart
CleverTapPlugin.getLastFetchTimeStampInMillis();
```

## Feature Flag

#### Get Feature Flag

```Dart
void featureFlagsUpdated() {
    this.setState(() async {
      bool booleanVar = await CleverTapPlugin.getFeatureFlag("BoolKey", false);
   });
}
```

## App Personalization

#### Enable Personalization

```Dart
CleverTapPlugin.enablePersonalization();
```

#### Disable Personalization

```Dart
CleverTapPlugin.disablePersonalization();
```

## Attributions

#### Push Install Refferer

```Dart
CleverTapPlugin.pushInstallReferrer("source", "medium", "campaign");
```

## GDPR 

#### Set Opt Out

```Dart
CleverTapPlugin.setOptOut(false); ///Will opt in the user to send data to CleverTap
CleverTapPlugin.setOptOut(true); ///Will opt out the user to send data to CleverTap
```

#### Enable Device Networking Info Reporting

```Dart
// Will opt out the user to send Device Network data to CleverTap
CleverTapPlugin.enableDeviceNetworkInfoReporting(false);
// Will opt in the user to send Device Network data to CleverTap
CleverTapPlugin.enableDeviceNetworkInfoReporting(true);
```

## Set Offline

```Dart
// Will set the user online
CleverTapPlugin.setOffline(false);
// Will set the user offline
CleverTapPlugin.setOffline(true);
```

-----------

## Push primer for notification Permission (Android and iOS)
Follow the [Push Primer integration doc](PushPrimer.md).


### For more information,

 - [See Example Application Dart interface](/example/lib/main.dart) 
 - [See CleverTap Dart interface](/lib/clevertap_plugin.dart)


