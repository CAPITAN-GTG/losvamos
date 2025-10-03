import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Place from '@/lib/schemas/Place';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    
    const query = { isActive: true };
    
    const places = await Place.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Place.countDocuments(query);
    
    return NextResponse.json({
      places,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const place = new Place({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedPlace = await place.save();
    
    return NextResponse.json(savedPlace, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create place' },
      { status: 500 }
    );
  }
}
