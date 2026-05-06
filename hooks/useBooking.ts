import { useState } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import api from '@/services/api';
import { useRouter } from 'expo-router';

/**
 * Hook to manage the ride booking lifecycle.
 */
export const useBooking = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const { rideType, pickup, destination, setRideId } = useBookingStore();
  const router = useRouter();

  const requestRide = async () => {
    if (!pickup || (!destination && rideType === 'instant')) {
      return { ok: false, error: 'Missing pickup or destination' };
    }

    setIsRequesting(true);
    try {
      const { data } = await api.post('/rides/request', {
        type: rideType,
        pickup: {
          lat: pickup.latitude,
          lng: pickup.longitude,
          address: pickup.address,
        },
        destination: destination ? {
          lat: destination.latitude,
          lng: destination.longitude,
          address: destination.address,
        } : null,
      });

      if (data.rideId) {
        setRideId(data.rideId);
        router.push('/(main)/matching');
        return { ok: true, rideId: data.rideId };
      }
      
      return { ok: false, error: 'No ride ID returned' };
    } catch (err: any) {
      console.error('[useBooking] Request failed:', err);
      return { ok: false, error: err?.response?.data?.message || 'Request failed' };
    } finally {
      setIsRequesting(false);
    }
  };

  const cancelRide = async (rideId: string, reason: string) => {
    try {
      await api.post(`/rides/${rideId}/cancel`, { reason });
      setRideId(null);
      router.replace('/(main)/home');
      return { ok: true };
    } catch (err) {
      console.error('[useBooking] Cancel failed:', err);
      return { ok: false };
    }
  };

  return {
    requestRide,
    cancelRide,
    isRequesting,
  };
};
