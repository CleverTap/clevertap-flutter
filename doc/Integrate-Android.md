## 👨‍💻 Android Integration

- Add the following to your `dependencies` section in `project/build.gradle`

    ```groovy
        dependencies {
                classpath 'com.android.tools.build:gradle:8.3.0'
                classpath 'com.google.gms:google-services:4.4.1' //<--- Mandatory for using Firebase Messaging, skip if not using FCM
            }
    ```

- Add the following to your `dependencies` section in `app/build.gradle`
    ```groovy
            implementation 'com.google.firebase:firebase-messaging:23.4.1'
            implementation 'androidx.core:core:1.3.0'
            implementation 'androidx.fragment:fragment:1.3.6'
            
            //MANDATORY for App Inbox
            implementation 'androidx.appcompat:appcompat:1.3.1'
            implementation 'androidx.recyclerview:recyclerview:1.2.1'
            implementation 'androidx.viewpager:viewpager:1.0.0'
            implementation 'com.google.android.material:material:1.4.0'
            implementation 'com.github.bumptech.glide:glide:4.12.0'
            
            //For CleverTap Android SDK v3.6.4 and above add the following -
            implementation 'com.android.installreferrer:installreferrer:2.2'
            
            //Optional ExoPlayer/AndroidX Media3 Libraries for Audio/Video Inbox Messages. Audio/Video messages will be dropped without these dependencies
            implementation 'com.google.android.exoplayer:exoplayer:2.19.1'
            implementation 'com.google.android.exoplayer:exoplayer-hls:2.19.1'
            implementation 'com.google.android.exoplayer:exoplayer-ui:2.19.1'
    ```

    ###### <a name="migrateExoplayer"></a> Migrating from `Exoplayer` to `AndroidX Media3` (Optional)

    Clevertap Flutter SDK supports `AndroidX Media3` from `v2.5.0+` to replace the deprecated `ExoPlayer` libraries. For migration change the following dependencies.

    |         Old Dependency | New Dependency      |
    |-----------------------:|:--------------------|
    |     `com.google.android.exoplayer:exoplayer:2.19.1` | `androidx.media3:media3-exoplayer:1.1.1`     |
    | `com.google.android.exoplayer:exoplayer-hls:2.19.1` | `androidx.media3:media3-exoplayer-hls:1.1.1` |
    |  `com.google.android.exoplayer:exoplayer-ui:2.19.1` | `androidx.media3:media3-ui:1.1.1`  |



- At the end of the `app/build.gradle` file add the following 

    ```groovy
        apply plugin: 'com.google.gms.google-services' //skip if not using FCM
    ```

- In your app's Android Application class add the following code.

    ```java
        public class MyApplication extends Application {
            @java.lang.Override
            public void onCreate() {
                ActivityLifecycleCallback.register(this); //<--- Add this before super.onCreate()
                super.onCreate();
            }
        }

    ```

#### Note

- To use Header & Footer InApp Notification Templates of CleverTap, change the class from which MainActivity is inherited from `FlutterActivity` to `FlutterFragmentActivity`

    ```java
    public class MainActivity extends FlutterFragmentActivity {
    //FlutterFragmentActivity supports Header & Footer InApp Notification Templates
    }
    ```

- If you do not have an Application class, add this to your `AndroidManifest.xml`

    ```xml
        <application
            android:label="@string/app_name"
            android:icon="@drawable/ic_launcher"
            android:name="com.clevertap.android.sdk.Application"> 
    ```

- Add the following permissions which are needed by the CleverTap SDK

    ```xml
        <!-- Required to allow the app to send events and user profile information -->
        <uses-permission android:name="android.permission.INTERNET"/>
        <!-- Recommended so that CleverTap knows when to attempt a network call -->
        <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    ```

- Add your CleverTap Account ID and Token to your `AndroidManifest.xml`, within the <application></application> tags.

    ```xml
        <meta-data
            android:name="CLEVERTAP_ACCOUNT_ID"
            android:value="Your CleverTap Account ID"/>
        <meta-data
            android:name="CLEVERTAP_TOKEN"
            android:value="Your CleverTap Account Token"/>
        <!-- IMPORTANT: To force use Google AD ID to uniquely identify  users, use the following meta tag. GDPR mandates that if you are using this tag, there is prominent disclousure to your end customer in their application. Read more about GDPR here - https://clevertap.com/blog/in-preparation-of-gdpr-compliance/ -->
        <meta-data
            android:name="CLEVERTAP_USE_GOOGLE_AD_ID"
            android:value="1"/> 
    ```
- To use Push Notifications out of the box using CleverTap, add the following entries to you `AndroidManifest.xml`

    ```xml
    <application>
            ....
            ....
            <service android:name="com.clevertap.android.sdk.pushnotification.fcm.FcmMessageListenerService"
                    android:exported="true">
                <intent-filter>
                    <action android:name="com.google.firebase.MESSAGING_EVENT" />
                </intent-filter>
            </service>

    </application>
    ```

If you're upgrading to CleverTap Flutter SDK v1.2.0 and above, please find the [CHANGELOG related to CleverTap Android SDK here](https://github.com/CleverTap/clevertap-android-sdk/blob/master/docs/CTV4CHANGES.md).
