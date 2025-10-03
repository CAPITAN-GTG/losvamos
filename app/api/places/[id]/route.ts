import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Place from '@/lib/schemas/Place';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const place = await Place.findOne({ title: { $regex: new RegExp(id, 'i') } });
    
    if (!place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(place);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch place' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    
    const place = await Place.findOneAndUpdate(
      { title: { $regex: new RegExp(id, 'i') } },
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(place);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update place' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const place = await Place.findOneAndDelete({ title: { $regex: new RegExp(id, 'i') } });
    
    if (!place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Place deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete place' },
      { status: 500 }
    );
  }
}
