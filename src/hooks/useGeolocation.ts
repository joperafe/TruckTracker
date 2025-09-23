'use client';

import { useEffect, useCallback } from 'react';
import { useGeolocation, useTrucks } from '@/contexts/TruckStore';

export function useAutoLocation() {
  const { getUserLocation } = useGeolocation();
  const { refreshTrucks } = useTrucks();

  const requestLocation = useCallback(async () => {
    try {
      await getUserLocation();
      // Refresh trucks with new location
      await refreshTrucks();
    } catch (error) {
      console.error('Failed to get user location:', error);
    }
  }, [getUserLocation, refreshTrucks]);

  return { requestLocation };
}

export function useNearbyTrucks(autoFetch = true) {
  const { userLocation } = useGeolocation();
  const { refreshTrucks } = useTrucks();

  useEffect(() => {
    if (autoFetch && userLocation) {
      refreshTrucks();
    }
  }, [userLocation, refreshTrucks, autoFetch]);

  return { userLocation };
}