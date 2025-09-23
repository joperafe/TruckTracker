import { MapConfig } from '@/types';
import { useMemo } from 'react';

export const adaptMapConfig = (config: Partial<MapConfig>): MapConfig => {
  const defaultLat = parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT || '40.7128');
  const defaultLng = parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LNG || '-74.0060');

  return {
    map_settings: {
      center: config.map_settings?.center || [defaultLat, defaultLng],
      zoom: config.map_settings?.zoom || 13,
      maxZoom: config.map_settings?.maxZoom || 18,
      minZoom: config.map_settings?.minZoom || 10,
    },
    controls_settings: {
      layer_toggle: { 
        enabled: config.controls_settings?.layer_toggle?.enabled ?? true 
      },
      geolocation: { 
        enabled: config.controls_settings?.geolocation?.enabled ?? true 
      },
      search: { 
        enabled: config.controls_settings?.search?.enabled ?? true 
      },
    },
  };
};

export const useTruckMapConfig = (userLocation?: [number, number] | null) => {
  return useMemo(() => {
    return adaptMapConfig({
      map_settings: {
        center: userLocation || [
          parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT || '40.7128'),
          parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LNG || '-74.0060')
        ],
        zoom: 13,
        maxZoom: 18,
        minZoom: 10
      },
      controls_settings: {
        layer_toggle: { enabled: true },
        geolocation: { enabled: true },
        search: { enabled: true }
      }
    });
  }, [userLocation]);
};

// Default map tiles configuration
export const DEFAULT_TILES = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// Food truck map styling
export const TRUCK_MAP_STYLES = {
  marker: {
    radius: 8,
    fillColor: '#ff6b6b',
    color: '#fff',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
  },
  markerOpen: {
    radius: 10,
    fillColor: '#51cf66',
    color: '#fff',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.9
  },
  markerClosed: {
    radius: 6,
    fillColor: '#868e96',
    color: '#fff',
    weight: 1,
    opacity: 0.7,
    fillOpacity: 0.6
  },
  cluster: {
    fillColor: '#ff6b6b',
    color: '#fff',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.7
  }
};