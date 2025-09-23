'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapConfig, MarkerLayer, FoodTruck } from '@/types';
import { DEFAULT_TILES } from '@/lib/mapConfig';
import { cn } from '@/lib/utils';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  mapConfig: MapConfig;
  layers?: MarkerLayer[];
  features?: {
    geolocation?: { enabled: boolean; autoLocate?: boolean };
    clustering?: boolean;
    clickableMarkers?: boolean;
  };
  onTruckSelect?: (truck: FoodTruck | null) => void;
  className?: string;
}

// Custom hook for map events
function MapEvents({ 
  onLocationFound,
  autoLocate = false 
}: { 
  onLocationFound?: (location: [number, number]) => void;
  autoLocate?: boolean;
}) {
  const map = useMapEvents({
    locationfound(e) {
      if (onLocationFound) {
        onLocationFound([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  useEffect(() => {
    if (autoLocate) {
      map.locate({ setView: true, maxZoom: 16 });
    }
  }, [map, autoLocate]);

  return null;
}

// Geolocation control component
function GeolocationControl() {
  const map = useMap();

  const handleLocate = () => {
    map.locate({ 
      setView: true, 
      maxZoom: 16,
      enableHighAccuracy: true
    });
  };

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          className="bg-white hover:bg-gray-50 p-2 border-none cursor-pointer text-sm"
          onClick={handleLocate}
          title="Find my location"
        >
          📍
        </button>
      </div>
    </div>
  );
}

// Create custom truck icon
const createTruckIcon = (truck: FoodTruck) => {
  const isOpen = truck.isCurrentlyOpen;
  const color = isOpen ? '#51cf66' : '#868e96';
  
  return L.divIcon({
    className: 'custom-truck-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      ">
        🚚
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export function InteractiveMap({
  mapConfig,
  layers = [],
  features = {},
  onTruckSelect,
  className
}: InteractiveMapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const handleLocationFound = (location: [number, number]) => {
    setUserLocation(location);
  };

  const handleTruckClick = (truck: FoodTruck) => {
    if (onTruckSelect) {
      onTruckSelect(truck);
    }
  };

  return (
    <div className={cn("relative w-full h-full", className)}>
      <MapContainer
        center={mapConfig.map_settings.center}
        zoom={mapConfig.map_settings.zoom}
        minZoom={mapConfig.map_settings.minZoom}
        maxZoom={mapConfig.map_settings.maxZoom}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url={DEFAULT_TILES.url}
          attribution={DEFAULT_TILES.attribution}
        />

        {/* Map events */}
        <MapEvents 
          onLocationFound={handleLocationFound}
          autoLocate={features.geolocation?.autoLocate}
        />

        {/* Geolocation control */}
        {features.geolocation?.enabled && (
          <GeolocationControl />
        )}

        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={userLocation}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: '<div style="background-color: #2196F3; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
              iconSize: [18, 18],
              iconAnchor: [9, 9],
            })}
          >
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Truck markers */}
        {layers.map((layer) => (
          layer.visible && layer.data.map((markerData) => {
            const truck = markerData.metadata as unknown as FoodTruck;
            return (
              <Marker
                key={markerData.id}
                position={markerData.position}
                icon={createTruckIcon(truck)}
                eventHandlers={{
                  click: () => {
                    if (features.clickableMarkers && truck) {
                      handleTruckClick(truck);
                    }
                  },
                }}
              >
                {markerData.popup && (
                  <Popup>
                    {markerData.popup.content}
                  </Popup>
                )}
              </Marker>
            );
          })
        ))}
      </MapContainer>
    </div>
  );
}