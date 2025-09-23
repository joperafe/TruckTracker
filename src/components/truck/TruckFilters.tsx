'use client';

import { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Input, Button, Badge } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface TruckFiltersProps {
  searchQuery: string;
  cuisineFilter: string[];
  onSearch: (query: string) => void;
  onCuisineFilter: (cuisines: string[]) => void;
  onLocationRequest?: () => void;
  loading?: boolean;
  className?: string;
}

const POPULAR_CUISINES = [
  'All',
  'Mexican',
  'Italian',
  'American',
  'Asian',
  'Mediterranean',
  'BBQ',
  'Vegetarian',
  'Desserts',
  'Coffee',
];

export function TruckFilters({
  searchQuery,
  cuisineFilter,
  onSearch,
  onCuisineFilter,
  onLocationRequest,
  loading = false,
  className
}: TruckFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleCuisineToggle = (cuisine: string) => {
    if (cuisine === 'All') {
      onCuisineFilter([]);
      return;
    }

    const newCuisines = cuisineFilter.includes(cuisine)
      ? cuisineFilter.filter(c => c !== cuisine)
      : [...cuisineFilter, cuisine];
    
    onCuisineFilter(newCuisines);
  };

  const isSelected = (cuisine: string) => {
    if (cuisine === 'All') {
      return cuisineFilter.length === 0;
    }
    return cuisineFilter.includes(cuisine);
  };

  return (
    <div className={cn("bg-white border-b border-gray-200 shadow-sm", className)}>
      {/* Search Bar */}
      <div className="p-4">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search food trucks, cuisine, location..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center space-x-1",
              showFilters && "bg-gray-100"
            )}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
            {cuisineFilter.length > 0 && (
              <Badge variant="default" className="ml-1">
                {cuisineFilter.length}
              </Badge>
            )}
          </Button>
          
          {onLocationRequest && (
            <Button
              variant="outline"
              onClick={onLocationRequest}
              disabled={loading}
              className="flex items-center space-x-1"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Near Me</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Cuisine Type</h4>
              <div className="flex flex-wrap gap-2">
                {POPULAR_CUISINES.map((cuisine) => (
                  <Button
                    key={cuisine}
                    variant={isSelected(cuisine) ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handleCuisineToggle(cuisine)}
                    className="text-xs"
                  >
                    {cuisine}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {cuisineFilter.length > 0 && (
                  <>
                    {cuisineFilter.length} filter{cuisineFilter.length > 1 ? 's' : ''} active
                  </>
                )}
              </span>
              
              {cuisineFilter.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCuisineFilter([])}
                  className="text-xs text-gray-500"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}