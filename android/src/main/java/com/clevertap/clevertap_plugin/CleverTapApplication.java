package com.clevertap.clevertap_plugin;

import android.app.ActivityManager;
import android.content.Context;
import android.util.Log;

import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.android.sdk.pushnotification.CTPushNotificationListener;
import com.clevertap.clevertap_plugin.isolate.CleverTapIsolateBackgroundService;

import java.util.HashMap;
import java.util.List;

import io.flutter.app.FlutterApplication;

public class CleverTapApplication extends FlutterApplication implements CTPushNotificationListener {

    @Override
    public void onCreate() {
        super.onCreate();

        CleverTapContextHolder.setApplicationContext(getApplicationContext());
        CleverTapAPI cleverTapAPI = CleverTapAPI.getDefaultInstance(this);
        if (cleverTapAPI != null) {
            cleverTapAPI.setCTPushNotificationListener(this);
        }

        /*final String packageName = getPackageName();
        if(!isAppOpen(this, packageName)) {
            CleverTapAPI cleverTapAPI = CleverTapAPI.getDefaultInstance(this);
            if (cleverTapAPI != null) {
                cleverTapAPI.setCTPushNotificationListener(this);
            }
        }*/
    }

    @Override
    public void onNotificationClickedPayloadReceived(HashMap<String, Object> payload) {
        //  |-> ---------------------
        //    App in Background/Quit
        //   ------------------------
        Log.i("CTIsolateBGService", "onNotificationClickedPayloadReceived!!");

        CleverTapIsolateBackgroundService.enqueueMessageProcessing(this, payload);
    }

    public static boolean isAppOpen(Context context, String packageName) {
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> runningAppProcesses = activityManager.getRunningAppProcesses();
        for (ActivityManager.RunningAppProcessInfo runningAppProcessInfo : runningAppProcesses) {
            if (runningAppProcessInfo.processName.equals(packageName)) {
                return true;
            }
        }
        return false;
    }
}
