import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'in_app_message_popup.dart';
import 'function_popup.dart';

class CustomTemplate extends StatefulWidget {
  @override
  _CustomTemplateState createState() => _CustomTemplateState();
}

class _CustomTemplateState extends State<CustomTemplate> {
  bool isTemplateVisible = false;
  bool isNonVisualFunctionVisible = false;
  bool showWebView = false;
  String templateName = '';
  String templateDescription = '';
  String functionName = '';
  String functionDescription = '';
  String filePath = '';

  @override
  void initState() {
    super.initState();
    // Add listeners and other initialization if required.
  }

  void handleCancel() {
    setState(() {
      isTemplateVisible = false;
      templateName = '';
      templateDescription = '';
    });
    // Handle dismiss logic
  }

  void handleFunctionClose() {
    setState(() {
      isTemplateVisible = true;
      isNonVisualFunctionVisible = false;
      functionDescription = '';
      functionName = '';
    });
  }

  void handleOpenFile(String name) {
    // Logic to open file argument and handle WebView
    setState(() {
      filePath = "File path logic";
      showWebView = true;
    });
  }

  void closeWebView() {
    setState(() {
      showWebView = false;
      filePath = '';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          InAppMessagePopup(
            visible: isTemplateVisible,
            title: templateName,
            description: templateDescription,
            onCancel: handleCancel,
            onConfirm: () {}, // Replace with desired functionality
            onTriggerAction: (actionName) {}, // Handle action
            onFileOpen: handleOpenFile,
          ),
          FunctionPopup(
            visible: isNonVisualFunctionVisible,
            title: functionName,
            description: functionDescription,
            onClose: handleFunctionClose,
            onFileOpen: handleOpenFile,
          ),
          if (showWebView)
            Modal(
              onClose: closeWebView,
              filePath: filePath,
            ),
        ],
      ),
    );
  }
}

class Modal extends StatelessWidget {
  final VoidCallback onClose;
  final String filePath;

  const Modal({required this.onClose, required this.filePath});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.black.withOpacity(0.8),
      child: Column(InAppMessagePopup
        children: [
          Align(
            alignment: Alignment.topRight,
            child: IconButton(
              icon: Icon(Icons.close, color: Colors.red),
              onPressed: onClose,
            ),
          ),
          Expanded(
            child: WebView(
              initialUrl: filePath,
              javascriptMode: JavascriptMode.unrestricted,
            ),
          ),
        ],
      ),
    );
  }
}
