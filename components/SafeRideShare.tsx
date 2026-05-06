import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { strings } from '../constants/strings';

interface SafeRideShareProps {
  onShare: () => void;
  driverName: string;
  rideId: string;
}

export const SafeRideShare: React.FC<SafeRideShareProps> = ({ onShare, driverName, rideId }) => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title}>{strings.safeRide.title}</Text>
        <Text style={styles.subtitle}>
          {strings.safeRide.shareDescription.replace('{driver}', driverName)}
        </Text>
      </View>
      <TouchableOpacity style={styles.shareButton} onPress={onShare} activeOpacity={0.8}>
        <Text style={styles.shareText}>{strings.safeRide.share}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyEn,
  },
  shareButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  shareText: {
    color: colors.surface,
    fontWeight: typography.weights.bold as any,
    fontSize: typography.sizes.sm,
  },
});
