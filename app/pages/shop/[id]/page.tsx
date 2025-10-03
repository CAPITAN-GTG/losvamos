import { use } from 'react';
import Image from "next/image";
import { notFound } from "next/navigation";
import Navigation from "../../../components/Navigation";
import CartButton from "../../../components/CartButton";
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
    const product = await getProductById(resolvedParams.id);

    if (!product) {
      notFound();
    }

    const groupedTags = product.tags?.reduce((acc, tag) => {
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
          <ProductImageGallery product={product} />

          {/* Product Info */}
          <div className="space-y-6 sm:space-y-8">
            {/* Title and Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-purple-600">
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
              <p className="text-gray-900 leading-relaxed mb-4 text-sm sm:text-base">
                {product.description}
              </p>
              <p className="text-gray-900 leading-relaxed text-sm sm:text-base">
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
              {product.inStock ? (
                <CartButton
                  productId={product._id?.toString() || ''}
                  productName={product.name}
                  productPrice={product.price}
                  productCurrency={product.currency || 'USD'}
                  productImage={product.images?.[0] || '/placeholder-image.jpg'}
                  className="w-full py-3 sm:py-4 px-6 rounded-lg font-semibold text-sm sm:text-base"
                />
              ) : (
                <button
                  disabled
                  className="w-full py-3 sm:py-4 px-6 rounded-lg font-semibold text-sm sm:text-base bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                  Agotado
                </button>
              )}
              
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
                  <span className="capitalize text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900">Disponibilidad:</span>
                  <span className="text-gray-900">{product.inStock ? 'En Stock' : 'Agotado'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900">Material:</span>
                  <span className="capitalize text-gray-900">
                    {product.tags?.find(tag => tag.type === 'material')?.label || 
                     product.tags?.find(tag => tag.type === 'material')?.value || 
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
    throw error;
  }
}
