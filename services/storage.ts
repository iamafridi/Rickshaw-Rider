import * as SecureStore from 'expo-secure-store';
const { MMKV } = require('react-native-mmkv');

// Sensitive — encrypted by OS keychain
export const secureStorage = {
  setAccessToken:  (t: string) => SecureStore.setItemAsync('access_token', t),
  getAccessToken:  ()          => SecureStore.getItemAsync('access_token'),
  setRefreshToken: (t: string) => SecureStore.setItemAsync('refresh_token', t),
  getRefreshToken: ()          => SecureStore.getItemAsync('refresh_token'),
  clearAll:        ()          => Promise.all([
    SecureStore.deleteItemAsync('access_token'),
    SecureStore.deleteItemAsync('refresh_token'),
  ]),
};

// Fast cache — MMKV (replaces AsyncStorage for non-sensitive)
export const mmkv = new MMKV();
export const cache = {
  set:    (key: string, value: unknown) =>
            mmkv.set(key, JSON.stringify(value)),
  get:    <T>(key: string): T | null => {
    const raw = mmkv.getString(key);
    return raw ? (JSON.parse(raw) as T) : null;
  },
  delete: (key: string) => mmkv.delete(key),
  clear:  ()            => mmkv.clearAll(),
};
