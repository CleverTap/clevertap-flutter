import 'package:flutter/material.dart';

class DeepLinkPage extends StatelessWidget {
  const DeepLinkPage(
      {Key? key,
      required this.type,
      required this.title,
      required this.message})
      : super(key: key);

  final String type;
  final String title;
  final String message;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('DeepLink Page'),
      ),
      body: Center(
        child: Text(getFormattedText(),
            style: TextStyle(
              fontSize: 15.0,
              fontWeight: FontWeight.bold,
              // insert your font size here
            )),
      ),
    );
  }

  String getFormattedText() {
    return "Notification-Type:: $type" +
        "\n" +
        "Notification-Title:: $title" +
        "\n" +
        "Notification-Message:: $message";
  }
}
