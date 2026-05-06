import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function RootLayout() {
  const { checkAuth, isAuthenticated, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle Socket initialization and Global Listeners
  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    const setupSocket = async () => {
      const { initSocket } = await import('@/services/socket');
      const socket = await initSocket();

      socket.on('ride:matched', (data) => {
        router.push({ pathname: '/(main)/tracking', params: { rideId: data.rideId } });
      });

      socket.on('driver:arrived', () => {
        router.push('/(main)/driver-arrived');
      });

      socket.on('trip:started', () => {
        router.replace('/(main)/active-trip');
      });

      socket.on('trip:completed', () => {
        router.replace('/(main)/trip-complete');
      });
    };

    setupSocket();
  }, [isAuthenticated, isLoading, router]);

  // Handle Auth redirection and segments
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(main)/home');
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) return null; // Or a splash screen component

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
    </Stack>
  );
}
