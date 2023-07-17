package com.clevertap.clevertap_plugin.isolate;

import static com.clevertap.clevertap_plugin.CleverTapTypeUtils.MapUtil.toJSONObject;

import android.content.Context;
import android.content.res.AssetManager;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;

import com.clevertap.clevertap_plugin.CleverTapAppContextHolder;
import com.clevertap.clevertap_plugin.CleverTapTypeUtils;

import org.json.JSONObject;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

import io.flutter.embedding.engine.FlutterEngine;
import io.flutter.embedding.engine.FlutterShellArgs;
import io.flutter.embedding.engine.dart.DartExecutor;
import io.flutter.embedding.engine.dart.DartExecutor.DartCallback;
import io.flutter.embedding.engine.loader.FlutterLoader;
import io.flutter.plugin.common.BinaryMessenger;
import io.flutter.plugin.common.MethodCall;
import io.flutter.plugin.common.MethodChannel;
import io.flutter.plugin.common.MethodChannel.MethodCallHandler;
import io.flutter.plugin.common.MethodChannel.Result;
import io.flutter.view.FlutterCallbackInformation;

/**
 * A background executor which handles initializing a background isolate running a
 * callback dispatcher, used to invoke Dart callbacks in background/killed state.
 */
class CleverTapBackgroundIsolateExecutor implements MethodCallHandler {
    private static final String TAG = "CTBGIsolateExecutor";
    private final Context context;
    private final Map<String, Object> messageMap;
    private FlutterEngine backgroundFlutterEngine;

    /**
     * The {@link MethodChannel} that connects the Android side of this plugin with the background
     * Dart isolate that was created by this plugin.
     */
    private MethodChannel backgroundChannel;

    private final AtomicBoolean isCallbackDispatcherReady = new AtomicBoolean(false);

    public CleverTapBackgroundIsolateExecutor(Map<String, Object> messageMap) {
        this.context = CleverTapAppContextHolder.getApplicationContext();
        this.messageMap = messageMap;
    }

    /**
     * Returns true if the onKilledStateNotificationClicked handler is registered in Dart.
     */
    boolean isDartBackgroundHandlerRegistered() {
        return getPluginCallbackHandle() != 0;
    }

    /**
     * Returns true when the background isolate is not started to handle background messages.
     */
    public boolean isNotRunning() {
        return !isCallbackDispatcherReady.get();
    }

    /**
     * Starts running a background Dart isolate within a new {@link FlutterEngine} using a previously
     * used entrypoint.
     */
    public void startBackgroundIsolate() {
        if (isNotRunning()) {
            Log.i(TAG, "startBackgroundIsolate!");
            long callbackHandle = getPluginCallbackHandle();
            if (callbackHandle != 0) {
                startBackgroundIsolate(callbackHandle, null);
            }
        }
    }

    /**
     * Starts running a background Dart isolate within a new {@link FlutterEngine} using a previously
     * used entrypoint.
     *
     * <p>The isolate is configured as follows:
     *
     * <ul>
     *   <li>Bundle Path: {@code FlutterLoader#findAppBundlePath()}.
     *   <li>Entrypoint: The Dart method represented by {@code callbackHandle}.
     *   <li>Run args: none.
     * </ul>
     *
     * <p>Preconditions:
     *
     * <ul>
     *   <li>The given {@code callbackHandle} must correspond to a registered Dart callback. If the
     *       handle does not resolve to a Dart callback then this method does nothing.
     * </ul>
     */
    public void startBackgroundIsolate(long callbackHandle, FlutterShellArgs shellArgs) {
        if (backgroundFlutterEngine != null) {
            Log.e(TAG, "Background isolate already started.");
            return;
        }

        FlutterLoader loader = new FlutterLoader();
        Handler mainHandler = new Handler(Looper.getMainLooper());
        Runnable myRunnable = () -> {
            // startInitialization() must be called on the main thread.
            loader.startInitialization(context);

            loader.ensureInitializationCompleteAsync(context, null, mainHandler, () -> {
                String appBundlePath = loader.findAppBundlePath();
                AssetManager assets = context.getAssets();
                if (isNotRunning()) {
                    if (shellArgs != null) {
                        Log.i(TAG, "Creating background FlutterEngine instance, with args: " + Arrays.toString(shellArgs.toArray()));
                        backgroundFlutterEngine = new FlutterEngine(context, shellArgs.toArray());
                    } else {
                        Log.i(TAG, "Creating background FlutterEngine instance.");
                        backgroundFlutterEngine = new FlutterEngine(context);
                    }
                    // We need to create an instance of `FlutterEngine` before looking up the
                    // callback. If we don't, the callback cache won't be initialized and the
                    // lookup will fail.
                    FlutterCallbackInformation flutterCallback = FlutterCallbackInformation.lookupCallbackInformation(callbackHandle);
                    DartExecutor executor = backgroundFlutterEngine.getDartExecutor();
                    initializeMethodChannel(executor);
                    DartCallback dartCallback = new DartCallback(assets, appBundlePath, flutterCallback);
                    executor.executeDartCallback(dartCallback);
                }
            });
        };
        mainHandler.post(myRunnable);
    }

    private void initializeMethodChannel(BinaryMessenger isolate) {
        // backgroundChannel is the channel responsible for receiving the following messages from
        // the background isolate that was setup by this plugin method call:
        // - "CleverTapCallbackDispatcher#initialized"
        //
        // This channel is also responsible for sending requests from Android to Dart to execute Dart
        // callbacks in the background isolate.
        backgroundChannel = new MethodChannel(isolate, "clevertap_plugin/background_isolate_channel");
        backgroundChannel.setMethodCallHandler(this);
    }

    /**
     * Executes the desired Dart callback in a background Dart isolate.
     *
     * <p>The given {@code getUserCallbackHandle()} should contain a {@code long} extra called
     * "userCallbackHandle", which corresponds to a callback registered with the Dart VM.
     */
    public void executeDartCallbackInBackgroundIsolate(Map<String, Object> messageMap) {
        if (backgroundFlutterEngine == null) {
            Log.i(TAG, "A background message could not be handled in Dart as no onBackgroundMessage handler has been registered.");
            return;
        }

        try {
            JSONObject notificationClickedPayload = toJSONObject(messageMap);
            backgroundChannel.invokeMethod("onKilledStateNotificationClicked", new HashMap<String, Object>() {
                {
                    put("userCallbackHandle", getUserCallbackHandle());
                    put("payload", CleverTapTypeUtils.MapUtil.toMap(notificationClickedPayload));
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Failed to invoke the Dart callback." + e.getLocalizedMessage());
        }
    }

    @Override
    public void onMethodCall(MethodCall call, @NonNull Result result) {
        String method = call.method;
        try {
            if (method.equals("CleverTapCallbackDispatcher#initialized")) {
                // This message is sent by the background method channel as soon as the background isolate
                // is running. From this point forward, the Android side of this plugin can send
                // callback handles through the background method channel, and the Dart side will execute
                // the Dart methods corresponding to those callback handles.
                onInitialized();
                result.success(true);
            } else {
                result.notImplemented();
            }
        } catch (Exception e) {
            result.error("error", "CleverTapBackgroundIsolateExecutor's error: " + e.getMessage(), null);
        }
    }

    /**
     * Called once the Dart isolate(i.e. callbackDispatcher) has finished initializing.
     */
    private void onInitialized() {
        Log.i(TAG, "CleverTapCallbackDispatcher is initialized to receive a user's DartCallback request!");
        isCallbackDispatcherReady.set(true);
        executeDartCallbackInBackgroundIsolate(messageMap);
    }

    /**
     * Get the users registered Dart callback handle for background messaging. Returns 0 if not set.
     */
    private long getUserCallbackHandle() {
        return IsolateHandlePreferences.getUserCallbackHandle(context);
    }

    /**
     * Get the registered Dart callback handle for the messaging plugin. Returns 0 if not set.
     */
    private long getPluginCallbackHandle() {
        return IsolateHandlePreferences.getCallbackDispatcherHandle(context);
    }
}
