import { NitroModules } from 'react-native-nitro-modules';
import type { Notification } from './Notification.nitro';

export type { Notification };

export const NotificationModule =
  NitroModules.createHybridObject<Notification>('Notification');
