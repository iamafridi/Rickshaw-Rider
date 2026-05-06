import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { strings } from '../constants/strings';

interface FareBreakdownProps {
  baseFare: number;
  distanceFare: number;
  timeFare?: number;
  surgeMultiplier?: number;
  discount?: number;
  totalFare: number;
}

export const FareBreakdown: React.FC<FareBreakdownProps> = ({
  baseFare,
  distanceFare,
  timeFare = 0,
  surgeMultiplier = 1,
  discount = 0,
  totalFare,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Fare Breakdown</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Base Fare</Text>
        <Text style={styles.value}>৳{baseFare}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Distance</Text>
        <Text style={styles.value}>৳{distanceFare}</Text>
      </View>
      
      {timeFare > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>৳{timeFare}</Text>
        </View>
      )}

      {surgeMultiplier > 1 && (
        <View style={styles.row}>
          <Text style={[styles.label, styles.surgeColor]}>Surge ({surgeMultiplier}x)</Text>
          <Text style={[styles.value, styles.surgeColor]}>
            +৳{Math.round((baseFare + distanceFare + timeFare) * (surgeMultiplier - 1))}
          </Text>
        </View>
      )}

      {discount > 0 && (
        <View style={styles.row}>
          <Text style={[styles.label, styles.discountColor]}>Discount</Text>
          <Text style={[styles.value, styles.discountColor]}>-৳{discount}</Text>
        </View>
      )}

      <View style={styles.divider} />
      
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Fare</Text>
        <Text style={styles.totalValue}>৳{totalFare}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  value: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  surgeColor: {
    color: colors.surge,
  },
  discountColor: {
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
    color: colors.primary,
  },
});
