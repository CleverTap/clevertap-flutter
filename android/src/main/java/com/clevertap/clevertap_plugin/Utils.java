package com.clevertap.clevertap_plugin;

import android.util.Log;

import com.clevertap.android.sdk.CTInboxStyleConfig;
import com.clevertap.android.sdk.EventDetail;
import com.clevertap.android.sdk.UTMDetail;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class Utils {
    static Map<String,Object> eventDetailToMap(EventDetail eventDetail){
        Map<String,Object> eventDetailMap = new HashMap<>();
        if(eventDetail != null){
            eventDetailMap.put("name", eventDetail.getName());
            eventDetailMap.put("firstTime", eventDetail.getFirstTime());
            eventDetailMap.put("lastTime", eventDetail.getLastTime());
            eventDetailMap.put("count", eventDetail.getCount());
        }

        return eventDetailMap;
    }

    static Map<String,Object> historyEventDetailToMap(Map<String, EventDetail> history){
        Map<String,Object> eventDetailMap = new HashMap<>();
        if(history != null) {
            for (String key : history.keySet()) {
                eventDetailMap.put(key, eventDetailToMap(history.get(key)));
            }
        }
        return eventDetailMap;
    }

    static Map<String,Object> utmDetailsToMap(UTMDetail details) {
        Map<String,Object> ret = new HashMap<String,Object>();
        if(details != null) {
            ret.put("campaign", details.getCampaign());
            ret.put("source", details.getSource());
            ret.put("medium", details.getMedium());
        }
        return ret;
    }

    static JSONObject mapToJSONObject(Map<String, Object> map) {
        JSONObject json = new JSONObject();

        if (map != null) {
            for (String key : map.keySet()) {
                try {
                    json.put(key, map.get(key));
                } catch (JSONException e) {
                    Log.e("CleverTapError", "Map to JSON error", e);
                }
            }
        }

        return json;
    }

    static Map<String,Object> jsonObjectToMap(JSONObject jsonObject) {
        Map<String,Object> stringObjectMap = new HashMap<>();

        try{
            if(jsonObject != null){
                Iterator iterator = jsonObject.keys();
                while (iterator.hasNext()){
                    stringObjectMap.put(iterator.next().toString(),jsonObject.get(iterator.next().toString()));
                }
            }
        }catch (JSONException e){
            Log.e("CleverTapError", "JSON to Map error", e);
            return stringObjectMap;
        }

        return stringObjectMap;
    }

    static CTInboxStyleConfig jsonToStyleConfig(JSONObject styleConfigJson){
        CTInboxStyleConfig styleConfig = new CTInboxStyleConfig();
        try{
            Iterator iterator = styleConfigJson.keys();
            while(iterator.hasNext()){
                String styleConfigKey = iterator.next().toString();
                if("navBarTitle".equals(styleConfigKey)){
                    String navBarTitle = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setNavBarTitle(navBarTitle);
                }
                if("navBarTitleColor".equals(styleConfigKey)){
                    String navBarTitleColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setNavBarTitleColor(navBarTitleColor);
                }
                if("navBarColor".equals(styleConfigKey)){
                    String navBarColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setNavBarColor(navBarColor);
                }
                if("inboxBackgroundColor".equals(styleConfigKey)){
                    String inboxBackgroundColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setInboxBackgroundColor(inboxBackgroundColor);
                }
                if("backButtonColor".equals(styleConfigKey)){
                    String backButtonColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setBackButtonColor(backButtonColor);
                }
                if("unselectedTabColor".equals(styleConfigKey)){
                    String unselectedTabColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setUnselectedTabColor(unselectedTabColor);
                }
                if("selectedTabColor".equals(styleConfigKey)){
                    String selectedTabColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setSelectedTabColor(selectedTabColor);
                }
                if("selectedTabIndicatorColor".equals(styleConfigKey)){
                    String selectedTabIndicatorColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setSelectedTabIndicatorColor(selectedTabIndicatorColor);
                }
                if("tabBackgroundColor".equals(styleConfigKey)){
                    String tabBackgroundColor = styleConfigJson.getString(styleConfigKey);
                    styleConfig.setTabBackgroundColor(tabBackgroundColor);
                }
                if("tabs".equals(styleConfigKey)){
                    try {
                        ArrayList<String> tabsList = arrayListStringFromJSONArray(styleConfigJson.getJSONArray(styleConfigKey));
                        styleConfig.setTabs(tabsList);
                    } catch (Throwable t) {
                        Log.e("CleverTapError", "Unhandled JSONArray from styleConfig JSONObject");
                    }
                }
            }
            return styleConfig;
        }catch (JSONException e){
            Log.e("CleverTapError", "JSON to CTInboxStyleConfig error", e);
            return styleConfig;
        }
    }

    private static ArrayList<String> arrayListStringFromJSONArray(JSONArray jsonArray){
        ArrayList<String> tabList = new ArrayList<>();
        try{
            for(int i=0; i< jsonArray.length(); i++){
                tabList.add(jsonArray.getString(i));
            }
            return tabList;
        }catch (JSONException e){
            Log.e("CleverTapError", "JSONArray to ArrayList of Tabs error", e);
            return tabList;
        }
    }
}
