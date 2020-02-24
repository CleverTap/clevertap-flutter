import 'package:flutter/material.dart';
import 'dart:async';

import 'package:clevertap_plugin/clevertap_plugin.dart';

void main() => runApp(MyApp());

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  CleverTapPlugin _clevertapPlugin;
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
    CleverTapPlugin.createNotificationChannel("fluttertest", "Flutter Test", "Flutter Test", 3, true);
    CleverTapPlugin.initializeInbox();
    CleverTapPlugin.registerForPush();
    var initialUrl = CleverTapPlugin.getInitialUrl();
  }

  // Platform messages are asynchronous, so we initialize in an async method.
  Future<void> initPlatformState() async {
    if (!mounted) return;
  }

  void activateCleverTapFlutterPluginHandlers(){
    _clevertapPlugin = new CleverTapPlugin();
    _clevertapPlugin.setCleverTapInAppNotificationDismissedHandler(inAppNotificationDismissed);
    _clevertapPlugin.setCleverTapProfileDidInitializeHandler(profileDidInitialize);
    _clevertapPlugin.setCleverTapProfileSyncHandler(profileDidUpdate);
    _clevertapPlugin.setCleverTapInboxDidInitializeHandler(inboxDidInitialize);
    _clevertapPlugin.setCleverTapInboxMessagesDidUpdateHandler(inboxMessagesDidUpdate);
    _clevertapPlugin.setCleverTapExperimentsDidUpdateHandler(ctExperimentsUpdated);
  }

  void inAppNotificationDismissed(List<Map<String,dynamic>> mapList){
    this.setState((){
      print("inAppNotificationDismissed called");
    });
  }

  void profileDidInitialize(){
    this.setState((){
      print("profileDidInitialize called");
    });
  }

  void profileDidUpdate(Map<String,dynamic> map){
    this.setState((){
      print("profileDidUpdate called");
    });
  }

  void inboxDidInitialize(){
    this.setState((){
      print("inboxDidInitialize called");
      inboxInitialized = true;
    });
  }

  void inboxMessagesDidUpdate(){
    this.setState((){
      print("inboxMessagesDidUpdate called");
      var unread = CleverTapPlugin.getInboxMessageUnreadCount();
      var total = CleverTapPlugin.getInboxMessageCount();
      print("Unread count = "+unread.toString());
      print("Total count = "+total.toString());
    });
  }

  void ctExperimentsUpdated(){
    this.setState((){
      print("CTExperimentsUpdated called");
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Plugin example app'),
        ),
        body: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                RaisedButton(
                  onPressed: () => CleverTapPlugin.setDebugLevel(3),
                  child: Text('Debug Level'),
                ),
                RaisedButton(
                    onPressed: () => recordEvent(),
                    child: Text('Push Event')
                ),
                RaisedButton(
                    onPressed: () => recordUser(),
                    child: Text('Push User')
                ),
                RaisedButton(
                    onPressed: () => recordChargedEvent(),
                    child: Text('Charged Event')
                ),
                RaisedButton(
                    onPressed: () => showInbox(),
                    child: Text('Show Inbox')
                ),
                RaisedButton(
                    onPressed: () => setOptOut(),
                    child: Text('Opt In/Out')
                ),
                RaisedButton(
                    onPressed: () => setOffline(),
                    child: Text('On/Off-line')
                ),
                RaisedButton(
                    onPressed: () => setEnableDeviceNetworkingInfo(),
                    child: Text('Enable/Disable Networking Info')
                ),
                RaisedButton(
                    onPressed: () => enablePersonalization(),
                    child: Text('Enable Personalization')
                ),
                RaisedButton(
                    onPressed: () => disablePersonalization(),
                    child: Text('Disable Personalization')
                ),
                RaisedButton(
                    onPressed: () => eventGetFirstTime(),
                    child: Text('Get Event First Time')
                ),
                RaisedButton(
                    onPressed: () => eventGetOccurrences(),
                    child: Text('Get Event Occurrences')
                ),
                RaisedButton(
                    onPressed: () => getEventDetail(),
                    child: Text('Get Event Detail')
                ),
                RaisedButton(
                    onPressed: () => getEventHistory(),
                    child: Text('Get Event History')
                ),
                RaisedButton(
                    onPressed: () => setLocation(),
                    child: Text('Set Location')
                ),
                RaisedButton(
                    onPressed: () => getCTAttributionId(),
                    child: Text('Get Attribution ID')
                ),
                RaisedButton(
                    onPressed: () => getCleverTapId(),
                    child: Text('Get CleverTap ID')
                ),
                RaisedButton(
                    onPressed: () => onUserLogin(),
                    child: Text('On User Login')
                ),
                RaisedButton(
                    onPressed: () => eventGetLastTime(),
                    child: Text('Get Event Last Time ')
                ),
                RaisedButton(
                    onPressed: () => removeProfileValue(),
                    child: Text('Remove Profile Value For Key')
                ),
                RaisedButton(
                    onPressed: () => setProfileMultiValue(),
                    child: Text('Set Profile Multi Values')
                ),
                RaisedButton(
                    onPressed: () => addMultiValue(),
                    child: Text('Add Profile Multi Value')
                ),
                RaisedButton(
                    onPressed: () => addMultiValues(),
                    child: Text('Add Profile Multi values')
                ),
                RaisedButton(
                    onPressed: () => removeMultiValue(),
                    child: Text('Remove Multi Value')
                ),
                RaisedButton(
                    onPressed: () => removeMultiValues(),
                    child: Text('Remove Multi Values')
                ),
                RaisedButton(
                    onPressed: () => getTimeElapsed(),
                    child: Text('Session Time Elapsed')
                ),
                RaisedButton(
                    onPressed: () => getTotalVisits(),
                    child: Text('Session Total Visits')
                ),
                RaisedButton(
                    onPressed: () => getScreenCount(),
                    child: Text('Session Screen Count')
                ),
                RaisedButton(
                    onPressed: () => getPreviousVisitTime(),
                    child: Text('Session Previous Visit Time')
                ),
                RaisedButton(
                    onPressed: () => getUTMDetails(),
                    child: Text('Session Get UTM Details')
                ),
                RaisedButton(
                    onPressed: () => registerBooleanVar(),
                    child: Text('Register Boolean Variable')
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> recordEvent(){
    var eventData = {
      // Key:    Value
      'first': 'partridge',
      'second': 'turtledoves'
    };
    CleverTapPlugin.recordEvent("Flutter Event",eventData);
  }

  void recordChargedEvent(){
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
    var items = [item1,item2];
    var chargeDetails = {
      // Key:    Value
      'total': '200',
      'payment': 'cash'
    };
    CleverTapPlugin.recordChargedEvent(chargeDetails, items);
  }

  void recordUser(){
    var stuff = ["bags","shoes"];
    var profile = {
      'Name': 'Tony Stark',
      'Identity': '100',
      'Email': 'tony@stark.com',
      'Phone': '+14155551234',
      'props': 'property1',
      'stuff': stuff
    };
    CleverTapPlugin.profileSet(profile);
  }

  void showInbox(){
    if(inboxInitialized) {
      CleverTapPlugin.showInbox(null);
    }
  }

  void setOptOut(){
    if(optOut){
      CleverTapPlugin.setOptOut(false);
      optOut = false;
    }else{
      CleverTapPlugin.setOptOut(true);
      optOut = true;
    }
  }

  void setOffline(){
    if(offLine){
      CleverTapPlugin.setOffline(false);
      offLine = false;
    }else{
      CleverTapPlugin.setOffline(true);
      offLine = true;
    }
  }

  void setEnableDeviceNetworkingInfo(){
    if(enableDeviceNetworkingInfo){
      CleverTapPlugin.enableDeviceNetworkInfoReporting(false);
      enableDeviceNetworkingInfo = false;
    }else{
      CleverTapPlugin.enableDeviceNetworkInfoReporting(true);
      enableDeviceNetworkingInfo = true;
    }
  }

  void recordScreenView(){
    var screenName = "Home Screen";
    CleverTapPlugin.recordScreenView(screenName);
  }

  void eventGetFirstTime(){
    var eventName = "Flutter Event";
    CleverTapPlugin.eventGetFirstTime(eventName).then((eventFirstTime) {
      if (eventFirstTime == null) return;
      setState((() {
        print("Event First time CleverTap = "+ eventFirstTime.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void eventGetLastTime(){
    var eventName = "Flutter Event";
    CleverTapPlugin.eventGetLastTime(eventName).then((eventLastTime) {
      if (eventLastTime == null) return;
      setState((() {
        print("Event Last time CleverTap = "+ eventLastTime.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void eventGetOccurrences(){
    var eventName = "Flutter Event";
    CleverTapPlugin.eventGetOccurrences(eventName).then((eventOccurrences) {
      if (eventOccurrences == null) return;
      setState((() {
        print("Event detail from CleverTap = "+ eventOccurrences.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getEventDetail(){
    var eventName = "Flutter Event";
    CleverTapPlugin.eventGetDetail(eventName).then((eventDetailMap) {
      if (eventDetailMap == null) return;
      setState((() {
        print("Event detail from CleverTap = "+ eventDetailMap.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getEventHistory(){
    var eventName = "Flutter Event";
    CleverTapPlugin.getEventHistory(eventName).then((eventDetailMap) {
      if (eventDetailMap == null) return;
      setState((() {
        print("Event History from CleverTap = "+ eventDetailMap.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void setLocation(){
    var lat = 19.07;
    var long = 72.87;
    CleverTapPlugin.setLocation(lat,long);
  }

  void getCTAttributionId(){
    CleverTapPlugin.profileGetCleverTapAttributionIdentifier().then((attributionId) {
      if (attributionId == null) return;
      setState((() {
        print("Attribution Id = "+ "$attributionId");
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getCleverTapId() {
    CleverTapPlugin.profileGetCleverTapID().then((clevertapId) {
      if (clevertapId == null) return;
      setState((() {
        print("$clevertapId");
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void onUserLogin(){
    var stuff = ["bags","shoes"];
    var profile = {
      'Name': 'Captain America',
      'Identity': '100',
      'Email': 'captain@america.com',
      'Phone': '+14155551234',
      'stuff' : stuff
    };
    CleverTapPlugin.onUserLogin(profile);
  }

  void removeProfileValue(){
    CleverTapPlugin.profileRemoveValueForKey("props");
  }

  void setProfileMultiValue(){
    var values = ["value1","value2"];
    CleverTapPlugin.profileSetMultiValues("props", values);
  }

  void addMultiValue(){
    var value = "value1";
    CleverTapPlugin.profileAddMultiValue("props", value);
  }

  void addMultiValues(){
    var values = ["value1","value2"];
    CleverTapPlugin.profileAddMultiValues("props", values);
  }

  void removeMultiValue(){
    var value = "value1";
    CleverTapPlugin.profileRemoveMultiValue("props", value);
  }

  void removeMultiValues(){
    var values = ["value1","value2"];
    CleverTapPlugin.profileRemoveMultiValues("props", values);
  }

  void getTimeElapsed(){
    CleverTapPlugin.sessionGetTimeElapsed().then((timeElapsed) {
      if (timeElapsed == null) return;
      setState((() {
        print("Session Time Elapsed = "+ timeElapsed.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getTotalVisits(){
    CleverTapPlugin.sessionGetTotalVisits().then((totalVisits) {
      if (totalVisits == null) return;
      setState((() {
        print("Session Total Visits = "+ totalVisits.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getScreenCount(){
    CleverTapPlugin.sessionGetScreenCount().then((screenCount) {
      if (screenCount == null) return;
      setState((() {
        print("Session Screen Count = "+ screenCount.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getPreviousVisitTime(){
    CleverTapPlugin.sessionGetPreviousVisitTime().then((previousTime) {
      if (previousTime == null) return;
      setState((() {
        print("Session Previous Visit Time = "+ previousTime.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void getUTMDetails(){
    CleverTapPlugin.sessionGetUTMDetails().then((utmDetails) {
      if (utmDetails == null) return;
      setState((() {
        print("Session UTM Details = "+ utmDetails.toString());
      }));
    }).catchError((error) {
      setState(() {
        print("$error");
      });
    });
  }

  void enablePersonalization(){
    CleverTapPlugin.enablePersonalization();
    print("Personalization enabled");
  }

  void disablePersonalization(){
    CleverTapPlugin.disablePersonalization();
    print("Personalization disabled");
  }

  void registerBooleanVar(){
    CleverTapPlugin.registerBooleanVariable("boolVar");
    print("boolVar variable registered");
  }
}
