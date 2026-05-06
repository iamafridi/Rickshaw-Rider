import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const ENV = {
  API_BASE_URL:         extra.API_BASE_URL       as string,
  API_TIMEOUT_MS:       Number(extra.API_TIMEOUT_MS ?? 15000),
  GOOGLE_MAPS_KEY:      extra.GOOGLE_MAPS_API_KEY as string,
  GOOGLE_PLACES_KEY:    extra.GOOGLE_PLACES_API_KEY as string,
  SOCKET_URL:           extra.SOCKET_URL          as string,
  SENTRY_DSN:           extra.SENTRY_DSN          as string,
  SSLCOMMERZ_STORE_ID:  extra.SSLCOMMERZ_STORE_ID as string,
  IS_SANDBOX:           extra.SSLCOMMERZ_IS_SANDBOX === 'true',
  APP_ENV:              extra.APP_ENV as 'development' | 'staging' | 'production',
} as const;
