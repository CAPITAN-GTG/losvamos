'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import PinButton from '../../components/PinButton';
import { getCart } from '@/lib/cart-utils';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Star,
  Pin,
  ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [pinnedPlaces, setPinnedPlaces] = useState<any[]>([]);
  const [isLoadingPinned, setIsLoadingPinned] = useState(true);
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    if (isLoaded && user) {
      const fetchPinnedPlaces = async () => {
        try {
          const response = await fetch(`/api/users/${user.id}/pinned-places`);
          if (response.ok) {
            const data = await response.json();
            setPinnedPlaces(data.places);
          }
        } catch (error) {
          console.error('Error fetching pinned places:', error);
        } finally {
          setIsLoadingPinned(false);
        }
      };

      fetchPinnedPlaces();
      
      // Get cart items count
      const cart = getCart(user.id);
      setCartItems(cart.itemCount);
    }
  }, [user, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Requerido</h1>
            <p className="text-gray-600">Por favor, inicia sesión para acceder a tu dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Hola, {user.firstName || 'Explorador'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenido a tu centro de control de aventuras
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Lugares Guardados</p>
                <p className="text-2xl font-bold text-gray-900">{pinnedPlaces.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Items en Carrito</p>
                <p className="text-2xl font-bold text-gray-900">{cartItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Experiencias</p>
                <p className="text-2xl font-bold text-gray-900">{pinnedPlaces.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pinned Places Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Pin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Lugares Guardados</h2>
                <p className="text-sm text-gray-600">Tus lugares favoritos</p>
              </div>
            </div>
            <Link
              href="/pages/lugares"
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingPinned ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="w-full h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : pinnedPlaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pinnedPlaces.map((place) => (
                <div key={place._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="relative h-32">
                    <Image
                      src={place.heroImage}
                      alt={place.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <PinButton 
                        placeId={place._id} 
                        placeName={place.title}
                        className="bg-white/90 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{place.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{place.location}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">4.8</span>
                      </div>
                      <Link
                        href={`/pages/lugares/${place._id}`}
                        className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes lugares guardados</h3>
              <p className="text-gray-600 mb-6">
                Comienza guardando lugares que te interesen para verlos aquí.
              </p>
              <Link
                href="/pages/lugares"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span>Explorar Lugares</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
