'use client';

import { FoodTruck } from '@/types';
import { TruckCard } from './TruckPopup';
import { Spinner } from '@/components/ui/Button';
import { MapPin, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TruckSidebarProps {
  trucks: FoodTruck[];
  selectedTruck?: FoodTruck | null;
  loading?: boolean;
  error?: string | null;
  onTruckSelect?: (truck: FoodTruck) => void;
  className?: string;
}

export function TruckSidebar({
  trucks,
  selectedTruck,
  loading = false,
  error = null,
  onTruckSelect,
  className
}: TruckSidebarProps) {
  return (
    <div className={cn(
      "bg-white border-r border-gray-200 overflow-hidden flex flex-col",
      "w-full md:w-96",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Food Trucks Near You
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {loading ? 'Loading...' : `${trucks.length} truck${trucks.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <div className="p-4">
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && trucks.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No trucks found</h3>
            <p className="text-sm">Try adjusting your filters or search in a different area.</p>
          </div>
        )}

        {!loading && !error && trucks.length > 0 && (
          <div className="p-4 space-y-4">
            {trucks.map((truck) => (
              <div
                key={truck._id}
                className={cn(
                  "transition-all duration-200",
                  selectedTruck?._id === truck._id && "ring-2 ring-blue-500 ring-opacity-50"
                )}
              >
                <TruckCard
                  truck={truck}
                  onSelect={onTruckSelect}
                  showDistance={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface TruckMobileListProps {
  trucks: FoodTruck[];
  loading?: boolean;
  error?: string | null;
  onTruckSelect?: (truck: FoodTruck) => void;
  isVisible?: boolean;
  onClose?: () => void;
}

export function TruckMobileList({
  trucks,
  loading = false,
  error = null,
  onTruckSelect,
  isVisible = false,
  onClose
}: TruckMobileListProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col md:hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Food Trucks
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="sr-only">Close</span>
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center p-8">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <div className="p-4">
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && trucks.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No trucks found</h3>
            <p className="text-sm">Try adjusting your filters or search in a different area.</p>
          </div>
        )}

        {!loading && !error && trucks.length > 0 && (
          <div className="p-4 space-y-4">
            {trucks.map((truck) => (
              <TruckCard
                key={truck._id}
                truck={truck}
                onSelect={(truck) => {
                  onTruckSelect?.(truck);
                  onClose?.();
                }}
                showDistance={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}