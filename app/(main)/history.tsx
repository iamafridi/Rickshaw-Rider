import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

type Tab = 'upcoming' | 'completed' | 'cancelled';

export default function HistoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('completed');

  const handleBack = () => {
    router.back();
  };

  const generateReceipt = async () => {
    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1A1A1A; }
            .header { text-align: center; border-bottom: 2px solid #1B5E20; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 36px; color: #1B5E20; margin: 0; }
            .subtitle { font-size: 18px; color: #666666; margin-top: 5px; }
            .details { font-size: 18px; line-height: 1.6; }
            .row { display: flex; justify-content: space-between; border-bottom: 1px solid #EEEEEE; padding: 15px 0; }
            .label { font-weight: bold; color: #666666; }
            .value { font-weight: bold; }
            .total { font-size: 24px; color: #1B5E20; margin-top: 20px; }
            .footer { text-align: center; margin-top: 50px; font-size: 14px; color: #9E9E9E; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">RickshawBD</h1>
            <p class="subtitle">Ride Receipt</p>
          </div>
          <div class="details">
            <div class="row">
              <span class="label">Date</span>
              <span class="value">০৮ এপ্রিল ২০২৬ · ১১:৩০</span>
            </div>
            <div class="row">
              <span class="label">From</span>
              <span class="value">ধানমন্ডি ৭</span>
            </div>
            <div class="row">
              <span class="label">To</span>
              <span class="value">নিউ মার্কেট</span>
            </div>
            <div class="row">
              <span class="label">Driver</span>
              <span class="value">রহিম মিয়া</span>
            </div>
            <div class="row total">
              <span>Total Fare</span>
              <span>৳ ৫৫</span>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for riding with RickshawBD!</p>
          </div>
        </body>
      </html>
    `;
    
    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Sharing not available", "Cannot share the receipt on this device.");
      }
    } catch (error) {
      console.error("Failed to generate receipt", error);
      Alert.alert("Error", "Failed to generate receipt.");
    }
  };

  const renderTab = (tab: Tab, label: string) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === tab && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderRideCard = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.routeContainer}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.routeText}>ধানমন্ডি ৭ → নিউ মার্কেট</Text>
        </View>
        <Text style={styles.priceText}>৳ ৫৫</Text>
      </View>
      
      <View style={styles.cardDetails}>
        <Text style={styles.detailText}>০৮ এপ্রিল ২০২৬ · ১১:৩০</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>✅ সম্পন্ন</Text>
        </View>
      </View>

      <View style={styles.driverInfo}>
        <View style={styles.driverAvatar}>
          <Ionicons name="person" size={20} color={colors.textSecondary} />
        </View>
        <View>
          <Text style={styles.driverName}>রহিম মিয়া</Text>
          <Text style={styles.ratingText}>⭐ আপনি দিয়েছেন ৫</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={[styles.actionButton, { marginRight: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]} onPress={generateReceipt}>
          <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.actionButtonText, { color: colors.textSecondary }]}>রসিদ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="refresh" size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>আবার বুক করুন</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>যাত্রার ইতিহাস</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.tabContainer}>
        {renderTab('upcoming', 'আসন্ন')}
        {renderTab('completed', 'সম্পন্ন')}
        {renderTab('cancelled', 'বাতিল')}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'completed' ? (
          <>
            {renderRideCard()}
            {renderRideCard()}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={64} color={colors.border} />
            <Text style={styles.emptyStateText}>কোনো রাইড পাওয়া যায়নি</Text>
          </View>
        )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyBn,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routeText: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 8,
    fontFamily: typography.fontFamilyBn,
  },
  priceText: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyBn,
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: typography.sizes.sm,
    color: '#2E7D32',
    fontFamily: typography.fontFamilyBn,
    fontWeight: 'bold',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    marginBottom: 16,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  driverName: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBn,
    marginBottom: 2,
  },
  ratingText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyBn,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 8,
    fontFamily: typography.fontFamilyBn,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyBn,
  },
});
