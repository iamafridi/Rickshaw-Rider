import React, { useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { HomeMap } from '@/components/HomeMap';
import { DriverPreviewCard } from '@/components/DriverPreviewCard';
import { SafeRideShare } from '@/components/SafeRideShare';
import { SOSButton } from '@/components/SOSButton';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Driver } from '@/types/driver';

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

export default function TrackingScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simulate driver arriving after some time
    const timer = setTimeout(() => {
      router.replace('/(main)/driver-arrived' as any);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleCall = () => {
    // Implement call logic
  };

  const handleMessage = () => {
    // Implement message logic
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
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>Driver is on the way</Text>
          <Text style={styles.statusSubtitle}>PIN: 1234</Text>
        </View>
        
        <View style={styles.cardWrapper}>
          <DriverPreviewCard
            driver={MOCK_DRIVER}
            etaMinutes={3}
            onCall={handleCall}
            onMessage={handleMessage}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyEn,
  },
  statusSubtitle: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.primary,
  },
  cardWrapper: {
    paddingHorizontal: 20,
  },
});
