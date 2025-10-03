'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, MapPin, ShoppingBag, Home, User, LayoutDashboard, ShoppingCart, Shield, Globe } from 'lucide-react';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { getCartItemCount } from '@/lib/cart-utils';
import { isAdminClient } from '@/lib/admin-utils';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const [cartCount, setCartCount] = useState(0);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setCartCount(getCartItemCount(user.id));
      setIsAdminUser(isAdminClient(user.id));
    }
  }, [user, isLoaded]);

  // Update cart count when cart changes (this would need to be implemented with a context or event system)
  useEffect(() => {
    const handleCartUpdate = () => {
      if (user) {
        setCartCount(getCartItemCount(user.id));
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [user]);

  return (
    <nav className="relative z-50">
      {/* Dark green top section for user features */}
      <div className="bg-green-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-12">
            <div className="flex items-center space-x-2">
              {/* Dashboard Link for Signed In Users */}
              <SignedIn>
                <a 
                  href="/pages/dashboard" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-green-700 transition-all duration-200 font-medium text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </a>
                
                {/* Admin Link for Admin Users */}
                {isAdminUser && (
                  <a 
                    href="/pages/admin" 
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition-all duration-200 font-medium text-sm"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </a>
                )}
                
                {/* Cart Icon for Signed In Users */}
                <a 
                  href="/pages/cart" 
                  className="relative flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-green-700 transition-all duration-200 font-medium text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Carrito</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </a>
              </SignedIn>
              
              {/* Authentication Section */}
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-green-600">
                <SignedOut>
                  <SignInButton>
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white hover:bg-green-700 transition-all duration-200 font-medium text-sm">
                      <User className="w-4 h-4" />
                      <span>Iniciar Sesión</span>
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium text-sm px-3 py-2 transition-all duration-200">
                      Registrarse
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-6 h-6"
                      }
                    }}
                  />
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* White bottom section for logo and main navigation */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-40">
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-4 group">
                <div className="relative">
                  <Image
                    src="/logo.png"
                    alt="Los Vamos Logo"
                    width={100}
                    height={100}
                    className="rounded-xl transition-all duration-300"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-4xl font-bold text-gray-900">
                    LOS VAMOS en TEXAS
                  </h1>
                  <p className="text-base text-gray-600 font-medium">Viajes y lugares alrededor de Estados Unidos</p>
                </div>
              </a>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              <a 
                href="/" 
                className="flex items-center space-x-3 px-8 py-4 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-semibold text-xl"
              >
                <Home className="w-6 h-6" />
                <span>Inicio</span>
              </a>
              <a 
                href="/pages/lugares" 
                className="flex items-center space-x-3 px-8 py-4 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-semibold text-xl"
              >
                <MapPin className="w-6 h-6" />
                <span>Lugares</span>
              </a>
              <a 
                href="/pages/shop" 
                className="flex items-center space-x-3 px-8 py-4 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-semibold text-xl"
              >
                <ShoppingBag className="w-6 h-6" />
                <span>Tienda</span>
              </a>
              <a 
                href="/pages/mapa" 
                className="flex items-center space-x-3 px-8 py-4 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-semibold text-xl"
              >
                <Globe className="w-6 h-6" />
                <span>Mapa</span>
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all duration-200"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
              <a
                href="/"
                className="flex items-center space-x-3 px-3 py-3 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Inicio</span>
              </a>
              <a
                href="/pages/lugares"
                className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <MapPin className="w-5 h-5" />
                <span>Lugares</span>
              </a>
              <a
                href="/pages/shop"
                className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Tienda</span>
              </a>
              <a
                href="/pages/mapa"
                className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <Globe className="w-5 h-5" />
                <span>Mapa</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gray divider */}
      <div className="h-px bg-gray-300"></div>
    </nav>
  );
}
