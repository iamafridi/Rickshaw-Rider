import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

type PaymentMethod = {
  id: string;
  name: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  isDefault: boolean;
  type: 'mobile_banking' | 'card' | 'cash';
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'bkash',
    name: 'bKash',
    subtitle: '017XXXXXXXX (ব্যক্তিগত)',
    icon: 'phone-portrait-outline',
    iconColor: '#E2136E',
    isDefault: true,
    type: 'mobile_banking',
  },
  {
    id: 'nagad',
    name: 'নগদ',
    subtitle: '018XXXXXXXX',
    icon: 'phone-portrait-outline',
    iconColor: '#FF6600',
    isDefault: false,
    type: 'mobile_banking',
  },
  {
    id: 'card',
    name: 'ক্রেডিট / ডেবিট কার্ড',
    subtitle: 'SSLCommerz দিয়ে যুক্ত করুন',
    icon: 'card-outline',
    iconColor: colors.primary,
    isDefault: false,
    type: 'card',
  },
  {
    id: 'cash',
    name: 'নগদ টাকা',
    subtitle: 'যাত্রা শেষে সরাসরি প্রদান করুন',
    icon: 'cash-outline',
    iconColor: colors.success,
    isDefault: false,
    type: 'cash',
  },
];

export default function PaymentScreen() {
  const router = useRouter();
  const [methods, setMethods] = useState<PaymentMethod[]>(PAYMENT_METHODS);

  const handleSetDefault = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    );
  };

  const handleAddNew = () => {
    Alert.alert(
      'নতুন পেমেন্ট পদ্ধতি',
      'নতুন বিকাশ / নগদ নম্বর বা কার্ড যুক্ত করতে চান?',
      [
        { text: 'বিকাশ', onPress: () => {} },
        { text: 'নগদ', onPress: () => {} },
        { text: 'কার্ড (SSLCommerz)', onPress: () => {} },
        { text: 'বাতিল', style: 'cancel' },
      ]
    );
  };

  const handleRemove = (id: string) => {
    const method = methods.find((m) => m.id === id);
    if (method?.isDefault) {
      Alert.alert('ত্রুটি', 'ডিফল্ট পেমেন্ট পদ্ধতি মুছতে পারবেন না।');
      return;
    }
    Alert.alert(
      'মুছে ফেলুন',
      `আপনি কি "${method?.name}" মুছতে চান?`,
      [
        { text: 'হ্যাঁ', style: 'destructive', onPress: () => setMethods((prev) => prev.filter((m) => m.id !== id)) },
        { text: 'না', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>পেমেন্ট পদ্ধতি</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section: Saved Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>সংরক্ষিত পেমেন্ট পদ্ধতি</Text>

          {methods.map((method) => (
            <View key={method.id} style={styles.methodCard}>
              <View style={[styles.methodIconContainer, { backgroundColor: method.iconColor + '18' }]}>
                <Ionicons name={method.icon} size={26} color={method.iconColor} />
              </View>
              <View style={styles.methodInfo}>
                <View style={styles.methodNameRow}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>ডিফল্ট</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
              </View>
              <View style={styles.methodActions}>
                {!method.isDefault && (
                  <TouchableOpacity
                    style={styles.setDefaultBtn}
                    onPress={() => handleSetDefault(method.id)}
                  >
                    <Text style={styles.setDefaultText}>সেট করুন</Text>
                  </TouchableOpacity>
                )}
                {method.id !== 'cash' && !method.isDefault && (
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemove(method.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.danger} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Add new method */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <View style={styles.addButtonIcon}>
            <Ionicons name="add" size={24} color={colors.primary} />
          </View>
          <Text style={styles.addButtonText}>নতুন পেমেন্ট পদ্ধতি যোগ করুন</Text>
          <MaterialIcons name="chevron-right" size={22} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Info note */}
        <View style={styles.infoNote}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.success} />
          <Text style={styles.infoNoteText}>
            আপনার পেমেন্ট তথ্য SSL-এনক্রিপ্টেড এবং সুরক্ষিত।
          </Text>
        </View>
      </ScrollView>
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
    paddingTop: 16,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyBn,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  methodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  methodInfo: {
    flex: 1,
  },
  methodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  methodName: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBn,
  },
  defaultBadge: {
    backgroundColor: colors.primary + '18',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  defaultBadgeText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyBn,
  },
  methodSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyBn,
  },
  methodActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  setDefaultBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.primary + '15',
    borderRadius: 6,
  },
  setDefaultText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyBn,
  },
  removeBtn: {
    padding: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.primary + '50',
    borderStyle: 'dashed',
  },
  addButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  addButtonText: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: typography.fontFamilyBn,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '12',
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 8,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.success + '30',
  },
  infoNoteText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.success,
    fontFamily: typography.fontFamilyBn,
    lineHeight: 18,
  },
});
