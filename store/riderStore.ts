import { create } from 'zustand';

export interface RiderProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  photoUrl?: string;
}

interface RiderState {
  profile: RiderProfile | null;
  location: { latitude: number; longitude: number } | null;
  nearbyDrivers: any[];
  setProfile: (profile: RiderProfile | null) => void;
  setLocation: (location: { latitude: number; longitude: number } | null) => void;
  setNearbyDrivers: (drivers: any[]) => void;
}

export const useRiderStore = create<RiderState>((set) => ({
  profile: null,
  location: null,
  nearbyDrivers: [],
  setProfile: (profile) => set({ profile }),
  setLocation: (location) => set({ location }),
  setNearbyDrivers: (nearbyDrivers) => set({ nearbyDrivers }),
}));
