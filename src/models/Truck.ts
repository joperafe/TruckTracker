import mongoose, { Schema } from 'mongoose';
import { FoodTruck, MenuItem } from '@/types';

// MenuItem Schema
const MenuItemSchema = new Schema<MenuItem>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  dietary: [{ 
    type: String, 
    enum: ['vegan', 'vegetarian', 'gluten-free'] 
  }],
  spicyLevel: { 
    type: Number, 
    min: 1, 
    max: 5 
  }
}, { _id: false });

// Hours Schema
const HoursSchema = new Schema({
  open: { type: String, required: true },
  close: { type: String, required: true },
  closed: { type: Boolean, default: false }
}, { _id: false });

// Food Truck Schema
const FoodTruckSchema = new Schema<FoodTruck>({
  name: { type: String, required: true, trim: true },
  cuisine: [{ type: String, required: true }],
  description: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(val: number[]) {
          return val.length === 2;
        },
        message: 'Coordinates must contain exactly 2 numbers [lng, lat]'
      }
    },
    address: { type: String, required: true },
    neighborhood: { type: String }
  },
  hours: {
    type: Map,
    of: HoursSchema,
    default: () => ({
      monday: { open: '10:00', close: '20:00', closed: false },
      tuesday: { open: '10:00', close: '20:00', closed: false },
      wednesday: { open: '10:00', close: '20:00', closed: false },
      thursday: { open: '10:00', close: '20:00', closed: false },
      friday: { open: '10:00', close: '22:00', closed: false },
      saturday: { open: '10:00', close: '22:00', closed: false },
      sunday: { open: '11:00', close: '18:00', closed: false }
    })
  },
  contact: {
    phone: { type: String },
    email: { type: String },
    website: { type: String },
    social: {
      instagram: { type: String },
      twitter: { type: String },
      facebook: { type: String }
    }
  },
  menu: {
    items: [MenuItemSchema],
    lastUpdated: { type: Date, default: Date.now }
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  },
  isActive: { type: Boolean, default: true },
  lastSeen: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create geospatial index
FoodTruckSchema.index({ location: '2dsphere' });

// Create text index for search
FoodTruckSchema.index({
  name: 'text',
  description: 'text',
  cuisine: 'text',
  'location.address': 'text',
  'location.neighborhood': 'text'
});

// Compound indexes for common queries
FoodTruckSchema.index({ isActive: 1, cuisine: 1 });
FoodTruckSchema.index({ isActive: 1, location: '2dsphere' });

// Virtual for computing if truck is currently open
FoodTruckSchema.virtual('isCurrentlyOpen').get(function() {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  
  const todayHours = this.hours?.[day];
  if (!todayHours || todayHours.closed) {
    return false;
  }
  
  return time >= todayHours.open && time <= todayHours.close;
});

// Instance method to calculate distance from a point
FoodTruckSchema.methods.calculateDistance = function(lat: number, lng: number): number {
  const [truckLng, truckLat] = this.location.coordinates;
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat * Math.PI) / 180;
  const φ2 = (truckLat * Math.PI) / 180;
  const Δφ = ((truckLat - lat) * Math.PI) / 180;
  const Δλ = ((truckLng - lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Static method to find nearby trucks
FoodTruckSchema.statics.findNearby = function(
  lat: number, 
  lng: number, 
  maxDistance: number = 5000 // 5km default
) {
  return this.find({
    isActive: true,
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: maxDistance
      }
    }
  });
};

// Pre-save middleware to update lastSeen
FoodTruckSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('location')) {
    this.lastSeen = new Date();
  }
  next();
});

// Create and export the model
const TruckModel = mongoose.models.FoodTruck || mongoose.model('FoodTruck', FoodTruckSchema);

export { TruckModel };