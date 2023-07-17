package com.clevertap.clevertap_plugin.isolate;

import android.content.Context;
import android.content.SharedPreferences;

public class IsolateHandlePreferences {

    private static final String SHARED_PREFS_FILE_NAME = "clevertap_flutter_plugin";

    private static final String CALLBACK_DISPATCHER_HANDLE_KEY = "com.clevertap.clevertap_plugin.CALLBACK_DISPATCHER_HANDLE_KEY";

    private static final String USER_CALLBACK_HANDLE_KEY = "com.clevertap.clevertap_plugin.CALLBACK_HANDLE_KEY";

    private static SharedPreferences getPreferences(Context context) {
        return context.getSharedPreferences(SHARED_PREFS_FILE_NAME, Context.MODE_PRIVATE);
    }

    /**
     * Sets the Dart callback handle for the Dart methods that are,
     * - responsible for initializing the background Dart isolate, preparing it to receive
     * Dart callback tasks requests.
     * - responsible for handling messaging events in the background.
     */
    public static void saveCallbackKeys(Context context, Long dispatcherCallbackHandle, Long callbackHandle) {
        if (context != null) {
            SharedPreferences.Editor editor = getPreferences(context).edit();
            editor.putLong(CALLBACK_DISPATCHER_HANDLE_KEY, dispatcherCallbackHandle).apply();
            editor.putLong(USER_CALLBACK_HANDLE_KEY, callbackHandle).apply();
        }
    }

    public static Long getCallbackDispatcherHandle(Context context) {
        return getPreferences(context).getLong(CALLBACK_DISPATCHER_HANDLE_KEY, 0);
    }

    public static Long getUserCallbackHandle(Context context) {
        return getPreferences(context).getLong(USER_CALLBACK_HANDLE_KEY, 0);
    }
}
