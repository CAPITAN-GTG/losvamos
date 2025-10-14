import Image from "next/image";
import Link from "next/link";
import Navigation from "./components/Navigation";
import SearchBar from "./components/SearchBar";
import { getFeaturedPlaces } from "@/lib/api-utils";
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
  Youtube,
  Instagram,
  Mail,
  Phone,
  MapPin as LocationIcon
} from "lucide-react";

export default async function Home() {
  const featuredPlaces = await getFeaturedPlaces();
  
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Encuentra tus
            <span className="block text-green-300">
              Mejores Vacaciones
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Descubre increíbles aventuras y actividades alrededor de Estados Unidos
          </p>
          
          {/* Search Bar */}
          <div className="mb-12">
            <SearchBar />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/pages/lugares"
              className="group inline-flex items-center space-x-3 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <MapPin className="w-5 h-5" />
              <span>Explorar Lugares</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <a
              href="/pages/shop"
              className="group inline-flex items-center space-x-3 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl"
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Lugares
            <span className="block text-green-600">Increíbles</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Algunos de nuestros lugares favoritos para explorar, cuidadosamente seleccionados por su belleza natural y experiencias únicas
          </p>
        </div>

        <div className="mb-8 sm:mb-12 h-80">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-7xl h-full"
          >
            <CarouselContent className="-ml-4">
              {featuredPlaces.map((place: any) => (
                <CarouselItem key={place._id.toString() || place.title} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Link href={`/pages/lugares/${place._id}`}>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group relative aspect-video hover:outline hover:outline-4 hover:outline-green-500 hover:outline-offset-2">
                      <Image
                        src={place.heroImage}
                        alt={place.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Dark overlay for text readability */}
                      <div className="absolute inset-0 bg-black/40"></div>
                      
                      {/* Text overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-green-200 transition-colors duration-300">{place.title}</h3>
                        <p className="text-sm text-gray-200 line-clamp-1 group-hover:text-green-100 transition-colors duration-300">{place.location}</p>
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
            className="group inline-flex items-center space-x-3 px-8 py-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Ver Todos los Lugares</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>

      {/* Divider */}
      {/* <div className="border-t border-gray-200"></div> */}

      {/* Shop Preview */}
      {/* <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
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
                loop: true,
              }}
              className="w-full max-w-7xl"
            >
              <CarouselContent className="-ml-4">
                {featuredProducts.map((product: any) => (
                  <CarouselItem key={product._id.toString() || product.name} className="pl-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                    <Link href={`/pages/shop/${product._id.toString()}`}>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group relative aspect-square hover:outline hover:outline-4 hover:outline-purple-500 hover:outline-offset-2">
                        <Image
                          src={product.images?.[0] || '/placeholder-image.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Dark overlay for text readability */}
                        {/* <div className="absolute inset-0 bg-black/40"></div>
                        
                        {/* Text overlay */}
                        {/* <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <h3 className="font-bold text-sm mb-1 line-clamp-2 group-hover:text-purple-200 transition-colors duration-300">{product.name}</h3>
                          <p className="text-xs text-gray-200 line-clamp-1 group-hover:text-purple-100 transition-colors duration-300">{formatPrice(product)}</p>
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
              className="group inline-flex items-center space-x-3 px-8 py-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>Ver Tienda Completa</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </div> */}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Image
                  src="/logo.png"
                  alt="Los Vamos Logo"
                  width={60}
                  height={60}
                  className="rounded-xl"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Los Vamos
                  </h3>
                  <p className="text-sm text-gray-600">Explora & Descubre</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
                Un lugar de exploración y descubrimiento. Conectamos aventureros con experiencias únicas y memorables alrededor del mundo.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">losvamos@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span className="text-sm">(747) 227-9867</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <LocationIcon className="w-4 h-4 text-red-600" />
                  <span className="text-sm">Texas, USA</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gray-900">Enlaces Rápidos</h4>
              <div className="space-y-4">
                <a 
                  href="/" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Inicio</span>
                </a>
                <a 
                  href="/pages/lugares" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Lugares</span>
                </a>
                <a 
                  href="/pages/shop" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Tienda</span>
                </a>
                <a 
                  href="/pages/mapa" 
                  className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors group"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Mapa</span>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gray-900">Síguenos</h4>
              <div className="space-y-4">
                <a 
                  href="https://www.youtube.com/@Los_Vamos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-600 hover:text-red-600 transition-colors group"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors duration-300">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <span>YouTube</span>
                </a>
                
                <a 
                  href="https://www.instagram.com/losvamosla/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-600 hover:text-pink-600 transition-colors group"
                >
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors duration-300">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <span>Instagram</span>
                </a>
                
                <a 
                  href="https://www.tiktok.com/@losvamosla?_t=8oeuQWPvqP4&_r=1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300">
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
          <div className="border-t border-gray-200 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-500 text-sm">
                © 2024 Los Vamos. Todos los derechos reservados.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <a href="/pages/soon" className="hover:text-gray-900 transition-colors">Política de Privacidad</a>
                <a href="/pages/soon" className="hover:text-gray-900 transition-colors">Términos de Servicio</a>
                <a href="/pages/soon" className="hover:text-gray-900 transition-colors">Cookies</a>
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                powered by{" "}
                <a 
                  href="https://grimo-dev.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:underline transition-all duration-300"
                >
                  GrimoDev
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
