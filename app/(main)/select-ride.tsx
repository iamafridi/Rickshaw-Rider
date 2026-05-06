import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { HomeMap } from '@/components/HomeMap';
import { RideTypeCard } from '@/components/RideTypeCard';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { strings } from '@/constants/strings';
import { RideType } from '@/types/ride';

const MOCK_RIDE_TYPES = [
  { id: 'regular', type: 'regular' as RideType, title: 'Regular Rickshaw', subtitle: 'Standard ride for 2 people', price: '৳ 40' },
  { id: 'premium', type: 'premium' as RideType, title: 'Premium Rickshaw', subtitle: 'Newer rickshaw, better comfort', price: '৳ 60', isSurge: true },
  { id: 'electric', type: 'electric' as RideType, title: 'Electric Rickshaw', subtitle: 'Faster, eco-friendly', price: '৳ 80' },
];

export default function SelectRideScreen() {
  const router = useRouter();
  const [selectedRide, setSelectedRide] = useState<string>('regular');

  const handleConfirm = () => {
    // Save selected ride type to store
    router.push('/(main)/confirm-booking' as any);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <HomeMap />
        
        {/* Back Button */}
        <SafeAreaView style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <View style={styles.backIconPlaceholder} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
        
        <Text style={styles.title}>Select Ride</Text>
        
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {MOCK_RIDE_TYPES.map((ride) => (
            <RideTypeCard
              key={ride.id}
              type={ride.type}
              title={ride.title}
              subtitle={ride.subtitle}
              price={ride.price}
              isSelected={selectedRide === ride.id}
              isSurge={ride.isSurge}
              onPress={() => setSelectedRide(ride.id)}
            />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Choose {MOCK_RIDE_TYPES.find(r => r.id === selectedRide)?.title}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backIconPlaceholder: {
    width: 12,
    height: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: colors.textPrimary,
    transform: [{ rotate: '-45deg' }, { translateX: 2 }, { translateY: 2 }],
  },
  bottomSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    height: '50%',
  },
  handleContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyEn,
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.surface,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyEn,
  },
});
