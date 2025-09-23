'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { TruckState, TruckActions, FoodTruck, APIResponse } from '@/types';
import { calculateDistance } from '@/lib/utils';

// Initial state
const initialState: TruckState = {
  trucks: [],
  filteredTrucks: [],
  selectedTruck: null,
  searchQuery: '',
  cuisineFilter: [],
  userLocation: null,
  loading: {
    trucks: false,
    location: false,
  },
  errors: {
    trucks: null,
    location: null,
  },
};

// Action types
type TruckActionType =
  | { type: 'SET_TRUCKS'; payload: FoodTruck[] }
  | { type: 'SET_FILTERED_TRUCKS'; payload: FoodTruck[] }
  | { type: 'SET_SELECTED_TRUCK'; payload: FoodTruck | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CUISINE_FILTER'; payload: string[] }
  | { type: 'SET_USER_LOCATION'; payload: [number, number] | null }
  | { type: 'SET_LOADING'; payload: { key: keyof TruckState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof TruckState['errors']; error: string | null } }
  | { type: 'RESET_STATE' };

// Reducer
function truckReducer(state: TruckState, action: TruckActionType): TruckState {
  switch (action.type) {
    case 'SET_TRUCKS':
      return {
        ...state,
        trucks: action.payload,
        filteredTrucks: action.payload,
      };

    case 'SET_FILTERED_TRUCKS':
      return {
        ...state,
        filteredTrucks: action.payload,
      };

    case 'SET_SELECTED_TRUCK':
      return {
        ...state,
        selectedTruck: action.payload,
      };

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };

    case 'SET_CUISINE_FILTER':
      return {
        ...state,
        cuisineFilter: action.payload,
      };

    case 'SET_USER_LOCATION':
      return {
        ...state,
        userLocation: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.error,
        },
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// Context
interface TruckContextType {
  state: TruckState;
  actions: TruckActions;
}

const TruckContext = createContext<TruckContextType | undefined>(undefined);

// Provider component
interface TruckStoreProviderProps {
  children: ReactNode;
}

export function TruckStoreProvider({ children }: TruckStoreProviderProps) {
  const [state, dispatch] = useReducer(truckReducer, initialState);

  // Helper function to apply filters
  const applyFilters = useCallback((trucks: FoodTruck[], query: string, cuisineFilter: string[]) => {
    let filtered = trucks;

    // Text search
    if (query.trim()) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(truck =>
        truck.name.toLowerCase().includes(searchLower) ||
        truck.description.toLowerCase().includes(searchLower) ||
        truck.cuisine.some(c => c.toLowerCase().includes(searchLower)) ||
        truck.location.address.toLowerCase().includes(searchLower) ||
        truck.location.neighborhood?.toLowerCase().includes(searchLower)
      );
    }

    // Cuisine filter
    if (cuisineFilter.length > 0 && !cuisineFilter.includes('all')) {
      filtered = filtered.filter(truck =>
        truck.cuisine.some(c => cuisineFilter.includes(c))
      );
    }

    // Sort by distance if user location is available
    if (state.userLocation) {
      filtered = filtered
        .map(truck => ({
          ...truck,
          distance: calculateDistance(
            state.userLocation![0],
            state.userLocation![1],
            truck.location.coordinates[1],
            truck.location.coordinates[0]
          )
        }))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return filtered;
  }, [state.userLocation]);

  // Actions
  const actions: TruckActions = {
    searchTrucks: useCallback((query: string) => {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
      const filtered = applyFilters(state.trucks, query, state.cuisineFilter);
      dispatch({ type: 'SET_FILTERED_TRUCKS', payload: filtered });
    }, [state.trucks, state.cuisineFilter, applyFilters]),

    filterByCuisine: useCallback((cuisines: string[]) => {
      dispatch({ type: 'SET_CUISINE_FILTER', payload: cuisines });
      const filtered = applyFilters(state.trucks, state.searchQuery, cuisines);
      dispatch({ type: 'SET_FILTERED_TRUCKS', payload: filtered });
    }, [state.trucks, state.searchQuery, applyFilters]),

    selectTruck: useCallback((truck: FoodTruck | null) => {
      dispatch({ type: 'SET_SELECTED_TRUCK', payload: truck });
    }, []),

    refreshTrucks: useCallback(async () => {
      dispatch({ type: 'SET_LOADING', payload: { key: 'trucks', value: true } });
      dispatch({ type: 'SET_ERROR', payload: { key: 'trucks', error: null } });

      try {
        const params = new URLSearchParams();
        if (state.userLocation) {
          params.set('lat', state.userLocation[0].toString());
          params.set('lng', state.userLocation[1].toString());
        }

        const response = await fetch(`/api/trucks?${params}`);
        const data: APIResponse<FoodTruck[]> = await response.json();

        if (data.success && data.data) {
          dispatch({ type: 'SET_TRUCKS', payload: data.data });
        } else {
          throw new Error(data.error || 'Failed to fetch trucks');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trucks';
        dispatch({ type: 'SET_ERROR', payload: { key: 'trucks', error: errorMessage } });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { key: 'trucks', value: false } });
      }
    }, [state.userLocation]),

    setUserLocation: useCallback((location: [number, number] | null) => {
      dispatch({ type: 'SET_USER_LOCATION', payload: location });
    }, []),

    getUserLocation: useCallback(async (): Promise<[number, number]> => {
      dispatch({ type: 'SET_LOADING', payload: { key: 'location', value: true } });
      dispatch({ type: 'SET_ERROR', payload: { key: 'location', error: null } });

      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          const error = 'Geolocation is not supported by this browser';
          dispatch({ type: 'SET_ERROR', payload: { key: 'location', error } });
          dispatch({ type: 'SET_LOADING', payload: { key: 'location', value: false } });
          reject(new Error(error));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords: [number, number] = [
              position.coords.latitude,
              position.coords.longitude
            ];
            dispatch({ type: 'SET_USER_LOCATION', payload: coords });
            dispatch({ type: 'SET_LOADING', payload: { key: 'location', value: false } });
            resolve(coords);
          },
          (error) => {
            const errorMessage = `Location error: ${error.message}`;
            dispatch({ type: 'SET_ERROR', payload: { key: 'location', error: errorMessage } });
            dispatch({ type: 'SET_LOADING', payload: { key: 'location', value: false } });
            reject(new Error(errorMessage));
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
        );
      });
    }, []),

    setLoading: useCallback((key: keyof TruckState['loading'], value: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: { key, value } });
    }, []),

    setError: useCallback((key: keyof TruckState['errors'], error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: { key, error } });
    }, []),
  };

  return (
    <TruckContext.Provider value={{ state, actions }}>
      {children}
    </TruckContext.Provider>
  );
}

// Custom hook to use the truck store
export function useTruckStore(): TruckContextType {
  const context = useContext(TruckContext);
  if (context === undefined) {
    throw new Error('useTruckStore must be used within a TruckStoreProvider');
  }
  return context;
}

// Convenience hooks for specific functionality
export function useTrucks() {
  const { state, actions } = useTruckStore();

  return {
    trucks: state.filteredTrucks,
    allTrucks: state.trucks,
    selectedTruck: state.selectedTruck,
    loading: state.loading.trucks,
    error: state.errors.trucks,
    searchQuery: state.searchQuery,
    cuisineFilter: state.cuisineFilter,
    searchTrucks: actions.searchTrucks,
    filterByCuisine: actions.filterByCuisine,
    selectTruck: actions.selectTruck,
    refreshTrucks: actions.refreshTrucks,
  };
}

export function useGeolocation() {
  const { state, actions } = useTruckStore();

  return {
    userLocation: state.userLocation,
    loading: state.loading.location,
    error: state.errors.location,
    getUserLocation: actions.getUserLocation,
    setUserLocation: actions.setUserLocation,
  };
}