package com.clevertap.clevertap_plugin_example;

import com.clevertap.android.sdk.ActivityLifecycleCallback;

import io.flutter.app.FlutterApplication;

public class MyApplication extends FlutterApplication {
    @java.lang.Override
    public void onCreate() {
        ActivityLifecycleCallback.register(this);
        super.onCreate();
    }
}
