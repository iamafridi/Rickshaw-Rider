# RickshawBD Rider App - Build Plan

## Overview
Building Bangladesh's first rickshaw ride-hailing mobile app using React Native (Expo).

## Tech Stack
- **Framework:** React Native (Expo SDK 51)
- **Language:** TypeScript (strict mode)
- **State:** Zustand
- **Navigation:** React Navigation v6
- **Maps:** react-native-maps + Google Maps SDK
- **Data Fetching:** React Query (TanStack Query v5)
- **Real-time:** Socket.IO client v4
- **Push:** Firebase Cloud Messaging
- **Secure Storage:** expo-secure-store
- **Fast Cache:** react-native-mmkv
- **HTTP:** Axios

## Build Phases

### Phase 1 - Foundation & Core Ride Loop
- [x] Initialize Expo project with TypeScript
- [x] Setup environment variables (.env, .env.example, env.ts, app.config.ts)
- [x] Setup project structure (folders as per spec)
- [x] Create services layer (api.ts, socket.ts, storage.ts)
- [x] Create constants (colors.ts, typography.ts, strings.ts, routes.ts)
- [x] Create types (ride.ts, driver.ts, payment.ts, notification.ts, api.ts)
- [x] Create stores (authStore.ts, riderStore.ts, bookingStore.ts, tripStore.ts, notificationStore.ts)
- [x] Create UI components (Button, BottomSheet, SearchBar, RatingStars, SkeletonLoader, etc.)
- [x] Create shared components (SafeRideShare, SOSButton, UpdatePrompt, ErrorState)
- [x] Create map components (HomeMap, DriverMarker, RoutePolyline)
- [x] Create booking components (RideTypeCard, FareBreakdown, DriverPreviewCard)
- [x] Create notification components (NotificationCard)
- [x] Setup React Navigation (_layout, (auth) stack, (main) stack with tabs)
- [x] Build Auth screens (welcome.tsx, login.tsx, verify-phone.tsx)
- [x] Build Home screen with map
- [x] Build Destination Search bottom sheet with Google Places
- [x] Build Select Ride Type screen
- [x] Build Confirm Booking screen
- [x] Build Matching screen with radar animation
- [x] Build Tracking screen
- [x] Build Driver Arrived screen
- [x] Build Active Trip screen
- [x] Build Trip Complete screen
- [x] Build Cancellation flow

### Phase 2 - Full Features
- [x] Hourly rental flow
- [x] Scheduled rides
- [x] bKash + Nagad payment integration
- [x] Ride history with repeat booking
- [x] Profile screen
- [x] Emergency contact setup
- [x] Safe ride share + SOS
- [x] Notification center
- [x] Receipt PDF

### Phase 3 - Growth
- [x] Promo codes
- [x] Surge pricing display
- [x] Extend hourly trip
- [x] Corporate accounts
- [x] Loyalty points
- [x] In-app chat with driver
- [x] Force update modal

## Current Status

### Phase 1 Progress
| Task | Status |
|------|--------|
| Initialize Expo project | Done |
| Environment setup | Done |
| Project structure | Done |
| Services layer | Done |
| Constants | Done |
| Types | Done |
| Stores | Done |
| Components | Done |
| Navigation | Done |
| Auth screens | Done |
| Home + Map | Done |
| Booking flow | Done |
| Trip screens | Done |

## Commands

### Docker npm commands (use instead of npm/npx directly)
```bash
# Install dependencies
docker run --rm -v $(pwd):/app -w /app node:20 npm install

# Add dependency
docker run --rm -v $(pwd):/app -w /app node:20 npm install <package>

# Add dev dependency
docker run --rm -v $(pwd):/app -w /app node:20 npm install -D <package>

# Run expo (dev)
docker run --rm -it -v $(pwd):/app -w /app -p 19000:19000 node:20 npx expo start

# TypeScript check
docker run --rm -v $(pwd):/app -w /app node:20 npx tsc --noEmit
```

## Notes
- Default language is Bangla (bn)
- Android-first build and test
- No Lottie - use Animated API only
- Skeleton loaders everywhere - no spinners
- All strings in constants/strings.ts for i18n
