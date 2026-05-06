import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { strings } from '@/constants/strings';
import { useBooking } from '@/hooks/useBooking';
import { useBookingStore } from '@/store/bookingStore';

export default function MatchingScreen() {
  const router = useRouter();
  
  // Animation values
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;

  const createPulseAnimation = (anim: Animated.Value, delay: number) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          delay,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
  };

  const { cancelRide } = useBooking();
  const rideId = useBookingStore(state => state.rideId);

  useEffect(() => {
    createPulseAnimation(pulse1, 0).start();
    createPulseAnimation(pulse2, 600).start();
    createPulseAnimation(pulse3, 1200).start();
  }, []);

  const handleCancel = async () => {
    if (rideId) {
      await cancelRide(rideId, 'User cancelled');
    } else {
      router.replace('/(main)/home');
    }
  };

  const PulseCircle = ({ anim }: { anim: Animated.Value }) => {
    return (
      <Animated.View
        style={[
          styles.pulseCircle,
          {
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 2.5],
                }),
              },
            ],
            opacity: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 0],
            }),
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.radarContainer}>
        <PulseCircle anim={pulse1} />
        <PulseCircle anim={pulse2} />
        <PulseCircle anim={pulse3} />
        
        <View style={styles.centerDot}>
          <View style={styles.rickshawIconPlaceholder} />
        </View>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>Looking for nearby drivers...</Text>
        <Text style={styles.subtitle}>Please wait while we connect you to the best ride</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
  },
  radarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  pulseCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.primary,
    opacity: 0.2,
  },
  centerDot: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  rickshawIconPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    marginBottom: 40,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyEn,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  cancelButton: {
    backgroundColor: colors.error,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.surface,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyEn,
  },
});
