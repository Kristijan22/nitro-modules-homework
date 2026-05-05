import Foundation
import UserNotifications
import NitroModules

class HybridNotification: HybridNotificationSpec {
  func showNotification(title: String, body: String) throws {
    let content = UNMutableNotificationContent()
    content.title = title
    content.body = body
    content.sound = .default

    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
    let request = UNNotificationRequest(
      identifier: UUID().uuidString,
      content: content,
      trigger: trigger
    )

    UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
  }
}
