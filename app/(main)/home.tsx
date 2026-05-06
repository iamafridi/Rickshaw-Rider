import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { HomeMap } from '@/components/HomeMap';
import { BottomSheet } from '@/components/BottomSheet';
import { SearchBar } from '@/components/SearchBar';
import { UpdatePrompt } from '@/components/UpdatePrompt';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { strings } from '@/constants/strings';
import { Ionicons } from '@expo/vector-icons';
import { useNotificationStore } from '@/store/notificationStore';
import { useBookingStore } from '@/store/bookingStore';
import { useNearbyDrivers } from '@/hooks/useNearbyDrivers';

type BookingMode = 'ride' | 'rent';
const RENT_DURATIONS = [1, 2, 4, 8];

export default function HomeScreen() {
  const [isSearchSheetVisible, setIsSearchSheetVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<BookingMode>('ride');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  
  useNearbyDrivers();
  const router = useRouter();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const setRideType = useBookingStore((state) => state.setRideType);
  const setDurationHours = useBookingStore((state) => state.setDurationHours);
  const setScheduledAt = useBookingStore((state) => state.setScheduledAt);

  useEffect(() => {
    // Show update prompt on mount for testing
    setTimeout(() => {
      setShowUpdatePrompt(true);
    }, 1500);
  }, []);

  const handleRegionChangeComplete = (region: any) => {
    // We could update the store with the map center, etc.
  };

  const handleContinuePress = () => {
    if (mode === 'ride' && searchQuery.trim().length > 0) {
      setRideType('instant');
      setIsSearchSheetVisible(false);
      router.push('/(main)/select-ride' as any);
    } else if (mode === 'rent' && selectedDuration) {
      setRideType('hourly');
      setDurationHours(selectedDuration);
      setIsSearchSheetVisible(false);
      router.push('/(main)/select-ride' as any);
    }
  };

  const handleSchedulePress = () => {
    setIsSearchSheetVisible(false);
    router.push('/(main)/schedule' as any);
  };

  const canContinue = mode === 'ride' ? searchQuery.trim().length > 0 : selectedDuration !== null;

  return (
    <View style={styles.container}>
      <HomeMap onRegionChangeComplete={handleRegionChangeComplete} />
      
      {/* Top action buttons */}
      <View style={styles.topActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(main)/profile')}
        >
          <Ionicons name="person-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(main)/notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <BottomSheet
        visible={isSearchSheetVisible}
        onClose={() => {}} // Keep it open for now or handle close logic
        height={320}
      >
        <View style={styles.sheetContent}>
          {/* Segmented Control */}
          <View style={styles.segmentedControl}>
            <TouchableOpacity 
              style={[styles.segmentButton, mode === 'ride' && styles.segmentButtonActive]}
              onPress={() => setMode('ride')}
            >
              <Text style={[styles.segmentText, mode === 'ride' && styles.segmentTextActive]}>Ride</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.segmentButton, mode === 'rent' && styles.segmentButtonActive]}
              onPress={() => setMode('rent')}
            >
              <Text style={[styles.segmentText, mode === 'rent' && styles.segmentTextActive]}>Rent</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.prompt}>
            {mode === 'ride' ? strings.home.whereTo : 'How long?'}
          </Text>
          
          {mode === 'ride' ? (
            <SearchBar
              placeholder={strings.home.searchPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery('')}
              style={styles.searchBar}
            />
          ) : (
            <View style={styles.durationContainer}>
              {RENT_DURATIONS.map((hrs) => (
                <TouchableOpacity
                  key={hrs}
                  style={[
                    styles.durationButton,
                    selectedDuration === hrs && styles.durationButtonSelected
                  ]}
                  onPress={() => setSelectedDuration(hrs)}
                >
                  <Text style={[
                    styles.durationText,
                    selectedDuration === hrs && styles.durationTextSelected
                  ]}>
                    {hrs} {hrs === 1 ? 'Hr' : 'Hrs'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <View style={styles.bottomActions}>
            <TouchableOpacity 
              style={styles.scheduleButton}
              onPress={handleSchedulePress}
            >
              <Ionicons name="calendar-outline" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]} 
              onPress={handleContinuePress}
              disabled={!canContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>

      <UpdatePrompt 
        isVisible={showUpdatePrompt}
        updateUrl="https://play.google.com/store/apps/details?id=com.rickshawbd.rider"
        onLater={() => setShowUpdatePrompt(false)}
        isForceUpdate={false} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topActions: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
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
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.error,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  sheetContent: {
    flex: 1,
    paddingTop: 10,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  segmentText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyEn,
    fontWeight: '500',
  },
  segmentTextActive: {
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  prompt: {
    fontSize: typography.sizes.xl,
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyEn,
    marginBottom: 20,
  },
  searchBar: {
    marginBottom: 20,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  durationButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  durationButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10', // 10% opacity
  },
  durationText: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyEn,
  },
  durationTextSelected: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  scheduleButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  continueButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: colors.border,
  },
  continueButtonText: {
    color: colors.surface,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyEn,
  },
});
