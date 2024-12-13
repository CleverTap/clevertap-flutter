package com.clevertap.clevertap_plugin;

import android.app.Activity;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;

import com.clevertap.android.sdk.CleverTapAPI;

import java.lang.ref.WeakReference;
import java.util.HashSet;
import java.util.Set;

import io.flutter.embedding.engine.plugins.FlutterPlugin;
import io.flutter.embedding.engine.plugins.activity.ActivityAware;
import io.flutter.embedding.engine.plugins.activity.ActivityPluginBinding;
import io.flutter.plugin.common.BinaryMessenger;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugin.common.PluginRegistry.Registrar;

/**
 * CleverTapPlugin
 */
public class CleverTapPlugin implements ActivityAware, FlutterPlugin {

    private static final String TAG = "CleverTapPlugin";

    public static WeakReference<Activity> activity;

    private MethodChannel dartToNativeMethodChannel;

    private MethodChannel lastNativeToDartMethodChannel;

    private Context context;

    private DartToNativePlatformCommunicator dartToNativePlatformCommunicator;

    public static final Set<MethodChannel> nativeToDartMethodChannelSet = new HashSet<>();

    private static final Handler mainHandler = new Handler(Looper.getMainLooper());

    /**
     * Plugin registration.
     */
    public static void registerWith(Registrar registrar) {
        CleverTapPlugin plugin = new CleverTapPlugin();
        plugin.setupPlugin(registrar.context(), null, registrar);
        activity = new WeakReference<>((Activity) registrar.activeContext());
    }

    public CleverTapPlugin() {
    }

    @Override
    public void onAttachedToActivity(@NonNull ActivityPluginBinding binding) {
        activity = new WeakReference<>(binding.getActivity());
        CleverTapEventEmitter.disableAllAndFlush();
    }

    @Override
    public void onDetachedFromActivity() {
        activity.clear();
        activity = null;
        CleverTapEventEmitter.enableAll();
    }

    @SuppressWarnings("ConstantConditions")
    @Override
    public void onReattachedToActivityForConfigChanges(@NonNull ActivityPluginBinding binding) {
        activity = new WeakReference<>(binding.getActivity());
        CleverTapEventEmitter.disableAllAndFlush();
    }

    @Override
    public void onDetachedFromActivityForConfigChanges() {
        CleverTapEventEmitter.enableAll();
        activity.clear();
        activity = null;
    }

    @Override
    public void onAttachedToEngine(@NonNull FlutterPluginBinding binding) {
        Log.d(TAG, "onAttachedToEngine " + binding);
        setupPlugin(binding.getApplicationContext(), binding.getBinaryMessenger(), null);
    }

    @Override
    public void onDetachedFromEngine(@NonNull FlutterPluginBinding binding) {
        Log.d(TAG, "onDetachedFromEngine " + binding);
        dartToNativePlatformCommunicator = null;
        nativeToDartMethodChannelSet.remove(this.lastNativeToDartMethodChannel);
        lastNativeToDartMethodChannel = null;
        dartToNativeMethodChannel = null;
        context = null;
    }

    private void setupPlugin(
            Context context,
            BinaryMessenger messenger,
            Registrar registrar
    ) {
        this.dartToNativeMethodChannel = getMethodChannel("clevertap_plugin/dart_to_native", messenger, registrar);

        // lastNativeToDartMethodChannel is added to a set and not kept as a static field to ensure callbacks work when a background isolate is spawned
        // Background Isolates are spawned by several libraries like flutter_workmanager and flutter_firebasemessaging
        lastNativeToDartMethodChannel = getMethodChannel("clevertap_plugin/native_to_dart", messenger, registrar);
        nativeToDartMethodChannelSet.add(lastNativeToDartMethodChannel);

        this.context = context.getApplicationContext();
        CleverTapAPI cleverTapAPI = CleverTapAPI.getDefaultInstance(this.context);
        this.dartToNativePlatformCommunicator = new DartToNativePlatformCommunicator(context, cleverTapAPI);
        this.dartToNativeMethodChannel.setMethodCallHandler(dartToNativePlatformCommunicator);
        if (cleverTapAPI != null) {
            CleverTapListenerProxy.INSTANCE.attachToInstance(cleverTapAPI);
            cleverTapAPI.setLibrary("Flutter");
        }
    }

    private MethodChannel getMethodChannel(
            String channelName,
            BinaryMessenger messenger,
            Registrar registrar
    ) {
        if (registrar != null) {
            //V1 setup
            return new MethodChannel(registrar.messenger(), channelName);
        } else {
            //V2 setup
            return new MethodChannel(messenger, channelName);
        }
    }

    public static void invokeMethodOnUiThread(final String methodName, final String cleverTapID) {
        Log.d(TAG, "methodChannelSet in invokeMethodOnUiThread(String) is of size " + nativeToDartMethodChannelSet.size());

        for (MethodChannel channel : nativeToDartMethodChannelSet) {
            if (channel != null) {
                Log.d(TAG, "methodChannelSet in invokeMethodOnUiThread(String) " + channel);
                runOnMainThread(() -> {
                    if (!cleverTapID.isEmpty()) {
                        channel.invokeMethod(methodName, cleverTapID);
                    } else {
                        channel.invokeMethod(methodName, null);
                    }
                });
            }
        }
    }

    public static void invokeMethodOnUiThread(final String methodName, final Object obj) {
        Log.d(TAG, "methodChannelSet in invokeMethodOnUiThread(Map) is of size " + nativeToDartMethodChannelSet.size());

        for (MethodChannel channel : nativeToDartMethodChannelSet) {
            if (channel != null) {
                Log.d(TAG, "methodChannel in invokeMethodOnUiThread(Object) " + channel);
                runOnMainThread(() -> channel.invokeMethod(methodName, obj));
            }
        }
    }

    public static void runOnMainThread(final Runnable runnable) {
        try {
            mainHandler.post(runnable);
        } catch (Exception e) {
            Log.e(TAG, "Exception while running on main thread - ");
            e.printStackTrace();
        }
    }
}
