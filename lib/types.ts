export interface Place {
  _id?: string;
  name: string;
  description: string;
  content?: string;
  location: string;
  address?: string;
  heroImage: string;
  gallery: string[];
  category: string;
  rating?: number;
  priceRange?: '$' | '$$' | '$$$' | '$$$$';
  coordinates?: {
    lat: number;
    lng: number;
  };
  amenities?: string[];
  date?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductTag {
  type: string;
  value: string;
  label?: string;
}

export interface Product {
  _id?: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  currency?: string;
  heroImage: string;
  gallery?: string[];
  category: string;
  inStock?: boolean;
  stockQuantity?: number;
  tags?: ProductTag[];
  sizes?: string[];
  colors?: string[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
