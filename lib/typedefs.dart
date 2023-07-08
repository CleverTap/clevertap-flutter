typedef void CleverTapInAppNotificationDismissedHandler(
    Map<String, dynamic> mapList);
typedef void CleverTapInAppNotificationShowHandler(Map<String, dynamic> map);
typedef void CleverTapInAppNotificationButtonClickedHandler(
    Map<String, dynamic>? mapList);
typedef void CleverTapProfileDidInitializeHandler();
typedef void CleverTapProfileSyncHandler(Map<String, dynamic>? map);
typedef void CleverTapInboxDidInitializeHandler();
typedef void CleverTapInboxMessagesDidUpdateHandler();
typedef void CleverTapInboxNotificationButtonClickedHandler(
    Map<String, dynamic>? mapList);
typedef void CleverTapInboxNotificationMessageClickedHandler(
    Map<String, dynamic>? message, int index, int buttonIndex);
typedef void CleverTapDisplayUnitsLoadedHandler(List<dynamic>? displayUnitList);
typedef void CleverTapFeatureFlagUpdatedHandler();
typedef void CleverTapProductConfigInitializedHandler();
typedef void CleverTapProductConfigFetchedHandler();
typedef void CleverTapProductConfigActivatedHandler();
typedef void CleverTapPushAmpPayloadReceivedHandler(Map<String, dynamic> map);
typedef void CleverTapPushClickedPayloadReceivedHandler(
    Map<String, dynamic> map);
typedef void CleverTapPushPermissionResponseReceivedHandler(bool accepted);
typedef void CleverTapOnVariablesChangedHandler(Map<String, dynamic> variables);
typedef void CleverTapOnValueChangedHandler(Map<String, dynamic> variable);

/// Signature of callback triggered on background isolate when a user taps on a
/// notification from killed state.
typedef void CleverTapOnKilledStateNotificationClickedHandler(
    Map<String, dynamic> map);
