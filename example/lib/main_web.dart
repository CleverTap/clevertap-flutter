import 'package:flutter/material.dart';
import 'package:clevertap_plugin/clevertap_plugin.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

void main() {
  runApp(MaterialApp(
      // Title
      title: "Using Gradient",
      // Home
      home: Scaffold(
          // Appbar
          appBar: AppBar(
            // Title
            title: Text("Hello World"),
          ),
          // Body
          body: Container(
            // Center the content
            child: Column(
              // Add Text
              children: [
                TextButton(
                  child: Text(
                    "Init",
                    style: TextStyle(color: Colors.red),
                  ),
                  onPressed: () {
                    print("on init tap");
                    if (kIsWeb) {
                      print("on web init");
                      CleverTapPlugin.init("W9R-486-4W5Z");
                    }
                  },
                ),
                TextButton(
                  child: Text(
                    "Push Event",
                    style: TextStyle(color: Colors.red),
                  ),
                  onPressed: () {
                    print("on event tap");
                    if (kIsWeb) {
                      print("on web event puch");
                      CleverTapPlugin.recordEvent("Interstitial", {});
                    }
                  },
                )
              ],
            ),
          ))));
}
