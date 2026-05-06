import { create } from 'zustand';
import { Notification } from '@/types/notification';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  markAsRead: (id?: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => set({ 
    notifications,
    unreadCount: notifications.filter(n => !n.isRead).length
  }),
  markAsRead: (id) => set((state) => {
    const updated = state.notifications.map(n => id ? (n.id === id ? { ...n, isRead: true } : n) : { ...n, isRead: true });
    return {
      notifications: updated,
      unreadCount: updated.filter(n => !n.isRead).length
    }
  })
}));
