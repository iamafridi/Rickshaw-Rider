/**
 * services/notifications.ts
 * Firebase Cloud Messaging (FCM) push notification setup.
 * Uses expo-notifications under the hood.
 * Source: rickshaw-rider-app-spec-cursor.md §Tech Stack (Push: FCM)
 */

import { Platform } from 'react-native';
import type { Notification, NotificationResponse } from 'expo-notifications';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

/**
 * Request push notification permission from the OS.
 * Returns the Expo push token, or null if permission denied.
 */
export const registerForPushNotifications = async (): Promise<string | null> => {
  try {
    const Notifications = await import('expo-notifications');

    // Android: set the notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1B5E20',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('[notifications] Push permission not granted');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } catch (err) {
    // expo-notifications not installed — gracefully degrade
    console.warn('[notifications] expo-notifications not available:', err);
    return null;
  }
};

/**
 * Set the notification handler — controls how notifications are shown
 * when the app is in the foreground.
 */
export const configureNotificationHandler = async (): Promise<void> => {
  try {
    const Notifications = await import('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge:  true,
        shouldShowBanner: true,
        shouldShowList:   true,
      }),
    });
  } catch {
    // no-op if expo-notifications not installed
  }
};

/**
 * Add a listener for incoming notifications (foreground).
 * Returns a cleanup function — call it in useEffect cleanup.
 */
export const addNotificationListener = (
  onReceive: (payload: NotificationPayload) => void
): (() => void) => {
  let subscription: any;
  (async () => {
    try {
      const Notifications = await import('expo-notifications');
      subscription = Notifications.addNotificationReceivedListener((notification: Notification) => {
        const { title, body, data } = notification.request.content;
        onReceive({ title: title ?? '', body: body ?? '', data: data as Record<string, unknown> });
      });
    } catch {
      // no-op
    }
  })();

  return () => {
    if (subscription) {
      subscription.remove?.();
    }
  };
};

/**
 * Add a listener for when a user taps a notification (background/killed).
 * Returns a cleanup function.
 */
export const addNotificationResponseListener = (
  onResponse: (data: Record<string, unknown>) => void
): (() => void) => {
  let subscription: any;
  (async () => {
    try {
      const Notifications = await import('expo-notifications');
      subscription = Notifications.addNotificationResponseReceivedListener((response: NotificationResponse) => {
        const data = response.notification.request.content.data as Record<string, unknown>;
        onResponse(data);
      });
    } catch {
      // no-op
    }
  })();

  return () => {
    if (subscription) {
      subscription.remove?.();
    }
  };
};
