package com.clevertap.clevertap_plugin.isolate;

import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.JobIntentService;

import org.json.JSONObject;

import java.util.Map;
import java.util.concurrent.CountDownLatch;

public class CleverTapIsolateBackgroundService extends JobIntentService {
  private static final String TAG = "CTIsolateBGService";
  public static final String PARAM_NOTIFICATION_CLICKED_PAYLOAD = "PARAM_MAP_PAYLOAD";
  private static final int JOB_ID = 2020;

  private static Intent intentToBeHandled = null;

  /** Background Dart execution context. */
  private static CleverTapBackgroundExecutor flutterBackgroundExecutor;

  /**
   * Schedule the message to be handled by the {@link CleverTapIsolateBackgroundService}.
   */
  public static void enqueueMessageProcessing(Context context, Map<String, Object> payloadMap) {
    Intent scheduleIntent = new Intent(context, CleverTapIsolateBackgroundService.class);
    JSONObject payloadJson = new JSONObject(payloadMap);
    scheduleIntent.putExtra(PARAM_NOTIFICATION_CLICKED_PAYLOAD, payloadJson.toString());
    enqueueWork(
            context,
            CleverTapIsolateBackgroundService.class,
            JOB_ID,
            scheduleIntent);
  }

  /**
   * Called once the Dart isolate ({@code flutterBackgroundExecutor}) has finished initializing.
   *
   * <p>Invoked by {@link com.clevertap.clevertap_plugin.isolate.CleverTapBackgroundExecutor} when it receives the {@code
   * CleverTapCallbackDispatcher#initialized} message. Processes the incoming intent that came in while the
   * isolate was starting.
   */
  /* package */
  static void onInitialized() {
    Log.i(TAG, "flutterBackgroundExecutor#executeDartCallbackInBackgroundIsolate!");
    flutterBackgroundExecutor.executeDartCallbackInBackgroundIsolate(intentToBeHandled, null);
    intentToBeHandled = null;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    if (flutterBackgroundExecutor == null) {
      flutterBackgroundExecutor = new CleverTapBackgroundExecutor();
    }
    Log.i(TAG, "startBackgroundIsolate from onCreate!");
    flutterBackgroundExecutor.startBackgroundIsolate();
  }

  /**
   * Executes a Dart callback, as specified within the incoming {@code intent}.
   *
   * <p>Invoked by our {@link JobIntentService} superclass after a call to {@link
   * JobIntentService#enqueueWork(Context, Class, int, Intent);}.
   *
   * <p>If there are no pre-existing callback execution requests, other than the incoming {@code
   * intent}, then the desired Dart callback is invoked immediately.
   *
   * <p>If there are any pre-existing callback requests that have yet to be executed, the incoming
   * {@code intent} is added to the {@link #intentToBeHandled} to be invoked later, after all
   * pre-existing callbacks have been executed.
   */
  @Override
  protected void onHandleWork(@NonNull final Intent intent) {
    Log.i(TAG, "onHandleWork!!");

    if (!flutterBackgroundExecutor.isDartBackgroundHandlerRegistered()) {
      Log.w(
          TAG,
          "A background message could not be handled in Dart as no onBackgroundMessage handler has been registered.");
      return;
    }

    // If we're in the middle of processing queued messages, add the incoming
    // intent to the queue and return.
    intentToBeHandled = intent;
    /*synchronized (messagingQueue) {
      if (flutterBackgroundExecutor.isNotRunning()) {
        Log.i(TAG, "Service has not yet started, messages will be queued.");
        messagingQueue.add(intent);
        return;
      }
    }*/

    Log.i(TAG, "executing CountDownLatch");

    // There were no pre-existing callback requests. Execute the callback
    // specified by the incoming intent.
    final CountDownLatch latch = new CountDownLatch(1);
    new Handler(getMainLooper())
        .post(
            () -> flutterBackgroundExecutor.executeDartCallbackInBackgroundIsolate(intent, latch));

    try {
      latch.await();
      Log.i(TAG, "executing CountDownLatch is finished!");
    } catch (InterruptedException ex) {
      Log.i(TAG, "Exception waiting to execute Dart callback", ex);
    }
  }
}
