package com.mobile.specs

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class CustomButtonPackage : BaseReactPackage() {

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> =
    listOf(CustomButtonViewManager())

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    if (name == CustomButtonViewManager.REACT_CLASS) {
      return CustomButtonViewManager()
    }
    return null
  }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
      CustomButtonViewManager.REACT_CLASS to ReactModuleInfo(
        name = CustomButtonViewManager.REACT_CLASS,
        className = CustomButtonViewManager.REACT_CLASS,
        canOverrideExistingModule = false,
        needsEagerInit = false,
        isCxxModule = false,
        isTurboModule = true,
      )
    )
  }
}
