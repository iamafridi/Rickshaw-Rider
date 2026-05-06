import { create } from 'zustand';
import { Ride } from '@/types/ride';

interface TripState {
  activeTrip: Ride | null; // Renamed from currentTrip
  driverLocation: { latitude: number; longitude: number } | null;
  status: string | null;
  setActiveTrip: (trip: Ride | null) => void;
  setDriverLocation: (loc: { latitude: number; longitude: number } | null) => void;
  setTripStatus: (status: string | null) => void;
  clear: () => void;
}

export const useTripStore = create<TripState>((set) => ({
  activeTrip: null,
  driverLocation: null,
  status: null,
  setActiveTrip: (activeTrip) => set({ activeTrip }),
  setDriverLocation: (driverLocation) => set({ driverLocation }),
  setTripStatus: (status) => set({ status }),
  clear: () => set({ activeTrip: null, driverLocation: null, status: null }),
}));
