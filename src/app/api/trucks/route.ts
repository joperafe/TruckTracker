import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TruckModel } from '@/models/Truck';
import { APIResponse, FoodTruck } from '@/types';

interface TruckQuery {
  isActive: boolean;
  cuisine?: { $in: string[] };
  $text?: { $search: string };
  location?: {
    $near: {
      $geometry: {
        type: 'Point';
        coordinates: [number, number];
      };
      $maxDistance: number;
    };
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const cuisine = searchParams.get('cuisine');
    const search = searchParams.get('search');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = parseFloat(searchParams.get('radius') || '5000'); // 5km default
    const limit = parseInt(searchParams.get('limit') || '50');
    const isOpen = searchParams.get('isOpen');

    await connectToDatabase();

    const query: TruckQuery = { isActive: true };
    
    // Filter by cuisine
    if (cuisine && cuisine !== 'all') {
      query.cuisine = { $in: [cuisine] };
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Geospatial query if location provided
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius
        }
      };
    }

    let trucksQuery = TruckModel.find(query)
      .select('-__v')
      .limit(limit)
      .lean();

    // Add text score if searching
    if (search) {
      trucksQuery = trucksQuery.select({ score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } });
    }

    const trucks = await trucksQuery.exec();

    // Filter by open status if requested (done in app since virtual field)
    let filteredTrucks = trucks;
    if (isOpen === 'true') {
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const currentTime = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      filteredTrucks = trucks.filter(truck => {
        const hoursMap = truck.hours as Record<string, { open: string; close: string; closed: boolean }>;
        const todayHours = hoursMap?.[currentDay];
        if (!todayHours || todayHours.closed) {
          return false;
        }
        return currentTime >= todayHours.open && currentTime <= todayHours.close;
      });
    }

    const response: APIResponse<FoodTruck[]> = {
      success: true,
      data: filteredTrucks as unknown as FoodTruck[],
      count: filteredTrucks.length
    };

    return Response.json(response);
  } catch (error) {
    console.error('Error fetching trucks:', error);
    const response: APIResponse<null> = {
      success: false,
      error: 'Failed to fetch trucks'
    };
    return Response.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    await connectToDatabase();

    const truck = new TruckModel(data);
    await truck.save();

    const response: APIResponse<FoodTruck> = {
      success: true,
      data: truck.toObject() as unknown as FoodTruck
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating truck:', error);
    const response: APIResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create truck'
    };
    return Response.json(response, { status: 400 });
  }
}