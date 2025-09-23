import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { TruckModel } from '@/models/Truck';
import { APIResponse, FoodTruck } from '@/types';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const truck = await TruckModel.findById(id)
      .select('-__v')
      .lean()
      .exec();

    if (!truck) {
      const response: APIResponse<null> = {
        success: false,
        error: 'Truck not found'
      };
      return Response.json(response, { status: 404 });
    }

    const response: APIResponse<FoodTruck> = {
      success: true,
      data: truck as unknown as FoodTruck
    };

    return Response.json(response);
  } catch (error) {
    console.error('Error fetching truck:', error);
    const response: APIResponse<null> = {
      success: false,
      error: 'Failed to fetch truck'
    };
    return Response.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const data = await request.json();

    await connectToDatabase();

    const truck = await TruckModel.findByIdAndUpdate(
      id,
      { ...data, lastSeen: new Date() },
      { new: true, runValidators: true }
    )
      .select('-__v')
      .lean()
      .exec();

    if (!truck) {
      const response: APIResponse<null> = {
        success: false,
        error: 'Truck not found'
      };
      return Response.json(response, { status: 404 });
    }

    const response: APIResponse<FoodTruck> = {
      success: true,
      data: truck as unknown as FoodTruck
    };

    return Response.json(response);
  } catch (error) {
    console.error('Error updating truck:', error);
    const response: APIResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update truck'
    };
    return Response.json(response, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const truck = await TruckModel.findByIdAndDelete(id);

    if (!truck) {
      const response: APIResponse<null> = {
        success: false,
        error: 'Truck not found'
      };
      return Response.json(response, { status: 404 });
    }

    const response: APIResponse<{ message: string }> = {
      success: true,
      data: { message: 'Truck deleted successfully' }
    };

    return Response.json(response);
  } catch (error) {
    console.error('Error deleting truck:', error);
    const response: APIResponse<null> = {
      success: false,
      error: 'Failed to delete truck'
    };
    return Response.json(response, { status: 500 });
  }
}