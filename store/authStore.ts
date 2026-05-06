import { create } from 'zustand';
import { secureStorage } from '@/services/storage';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (token: string, refreshToken: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async (token, refresh, user) => {
    await secureStorage.setAccessToken(token);
    await secureStorage.setRefreshToken(refresh);
    set({ isAuthenticated: true, user });
  },
  logout: async () => {
    await secureStorage.clearAll();
    set({ isAuthenticated: false, user: null });
  },
  checkAuth: async () => {
    const token = await secureStorage.getAccessToken();
    set({ isAuthenticated: !!token, isLoading: false });
  },
}));
