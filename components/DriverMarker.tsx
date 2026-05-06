import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';
import { colors } from '../constants/colors';
import { DriverLocation } from '../types/driver';

interface DriverMarkerProps {
  driver: DriverLocation;
  onPress?: () => void;
}

export const DriverMarker: React.FC<DriverMarkerProps> = ({ driver, onPress }) => {
  return (
    <Marker
      coordinate={{
        latitude: driver.latitude,
        longitude: driver.longitude,
      }}
      anchor={{ x: 0.5, y: 0.5 }}
      onPress={onPress}
      tracksViewChanges={false} // Performance optimization
    >
      <View style={styles.markerContainer}>
        <View style={styles.dot} />
        {/* Placeholder for actual rickshaw icon */}
        <View style={styles.iconPlaceholder}>
          <View style={styles.iconInner} />
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.2)', // Light available green
    borderWidth: 1,
    borderColor: colors.available,
  },
  iconPlaceholder: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  iconInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
