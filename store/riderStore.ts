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
  setProfile: (profile: RiderProfile | null) => void;
}

export const useRiderStore = create<RiderState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));
