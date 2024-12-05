package com.clevertap.clevertap_plugin;

import static com.clevertap.clevertap_plugin.CleverTapPlugin.nativeToDartMethodChannelSet;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.android.sdk.inapp.customtemplates.CustomTemplateContext;
import com.clevertap.android.sdk.inapp.customtemplates.CustomTemplateException;
import com.clevertap.android.sdk.inapp.customtemplates.FunctionPresenter;
import com.clevertap.android.sdk.inapp.customtemplates.TemplatePresenter;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import io.flutter.plugin.common.MethodChannel;

public class ClevertapCustomTemplates {

    private static final String TAG = "ClevertapCustomTemplate";

        private static final TemplatePresenter templatePresenter = new TemplatePresenter() {
            @Override
            public void onPresent(CustomTemplateContext.TemplateContext context) {
                invokeMethodOnUiThread("customTemplatePresent", context.getTemplateName());
            }

            @Override
            public void onClose(CustomTemplateContext.TemplateContext context) {
                invokeMethodOnUiThread("customTemplateClose", context.getTemplateName());
            }
        };

        private static final FunctionPresenter functionPresenter = new FunctionPresenter() {
            @Override
            public void onPresent(CustomTemplateContext.FunctionContext context) {
                invokeMethodOnUiThread("customFunctionPresent", context.getTemplateName());
            }
        };

        public static void registerCustomTemplates(Context context, String... jsonAssets) {
            for (String jsonAsset: jsonAssets) {
                String jsonDefinitions = readAsset(context, jsonAsset);
                CleverTapAPI.registerCustomInAppTemplates(jsonDefinitions, templatePresenter, functionPresenter);
            }
        }

        private static String readAsset(Context context, String asset) {
            try (InputStream assetInputStream = context.getAssets().open(asset);
                 BufferedReader reader = new BufferedReader(new InputStreamReader(assetInputStream, StandardCharsets.UTF_8))) {

                StringBuilder builder = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    builder.append(line);
                }
                return builder.toString();
            } catch (IOException e) {
                throw new CustomTemplateException("Could not read json asset", e);
            }
        }

        // todo
    private static void invokeMethodOnUiThread(final String methodName, final String templateName) {

        for(MethodChannel channel : nativeToDartMethodChannelSet) {
            if (channel != null) {
                Log.d(TAG, "methodChannel in invokeMethodOnUiThread(Map) " + channel);

                new Handler(Looper.getMainLooper()).post(
                        () -> channel.invokeMethod(methodName, templateName)
                );
            }
        }
    }
}
