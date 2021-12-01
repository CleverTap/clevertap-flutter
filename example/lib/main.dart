import 'dart:async';
import 'dart:convert';
import 'dart:io' show Platform;

import 'package:clevertap_plugin/clevertap_plugin.dart';
import 'package:flutter/material.dart';
import 'package:flutter_styled_toast/flutter_styled_toast.dart';

void main() => runApp(MyApp());

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late CleverTapPlugin _clevertapPlugin;
  var inboxInitialized = false;
  var optOut = false;
  var offLine = false;
  var enableDeviceNetworkingInfo = false;

  @override
  void initState() {
    super.initState();
    initPlatformState();
    activateCleverTapFlutterPluginHandlers();
    CleverTapPlugin.setDebugLevel(3);
    CleverTapPlugin.createNotificationChannel(
        "fluttertest", "Flutter Test", "Flutter Test", 3, true);
    CleverTapPlugin.initializeInbox();
    CleverTapPlugin.registerForPush(); //only for iOS
    //var initialUrl = CleverTapPlugin.getInitialUrl();
  }

  // Platform messages are asynchronous, so we initialize in an async method.
  Future<void> initPlatformState() async {
    if (!mounted) return;
  }

  void activateCleverTapFlutterPluginHandlers() {
    _clevertapPlugin = new CleverTapPlugin();
    _clevertapPlugin
        .setCleverTapPushAmpPayloadReceivedHandler(pushAmpPayloadReceived);
    _clevertapPlugin.setCleverTapPushClickedPayloadReceivedHandler(
        pushClickedPayloadReceived);
    _clevertapPlugin.setCleverTapInAppNotificationDismissedHandler(
        inAppNotificationDismissed);
    _clevertapPlugin
        .setCleverTapProfileDidInitializeHandler(profileDidInitialize);
    _clevertapPlugin.setCleverTapProfileSyncHandler(profileDidUpdate);
    _clevertapPlugin.setCleverTapInboxDidInitializeHandler(inboxDidInitialize);
    _clevertapPlugin
        .setCleverTapInboxMessagesDidUpdateHandler(inboxMessagesDidUpdate);
    _clevertapPlugin
        .setCleverTapDisplayUnitsLoadedHandler(onDisplayUnitsLoaded);
    _clevertapPlugin.setCleverTapInAppNotificationButtonClickedHandler(
        inAppNotificationButtonClicked);
    _clevertapPlugin.setCleverTapInboxNotificationButtonClickedHandler(
        inboxNotificationButtonClicked);
    _clevertapPlugin.setCleverTapFeatureFlagUpdatedHandler(featureFlagsUpdated);
    _clevertapPlugin
        .setCleverTapProductConfigInitializedHandler(productConfigInitialized);
    _clevertapPlugin
        .setCleverTapProductConfigFetchedHandler(productConfigFetched);
    _clevertapPlugin
        .setCleverTapProductConfigActivatedHandler(productConfigActivated);
  }

  void inAppNotificationDismissed(Map<String, dynamic> map) {
    this.setState(() {
      print("inAppNotificationDismissed called");
    });
  }

  void inAppNotificationButtonClicked(Map<String, dynamic>? map) {
    this.setState(() {
      print("inAppNotificationButtonClicked called = ${map.toString()}");
    });
  }

  void inboxNotificationButtonClicked(Map<String, dynamic>? map) {
    this.setState(() {
      print("inboxNotificationButtonClicked called = ${map.toString()}");
    });
  }

  void profileDidInitialize() {
    this.setState(() {
      print("profileDidInitialize called");
    });
  }

  void profileDidUpdate(Map<String, dynamic>? map) {
    this.setState(() {
      print("profileDidUpdate called");
    });
  }

  void inboxDidInitialize() {
    this.setState(() {
      print("inboxDidInitialize called");
      inboxInitialized = true;
    });
  }

  void inboxMessagesDidUpdate() {
    this.setState(() async {
      print("inboxMessagesDidUpdate called");
      int? unread = await CleverTapPlugin.getInboxMessageUnreadCount();
      int? total = await CleverTapPlugin.getInboxMessageCount();
      print("Unread count = " + unread.toString());
      print("Total count = " + total.toString());
    });
  }

  void onDisplayUnitsLoaded(List<dynamic>? displayUnits) {
    this.setState(() async {
      List? displayUnits = await CleverTapPlugin.getAllDisplayUnits();
      print("Display Units = " + displayUnits.toString());
    });
  }

  void featureFlagsUpdated() {
    print("Feature Flags Updated");
    this.setState(() async {
      bool? booleanVar = await CleverTapPlugin.getFeatureFlag("BoolKey", false);
      print("Feature flag = " + booleanVar.toString());
    });
  }

  void productConfigInitialized() {
    print("Product Config Initialized");
    this.setState(() async {
      await CleverTapPlugin.fetch();
    });
  }

  void productConfigFetched() {
    print("Product Config Fetched");
    this.setState(() async {
      await CleverTapPlugin.activate();
    });
  }

  void productConfigActivated() {
    print("Product Config Activated");
    this.setState(() async {
      String? stringvar =
          await CleverTapPlugin.getProductConfigString("StringKey");
      print("PC String = " + stringvar.toString());
      int? intvar = await CleverTapPlugin.getProductConfigLong("IntKey");
      print("PC int = " + intvar.toString());
      double? doublevar =
          await CleverTapPlugin.getProductConfigDouble("DoubleKey");
      print("PC double = " + doublevar.toString());
    });
  }

  void pushAmpPayloadReceived(Map<String, dynamic> map) {
    print("pushAmpPayloadReceived called");
    this.setState(() async {
      var data = jsonEncode(map);
      print("Push Amp Payload = " + data.toString());
      CleverTapPlugin.createNotification(data);
    });
  }

  void pushClickedPayloadReceived(Map<String, dynamic> map) {
    print("pushClickedPayloadReceived called");
    this.setState(() async {
      var data = jsonEncode(map);
      print("on Push Click Payload = " + data.toString());
    });
  }

  @override
  Widget build(BuildContext context) {
    return StyledToast(
      locale: const Locale('en', 'US'),
      child: MaterialApp(
        home: Scaffold(
            appBar: AppBar(
              title: const Text('CleverTap Plugin Example App'),
              backgroundColor: Colors.red.shade800,
            ),
            body: ListView(
              children: <Widget>[
                Card(
                  color: Colors.orange,
                  child: Padding(
                    padding: const EdgeInsets.all(0.0),
                    child: ListTile(
                      dense: true,
                      trailing: Icon(Icons.warning),
                      title: Text(
                          "NOTE : All CleverTap functions are listed below"),
                      subtitle: Text(
                          "Please check console logs for more info after tapping below"),
                    ),
                  ),
                ),
                Card(
                  color: Colors.lightBlueAccent,
                  child: Padding(
                    padding: const EdgeInsets.all(0.0),
                    child: ListTile(
                      title: Text("User Profiles"),
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Push User"),
                      subtitle: Text("Pushes/Records a user"),
                      onTap: recordUser,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Set Profile Multi Values"),
                      subtitle: Text("Sets a multi valued user property"),
                      onTap: setProfileMultiValue,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Remove Profile Value For Key"),
                      subtitle: Text("Removes user property of given key"),
                      onTap: removeProfileValue,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Add Profile Multi Value"),
                      subtitle: Text("Add user property"),
                      onTap: addMultiValue,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Profile increment value"),
                      subtitle: Text("Increment value by 15"),
                      onTap: incrementValue,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Profile decrement value"),
                      subtitle: Text("Decrement value by 10"),
                      onTap: decrementValue,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Add Profile Multi values"),
                      subtitle: Text("Add a multi valued user property"),
                      onTap: addMultiValues,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Remove Multi Value"),
                      subtitle: Text("Remove user property"),
                      onTap: removeMultiValue,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Remove Multi Values"),
                      subtitle: Text("Remove a multi valued user property"),
                      onTap: removeMultiValues,
                    ),
                  ),
                ),
                Card(
                  color: Colors.lightBlueAccent,
                  child: Padding(
                    padding: const EdgeInsets.all(0.0),
                    child: ListTile(
                      title: Text("Identity Management"),
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Performs onUserLogin"),
                      subtitle: Text("Used to identify multiple profiles"),
                      onTap: onUserLogin,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Get CleverTap ID"),
                      subtitle: Text("Returns Clevertap ID"),
                      onTap: getCleverTapId,
                    ),
                  ),
                ),
                Card(
                  color: Colors.lightBlueAccent,
                  child: Padding(
                    padding: const EdgeInsets.all(0.0),
                    child: ListTile(
                      title: Text("Location"),
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Set Location"),
                      subtitle: Text("Use to set Location of a user"),
                      onTap: setLocation,
                    ),
                  ),
                ),
                Card(
                  color: Colors.lightBlueAccent,
                  child: Padding(
                    padding: const EdgeInsets.all(0.0),
                    child: ListTile(
                      title: Text("User Events"),
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Push Event"),
                      subtitle: Text("Pushes/Records an event"),
                      onTap: recordEvent,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Push Charged Event"),
                      subtitle: Text("Pushes/Records a Charged event"),
                      onTap: recordChargedEvent,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Get Event Detail"),
                      subtitle: Text("Get details of an event"),
                      onTap: getEventDetail,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Get Event History"),
                      subtitle: Text("Get history of an event"),
                      onTap: recordEvent,
                    ),
                  ),
                ),
                Card(
                  color: Colors.lightBlueAccent,
                  child: Padding(
                    padding: const EdgeInsets.all(0.0),
                    child: ListTile(
                      title: Text("App Inbox"),
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Show Inbox"),
                      subtitle: Text("Opens sample App Inbox"),
                      onTap: showInbox,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Get All Inbox Messages"),
                      subtitle: Text("Returns all inbox messages"),
                      onTap: getAllInboxMessages,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Get Unread Inbox Messages"),
                      subtitle: Text("Returns unread inbox messages"),
                      onTap: getUnreadInboxMessages,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Get Inbox Message for given ID"),
                      subtitle: Text("Returns inbox message for given ID"),
                      onTap: getInboxMessageForId,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Delete Inbox Message for given ID"),
                      subtitle: Text("Deletes inbox message for given ID"),
                      onTap: deleteInboxMessageForId,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Mark Read Inbox Message for given ID"),
                      subtitle: Text("Mark read inbox message for given ID"),
                      onTap: markReadInboxMessageForId,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Push Inbox Message Clicked"),
                      subtitle:
                          Text("Pushes/Records inbox message clicked event"),
                      onTap: pushInboxNotificationClickedEventForId,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Push Inbox Message Viewed"),
                      subtitle:
                          Text("Pushes/Records inbox message viewed event"),
                      onTap: pushInboxNotificationViewedEventForId,
                    ),
                  ),
                ),
                Card(
                  color: Colors.lightBlueAccent,
                  child: Padding(
                    padding: const EdgeInsets.all(0.0),
                    child: ListTile(
                      title: Text("Enable Debugging"),
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Set Debug Level"),
                      subtitle: Text(
                          "Sets the debug level in Android/iOS to show console logs"),
                      onTap: () {
                        CleverTapPlugin.setDebugLevel(3);
                      },
                      trailing: Icon(Icons.info),
                    ),
                  ),
                ),
                Card(
                  color: Colors.lightBlueAccent,
                  child: Padding(
                    padding: const EdgeInsets.all(0.0),
                    child: ListTile(
                      title: Text("In-App messaging controls"),
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Suspend InApp notifications"),
                      subtitle:
                          Text("Suspends display of InApp Notifications."),
                      onTap: suspendInAppNotifications,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Discard InApp notifications"),
                      subtitle: Text(
                          "Suspends the display of InApp Notifications "
                          "and discards any new InApp Notifications to be shown"
                          " after this method is called."),
                      onTap: discardInAppNotifications,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Resume InApp notifications"),
                      subtitle: Text("Resumes display of InApp Notifications."),
                      onTap: resumeInAppNotifications,
                    ),
                  ),
                ),
                Card(
                  color: Colors.lightBlueAccent,
                  child: Padding(
                    padding: const EdgeInsets.all(0.0),
                    child: ListTile(
                      title: Text("Product Config"),
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Get Event First Time"),
                      subtitle: Text("Gets first epoch of an event"),
                      onTap: eventGetFirstTime,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Get Event Occurrences"),
                      subtitle: Text("Get number of occurences of an event"),
                      onTap: eventGetOccurrences,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Get Event Last Time"),
                      subtitle: Text("Returns last epoch value for an event"),
                      onTap: eventGetLastTime,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Fetch"),
                      subtitle: Text("Fetches Product Config values"),
                      onTap: fetch,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Activate"),
                      subtitle: Text("Activates Product Config values"),
                      onTap: activate,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Fetch and Activate"),
                      subtitle: Text("Fetches and Activates Config values"),
                      onTap: fetchAndActivate,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Session Time Elapsed"),
                      subtitle: Text("Returns session time elapsed"),
                      onTap: getTimeElapsed,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Session Total Visits"),
                      subtitle: Text("Returns session total visits"),
                      onTap: getTotalVisits,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Session Screen Count"),
                      subtitle: Text("Returns session screen count"),
                      onTap: getScreenCount,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Session Previous Visit Time"),
                      subtitle: Text("Returns session previous visit time"),
                      onTap: getPreviousVisitTime,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Session UTM Details"),
                      subtitle: Text("Returns session UTM details"),
                      onTap: getUTMDetails,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Get Ad Units"),
                      subtitle: Text("Returns all Display Units set"),
                      onTap: getAdUnits,
                    ),
                  ),
                ),
                Card(
                  color: Colors.lightBlueAccent,
                  child: Padding(
                    padding: const EdgeInsets.all(0.0),
                    child: ListTile(
                      title: Text("Attribution"),
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Get Attribution ID"),
                      subtitle: Text(
                          "Returns Attribution ID to send to attribution partners"),
                      onTap: getCTAttributionId,
                    ),
                  ),
                ),
                Card(
                  color: Colors.lightBlueAccent,
                  child: Padding(
                    padding: const EdgeInsets.all(0.0),
                    child: ListTile(
                      title: Text("GDPR"),
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Set Opt Out"),
                      subtitle:
                          Text("Used to opt out of sending data to CleverTap"),
                      onTap: setOptOut,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Device Networking Info"),
                      subtitle: Text(
                          "Enables/Disable device networking info as per GDPR"),
                      onTap: setEnableDeviceNetworkingInfo,
                    ),
                  ),
                ),
                Card(
                  color: Colors.lightBlueAccent,
                  child: Padding(
                    padding: const EdgeInsets.all(0.0),
                    child: ListTile(
                      title: Text("Multi-Instance"),
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Enable Personalization"),
                      subtitle: Text("Enables Personalization"),
                      onTap: enablePersonalization,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Disables Personalization"),
                      subtitle: Text("Disables Personalization"),
                      onTap: disablePersonalization,
                    ),
                  ),
                ),
                Card(
                  color: Colors.grey.shade300,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: ListTile(
                      title: Text("Set Offline"),
                      subtitle: Text("Switches CleverTap to offline mode"),
                      onTap: setOffline,
                    ),
                  ),
                ),
              ],
            )),
      ),
    );
  }

  void recordEvent() {
    var now = new DateTime.now();
    var eventData = {
      // Key:    Value
      'first': 'partridge',
      'second': 'turtledoves',
      'date': CleverTapPlugin.getCleverTapDate(now),
      'number': 1
    };
    CleverTapPlugin.recordEvent("Flutter Event", eventData);
    showToast("Raised event - Flutter Event");
  }

  void recordNotificationClickedEvent() {
    var eventData = {
      /// Key:    Value
      'nm': 'Notification message',
      'nt': 'Notification title',
      'wzrk_id': '0_0',
      'wzrk_cid': 'Notification Channel ID'

      ///other CleverTap Push Payload Key Values found in Step 3 of
      ///https://developer.clevertap.com/docs/android#section-custom-android-push-notifications-handling
    };
    CleverTapPlugin.pushNotificationClickedEvent(eventData);
    showToast("Raised event - Notification Clicked");
  }

  void recordNotificationViewedEvent() {
    var eventData = {
      /// Key:    Value
      'nm': 'Notification message',
      'nt': 'Notification title',
      'wzrk_id': '0_0',
      'wzrk_cid': 'Notification Channel ID'

      ///other CleverTap Push Payload Key Values found in Step 3 of
      ///https://developer.clevertap.com/docs/android#section-custom-android-push-notifications-handling
    };
    CleverTapPlugin.pushNotificationViewedEvent(eventData);
    showToast("Raised event - Notification Viewed");
  }

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

  void recordUser() {
    var stuff = ["bags", "shoes"];
    var profile = {
      'Name': 'sarvesh',
      'Identity': '100',
      'DOB': '22-04-2000',

      ///Key always has to be "DOB" and format should always be dd-MM-yyyy
      'Email': 'sarveshgk10@gmail.com',
      'Phone': '14155551234',
      'props': 'property1',
      'stuff': stuff
    };
    CleverTapPlugin.profileSet(profile);
    showToast("Pushed profile " + profile.toString());
  }

  void showInbox() {
    if (inboxInitialized) {
      showToast("Opening App Inbox", onDismiss: () {
        var styleConfig = {
          'noMessageTextColor': '#ff6600',
          'noMessageText': 'No message(s) to show.',
          'navBarTitle': 'App Inbox',
          'navBarTitleColor': '#101727',
          'navBarColor': '#EF4444',
          'tabs': ["Offers"]
        };
        CleverTapPlugin.showInbox(styleConfig);
      });
    }
  }

  void getAllInboxMessages() async {
    List? messages = await CleverTapPlugin.getAllInboxMessages();
    showToast("See all inbox messages in console");
    print("Inbox Messages = " + messages.toString());
  }

  void getUnreadInboxMessages() async {
    List? messages = await CleverTapPlugin.getUnreadInboxMessages();
    showToast("See unread inbox messages in console");
    print("Unread Inbox Messages = " + messages.toString());
  }

  void getInboxMessageForId() async {
    var messageId = await getFirstInboxMessageId();

    if (messageId == null) {
      setState((() {
        showToast("Inbox Message id is null");
        print("Inbox Message id is null");
      }));
      return;
    }

    var messageForId = await CleverTapPlugin.getInboxMessageForId(messageId);
    setState((() {
      showToast("Inbox Message for id =  ${messageForId.toString()}");
      print("Inbox Message for id =  ${messageForId.toString()}");
    }));
  }

  void deleteInboxMessageForId() async {
    var messageId = await getFirstInboxMessageId();

    if (messageId == null) {
      setState((() {
        showToast("Inbox Message id is null");
        print("Inbox Message id is null");
      }));
      return;
    }

    await CleverTapPlugin.deleteInboxMessageForId(messageId);

    setState((() {
      showToast("Deleted Inbox Message with id =  $messageId");
      print("Deleted Inbox Message with id =  $messageId");
    }));
  }

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

  Future<String>? getFirstInboxMessageId() async {
    var messageList = await CleverTapPlugin.getAllInboxMessages();
    print("inside getFirstInboxMessageId");
    Map<dynamic, dynamic> itemFirst = messageList?[0];
    print(itemFirst.toString());

    if (Platform.isAndroid) {
      return itemFirst["id"];
    } else if (Platform.isIOS) {
      return itemFirst["_id"];
    }
    return "";
  }

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

  void recordScreenView() {
    var screenName = "Home Screen";
    CleverTapPlugin.recordScreenView(screenName);
  }

  void eventGetFirstTime() {
    var eventName = "Flutter Event";
    CleverTapPlugin.eventGetFirstTime(eventName).then((eventFirstTime) {
      if (eventFirstTime == null) return;
      setState((() {
        showToast("Event First time CleverTap = " + eventFirstTime.toString());
        print("Event First time CleverTap = " + eventFirstTime.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void eventGetLastTime() {
    var eventName = "Flutter Event";
    CleverTapPlugin.eventGetLastTime(eventName).then((eventLastTime) {
      if (eventLastTime == null) return;
      setState((() {
        showToast("Event Last time CleverTap = " + eventLastTime.toString());
        print("Event Last time CleverTap = " + eventLastTime.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void eventGetOccurrences() {
    var eventName = "Flutter Event";
    CleverTapPlugin.eventGetOccurrences(eventName).then((eventOccurrences) {
      if (eventOccurrences == null) return;
      setState((() {
        showToast(
            "Event detail from CleverTap = " + eventOccurrences.toString());
        print("Event detail from CleverTap = " + eventOccurrences.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getEventDetail() {
    var eventName = "Flutter Event";
    CleverTapPlugin.eventGetDetail(eventName).then((eventDetailMap) {
      if (eventDetailMap == null) return;
      setState((() {
        showToast("Event detail from CleverTap = " + eventDetailMap.toString());
        print("Event detail from CleverTap = " + eventDetailMap.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getEventHistory() {
    var eventName = "Flutter Event";
    CleverTapPlugin.getEventHistory(eventName).then((eventDetailMap) {
      if (eventDetailMap == null) return;
      setState((() {
        showToast(
            "Event History from CleverTap = " + eventDetailMap.toString());
        print("Event History from CleverTap = " + eventDetailMap.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void setLocation() {
    var lat = 19.07;
    var long = 72.87;
    CleverTapPlugin.setLocation(lat, long);
    showToast("Location is set");
  }

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

  void getCleverTapId() {
    CleverTapPlugin.getCleverTapID().then((clevertapId) {
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

  void onUserLogin() {
    var stuff = ["bags", "shoes"];
    var profile = {
      'Name': 'Captain America',
      'Identity': '100',
      'Email': 'captain@america.com',
      'Phone': '+14155551234',
      'stuff': stuff
    };
    CleverTapPlugin.onUserLogin(profile);
    showToast("onUserLogin called, check console for details");
  }

  void removeProfileValue() {
    CleverTapPlugin.profileRemoveValueForKey("props");
    showToast("check console for details");
  }

  void setProfileMultiValue() {
    var values = ["value1", "value2"];
    CleverTapPlugin.profileSetMultiValues("props", values);
    showToast("check console for details");
  }

  void addMultiValue() {
    var value = "value1";
    CleverTapPlugin.profileAddMultiValue("props", value);
    showToast("check console for details");
  }

  void incrementValue() {
    var value = 15;
    CleverTapPlugin.profileIncrementValue("score", value);
    showToast("check console for details");
  }

  void decrementValue() {
    var value = 10;
    CleverTapPlugin.profileDecrementValue("score", value);
    showToast("check console for details");
  }

  void addMultiValues() {
    var values = ["value1", "value2"];
    CleverTapPlugin.profileAddMultiValues("props", values);
    showToast("check console for details");
  }

  void removeMultiValue() {
    var value = "value1";
    CleverTapPlugin.profileRemoveMultiValue("props", value);
    showToast("check console for details");
  }

  void removeMultiValues() {
    var values = ["value1", "value2"];
    CleverTapPlugin.profileRemoveMultiValues("props", values);
    showToast("check console for details");
  }

  void getTimeElapsed() {
    CleverTapPlugin.sessionGetTimeElapsed().then((timeElapsed) {
      if (timeElapsed == null) return;
      setState((() {
        showToast("Session Time Elapsed = " + timeElapsed.toString());
        print("Session Time Elapsed = " + timeElapsed.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getTotalVisits() {
    CleverTapPlugin.sessionGetTotalVisits().then((totalVisits) {
      if (totalVisits == null) return;
      setState((() {
        showToast("Session Total Visits = " + totalVisits.toString());
        print("Session Total Visits = " + totalVisits.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getScreenCount() {
    CleverTapPlugin.sessionGetScreenCount().then((screenCount) {
      if (screenCount == null) return;
      setState((() {
        showToast("Session Screen Count = " + screenCount.toString());
        print("Session Screen Count = " + screenCount.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getPreviousVisitTime() {
    CleverTapPlugin.sessionGetPreviousVisitTime().then((previousTime) {
      if (previousTime == null) return;
      setState((() {
        showToast("Session Previous Visit Time = " + previousTime.toString());
        print("Session Previous Visit Time = " + previousTime.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getUTMDetails() {
    CleverTapPlugin.sessionGetUTMDetails().then((utmDetails) {
      if (utmDetails == null) return;
      setState((() {
        showToast("Session UTM Details = " + utmDetails.toString());
        print("Session UTM Details = " + utmDetails.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void suspendInAppNotifications() {
    CleverTapPlugin.suspendInAppNotifications();
    showToast("InApp notification is suspended");
  }

  void discardInAppNotifications() {
    CleverTapPlugin.discardInAppNotifications();
    showToast("InApp notification is discarded");
  }

  void resumeInAppNotifications() {
    CleverTapPlugin.resumeInAppNotifications();
    showToast("InApp notification is resumed");
  }

  void enablePersonalization() {
    CleverTapPlugin.enablePersonalization();
    showToast("Personalization enabled");
    print("Personalization enabled");
  }

  void disablePersonalization() {
    CleverTapPlugin.disablePersonalization();
    showToast("Personalization disabled");
    print("Personalization disabled");
  }

  void getAdUnits() async {
    List? displayUnits = await CleverTapPlugin.getAllDisplayUnits();
    showToast("check console for logs");
    print("Display Units = " + displayUnits.toString());
  }

  void fetch() {
    CleverTapPlugin.fetch();
    showToast("check console for logs");

    ///CleverTapPlugin.fetchWithMinimumIntervalInSeconds(0);
  }

  void activate() {
    CleverTapPlugin.activate();
    showToast("check console for logs");
  }

  void fetchAndActivate() {
    CleverTapPlugin.fetchAndActivate();
    showToast("check console for logs");
  }
}
