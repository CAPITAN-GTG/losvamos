import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Place from '@/lib/schemas/Place';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    const { userId } = await request.json();
    const resolvedParams = await params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const place = await Place.findById(resolvedParams.id);
    if (!place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      );
    }

    // Check if user already pinned this place
    const isPinned = place.pins?.includes(userId);
    
    if (isPinned) {
      // Remove pin
      place.pins = place.pins?.filter((id: string) => id !== userId) || [];
    } else {
      // Add pin
      place.pins = [...(place.pins || []), userId];
    }

    place.updatedAt = new Date();
    await place.save();

    return NextResponse.json({
      success: true,
      isPinned: !isPinned,
      pinCount: place.pins?.length || 0
    });
  } catch (error) {
    console.error('Pin toggle error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle pin' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const resolvedParams = await params;

    const place = await Place.findById(resolvedParams.id);
    if (!place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      );
    }

    const isPinned = userId ? place.pins?.includes(userId) : false;
    const pinCount = place.pins?.length || 0;

    return NextResponse.json({
      isPinned,
      pinCount
    });
  } catch (error) {
    console.error('Get pin status error:', error);
    return NextResponse.json(
      { error: 'Failed to get pin status' },
      { status: 500 }
    );
  }
}

