import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/Navigation";
import { places } from "../../data/places";

export default function Lugares() {
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
          {places.map((place) => (
            <Link key={place.id} href={`/pages/blog/${place.id}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="aspect-video relative">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900">{place.name}</h3>
                  <p className="text-gray-700 mb-2 text-sm sm:text-base">{place.location}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{new Date(place.date).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
