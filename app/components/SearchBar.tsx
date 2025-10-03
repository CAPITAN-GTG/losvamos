'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, X, MapPin, ShoppingBag, ArrowRight } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const handleSearch = useCallback(async (searchQuery: string) => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    // Set loading state
    setIsLoading(true);

    // Debounce the search
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=7`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
          setIsOpen((data.results || []).length > 0);
        } else {
          setResults([]);
          setIsOpen(false);
        }
      } catch (error) {
        // Search error
        setResults([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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
          placeholder="Buscar lugares y productos..."
          className="w-full px-6 py-4 pl-14 pr-12 text-lg rounded-full border-0 bg-white/95 backdrop-blur-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:bg-white shadow-xl transition-all duration-200"
        />
        
        {/* Search Icon */}
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Search className="w-6 h-6 text-gray-500" />
        </div>

        {/* Clear Button or Loading Spinner */}
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              setSelectedIndex(-1);
              setIsLoading(false);
              if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
              }
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/30"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {(isOpen || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-[99999] animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                  <span className="text-gray-600 font-medium">Buscando...</span>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.slice(0, 7).map((result, index) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.url}
                    className={`flex items-center p-4 hover:bg-gray-50/80 transition-all duration-150 border-l-4 ${
                      index === selectedIndex 
                        ? 'bg-green-50/80 border-l-green-500' 
                        : 'border-l-transparent hover:border-l-gray-200'
                    }`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 relative rounded-xl overflow-hidden mr-4 shadow-sm">
                      <img
                        src={result.image}
                        alt={result.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate text-base">
                          {result.name}
                        </h3>
                        <span className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-full ${
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
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.trim() && !isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">No se encontraron resultados</p>
                  <p className="text-sm text-gray-500 mt-1">Intenta con otros términos de búsqueda</p>
                </div>
              </div>
            ) : null}
          </div>
          
          {!isLoading && results.length >= 7 && (
            <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-200/50">
              <p className="text-sm text-gray-600 text-center font-medium">
                Mostrando los primeros 7 resultados. Refina tu búsqueda para ver más.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
