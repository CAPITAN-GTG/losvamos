'use client';

import Image from "next/image";
import Link from "next/link";
import Navigation from "../../components/Navigation";
import { Search, ArrowRight } from "lucide-react";
import Pagination from "../../components/ui/pagination";
import { useState, useEffect } from "react";

export default function Lugares() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch('/api/places');
        if (response.ok) {
          const data = await response.json();
          setPlaces(data.places || []);
        } else {
          // Failed to fetch places
        }
      } catch (error) {
        // Error fetching places
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredPlaces = places.filter(place => 
    place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaginatedPlaces = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPlaces.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Simple Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Lugares para Explorar</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar lugares..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
            />
          </div>
        </div>

        {/* Places Grid */}
        {filteredPlaces.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron lugares' : 'No hay lugares disponibles'}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'Pronto agregaremos más lugares increíbles para explorar.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getPaginatedPlaces().map((place: any) => (
                <Link 
                  key={place._id.toString()} 
                  href={`/pages/lugares/${place._id}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group relative aspect-video cursor-pointer hover:outline hover:outline-4 hover:outline-blue-500 hover:outline-offset-2"
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
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-blue-200 transition-colors duration-300">{place.title}</h3>
                    <p className="text-sm text-gray-200 line-clamp-1 group-hover:text-blue-100 transition-colors duration-300">{place.location}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {filteredPlaces.length > itemsPerPage && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Pagination
                  totalItems={filteredPlaces.length}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  className="justify-center"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
