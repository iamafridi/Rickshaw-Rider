import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { HomeMap } from '@/components/HomeMap';
import { FareBreakdown } from '@/components/FareBreakdown';
import { PaymentSelector } from '@/components/payment/PaymentSelector';
import { PaymentMethod } from '@/types/payment';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { strings } from '@/constants/strings';
import { useBooking } from '@/hooks/useBooking';

export default function ConfirmBookingScreen() {
  const { requestRide, isRequesting } = useBooking();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const baseFare = 20;
  const distanceFare = 20;
  const totalBeforeDiscount = baseFare + distanceFare;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME50') {
      setAppliedDiscount(20); // 50% max 20 tk mock
    } else {
      setAppliedDiscount(0);
    }
  };

  const handleConfirm = async () => {
    const res = await requestRide();
    if (!res.ok) {
      // Could show an Alert here
      console.warn('Booking failed:', res.error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Confirm Booking</Text>
          
          <View style={styles.tripInfo}>
            <View style={styles.locationRow}>
              <View style={[styles.dot, styles.originDot]} />
              <Text style={styles.locationText}>Current Location</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.locationRow}>
              <View style={[styles.dot, styles.destinationDot]} />
              <Text style={styles.locationText}>Destination</Text>
            </View>
          </View>

          <PaymentSelector
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />

          <View style={styles.promoContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter Promo Code"
              value={promoCode}
              onChangeText={setPromoCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.promoButton} onPress={handleApplyPromo}>
              <Text style={styles.promoButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>

          <FareBreakdown
            baseFare={baseFare}
            distanceFare={distanceFare}
            totalFare={Math.max(0, totalBeforeDiscount - appliedDiscount)}
            discount={appliedDiscount > 0 ? appliedDiscount : undefined}
          />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirm Rickshaw</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    height: '65%',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyEn,
    marginBottom: 16,
  },
  tripInfo: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  originDot: {
    backgroundColor: colors.primary,
  },
  destinationDot: {
    backgroundColor: colors.error,
  },
  line: {
    width: 2,
    height: 20,
    backgroundColor: colors.border,
    marginLeft: 4,
    marginVertical: 4,
  },
  locationText: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  promoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamilyEn,
  },
  promoButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  promoButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyEn,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 30,
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
