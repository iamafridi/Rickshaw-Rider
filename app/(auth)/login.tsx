import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login Screen</Text>
      <Pressable onPress={() => login('mock_token', 'mock_refresh')}>
        <Text style={{ marginTop: 20, padding: 10, backgroundColor: '#4CAF50', color: 'white' }}>Mock Login</Text>
      </Pressable>
    </View>
  );
}
