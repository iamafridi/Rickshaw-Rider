import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { strings } from '../constants/strings';
import { RideType } from '../types/ride';

interface RideTypeCardProps {
  type: RideType;
  title: string;
  subtitle?: string;
  price?: string;
  isSelected: boolean;
  isSurge?: boolean;
  onPress: () => void;
}

export const RideTypeCard: React.FC<RideTypeCardProps> = ({
  type,
  title,
  subtitle,
  price,
  isSelected,
  isSurge = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        isSurge && isSelected && styles.surgeSelectedContainer
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {/* Placeholder for real illustration depending on the type */}
        <View style={styles.iconPlaceholder} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, isSelected && styles.selectedText]}>{title}</Text>
          {isSurge && (
            <View style={styles.surgeBadge}>
              <Ionicons name="flash" size={12} color={colors.surface} />
              <Text style={styles.surgeText}>High Demand</Text>
            </View>
          )}
        </View>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>

      {price && (
        <View style={styles.priceContainer}>
          <Text style={[styles.price, isSelected && styles.selectedText, isSurge && styles.surgePrice]}>{price}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedContainer: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}08`, // Slight primary tint
  },
  surgeSelectedContainer: {
    borderColor: colors.surge,
    backgroundColor: `${colors.surge}08`, 
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconPlaceholder: {
    width: 32,
    height: 32,
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
  },
  surgeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surge,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  surgeText: {
    fontSize: 10,
    color: colors.surface,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  price: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
  },
  selectedText: {
    color: colors.primary,
  },
  surgePrice: {
    color: colors.surge,
  },
});
