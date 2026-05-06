import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { FareBreakdown } from '@/components/FareBreakdown';

export default function TripCompleteScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);

  const handleDone = () => {
    router.replace('/(main)/home' as any);
  };

  const handleRating = (stars: number) => {
    setRating(stars);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>You have arrived!</Text>
          <Text style={styles.subtitle}>Hope you had a safe ride</Text>
        </View>

        <View style={styles.fareContainer}>
          <FareBreakdown
            baseFare={20}
            distanceFare={30}
            totalFare={50}
          />
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>How was your ride?</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                <Text style={[styles.star, rating >= star ? styles.starFilled : null]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
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
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: typography.fontFamilyEn,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  fareContainer: {
    marginBottom: 40,
  },
  ratingContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ratingTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  star: {
    fontSize: 40,
    color: colors.border,
  },
  starFilled: {
    color: colors.warning, // Yellow for star
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  doneButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: colors.surface,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyEn,
  },
});
