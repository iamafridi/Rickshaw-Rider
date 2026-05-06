import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showText?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 16,
  showText = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {Array.from({ length: maxStars }).map((_, index) => {
          const isFilled = index < Math.floor(rating);
          const isHalf = !isFilled && index < rating;

          return (
            <View
              key={index}
              style={[
                styles.star,
                {
                  width: size,
                  height: size,
                  backgroundColor: isFilled ? colors.accent : isHalf ? colors.accent : colors.border,
                  opacity: isHalf ? 0.5 : 1,
                },
              ]}
            />
          );
        })}
      </View>
      {showText && (
        <Text style={[styles.ratingText, { fontSize: size }]}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  star: {
    marginRight: 2,
    borderRadius: 2, // Simple square star placeholder for now
  },
  ratingText: {
    color: colors.textSecondary,
    fontWeight: typography.weights.medium as any,
  },
});
