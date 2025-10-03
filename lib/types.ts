export interface Place {
  _id?: string;
  title: string;
  subtitle: string;
  date: string;
  heroImage: string;
  description: string;
  location: string;
  gallery: string[];
  pins?: string[]; // Array of user IDs who pinned this place
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
  images: string[];
  category: string;
  quantity?: number;
  inStock?: boolean;
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
