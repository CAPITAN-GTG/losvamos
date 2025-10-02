'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, MapPin, ShoppingBag, ArrowRight } from 'lucide-react';
// Remove direct API imports - we'll use static data for search

interface SearchResult {
  id: string;
  name: string;
  type: 'place' | 'product';
  image: string;
  description: string;
  url: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Static search data for client-side search
  const searchData = {
    places: [
      {
        _id: 'angels-flight',
        name: 'Angels Flight',
        location: 'Los Angeles, California',
        description: 'Un funicular histórico en el centro de Los Ángeles',
        heroImage: '/angels-flight.png'
      },
      {
        _id: 'gaylord-resort',
        name: 'Gaylord Resort',
        location: 'Nashville, Tennessee',
        description: 'Un resort de lujo en Nashville',
        heroImage: '/gaylord-resort.jpg'
      }
    ],
    products: [
      {
        _id: 'shirt-hiking',
        name: 'Camiseta Hiking',
        description: 'Camiseta cómoda y resistente para tus aventuras',
        heroImage: '/shirt-hiking.png'
      },
      {
        _id: 'hat-hiking',
        name: 'Sombrero Hiking',
        description: 'Sombrero protector para el sol',
        heroImage: '/hat-hiking.png'
      }
    ]
  };

  // Handle search
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchTerm = searchQuery.toLowerCase();
    
    // Search places
    const placeResults = searchData.places
      .filter(place => 
        place.name.toLowerCase().includes(searchTerm) ||
        place.location.toLowerCase().includes(searchTerm) ||
        place.description.toLowerCase().includes(searchTerm)
      )
      .map(place => ({
        id: place._id,
        name: place.name,
        type: 'place' as const,
        image: place.heroImage,
        description: place.location,
        url: `/pages/blog/${place.name.toLowerCase().replace(/\s+/g, '-')}`
      }));

    // Search products
    const productResults = searchData.products
      .filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      )
      .map(product => ({
        id: product._id.toString(),
        name: product.name,
        type: 'product' as const,
        image: product.heroImage,
        description: product.description,
        url: `/pages/shop/${product.name.toLowerCase().replace(/\s+/g, '-')}`
      }));

    // Limit results to 7 items for performance and UX
    const allResults = [...placeResults, ...productResults].slice(0, 7);
    setResults(allResults);
    setIsOpen(allResults.length > 0);
    setSelectedIndex(-1);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          window.location.href = results[selectedIndex].url;
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Buscar lugares, productos..."
          className="w-full px-6 py-4 pl-14 pr-12 text-lg rounded-full border-0 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
        />
        
        {/* Search Icon */}
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
          <Search className="w-6 h-6 text-gray-500" />
        </div>

        {/* Clear Button */}
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              setSelectedIndex(-1);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
          <div className="max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <Link
                key={`${result.type}-${result.id}`}
                href={result.url}
                className={`flex items-center p-4 hover:bg-gray-50 transition-colors ${
                  index === selectedIndex ? 'bg-gray-50' : ''
                }`}
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                }}
              >
                <div className="flex-shrink-0 w-12 h-12 relative rounded-lg overflow-hidden mr-4">
                  <img
                    src={result.image}
                    alt={result.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {result.name}
                    </h3>
                    <span className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${
                      result.type === 'place' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {result.type === 'place' ? (
                        <>
                          <MapPin className="w-3 h-3" />
                          <span>Lugar</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3" />
                          <span>Producto</span>
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {result.description}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
          
          {results.length >= 7 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Mostrando los primeros 7 resultados. Refina tu búsqueda para ver más.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
