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
    this.setState(() async {
      List displayUnits = await CleverTapPlugin.getAllDisplayUnits();
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


### For more information,

 - [See Example Application Dart interface](/example/lib/main.dart) 
 - [See CleverTap Dart interface](/lib/clevertap_plugin.dart)


