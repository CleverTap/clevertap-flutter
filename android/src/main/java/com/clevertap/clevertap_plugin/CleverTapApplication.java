package com.clevertap.clevertap_plugin;

import android.util.Log;

import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.android.sdk.pushnotification.CTPushNotificationListener;
import com.clevertap.clevertap_plugin.isolate.CleverTapBackgroundIsolateRunner;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import android.app.Application;

public class CleverTapApplication extends Application implements CTPushNotificationListener {

    private static final String TAG = "CleverTapApplication";

    @Override
    public void onCreate() {
        super.onCreate();
        CleverTapAPI cleverTapAPI = CleverTapAPI.getDefaultInstance(this);
        if (cleverTapAPI != null) {
            cleverTapAPI.setCTPushNotificationListener(this);
        }
        CleverTapPlugin.createLaunchInstances(this, launchConfigs());
    }

    /**
     * Extra accounts to create at app start (see {@link CleverTapPlugin#createLaunchInstances}).
     * Override it to list them; the default is none, which keeps the old behavior.
     */
    protected List<CleverTapLaunchConfig> launchConfigs() {
        return Collections.emptyList();
    }

    @Override
    public void onNotificationClickedPayloadReceived(HashMap<String, Object> payload) {
        //Notification is clicked in killed state
        Log.i(TAG, "onNotificationClickedPayloadReceived!");
        CleverTapBackgroundIsolateRunner.startBackgroundIsolate(this, payload);
    }
}
