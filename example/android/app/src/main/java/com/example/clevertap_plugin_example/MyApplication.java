package com.example.clevertap_plugin_example;

import com.clevertap.android.sdk.ActivityLifecycleCallback;
import com.clevertap.android.sdk.CleverTapAPI;

import io.flutter.app.FlutterApplication;

public class MyApplication extends FlutterApplication {
    @java.lang.Override
    public void onCreate() {
        CleverTapAPI.setDebugLevel(3);
        ActivityLifecycleCallback.register(this);
        super.onCreate();
    }
}
