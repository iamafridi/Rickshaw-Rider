import { create } from 'zustand';
import { RideType, LocationInfo } from '@/types/ride';

interface BookingState {
  rideType: RideType;
  origin: LocationInfo | null;
  destination: LocationInfo | null;
  durationHours: number | null;
  scheduledAt: string | null;
  setRideType: (type: RideType) => void;
  setOrigin: (origin: LocationInfo) => void;
  setDestination: (dest: LocationInfo) => void;
  setDurationHours: (hours: number | null) => void;
  setScheduledAt: (dateString: string | null) => void;
  clear: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  rideType: 'instant',
  origin: null,
  destination: null,
  durationHours: null,
  scheduledAt: null,
  setRideType: (rideType) => set({ rideType }),
  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  setDurationHours: (durationHours) => set({ durationHours }),
  setScheduledAt: (scheduledAt) => set({ scheduledAt }),
  clear: () => set({ rideType: 'instant', origin: null, destination: null, durationHours: null, scheduledAt: null }),
}));
