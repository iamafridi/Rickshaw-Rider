import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { strings } from '../constants/strings';

interface SOSButtonProps {
  onPress?: () => void;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ onPress }) => {
  const [isPressing, setIsPressing] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      Alert.alert(
        strings.sos.emergency,
        strings.sos.callPolice,
        [
          { text: strings.sos.cancel, style: 'cancel' },
          { text: strings.sos.callPolice, onPress: () => Linking.openURL('tel:999'), style: 'destructive' }
        ]
      );
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, isPressing && styles.pressing]} 
      onPress={handlePress}
      onPressIn={() => setIsPressing(true)}
      onPressOut={() => setIsPressing(false)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>SOS</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.danger,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  pressing: {
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.1,
    elevation: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: colors.surface,
    fontWeight: typography.weights.bold as any,
    fontSize: typography.sizes.md,
  },
});
