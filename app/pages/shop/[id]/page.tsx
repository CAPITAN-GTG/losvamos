'use client';

import { useState, use } from 'react';
import Image from "next/image";
import { notFound } from "next/navigation";
import Navigation from "../../../components/Navigation";
import { getProductById, formatPrice } from "../../../data/products";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const product = getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const groupedTags = product.tags.reduce((acc, tag) => {
    if (!acc[tag.type]) {
      acc[tag.type] = [];
    }
    acc[tag.type].push(tag);
    return acc;
  }, {} as Record<string, typeof product.tags>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square relative rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 sm:space-y-8">
            {/* Title and Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {formatPrice(product)}
                </span>
                {product.inStock ? (
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
              <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                {product.description}
              </p>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {product.longDescription}
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
                        className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
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
                disabled={!product.inStock}
                className={`w-full py-3 sm:py-4 px-6 rounded-lg font-semibold text-sm sm:text-base transition-colors ${
                  product.inStock
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Agregar al Carrito' : 'Agotado'}
              </button>
              
              <div className="flex space-x-4">
                <button className="flex-1 py-2 sm:py-3 px-4 sm:px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                  Agregar a Favoritos
                </button>
                <button className="flex-1 py-2 sm:py-3 px-4 sm:px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                  Compartir
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6 sm:pt-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Detalles del Producto</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Categoría:</span>
                  <span className="capitalize text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Disponibilidad:</span>
                  <span className="text-gray-900">{product.inStock ? 'En Stock' : 'Agotado'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Material:</span>
                  <span className="capitalize text-gray-900">
                    {product.tags.find(tag => tag.type === 'material')?.label || 
                     product.tags.find(tag => tag.type === 'material')?.value || 
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
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            ← Volver a la Tienda
          </a>
        </div>
      </div>
    </div>
  );
}
