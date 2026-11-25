package com.clevertap.clevertap_plugin;

import android.app.Activity;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;

import com.clevertap.android.sdk.CleverTapAPI;

import java.lang.ref.WeakReference;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

import io.flutter.embedding.engine.plugins.FlutterPlugin;
import io.flutter.embedding.engine.plugins.activity.ActivityAware;
import io.flutter.embedding.engine.plugins.activity.ActivityPluginBinding;
import io.flutter.plugin.common.BinaryMessenger;
import io.flutter.plugin.common.MethodChannel;

/**
 * CleverTapPlugin
 */
public class CleverTapPlugin implements ActivityAware, FlutterPlugin {

    private static final String TAG = "CleverTapPlugin";
    private static final long FLUSH_DELAY = 5000L;

    public static WeakReference<Activity> activity;

    private MethodChannel dartToNativeMethodChannel;

    private MethodChannel lastNativeToDartMethodChannel;

    private Context context;

    private DartToNativePlatformCommunicator dartToNativePlatformCommunicator;

    // Thread-safe on purpose: engines are added/removed on the main thread (onAttachedToEngine /
    // onDetachedFromEngine) while invokeMethodOnUiThread loops over the set on whatever thread
    // emits - a HashSet there threw ConcurrentModificationException and the event was lost for
    // every engine. Each loop walks a snapshot, and writes (engine attach/detach) are rare.
    public static final Set<MethodChannel> nativeToDartMethodChannelSet = new CopyOnWriteArraySet<>();

    private static final Handler mainHandler = new Handler(Looper.getMainLooper());

    private final Runnable resetBufferRunnable = () -> {
        CleverTapEventEmitter.resetAllBuffers(false);
    };

    public CleverTapPlugin() {
    }

    @Override
    public void onAttachedToActivity(@NonNull ActivityPluginBinding binding) {
        Log.d(TAG, "onAttachedToActivity: " + binding + " activity " + binding.getActivity());
        activity = new WeakReference<>(binding.getActivity());
        mainHandler.postDelayed(resetBufferRunnable, FLUSH_DELAY);
    }

    @Override
    public void onDetachedFromActivity() {
        Log.d(TAG, "onDetachedFromActivity");
        mainHandler.removeCallbacks(resetBufferRunnable);
        if (activity != null) {
            activity.clear();
            activity = null;
        }
    }

    @SuppressWarnings("ConstantConditions")
    @Override
    public void onReattachedToActivityForConfigChanges(@NonNull ActivityPluginBinding binding) {
        Log.d(TAG, "onReattachedToActivityForConfigChanges: " + binding);
        activity = new WeakReference<>(binding.getActivity());
    }

    @Override
    public void onDetachedFromActivityForConfigChanges() {
        Log.d(TAG, "onDetachedFromActivityForConfigChanges");
        if (activity != null) {
            activity.clear();
            activity = null;
        }
    }

    @Override
    public void onAttachedToEngine(@NonNull FlutterPluginBinding binding) {
        Log.d(TAG, "onAttachedToEngine " + binding);
        setupPlugin(binding.getApplicationContext(), binding.getBinaryMessenger());
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
            BinaryMessenger messenger
    ) {
        this.dartToNativeMethodChannel = getMethodChannel("clevertap_plugin/dart_to_native", messenger);

        // lastNativeToDartMethodChannel is added to a set and not kept as a static field to ensure callbacks work when a background isolate is spawned
        // Background Isolates are spawned by several libraries like flutter_workmanager and flutter_firebasemessaging
        lastNativeToDartMethodChannel = getMethodChannel("clevertap_plugin/native_to_dart", messenger);
        nativeToDartMethodChannelSet.add(lastNativeToDartMethodChannel);

        this.context = context.getApplicationContext();
        CleverTapAPI cleverTapAPI = CleverTapInstanceRegistry.resolve(this.context, null);
        this.dartToNativePlatformCommunicator = new DartToNativePlatformCommunicator(context, cleverTapAPI);
        this.dartToNativeMethodChannel.setMethodCallHandler(dartToNativePlatformCommunicator);
        if (cleverTapAPI != null) {
            CleverTapListenerProxy.attachToInstance(cleverTapAPI);
            cleverTapAPI.setLibrary("Flutter");
        }
    }

    private MethodChannel getMethodChannel(
            String channelName,
            BinaryMessenger messenger
    ) {
        //V2 setup
        return new MethodChannel(messenger, channelName);
    }

    public static void invokeMethodOnUiThread(final String methodName, final Object obj) {
        for (MethodChannel channel : nativeToDartMethodChannelSet) {
            if (channel != null) {
                Log.d(TAG, "methodChannel in invokeMethodOnUiThread(Object) " + channel);
                runOnMainThread(() -> channel.invokeMethod(methodName, obj));
            }
        }
    }

    /**
     * Creates extra CleverTap accounts at app start, so each one's push is shown and its tap is
     * handled even when the app was killed. Call it in {@code Application.onCreate()}, after
     * {@code ClevertapCustomTemplates.registerCustomTemplates} if you use custom templates. Dart then
     * uses {@code CleverTapPlugin.getInstance(accountId)}.
     *
     * <pre>
     * CleverTapInstanceConfig insurance = CleverTapInstanceConfig.createInstance(this, "INS-ID", "INS-TOKEN", "eu1");
     * CleverTapPlugin.createLaunchInstances(this, Collections.singletonList(new CleverTapLaunchConfig(insurance)));
     * </pre>
     *
     * One account that fails (for example a bad template definition) is logged and skipped; the
     * others are still created. Apps that extend {@link CleverTapApplication} can override
     * {@code launchConfigs()} instead.
     */
    public static void createLaunchInstances(@NonNull Context context, List<CleverTapLaunchConfig> launchConfigs) {
        if (context == null || launchConfigs == null || launchConfigs.isEmpty()) {
            return;
        }
        final Context appContext = context.getApplicationContext() != null ? context.getApplicationContext() : context;
        if (Looper.getMainLooper() != Looper.myLooper()) {
            // The SDK creates accounts with an unlocked get-new-put and re-enters it on main, so
            // creating off main can build two objects for one account (Phase 2). Moving the work to
            // main avoids that, but the accounts are then not ready before the first activity.
            Log.e(TAG, "createLaunchInstances must be called on the main thread, in Application.onCreate(). "
                    + "Moving it to the main thread; a push that opened the app may be missed.");
            mainHandler.post(() -> CleverTapLaunchInstances.INSTANCE.create(appContext, launchConfigs));
            return;
        }
        CleverTapLaunchInstances.INSTANCE.create(appContext, launchConfigs);
    }

    public static void runOnMainThread(final Runnable runnable) {
        try {
            if (Looper.getMainLooper() == Looper.myLooper()) {
                runnable.run();
            } else {
                mainHandler.post(runnable);
            }
        } catch (Exception e) {
            Log.e(TAG, "Exception while running on main thread - ");
            e.printStackTrace();
        }
    }
}
