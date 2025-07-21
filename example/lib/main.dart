import 'dart:async';
import 'dart:convert';
import 'dart:io' show Platform, sleep;
import 'dart:math';
import 'package:example/notification_button.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

import 'package:clevertap_plugin/clevertap_plugin.dart';
import 'package:example/deeplink_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_styled_toast/flutter_styled_toast.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'custom_template.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

final int TEST_RUN_APP_DELAY = 0;
final int CLEVERTAP_LISTENER_ATTACH_DELAY = 0;
final bool testWithWorkManager = false;

@pragma('vm:entry-point')
void onKilledStateNotificationClickedHandler(Map<String, dynamic> map) async {
  print("onKilledStateNotificationClickedHandler called from headless task!");
  print("Notification Payload received: " + map.toString());
}

Future<void> _firebaseBackgroundMessageHandler(RemoteMessage message) async {
  // This is a dummy firebase integration to test usecases with background isolates
  await Firebase.initializeApp();
  print("_firebaseBackgroundMessageHandler Background");
  // CleverTapPlugin.createNotification(jsonEncode(message.data));
}

/// Handles foreground messages of FCM
void _firebaseForegroundMessageHandler(RemoteMessage remoteMessage) {
  print('_firebaseForegroundMessageHandler called');
  // CleverTapPlugin.createNotification(jsonEncode(remoteMessage.data));
}

void main() async {
  print("CleverTapPlugin main pre ensure");
  WidgetsFlutterBinding.ensureInitialized();
  if (!kIsWeb && !Platform.isIOS  && testWithWorkManager) {

    await Firebase.initializeApp();
    FirebaseMessaging.onMessage.listen(_firebaseForegroundMessageHandler);
    FirebaseMessaging.onBackgroundMessage(_firebaseBackgroundMessageHandler);
  }

  CleverTapPlugin.onKilledStateNotificationClicked(
      onKilledStateNotificationClickedHandler);

  print("CleverTapPlugin main pre runapp");

  Future.delayed(Duration(seconds: TEST_RUN_APP_DELAY), () {
    runApp(MaterialApp(
      navigatorKey: navigatorKey,
      title: 'Home Page',
      home: MyApp(),
    ));
    print("CleverTapPlugin main POSTTT runapp");
  });
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late CleverTapPlugin _clevertapPlugin;

  var inboxInitialized = false;
  var optOut = false;
  var offLine = false;
  var firstMsgId = "";

  var enableDeviceNetworkingInfo = false;

  void _handleKilledStateNotificationInteraction() async {
    CleverTapAppLaunchNotification appLaunchNotification =
        await CleverTapPlugin.getAppLaunchNotification();
    print(
        "_handleKilledStateNotificationInteraction => $appLaunchNotification");

    if (appLaunchNotification.didNotificationLaunchApp) {
      Map<String, dynamic> notificationPayload = appLaunchNotification.payload!;
      handleDeeplink(notificationPayload);
    }
  }

  @override
  void initState() {
    print("CleverTapPlugin initState");
    super.initState();
    initPlatformState();
    Future.delayed(Duration(seconds: CLEVERTAP_LISTENER_ATTACH_DELAY), () {
      activateCleverTapFlutterPluginHandlers();
    });
    CleverTapPlugin.setDebugLevel(3);
    if (kIsWeb) {
      CleverTapPlugin.init("CLEVERTAP_ACCOUNT_ID", "CLEVERTAP_REGION", "CLEVERTAP_TARGET_DOMAIN");
      CleverTapPlugin.setDebugLevel(3);
      CleverTapPlugin.addKVDataChangeListener((obj) {
        var kv = obj["kv"];
        print(kv);
      });
      return;
    }
    if (Platform.isAndroid) {
      _handleKilledStateNotificationInteraction();
    }
    CleverTapPlugin.createNotificationChannel("fluttertest", "Flutter Test", "Flutter Test", 3, true);
    CleverTapPlugin.initializeInbox();
    CleverTapPlugin.registerForPush(); //only for iOS
    //var initialUrl = CleverTapPlugin.getInitialUrl();
  }

  @override
  void dispose() {
    super.dispose();
    // CleverTapPlugin.unregisterPushPermissionNotificationResponseListener();
  }

  // Platform messages are asynchronous, so we initialize in an async method.
  Future<void> initPlatformState() async {
    if (!mounted) return;
  }

  void activateCleverTapFlutterPluginHandlers() {
    print("activateCleverTapFlutterPluginHandlers()");
    _clevertapPlugin = new CleverTapPlugin();
    _clevertapPlugin.setCleverTapProfileDidInitializeHandler(profileDidInitialize);
    _clevertapPlugin.setCleverTapProfileSyncHandler(profileDidUpdate);
    _clevertapPlugin.setCleverTapInAppNotificationDismissedHandler(inAppNotificationDismissed);
    //before-show
    _clevertapPlugin.setCleverTapInAppNotificationShowHandler(inAppNotificationShow);
    _clevertapPlugin.setCleverTapInboxDidInitializeHandler(inboxDidInitialize);
    _clevertapPlugin.setCleverTapInboxMessagesDidUpdateHandler(inboxMessagesDidUpdate);
    _clevertapPlugin.setCleverTapInboxNotificationButtonClickedHandler(inboxNotificationButtonClicked);
    _clevertapPlugin.setCleverTapInboxNotificationMessageClickedHandler(inboxNotificationMessageClicked);
    _clevertapPlugin.setCleverTapDisplayUnitsLoadedHandler(onDisplayUnitsLoaded);

    _clevertapPlugin.setCleverTapPushPermissionResponseReceivedHandler(pushPermissionResponseReceived);
    _clevertapPlugin.setCleverTapPushAmpPayloadReceivedHandler(pushAmpPayloadReceived);
    //CLEVERTAP_ON_VARIABLES_CHA
    //CLEVERTAP_ON_ONE_TIME_VARI
    //CLEVERTAP_ON_VALUE_CHANGED
    _clevertapPlugin.setCleverTapCustomTemplatePresentHandler(presentCustomTemplate);
    _clevertapPlugin.setCleverTapCustomTemplateCloseHandler(closeCustomTemplate);
    _clevertapPlugin.setCleverTapCustomFunctionPresentHandler(presentCustomFunction);

    _clevertapPlugin.setCleverTapPushClickedPayloadReceivedHandler(pushClickedPayloadReceived);
    _clevertapPlugin.setCleverTapInAppNotificationButtonClickedHandler(inAppNotificationButtonClicked);
  }

 void presentCustomTemplate(String templateName) async {
  print("presentCustomTemplate dart called for + $templateName");

  var data = await printArgsAsString(templateName);

  showDialog(
    context: navigatorKey.currentContext!,
    builder: (BuildContext context) {
      return CustomTemplateDialog(
        templateName: templateName,
        data: data,
        handleClose: closeCustomTemplate,
        handlePresented: handlePresented,
        handleAction: handleAction,
        handleFile: handleFile,
        printArgument: printArgument,
      );
    },
  );
}

  void closeCustomTemplate(String templateName) {
    print("closeCustomTemplate dart called for $templateName");
    CleverTapPlugin.customTemplateSetDismissed(templateName);
    print(templateName);
  }

  void presentCustomFunction(String templateName) {
    print("presentCustomFunction dart called for $templateName");
    CleverTapPlugin.customTemplateSetPresented(templateName);
    print(templateName);
  }

  // Start utility for custom code templates

  Future<String> printArgsAsString(String templateName) async {
    StringBuffer buffer = StringBuffer();
    buffer.write('string = ');
    buffer.write(await CleverTapPlugin.customTemplateGetStringArg(templateName, "string"));
    buffer.write('\n');
    buffer.write('bool  =');
    buffer.write(await CleverTapPlugin.customTemplateGetBooleanArg(templateName, "bool"));
    buffer.write('\n');
    buffer.write('map.int  =');
    buffer.write(await CleverTapPlugin.customTemplateGetNumberArg(templateName, "map.int"));
    buffer.write('\n');
    buffer.write('map.string  =');
    buffer.write(await CleverTapPlugin.customTemplateGetStringArg(templateName, "map.string"));
    buffer.write('\n');
    buffer.write('file  =');
    buffer.write(await CleverTapPlugin.customTemplateGetFileArg(templateName, "file"));
    buffer.write('\n');
    return buffer.toString();
  }

  void handlePresented(String templateName) {
    CleverTapPlugin.customTemplateSetPresented(templateName);
  }
  void handleAction(String templateName, String argumentName) {
    CleverTapPlugin.customTemplateRunAction(templateName, "action");
  }
  void handleFile(String templateName, String argumentName) async {
    var filePath = await CleverTapPlugin.customTemplateGetFileArg(templateName, "file");
    showToast(filePath);
  }
  void printArgument(String templateName, String argumentName) {
    printArgsAsString(templateName);
  }

  // End utility for custom code templates
  
  void inAppNotificationDismissed(Map<String, dynamic> map) {
    this.setState(() {
      print("inAppNotificationDismissed called");
      // Uncomment to print payload.
      // printInAppNotificationDismissedPayload(map);
    });
  }

  void printInAppNotificationDismissedPayload(Map<String, dynamic>? map) {
    if (map != null) {
      var extras = map['extras'];
      var actionExtras = map['actionExtras'];
      print("InApp -> dismissed with extras map: ${extras.toString()}");
      print(
          "InApp -> dismissed with actionExtras map: ${actionExtras.toString()}");
      actionExtras.forEach((key, value) {
        print("Value for key: ${key.toString()} is: ${value.toString()}");
      });
    }
  }

  void inAppNotificationShow(Map<String, dynamic> map) {
    this.setState(() {
      print("inAppNotificationShow called = ${map.toString()}");
    });
  }

  void inAppNotificationButtonClicked(Map<String, dynamic>? map) {
    this.setState(() {
      print("inAppNotificationButtonClicked called = ${map.toString()}");
      // Uncomment to print payload.
      // printInAppButtonClickedPayload(map);
    });
  }

  void printInAppButtonClickedPayload(Map<String, dynamic>? map) {
    if (map != null) {
      print("InApp -> button clicked with map: ${map.toString()}");
      map.forEach((key, value) {
        print("Value for key: ${key.toString()} is: ${value.toString()}");
      });
    }
  }

  void inboxNotificationButtonClicked(Map<String, dynamic>? map) {
    this.setState(() {
      print("inboxNotificationButtonClicked called = ${map.toString()}");
      // Uncomment to print payload.
      // printInboxMessageButtonClickedPayload(map);
    });
  }

  void printInboxMessageButtonClickedPayload(Map<String, dynamic>? map) {
    if (map != null) {
      print("App Inbox -> message button tapped with customExtras key/value:");
      map.forEach((key, value) {
        print("Value for key: ${key.toString()} is: ${value.toString()}");
      });
    }
  }

  void inboxNotificationMessageClicked(
      Map<String, dynamic>? data, int contentPageIndex, int buttonIndex) {
    this.setState(() {
      print("App Inbox -> "
              "inboxNotificationMessageClicked called = InboxItemClicked at page-index "
              "$contentPageIndex with button-index $buttonIndex" +
          data.toString());

      var inboxMessageClicked = data?["msg"];
      if (inboxMessageClicked == null) {
        return;
      }

      //The contentPageIndex corresponds to the page index of the content, which ranges from 0 to the total number of pages for carousel templates. For non-carousel templates, the value is always 0, as they only have one page of content.
      var messageContentObject =
          inboxMessageClicked["content"][contentPageIndex];

      //The buttonIndex corresponds to the CTA button clicked (0, 1, or 2). A value of -1 indicates the app inbox body/message clicked.
      if (buttonIndex != -1) {
        //button is clicked
        var buttonObject = messageContentObject["action"]["links"][buttonIndex];
        var buttonType = buttonObject?["type"];
        switch (buttonType) {
          case "copy":
            //this type copies the associated text to the clipboard
            var copiedText = buttonObject["copyText"]?["text"];
            print("App Inbox -> copied text to Clipboard: $copiedText");
            //dismissAppInbox();
            break;
          case "url":
            //this type fires the deeplink
            var firedDeepLinkUrl = buttonObject["url"]?["android"]?["text"];
            print("App Inbox -> fired deeplink url: $firedDeepLinkUrl");
            //dismissAppInbox();
            break;
          case "kv":
            //this type contains the custom key-value pairs
            var kvPair = buttonObject["kv"];
            print("App Inbox -> custom key-value pair: $kvPair");
            //dismissAppInbox();
            break;
        }
      } else {
        //Item's body is clicked
        print(
            "App Inbox -> type/template of App Inbox item: ${inboxMessageClicked["type"]}");
        //dismissAppInbox();
      }
    });
  }

  void dismissAppInbox() {
    CleverTapPlugin.dismissInbox();
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
    this.setState(() {
      print("Display Units = " + displayUnits.toString());
      // Uncomment to print payload.
      // printDisplayUnitPayload(displayUnits);
    });
  }

  void printDisplayUnitPayload(List<dynamic>? displayUnits) {
    if (displayUnits != null) {
      print("Total Display unit count = ${(displayUnits.length).toString()}");
      displayUnits.forEach((element) {
        printDisplayUnit(element);
      });
    }
  }

  void printDisplayUnit(Map<dynamic, dynamic> displayUnit) {
    var content = displayUnit['content'];
    content.forEach((contentElement) {
      print("Title text of display unit is ${contentElement['title']['text']}");
      print(
          "Message text of display unit is ${contentElement['message']['text']}");
    });
    var customKV = displayUnit['custom_kv'];
    if (customKV != null) {
      print("Display units custom key-values:");
      customKV.forEach((key, value) {
        print("Value for key: ${key.toString()} is: ${value.toString()}");
      });
    }
  }

  void pushAmpPayloadReceived(Map<String, dynamic> map) {
    print("pushAmpPayloadReceived called");
    this.setState(() async {
      var data = jsonEncode(map);
      print("Push Amp Payload = " + data.toString());
      CleverTapPlugin.createNotification(data);
    });
  }

  void pushClickedPayloadReceived(Map<String, dynamic> notificationPayload) {
    print("pushClickedPayloadReceived called");
    print("on Push Click Payload = " + notificationPayload.toString());
    handleDeeplink(notificationPayload);
  }

  void pushPermissionResponseReceived(bool accepted) {
    print("Push Permission response called ---> accepted = " +
        (accepted ? "true" : "false"));
  }


  Widget _buildExpansionTile(String title, List<Widget> children) {
    return Card(
      color: Colors.lightBlueAccent.shade100,
      child: ExpansionTile(
        title: Text(title, style: TextStyle(fontWeight: FontWeight.bold)),
        children: children,
      ),
    );
  }

  Widget _buildListTile(String title, VoidCallback onTap, [String subtitle = ""]) {
    return Card(
      color: Colors.grey.shade300,
      child: Padding(
        padding: const EdgeInsets.all(4.0),
        child: ListTile(
          title: Text(title),
          subtitle: subtitle.isNotEmpty ? Text(subtitle) : null,
          onTap: onTap,
        ),
      ),
    );
  }

  void _buildDialogSingleInput(BuildContext context, Function(String) onTap, String textFieldValue) {
    TextEditingController eventController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text("Enter $textFieldValue"),
          content: TextField(
            controller: eventController,
            decoration: InputDecoration(hintText: "$textFieldValue"),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context), // Close dialog
              child: Text("Cancel"),
            ),
            TextButton(
              onPressed: () {
                String eventName = eventController.text.trim();
                if (eventName.isNotEmpty) {
                  onTap(eventName); // Call function with user input
                  Navigator.pop(context); // Close dialog
                } else {
                  showToast("Please enter $textFieldValue.");
                }
              },
              child: Text("Submit"),
            ),
          ],
        );
      },
    );
  }

  void _buildDialogMultipleInput(BuildContext context, Function(String, String) onTap, List<String> hintTexts) {
    TextEditingController firstController = TextEditingController();
    TextEditingController secondController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text("Enter Details"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: firstController,
                decoration: InputDecoration(hintText: hintTexts[0]), // Custom hint text for first input
              ),
              SizedBox(height: 10), // Space between fields
              TextField(
                controller: secondController,
                decoration: InputDecoration(hintText: hintTexts[1]), // Custom hint text for second input
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context), // Close dialog
              child: Text("Cancel"),
            ),
            TextButton(
              onPressed: () {
                String firstInput = firstController.text.trim();
                String secondInput = secondController.text.trim();

                if (firstInput.isNotEmpty && secondInput.isNotEmpty) {
                  onTap(firstInput, secondInput); // Pass both inputs
                  Navigator.pop(context); // Close dialog
                } else {
                  showToast("Please fill in both fields.");
                }
              },
              child: Text("Submit"),
            ),
          ],
        );
      },
    );
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
              actions: kIsWeb
                  ? [
                      Padding(
                        padding: EdgeInsets.only(right: 60.0),
                        child: NotificationButton(
                          child: Icon(
                            Icons.notifications,
                            color: Colors.black,
                          ),
                        ),
                      ),
                    ]
                  : null,
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
                _buildExpansionTile("Product Experiences", [
                  _buildListTile("Sync Variables", syncVariables),
                  _buildListTile("Fetch Variables", fetchVariables),
                  _buildListTile("Define Variables", defineVariables),
                  _buildListTile("Define File Variable", defineFileVariable),
                  _buildListTile("Get Variables", getVariables),
                  _buildListTile('Get Variable Value for name \'flutter_var_string\'', getVariable),
                  _buildListTile('Get Variable Value for name \'folder1.fileVariable\'', getFileVariable),
                  _buildListTile('Add \'OnVariablesChanged\' listener', onVariablesChanged),
                  _buildListTile('Add \'OnOneTimeVariablesChanged\' listener', onOneTimeVariablesChanged),
                  _buildListTile('Add \'OnValueChanged\' listener for name \'flutter_var_string\'', onValueChanged),
                  _buildListTile('Add \'OnFileVariablesChangedAndNoDownloadsPending\' listener', onVariablesChangedAndNoDownloadsPending),
                  _buildListTile('Add \'OnceFileVariablesChangedAndNoDownloadsPending\' listener', onceVariablesChangedAndNoDownloadsPending),
                  _buildListTile('Add \'OnFileChanged\' listener for name \'folder1.fileVariable\'', onFileChanged),
                ]),
              _buildExpansionTile("User Profiles", [
                  _buildListTile("Push User", recordUser, "Pushes/Records a user"),
                  _buildListTile("Push User with custom attributes", () => _buildDialogMultipleInput(context, recordCustomUser, ["Enter Attribute Name", "Enter Attribute Value"]), "Pushes/Records a user"),
                  _buildListTile("Set Profile Multi Values", setProfileMultiValue, "Sets a multi valued user property"),
                  _buildListTile("Remove Profile Value For Key", removeProfileValue, "Removes user property of given key"),
                  _buildListTile("Add Profile Multi Value", addMultiValue, "Add user property"),
                  _buildListTile("Profile increment value", incrementValue, "Increment value by 15"),
                  _buildListTile("Profile decrement value", decrementValue, "Decrement value by 10"),
                  _buildListTile("Add Profile Multi values", addMultiValues, "Add a multi valued user property"),
                  _buildListTile("Remove Multi Value", removeMultiValue, "Remove user property"),
                  _buildListTile("Remove Multi Values", removeMultiValues, "Remove a multi valued user property"),
                ]),

                _buildExpansionTile("Identity Management", [
                  _buildListTile("Performs onUserLogin", onUserLogin, "Used to identify multiple profiles"),
                  _buildListTile("Performs random onUserLogin ", onRandomUserLogin, "Perform Login with Random Identity"),
                  _buildListTile("Get Profile Property", getProfileProperty, "Returns the specified Profile Property"),
                  _buildListTile("Get CleverTap ID", getCleverTapId, "Returns Clevertap ID"),
                ]),

                _buildExpansionTile("Location", [
                  _buildListTile("Set Location", setLocation, "Use to set Location of a user"),
                ]),

                _buildExpansionTile("User Events", [
                  _buildListTile("Push Event", recordEvent, "Pushes/Records an event called Flutter Event"),
                  _buildListTile("Push Custom Event", () => _buildDialogSingleInput(context, recordCustomEvent, "Event Name"), "Pushes/Records a custom event"),
                  _buildListTile("Push Charged Event", recordChargedEvent, "Pushes/Records a Charged event"),
                ]),

                _buildExpansionTile("App Inbox", [
                  if (!kIsWeb) _buildListTile("Show Inbox", showInbox, "Opens sample App Inbox"),
                  if (!kIsWeb) _buildListTile("Show Inbox with sections", showInboxWithTabs, "Opens sample App Inbox"),
                  _buildListTile("Get All Inbox Messages", getAllInboxMessages, "Returns all inbox messages"),
                  _buildListTile("Get Unread Inbox Messages", getUnreadInboxMessages, "Returns unread inbox messages"),
                  _buildListTile("Get Inbox Message for given ID", getInboxMessageForId, "Returns inbox message for given ID"),
                  _buildListTile("Delete Inbox Message for given ID", deleteInboxMessageForId, "Deletes inbox message for given ID"),
                  if (!kIsWeb) _buildListTile("Delete Inbox Messages for list of IDs", deleteInboxMessagesForIds, "Deletes inbox messages for list of IDs"),
                  _buildListTile("Mark Read Inbox Message for given ID", markReadInboxMessageForId, "Mark read inbox message for given ID"),
                  _buildListTile("Mark Read Inbox Messages for list of IDs", markReadInboxMessagesForIds, "Mark read inbox messages for list of IDs"),
                  if (!kIsWeb) _buildListTile("Push Inbox Message Clicked", pushInboxNotificationClickedEventForId, "Pushes/Records inbox message clicked event"),
                  if (!kIsWeb) _buildListTile("Push Inbox Message Viewed", pushInboxNotificationViewedEventForId, "Pushes/Records inbox message viewed event"),
                ]),

                _buildExpansionTile("Enable Debugging", [
                  _buildListTile("Set Debug Level", () {
                    CleverTapPlugin.setDebugLevel(3);
                  }, "Sets the debug level to show console logs"),
                ]),

                if (!kIsWeb)
                  _buildExpansionTile("In-App Messaging Controls", [
                    _buildListTile("Suspend InApp notifications", suspendInAppNotifications, "Suspends display of InApp Notifications."),
                    _buildListTile("Discard InApp notifications", discardInAppNotifications,
                        "Suspends the display of InApp Notifications and discards any new InApp Notifications to be shown after this method is called."),
                    _buildListTile("Resume InApp notifications", resumeInAppNotifications, "Resumes display of InApp Notifications."),
                  ]),

                if (!kIsWeb)
                  _buildExpansionTile("Event History", [
                    if (!kIsWeb) _buildListTile("Get User Event Log", () => _buildDialogSingleInput(context, getEventLog, "Event Name"), "Get User Event Log for Flutter Event"),
                    if (!kIsWeb) _buildListTile("Get Event History", getEventHistory, "Get history of all Events"),
                    _buildListTile("Get Event First Time", () => _buildDialogSingleInput(context, getEventFirstTime, "Event Name"), "Gets first epoch of the event Flutter Event"),
                    _buildListTile("Get Event Count", () => _buildDialogSingleInput(context, getEventLogCount, "Event Name"), "Get count of the event Flutter Event"),
                    _buildListTile("Get Event Last Time", () => _buildDialogSingleInput(context, getEventLastTime, "Event Name"), "Returns last epoch value for the event Flutter Event"),
                    _buildListTile("App Launch Count", getUserAppLaunchCount, "Returns App Launch Count for current User"),
                    _buildListTile("User Last Visit Time", getUserLastVisitTs, "Returns user last visit time"),
                    _buildListTile("Session Time Elapsed", getTimeElapsed, "Returns session time elapsed"),
                    _buildListTile("Session Screen Count", getScreenCount, "Returns session screen count"),
                    _buildListTile("Session UTM Details", getUTMDetails, "Returns session UTM details"),
                    _buildListTile("Get Ad Units", getAdUnits, "Returns all Display Units set"),
                  ]),

                _buildExpansionTile("GDPR", [
                  _buildListTile("Set Opt Out", setOptOut, "Used to opt out of sending data to CleverTap"),
                  if (!kIsWeb)
                    _buildListTile("Device Networking Info", setEnableDeviceNetworkingInfo,
                        "Enables/Disable device networking info as per GDPR"),
                ]),

                if (!kIsWeb)
                  _buildExpansionTile("Multi-Instance", [
                    _buildListTile("Enable Personalization", enablePersonalization, "Enables Personalization"),
                    _buildListTile("Disable Personalization", disablePersonalization, "Disables Personalization"),
                  ]),

                _buildExpansionTile("Offline Mode", [
                  _buildListTile("Set Offline", setOffline, "Switches CleverTap to offline mode"),
                ]),

                _buildExpansionTile("Push Templates", [
                  _buildListTile("Basic Push", sendBasicPush),
                  if (!kIsWeb) _buildListTile("Carousel Push", sendAutoCarouselPush),
                  if (!kIsWeb) _buildListTile("Manual Carousel Push", sendManualCarouselPush),
                  if (!kIsWeb) _buildListTile("FilmStrip Carousel Push", sendFilmStripCarouselPush),
                  if (!kIsWeb) _buildListTile("Rating Push", sendRatingCarouselPush),
                  if (!kIsWeb) _buildListTile("Product Display", sendProductDisplayPush),
                  if (!kIsWeb) _buildListTile("Linear Product Display", sendLinearProductDisplayPush),
                  if (!kIsWeb) _buildListTile("Five CTA", sendCTAPush),
                  if (!kIsWeb) _buildListTile("Zero Bezel", sendZeroBezelPush),
                  if (!kIsWeb) _buildListTile("Zero Bezel Text Only", sendZeroBezelTextOnlyPush),
                  if (!kIsWeb) _buildListTile("Timer Push", sendTimerPush),
                ]),

                if (!kIsWeb)
                  _buildExpansionTile("Input Box Push Notifications", [
                    _buildListTile("CTA + reminder Push Campaign - DOC true", sendInputBoxPush),
                    _buildListTile("Reply with Event", sendInputBoxReplyEventPush),
                    _buildListTile("Reply with Intent", sendInputBoxReplyAutoOpenPush),
                    _buildListTile("CTA + reminder Push Campaign - DOC false", sendInputBoxRemindDOCFalsePush),
                    _buildListTile("CTA - DOC true", sendInputBoxCTADOCTruePush),
                    _buildListTile("CTA - DOC false", sendInputBoxCTADOCFalsePush),
                    _buildListTile("Reminder - DOC true", sendInputBoxReminderDOCTruePush),
                    _buildListTile("Reminder - DOC false", sendInputBoxReminderDOCFalsePush),
                  ]),

                if (!kIsWeb)
                  _buildExpansionTile("Push Tokens", [
                    _buildListTile("Set Push Token: FCM", setPushTokenFCM),
                    _buildListTile("Set Push Token: HMS", setPushTokenHMS),
                  ]),

                if (!kIsWeb)
                  _buildExpansionTile("Client Side InApps", [
                    _buildListTile("Fetch Client Side InApps", fetchInApps, "Fetches In-App notifications"),
                    _buildListTile("Clear All InApp Resources", clearInAppResources, "Removes all In-App data"),
                    _buildListTile("Clear Expired Only InApp Resources", clearExpiredInAppResources, "Removes only expired In-App data"),
                  ]),

                _buildExpansionTile("Push Primer", [
                  _buildListTile("Prompt for Push Notification", promptForPushNotification),
                  _buildListTile("Local Half Interstitial Push Primer", localHalfInterstitialPushPrimer),
                  if (!kIsWeb) _buildListTile("Local Alert Push Primer", localAlertPushPrimer),
                ]),

              ],
            )),
      ),
    );
  }

  void sendBasicPush() {
    var eventData = {
      // Key:    Value
      'first': 'partridge',
      'second': 'turtledoves'
    };
    CleverTapPlugin.recordEvent("Send Basic Push", eventData);
  }

  void sendAutoCarouselPush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent("Send Carousel Push", eventData);
  }

  void sendManualCarouselPush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent("Send Manual Carousel Push", eventData);
  }

  void sendFilmStripCarouselPush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent("Send Filmstrip Carousel Push", eventData);
  }

  void sendRatingCarouselPush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent("Send Rating Push", eventData);
  }

  void sendProductDisplayPush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent("Send Product Display Notification", eventData);
  }

  void sendLinearProductDisplayPush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent("Send Linear Product Display Push", eventData);
  }

  void sendCTAPush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent("Send CTA Notification", eventData);
  }

  void sendZeroBezelPush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent("Send Zero Bezel Notification", eventData);
  }

  void sendZeroBezelTextOnlyPush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent(
        "Send Zero Bezel Text Only Notification", eventData);
  }

  void sendTimerPush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent("Send Timer Notification", eventData);
  }

  void sendInputBoxPush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent("Send Input Box Notification", eventData);
  }

  void sendInputBoxReplyEventPush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent(
        "Send Input Box Reply with Event Notification", eventData);
  }

  void sendInputBoxReplyAutoOpenPush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent(
        "Send Input Box Reply with Auto Open Notification", eventData);
  }

  void sendInputBoxRemindDOCFalsePush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent(
        "Send Input Box Remind Notification DOC FALSE", eventData);
  }

  void sendInputBoxCTADOCTruePush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent("Send Input Box CTA DOC true", eventData);
  }

  void sendInputBoxCTADOCFalsePush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent("Send Input Box CTA DOC false", eventData);
  }

  void sendInputBoxReminderDOCTruePush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent("Send Input Box Reminder DOC true", eventData);
  }

  void sendInputBoxReminderDOCFalsePush() {
    var eventData = {
      // Key:    Value
      '': ''
    };
    CleverTapPlugin.recordEvent("Send Input Box Reminder DOC false", eventData);
  }

  void setPushTokenFCM() {
    CleverTapPlugin.setPushToken("token_fcm");
  }

  void setPushTokenHMS() {
    CleverTapPlugin.pushRegistrationToken("token_hms", {
      'type':'hps',
      'prefKey':'hps_token',
      'className':'com.clevertap.android.hms.HmsPushProvider',
      'messagingSDKClassName': 'com.huawei.hms.push.HmsMessageService'
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void recordCustomEvent(String eventName) {
    CleverTapPlugin.recordEvent(eventName, {});
    showToast("Raised event $eventName");
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

  void recordCustomUser(String attributeKey, String attributeValue) {
    var profile = {
      attributeKey: attributeValue,
    };
    CleverTapPlugin.profileSet(profile);
    showToast("Pushed profile " + profile.toString());
  }

  void recordUser() {
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
          'navBarColor': '#EF4444'
        };
        CleverTapPlugin.showInbox(styleConfig);
      });
    }
  }

  void showInboxWithTabs() {
    if (inboxInitialized) {
      showToast("Opening App Inbox", onDismiss: () {
        var styleConfig = {
          'noMessageTextColor': '#ff6600',
          'noMessageText': 'No message(s) to show.',
          'navBarTitle': 'App Inbox',
          'navBarTitleColor': '#101727',
          'navBarColor': '#EF4444',
          'tabs': ["promos", "offers"]
        };
        CleverTapPlugin.showInbox(styleConfig);
      });
    }
  }

  void getAllInboxMessages() async {
    List? messages = await CleverTapPlugin.getAllInboxMessages();
    showToast("See all inbox messages in console");
    if (kIsWeb || Platform.isAndroid) {
      firstMsgId = messages![0]["id"];
    } else if (Platform.isIOS) {
      firstMsgId = messages![0]["_id"];
    }
    print(firstMsgId);
    print("Inbox Messages = " + messages.toString());
    // Uncomment to print payload.
    // printInboxMessagesArray(messages);
  }

  void getUnreadInboxMessages() async {
    List? messages = await CleverTapPlugin.getUnreadInboxMessages();
    showToast("See unread inbox messages in console");
    print("Unread Inbox Messages = " + messages.toString());
    // Uncomment to print payload.
    // printInboxMessagesArray(messages);
  }

  void printInboxMessagesArray(List? messages) {
    if (messages != null) {
      print("Total Inbox messages count = ${(messages.length).toString()}");
      messages.forEach((element) {
        printInboxMessageMap(element);
      });
    }
  }

  void printInboxMessageMap(Map<dynamic, dynamic> inboxMessage) {
    print("Inbox Message wzrk_id = ${inboxMessage['wzrk_id'].toString()}");
    print("Type of Inbox = ${inboxMessage['msg']['type']}");
    var content = inboxMessage['msg']['content'];
    content.forEach((element) {
      print(
          "Inbox Message Title = ${element['title']['text']} and message = ${element['message']['text']}");
      var links = element['action']['links'];
      links.forEach((link) {
        print("Inbox Message have link type = ${link['type'].toString()}");
      });
    });
  }

  void getInboxMessageForId() async {
    var messageId = await getFirstInboxMessageId();

    print("first message Id" + "$messageId");
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
      // Uncomment to print payload.
      // printInboxMessageMap(messageForId);
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

  void deleteInboxMessagesForIds() async {
    var messageId = await getFirstInboxMessageId();

    if (messageId == null) {
      setState((() {
        showToast("Inbox Message id is null");
        print("Inbox Message id is null");
      }));
      return;
    }

    await CleverTapPlugin.deleteInboxMessagesForIds([messageId]);

    setState((() {
      showToast("Deleted Inbox Messages with ids =  $messageId");
      print("Deleted Inbox Messages with ids =  $messageId");
    }));
  }

  void markReadInboxMessageForId() async {
    var messageId = await getFirstUnreadInboxMessageId();

    if (messageId == null) {
      setState((() {
        showToast("Inbox Message id is null");
        print("Inbox Message id is null");
      }));
      return;
    }

    await CleverTapPlugin.markReadInboxMessageForId(messageId);

    setState((() {
      showToast("Marked Inbox Message as read with id =  $messageId");
      print("Marked Inbox Message as read with id =  $messageId");
    }));
  }

  void markReadInboxMessagesForIds() async {
    var messageId = await getFirstUnreadInboxMessageId();

    if (messageId == null) {
      setState((() {
        showToast("Inbox Message id is null");
        print("Inbox Message id is null");
      }));
      return;
    }

    await CleverTapPlugin.markReadInboxMessagesForIds([messageId]);

    setState((() {
      showToast("Marked Inbox Messages as read with ids =  ${[messageId]}");
      print("Marked Inbox Messages as read with ids =  ${[messageId]}");
    }));
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

    if (kIsWeb) {
      return itemFirst["id"];
    } else if (Platform.isAndroid) {
      return itemFirst["id"];
    } else if (Platform.isIOS) {
      return itemFirst["_id"];
    }
    return "";
  }

  Future<String>? getFirstUnreadInboxMessageId() async {
    var messageList = await CleverTapPlugin.getUnreadInboxMessages();
    print("inside getFirstUnreadInboxMessageId");

    Map<dynamic, dynamic> itemFirst = messageList?[0];
    print(itemFirst.toString());

    if (kIsWeb || Platform.isAndroid) {
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

  void getEventFirstTime(String eventName) {
    CleverTapPlugin.getUserEventLog(eventName).then((userEventLog) {
      setState((() {
        showToast("Event First time for $eventName =  ${userEventLog["firstTime"]}");
        print("Event First time for $eventName =  ${userEventLog["firstTime"]}");
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getEventLastTime(String eventName) {
    CleverTapPlugin.getUserEventLog(eventName).then((userEventLog) {
      setState((() {
        showToast("Event Last time for $eventName =  ${userEventLog["lastTime"]}");
        print("Event Last time for $eventName =  ${userEventLog["lastTime"]}");
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getEventLogCount(String eventName) {
    CleverTapPlugin.getUserEventLogCount(eventName).then((eventCount) {
      if (eventCount == null) return;
      setState((() {
        showToast("Event Count for $eventName = $eventCount");
        print("Event Count for $eventName =  $eventCount");
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getEventLog(String eventName) {
    CleverTapPlugin.getUserEventLog(eventName).then((userEventLog) {
      setState((() {
        showToast("Event Log for $eventName = " + userEventLog.toString());
        print("Event Log for $eventName = " + userEventLog.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getEventHistory() {
    CleverTapPlugin.getUserEventLogHistory().then((eventLogMap) {
      setState((() {
        showToast("Event History = " + eventLogMap.toString());
        print("Event History = " + eventLogMap.toString());
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

  void setLocale() {
    Locale locale = Locale('en', 'IN');
    CleverTapPlugin.setLocale(locale);
    showToast("Locale is set");
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

  void getProfileProperty() {
    var propertyName = "Email";
    CleverTapPlugin.profileGetProperty(propertyName).then((prop) {
      if (prop == null) {
        showToast("Property not found");
        return;
      }
      showToast("Email Profile Property = " + prop.toString());
      print("Email Profile Property = " + prop.toString());
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

  void onRandomUserLogin() {
    var random = Random();
    int randomIdentity = random.nextInt(10000);
    var stuff = ["bags", "shoes"];
    var profile = {
      'Identity': randomIdentity,
      'Custom': 'Gold',
      'stuff': stuff
    };
    CleverTapPlugin.onUserLogin(profile);
    showToast("onUserLogin called with identity = $randomIdentity");
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
    var values = ["value2", "value3"];
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

  void getUserAppLaunchCount() {
    CleverTapPlugin.getUserAppLaunchCount().then((totalVisits) {
      if (totalVisits == null) return;
      setState((() {
        showToast("App Launch Count = " + totalVisits.toString());
        print("App Launch Count = " + totalVisits.toString());
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

  void getUserLastVisitTs() {
    CleverTapPlugin.getUserLastVisitTs().then((previousTime) {
      if (previousTime == null) return;
      setState((() {
        showToast("User Previous Visit Time = " + previousTime.toString());
        print("User Previous Visit Time = " + previousTime.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getUTMDetails() {
    CleverTapPlugin.sessionGetUTMDetails().then((utmDetails) {
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
    print("Display Units Payload = " + displayUnits.toString());

    // Uncomment to print payload.
    // printDisplayUnitPayload(displayUnits);
  }

  void promptForPushNotification() {
    var fallbackToSettings = true;
    if (kIsWeb) {
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
    } else {
      CleverTapPlugin.promptForPushNotification(fallbackToSettings);
    }
    showToast("Prompt Push Permission");
  }

  void localHalfInterstitialPushPrimer() {
    var pushPrimerJSON = {
      'inAppType': 'half-interstitial',
      'titleText': 'Get Notified',
      'messageText':
          'Please enable notifications on your device to use Push Notifications.',
      'followDeviceOrientation': false,
      'positiveBtnText': 'Allow',
      'negativeBtnText': 'Cancel',
      'fallbackToSettings': true,
      'backgroundColor': '#FFFFFF',
      'btnBorderColor': '#000000',
      'titleTextColor': '#000000',
      'messageTextColor': '#000000',
      'btnTextColor': '#000000',
      'btnBackgroundColor': '#FFFFFF',
      'btnBorderRadius': '4',
      'imageUrl':
          'https://icons.iconarchive.com/icons/treetog/junior/64/camera-icon.png',
      'altText': 'Alternate Image'
    };
    if (kIsWeb) {
      CleverTapPlugin.enableWebPushNotifications(
          {'swPath': '/firebase-messaging-sw.js'});
    } else {
      CleverTapPlugin.promptPushPrimer(pushPrimerJSON);
      showToast("Half-Interstitial Push Primer");
    }
  }

  void localAlertPushPrimer() {
    this.setState(() async {
      bool? isPushPermissionEnabled =
          await CleverTapPlugin.getPushNotificationPermissionStatus();
      if (isPushPermissionEnabled == null) return;

      // Check Push Permission status and then call `promptPushPrimer` if not enabled.
      if (!isPushPermissionEnabled) {
        var pushPrimerJSON = {
          'inAppType': 'alert',
          'titleText': 'Get Notified',
          'messageText': 'Enable Notification permission',
          'followDeviceOrientation': true,
          'positiveBtnText': 'Allow',
          'negativeBtnText': 'Cancel',
          'fallbackToSettings': true
        };
        CleverTapPlugin.promptPushPrimer(pushPrimerJSON);
        showToast("Alert Push Primer");
      } else {
        print("Push Permission is already enabled.");
      }
    });
  }

  void syncVariables() {
    CleverTapPlugin.syncVariables();
    showToast("Sync Variables");
    print("PE -> Sync Variables");
  }

  void fetchVariables() async {
    showToast("Fetch Variables");
    bool? success = await CleverTapPlugin.fetchVariables();
    print("PE -> fetchVariables result: " + success.toString());
  }

  void defineVariables() {
    var variables = {
      'flutter_var_string': 'flutter_var_string_value',
      // 'flutter_var_map': {'flutter_var_map_string': 'flutter_var_map_value'},
      'flutter_var_int': 12,
      'flutter_var_float': 6.9,
      'flutter_var_boolean': true
    };
    CleverTapPlugin.defineVariables(variables);
    showToast("Define Variables");
    print("PE -> Define Variables: " + variables.toString());
  }

  void defineFileVariable() {
    CleverTapPlugin.defineFileVariable("folder1.fileVariable");
    showToast("Define File Variable");
    print("PE -> Define File Variables: \'folder1.fileVariable\'");
  }

  void getVariables() async {
    showToast("Get Variables");
    Map<Object?, Object?> variables = await CleverTapPlugin.getVariables();
    print('PE -> getVariables: ' + variables.toString());
  }

  void getVariable() async {
    showToast("Get Variable");
    var variable = await CleverTapPlugin.getVariable('flutter_var_string');
    print('PE -> variable value for key \'flutter_var_string\': ' +
        variable.toString());
  }

  void getFileVariable() async {
    showToast("Get File Variable");
    var variable = await CleverTapPlugin.getVariable('folder1.fileVariable');
    print('PE -> variable value for key \'folder1.fileVariable\': ' +
        variable.toString());
  }

  void onVariablesChanged() {
    showToast("onVariablesChanged");
    CleverTapPlugin.onVariablesChanged((variables) {
      print("PE -> onVariablesChanged: " + variables.toString());
    });
  }

  void onOneTimeVariablesChanged() {
    showToast("onOneTimeVariablesChanged");
    CleverTapPlugin.onOneTimeVariablesChanged((variables) {
      print("PE -> onOneTimeVariablesChanged: " + variables.toString());
    });
  }

  void onValueChanged() {
    showToast("onValueChanged");
    CleverTapPlugin.onValueChanged('flutter_var_string', (variable) {
      print("PE -> onValueChanged: " + variable.toString());
    });
  }

  void onVariablesChangedAndNoDownloadsPending() {
    showToast("onVariablesChangedAndNoDownloadsPending");
    CleverTapPlugin.onVariablesChangedAndNoDownloadsPending((variable) {
      print("PE -> onVariablesChangedAndNoDownloadsPending: " + variable.toString());
    });
  }

  void onceVariablesChangedAndNoDownloadsPending() {
    showToast("onceVariablesChangedAndNoDownloadsPending");
    CleverTapPlugin.onceVariablesChangedAndNoDownloadsPending((variable) {
      print("PE -> onceVariablesChangedAndNoDownloadsPending: " + variable.toString());
    });
  }

  void onFileChanged() {
    showToast("onFileValueChanged");
    CleverTapPlugin.onFileValueChanged('folder1.fileVariable', (variable) {
      print("PE -> onFileValueChanged: " + variable.toString());
    });
  }

  void handleDeeplink(Map<String, dynamic> notificationPayload) {
    var type = notificationPayload["type"];
    var title = notificationPayload["nt"];
    var message = notificationPayload["nm"];

    if (type != null) {
      Navigator.push(
          context,
          MaterialPageRoute(
              builder: (context) =>
                  DeepLinkPage(type: type, title: title, message: message)));
    }

    print(
        "_handleKilledStateNotificationInteraction => Type: $type, Title: $title, Message: $message ");
  }

  void fetchInApps() {
    showToast("Fetch Client Side In-Apps");
    this.setState(() async {
      bool? success = await CleverTapPlugin.fetchInApps();
      print("fetchInApps result: " + success.toString());
    });
  }

  void clearInAppResources() {
    var expiredOnly = false;
    CleverTapPlugin.clearInAppResources(expiredOnly);
    showToast("Clear In-App Resources");
  }

  void clearExpiredInAppResources() {
    var expiredOnly = true;
    CleverTapPlugin.clearInAppResources(expiredOnly);
    showToast("Clear In-App Resources");
  }
}
