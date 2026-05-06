import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

const CANCELLATION_REASONS = [
  'Driver asked to cancel',
  'Driver is too far away',
  'Wait time is too long',
  'Driver is not moving',
  'I entered wrong destination',
  'My plans changed',
  'Other'
];

export default function CancellationScreen() {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const handleCancelTrip = () => {
    // Process cancellation in store/backend
    router.replace('/(main)/home' as any);
  };

  const handleKeepTrip = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cancel Trip</Text>
        <Text style={styles.subtitle}>Please tell us why you are canceling. This helps us improve our service.</Text>
      </View>

      <ScrollView style={styles.reasonsList}>
        {CANCELLATION_REASONS.map((reason, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.reasonItem,
              selectedReason === reason && styles.reasonItemSelected
            ]}
            onPress={() => setSelectedReason(reason)}
          >
            <Text style={[
              styles.reasonText,
              selectedReason === reason && styles.reasonTextSelected
            ]}>
              {reason}
            </Text>
            <View style={[
              styles.radio,
              selectedReason === reason && styles.radioSelected
            ]}>
              {selectedReason === reason && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.keepButton} onPress={handleKeepTrip}>
          <Text style={styles.keepButtonText}>Keep Trip</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.cancelButton, !selectedReason && styles.cancelButtonDisabled]} 
          onPress={handleCancelTrip}
          disabled={!selectedReason}
        >
          <Text style={styles.cancelButtonText}>Cancel Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyEn,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  reasonsList: {
    flex: 1,
    padding: 20,
  },
  reasonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reasonItemSelected: {
    // Optionally highlight the whole item
  },
  reasonText: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  reasonTextSelected: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    gap: 12,
  },
  keepButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  keepButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyEn,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.error,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonDisabled: {
    backgroundColor: colors.textHint,
  },
  cancelButtonText: {
    color: colors.surface,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyEn,
  },
});
