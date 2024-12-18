package com.clevertap.clevertap_plugin

import android.content.Context
import android.util.Log
import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.sdk.inapp.customtemplates.CustomTemplateException
import com.clevertap.android.sdk.inapp.customtemplates.FunctionPresenter
import com.clevertap.android.sdk.inapp.customtemplates.TemplatePresenter
import com.clevertap.android.sdk.inapp.customtemplates.CustomTemplateContext.FunctionContext
import com.clevertap.android.sdk.inapp.customtemplates.CustomTemplateContext.TemplateContext
import com.clevertap.clevertap_plugin.CleverTapEventEmitter.emit
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.nio.charset.StandardCharsets

object ClevertapCustomTemplates {
    private const val TAG = "ClevertapCustomTemplate"

    private val templatePresenter: TemplatePresenter = object : TemplatePresenter {
        override fun onPresent(context: TemplateContext) {
            Log.d(TAG, "from native onPresent: " + context.templateName)

            emit(
                CleverTapEvent.CLEVERTAP_CUSTOM_TEMPLATE_PRESENT,
                context.templateName
            )
        }

        override fun onClose(context: TemplateContext) {
            Log.d(TAG, "from native onClose: " + context.templateName)
            emit(
                CleverTapEvent.CLEVERTAP_CUSTOM_TEMPLATE_CLOSE,
                context.templateName
            )
        }
    }

    private val functionPresenter = FunctionPresenter { context: FunctionContext ->
        Log.d(TAG, "from native function onPresent: " + context.templateName)
        emit(
            CleverTapEvent.CLEVERTAP_CUSTOM_FUNCTION_PRESENT,
            context.templateName
        )
    }

    @JvmStatic
    fun registerCustomTemplates(context: Context, vararg jsonAssets: String) {
        for (jsonAsset in jsonAssets) {
            val jsonDefinitions = readAsset(context, jsonAsset)
            CleverTapAPI.registerCustomInAppTemplates(
                jsonDefinitions,
                templatePresenter,
                functionPresenter
            )
        }
    }

    private fun readAsset(context: Context, asset: String): String {
        try {
            context.assets.open(asset).use { assetInputStream ->
                BufferedReader(
                    InputStreamReader(
                        assetInputStream,
                        StandardCharsets.UTF_8
                    )
                ).use { reader ->
                    val builder = StringBuilder()
                    var line: String?
                    while ((reader.readLine().also { line = it }) != null) {
                        builder.append(line)
                    }
                    return builder.toString()
                }
            }
        } catch (e: IOException) {
            throw CustomTemplateException("Could not read json asset", e)
        }
    }
}
