import Navigation from "../../components/Navigation";
import { ShoppingBag } from "lucide-react";

export default async function Shop() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Coming Soon Section */}
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center px-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 rounded-full mb-8">
            <ShoppingBag className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Próximamente
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Nuestra tienda estará disponible muy pronto. Estamos trabajando para traerte los mejores productos para tus aventuras.
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Volver al Inicio</span>
          </a>
        </div>
      </div>
    </div>
  );
}
