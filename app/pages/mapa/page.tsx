'use client';

import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/Navigation";
import { MapPin, ArrowRight, Globe } from "lucide-react";
import { useState, useEffect } from "react";

export default function MapaPage() {
  const [featuredPlaces, setFeaturedPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPlaces = async () => {
      try {
        const response = await fetch('/api/places');
        if (response.ok) {
          const data = await response.json();
          const places = data.places || [];
          // Get 3 random places
          const shuffled = places.sort(() => 0.5 - Math.random());
          setFeaturedPlaces(shuffled.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPlaces();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Clean Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/mapa.jpeg"
            alt="Map Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <Globe className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Mapa Interactivo</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Nuestro Mapa de
            <span className="block text-green-300">
              Aventuras
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explora todos los lugares increíbles que hemos visitado
          </p>
        </div>
      </div>

      {/* Map Section - With Container and Separation */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mapa Interactivo</h2>
            <p className="text-gray-600">Explora nuestros destinos en el mapa</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="h-[60vh] md:h-[70vh]">
              <iframe
                src="https://www.google.com/maps/d/u/0/embed?mid=10N1FB26A46oMpTMyEC36jZwXqIY&femb=1&ll=35.38739382230657%2C-109.02474495000001&z=4"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Los Vamos Adventure Map"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Places Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 rounded-full px-4 py-2 mb-6">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Lugares Destacados</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Lugares Destacados</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre algunos de los destinos más increíbles que hemos explorado en nuestras aventuras
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse border border-gray-100">
                  <div className="aspect-video bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPlaces.map((place) => (
                <Link 
                  key={place._id} 
                  href={`/pages/lugares/${place._id}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group relative aspect-video cursor-pointer hover:outline hover:outline-4 hover:outline-blue-500 hover:outline-offset-2 border border-gray-100"
                >
                  <Image
                    src={place.heroImage}
                    alt={place.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Text overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-blue-200 transition-colors duration-300">{place.title}</h3>
                    <p className="text-sm text-gray-200 line-clamp-1 group-hover:text-blue-100 transition-colors duration-300">{place.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-16 pt-8 border-t border-gray-200">
            <Link
              href="/pages/lugares"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              <MapPin className="w-5 h-5" />
              <span>Explorar Todos los Lugares</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
