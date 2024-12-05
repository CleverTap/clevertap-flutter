package com.clevertap.clevertap_plugin;

import android.util.Log;
import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.android.sdk.inapp.customtemplates.CustomTemplateException;
import com.clevertap.android.sdk.pushnotification.CTPushNotificationListener;
import com.clevertap.clevertap_plugin.isolate.CleverTapBackgroundIsolateRunner;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;

import io.flutter.app.FlutterApplication;

public class CleverTapApplication extends FlutterApplication implements CTPushNotificationListener {

    private static final String TAG = "CleverTapApplication";

    @Override
    public void onCreate() {
        super.onCreate();
        CleverTapAPI cleverTapAPI = CleverTapAPI.getDefaultInstance(this);
        if (cleverTapAPI != null) {
            cleverTapAPI.setCTPushNotificationListener(this);
        }
    }

    @Override
    public void onNotificationClickedPayloadReceived(HashMap<String, Object> payload) {
        //Notification is clicked in killed state
        Log.i(TAG, "onNotificationClickedPayloadReceived!");
        CleverTapBackgroundIsolateRunner.startBackgroundIsolate(this, payload);
    }

    protected String[] templateJsonFilePaths() {
        return new String[] { "template.json" };
    }

    private String readAsset(String asset) {
        StringBuilder sb;
        try {
            sb = new StringBuilder();
            InputStream is = getAssets().open(asset);
            BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
            String str;
            while ((str = br.readLine()) != null) {
                sb.append(str);
            }
            br.close();
        } catch (IOException e) {
            throw new CustomTemplateException("Could not read json asset", e);
        }
        return sb.toString();
    }
}
