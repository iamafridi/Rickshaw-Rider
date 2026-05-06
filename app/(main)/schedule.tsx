import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useBookingStore } from '@/store/bookingStore';

type RepeatOption = 'once' | 'daily' | 'weekly';

const REPEAT_OPTIONS: { key: RepeatOption; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'once', label: 'একবার', icon: 'radio-button-on-outline' },
  { key: 'daily', label: 'প্রতিদিন', icon: 'repeat-outline' },
  { key: 'weekly', label: 'সাপ্তাহিক', icon: 'calendar-outline' },
];

// Helper to get formatted date strings
const getDateOptions = () => {
  const options = [];
  const today = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    options.push(d);
  }
  return options;
};

const TIME_SLOTS = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM',
  '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM',
  '09:00 PM',
];

const WEEKDAYS = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'];

export default function ScheduleScreen() {
  const router = useRouter();
  const { setScheduledAt, setRideType } = useBookingStore();

  const dateOptions = getDateOptions();
  const [selectedDate, setSelectedDate] = useState<Date>(dateOptions[0]);
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[2]); // default 08:00 AM
  const [repeatOption, setRepeatOption] = useState<RepeatOption>('once');

  const handleConfirm = () => {
    // Combine selected date and time
    const [time, period] = selectedTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const finalHours = period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours);

    const scheduledDate = new Date(selectedDate);
    scheduledDate.setHours(finalHours, minutes, 0, 0);

    setScheduledAt(scheduledDate.toISOString());
    setRideType('scheduled');

    Alert.alert(
      'নির্ধারিত যাত্রা বুক হয়েছে!',
      `আপনার যাত্রা ${selectedDate.toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long' })} সকাল ${selectedTime} এ নির্ধারিত হয়েছে।`,
      [{ text: 'ঠিক আছে', onPress: () => router.push('/(main)/select-ride' as any) }]
    );
  };

  const formatDateLabel = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) return 'আগামীকাল';
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>যাত্রা নির্ধারণ করুন</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>তারিখ বেছে নিন</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
            {dateOptions.map((date, index) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={[styles.dayName, isSelected && styles.selectedText]}>
                    {WEEKDAYS[date.getDay()]}
                  </Text>
                  <Text style={[styles.dayNumber, isSelected && styles.selectedText]}>
                    {date.getDate()}
                  </Text>
                  {index === 0 && (
                    <View style={styles.soonBadge}>
                      <Text style={styles.soonBadgeText}>আগামীকাল</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>সময় বেছে নিন</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((slot) => {
              const isSelected = slot === selectedTime;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
                  onPress={() => setSelectedTime(slot)}
                >
                  <Text style={[styles.timeSlotText, isSelected && styles.selectedText]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Repeat Option */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>পুনরাবৃত্তি</Text>
          <View style={styles.repeatRow}>
            {REPEAT_OPTIONS.map((opt) => {
              const isSelected = repeatOption === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.repeatOption, isSelected && styles.repeatOptionSelected]}
                  onPress={() => setRepeatOption(opt.key)}
                >
                  <Ionicons name={opt.icon} size={20} color={isSelected ? colors.surface : colors.textSecondary} />
                  <Text style={[styles.repeatText, isSelected && styles.repeatTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Ionicons name="calendar" size={20} color={colors.primary} />
          <Text style={styles.summaryText}>
            {formatDateLabel(selectedDate)}, {selectedTime} —{' '}
            {repeatOption === 'once' ? 'একবার' : repeatOption === 'daily' ? 'প্রতিদিন' : 'সাপ্তাহিক'}
          </Text>
        </View>

      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Ionicons name="calendar-outline" size={22} color={colors.surface} />
          <Text style={styles.confirmButtonText}>যাত্রা বুক করুন</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBn,
  },
  headerRight: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBn,
    marginBottom: 14,
  },
  dateRow: {
    paddingBottom: 4,
    gap: 10,
  },
  dateCard: {
    width: 64,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  dateCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayName: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyBn,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  selectedText: {
    color: colors.surface,
  },
  soonBadge: {
    marginTop: 4,
    backgroundColor: colors.accent + '25',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  soonBadgeText: {
    fontSize: 8,
    color: colors.accent,
    fontFamily: typography.fontFamilyBn,
    fontWeight: 'bold',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    minWidth: 90,
    alignItems: 'center',
  },
  timeSlotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  repeatRow: {
    flexDirection: 'row',
    gap: 10,
  },
  repeatOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  repeatOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  repeatText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyBn,
    fontWeight: '500',
  },
  repeatTextSelected: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '12',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  summaryText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: '600',
    fontFamily: typography.fontFamilyBn,
    flex: 1,
  },
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 10,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  confirmButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.surface,
    fontFamily: typography.fontFamilyBn,
  },
});
