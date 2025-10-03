import Image from "next/image";
import Navigation from "../../components/Navigation";
import { MapPin, Compass, Globe, Navigation as NavigationIcon } from "lucide-react";

export default function MapaPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/mapa.jpeg"
            alt="Map Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-16 h-16 bg-green-100 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-green-100 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-8 border border-white/30">
            <Compass className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Explora el Mapa</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Nuestro Mapa de
            <span className="block text-green-300">
              Aventuras
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Descubre todos los lugares increíbles que hemos explorado y los que están por venir
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 py-16">
        <div className="text-center mb-12 px-4 sm:px-0">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 rounded-full px-4 py-2 mb-6">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">Mapa Interactivo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explora Nuestros
            <span className="block text-green-600">Destinos</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Haz clic en los marcadores para descubrir más información sobre cada lugar que hemos visitado
          </p>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-none md:rounded-2xl shadow-2xl overflow-hidden border-0 md:border border-gray-200">
          <div className="aspect-video w-full md:aspect-video h-[60vh] md:h-auto">
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

        {/* Map Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 px-4 sm:px-0">
          <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lugares Destacados</h3>
            <p className="text-gray-600">
              Descubre los destinos más increíbles que hemos explorado en nuestras aventuras
            </p>
          </div>

          <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <NavigationIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Rutas de Viaje</h3>
            <p className="text-gray-600">
              Sigue nuestras rutas recomendadas para una experiencia de viaje completa
            </p>
          </div>

          <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-100">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Compass className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Próximos Destinos</h3>
            <p className="text-gray-600">
              Mantente al día con los lugares que estamos planeando visitar próximamente
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 px-4 sm:px-0">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              ¿Listo para tu próxima aventura?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Explora nuestros lugares favoritos y planifica tu propio viaje
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/pages/lugares"
                className="inline-flex items-center space-x-2 bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                <MapPin className="w-5 h-5" />
                <span>Ver Lugares</span>
              </a>
              <a
                href="/pages/shop"
                className="inline-flex items-center space-x-2 border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-colors duration-300"
              >
                <span>Equipamiento</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
