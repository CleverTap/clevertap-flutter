import 'package:flutter/material.dart';
import 'package:clevertap_plugin/clevertap_plugin.dart';
import 'dart:html';

class NotificationButton extends StatefulWidget {
  final Widget child;

  NotificationButton({required this.child});

  @override
  _NotificationButtonState createState() => _NotificationButtonState();
}

class _NotificationButtonState extends State<NotificationButton> {
  @override
  void initState() {
    super.initState();
    // var btn = document.createElement('button');
    // btn.id = widget.id;
    // btn.style.visibility = 'hidden';
    // document.body?.append(btn);
    // caviate expose method for web inbox init
    print('Widget is mounted');
  }

  @override
  void dispose() {
    print('Widget is unmounted');
    // var btn = document.getElementById(widget.id);
    // btn?.remove();
    super.dispose();
  }

  void onClick(BuildContext context) {
    final RenderBox renderBox = context.findRenderObject() as RenderBox;
    final buttonPosition = renderBox.localToGlobal(Offset.zero);
    print(buttonPosition);
    CleverTapPlugin.toggleInbox({
      'x': buttonPosition.dx,
      'y': buttonPosition.dy,
      'left': buttonPosition.dx,
      'right': buttonPosition.dx + renderBox.size.width,
      'top': buttonPosition.dy,
      'bottom': buttonPosition.dy + renderBox.size.height,
      'height': renderBox.size.height,
      'width': renderBox.size.width
    });
    print(querySelector('#body'));
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      child: widget.child,
      onTap: () {
        print('on tap');
        onClick(context);
      },
    );
  }
}
