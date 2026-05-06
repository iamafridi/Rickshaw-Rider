import React from 'react';
import { Polyline } from 'react-native-maps';
import { colors } from '../constants/colors';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface RoutePolylineProps {
  coordinates: Coordinate[];
  isActive?: boolean;
}

export const RoutePolyline: React.FC<RoutePolylineProps> = ({ 
  coordinates, 
  isActive = true 
}) => {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  return (
    <Polyline
      coordinates={coordinates}
      strokeWidth={4}
      strokeColor={isActive ? colors.primary : colors.textHint}
      geodesic={true}
      lineDashPattern={isActive ? undefined : [10, 10]}
    />
  );
};
