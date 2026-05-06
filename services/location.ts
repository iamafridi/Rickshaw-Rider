/**
 * services/location.ts
 * GPS permission request and current position helpers.
 * Wraps expo-location (add with: npx expo install expo-location).
 */

import { Platform } from 'react-native';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** Dhaka city center — used as default when GPS unavailable */
export const DHAKA_CENTER: Coordinates = {
  latitude:  23.8103,
  longitude: 90.4125,
};

/**
 * Request foreground location permission.
 * Returns true if granted.
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    // Dynamic import so the module is optional until expo-location is installed
    const Location = await import('expo-location');
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch {
    // expo-location not installed — fall back gracefully
    console.warn('[location] expo-location not installed. Using mock location.');
    return false;
  }
};

/**
 * Get the device's current GPS position.
 * Falls back to Dhaka center if permission is denied or on error.
 */
export const getCurrentLocation = async (): Promise<Coordinates> => {
  try {
    const Location = await import('expo-location');
    const granted = await requestLocationPermission();
    if (!granted) return DHAKA_CENTER;

    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitude:  pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
  } catch {
    return DHAKA_CENTER;
  }
};

/**
 * Watch position continuously.
 * Returns a cleanup function — call it to stop watching.
 */
export const watchLocation = async (
  onUpdate: (coords: Coordinates) => void
): Promise<() => void> => {
  try {
    const Location = await import('expo-location');
    const granted = await requestLocationPermission();
    if (!granted) return () => {};

    const sub = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, timeInterval: 5000, distanceInterval: 10 },
      (pos) => onUpdate({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
    );
    return () => sub.remove();
  } catch {
    return () => {};
  }
};

/**
 * Calculate straight-line distance between two coordinates (km).
 * Uses the Haversine formula.
 */
export const haversineDistance = (a: Coordinates, b: Coordinates): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((b.latitude  - a.latitude)  * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h =
    sinLat * sinLat +
    Math.cos((a.latitude  * Math.PI) / 180) *
    Math.cos((b.latitude  * Math.PI) / 180) *
    sinLon * sinLon;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};
