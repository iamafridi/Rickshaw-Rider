export type RideType = 'instant' | 'hourly' | 'scheduled';
export type RideStatus = 'pending' | 'matched' | 'driver_arrived' | 'active' | 'completed' | 'cancelled';

export interface LocationInfo {
  lat: number;
  lng: number;
  address?: string;
}

export interface Ride {
  id: string;
  type: RideType;
  status: RideStatus;
  origin: LocationInfo;
  destination?: LocationInfo;
  durationHours?: number; // for hourly
  estimatedFare: number;
  finalFare?: number;
  driverId?: string;
  createdAt: string;
  scheduledAt?: string;
}
