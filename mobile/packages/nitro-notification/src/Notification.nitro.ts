import type { HybridObject } from 'react-native-nitro-modules';

export interface Notification
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  showNotification(title: string, body: string): void;
}
