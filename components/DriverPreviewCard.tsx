import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { Driver } from '../types/driver';
import { RatingStars } from './RatingStars';

interface DriverPreviewCardProps {
  driver: Driver;
  etaMinutes?: number;
  onPress?: () => void;
  onCall?: () => void;
  onMessage?: () => void;
}

export const DriverPreviewCard: React.FC<DriverPreviewCardProps> = ({
  driver,
  etaMinutes,
  onPress,
  onCall,
  onMessage,
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {driver.photoUrl ? (
            <Image source={{ uri: driver.photoUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{driver.name.charAt(0)}</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{driver.name}</Text>
          <View style={styles.ratingRow}>
            <RatingStars rating={driver.rating} size={14} />
            <Text style={styles.tripsCount}>({driver.tripsCount} trips)</Text>
          </View>
          <Text style={styles.plate}>{driver.plateNumber}</Text>
        </View>

        {etaMinutes !== undefined && (
          <View style={styles.etaContainer}>
            <Text style={styles.etaValue}>{etaMinutes}</Text>
            <Text style={styles.etaLabel}>min</Text>
          </View>
        )}
      </View>

      {(onCall || onMessage) && (
        <View style={styles.actions}>
          {onMessage && (
            <TouchableOpacity style={styles.actionButton} onPress={onMessage}>
              <Text style={styles.actionText}>Message</Text>
            </TouchableOpacity>
          )}
          {onCall && (
            <TouchableOpacity style={[styles.actionButton, styles.callButton]} onPress={onCall}>
              <Text style={styles.callText}>Call</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.textSecondary,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripsCount: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  plate: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  etaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}15`, // Light primary
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  etaValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.primary,
  },
  etaLabel: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  callButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
  },
  callText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as any,
    color: colors.surface,
  },
});
