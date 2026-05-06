/**
 * services/payments.ts
 * Payment initiation helpers for bKash, Nagad, SSLCommerz, and Cash.
 * Source: rickshaw-rider-app-spec-cursor.md §Payment
 */

import { Linking, Alert, Platform } from 'react-native';
import api from './api';
import { PaymentMethod } from '@/types/payment';

export interface PaymentInitResult {
  ok: boolean;
  gatewayUrl?: string;
  error?: string;
}

/**
 * Initiate payment for a completed ride.
 * Returns a gateway URL for redirect-based methods (bKash, Nagad, Card)
 * or `{ ok: true }` for Cash.
 */
export const initiatePayment = async (
  rideId: string,
  method: PaymentMethod
): Promise<PaymentInitResult> => {
  try {
    const { data } = await api.post('/payment/initiate', { rideId, method });
    return { ok: true, gatewayUrl: data.gatewayUrl };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? 'Payment failed' };
  }
};

/**
 * Validate a promo code against a ride.
 * Returns the discount amount and final fare on success.
 */
export const validatePromoCode = async (
  code: string,
  rideId: string
): Promise<{ valid: boolean; discountAmount: number; finalFare: number }> => {
  try {
    const { data } = await api.post('/promo/validate', { code, rideId });
    return { valid: data.valid, discountAmount: data.discountAmount, finalFare: data.finalFare };
  } catch {
    return { valid: false, discountAmount: 0, finalFare: 0 };
  }
};

/**
 * Open the payment gateway URL in the device browser.
 * Used for bKash deep link, Nagad redirect, and SSLCommerz.
 */
export const openGateway = async (url: string): Promise<void> => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('ত্রুটি', 'পেমেন্ট গেটওয়ে খোলা যাচ্ছে না।');
    }
  } catch {
    Alert.alert('ত্রুটি', 'পেমেন্টে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
  }
};

/**
 * Fetch the PDF receipt URL for a completed ride.
 */
export const fetchReceiptUrl = async (rideId: string): Promise<string | null> => {
  try {
    const { data } = await api.get(`/payment/receipt/${rideId}`);
    return data.pdfUrl ?? null;
  } catch {
    return null;
  }
};

/**
 * Get saved payment methods from the backend.
 */
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  try {
    const { data } = await api.get('/payment/methods');
    return data.methods ?? [];
  } catch {
    return [];
  }
};
