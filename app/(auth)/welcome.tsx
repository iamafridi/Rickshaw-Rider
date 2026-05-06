import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>রিকশায় চড়ুন, সহজে বুক করুন</Text>
      <Text style={styles.subtitle}>Book a rickshaw in seconds. No bargaining.</Text>

      <Pressable style={styles.button} onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.buttonText}>শুরু করুন</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontFamily: typography.fontFamilyBangla,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.fontFamilyEn,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: typography.fontFamilyBangla,
    color: colors.surface,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
  }
});
