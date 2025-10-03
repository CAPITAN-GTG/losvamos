'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, MapPin, ShoppingBag, Home, User, LayoutDashboard, ShoppingCart, Shield } from 'lucide-react';
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
    <nav className="bg-green-600 shadow-lg border-b border-green-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Los Vamos Logo"
                  width={60}
                  height={60}
                  className="rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-xl bg-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-white">
                  LOS VAMOS en TEXAS
                </h1>
                <p className="text-xs text-green-100 font-medium">Viajes y lugares alrededor de Estados Unidos</p>
              </div>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <a 
              href="/" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:text-green-200 hover:bg-green-700 transition-all duration-200 font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Inicio</span>
            </a>
            <a 
              href="/pages/lugares" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:text-green-200 hover:bg-green-700 transition-all duration-200 font-medium"
            >
              <MapPin className="w-4 h-4" />
              <span>Lugares</span>
            </a>
            <a 
              href="/pages/shop" 
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:text-green-200 hover:bg-green-700 transition-all duration-200 font-medium"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Tienda</span>
            </a>
            
            {/* Dashboard Link for Signed In Users */}
            <SignedIn>
              <a 
                href="/pages/dashboard" 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:text-green-200 hover:bg-green-700 transition-all duration-200 font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </a>
              
              {/* Admin Link for Admin Users */}
              {isAdminUser && (
                <a 
                  href="/pages/admin" 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:text-red-200 hover:bg-red-700 transition-all duration-200 font-medium border border-red-400"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </a>
              )}
            </SignedIn>
            
            {/* Cart Icon for Signed In Users */}
            <SignedIn>
              <a 
                href="/pages/cart" 
                className="relative flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:text-green-200 hover:bg-green-700 transition-all duration-200 font-medium"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Carrito</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </a>
            </SignedIn>
            
            {/* Authentication Section */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-green-500">
              <SignedOut>
                <SignInButton>
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:text-green-200 hover:bg-green-700 transition-all duration-200 font-medium">
                    <User className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="bg-green-500 hover:bg-green-400 text-white rounded-lg font-medium text-sm px-4 py-2 transition-all duration-200">
                    Registrarse
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-white hover:text-green-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all duration-200"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-700 border-t border-green-800">
            <a
              href="/"
              className="flex items-center space-x-3 px-3 py-3 text-white font-medium rounded-lg hover:bg-green-600 hover:text-green-100 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              <span>Inicio</span>
            </a>
            <a
              href="/pages/lugares"
              className="flex items-center space-x-3 px-3 py-3 text-white hover:text-green-200 hover:bg-green-600 transition-all duration-200 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <MapPin className="w-5 h-5" />
              <span>Lugares</span>
            </a>
            <a
              href="/pages/shop"
              className="flex items-center space-x-3 px-3 py-3 text-white hover:text-green-200 hover:bg-green-600 transition-all duration-200 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Tienda</span>
            </a>
            
            {/* Dashboard Link for Signed In Users - Mobile */}
            <SignedIn>
              <a
                href="/pages/dashboard"
                className="flex items-center space-x-3 px-3 py-3 text-white hover:text-green-200 hover:bg-green-600 transition-all duration-200 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </a>
              
              {/* Admin Link for Admin Users - Mobile */}
              {isAdminUser && (
                <a
                  href="/pages/admin"
                  className="flex items-center space-x-3 px-3 py-3 text-white hover:text-red-200 hover:bg-red-600 transition-all duration-200 rounded-lg border border-red-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield className="w-5 h-5" />
                  <span>Admin</span>
                </a>
              )}
            </SignedIn>
            
            {/* Mobile Cart Icon for Signed In Users */}
            <SignedIn>
              <a
                href="/pages/cart"
                className="flex items-center space-x-3 px-3 py-3 text-white hover:text-green-200 hover:bg-green-600 transition-all duration-200 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Carrito</span>
              </a>
            </SignedIn>
            
            {/* Mobile Authentication Section */}
            <div className="pt-2 border-t border-green-600">
              <SignedOut>
                <div className="space-y-2">
                  <SignInButton>
                    <button className="w-full flex items-center space-x-3 px-3 py-3 text-white hover:text-green-200 hover:bg-green-600 transition-all duration-200 rounded-lg">
                      <User className="w-5 h-5" />
                      <span>Iniciar Sesión</span>
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="w-full bg-green-500 hover:bg-green-400 text-white rounded-lg font-medium px-3 py-3 transition-all duration-200">
                      Registrarse
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-center px-3 py-3">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10"
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
