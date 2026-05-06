export type PaymentMethod = 'bkash' | 'nagad' | 'card' | 'cash';

export interface PaymentMethodConfig {
  type: PaymentMethod;
  label: string;
  isDefault: boolean;
  identifier?: string; // e.g. masked phone number
}
