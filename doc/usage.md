## Example Flutter Usage

#### Grab a reference  
```Dart 
const CleverTap = require('clevertap-flutter');
```

## User Properties

#### Update User Profile(Push Profile )
```Dart
Void recordUser() {
	    var stuff = ["bags", "shoes"];
	    var profile = {
	      'Name': 'S',
	      'Identity': '100',
	      'DOB': '22-04-2000',
	

	      ///Key always has to be "DOB" and format should always be dd-MM-yyyy
	      'Email': 's@gmail.com',
	      'Phone': '14155551234',
	      'props': 'property1',
	      'stuff': stuff
	    };
	    CleverTapPlugin.profileSet(profile);
	    showToast("Pushed profile " + profile.toString());
	  }
```

#### Set Multi Values For Key 
``` Dart
void setProfileMultiValue() {
	    var values = ["value1", "value2"];
	    CleverTapPlugin.profileSetMultiValues("props", values);
	    showToast("check console for details");
	  }
```

#### Remove Multi Value For Key 
```Dart
void removeMultiValues() {
	    var values = ["value1", "value2"];
	    CleverTapPlugin.profileRemoveMultiValues("props", values);
	    showToast("check console for details");
	  }
```

#### Add Multi Value For Key
```Dart
void addMultiValues() {
	    var values = ["value1", "value2"];
	    CleverTapPlugin.profileAddMultiValues("props", values);
	    showToast("check console for details");
	  }
```

#### Create a User profile when user logs in (On User Login)
```Dart
void onUserLogin() {
	    var stuff = ["bags", "shoes"];
	    var profile = {
	      'Name': 'S',
	      'Identity': '100',
	      'Email': 's@gmail.com',
	      'Phone': '+14155551234',
	      'stuff': stuff
	    };
```

#### Get CleverTap Reference id
```Dart
void getCleverTapId() {
	    CleverTapPlugin.profileGetCleverTapID().then((clevertapId) {
	      if (clevertapId == null) return;
	      setState((() {
	        showToast("$clevertapId");
	        print("$clevertapId");
	      }));
	    }).catchError((error) {
	      setState(() {
	        print("$error");
	      });
	    });
	  }
```

#### Set Location to User Profile
```Dart
void setLocation() {
	    var lat = 19.07;
	    var long = 72.87;
	    CleverTapPlugin.setLocation(lat, long);
	    showToast("Location is set");
	  }
```

#### Record an event  
```Dart
void recordEvent() {
	    var eventData = {
	      // Key:    Value
	      'first': 'partridge',
	      'second': 'turtledoves'
	    };
	    CleverTapPlugin.recordEvent("Flutter Event", eventData);
	    showToast("Raised event - Flutter Event");
	  }
```

#### Record Charged event
```Dart
void recordChargedEvent() {
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
	    showToast("Raised event - Charged");
	  }
```

## In App

#### On In App Button Click
```Dart
public void onInAppButtonClick(HashMap<String, String> payload) {
	        invokeMethodOnUiThread("onInAppButtonClick", payload);
	    }
```
#### On Dismissed
```Dart
void inAppNotificationDismissed(Map<String, dynamic> map) {
	    this.setState(() {
	      print("inAppNotificationDismissed called");
	    });
	  }

```

## App Inbox

#### Initialize the CleverTap App Inbox Method
```Dart

CleverTapPlugin.initializeInbox();	
```

#### Show the App Inbox
```Dart
void showInbox() {
	    if (inboxInitialized) {
	      showToast("Opening App Inbox", onDismiss: () {
	        var styleConfig = {
	          'noMessageTextColor': '#ff6600',
	          'noMessageText': 'No message(s) to show.',
	          'navBarTitle': 'App Inbox'
	        };
	        CleverTapPlugin.showInbox(styleConfig);
	      });
	    }
	  }
 ```

#### Get Total message count
```Dart
void inboxMessagesDidUpdate() {
	    this.setState(() async {
	      print("inboxMessagesDidUpdate called");
	      int unread = await CleverTapPlugin.getInboxMessageUnreadCount();
	      int total = await CleverTapPlugin.getInboxMessageCount();
	      print("Unread count = " + unread.toString());
	      print("Total count = " + total.toString());
	    });
	  }
```

#### Get Total unread message count
```Dart
void inboxMessagesDidUpdate() {
	    this.setState(() async {
	      print("inboxMessagesDidUpdate called");
	      int unread = await CleverTapPlugin.getInboxMessageUnreadCount();
	      int total = await CleverTapPlugin.getInboxMessageCount();
	      print("Unread count = " + unread.toString());
	      print("Total count = " + total.toString());
	    });
	  }
```

#### Get All Inbox Messages
```Dart
  void getAllInboxMessages() async {
	    List messages = await CleverTapPlugin.getAllInboxMessages();
	    showToast("See all inbox messages in console");
	    print("Inbox Messages = " + messages.toString());
	  }
```

#### Get all Inbox unread messages
```Dart
void getUnreadInboxMessages() async {
	    List messages = await CleverTapPlugin.getUnreadInboxMessages();
	    showToast("See unread inbox messages in console");
	    print("Unread Inbox Messages = " + messages.toString());
	  }
```

#### Get inbox Id
```Dart
void getInboxMessageForId() async {
	    var messageId = await getFirstInboxMessageId();
	

	    if (messageId == null) {
	      setState((() {
	        showToast("Inbox Message id is null");
	        print("Inbox Message id is null");
	      }));
	      return;
	    }
				
```

#### Delete message with id
```Dart
void deleteInboxMessageForId() async {
	    var messageId = await getFirstInboxMessageId();
	

	    if (messageId == null) {
	      setState((() {
	        showToast("Inbox Message id is null");
	        print("Inbox Message id is null");
	      }));
	      return;
	    }
	
```

#### Mark a message as Read for inbox Id
```Dart
void markReadInboxMessageForId() async {
	    var messageList = await CleverTapPlugin.getUnreadInboxMessages();
	

	    if (messageList == null || messageList.length == 0) return;
	    Map<dynamic, dynamic> itemFirst = messageList[0];
	

	    if (Platform.isAndroid) {
	      await CleverTapPlugin.markReadInboxMessageForId(itemFirst["id"]);
	      setState((() {
	        showToast("Marked Inbox Message as read with id =  ${itemFirst["id"]}");
	        print("Marked Inbox Message as read with id =  ${itemFirst["id"]}");
	      }));
	    } else if (Platform.isIOS) {
	      await CleverTapPlugin.markReadInboxMessageForId(itemFirst["_id"]);
	      setState((() {
	        showToast(
	            "Marked Inbox Message as read with id =  ${itemFirst["_id"]}");
	        print("Marked Inbox Message as read with id =  ${itemFirst["_id"]}");
	      }));
	    }
	  }
	
```

#### pushInbox Notification Viewed Event For Id
```Dart

void pushInboxNotificationViewedEventForId() async {
	    var messageId = await getFirstInboxMessageId();
	

	    if (messageId == null) {
	      setState((() {
	        showToast("Inbox Message id is null");
	        print("Inbox Message id is null");
	      }));
	      return;
	    }
	

	    await CleverTapPlugin.pushInboxNotificationViewedEventForId(messageId);
	

	    setState((() {
	      showToast(
	          "Pushed NotificationViewedEvent for Inbox Message with id =  $messageId");
	      print(
	          "Pushed NotificationViewedEvent for Inbox Message with id =  $messageId");
	    }));
	  }
	
		
```

#### push Inbox Notification Clicked Event For Id
```Dart
void pushInboxNotificationClickedEventForId() async {
	    var messageId = await getFirstInboxMessageId();
	

	    if (messageId == null) {
	      setState((() {
	        showToast("Inbox Message id is null");
	        print("Inbox Message id is null");
	      }));
	      return;
	    }
	

	    await CleverTapPlugin.pushInboxNotificationClickedEventForId(messageId);
	

	    setState((() {
	      showToast(
	          "Pushed NotificationClickedEvent for Inbox Message with id =  $messageId");
	      print(
	          "Pushed NotificationClickedEvent for Inbox Message with id =  $messageId");
	    }));
	  }
			
```
## Enable Debugging

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
``` Dart
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

## Custom Push Amplification

#### Process Push Notification
```Dart

 CleverTapPlugin.processPushNotification(data);

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
	    showToast("check console for logs");
	

	    ///CleverTapPlugin.fetchWithMinimumIntervalInSeconds(0);
	  }
```

#### Activate the most recently fetched product config
```Dart
  void activate() {
	    CleverTapPlugin.activate();
	    showToast("check console for logs");
	  }
```

#### Fetch And Activate product config
```Dart
  void fetchAndActivate() {
	    CleverTapPlugin.fetchAndActivate();
	    showToast("check console for logs");
	  }
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
	    print("Feature Flags Updated");
	    this.setState(() async {
	      bool booleanVar = await CleverTapPlugin.getFeatureFlag("BoolKey", false);
	      print("Feature flag = " + booleanVar.toString());
	    });
	  }
```

## App Personalisation

#### Enable Personalization
```Dart
void enablePersonalization() {
	    CleverTapPlugin.enablePersonalization();
	    showToast("Personalization enabled");
	    print("Personalization enabled");
	  }
```


## Attributions

#### Push Intall Refferer
```Dart
CleverTapPlugin.pushInstallReferrer("source", "medium", "campaign");

```


#### Get CleverTap Attribution Identifier
```Dart

 void getCTAttributionId() {
	    CleverTapPlugin.profileGetCleverTapAttributionIdentifier()
	        .then((attributionId) {
	      if (attributionId == null) return;
	      setState((() {
	        showToast("Attribution Id = " + "$attributionId");
	        print("Attribution Id = " + "$attributionId");
	      }));
	    }).catchError((error) {
	      setState(() {
	        print("$error");
	      });
	    });
	  }
	
```

## GDPR 

#### Set Opt Out
```Dart
void setOptOut() {
	    if (optOut) {
	      CleverTapPlugin.setOptOut(false);
	      optOut = false;
	      showToast("You have opted in");
	    } else {
	      CleverTapPlugin.setOptOut(true);
	      optOut = true;
	      showToast("You have opted out");
	    }
	  }

```

#### Enable Device Networking Info Reporting
```Dart
void setEnableDeviceNetworkingInfo() {
	    if (enableDeviceNetworkingInfo) {
	      CleverTapPlugin.enableDeviceNetworkInfoReporting(false);
	      enableDeviceNetworkingInfo = false;
	      showToast("You have disabled device networking info");
	    } else {
	      CleverTapPlugin.enableDeviceNetworkInfoReporting(true);
	      enableDeviceNetworkingInfo = true;
	      showToast("You have enabled device networking info");
	    }
	  }

```

## Multi-instance 

#### Enable Personalisation 
```Dart
void enablePersonalization() {
	    CleverTapPlugin.enablePersonalization();
	    showToast("Personalization enabled");
	    print("Personalization enabled");
	  }

```

#### Set Offline
```Dart
void setOffline() {
	    if (offLine) {
	      CleverTapPlugin.setOffline(false);
	      offLine = false;
	      showToast("You are online");
	    } else {
	      CleverTapPlugin.setOffline(true);
	      offLine = true;
	      showToast("You are offline");
	    }
	  }

```



### For more information,
 - [see included Starter Application]( https://github.com/CleverTap/clevertap-flutter/blob/master/example/lib/main.dart) 
 - [see CleverTap Dart interface]( https://github.com/CleverTap/clevertap-flutter/blob/master/example/lib/main.dart)


