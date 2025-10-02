'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Menu, X, MapPin, ShoppingBag, Home } from 'lucide-react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-green-600 shadow-lg border-b border-green-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src="/logo.jpeg"
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
          </div>
        </div>
      </div>
    </nav>
  );
}
