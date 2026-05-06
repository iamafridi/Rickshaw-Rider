import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HomeMap } from '@/components/HomeMap';
import { SafeRideShare } from '@/components/SafeRideShare';
import { SOSButton } from '@/components/SOSButton';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Driver } from '@/types/driver';
import { DriverPreviewCard } from '@/components/DriverPreviewCard';
import { useBookingStore } from '@/store/bookingStore';

const MOCK_DRIVER: Driver = {
  id: 'd1',
  name: 'Rahim Uddin',
  phone: '+8801700000000',
  rating: 4.8,
  tripsCount: 1420,
  plateNumber: 'DHAKA-D 12-3456',
  type: 'manual',
  vehicleType: 'regular',
  currentLocation: { latitude: 23.8105, longitude: 90.4120 },
  status: 'active',
  isVerified: true
};

export default function ActiveTripScreen() {
  const router = useRouter();
  const { durationHours, setDurationHours } = useBookingStore();
  const isHourly = durationHours !== null;

  useEffect(() => {
    // Simulate trip completion after 10 seconds (for testing)
    const timer = setTimeout(() => {
      // router.replace('/(main)/trip-complete' as any);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleExtendTrip = () => {
    Alert.alert(
      "Extend Trip",
      "How many more hours do you want to add?",
      [
        { text: "+1 Hour", onPress: () => setDurationHours((durationHours || 0) + 1) },
        { text: "+2 Hours", onPress: () => setDurationHours((durationHours || 0) + 2) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <HomeMap />
        
        {/* Safety Tools overlay */}
        <SafeAreaView style={styles.safetyHeader}>
          <SafeRideShare 
            onShare={() => {}} 
            driverName={MOCK_DRIVER.name} 
            rideId="mock-ride-id" 
          />
          <SOSButton onPress={() => {}} />
        </SafeAreaView>

        <View style={styles.etaOverlay}>
          <Text style={styles.etaTime}>{isHourly ? `${durationHours}h` : '12'}</Text>
          <Text style={styles.etaText}>{isHourly ? 'remaining' : 'min away'}</Text>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusTitle}>{isHourly ? 'Hourly Rental Active' : 'On Trip to Destination'}</Text>
              <Text style={styles.statusSubtitle}>{isHourly ? `Ends in ${durationHours} hours` : 'ETA 10:45 AM'}</Text>
            </View>
            {isHourly && (
              <TouchableOpacity style={styles.extendButton} onPress={handleExtendTrip}>
                <Ionicons name="time-outline" size={16} color={colors.primary} />
                <Text style={styles.extendButtonText}>Extend</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={styles.cardWrapper}>
          <DriverPreviewCard
            driver={MOCK_DRIVER}
            onCall={() => {}}
            onMessage={() => router.push('/(main)/chat')}
          />
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
  safetyHeader: {
    position: 'absolute',
    top: 10,
    right: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 10,
  },
  etaOverlay: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  etaTime: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  etaText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  bottomSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingBottom: 20,
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
  statusContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyEn,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  extendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  extendButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: typography.sizes.sm,
  },
  cardWrapper: {
    paddingHorizontal: 20,
  },
});
