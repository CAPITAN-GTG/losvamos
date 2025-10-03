import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../../../components/Navigation";
import PinButton from "../../../components/PinButton";
import { placesApi } from "@/lib/api-utils";
import { 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  Star, 
  Camera,
  Globe,
  Users,
  Clock
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlaceDetailPage({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    console.log('Looking for place with ID:', resolvedParams.id);
    
    const place = await placesApi.getById(resolvedParams.id);
    console.log('Found place:', place ? place.title : 'null');

    if (!place) {
      console.log('Place not found, calling notFound()');
      notFound();
    }

    // Format date for display
    const formattedDate = new Date(place.date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div className="min-h-screen bg-white">
        <Navigation />

        {/* Hero Section */}
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <Image
            src={place.heroImage}
            alt={place.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Floating Pin Button */}
          <div className="absolute top-6 right-6 z-10">
            <PinButton 
              placeId={place._id?.toString() || ''} 
              placeName={place.title}
              className="bg-white/90 backdrop-blur-sm"
            />
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
              <div className="max-w-4xl">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">{place.location}</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                  {place.title}
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 mb-6 max-w-3xl">
                  {place.subtitle}
                </p>
                <div className="flex items-center space-x-6 text-white/80">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm">{formattedDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-sm">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/pages/lugares"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Volver a Lugares</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Sobre este Lugar</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {place.description}
                  </p>
                </div>
              </div>

              {/* Image Gallery */}
              {place.gallery && place.gallery.length > 0 && (
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Camera className="w-6 h-6 mr-3 text-green-600" />
                    Galería de Imágenes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {place.gallery.map((image, index) => (
                      <div key={index} className="aspect-video relative rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={image}
                          alt={`${place.title} - Imagen ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Rápida</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Ubicación</p>
                      <p className="font-medium text-gray-900">{place.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Fecha</p>
                      <p className="font-medium text-gray-900">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-600">Calificación</p>
                      <p className="font-medium text-gray-900">4.8/5.0</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="w-full">
                  <PinButton 
                    placeId={place._id?.toString() || ''} 
                    placeName={place.title}
                    className="w-full justify-center px-6 py-3 rounded-lg font-semibold"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">¿Sabías que?</h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Este lugar ha sido visitado por miles de aventureros y es considerado uno de los destinos más populares de la región.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Places Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Otros Lugares que te Pueden Interesar</h2>
              <p className="text-lg text-gray-600">Descubre más aventuras increíbles</p>
            </div>
            
            <div className="text-center">
              <Link
                href="/pages/lugares"
                className="inline-flex items-center space-x-2 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span>Ver Todos los Lugares</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in PlaceDetailPage:', error);
    throw error;
  }
}
