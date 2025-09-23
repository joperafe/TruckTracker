import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TruckModel } from '@/models/Truck';
import { APIResponse, FoodTruck } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { trucks } = await request.json();

    if (!trucks || !Array.isArray(trucks)) {
      return Response.json(
        { success: false, error: 'Invalid trucks data' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Clear existing data (for development only)
    await TruckModel.deleteMany({});

    // Insert sample trucks
    const createdTrucks = await TruckModel.insertMany(trucks);

    const response: APIResponse<{ count: number; trucks: FoodTruck[] }> = {
      success: true,
      data: {
        count: createdTrucks.length,
        trucks: createdTrucks as unknown as FoodTruck[]
      }
    };

    return Response.json(response);
  } catch (error) {
    console.error('Error seeding database:', error);
    const response: APIResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to seed database'
    };
    return Response.json(response, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    
    const count = await TruckModel.countDocuments();
    
    const response: APIResponse<{ count: number }> = {
      success: true,
      data: { count }
    };

    return Response.json(response);
  } catch (error) {
    console.error('Error checking seed status:', error);
    const response: APIResponse<null> = {
      success: false,
      error: 'Failed to check seed status'
    };
    return Response.json(response, { status: 500 });
  }
}