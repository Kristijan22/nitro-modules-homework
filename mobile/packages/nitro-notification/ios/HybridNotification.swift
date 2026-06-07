import Foundation
import UserNotifications
import NitroModules

class HybridNotification: HybridNotificationSpec {
  func showNotification(title: String, body: String) throws {
    let center = UNUserNotificationCenter.current()

    center.requestAuthorization(options: [.alert, .sound]) { granted, _ in
      guard granted else { return }

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

      center.add(request, withCompletionHandler: nil)
    }
  }
}
