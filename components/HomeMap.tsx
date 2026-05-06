import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useRiderStore } from '../store/riderStore';
import { DriverMarker } from './DriverMarker';
import { colors } from '../constants/colors';

// Default to Dhaka if no location
const DEFAULT_REGION: Region = {
  latitude: 23.8103,
  longitude: 90.4125,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

interface HomeMapProps {
  onRegionChangeComplete?: (region: Region) => void;
}

export const HomeMap: React.FC<HomeMapProps> = ({ onRegionChangeComplete }) => {
  const mapRef = useRef<MapView>(null);
  const { location, nearbyDrivers } = useRiderStore();

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={
          location 
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : DEFAULT_REGION
        }
        showsUserLocation={true}
        showsMyLocationButton={false} // We will build a custom one
        showsCompass={false}
        mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {nearbyDrivers.map((driver) => (
          <DriverMarker 
            key={driver.id} 
            driver={driver} 
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
