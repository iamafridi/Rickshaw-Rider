import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useNotificationStore } from '@/store/notificationStore';
import { NotificationCard } from '@/components/NotificationCard';
import { Notification } from '@/types/notification';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'আপনার প্রথম রাইডে ৫০% ছাড়!',
    message: 'প্রথমবার রিকশা বুকিংয়ে ব্যবহার করুন "WELCOME50" প্রোমোকোড এবং পান সর্বোচ্চ ৫০ টাকা ছাড়।',
    type: 'promo',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'নতুন ফিচার: আগাম বুকিং',
    message: 'এখন থেকে আপনি চাইলে আগামীকালের জন্য রিকশা আগাম বুক করতে পারবেন।',
    type: 'system',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'রাইড সম্পন্ন হয়েছে',
    message: 'আপনার ধানমন্ডি ৭ থেকে নিউ মার্কেট রাইডটি সম্পন্ন হয়েছে। ধন্যবাদ RickshawBD ব্যবহার করার জন্য।',
    type: 'ride',
    isRead: true,
    rideId: 'ride_123',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  }
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, setNotifications, markAsRead } = useNotificationStore();

  useEffect(() => {
    // Populate mock notifications if empty
    if (notifications.length === 0) {
      setNotifications(MOCK_NOTIFICATIONS);
    }
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleMarkAllRead = () => {
    markAsRead(); // Passing undefined marks all as read in our store implementation
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (notification.type === 'ride' && notification.rideId) {
      // Could navigate to history or ride details
      // router.push(`/(main)/history/${notification.rideId}`);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="notifications-off-outline" size={64} color={colors.border} />
      <Text style={styles.emptyStateText}>কোনো নোটিফিকেশন নেই</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>নোটিফিকেশন</Text>
        <TouchableOpacity onPress={handleMarkAllRead} style={styles.headerRight}>
          <Text style={styles.markReadText}>সব পড়ুন</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard 
            notification={item} 
            onPress={() => handleNotificationPress(item)} 
          />
        )}
        contentContainerStyle={notifications.length === 0 ? styles.emptyContent : null}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBn,
  },
  headerRight: {
    padding: 4,
  },
  markReadText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: '600',
    fontFamily: typography.fontFamilyBn,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyBn,
  },
});
