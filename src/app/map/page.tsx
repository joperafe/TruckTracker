'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Navigation } from '@/components/Navigation';
import { TruckFilters } from '@/components/truck/TruckFilters';
import { TruckSidebar, TruckMobileList } from '@/components/truck/TruckSidebar';
import { TruckPopup } from '@/components/truck/TruckPopup';
import { TruckStoreProvider, useTrucks, useGeolocation } from '@/contexts/TruckStore';
import { useAutoLocation } from '@/hooks/useGeolocation';
import { useTruckMapConfig } from '@/lib/mapConfig';
import { FoodTruck, MarkerLayer } from '@/types';
import { List } from 'lucide-react';

// Dynamic import for client-side only component
const InteractiveMap = dynamic(
  () => import('@/components/map/InteractiveMap').then((mod) => ({ default: mod.InteractiveMap })),
  { ssr: false }
);

function TruckMapContent() {
  const [showMobileList, setShowMobileList] = useState(false);
  const { 
    trucks, 
    selectedTruck, 
    loading, 
    error, 
    searchQuery, 
    cuisineFilter,
    searchTrucks, 
    filterByCuisine, 
    selectTruck, 
    refreshTrucks 
  } = useTrucks();
  const { userLocation } = useGeolocation();
  const { requestLocation } = useAutoLocation();
  
  const mapConfig = useTruckMapConfig(userLocation);

  // Load trucks on mount
  useEffect(() => {
    refreshTrucks();
  }, [refreshTrucks]);

  // Create marker layer from trucks
  const truckMarkers: MarkerLayer = {
    id: 'food-trucks',
    name: 'Food Trucks',
    type: 'marker',
    visible: true,
    data: trucks.map(truck => ({
      id: truck._id,
      position: [truck.location.coordinates[1], truck.location.coordinates[0]], // [lat, lng]
      popup: {
        content: <TruckPopup truck={truck} />
      },
      metadata: truck as unknown as { cuisine: string[]; isOpen: boolean; rating: number; }
    }))
  };

  const handleTruckSelect = (truck: FoodTruck | null) => {
    if (truck) {
      selectTruck(truck);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navigation />
      
      <TruckFilters
        searchQuery={searchQuery}
        cuisineFilter={cuisineFilter}
        onSearch={searchTrucks}
        onCuisineFilter={filterByCuisine}
        onLocationRequest={requestLocation}
        loading={loading}
      />
      
      <div className="flex-1 relative flex">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <TruckSidebar
            trucks={trucks}
            selectedTruck={selectedTruck}
            loading={loading}
            error={error}
            onTruckSelect={handleTruckSelect}
          />
        </div>

        {/* Map container */}
        <div className="flex-1 relative">
          <InteractiveMap
            mapConfig={mapConfig}
            layers={[truckMarkers]}
            features={{
              geolocation: { enabled: true, autoLocate: false },
              clustering: true,
              clickableMarkers: true
            }}
            onTruckSelect={handleTruckSelect}
          />
          
          {/* Mobile list toggle button */}
          <button
            onClick={() => setShowMobileList(true)}
            className="md:hidden absolute top-4 right-4 bg-white shadow-lg p-3 rounded-full hover:bg-gray-50 transition-colors"
          >
            <List className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Mobile truck list */}
        <TruckMobileList
          trucks={trucks}
          loading={loading}
          error={error}
          onTruckSelect={handleTruckSelect}
          isVisible={showMobileList}
          onClose={() => setShowMobileList(false)}
        />
      </div>
    </div>
  );
}

export default function TruckMapPage() {
  return (
    <TruckStoreProvider>
      <TruckMapContent />
    </TruckStoreProvider>
  );
}