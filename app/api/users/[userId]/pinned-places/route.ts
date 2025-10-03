import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Place from '@/lib/schemas/Place';

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    await connectDB();
    
    const resolvedParams = await params;
    const places = await Place.find({ 
      pins: { $in: [resolvedParams.userId] },
      isActive: true 
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      places: JSON.parse(JSON.stringify(places))
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get pinned places' },
      { status: 500 }
    );
  }
}

