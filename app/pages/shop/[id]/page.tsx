import { use } from 'react';
import Image from "next/image";
import { notFound } from "next/navigation";
import Navigation from "../../../components/Navigation";
import { getProductById, formatPrice } from "@/lib/api-utils";
import ProductImageGallery from "./ProductImageGallery";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    console.log('Looking for product with ID:', resolvedParams.id);
    
    const product = await getProductById(resolvedParams.id);
    console.log('Found product:', product ? product.name : 'null');

    if (!product) {
      console.log('Product not found, calling notFound()');
      notFound();
    }

    // Create a simplified product object to avoid circular references
    const simplifiedProduct = {
      _id: product._id?.toString(),
      name: product.name,
      description: product.description,
      longDescription: product.longDescription,
      price: product.price,
      currency: product.currency,
      heroImage: product.heroImage,
      gallery: product.gallery || [],
      category: product.category,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      tags: product.tags || [],
      sizes: product.sizes || [],
      colors: product.colors || [],
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };

    console.log('Simplified product created');

    const groupedTags = simplifiedProduct.tags?.reduce((acc, tag) => {
    if (!acc[tag.type]) {
      acc[tag.type] = [];
    }
    acc[tag.type].push(tag);
    return acc;
  }, {} as Record<string, any[]>) || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Product Images */}
          <ProductImageGallery product={simplifiedProduct} />

          {/* Product Info */}
          <div className="space-y-6 sm:space-y-8">
            {/* Title and Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {simplifiedProduct.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-purple-600">
                  {formatPrice(simplifiedProduct)}
                </span>
                {simplifiedProduct.inStock ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                    En Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-800">
                    Agotado
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Descripción</h2>
              <p className="text-gray-900 leading-relaxed mb-4 text-sm sm:text-base">
                {simplifiedProduct.description}
              </p>
              <p className="text-gray-900 leading-relaxed text-sm sm:text-base">
                {simplifiedProduct.longDescription}
              </p>
            </div>

            {/* Tags/Options */}
            <div className="space-y-4 sm:space-y-6">
              {Object.entries(groupedTags).map(([tagType, tags]) => (
                <div key={tagType}>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 capitalize">
                    {tagType === 'color' ? 'Color' : 
                     tagType === 'size' ? 'Talla' : 
                     tagType === 'material' ? 'Material' : tagType}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <button
                        key={index}
                        className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base text-gray-900"
                      >
                        {tag.label || tag.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-4">
              <button
                disabled={!simplifiedProduct.inStock}
                className={`w-full py-3 sm:py-4 px-6 rounded-lg font-semibold text-sm sm:text-base transition-colors ${
                  simplifiedProduct.inStock
                    ? 'bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {simplifiedProduct.inStock ? 'Agregar al Carrito' : 'Agotado'}
              </button>
              
              <div className="flex space-x-4">
                <button className="flex-1 py-2 sm:py-3 px-4 sm:px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base text-gray-900">
                  Agregar a Favoritos
                </button>
                <button className="flex-1 py-2 sm:py-3 px-4 sm:px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base text-gray-900">
                  Compartir
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6 sm:pt-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Detalles del Producto</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-900">Categoría:</span>
                  <span className="capitalize text-gray-900">{simplifiedProduct.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900">Disponibilidad:</span>
                  <span className="text-gray-900">{simplifiedProduct.inStock ? 'En Stock' : 'Agotado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900">Material:</span>
                  <span className="capitalize text-gray-900">
                    {simplifiedProduct.tags.find(tag => tag.type === 'material')?.label || 
                     simplifiedProduct.tags.find(tag => tag.type === 'material')?.value || 
                     'No especificado'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t">
          <a
            href="/pages/shop"
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            ← Volver a la Tienda
          </a>
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error('Error in ProductPage:', error);
    throw error;
  }
}
