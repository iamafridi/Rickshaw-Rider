export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  tripsCount: number;
  plateNumber: string;
  type: 'manual' | 'electric';
  photoUrl?: string;
  vehicleType: 'regular' | 'electric' | 'premium';
  currentLocation: { latitude: number; longitude: number };
  status: 'active' | 'inactive' | 'busy';
  isVerified: boolean;
}

export interface DriverLocation {
  latitude: number;
  longitude: number;
}

export interface NearbyDriver extends Driver {
  lat: number;
  lng: number;
}
