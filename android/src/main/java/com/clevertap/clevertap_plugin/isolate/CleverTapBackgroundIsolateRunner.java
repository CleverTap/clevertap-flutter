package com.clevertap.clevertap_plugin.isolate;

import android.content.Context;
import android.util.Log;

import com.clevertap.clevertap_plugin.CleverTapAppContextHolder;

import java.util.Map;

/**
 * A runner class which abstracts the startup process for a the background isolate.
 */
public class CleverTapBackgroundIsolateRunner {
    private static final String TAG = "CTBGIsolateRunner";

    private static CleverTapBackgroundIsolateExecutor backgroundIsolateExecutor;

    public static void startBackgroundIsolate(Context context, Map<String, Object> messageMap) {
        if (context == null) {
            Log.d(TAG, "Can't start a background isolate with a null appContext!");
            return;
        }

        //persist the app context
        CleverTapAppContextHolder.setApplicationContext(context);

        if (backgroundIsolateExecutor == null) {
            backgroundIsolateExecutor = new CleverTapBackgroundIsolateExecutor(messageMap);
        }

        if (!backgroundIsolateExecutor.isDartBackgroundHandlerRegistered()) {
            Log.w(TAG, "A background message could not be handled in Dart as no onKilledStateNotificationClicked handler has been registered.");
            return;
        }

        backgroundIsolateExecutor.startBackgroundIsolate();
    }
}
