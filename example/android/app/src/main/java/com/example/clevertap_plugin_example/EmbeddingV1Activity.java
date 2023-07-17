package com.example.clevertap_plugin_example;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.clevertap_plugin.CleverTapPlugin;
import io.flutter.app.FlutterActivity;

public class EmbeddingV1Activity extends FlutterActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        CleverTapPlugin.registerWith(registrarFor("com.clevertap.clevertap_plugin"));
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        // On Android 12 and above, inform the notification click to get the above mentioned callback on dart side.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            CleverTapAPI cleverTapDefaultInstance = CleverTapAPI.getDefaultInstance(this);
            if (cleverTapDefaultInstance != null) {
                cleverTapDefaultInstance.pushNotificationClickedEvent(intent.getExtras());
            }
        }
    }
}
