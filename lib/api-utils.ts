import connectDB from '@/lib/mongodb';
import Place from '@/lib/schemas/Place';
import Product from '@/lib/schemas/Product';
import { Place as PlaceType, Product as ProductType } from '@/lib/types';

// Places API utilities
export const placesApi = {
  async getAll(params?: {
    category?: string;
    limit?: number;
    page?: number;
  }): Promise<{ places: PlaceType[]; pagination: any }> {
    try {
      console.log('Places API: Connecting to database...');
      await connectDB();
      console.log('Places API: Database connected');
      
      const query: any = { isActive: true };
      if (params?.category) query.category = params.category;
      
      const limit = params?.limit || 10;
      const page = params?.page || 1;
      
      console.log('Places API: Query:', query);
      console.log('Places API: Limit:', limit);
      
      const places = await Place.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
      
      console.log('Places API: Found places:', places.length);
      
      const total = await Place.countDocuments(query);
      console.log('Places API: Total places in DB:', total);
      
      return {
        places,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Places API Error:', error);
      throw error;
    }
  },

  async getByName(name: string): Promise<PlaceType | null> {
    await connectDB();
    return await Place.findOne({ name: { $regex: new RegExp(name, 'i') } });
  },

  async getById(id: string): Promise<PlaceType | null> {
    await connectDB();
    return await Place.findById(id);
  },

  async create(place: Omit<PlaceType, '_id' | 'createdAt' | 'updatedAt'>): Promise<PlaceType> {
    await connectDB();
    const newPlace = new Place({
      ...place,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return await newPlace.save();
  },

  async update(id: string, place: Partial<PlaceType>): Promise<PlaceType | null> {
    await connectDB();
    return await Place.findByIdAndUpdate(
      id,
      { ...place, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    await Place.findByIdAndDelete(id);
    return true;
  }
};

// Products API utilities
export const productsApi = {
  async getAll(params?: {
    category?: string;
    inStock?: boolean;
    limit?: number;
    page?: number;
  }): Promise<{ products: ProductType[]; pagination: any }> {
    await connectDB();
    
    const query: any = { isActive: true };
    if (params?.category) query.category = params.category;
    if (params?.inStock !== undefined) query.inStock = params.inStock;
    
    const limit = params?.limit || 10;
    const page = params?.page || 1;
    
    const products = await Product.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(query);
    
    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async getByName(name: string): Promise<ProductType | null> {
    try {
      console.log('Searching for product:', name);
      const product = await Product.findOne({ name: { $regex: new RegExp(name, 'i') } });
      console.log('Product search result:', product ? product.name : 'null');
      return product;
    } catch (error) {
      console.error('Error in getByName:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<ProductType | null> {
    await connectDB();
    return await Product.findById(id);
  },

  async create(product: Omit<ProductType, '_id' | 'createdAt' | 'updatedAt'>): Promise<ProductType> {
    await connectDB();
    const newProduct = new Product({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return await newProduct.save();
  },

  async update(id: string, product: Partial<ProductType>): Promise<ProductType | null> {
    await connectDB();
    return await Product.findByIdAndUpdate(
      id,
      { ...product, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    await Product.findByIdAndDelete(id);
    return true;
  }
};

// Helper functions for backward compatibility
export async function getPlaceById(id: string): Promise<PlaceType | null> {
  return await placesApi.getByName(id);
}

export async function getProductById(id: string): Promise<ProductType | null> {
  try {
    console.log('getProductById called with:', id);
    await connectDB();
    console.log('Database connected, calling getByName');
    return await productsApi.getByName(id);
  } catch (error) {
    console.error('Error in getProductById:', error);
    throw error;
  }
}

export async function getFeaturedPlaces(): Promise<PlaceType[]> {
  try {
    console.log('Fetching featured places...');
    const response = await placesApi.getAll({ limit: 3 });
    console.log('Places found:', response.places.length);
    console.log('Places:', response.places.map(p => p.name));
    return response.places;
  } catch (error) {
    console.error('Error fetching featured places:', error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<ProductType[]> {
  const response = await productsApi.getAll({ limit: 4 });
  return response.products;
}

export async function getPlacesByCategory(category: string): Promise<PlaceType[]> {
  const response = await placesApi.getAll({ category, limit: 100 });
  return response.places;
}

export async function getProductsByCategory(category: string): Promise<ProductType[]> {
  const response = await productsApi.getAll({ category, limit: 100 });
  return response.products;
}

export function formatPrice(product: ProductType): string {
  return `${product.currency || 'USD'} ${product.price}`;
}