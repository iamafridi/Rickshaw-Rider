export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  tripsCount: number;
  plateNumber: string;
  type: 'manual' | 'electric';
  photoUrl?: string;
}

export interface NearbyDriver extends Driver {
  lat: number;
  lng: number;
}
