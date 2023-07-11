package com.clevertap.clevertap_plugin;


import android.content.Context;
import android.util.Log;

public class CleverTapContextHolder {
  private static Context applicationContext;

  public static Context getApplicationContext() {
    return applicationContext;
  }

  public static void setApplicationContext(Context applicationContext) {
    Log.d("CleverTapContextHolder", "received application context.");
    CleverTapContextHolder.applicationContext = applicationContext;
  }
}
