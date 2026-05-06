import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'RickshawBD',
  slug: 'rickshawbd-rider',
  extra: {
    API_BASE_URL:              process.env.API_BASE_URL,
    API_TIMEOUT_MS:            process.env.API_TIMEOUT_MS,
    GOOGLE_MAPS_API_KEY:       process.env.GOOGLE_MAPS_API_KEY,
    GOOGLE_PLACES_API_KEY:     process.env.GOOGLE_PLACES_API_KEY,
    SOCKET_URL:                process.env.SOCKET_URL,
    SENTRY_DSN:                process.env.SENTRY_DSN,
    SSLCOMMERZ_STORE_ID:       process.env.SSLCOMMERZ_STORE_ID,
    SSLCOMMERZ_IS_SANDBOX:     process.env.SSLCOMMERZ_IS_SANDBOX,
    APP_ENV:                   process.env.APP_ENV,
  },
});
