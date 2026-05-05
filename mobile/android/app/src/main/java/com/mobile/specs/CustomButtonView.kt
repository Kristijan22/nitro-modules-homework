package com.mobile.specs

import android.content.Context
import android.widget.Button
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event

class CustomButtonView(context: Context) : Button(context) {

  init {
    setOnClickListener {
      val reactContext = context as ReactContext
      val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
      val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
      eventDispatcher?.dispatchEvent(
        OnCustomButtonPressEvent(surfaceId, id)
      )
    }
  }

  inner class OnCustomButtonPressEvent(
    surfaceId: Int,
    viewId: Int,
  ) : Event<OnCustomButtonPressEvent>(surfaceId, viewId) {
    override fun getEventName() = "onCustomButtonPress"
    override fun getEventData() = Arguments.createMap()
  }
}
