import 'package:flutter/material.dart';

class CustomTemplateDialog extends StatelessWidget {
  final String templateName;
  final String data;
  final void Function(String) handleClose;
  final void Function(String) handlePresented;
  final void Function(String, String) handleAction;
  final void Function(String, String) handleFile;
  final void Function(String, String) printArgument;

  const CustomTemplateDialog({
    Key? key,
    required this.templateName,
    required this.data,
    required this.handleClose,
    required this.handlePresented,
    required this.handleAction,
    required this.handleFile,
    required this.printArgument,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final textController = TextEditingController();

    return AlertDialog(
      title: Text(templateName),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(data),
            const SizedBox(height: 16.0),
            TextField(
              controller: textController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Enter text',
              ),
            ),
            const SizedBox(height: 16.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: () {
                    printArgument(templateName, textController.text);
                    print("Print argument pressed");
                  },
                  child: const Text('Print'),
                ),
                ElevatedButton(
                  onPressed: () {
                    handlePresented(templateName);
                    print("Set presented pressed");
                  },
                  child: const Text('Set Presented'),
                ),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: () {
                    handleAction(templateName, textController.text);
                    print("handle action requested");
                  },
                  child: const Text('Action'),
                ),
                ElevatedButton(
                  onPressed: () {
                    handleFile(templateName, textController.text);
                    print("handle file requested");
                  },
                  child: const Text('File'),
                ),
              ],
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            handleClose(templateName);
            Navigator.of(context).pop(); // Close dialog
          },
          child: const Text('Close'),
        ),
      ],
    );
  }
}
