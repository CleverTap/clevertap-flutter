import 'package:flutter/material.dart';

class CustomTemplateDialog extends StatelessWidget {
  final String templateName;
  final String data;

  const CustomTemplateDialog({
    Key? key,
    required this.templateName,
    required this.data,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(templateName),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(data),
            const SizedBox(height: 16.0),
            TextField(
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Enter text',
              ),
            ),
            const SizedBox(height: 16.0),
            ElevatedButton(
              onPressed: () {
                print("Button 1 pressed");
              },
              child: const Text('Button 1'),
            ),
            const SizedBox(height: 16.0),
            TextField(
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Enter text',
              ),
            ),
            const SizedBox(height: 16.0),
            ElevatedButton(
              onPressed: () {
                print("Button 2 pressed");
              },
              child: const Text('Button 2'),
            ),
            const SizedBox(height: 16.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: () {
                    print("Button 3 pressed");
                  },
                  child: const Text('Button 3'),
                ),
                ElevatedButton(
                  onPressed: () {
                    print("Button 4 pressed");
                  },
                  child: const Text('Button 4'),
                ),
              ],
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop(); // Close dialog
          },
          child: const Text('Close'),
        ),
      ],
    );
  }
}