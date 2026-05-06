import { useEffect } from 'react';
import { useRiderStore } from '@/store/riderStore';
import api from '@/services/api';

/**
 * Hook to poll and manage nearby drivers based on user location.
 * Polls every 10 seconds.
 */
export const useNearbyDrivers = (radiusKm: number = 2) => {
  const { location, setNearbyDrivers } = useRiderStore();

  useEffect(() => {
    if (!location) return;

    const fetchDrivers = async () => {
      try {
        const { data } = await api.get('/rides/nearby-drivers', {
          params: { 
            lat: location.latitude, 
            lng: location.longitude, 
            radius: radiusKm 
          }
        });
        // data.drivers should match types/driver.ts NearbyDriver
        setNearbyDrivers(data.drivers || []);
      } catch (err) {
        console.warn('[useNearbyDrivers] Failed to fetch drivers:', err);
      }
    };

    fetchDrivers(); // Initial fetch
    const interval = setInterval(fetchDrivers, 10000); // 10s poll

    return () => clearInterval(interval);
  }, [location, radiusKm, setNearbyDrivers]);
};
