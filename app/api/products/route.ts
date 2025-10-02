import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/schemas/Product';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    console.log('Connected to database successfully');
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const inStock = searchParams.get('inStock');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    
    const query: any = { isActive: true };
    
    if (category) query.category = category;
    if (inStock === 'true') query.inStock = true;
    
    console.log('Query:', query);
    const products = await Product.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    console.log('Found products:', products.length);
    
    const total = await Product.countDocuments(query);
    
    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    console.log('Connected to database successfully for POST');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const product = new Product({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Product to save:', product);
    
    const savedProduct = await product.save();
    console.log('Product saved successfully:', savedProduct._id);
    
    return NextResponse.json(savedProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
