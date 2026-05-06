import { create } from 'zustand';
import { secureStorage } from '@/services/storage';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  login: async (token, refresh) => {
    await secureStorage.setAccessToken(token);
    await secureStorage.setRefreshToken(refresh);
    set({ isAuthenticated: true });
  },
  logout: async () => {
    await secureStorage.clearAll();
    set({ isAuthenticated: false });
  },
  checkAuth: async () => {
    const token = await secureStorage.getAccessToken();
    set({ isAuthenticated: !!token, isLoading: false });
  },
}));
