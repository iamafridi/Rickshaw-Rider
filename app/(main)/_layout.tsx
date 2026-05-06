import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="select-ride" options={{ presentation: 'modal' }} />
      <Stack.Screen name="confirm-booking" />
      <Stack.Screen name="matching" options={{ gestureEnabled: false }} />
      <Stack.Screen name="tracking" options={{ gestureEnabled: false }} />
      <Stack.Screen name="driver-arrived" options={{ gestureEnabled: false }} />
      <Stack.Screen name="active-trip" options={{ gestureEnabled: false }} />
      <Stack.Screen name="trip-complete" options={{ gestureEnabled: false }} />
      <Stack.Screen name="cancellation" options={{ presentation: 'modal' }} />
      
      {/* Phase 2 Screens */}
      <Stack.Screen name="profile" />
      <Stack.Screen name="history" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="emergency-contact" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="schedule" options={{ presentation: 'modal' }} />

      {/* Phase 3 Screens */}
      <Stack.Screen name="chat" />
    </Stack>
  );
}

