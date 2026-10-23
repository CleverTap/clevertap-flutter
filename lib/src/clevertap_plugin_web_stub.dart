import 'package:clevertap_plugin/src/typedefs.dart';

class CleverTapPluginWeb {
  static void onValueChanged(
      String name, CleverTapOnValueChangedHandler handler,
      {String? accountId}) {}

  static void onVariablesChanged(CleverTapOnVariablesChangedHandler handler,
      {String? accountId}) {}

  static void addKVDataChangeListener(
      CleverTapOnKVDataChangedHandler handler, {String? accountId}) {}
}
