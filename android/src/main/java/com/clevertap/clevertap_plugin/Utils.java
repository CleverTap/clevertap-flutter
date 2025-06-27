package com.clevertap.clevertap_plugin;

import android.os.Bundle;
import android.util.Log;

import com.clevertap.android.sdk.CTInboxStyleConfig;
import com.clevertap.android.sdk.UTMDetail;
import com.clevertap.android.sdk.displayunits.model.CleverTapDisplayUnit;
import com.clevertap.android.sdk.events.EventDetail;
import com.clevertap.android.sdk.inapp.CTLocalInApp;
import com.clevertap.android.sdk.inbox.CTInboxMessage;
import com.clevertap.android.sdk.pushnotification.PushType;
import com.clevertap.android.sdk.usereventlogs.UserEventLog;


import java.util.List;
import java.util.Objects;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

public class Utils {

    static Map<String, Object> bundleToMap(Bundle extras) {
        if (extras == null) {
            return null;
        }

        Map<String, Object> map = new HashMap<>();

        Set<String> ks = extras.keySet();
        for (String key : ks) {
            map.put(key, extras.get(key));
        }
        return map;
    }

    static PushType mapToPushType(Map<String, String> pushTypeMap) {
        String type = pushTypeMap.get("type");
        String prefKey = pushTypeMap.get("prefKey");
        String className = pushTypeMap.get("className");
        String messagingSDKClassName = pushTypeMap.get("messagingSDKClassName");

        if (type == null || prefKey == null)
            return null;

        return new PushType(
                type,
                prefKey,
                className,
                messagingSDKClassName);
    }

    @SuppressWarnings("ConstantConditions")
    static HashMap<String, Object> dartMapToProfileMap(Map<String, Object> profileMap) {
        if (profileMap == null) {
            return null;
        }

        HashMap<String, Object> profile = new HashMap<>();
        for (Map.Entry<String, Object> stringObjectEntry : profileMap.entrySet()) {
            try {
                String key = stringObjectEntry.getKey();

                if ("DOB".equals(key)) {
                    String dob = profileMap.get(key).toString();
                    SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy", Locale.ENGLISH);
                    Date date = format.parse(dob);
                    profile.put(key, date);
                } else {
                    profile.put(key, stringObjectEntry.getValue());
                }
            } catch (Throwable t) {
                Log.e("CleverTapError", t.getMessage());
            }
        }
        return profile;
    }

    static ArrayList<Map<String, Object>> displayUnitListToArrayList(ArrayList<CleverTapDisplayUnit> units) {
        ArrayList<Map<String, Object>> displayUnitList = new ArrayList<>();
        if (units != null) {
            for (CleverTapDisplayUnit unit : units) {
                displayUnitList.add(Utils.jsonToMap(unit.getJsonObject()));
            }
        }
        return displayUnitList;
    }

    @Deprecated
    static Map<String, Object> eventDetailToMap(EventDetail eventDetail) {
        Map<String, Object> eventDetailMap = new HashMap<>();
        if (eventDetail != null) {
            eventDetailMap.put("name", eventDetail.getName());
            eventDetailMap.put("firstTime", eventDetail.getFirstTime());
            eventDetailMap.put("lastTime", eventDetail.getLastTime());
            eventDetailMap.put("count", eventDetail.getCount());
        }

        return eventDetailMap;
    }

    static Map<String, Object> eventLogToMap(UserEventLog eventLog) {
        Map<String, Object> eventLogMap = new HashMap<>();

        if (eventLog != null) {
            eventLogMap.put("eventName", eventLog.getEventName());
            eventLogMap.put("normalizedEventName", eventLog.getNormalizedEventName());
            eventLogMap.put("firstTime", eventLog.getFirstTs());
            eventLogMap.put("lastTime", eventLog.getLastTs());
            eventLogMap.put("count", eventLog.getCountOfEvents());
            eventLogMap.put("deviceID", eventLog.getDeviceID());
        }

        return eventLogMap;
    }

    static Map<String, Object> historyEventLogToMap(Map<String, UserEventLog> history) {
        Map<String, Object> eventLogMap = new HashMap<>();
        if (history != null) {
            for (String key : history.keySet()) {
                eventLogMap.put(key, eventLogToMap(history.get(key)));
            }
        }
        return eventLogMap;
    }

    @Deprecated
    static Map<String, Object> historyEventDetailToMap(Map<String, EventDetail> history) {
        Map<String, Object> eventDetailMap = new HashMap<>();
        if (history != null) {
            for (String key : history.keySet()) {
                eventDetailMap.put(key, eventDetailToMap(history.get(key)));
            }
        }
        return eventDetailMap;
    }

    static ArrayList<Map<String, Object>> inboxMessageListToArrayList(
            ArrayList<CTInboxMessage> inboxMessageArrayList) {
        ArrayList<Map<String, Object>> inboxMessageList = new ArrayList<>();
        if (inboxMessageArrayList != null) {
            for (CTInboxMessage message : inboxMessageArrayList) {
                inboxMessageList.add(Utils.jsonToMap(message.getData()));
            }
        }
        return inboxMessageList;
    }

    /**
     * Converts the entire Json(includes nested objects/array) into a Dart compatible Map type.
     * @param json - target json
     * @return - the converted Dart compatible Map type
     */
    public static Map<String, Object> jsonToMap(JSONObject json) {
        Map<String, Object> map = new HashMap<>();
        Iterator<String> keys = json.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            Object value;
            try {
                value = json.get(key);
                if (value instanceof JSONArray) {
                    value = jsonArrayToList((JSONArray) value);
                } else if (value instanceof JSONObject) {
                    value = jsonToMap((JSONObject) value);
                }
                map.put(key, value);
            } catch (JSONException | NullPointerException e) {
                Log.e("CleverTapError", "Map to JSON error", e);
                return map;
            }
        }
        return map;
    }

    private static List<Object> jsonArrayToList(JSONArray array) throws JSONException {
        List<Object> list = new ArrayList<>();
        for (int i = 0; i < array.length(); i++) {
            Object value = array.get(i);
            if (value instanceof JSONArray) {
                value = jsonArrayToList((JSONArray) value);
            } else if (value instanceof JSONObject) {
                value = jsonToMap((JSONObject) value);
            }
            list.add(value);
        }
        return list;
    }


    @SuppressWarnings("rawtypes")
    static Bundle jsonToBundle(JSONObject jsonObject) throws JSONException {
        Bundle bundle = new Bundle();
        if (jsonObject != null) {
            Iterator iter = jsonObject.keys();
            while (iter.hasNext()) {
                String key = (String) iter.next();
                String value = jsonObject.getString(key);
                bundle.putString(key, value);
            }
        }
        return bundle;
    }

    @SuppressWarnings("rawtypes")
    static CTInboxStyleConfig jsonToStyleConfig(JSONObject styleConfigJson) {
        CTInboxStyleConfig styleConfig = new CTInboxStyleConfig();
        try {
            Iterator iterator = styleConfigJson.keys();
            while (iterator.hasNext()) {
                String styleConfigKey = iterator.next().toString();
                if ("navBarTitle".equals(styleConfigKey)) {
                    String navBarTitle = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setNavBarTitle(navBarTitle);
                }
                if ("navBarTitleColor".equals(styleConfigKey)) {
                    String navBarTitleColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setNavBarTitleColor(navBarTitleColor);
                }
                if ("navBarColor".equals(styleConfigKey)) {
                    String navBarColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setNavBarColor(navBarColor);
                }
                if ("inboxBackgroundColor".equals(styleConfigKey)) {
                    String inboxBackgroundColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setInboxBackgroundColor(inboxBackgroundColor);
                }
                if ("backButtonColor".equals(styleConfigKey)) {
                    String backButtonColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setBackButtonColor(backButtonColor);
                }
                if ("unselectedTabColor".equals(styleConfigKey)) {
                    String unselectedTabColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setUnselectedTabColor(unselectedTabColor);
                }
                if ("selectedTabColor".equals(styleConfigKey)) {
                    String selectedTabColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setSelectedTabColor(selectedTabColor);
                }
                if ("selectedTabIndicatorColor".equals(styleConfigKey)) {
                    String selectedTabIndicatorColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setSelectedTabIndicatorColor(selectedTabIndicatorColor);
                }
                if ("tabBackgroundColor".equals(styleConfigKey)) {
                    String tabBackgroundColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setTabBackgroundColor(tabBackgroundColor);
                }
                if ("noMessageText".equals(styleConfigKey)) {
                    String noMessageText = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setNoMessageViewText(noMessageText);
                }
                if ("noMessageTextColor".equals(styleConfigKey)) {
                    String noMessageTextColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setNoMessageViewTextColor(noMessageTextColor);
                }
                if ("firstTabTitle".equals(styleConfigKey)) {
                    String firstTabTitle = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setFirstTabTitle(firstTabTitle);
                }
                if ("tabs".equals(styleConfigKey)) {
                    try {
                        ArrayList<String> tabsList = arrayListStringFromJSONArray(
                                styleConfigJson.getJSONArray(styleConfigKey));
                        styleConfig.setTabs(tabsList);
                    } catch (Throwable t) {
                        Log.e("CleverTapError", "Unhandled JSONArray from styleConfig JSONObject");
                    }
                }
            }
            return styleConfig;
        } catch (JSONException e) {
            Log.e("CleverTapError", "JSON to CTInboxStyleConfig error", e);
            return styleConfig;
        }
    }

    static JSONObject localInAppFromMap(Map<String, Object> objectMap) {
        if (objectMap == null) {
            Log.e("CleverTapError", "LocalInApp map is null or empty");
            return null;
        }
        CTLocalInApp.InAppType inAppType = null;
        String titleText = null, messageText = null, positiveBtnText = null,
            negativeBtnText = null, backgroundColor = null, btnBorderColor = null,
            titleTextColor = null, messageTextColor = null,
            btnTextColor = null, imageUrl = null, btnBackgroundColor = null, btnBorderRadius = null, altText = null;
        boolean fallbackToSettings = false, followDeviceOrientation = false;

        for (Map.Entry<String, Object> entry : objectMap.entrySet()) {
            try {
                String configKey = entry.getKey();
                if ("inAppType".equals(configKey)) {
                    inAppType = inAppTypeFromString((String) entry.getValue());
                }
                if ("titleText".equals(configKey)) {
                    titleText = (String) entry.getValue();
                }
                if ("messageText".equals(configKey)) {
                    messageText = (String) entry.getValue();
                }
                if ("followDeviceOrientation".equals(configKey)) {
                    followDeviceOrientation = (Boolean) entry.getValue();
                }
                if ("positiveBtnText".equals(configKey)) {
                    positiveBtnText = (String) entry.getValue();
                }
                if ("negativeBtnText".equals(configKey)) {
                    negativeBtnText = (String) entry.getValue();
                }
                if ("fallbackToSettings".equals(configKey)) {
                    fallbackToSettings = (Boolean) entry.getValue();
                }
                if ("backgroundColor".equals(configKey)) {
                    backgroundColor = (String) entry.getValue();
                }
                if ("btnBorderColor".equals(configKey)) {
                    btnBorderColor = (String) entry.getValue();
                }
                if ("titleTextColor".equals(configKey)) {
                    titleTextColor = (String) entry.getValue();
                }
                if ("messageTextColor".equals(configKey)) {
                    messageTextColor = (String) entry.getValue();
                }
                if ("btnTextColor".equals(configKey)) {
                    btnTextColor = (String) entry.getValue();
                }
                if ("imageUrl".equals(configKey)) {
                    imageUrl = (String) entry.getValue();
                }
                if ("altText".equals(configKey)) {
                    altText = (String) entry.getValue();
                }
                if ("btnBackgroundColor".equals(configKey)) {
                    btnBackgroundColor = (String) entry.getValue();
                }
                if ("btnBorderRadius".equals(configKey)) {
                    btnBorderRadius = (String) entry.getValue();
                }
            } catch (Throwable t) {
                Log.e("CleverTapError", "Invalid parameters in LocalInApp config"
                        + t.getLocalizedMessage());
                return null;
            }
        }


        //creates the builder instance of localInApp with all the required parameters
        CTLocalInApp.Builder.Builder6 builderWithRequiredParams = getLocalInAppBuilderWithRequiredParam(
                inAppType, titleText, messageText, followDeviceOrientation, positiveBtnText,
                negativeBtnText
        );

        //adds the optional parameters to the builder instance
        if (backgroundColor != null) {
            builderWithRequiredParams.setBackgroundColor(backgroundColor);
        }
        if (btnBorderColor != null) {
            builderWithRequiredParams.setBtnBorderColor(btnBorderColor);
        }
        if (titleTextColor != null) {
            builderWithRequiredParams.setTitleTextColor(titleTextColor);
        }
        if (messageTextColor != null) {
            builderWithRequiredParams.setMessageTextColor(messageTextColor);
        }
        if (btnTextColor != null) {
            builderWithRequiredParams.setBtnTextColor(btnTextColor);
        }
        if (imageUrl != null) {
            builderWithRequiredParams.setImageUrl(imageUrl, altText);
        }
        if (btnBackgroundColor != null) {
            builderWithRequiredParams.setBtnBackgroundColor(btnBackgroundColor);
        }
        if (btnBorderRadius != null) {
            builderWithRequiredParams.setBtnBorderRadius(btnBorderRadius);
        }
        builderWithRequiredParams.setFallbackToSettings(fallbackToSettings);

        JSONObject localInAppConfig = builderWithRequiredParams.build();
        Log.i("CTLocalInAppConfig", "LocalInAppConfig for push primer prompt: "
                + localInAppConfig);
        return localInAppConfig;
    }

    /**
     * Creates an instance of the {@link CTLocalInApp.Builder.Builder6} with the required parameters.
     *
     * @return the {@link CTLocalInApp.Builder.Builder6} instance
     */
    private static CTLocalInApp.Builder.Builder6
    getLocalInAppBuilderWithRequiredParam(CTLocalInApp.InAppType inAppType,
                                          String titleText, String messageText,
                                          boolean followDeviceOrientation, String positiveBtnText,
                                          String negativeBtnText) {

        //throws exception if any of the required parameter is missing
        if (inAppType == null || titleText == null || messageText == null || positiveBtnText == null
                || negativeBtnText == null) {
            throw new IllegalArgumentException("Mandatory parameters are missing for LocalInApp config");
        }

        CTLocalInApp.Builder builder = CTLocalInApp.builder();
        return builder.setInAppType(inAppType)
                .setTitleText(titleText)
                .setMessageText(messageText)
                .followDeviceOrientation(followDeviceOrientation)
                .setPositiveBtnText(positiveBtnText)
                .setNegativeBtnText(negativeBtnText);
    }

    private static CTLocalInApp.InAppType inAppTypeFromString(String inAppType) {
        if (inAppType == null) {
            return null;
        }
        switch (inAppType) {
            case "half-interstitial":
                return CTLocalInApp.InAppType.HALF_INTERSTITIAL;
            case "alert":
                return CTLocalInApp.InAppType.ALERT;
            default:
                return null;
        }
    }


    static JSONObject mapToJSONObject(Map<String, Object> map) {
        JSONObject json = new JSONObject();

        if (map != null) {
            for (String key : map.keySet()) {
                try {
                    if (!(map.get(key) instanceof ArrayList)) {
                        json.put(key, map.get(key));
                    } else {
                        if (map.get(key) != null && ((ArrayList<?>) Objects.requireNonNull(map.get(key))).size() > 0) {
                            JSONArray tabArray = new JSONArray();
                            for (int i = 0; i < ((ArrayList<?>) Objects.requireNonNull(map.get(key))).size(); i++) {
                                tabArray.put(((ArrayList<?>) Objects.requireNonNull(map.get(key))).get(i));
                            }
                            json.put(key, tabArray);
                        }
                    }
                } catch (JSONException | NullPointerException e) {
                    Log.e("CleverTapError", "Map to JSON error", e);
                }
            }
        }

        return json;
    }

    @SuppressWarnings("rawtypes")
    static Bundle stringToBundle(String content) throws JSONException {
        JSONObject jsonObject = new JSONObject(content);
        Bundle bundle = new Bundle();
        Iterator iter = jsonObject.keys();
        while (iter.hasNext()) {
            String key = (String) iter.next();
            String value = jsonObject.getString(key);
            bundle.putString(key, value);
        }
        return bundle;
    }

    static Map<String, Object> utmDetailsToMap(UTMDetail details) {
        Map<String, Object> ret = new HashMap<>();
        if (details != null) {
            ret.put("campaign", details.getCampaign());
            ret.put("source", details.getSource());
            ret.put("medium", details.getMedium());
        }
        return ret;
    }

    static Bundle mapToBundle(HashMap<String, Object> hashMap) {
        Bundle bundle = new Bundle();
        for (Map.Entry<String, Object> entry : hashMap.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            if(value != null) {
                bundle.putString(key, value.toString());
            }
        }
        return bundle;
    }

    private static ArrayList<String> arrayListStringFromJSONArray(JSONArray jsonArray) {
        ArrayList<String> tabList = new ArrayList<>();
        try {
            for (int i = 0; i < jsonArray.length(); i++) {
                tabList.add(jsonArray.getString(i));
            }
            return tabList;
        } catch (JSONException e) {
            Log.e("CleverTapError", "JSONArray to ArrayList of Tabs error", e);
            return tabList;
        }
    }
}
