import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/Navigation";
import PinButton from "../../components/PinButton";
import CartButton from "../../components/CartButton";
import { placesApi } from "@/lib/api-utils";
import { Star, ArrowRight } from "lucide-react";

export default async function Lugares() {
  const { places } = await placesApi.getAll({ limit: 100 });
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Lugares para Explorar
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-0 sm:mb-8 max-w-3xl mx-auto text-white">
              Descubre lugares increíbles alrededor del mundo
            </p>
          </div>
        </div>
      </div>

      {/* Places Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {places.map((place: any) => (
            <div key={place._id.toString()} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group hover:scale-105">
              <Link href={`/pages/lugares/${place._id}`} className="block">
                <div className="aspect-video relative">
                  <Image
                    src={place.heroImage}
                    alt={place.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
              
              {/* Always visible action buttons */}
              <div className="absolute top-3 right-3 flex flex-col space-y-2">
                <PinButton 
                  placeId={place._id.toString()} 
                  placeName={place.title}
                  className="bg-white/90 backdrop-blur-sm shadow-md"
                />
                <CartButton 
                  productId={place._id.toString()}
                  productName={place.title}
                  productPrice={0}
                  productCurrency="USD"
                  productImage={place.heroImage}
                  className="bg-white/90 backdrop-blur-sm shadow-md text-xs px-2 py-1"
                />
              </div>
              
              <div className="p-4">
                <Link href={`/pages/lugares/${place._id}`}>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 group-hover:text-green-600 transition-colors">{place.title}</h3>
                </Link>
                <p className="text-gray-700 mb-2 text-sm sm:text-base">{place.location}</p>
                <p className="text-xs sm:text-sm text-gray-600">{new Date(place.date).toLocaleDateString('es-ES')}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">4.8</span>
                  </div>
                  <Link href={`/pages/lugares/${place._id}`} className="flex items-center space-x-1 text-green-600 group-hover:text-green-700 transition-colors">
                    <span className="text-sm font-medium">Explorar</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
