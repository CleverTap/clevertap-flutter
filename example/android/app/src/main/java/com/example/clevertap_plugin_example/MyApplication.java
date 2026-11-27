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

    // Multi-instance: create TEST-ACC-B at app start, so its push is shown and its tap reaches it
    // even when the app was killed. Dart then uses CleverTapPlugin.getInstance('TEST-ACC-B').
    // Uncomment to try it; the "Create Instance B" button then logs that B already exists.
    //
    // @java.lang.Override
    // protected java.util.List<com.clevertap.clevertap_plugin.CleverTapLaunchConfig> launchConfigs() {
    //     com.clevertap.android.sdk.CleverTapInstanceConfig b =
    //             com.clevertap.android.sdk.CleverTapInstanceConfig.createInstance(this, "TEST-ACC-B", "TEST-TOKEN-B", "eu1");
    //     return java.util.Collections.singletonList(new com.clevertap.clevertap_plugin.CleverTapLaunchConfig(b));
    // }
}
