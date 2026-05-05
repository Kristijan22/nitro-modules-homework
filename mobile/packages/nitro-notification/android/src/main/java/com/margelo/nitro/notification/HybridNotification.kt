package com.margelo.nitro.notification

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import androidx.annotation.Keep

@Keep
class HybridNotification : HybridNotificationSpec() {

  override fun showNotification(title: String, body: String) {
    val ctx = appContext ?: return

    val notificationManager =
      ctx.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    val channel = NotificationChannel(
      CHANNEL_ID,
      "Lottery Notifications",
      NotificationManager.IMPORTANCE_DEFAULT
    )
    notificationManager.createNotificationChannel(channel)

    val notification = android.app.Notification.Builder(ctx, CHANNEL_ID)
      .setContentTitle(title)
      .setContentText(body)
      .setSmallIcon(android.R.drawable.ic_dialog_info)
      .setAutoCancel(true)
      .build()

    notificationManager.notify(System.currentTimeMillis().toInt(), notification)
  }

  companion object {
    private const val CHANNEL_ID = "lottery_notifications"
    private var appContext: Context? = null

    fun init(context: Context) {
      appContext = context.applicationContext
    }
  }
}
