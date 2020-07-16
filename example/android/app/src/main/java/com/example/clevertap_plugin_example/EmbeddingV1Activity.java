package com.example.clevertap_plugin_example;

import android.os.Bundle;
import com.clevertap.clevertap_plugin.CleverTapPlugin;
import io.flutter.app.FlutterActivity;

public class EmbeddingV1Activity extends FlutterActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        CleverTapPlugin.registerWith(registrarFor("com.clevertap.clevertap_plugin"));
    }
}
