import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

const MOCK_DRIVER = {
  name: 'রহিম মিয়া',
  plate: 'ঢাকা-মেট্রো-গ-১১-২৩৪৫',
  vehicleType: 'CNG-Powered Rickshaw',
  rating: '4.9',
};

export default function DriverArrivedScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timerBarWidth = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for the rickshaw icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.12,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Countdown bar animation
    Animated.timing(timerBarWidth, {
      toValue: 0,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Auto-transition to active trip
    const timer = setTimeout(() => {
      router.replace('/(main)/active-trip' as any);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleStartNow = () => {
    router.replace('/(main)/active-trip' as any);
  };

  const handleCall = () => {
    // Mock call action
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.arrivedBadge}>
          <Ionicons name="checkmark-circle" size={20} color={colors.surface} />
          <Text style={styles.arrivedBadgeText}>আপনার রিকশা এসে গেছে!</Text>
        </View>
      </View>

      {/* Rickshaw Icon */}
      <View style={styles.iconSection}>
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.iconInner}>
            <Ionicons name="bicycle" size={60} color={colors.primary} />
          </View>
          <View style={styles.iconRing} />
        </Animated.View>
        <Text style={styles.waitText}>চালক অপেক্ষা করছেন</Text>
        <Text style={styles.waitSubtext}>তাড়াতাড়ি আসুন, তিনি অপেক্ষা করছেন</Text>
      </View>

      {/* Timer Bar */}
      <View style={styles.timerSection}>
        <Text style={styles.timerLabel}>ট্রিপ ৫ সেকেন্ডে শুরু হবে...</Text>
        <View style={styles.timerBarBackground}>
          <Animated.View
            style={[
              styles.timerBarFill,
              {
                width: timerBarWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      {/* Driver Info Card */}
      <View style={styles.driverCard}>
        <View style={styles.driverAvatar}>
          <Ionicons name="person" size={30} color={colors.textSecondary} />
        </View>
        <View style={styles.driverDetails}>
          <Text style={styles.driverName}>{MOCK_DRIVER.name}</Text>
          <Text style={styles.vehicleType}>{MOCK_DRIVER.vehicleType}</Text>
          <View style={styles.plateContainer}>
            <MaterialIcons name="directions-bike" size={16} color={colors.textSecondary} />
            <Text style={styles.plateText}>{MOCK_DRIVER.plate}</Text>
          </View>
        </View>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color={colors.accent} />
          <Text style={styles.ratingText}>{MOCK_DRIVER.rating}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Ionicons name="call" size={22} color={colors.primary} />
          <Text style={styles.callButtonText}>ফোন করুন</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.startButton} onPress={handleStartNow}>
          <Ionicons name="play-circle" size={22} color={colors.surface} />
          <Text style={styles.startButtonText}>এখনই শুরু করুন</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  arrivedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 8,
  },
  arrivedBadgeText: {
    color: colors.surface,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyBn,
  },
  iconSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  iconRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: colors.primary,
    opacity: 0.3,
  },
  waitText: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBn,
    marginBottom: 6,
  },
  waitSubtext: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyBn,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  timerSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  timerLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyBn,
    marginBottom: 8,
    textAlign: 'center',
  },
  timerBarBackground: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  timerBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: colors.border,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBn,
    marginBottom: 2,
  },
  vehicleType: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  plateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  plateText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyBn,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: typography.sizes.sm,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    gap: 8,
  },
  callButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: typography.fontFamilyBn,
  },
  startButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  startButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.surface,
    fontFamily: typography.fontFamilyBn,
  },
});
