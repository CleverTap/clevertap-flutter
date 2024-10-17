# Example Usage

Add the below script in index.html file
```Javascript
<script src="./assets/packages/clevertap_plugin/assets/clevertap.js"></script>
```

## Initialization

```Dart
 CleverTapPlugin.init("CLEVERTAP_ACCOUNT_ID", "CLEVERTAP_REGION", "CLEVERTAP_TARGET_DOMAIN","CLEVERTAP_TOKEN");
```
Here: \
```ACCOUNT_ID``` (mandatory): This value can be got from Projects page on the CleverTap Dashboard.\
```REGION``` (optional): This will be same as the region of the CleverTap Dashboard. Possible values: (in1/us1/sg1/aps3/mec1).\
```TARGET_DOMAIN``` (optional): domain of the proxy server.\
```TOKEN``` : This value is mandatory only when using remote config feature otherwise optional. It can be get from Projects page on the CleverTap Dashboard..

## User Profiles

#### Update User Profile(Push Profile)

```Dart
var stuff = ["bags", "shoes"];
var dob = '2012-04-22';
var profile = {
    'Name': 'John Wick',
    'Identity': '100',
    // Key always has to be "dob" and format should always be yyyy-MM-dd
    'dob': CleverTapPlugin.getCleverTapDate(DateTime.parse(dob)),
    'Email': 'john@gmail.com',
    'Phone': '+14155551234',
    'stuff': stuff
};
CleverTapPlugin.profileSet(profile);;
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

#### Get CleverTap Account Id

```Dart
CleverTapPlugin.getAccountID().then((accountId) {})

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

## Web Inbox

#### Steps to setup Web Inbox
- Add the button/div with the id as configured on clevertap dashboard. Set the visibility of the element as hidden
```HTML
<button id='Element ID' style="visibility: hidden;">Inbox</button>
```
- Uncheck the Notifications Badge in Web Inbox configuration Style section on clevertap dashboard
- Use the custom Widget NotificationButton to pass the Widget on which the inbox has to be rendered.

```Dart
NotificationButton(child: Icon(Icons.notifications))
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
await CleverTapPlugin.markReadInboxMessageForId(messageId);	
```

## Web Native Display

#### Custom KV Pair

```Dart
CleverTapPlugin.addKVDataChangeListener((obj) {
    print(obj);
});
```

## Debugging

#### Set Debug Level

```Dart
CleverTapPlugin.setDebugLevel(3);
```

## Push Notifications

#### Enable Web Push
- Add Clevertap's service worker in web folder. Refer [here](https://developer.clevertap.com/docs/web-push#add-the-service-worker-file)

```Dart
var pushData = {
    'titleText': 'Would you like to receive Push Notifications?',
    'bodyText':
        'We promise to only send you relevant content and give you updates on your transactions',
    'okButtonText': 'Ok',
    'rejectButtonText': 'Cancel',
    'okButtonColor': '#F28046',
    'askAgainTimeInSeconds': 5,
    'serviceWorkerPath': '/firebase-messaging-sw.js'
  };
  CleverTapPlugin.enableWebPush(pushData);
```
- For new Web Push prompt which can be customised from dashboard.
```Dart
CleverTapPlugin.enableWebPushNotifications({'swPath': '/firebase-messaging-sw.js'});
```

## GDPR 

#### Set Opt Out
- This will ensure that the data from the device will not reach CleverTap's servers. Default value is set to False.
- If a device needs to be opted out, the flag needs to be set.

```Dart
CleverTapPlugin.setOptOut(false); // Will opt in the user to send data to CleverTap
CleverTapPlugin.setOptOut(true); // Will opt out the user to send data to CleverTap
```

#### Set useIP

- This will ensure that the CleverTap does not auto collect the device IP. Default value is set to False.
- If a customer wants to collect to the device IP, they need to explicitly set it to true.

```Dart
CleverTapPlugin.setUseIP(false); // call the flag to true, if the user of the device opts out of sharing their data
CleverTapPlugin.setUseIP(true); // call the flag to true, if the user agrees to share their IP data
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
 - [See CleverTap Dart interface](/lib/clevertap_plugin_web.dart)