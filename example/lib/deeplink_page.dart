import 'package:flutter/material.dart';

class DeepLinkPage extends StatelessWidget {
  const DeepLinkPage(
      {Key? key,
      required this.type,
      required this.title,
      required this.message,
      this.deepLink = ""})
      : super(key: key);

  final String type;
  final String title;
  final String message;
  final String deepLink;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('DeepLink Page'),
      ),
      body: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFDCE8F7)),
          ),
          child: Text(getFormattedText(),
              style: const TextStyle(
                fontSize: 14.0,
                height: 1.6,
                fontWeight: FontWeight.w500,
                color: Color(0xFF16222E),
              )),
        ),
      ),
    );
  }

  String getFormattedText() {
    var text = "Notification-Type:: $type" +
        "\n" +
        "Notification-Title:: $title" +
        "\n" +
        "Notification-Message:: $message";
    if (deepLink.isNotEmpty) {
      text += "\n" + "Deep-Link:: $deepLink";
    }
    return text;
  }
}
