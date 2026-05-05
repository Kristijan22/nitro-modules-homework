package com.mobile.specs

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.CustomButtonManagerInterface
import com.facebook.react.viewmanagers.CustomButtonManagerDelegate

@ReactModule(name = CustomButtonViewManager.REACT_CLASS)
class CustomButtonViewManager :
  SimpleViewManager<CustomButtonView>(),
  CustomButtonManagerInterface<CustomButtonView> {

  companion object {
    const val REACT_CLASS = "CustomButton"
  }

  private val delegate: CustomButtonManagerDelegate<CustomButtonView, CustomButtonViewManager> =
    CustomButtonManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<CustomButtonView> = delegate

  override fun getName(): String = REACT_CLASS

  override fun createViewInstance(context: ThemedReactContext): CustomButtonView =
    CustomButtonView(context)

  @ReactProp(name = "text")
  override fun setText(view: CustomButtonView, text: String?) {
    view.text = text ?: ""
  }

  @ReactProp(name = "disabled")
  override fun setDisabled(view: CustomButtonView, disabled: Boolean) {
    view.isEnabled = !disabled
    view.alpha = if (disabled) 0.5f else 1.0f
  }

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> =
    mapOf(
      "onCustomButtonPress" to mapOf(
        "registrationName" to "onCustomButtonPress"
      )
    )
}
