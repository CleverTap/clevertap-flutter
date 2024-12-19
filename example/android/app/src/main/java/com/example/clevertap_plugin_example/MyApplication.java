package com.example.clevertap_plugin_example;

import com.clevertap.android.pushtemplates.PushTemplateNotificationHandler;
import com.clevertap.android.pushtemplates.TemplateRenderer;
import com.clevertap.android.sdk.ActivityLifecycleCallback;
import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.clevertap_plugin.CleverTapApplication;
import com.clevertap.clevertap_plugin.ClevertapCustomTemplates;

public class MyApplication extends CleverTapApplication {

    @java.lang.Override
    public void onCreate() {
        CleverTapAPI.setDebugLevel(3);
        TemplateRenderer.setDebugLevel(3);
        CleverTapAPI.setNotificationHandler(new PushTemplateNotificationHandler());
        ClevertapCustomTemplates.registerCustomTemplates(this, "templates.json");
        ActivityLifecycleCallback.register(this);
        super.onCreate();
    }
}
