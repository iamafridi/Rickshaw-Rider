import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isBangla, setIsBangla] = React.useState(true);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/welcome' as any);
  };

  const handleBack = () => {
    router.back();
  };

  const renderMenuItem = (icon: keyof typeof Ionicons.glyphMap, title: string, onPress: () => void, rightElement?: React.ReactNode) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={24} color={colors.textPrimary} />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      {rightElement || <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>আমার প্রোফাইল</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color={colors.textSecondary} />
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.userName}>{user?.name || 'ব্যবহারকারী'}</Text>
            <Text style={styles.userPhone}>{user?.phone || '01XXXXXXXXX'}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>সম্পাদনা করুন</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rickshaw Rewards & Corporate Account */}
        <View style={styles.section}>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="star" size={24} color={colors.accent} />
              <View style={{ marginLeft: 16 }}>
                <Text style={styles.menuItemText}>Rickshaw Rewards</Text>
                <Text style={styles.addressSubtitle}>450 Points</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </View>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="briefcase-outline" size={24} color={colors.textPrimary} />
              <Text style={styles.menuItemText}>Corporate Account</Text>
            </View>
            <Switch
              value={false}
              onValueChange={() => {}}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

        {/* Saved Addresses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>সংরক্ষিত ঠিকানা</Text>
          <View style={styles.addressItem}>
            <Ionicons name="home" size={20} color={colors.primary} />
            <View style={styles.addressTextContainer}>
              <Text style={styles.addressTitle}>বাড়ি</Text>
              <Text style={styles.addressSubtitle}>ধানমন্ডি ৭</Text>
            </View>
            <TouchableOpacity><Text style={styles.linkText}>Edit</Text></TouchableOpacity>
          </View>
          <View style={styles.addressItem}>
            <Ionicons name="business" size={20} color={colors.primary} />
            <View style={styles.addressTextContainer}>
              <Text style={styles.addressTitle}>অফিস</Text>
              <Text style={styles.addressSubtitle}>গুলশান ২</Text>
            </View>
            <TouchableOpacity><Text style={styles.linkText}>Edit</Text></TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          {renderMenuItem('time-outline', 'যাত্রার ইতিহাস', () => router.push('/(main)/history'))}
          {renderMenuItem('card-outline', 'পেমেন্ট পদ্ধতি', () => router.push('/(main)/payment'))}
          {renderMenuItem('warning-outline', 'জরুরি যোগাযোগ', () => router.push('/(main)/emergency-contact'))}
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="language-outline" size={24} color={colors.textPrimary} />
              <Text style={styles.menuItemText}>ভাষা (Language)</Text>
            </View>
            <View style={styles.languageToggle}>
              <Text style={[styles.langText, isBangla && styles.langTextActive]}>বাং</Text>
              <Switch
                value={!isBangla}
                onValueChange={(val) => setIsBangla(!val)}
                trackColor={{ false: colors.primary, true: colors.primary }}
                thumbColor={colors.surface}
              />
              <Text style={[styles.langText, !isBangla && styles.langTextActive]}>EN</Text>
            </View>
          </View>

          {renderMenuItem('notifications-outline', 'নোটিফিকেশন সেটিং', () => {})}
          {renderMenuItem('help-circle-outline', 'সহায়তা', () => {})}
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.error} />
            <Text style={styles.logoutText}>লগআউট</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBn,
  },
  headerRight: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: colors.surface,
    marginBottom: 12,
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  profileDetails: {
    flex: 1,
  },
  userName: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
    fontFamily: typography.fontFamilyBn,
  },
  userPhone: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyBn,
  },
  section: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginLeft: 20,
    marginBottom: 12,
    fontFamily: typography.fontFamilyBn,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  addressTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  addressTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBn,
  },
  addressSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyBn,
    marginTop: 2,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    marginLeft: 16,
    fontFamily: typography.fontFamilyBn,
  },
  languageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginHorizontal: 4,
  },
  langTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  logoutText: {
    fontSize: typography.sizes.md,
    color: colors.error,
    marginLeft: 16,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyBn,
  },
});
