import Image from "next/image";
import Link from "next/link";
import Navigation from "./components/Navigation";
import SearchBar from "./components/SearchBar";
import PinButton from "./components/PinButton";
import CartButton from "./components/CartButton";
import { getFeaturedPlaces, getFeaturedProducts, formatPrice } from "@/lib/api-utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./components/ui/carousel";
import { 
  MapPin, 
  ShoppingBag, 
  ArrowRight, 
  Star, 
  Users, 
  Globe, 
  Heart,
  ChevronRight,
  Mountain,
  Camera,
  Compass,
  Youtube,
  Instagram,
  Mail,
  Phone,
  MapPin as LocationIcon
} from "lucide-react";

export default async function Home() {
  const featuredPlaces = await getFeaturedPlaces();
  const featuredProducts = await getFeaturedProducts();
  
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-100 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-green-200 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-green-100 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-8 border border-white/30">
            <Compass className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Explora el Mundo</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Encuentra tus
            <span className="block text-green-300">
              Mejores Vacaciones
            </span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Descubre increíbles aventuras y actividades alrededor de United States
          </p>
          
          {/* Search Bar */}
          <div className="mb-12">
            <SearchBar />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/pages/lugares"
              className="group inline-flex items-center space-x-3 bg-green-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <MapPin className="w-5 h-5" />
              <span>Explorar Lugares</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <a
              href="/pages/shop"
              className="group inline-flex items-center space-x-3 border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Visitar Tienda</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>

        </div>
      </div>


      {/* Featured Places Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 rounded-full px-4 py-2 mb-6">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Destinos Destacados</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Lugares
            <span className="block text-green-600">Increíbles</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Algunos de nuestros lugares favoritos para explorar, cuidadosamente seleccionados por su belleza natural y experiencias únicas
          </p>
        </div>

        <div className="mb-8 sm:mb-12">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-7xl"
          >
            <CarouselContent className="-ml-4">
              {featuredPlaces.map((place: any) => (
                <CarouselItem key={place._id || place.name} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Link href={`/pages/blog/${place.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100">
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={place.heroImage}
                          alt={place.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <PinButton 
                            placeId={place._id} 
                            placeName={place.name}
                            className="bg-white/90 backdrop-blur-sm"
                          />
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">Destino</span>
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-green-600 transition-colors duration-300">{place.name}</h3>
                        <p className="text-gray-600 mb-4">{place.location}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-700">4.8</span>
                          </div>
                          <div className="flex items-center space-x-1 text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                            <span className="text-sm font-medium">Explorar</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="text-center">
          <a
            href="/pages/lugares"
            className="group inline-flex items-center space-x-3 px-8 py-4 border border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>Ver Todos los Lugares</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Shop Preview */}
      <div className="bg-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 rounded-full px-4 py-2 mb-6">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm font-medium">Equipamiento Premium</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tienda de
              <span className="block text-purple-600">Aventuras</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Encuentra todo lo que necesitas para tu próxima aventura. Equipamiento de calidad profesional para exploradores como tú
            </p>
          </div>

          <div className="mb-8 sm:mb-12">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-7xl"
            >
              <CarouselContent className="-ml-4">
                {featuredProducts.map((product: any) => (
                  <CarouselItem key={product._id.toString() || product.name} className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <Link href={`/pages/shop/${product.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100">
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src={product.heroImage}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <CartButton 
                              productId={product._id.toString()} 
                              productName={product.name}
                              className="bg-white/90 backdrop-blur-sm"
                            />
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center space-x-2 mb-3">
                            <ShoppingBag className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-purple-600 font-medium">Producto</span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-purple-600 transition-colors duration-300">{product.name}</h3>
                          <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-purple-600">{formatPrice(product)}</p>
                            <div className="flex items-center space-x-1 text-purple-600 group-hover:text-purple-700 transition-colors duration-300">
                              <span className="text-sm font-medium">Ver</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="text-center">
            <a
              href="/pages/shop"
              className="group inline-flex items-center space-x-3 px-8 py-4 border border-transparent text-lg font-semibold rounded-2xl text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>Ver Tienda Completa</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Image
                  src="/logo.jpeg"
                  alt="Los Vamos Logo"
                  width={50}
                  height={50}
                  className="rounded-xl"
                />
                <div>
                  <h3 className="text-2xl font-bold text-green-400">
                    Los Vamos
                  </h3>
                  <p className="text-sm text-gray-400">Explora & Descubre</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Un lugar de exploración y descubrimiento. Conectamos aventureros con experiencias únicas y memorables alrededor del mundo.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">N/A (pronto)</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="w-4 h-4 text-green-400" />
                  <span className="text-sm">N/A (pronto)</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <LocationIcon className="w-4 h-4 text-red-400" />
                  <span className="text-sm">Texas</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Enlaces Rápidos</h4>
              <div className="space-y-4">
                <a 
                  href="/" 
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Inicio</span>
                </a>
                <a 
                  href="/pages/lugares" 
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Lugares</span>
                </a>
                <a 
                  href="/pages/shop" 
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Tienda</span>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Síguenos</h4>
              <div className="space-y-4">
                <a 
                  href="https://www.youtube.com/@Los_Vamos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-red-500 transition-colors group"
                >
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors duration-300">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <span>YouTube</span>
                </a>
                
                <a 
                  href="https://www.instagram.com/losvamosla/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-pink-500 transition-colors group"
                >
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center group-hover:bg-pink-500/30 transition-colors duration-300">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <span>Instagram</span>
                </a>
                
                <a 
                  href="https://www.tiktok.com/@losvamosla?_t=8oeuQWPvqP4&_r=1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-300 hover:text-black transition-colors group"
                >
                  <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center group-hover:bg-black/30 transition-colors duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </div>
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © 2024 Los Vamos. Todos los derechos reservados.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a href="/pages/soon" className="hover:text-white transition-colors">Política de Privacidad</a>
                <a href="/pages/soon" className="hover:text-white transition-colors">Términos de Servicio</a>
                <a href="/pages/soon" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
