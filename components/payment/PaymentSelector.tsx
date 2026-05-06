import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { PaymentMethod } from '@/types/payment';
import { Ionicons } from '@expo/vector-icons';

interface PaymentSelectorProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const PAYMENT_OPTIONS = [
  { id: 'cash' as PaymentMethod, label: 'Cash', icon: 'cash-outline', color: colors.primary },
  { id: 'bkash' as PaymentMethod, label: 'bKash', icon: 'phone-portrait-outline', color: '#E2136E' },
  { id: 'nagad' as PaymentMethod, label: 'Nagad', icon: 'phone-portrait-outline', color: '#F7931E' },
];

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({ selectedMethod, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>
      <View style={styles.optionsContainer}>
        {PAYMENT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              selectedMethod === option.id && styles.optionSelected,
              { borderColor: selectedMethod === option.id ? option.color : colors.border }
            ]}
            onPress={() => onSelect(option.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: option.color + '1A' }]}>
              <Ionicons name={option.icon as any} size={24} color={option.color} />
            </View>
            <Text style={[
              styles.optionLabel,
              selectedMethod === option.id && styles.optionLabelSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyEn,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderWidth: 2,
    backgroundColor: colors.surface,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyEn,
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
});
