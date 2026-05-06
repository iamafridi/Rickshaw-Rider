import axios from 'axios';
import { ENV } from '@/constants/env';
import { secureStorage } from './storage';

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await secureStorage.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = await secureStorage.getRefreshToken();
      if (refresh) {
        try {
          const { data } = await axios.post(
            `${ENV.API_BASE_URL}/auth/refresh`,
            { refreshToken: refresh }
          );
          await secureStorage.setAccessToken(data.accessToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch {
          await secureStorage.clearAll();
          // authStore.logout() — handled by interceptor caller
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
