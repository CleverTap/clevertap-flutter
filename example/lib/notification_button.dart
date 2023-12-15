import 'package:flutter/material.dart';
import 'package:clevertap_plugin/clevertap_plugin.dart';

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
    print('Widget is mounted');
  }

  @override
  void dispose() {
    print('Widget is unmounted');
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
