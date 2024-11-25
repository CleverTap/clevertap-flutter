import 'package:flutter/material.dart';

class FunctionPopup extends StatelessWidget {
  final bool visible;
  final String title;
  final String description;
  final VoidCallback onClose;
  final Function(String) onFileOpen;

  const FunctionPopup({
    required this.visible,
    required this.title,
    required this.description,
    required this.onClose,
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
              SizedBox(height: 10),
              TextField(
                decoration: InputDecoration(
                  hintText: 'File Arg Name',
                ),
                onChanged: (value) => onFileOpen(value),
              ),
              ElevatedButton(onPressed: onClose, child: Text('Close')),
            ],
          ),
        ),
      ),
    );
  }
}