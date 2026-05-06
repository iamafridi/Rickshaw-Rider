/**
 * services/pricing.ts
 * Frontend fare estimation logic — mirrors backend formula exactly.
 * Source: rickshaw-rider-app-spec-cursor.md §PRICING LOGIC
 */

export const BASE_FARE     = 30;   // ৳ base
export const PER_KM_RATE   = 12;   // ৳ per km
export const PLATFORM_FEE  = 3;    // ৳ platform charge
export const HOURLY_RATE   = 150;  // ৳ per hour
export const ELECTRIC_SURCHARGE = 20; // ৳ extra for electric rickshaw

export interface FareEstimate {
  min: number;
  max: number;
  base: number;
  distance: number;
  platform: number;
  surge: boolean;
  surgeMultiplier: number;
}

/**
 * Estimate fare for an instant ride.
 * Always show as a range (min–max) — never a fixed price.
 */
export const fareEstimate = (
  distanceKm: number,
  surgeMultiplier = 1.0
): FareEstimate => {
  const raw = BASE_FARE + distanceKm * PER_KM_RATE + PLATFORM_FEE;
  const surged = raw * surgeMultiplier;
  return {
    min:             Math.round(surged * 0.9),
    max:             Math.round(surged * 1.1),
    base:            BASE_FARE,
    distance:        Math.round(distanceKm * PER_KM_RATE),
    platform:        PLATFORM_FEE,
    surge:           surgeMultiplier > 1.0,
    surgeMultiplier,
  };
};

/**
 * Calculate total for an hourly rental.
 * Always show a fixed price — no range.
 */
export const hourlyFare = (hours: number, isElectric = false): number => {
  const base = HOURLY_RATE * hours;
  return base + (isElectric ? ELECTRIC_SURCHARGE : 0);
};

/**
 * Format a taka amount for display (e.g., 55 → "৳ 55").
 */
export const formatTaka = (amount: number): string => `৳ ${amount}`;

/**
 * Format a fare range for display (e.g., "৳ 50–60").
 */
export const formatRange = (min: number, max: number): string =>
  `৳ ${min}–${max}`;
