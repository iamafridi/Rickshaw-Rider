import { create } from 'zustand';
import { Ride } from '@/types/ride';

interface TripState {
  currentTrip: Ride | null;
  setTrip: (trip: Ride | null) => void;
  clear: () => void;
}

export const useTripStore = create<TripState>((set) => ({
  currentTrip: null,
  setTrip: (trip) => set({ currentTrip: trip }),
  clear: () => set({ currentTrip: null }),
}));
