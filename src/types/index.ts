export type DayOfWeek = 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday' 
  | 'saturday' 
  | 'sunday';

export interface MenuItem {
  name: string;
  description?: string;
  price: number;
  category: string;
  dietary?: ('vegan' | 'vegetarian' | 'gluten-free')[];
  spicyLevel?: 1 | 2 | 3 | 4 | 5;
}

export interface TruckHours {
  [key: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}

export interface FoodTruck {
  _id: string;
  name: string;
  cuisine: string[];
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat] for GeoJSON
    address: string;
    neighborhood?: string;
  };
  hours: TruckHours;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
    social: {
      instagram?: string;
      twitter?: string;
      facebook?: string;
    };
  };
  menu?: {
    items: MenuItem[];
    lastUpdated: Date;
  };
  ratings: {
    average: number;
    count: number;
  };
  isActive: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
  // Computed fields
  isCurrentlyOpen?: boolean;
  distance?: number;
}

export interface MarkerLayer {
  id: string;
  name: string;
  type: 'marker';
  visible: boolean;
  data: MarkerData[];
}

export interface MarkerData {
  id: string;
  position: [number, number]; // [lat, lng]
  popup?: {
    content: React.ReactNode;
  };
  metadata?: {
    cuisine: string[];
    isOpen: boolean;
    rating: number;
  };
}

export interface MapConfig {
  map_settings: {
    center: [number, number];
    zoom: number;
    maxZoom: number;
    minZoom: number;
  };
  controls_settings: {
    layer_toggle: { enabled: boolean };
    geolocation: { enabled: boolean };
    search: { enabled: boolean };
  };
}

export interface TruckState {
  trucks: FoodTruck[];
  filteredTrucks: FoodTruck[];
  selectedTruck: FoodTruck | null;
  searchQuery: string;
  cuisineFilter: string[];
  userLocation: [number, number] | null;
  loading: {
    trucks: boolean;
    location: boolean;
  };
  errors: {
    trucks: string | null;
    location: string | null;
  };
}

export interface TruckActions {
  searchTrucks: (query: string) => void;
  filterByCuisine: (cuisines: string[]) => void;
  selectTruck: (truck: FoodTruck | null) => void;
  refreshTrucks: () => Promise<void>;
  setUserLocation: (location: [number, number] | null) => void;
  getUserLocation: () => Promise<[number, number]>;
  setLoading: (key: keyof TruckState['loading'], value: boolean) => void;
  setError: (key: keyof TruckState['errors'], error: string | null) => void;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}