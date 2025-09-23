'use client';

import { FoodTruck } from '@/types';
import { Badge } from '@/components/ui/Button';
import { formatDistance, isCurrentlyOpen } from '@/lib/utils';
import { MapPin, Phone, Clock, Star } from 'lucide-react';

interface TruckPopupProps {
  truck: FoodTruck;
}

export function TruckPopup({ truck }: TruckPopupProps) {
  const currentlyOpen = isCurrentlyOpen(truck.hours);
  
  return (
    <div className="p-4 min-w-80 max-w-md">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900 pr-2">{truck.name}</h3>
        <StatusBadge isOpen={currentlyOpen} />
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Cuisine:</span>
          <CuisineTags cuisines={truck.cuisine} />
        </div>
        
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-gray-700">{truck.location.address}</span>
        </div>

        {truck.distance && (
          <div className="text-gray-600">
            Distance: {formatDistance(truck.distance)}
          </div>
        )}
        
        <TruckRating rating={truck.ratings} />
        
        <div className="flex space-x-2 mt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex-1">
            View Menu
          </button>
          {truck.contact.phone && (
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-md">
              <Phone className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  isOpen: boolean;
}

function StatusBadge({ isOpen }: StatusBadgeProps) {
  return (
    <Badge variant={isOpen ? 'success' : 'error'}>
      {isOpen ? 'Open' : 'Closed'}
    </Badge>
  );
}

interface CuisineTagsProps {
  cuisines: string[];
}

function CuisineTags({ cuisines }: CuisineTagsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {cuisines.slice(0, 3).map((cuisine) => (
        <Badge key={cuisine} variant="default" className="text-xs">
          {cuisine}
        </Badge>
      ))}
      {cuisines.length > 3 && (
        <Badge variant="default" className="text-xs">
          +{cuisines.length - 3}
        </Badge>
      )}
    </div>
  );
}

interface TruckRatingProps {
  rating: {
    average: number;
    count: number;
  };
}

function TruckRating({ rating }: TruckRatingProps) {
  if (rating.count === 0) {
    return (
      <div className="flex items-center space-x-1 text-gray-500 text-sm">
        <Star className="w-4 h-4" />
        <span>No ratings yet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating.average
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600">
        {rating.average.toFixed(1)} ({rating.count})
      </span>
    </div>
  );
}

interface TruckHoursProps {
  hours: FoodTruck['hours'];
}

export function TruckHours({ hours }: TruckHoursProps) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-1 text-sm font-medium text-gray-700">
        <Clock className="w-4 h-4" />
        <span>Hours</span>
      </div>
      <div className="text-sm space-y-1">
        {Object.entries(hours).map(([day, dayHours]) => (
          <div
            key={day}
            className={`flex justify-between ${
              day === today ? 'font-medium text-gray-900' : 'text-gray-600'
            }`}
          >
            <span className="capitalize">{day}</span>
            <span>
              {dayHours.closed
                ? 'Closed'
                : `${dayHours.open} - ${dayHours.close}`
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TruckCardProps {
  truck: FoodTruck;
  onSelect?: (truck: FoodTruck) => void;
  showDistance?: boolean;
}

export function TruckCard({ truck, onSelect, showDistance = true }: TruckCardProps) {
  const currentlyOpen = isCurrentlyOpen(truck.hours);
  
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onSelect?.(truck)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-lg">{truck.name}</h3>
        <StatusBadge isOpen={currentlyOpen} />
      </div>
      
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{truck.description}</p>
      
      <div className="space-y-2">
        <CuisineTags cuisines={truck.cuisine} />
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          <span>{truck.location.address}</span>
        </div>
        
        {showDistance && truck.distance && (
          <div className="text-sm text-gray-600">
            {formatDistance(truck.distance)} away
          </div>
        )}
        
        <TruckRating rating={truck.ratings} />
      </div>
    </div>
  );
}