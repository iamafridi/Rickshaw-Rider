import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { Notification } from '../types/notification';

interface NotificationCardProps {
  notification: Notification;
  onPress?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
}) => {
  // Simple date formatter
  const formattedDate = new Date(notification.createdAt).toLocaleDateString();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !notification.isRead && styles.unreadContainer,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      disabled={!onPress}
    >
      <View style={styles.iconContainer}>
        {notification.type === 'promo' && <Text style={styles.icon}>🏷️</Text>}
        {notification.type === 'ride' && <Text style={styles.icon}>🛺</Text>}
        {notification.type === 'system' && <Text style={styles.icon}>ℹ️</Text>}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, !notification.isRead && styles.unreadText]}>
            {notification.title}
          </Text>
          {!notification.isRead && <View style={styles.unreadDot} />}
        </View>
        
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  unreadContainer: {
    backgroundColor: `${colors.primary}05`, // Very light primary tint
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
    marginRight: 8,
  },
  unreadText: {
    color: colors.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  message: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  date: {
    fontSize: typography.sizes.xs,
    color: colors.textHint,
  },
});
