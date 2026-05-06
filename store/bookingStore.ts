import { create } from 'zustand';
import { RideType, LocationInfo } from '@/types/ride';

interface BookingState {
  rideType: RideType;
  pickup: LocationInfo | null; // Renamed from origin to pickup for consistency
  destination: LocationInfo | null;
  durationHours: number | null;
  scheduledAt: string | null;
  rideId: string | null;
  setRideType: (type: RideType) => void;
  setPickup: (pickup: LocationInfo) => void;
  setDestination: (dest: LocationInfo) => void;
  setDurationHours: (hours: number | null) => void;
  setScheduledAt: (dateString: string | null) => void;
  setRideId: (id: string | null) => void;
  clear: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  rideType: 'instant',
  pickup: null,
  destination: null,
  durationHours: null,
  scheduledAt: null,
  rideId: null,
  setRideType: (rideType) => set({ rideType }),
  setPickup: (pickup) => set({ pickup }),
  setDestination: (destination) => set({ destination }),
  setDurationHours: (durationHours) => set({ durationHours }),
  setScheduledAt: (scheduledAt) => set({ scheduledAt }),
  setRideId: (rideId) => set({ rideId }),
  clear: () => set({ 
    rideType: 'instant', 
    pickup: null, 
    destination: null, 
    durationHours: null, 
    scheduledAt: null,
    rideId: null 
  }),
}));
