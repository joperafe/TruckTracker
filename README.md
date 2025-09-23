# TruckTracker - Food Truck Locator App

A full-stack Next.js application for discovering food trucks using interactive maps, real-time location data, and comprehensive filtering.

## Features

### Core Features
- 🗺️ **Interactive Map**: Real-time food truck locations with Leaflet.js
- 🔍 **Smart Search**: Search by name, cuisine type, or location
- 📱 **Mobile First**: Responsive design optimized for mobile devices
- 🌍 **Geolocation**: Find trucks near your current location
- ⭐ **Ratings & Reviews**: Truck ratings and customer feedback
- 📋 **Detailed Menus**: Browse truck menus with pricing and dietary info
- ⏰ **Operating Hours**: Real-time status (open/closed) based on current hours

### Technical Features
- **Next.js 14+** with App Router and TypeScript
- **MongoDB** with Mongoose ODM and geospatial indexing
- **Tailwind CSS** for responsive styling
- **React Context** for unified state management
- **RESTful API** with proper error handling
- **Leaflet Maps** with custom markers and clustering

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/joperafe/TruckTracker.git
   cd truck-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/trucktrackr?retryWrites=true&w=majority
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token-here
   NEXT_PUBLIC_DEFAULT_LAT=40.7128
   NEXT_PUBLIC_DEFAULT_LNG=-74.0060
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Seed the database** (optional)
   - Navigate to `http://localhost:3000/admin`
   - Click "Seed Database" to populate with sample data

6. **Visit the application**
   - Open `http://localhost:3000` in your browser
   - The app will redirect to the interactive map at `/map`
