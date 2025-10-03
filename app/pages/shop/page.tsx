import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/Navigation";
import { productsApi, formatPrice } from "@/lib/api-utils";

export default async function Shop() {
  const { products } = await productsApi.getAll({ limit: 100 });
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Tienda de Viajes
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-0 sm:mb-8 max-w-3xl mx-auto text-white">
              Encuentra todo lo que necesitas para tu próxima aventura
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {/* Product Cards */}
          {products.map((product) => (
            <Link key={product._id?.toString() || product.name} href={`/pages/shop/${product._id}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="aspect-square relative">
                  <Image
                    src={product.images?.[0] || '/placeholder-image.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900">{product.name}</h3>
                  <p className="text-lg sm:text-xl font-bold text-purple-600 mb-2">{formatPrice(product)}</p>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{product.description}</p>
                  {product.inStock ? (
                    <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base">
                      Ver Detalles
                    </button>
                  ) : (
                    <button className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed text-sm sm:text-base">
                      Agotado
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
