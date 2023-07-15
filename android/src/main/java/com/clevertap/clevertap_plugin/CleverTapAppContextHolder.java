package com.clevertap.clevertap_plugin;


import android.content.Context;
import android.util.Log;

public class CleverTapAppContextHolder {
  private static final String TAG = "CTAppContextHolder";
  private static Context applicationContext;

  public static Context getApplicationContext() {
    return applicationContext;
  }

  public static void setApplicationContext(Context applicationContext) {
    Log.d(TAG, "received application context.");
    CleverTapAppContextHolder.applicationContext = applicationContext;
  }
}
