import { useEffect } from 'react';
import { useTripStore } from '@/store/tripStore';
import { getSocket } from '@/services/socket';

/**
 * Hook to manage real-time trip tracking via Sockets.
 */
export const useTripTracking = (rideId: string | null) => {
  const { setDriverLocation, setTripStatus, setActiveTrip } = useTripStore();

  useEffect(() => {
    if (!rideId) return;

    const socket = getSocket();
    if (!socket) return;

    // Join the specific ride room
    socket.emit('ride:join', { rideId });

    socket.on('driver:location-update', (data) => {
      // data: { lat: number, lng: number }
      setDriverLocation({ latitude: data.lat, longitude: data.lng });
    });

    socket.on('ride:status-update', (data) => {
      // data: { status: string, tripData?: any }
      setTripStatus(data.status);
      if (data.tripData) {
        setActiveTrip(data.tripData);
      }
    });

    return () => {
      socket.emit('ride:leave', { rideId });
      socket.off('driver:location-update');
      socket.off('ride:status-update');
    };
  }, [rideId, setDriverLocation, setTripStatus, setActiveTrip]);
};
