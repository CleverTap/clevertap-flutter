package com.clevertap.clevertap_plugin

import android.content.Context
import android.util.Log
import com.clevertap.android.sdk.CleverTapAPI
import com.clevertap.android.sdk.inapp.customtemplates.CustomTemplateException
import com.clevertap.android.sdk.inapp.customtemplates.FunctionPresenter
import com.clevertap.android.sdk.inapp.customtemplates.JsonTemplatesProducer
import com.clevertap.android.sdk.inapp.customtemplates.TemplateProducer
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

    // One presenter per account. The SDK's context does not say which account presents it
    // (CustomTemplateContext has only the template name and its arguments), so each account gets
    // presenters that remember its ID. Example: A and B both show "Spin"; A's presenter sends
    // ("Spin", A) and B's sends ("Spin", B), so each reaches its own handlers in Dart.
    private fun templatePresenter(accountId: String): TemplatePresenter = object : TemplatePresenter {
        override fun onPresent(context: TemplateContext) {
            Log.d(TAG, "from native onPresent: " + context.templateName + " for account " + accountId)
            emit(
                CleverTapEvent.CLEVERTAP_CUSTOM_TEMPLATE_PRESENT,
                accountId,
                context.templateName
            )
        }

        override fun onClose(context: TemplateContext) {
            Log.d(TAG, "from native onClose: " + context.templateName + " for account " + accountId)
            emit(
                CleverTapEvent.CLEVERTAP_CUSTOM_TEMPLATE_CLOSE,
                accountId,
                context.templateName
            )
        }
    }

    private fun functionPresenter(accountId: String) = FunctionPresenter { context: FunctionContext ->
        Log.d(TAG, "from native function onPresent: " + context.templateName + " for account " + accountId)
        emit(
            CleverTapEvent.CLEVERTAP_CUSTOM_FUNCTION_PRESENT,
            accountId,
            context.templateName
        )
    }

    /**
     * Registers the templates in [jsonAssets] for every account: the default one and any created
     * later. Call it before the first account is created (Application.onCreate), because the SDK
     * reads registered templates only when it creates an account.
     */
    @JvmStatic
    fun registerCustomTemplates(context: Context, vararg jsonAssets: String) {
        for (jsonAsset in jsonAssets) {
            val jsonDefinitions = readAsset(context, jsonAsset)
            // The SDK calls the producer once per account, with that account's config.
            CleverTapAPI.registerCustomInAppTemplates(TemplateProducer { ctConfig ->
                JsonTemplatesProducer(
                    jsonDefinitions,
                    templatePresenter(ctConfig.accountId),
                    functionPresenter(ctConfig.accountId)
                ).defineTemplates(ctConfig)
            })
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
