package com.clevertap.clevertap_plugin.isolate;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.Nullable;

import io.flutter.view.FlutterCallbackInformation;

//TODO: make it singleton
public class IsolateHandlePreferences {

  private static final String SHARED_PREFS_FILE_NAME = "clevertap_flutter_plugin";

  private final String CALLBACK_DISPATCHER_HANDLE_KEY =
      "com.clevertap.clevertap_plugin.CALLBACK_DISPATCHER_HANDLE_KEY";

  private final String USER_CALLBACK_HANDLE_KEY =
      "com.clevertap.clevertap_plugin.CALLBACK_HANDLE_KEY";

  public IsolateHandlePreferences(Context context) {
    this.context = context;
  }

  private final Context context;

  private SharedPreferences get() {
    return context.getSharedPreferences(SHARED_PREFS_FILE_NAME, Context.MODE_PRIVATE);
  }

  /**
   * Sets the Dart callback handle for the Dart methods that are,
   * - responsible for initializing the
   *   background Dart isolate, preparing it to receive Dart callback tasks requests.
   * - responsible for handling messaging events in the background.
   */
  public void saveCallbackKeys(Long dispatcherCallbackHandle, Long callbackHandle) {
    get().edit().putLong(CALLBACK_DISPATCHER_HANDLE_KEY, dispatcherCallbackHandle).apply();
    get().edit().putLong(USER_CALLBACK_HANDLE_KEY, callbackHandle).apply();
  }

  public Long getCallbackDispatcherHandle() {
    return get().getLong(CALLBACK_DISPATCHER_HANDLE_KEY, 0);
  }

  public Long getUserCallbackHandle() {
    return get().getLong(USER_CALLBACK_HANDLE_KEY, 0);
  }

  @Nullable
  public FlutterCallbackInformation lookupDispatcherHandle() {
    return FlutterCallbackInformation.lookupCallbackInformation(getCallbackDispatcherHandle());
  }
}
