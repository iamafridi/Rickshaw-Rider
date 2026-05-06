# 🛺 RickshawBD — Rider App Specification (Complete)
### For: Cursor Agent
### Platform: Android + iOS (React Native + Expo)
### Language: TypeScript | Bangla-first UI

---

## PROJECT OVERVIEW

You are building the **Rider-side mobile app** for RickshawBD — Bangladesh's first dedicated rickshaw ride-hailing platform. Riders book instant rides, hourly rentals, and scheduled pickups. The app serves daily commuters, couples on leisure rides, and corporate users across Dhaka and Chittagong.

**Design goal:** Map-first. Bangla-first. Trustworthy. Feels like it belongs to Bangladesh, not Silicon Valley.

---

## ENVIRONMENT & CREDENTIALS

All credentials live in `.env` at the project root. **Never hardcode any key anywhere.**

### `.env` (never commit — in `.gitignore`)
```env
# App
APP_ENV=development
APP_VERSION=1.0.0

# Backend
API_BASE_URL=https://api.rickshawbd.com/v1
API_TIMEOUT_MS=15000

# Google Maps + Places
GOOGLE_MAPS_API_KEY=your_google_maps_key_here
GOOGLE_PLACES_API_KEY=your_google_places_key_here

# Firebase
FIREBASE_PROJECT_ID=rickshawbd
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_API_KEY=your_firebase_api_key

# Socket
SOCKET_URL=wss://socket.rickshawbd.com

# Sentry
SENTRY_DSN=your_sentry_dsn

# SSLCommerz (card payments)
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_IS_SANDBOX=true
```

### `.env.example` (commit this)
Same keys, all values empty.

### `constants/env.ts`
```ts
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
```

### `app.config.ts`
```ts
export default {
  expo: {
    name: 'RickshawBD',
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
  },
};
```

---

## SECURITY — PASSWORDS & TOKENS

**Passwords are NEVER stored on this app.** Auth is phone OTP + Google OAuth only.

On the **backend**, all admin/agent passwords are hashed with **bcrypt cost factor 12**. The rider app never touches raw passwords.

**Token storage — `services/storage.ts`:**
```ts
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';

// Sensitive — encrypted by OS keychain
export const secureStorage = {
  setAccessToken:  (t: string) => SecureStore.setItemAsync('access_token', t),
  getAccessToken:  ()          => SecureStore.getItemAsync('access_token'),
  setRefreshToken: (t: string) => SecureStore.setItemAsync('refresh_token', t),
  getRefreshToken: ()          => SecureStore.getItemAsync('refresh_token'),
  clearAll:        ()          => Promise.all([
    SecureStore.deleteItemAsync('access_token'),
    SecureStore.deleteItemAsync('refresh_token'),
  ]),
};

// Fast cache — MMKV (replaces AsyncStorage for non-sensitive)
export const mmkv = new MMKV();
export const cache = {
  set:    (key: string, value: unknown) =>
            mmkv.set(key, JSON.stringify(value)),
  get:    <T>(key: string): T | null => {
    const raw = mmkv.getString(key);
    return raw ? (JSON.parse(raw) as T) : null;
  },
  delete: (key: string) => mmkv.delete(key),
  clear:  ()            => mmkv.clearAll(),
};
```

---

## TECH STACK

| Layer | Technology |
|---|---|
| Framework | React Native (Expo SDK 51) |
| Language | TypeScript (strict mode) |
| State | Zustand |
| Navigation | React Navigation v6 |
| Maps | react-native-maps + Google Maps SDK |
| Data Fetching | React Query (TanStack Query v5) |
| Real-time | Socket.IO client v4 |
| Push | Firebase Cloud Messaging (expo-notifications) |
| Secure Storage | expo-secure-store (JWT) |
| Fast Cache | react-native-mmkv |
| HTTP | Axios + interceptors |
| Auth | JWT + Google Sign-In + Phone OTP |
| Payments | bKash Deep Link + Nagad API + SSLCommerz |
| Analytics | Mixpanel |
| Error Tracking | Sentry |
| Deep Links | expo-linking |
| Image | expo-image-picker |

---

## FOLDER STRUCTURE

```
rickshaw-rider/
├── .env
├── .env.example
├── app.config.ts
├── app/
│   ├── _layout.tsx                   ← Auth check, deep links, force update
│   ├── (auth)/
│   │   ├── welcome.tsx               ← Onboarding slides
│   │   ├── login.tsx
│   │   └── verify-phone.tsx
│   └── (main)/
│       ├── _layout.tsx               ← Tab bar
│       ├── home.tsx                  ← Map + booking entry
│       ├── booking/
│       │   ├── select-ride.tsx       ← Instant / Hourly / Schedule cards
│       │   ├── confirm.tsx           ← Fare breakdown + book CTA
│       │   └── hourly.tsx            ← Hourly duration picker
│       ├── matching.tsx              ← Radar animation waiting for driver
│       ├── tracking.tsx              ← Driver on way to pickup
│       ├── driver-arrived.tsx        ← "Your driver is here!" screen
│       ├── trip-active.tsx           ← In-ride screen
│       ├── trip-complete.tsx         ← Rating + receipt
│       ├── schedule.tsx              ← Schedule a ride
│       ├── history.tsx               ← Past rides
│       ├── profile.tsx               ← Rider profile + settings
│       ├── emergency-contact.tsx     ← Set SOS contact
│       ├── payment.tsx               ← Payment methods
│       ├── notifications.tsx         ← Notification center
│       └── support.tsx
├── components/
│   ├── map/
│   │   ├── HomeMap.tsx
│   │   ├── DriverMarker.tsx          ← Animated SVG rickshaw icon
│   │   └── RoutePolyline.tsx
│   ├── booking/
│   │   ├── RideTypeCard.tsx
│   │   ├── FareBreakdown.tsx
│   │   └── DriverPreviewCard.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── SearchBar.tsx
│   │   ├── RatingStars.tsx
│   │   ├── SkeletonLoader.tsx        ← No spinners, skeleton only
│   │   └── PromoCodeInput.tsx        ← In confirm screen (Phase 2 activates)
│   ├── shared/
│   │   ├── SafeRideShare.tsx
│   │   ├── SOSButton.tsx
│   │   ├── UpdatePrompt.tsx          ← Force update modal
│   │   └── ErrorState.tsx
│   └── notifications/
│       └── NotificationCard.tsx
├── services/
│   ├── api.ts
│   ├── socket.ts
│   ├── location.ts
│   ├── payments.ts
│   ├── notifications.ts
│   └── storage.ts
├── store/
│   ├── authStore.ts
│   ├── riderStore.ts
│   ├── bookingStore.ts
│   ├── tripStore.ts
│   └── notificationStore.ts
├── hooks/
│   ├── useNearbyDrivers.ts
│   ├── useBooking.ts
│   ├── useTripTracking.ts
│   ├── usePayment.ts
│   └── useAppVersion.ts
├── constants/
│   ├── strings.ts                    ← All Bangla + English strings
│   ├── colors.ts
│   ├── typography.ts
│   ├── env.ts
│   └── routes.ts
└── types/
    ├── ride.ts
    ├── driver.ts
    ├── payment.ts
    ├── notification.ts
    └── api.ts
```

---

## AXIOS INSTANCE — `services/api.ts`

```ts
import axios from 'axios';
import { ENV } from '@/constants/env';
import { secureStorage } from './storage';

const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await secureStorage.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = await secureStorage.getRefreshToken();
      if (refresh) {
        try {
          const { data } = await axios.post(
            `${ENV.API_BASE_URL}/auth/refresh`,
            { refreshToken: refresh }
          );
          await secureStorage.setAccessToken(data.accessToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch {
          await secureStorage.clearAll();
          // authStore.logout() — handled by interceptor caller
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## SCREENS — DETAILED SPEC

### 1. ROOT LAYOUT (`app/_layout.tsx`)

On app open:
1. Show splash with logo
2. `secureStorage.getAccessToken()`
3. If token → `GET /rider/me`
   - `forceUpdate: true` → show `UpdatePrompt` modal (blocking)
   - Profile incomplete → `(auth)/welcome`
   - Active → `(main)/home`
4. If 401 → try refresh → fail → `(auth)/login`
5. No token → `(auth)/welcome`

Deep link routing:
```ts
// rickshawbd://ride/:rideId        → tracking or trip-active (check status)
// rickshawbd://history             → (main)/history
// rickshawbd://notifications       → (main)/notifications
// rickshawbd://track/:shareToken   → public web page (no app needed)
```

---

### 2. WELCOME / ONBOARDING (`(auth)/welcome.tsx`)

3 swipeable slides. Skip button top-right on slides 1–2.

**Slide 1:**
- Illustration: Rickshaw on Dhaka street (hand-drawn style SVG)
- **"রিকশায় চড়ুন, সহজে বুক করুন"**
- Sub: Book a rickshaw in seconds. No bargaining.

**Slide 2:**
- Illustration: Couple on a scenic rickshaw ride
- **"ঘণ্টায় বুক করুন"**
- Sub: Rent by the hour. Perfect for couples, sightseeing, shopping.

**Slide 3:**
- Illustration: Phone showing map + driver profile
- **"নিরাপদ, বিশ্বস্ত চালক"**
- Sub: Verified drivers. Live tracking. Share with family.

CTA: **"শুরু করুন"** → `login.tsx`

---

### 3. LOGIN (`(auth)/login.tsx`)

```
┌──────────────────────────────┐
│       🛺 RickshawBD          │
├──────────────────────────────┤
│  [ 📱 ফোন নম্বর দিয়ে লগইন ] │  ← Expands phone input
│  ─── অথবা ───               │
│  [ G  Google দিয়ে চালু করুন ]│
│  [ f  Facebook দিয়ে চালু করুন]│
└──────────────────────────────┘
```

Phone input: BD format `01XXXXXXXXX` with 🇧🇩 flag. On submit → `POST /auth/rider/send-otp`.

---

### 4. OTP VERIFY (`(auth)/verify-phone.tsx`)

```
┌──────────────────────────────┐
│  ← ফিরে যান                 │
│  কোড পাঠানো হয়েছে          │
│  01XXXXXXX নম্বরে           │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐
│  6-digit OTP boxes           │
│  পুনরায় পাঠান (00:45)       │
│  [ নিশ্চিত করুন ]           │
└──────────────────────────────┘
```

Auto-read SMS. Wrong OTP: shake + error. 3 fails → 10-minute lock.
On success → `(main)/home`.

---

### 5. HOME (`(main)/home.tsx`)

The map IS the home screen. All booking flows open as bottom sheets ON TOP of the map.

```
┌──────────────────────────────┐
│  🛺 RickshawBD  [🔔 2][👤]  │
│─────────────────────────────│
│                              │
│   [FULL SCREEN MAP]          │
│                              │
│   🛺🛺🛺 ← nearby drivers   │
│   📍 ← user pin              │
│   "🛺 ৮টি রিকশা কাছে আছে" │  ← count badge (top of map)
│                              │
│                              │
│─────────────────────────────│
│ ┌────────────────────────┐  │
│ │ 📍 আপনি কোথায় যাবেন? │  │  ← Search bar → bottom sheet
│ └────────────────────────┘  │
│ [সরাসরি] [ঘণ্টায়] [আগাম]  │  ← Tab chips
└──────────────────────────────┘
```

**Nearby drivers:** Poll `GET /rides/nearby-drivers` every 10s. Animated rickshaw SVG marker for each driver.

**Ride type tabs:**
- **সরাসরি** (Instant) — point to point
- **ঘণ্টায়** (By Hour) — 1–4 hour rental
- **আগাম** (Schedule) — future booking

🔔 shows unread notification count.

---

### 6. DESTINATION SEARCH (Bottom Sheet)

Slides up from search bar tap. Overlays the map.

```
┌──────────────────────────────┐
│  [Search input — autofocus]  │
│─────────────────────────────│
│  🏠 বাড়ি          [Edit]     │  ← Saved home
│  🏢 অফিস          [Edit]     │  ← Saved work
│  ⭐ প্রিয় জায়গা              │
│─────────────────────────────│
│  🕐 ধানমন্ডি ৭               │  ← Recent
│  🕐 গুলশান ২                 │
│─────────────────────────────│
│  [Google Places results...]  │
└──────────────────────────────┘
```

Google Places Autocomplete filtered to Bangladesh. Results in Bangla where available. After selection → `booking/select-ride.tsx`.

---

### 7. SELECT RIDE TYPE (`(main)/booking/select-ride.tsx`)

```
┌──────────────────────────────┐
│  ← ধানমন্ডি ৭ → নিউ মার্কেট│
│──────────────────────────────│
│  [Route on map]              │
│  দূরত্ব: ২.৩ কিমি · ~১৫ মিনিট│
│──────────────────────────────│
│  ┌──────────────────────┐   │
│  │ 🛺 সরাসরি যাত্রা     │   │
│  │  ৳ 50–60 · ETA: 4min │   │
│  │  ৩টি রিকশা কাছে ✅   │   │
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │ ⏰ ঘণ্টায় ভাড়া       │   │
│  │  ৳ 150/ঘণ্টা · min 1h│   │
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │ 📅 আগাম বুকিং        │   │
│  │  কাল সকালের জন্য     │   │
│  └──────────────────────┘   │
└──────────────────────────────┘
```

Show **surge indicator** if peak hours active:
```
│  ⚠️ পিক আওয়ার — ভাড়া ১.৩x  │
```
Never surprise rider with surge after booking. Always show before confirm.

---

### 8. CONFIRM BOOKING (`(main)/booking/confirm.tsx`)

**Instant ride:**
```
┌──────────────────────────────┐
│  যাত্রা নিশ্চিত করুন        │
│──────────────────────────────│
│  📍 ধানমন্ডি ৭              │
│  🎯 নিউ মার্কেট              │
│──────────────────────────────│
│  💰 ভাড়া: ৳ ৫৫              │
│  ⏱  সময়: ~১৫ মিনিট         │
│  📏 দূরত্ব: ২.৩ কিমি        │
│  [⚠️ পিক আওয়ার: ১.৩x]       │  ← Only if surge active
│──────────────────────────────│
│  💳 bKash ✅  [পরিবর্তন]     │
│──────────────────────────────│
│  ভাড়ার বিস্তারিত ▼           │  ← Accordion
│    বেস ভাড়া:    ৳ 30        │
│    দূরত্ব:      ৳ 22        │
│    প্ল্যাটফর্ম: ৳ 3         │
│──────────────────────────────│
│  🏷️ প্রমো কোড আছে? [যোগ করুন]│  ← Always present (Phase 2 activates)
│──────────────────────────────│
│  [ 🛺 রিকশা বুক করুন ]       │  ← Big CTA
└──────────────────────────────┘
```

On book → `POST /api/ride/request` → `(main)/matching.tsx`.

**Hourly:**
- Duration chips: [১ ঘণ্টা] [২ ঘণ্টা] [৩ ঘণ্টা] [৪ ঘণ্টা]
- Price updates live as chip is selected
- No destination required

---

### 9. MATCHING SCREEN (`(main)/matching.tsx`)

Shown after booking while waiting for driver assignment.

```
┌──────────────────────────────┐
│                              │
│  [MAP with pulsing radar     │
│   animation from user pin]   │
│                              │
│──────────────────────────────│
│  রিকশা খোঁজা হচ্ছে...       │
│  [Animated dots]             │
│                              │
│  [ ❌ বাতিল করুন ]           │  ← Free cancel before match
└──────────────────────────────┘
```

`socket.on('ride:matched')` → navigate to `tracking.tsx`.
`socket.on('ride:no-match')` after 60s → show: **"কাছে কোনো রিকশা নেই। পরে চেষ্টা করুন।"** + retry button.

---

### 10. TRACKING (`(main)/tracking.tsx`)

Driver is on way to pickup.

```
┌──────────────────────────────┐
│  [FULL MAP]                  │
│  🛺 ← animated driver marker│
│  📍 ← your pickup pin        │
│  [Route line between them]   │
│──────────────────────────────│
│  রিকশা আসছে 🛺              │
│  আসতে সময়: ৪ মিনিট         │
│──────────────────────────────│
│  [Photo] রহিম মিয়া  ⭐ 4.8  │
│  ⚡ বৈদ্যুতিক · DH-1234      │
│  [ 📞 কল করুন ] [ 💬 মেসেজ ]│  ← Masked call + in-app SMS
│──────────────────────────────│
│  [🔗 রাইড শেয়ার করুন]        │
│  [🚨 SOS]                    │
│──────────────────────────────│
│  [ ❌ বাতিল করুন ]           │  ← Free < 2 min, fee after
└──────────────────────────────┘
```

`socket.on('driver:location-update')` → move marker.
`socket.on('driver:arrived')` → navigate to `driver-arrived.tsx`.

---

### 11. DRIVER ARRIVED (`(main)/driver-arrived.tsx`)

This screen is critical — the transition moment when driver reaches pickup.

```
┌──────────────────────────────┐
│                              │
│        🛺  ✅                │
│                              │
│  রিকশা এসে গেছে!             │
│  Your rickshaw is here!      │
│                              │
│  রহিম মিয়া আপনার জন্য       │
│  অপেক্ষা করছেন              │
│                              │
│  DH-1234 · ⚡ বৈদ্যুতিক     │
│                              │
│  [ 📞 কল করুন ]             │
│                              │
└──────────────────────────────┘
```

Auto-transitions to `trip-active.tsx` when `socket.on('trip:started')` fires (driver confirms boarding).

---

### 12. ACTIVE TRIP (`(main)/trip-active.tsx`)

```
┌──────────────────────────────┐
│  [MAP — route to destination]│
│  🛺 moving icon              │
│──────────────────────────────│
│  যাত্রা চলছে 🛺              │
│  গন্তব্য: নিউ মার্কেট       │
│  বাকি: ~৮ মিনিট             │
│  💰 ভাড়া: ৳ ৫৫              │
│──────────────────────────────│
│  [🔗 রাইড শেয়ার করুন]        │
│  [🚨 SOS]                    │
└──────────────────────────────┘
```

**Hourly mode:**
```
│  ⏱ বাকি সময়: ৩৫ মিনিট     │
│  [ +৩০ মিনিট বাড়ান ]        │  ← Extend (extra charge shown)
```

`socket.on('trip:completed')` → `trip-complete.tsx`.

---

### 13. TRIP COMPLETE (`(main)/trip-complete.tsx`)

```
┌──────────────────────────────┐
│  ✅ যাত্রা সম্পন্ন!          │
│──────────────────────────────│
│  ধানমন্ডি ৭ → নিউ মার্কেট  │
│  ২.৩ কিমি · ১৩ মিনিট        │
│──────────────────────────────│
│  💰 মোট: ৳ ৫৫               │
│  ✅ bKash থেকে পরিশোধিত     │
│     [or: নগদে পরিশোধ করুন]  │  ← If cash
│──────────────────────────────│
│  রহিম মিয়াকে রেটিং দিন     │
│  ⭐ ⭐ ⭐ ⭐ ⭐               │
│  [মন্তব্য লিখুন... (ঐচ্ছিক)]│
│──────────────────────────────│
│  [ ✅ সম্পন্ন করুন ]         │
│  [ 🧾 রসিদ দেখুন ]          │
└──────────────────────────────┘
```

Cash payment: shows "Please pay ৳55 to driver" clearly before rating. `POST /ride/:id/rate` on submit → Home. Receipt: `GET /payment/receipt/:rideId` → PDF URL.

---

### 14. CANCELLATION FLOW

Triggered from "বাতিল করুন" on tracking screen.

**Free period (< 2 min after driver assigned):**
```
┌──────────────────────────────┐
│  যাত্রা বাতিল করবেন?        │
│  বাতিলের কারণ:              │
│  ○ অপেক্ষা সময় বেশি        │
│  ○ ভুল লোকেশন দিয়েছিলাম   │
│  ○ মন পরিবর্তন              │
│  ○ অন্য কারণ                │
│  [ বাতিল নিশ্চিত করুন ]     │  ← No fee
│  [ ফিরে যান ]               │
└──────────────────────────────┘
```

**After free period (> 2 min):**
```
┌──────────────────────────────┐
│  ⚠️ বাতিল ফি প্রযোজ্য       │
│  চালক ইতিমধ্যে আসছেন।       │
│  বাতিল ফি: ৳ ১৫             │
│  [ তবুও বাতিল করুন ]        │
│  [ ফিরে যান ]               │
└──────────────────────────────┘
```

`POST /ride/:id/cancel` `{ reason }` → `{ refundStatus, cancellationFee }`.

---

### 15. SCHEDULE RIDE (`(main)/schedule.tsx`)

```
┌──────────────────────────────┐
│  আগাম বুকিং                 │
│──────────────────────────────│
│  📍 পিকআপ: [Search]         │
│  🎯 গন্তব্য: [Search]        │
│──────────────────────────────│
│  📅 তারিখ: [Date Picker]     │
│  ⏰ সময়:  [Time Picker]      │
│──────────────────────────────│
│  🔁 পুনরাবৃত্তি:             │
│  [একবার] [প্রতিদিন] [সাপ্তাহিক]│
│──────────────────────────────│
│  আনুমানিক ভাড়া: ৳ ৫০–৬০    │
│──────────────────────────────│
│  [ 📅 বুক করুন ]             │
└──────────────────────────────┘
```

`POST /ride/schedule` → confirmation screen → push reminder 15 min before.

---

### 16. RIDE HISTORY (`(main)/history.tsx`)

```
┌──────────────────────────────┐
│  যাত্রার ইতিহাস              │
│  [আসন্ন] [সম্পন্ন] [বাতিল]  │
│──────────────────────────────│
│  📅 ০৮ এপ্রিল ২০২৬          │
│  ┌───────────────────────┐  │
│  │ ধানমন্ডি→নিউ মার্কেট │  │
│  │ ৳ 55 · ১১:৩০ · ✅    │  │
│  │ রহিম মিয়া ⭐ আপনি দিয়েছেন 5│
│  │ [ 🔁 আবার বুক করুন ] │  │  ← Repeat booking shortcut
│  └───────────────────────┘  │
└──────────────────────────────┘
```

Each card: route, fare, date, driver, rider's own rating given, repeat booking button, receipt link.

---

### 17. RIDER PROFILE (`(main)/profile.tsx`)

Previously missing — now fully spec'd.

```
┌──────────────────────────────┐
│  আমার প্রোফাইল               │
│──────────────────────────────│
│  [Photo] নাম সম্পাদনা ✏️     │
│  ফোন: 01XXXXXXXX            │
│  ইমেইল: [optional, editable] │
│──────────────────────────────│
│  📍 সংরক্ষিত ঠিকানা         │
│  🏠 বাড়ি: ধানমন্ডি ৭  [Edit] │
│  🏢 অফিস: গুলশান ২   [Edit] │
│  [+ ঠিকানা যোগ করুন]        │
│──────────────────────────────│
│  🚨 জরুরি যোগাযোগ           │
│  আম্মু: 01XXXXXXXX   [Edit]  │  ← SOS contact
│──────────────────────────────│
│  🌐 ভাষা: [বাংলা] [English]  │  ← Language toggle
│  🔔 নোটিফিকেশন সেটিং        │
│  💳 পেমেন্ট পদ্ধতি           │
│  ❓ সহায়তা                  │
│  🔒 লগআউট                   │
└──────────────────────────────┘
```

Language toggle: `cache.set('language', 'bn' | 'en')` → all strings switch immediately.

---

### 18. EMERGENCY CONTACT (`(main)/emergency-contact.tsx`)

Previously missing — now fully spec'd.

```
┌──────────────────────────────┐
│  জরুরি যোগাযোগ               │
│──────────────────────────────│
│  রাইড শেয়ার করলে এই নম্বরে  │
│  স্বয়ংক্রিয় SMS যাবে।       │
│──────────────────────────────│
│  নাম *                       │
│  [____________________]      │
│                              │
│  মোবাইল নম্বর *              │
│  [🇧🇩 01XXXXXXXXX]           │
│                              │
│  সম্পর্ক                     │
│  [মা / বাবা / বন্ধু / অন্য] │
│                              │
│  [ সংরক্ষণ করুন ]            │
└──────────────────────────────┘
```

`PATCH /rider/emergency-contact` `{ name, phone, relation }`.

---

### 19. PAYMENT SCREEN (`(main)/payment.tsx`)

```
┌──────────────────────────────┐
│  পেমেন্ট পদ্ধতি              │
│──────────────────────────────│
│  ○ 💚 bKash   ✅ ডিফল্ট     │
│     01XXXXXXXX               │
│                              │
│  ○ 🟠 Nagad                  │
│     01XXXXXXXX               │
│                              │
│  ○ 💳 ডেবিট/ক্রেডিট কার্ড   │
│     SSLCommerz               │
│                              │
│  ○ 💵 নগদ                   │
│     কোনো সার্চার্জ নেই       │
│                              │
│  [ + নতুন পদ্ধতি যোগ করুন ] │
└──────────────────────────────┘
```

Default method shown on confirm screen. Tap "পরিবর্তন" → this screen → select → back to confirm.

---

### 20. NOTIFICATION CENTER (`(main)/notifications.tsx`)

```
┌──────────────────────────────┐
│  নোটিফিকেশন  [সব পড়া হয়েছে]│
│──────────────────────────────│
│  🛺 আপনার রিকশা আসছে        │
│     ৫ মিনিট আগে             │
│  ✅ যাত্রা সম্পন্ন ৳৫৫       │
│     ২ ঘণ্টা আগে             │
│  📅 আগামীকালের বুকিং         │
│     আগামীকাল ৮টায়           │
│  🎁 নতুন প্রমো কোড!          │
│     ৩ দিন আগে               │
└──────────────────────────────┘
```

`GET /rider/notifications` → FlatList, infinite scroll.

---

### 21. FORCE UPDATE MODAL (`components/shared/UpdatePrompt.tsx`)

Blocking modal when `GET /rider/me` returns `forceUpdate: true`.

```
┌──────────────────────────────┐
│  🛺 নতুন আপডেট এসেছে!      │
│  নতুন সংস্করণ দরকার।        │
│  [ এখনই আপডেট করুন ]        │  ← Play Store / App Store
└──────────────────────────────┘
```

Cannot be dismissed.

---

## SAFE RIDE FEATURES

### `components/shared/SafeRideShare.tsx`

```ts
// On tap — generates shareable link
const { data } = await api.post(`/ride/${rideId}/share-token`);
// data: { shareUrl: 'https://track.rickshawbd.com/t/abc123' }

const message =
  `আমি রিকশায় আছি।\n` +
  `চালক: ${driverName} (⭐${rating})\n` +
  `রিকশা: ${plateNumber}\n` +
  `লাইভ ট্র্যাক: ${shareUrl}`;

await Share.share({ message });
// Opens WhatsApp / SMS / any share sheet
```

The share URL opens a **web page** (no app needed) showing live driver location. Valid for trip duration only.

### `components/shared/SOSButton.tsx`

Always visible bottom-right during tracking and active trip. Red circle. Long press 2 seconds to activate.

On activate:
1. `POST /ride/:id/sos` with GPS → alerts RickshawBD safety team
2. SMS sent automatically to emergency contact: **"জরুরি সাহায্য দরকার! [shareUrl]"**
3. Show screen with: 📞 999 (police), 📞 199 (fire/ambulance), 📞 RickshawBD hotline

---

## BACKEND API CONTRACTS

### Auth
```
POST /auth/rider/send-otp       { phone }
POST /auth/rider/verify-otp     { phone, otp }
                                → { accessToken, refreshToken }
POST /auth/google               { idToken } → { accessToken, refreshToken }
POST /auth/refresh              { refreshToken } → { accessToken }
POST /auth/logout               { refreshToken } → { ok }
```

### Rider Profile
```
GET  /rider/me                  → { rider, forceUpdate?, appMinVersion }
PATCH /rider/profile            { name, photo, email }
PATCH /rider/emergency-contact  { name, phone, relation }
GET  /rider/saved-places        → { home?, work?, favourites[] }
POST /rider/saved-places        { label, address, lat, lng }
DELETE /rider/saved-places/:id
```

### Map & Discovery
```
GET  /rides/nearby-drivers      ?lat=&lng=&radius=2000
                                → { drivers[{ id, lat, lng, type, rating }] }
GET  /rides/fare-estimate       ?originLat=&originLng=&destLat=&destLng=
                                → { min, max, distanceKm, durationMin,
                                    surgeMultiplier, surgeActive }
```

### Booking
```
POST /ride/request              { type: 'instant'|'hourly'|'scheduled',
                                  originLat, originLng, originAddress,
                                  destLat?, destLng?, destAddress?,
                                  durationHours?,
                                  paymentMethod, promoCode? }
                                → { rideId, estimatedFare }
POST /ride/schedule             { ...same + scheduledAt, repeat? }
                                → { rideId, scheduledAt }
POST /ride/:id/cancel           { reason }
                                → { refundStatus, cancellationFee }
POST /ride/:id/rate             { rating: 1..5, comment? }
POST /ride/:id/sos              { lat, lng }
POST /ride/:id/share-token      → { shareUrl, expiresAt }
POST /ride/:id/extend           { additionalMinutes: 30 }
                                → { newEndTime, additionalFare }
GET  /ride/:id                  → { full ride object }
GET  /rides/history             ?page=&status=&limit=20
                                → { rides[], total }
```

### Payment
```
GET  /payment/methods           → { methods[] }
POST /payment/initiate          { rideId, method }
                                → { gatewayUrl? or { ok: true } for cash }
GET  /payment/receipt/:rideId   → { pdfUrl }
POST /promo/validate            { code, rideId }
                                → { valid, discountAmount, finalFare }
```

### Scheduled Rides
```
GET  /rides/scheduled           → { rides[] }
DELETE /rides/scheduled/:id     → { ok }
```

### Notifications
```
GET  /rider/notifications       ?page= → { notifications[], unreadCount }
POST /rider/notifications/read  { ids[] } → { ok }
```

---

## SOCKET.IO EVENTS

Connect to `ENV.SOCKET_URL` with `{ auth: { token: accessToken } }`.

**Rider emits:**
```ts
socket.emit('rider:location',      { lat, lng })
socket.emit('ride:cancel',         { rideId, reason })
```

**Rider listens:**
```ts
socket.on('ride:matched',           (data) => { /* → tracking */ })
socket.on('ride:no-match',          ()     => { /* → no driver found screen */ })
socket.on('driver:location-update', (data) => { /* move driver marker */ })
socket.on('driver:arrived',         ()     => { /* → driver-arrived screen */ })
socket.on('trip:started',           ()     => { /* → trip-active */ })
socket.on('trip:completed',         (data) => { /* → trip-complete */ })
socket.on('ride:cancelled-driver',  ()     => { /* driver cancelled → re-match or home */ })
socket.on('force:update',           ()     => { /* show UpdatePrompt */ })
```

Reconnect: exponential backoff 1s → 2s → 4s → max 30s, unlimited retries.

---

## PRICING LOGIC (Frontend Display)

```ts
// services/pricing.ts
export const fareEstimate = (distanceKm: number, surgeMultiplier = 1.0) => {
  const base     = 30
  const perKm    = 12
  const platform = 3
  const raw = base + (distanceKm * perKm) + platform
  const surged = raw * surgeMultiplier
  return {
    min:      Math.round(surged * 0.9),
    max:      Math.round(surged * 1.1),
    base,
    distance: Math.round(distanceKm * perKm),
    platform,
    surge:    surgeMultiplier > 1.0,
    surgeMultiplier,
  }
}

export const hourlyRate  = 150  // ৳ per hour
export const electricSurcharge = 20  // ৳ extra for electric
```

Always show range (min–max) for instant. Always show final price for hourly. Always show surge BEFORE confirm.

---

## STRINGS SYSTEM — `constants/strings.ts`

```ts
type Lang = 'bn' | 'en';

export const getStrings = (lang: Lang) => ({
  home: {
    searchPlaceholder: lang === 'bn' ? 'আপনি কোথায় যাবেন?' : 'Where do you want to go?',
    nearbyDrivers:     (n: number) =>
      lang === 'bn' ? `${n}টি রিকশা কাছে আছে` : `${n} rickshaws nearby`,
    noDrivers:         lang === 'bn' ? 'কাছে কোনো রিকশা নেই' : 'No rickshaws nearby',
  },
  booking: {
    instant:   lang === 'bn' ? 'সরাসরি যাত্রা' : 'Instant Ride',
    hourly:    lang === 'bn' ? 'ঘণ্টায় ভাড়া'  : 'By Hour',
    schedule:  lang === 'bn' ? 'আগাম বুকিং'   : 'Schedule',
    book:      lang === 'bn' ? 'রিকশা বুক করুন' : 'Book Rickshaw',
    surgeNote: (x: number) =>
      lang === 'bn' ? `পিক আওয়ার — ভাড়া ${x}x` : `Peak hour — fare ${x}x`,
  },
  errors: {
    network:   lang === 'bn' ? 'ইন্টারনেট নেই। আবার চেষ্টা করুন।' : 'No internet. Please retry.',
    server:    lang === 'bn' ? 'সার্ভারে সমস্যা হচ্ছে।'            : 'Server error. Try later.',
    noMatch:   lang === 'bn' ? 'কাছে কোনো রিকশা নেই।'             : 'No rickshaws found nearby.',
    gps:       lang === 'bn' ? 'অবস্থান অনুমতি দিন।'              : 'Allow location access.',
  },
  // ... extend for all screens
});
```

Language loaded from `cache.get('language') ?? 'bn'`. Default is always Bangla.

---

## ERROR STATES

Every screen handles all these. Use `ErrorState` component.

```ts
type AppError =
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'AUTH_ERROR'
  | 'GPS_UNAVAILABLE'
  | 'PAYMENT_FAILED'
  | 'NO_DRIVERS'
  | 'RIDE_CANCELLED'
```

All errors shown in Bangla with contextual retry/action buttons. `AUTH_ERROR` → auto-logout.

---

## ANIMATION GUIDELINES

- Driver marker: `Animated.timing` interpolation between GPS updates — no jumping
- Matching radar: pulsing `Animated.loop` from user pin
- Bottom sheet: `react-native-reanimated` spring, 350ms
- Route polyline: draw-on via stroke-dashoffset animation
- Rickshaw icon: slight `Animated.rotate` wobble when moving
- **No Lottie** — too heavy for 2G users. Animated API only.
- **Skeleton loaders** everywhere — no spinners.

---

## COLORS & DESIGN TOKENS

```ts
export const colors = {
  primary:       '#1B5E20',   // Deep forest green
  accent:        '#FFC107',   // Warm amber
  available:     '#4CAF50',
  background:    '#FAFAFA',
  surface:       '#FFFFFF',
  textPrimary:   '#1A1A1A',
  textSecondary: '#666666',
  textHint:      '#9E9E9E',
  danger:        '#D32F2F',
  success:       '#388E3C',
  taka:          '#1B5E20',
  border:        '#E0E0E0',
  surge:         '#FF6F00',   // Orange for surge pricing
} as const;
```

Typography: `Hind Siliguri` (Bangla), `Inter` (English/numbers). Fare: bold 28px+ in taka green. Border radius: 16px cards, 12px buttons. Shadows: `elevation: 2` only.

---

## PERFORMANCE

- Android-first build and test
- All API calls via React Query with caching
- Nearby drivers: 10s polling (not socket) to save battery
- Images < 50KB
- MMKV for fast cache (10x faster than AsyncStorage)
- FlatList for all lists
- No Lottie

---

## MVP BUILD ORDER

**Phase 1 — Core ride loop:**
- [ ] `.env` + `constants/env.ts` + `app.config.ts`
- [ ] `services/api.ts` (Axios + auto-refresh)
- [ ] `services/socket.ts`
- [ ] `services/storage.ts` (SecureStore + MMKV)
- [ ] Welcome → Login → OTP → Home
- [ ] Home map with nearby drivers polling
- [ ] Destination search (Google Places)
- [ ] Select ride type + fare estimate
- [ ] Confirm booking (with promo code field as placeholder)
- [ ] Matching animation screen
- [ ] Live tracking
- [ ] Driver arrived screen
- [ ] Active trip screen
- [ ] Trip complete + rating
- [ ] Cancellation flow (with fee warning)
- [ ] Cash payment

**Phase 2 — Full features:**
- [ ] Hourly rental flow
- [ ] Scheduled rides
- [ ] bKash + Nagad payment
- [ ] Ride history with repeat booking
- [ ] Profile screen (fully spec'd)
- [ ] Emergency contact setup
- [ ] Safe ride share + SOS
- [ ] Notification center
- [ ] Receipt PDF

**Phase 3 — Growth:**
- [ ] Promo codes (field already present from Phase 1)
- [ ] Surge pricing display
- [ ] Extend hourly trip
- [ ] Corporate accounts
- [ ] Loyalty points
- [ ] In-app chat with driver
- [ ] Force update modal

---

*RickshawBD is not just an app. It's digitizing a cultural icon of Bangladesh. Design for Dhaka. Build for Bangladesh.*
