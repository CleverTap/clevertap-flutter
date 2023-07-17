package com.clevertap.clevertap_plugin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class CleverTapTypeUtils {

    private static final String TAG = "CleverTapTypeUtils";

    public static class MapUtil {
        public static JSONObject toJSONObject(Map<String, Object> map) throws JSONException {
            JSONObject jsonObject = new JSONObject();

            for (Map.Entry<String, Object> entry : map.entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();

                if (value == null) {
                    jsonObject.put(key, null);
                } else if (value instanceof Boolean) {
                    jsonObject.put(key, value);
                } else if (value instanceof Integer) {
                    jsonObject.put(key, value);
                }
                else if (value instanceof Float || value instanceof Double) {
                    jsonObject.put(key, Double.parseDouble(value.toString()));
                } else if (value instanceof String) {
                    jsonObject.put(key, value);
                } else if (value instanceof Map) {
                    jsonObject.put(key, toJSONObject((Map<String, Object>) value));
                } else if (value instanceof ArrayList) {
                    jsonObject.put(key, ArrayUtil.toJSONArray((ArrayList) value));
                }
            }

            return jsonObject;
        }

        public static Map<String, Object> toMap(JSONObject jsonObject) throws JSONException {
            Map<String, Object> map = new HashMap<>();
            Iterator<String> keysIterator = jsonObject.keys();

            while (keysIterator.hasNext()) {
                String key = keysIterator.next();
                Object value = jsonObject.get(key);

                if (value instanceof JSONObject) {
                    map.put(key, toMap((JSONObject) value));
                } else if (value instanceof JSONArray) {
                    map.put(key, ArrayUtil.toArray((JSONArray) value));
                } else {
                    map.put(key, value);
                }
            }

            return map;
        }

        public static Map<String, Object> addValue(String key, Object value) {
            Map<String, Object> map = new HashMap<>();

            if (value == null) {
                map.put(key, null);
            } else if (value instanceof Boolean) {
                map.put(key, value);
            } else if (value instanceof Double) {
                map.put(key, value);
            } else if (value instanceof Integer) {
                map.put(key, value);
            } else if (value instanceof String) {
                map.put(key, value);
            } else if (value instanceof Map) {
                map.put(key, value);
            } else if (value.getClass() != null && (value.getClass().isArray() || value instanceof ArrayList)) {
                map.put(key, value);
            }

            return map;
        }

        public static class ArrayUtil {

            public static JSONArray toJSONArray(ArrayList<Object> arrayList) throws JSONException {
                JSONArray jsonArray = new JSONArray();

                for (Object value : arrayList) {
                    if (value == null) {
                        jsonArray.put(JSONObject.NULL);
                    } else if (value instanceof Boolean) {
                        jsonArray.put(value);
                    }else if (value instanceof Integer) {
                        jsonArray.put(value);
                    }
                    else if (value instanceof Float || value instanceof Double) {
                        jsonArray.put(Double.parseDouble(value.toString()));
                    } else if (value instanceof String) {
                        jsonArray.put(value);
                    } else if (value instanceof Map) {
                        jsonArray.put(toJSONObject((Map<String, Object>) value));
                    } else if (value instanceof ArrayList) {
                        jsonArray.put(toJSONArray((ArrayList) value));
                    }
                }
                return jsonArray;
            }

            public static Object[] toArray(JSONArray jsonArray) throws JSONException {
                Object[] array = new Object[jsonArray.length()];

                for (int i = 0; i < jsonArray.length(); i++) {
                    Object value = jsonArray.get(i);

                    if (value instanceof JSONObject) {
                        array[i] = toMap((JSONObject) value);
                    } else if (value instanceof JSONArray) {
                        array[i] = toArray((JSONArray) value);
                    } else {
                        array[i] = value;
                    }
                }

                return array;
            }
        }
    }

    public static class LongUtil {
        public static Long parseLong(Object object) {
            if (object instanceof Integer) {
                return ((Integer) object).longValue();
            }
            if (object instanceof Long) {
                return (Long) object;
            }
            return null;
        }
    }
}