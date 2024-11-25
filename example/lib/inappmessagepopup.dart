import 'package:flutter/material.dart';

class InAppMessagePopup extends StatelessWidget {
  final bool visible;
  final String title;
  final String description;
  final bool isFunction;
  final VoidCallback onCancel;
  final VoidCallback onConfirm;
  final Function(String) onTriggerAction;
  final Function(String) onFileOpen;

  const InAppMessagePopup({
    required this.visible,
    required this.title,
    required this.description,
    required this.isFunction,
    required this.onCancel,
    required this.onConfirm,
    required this.onTriggerAction,
    required this.onFileOpen,
  });

  @override
  Widget build(BuildContext context) {
    return Visibility(
      visible: visible,
      child: Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          padding: EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
              SizedBox(height: 10),
              Text(description, textAlign: TextAlign.center),
              if (!isFunction)
                TextField(
                  decoration: InputDecoration(
                    hintText: 'Action Arg Name',
                  ),
                  onChanged: (value) => onTriggerAction(value),
                ),
              ElevatedButton(onPressed: onCancel, child: Text('Dismiss')),
              ElevatedButton(onPressed: onConfirm, child: Text('Set Presented')),
            ],
          ),
        ),
      ),
    );
  }
}