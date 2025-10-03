'use client';

import { useState } from 'react';
import Image from "next/image";
import { Product } from '@/lib/types';

interface ProductImageGalleryProps {
  product: Product;
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Ensure we have at least one image (fallback to placeholder if needed)
  const images = product.images && product.images.length > 0 ? product.images : ['/placeholder-image.jpg'];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
        <Image
          src={images[selectedImageIndex]}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
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
  );
}
