import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Place from '@/lib/schemas/Place';
import Product from '@/lib/schemas/Product';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = 7; // Always limit to 7 total results
    
    if (!query || query.trim().length < 2) {
      // If no query, return first 7 items (mix of places and products)
      const places = await Place.find({ isActive: true }).limit(4);
      const products = await Product.find({ isActive: true }).limit(3);

      const formattedPlaces = places.map(place => ({
        id: place._id.toString(),
        name: place.title,
        type: 'place' as const,
        image: place.heroImage,
        description: place.location,
        url: `/pages/lugares/${place._id}`
      }));

      const formattedProducts = products.map(product => ({
        id: product._id.toString(),
        name: product.name,
        type: 'product' as const,
        image: product.images?.[0] || '/placeholder-image.jpg',
        description: product.description || `$${product.price}`,
        url: `/pages/shop/${product._id}`
      }));

      const allResults = [...formattedPlaces, ...formattedProducts].slice(0, limit);

      return NextResponse.json({
        places: formattedPlaces,
        products: formattedProducts,
        results: allResults,
        total: allResults.length
      });
    }

    const searchTerm = query.trim();
    
    // Search places by title only
    const places = await Place.find({
      $and: [
        { isActive: true },
        { title: { $regex: searchTerm, $options: 'i' } }
      ]
    }).limit(4);

    // Search products by name only
    const products = await Product.find({
      $and: [
        { isActive: true },
        { name: { $regex: searchTerm, $options: 'i' } }
      ]
    }).limit(3);

    // If no matches found, get first items instead
    if (places.length === 0 && products.length === 0) {
      const fallbackPlaces = await Place.find({ isActive: true }).limit(4);
      const fallbackProducts = await Product.find({ isActive: true }).limit(3);

      const formattedPlaces = fallbackPlaces.map(place => ({
        id: place._id.toString(),
        name: place.title,
        type: 'place' as const,
        image: place.heroImage,
        description: place.location,
        url: `/pages/lugares/${place._id}`
      }));

      const formattedProducts = fallbackProducts.map(product => ({
        id: product._id.toString(),
        name: product.name,
        type: 'product' as const,
        image: product.images?.[0] || '/placeholder-image.jpg',
        description: product.description || `$${product.price}`,
        url: `/pages/shop/${product._id}`
      }));

      const allResults = [...formattedPlaces, ...formattedProducts].slice(0, limit);

      return NextResponse.json({
        places: formattedPlaces,
        products: formattedProducts,
        results: allResults,
        total: allResults.length
      });
    }

    // Format results
    const formattedPlaces = places.map(place => ({
      id: place._id.toString(),
      name: place.title,
      type: 'place' as const,
      image: place.heroImage,
      description: place.location,
      url: `/pages/lugares/${place._id}`
    }));

    const formattedProducts = products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      type: 'product' as const,
      image: product.images?.[0] || '/placeholder-image.jpg',
      description: product.description || `$${product.price}`,
      url: `/pages/shop/${product._id}`
    }));

    // Combine and limit results to exactly 7
    const allResults = [...formattedPlaces, ...formattedProducts].slice(0, limit);

    return NextResponse.json({
      places: formattedPlaces,
      products: formattedProducts,
      results: allResults,
      total: allResults.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}
