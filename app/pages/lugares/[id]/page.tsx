'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from "next/image";
import Link from "next/link";
import Navigation from "../../../components/Navigation";
import { toast } from 'react-toastify';
import { 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  Camera,
  Globe,
  Users,
  Clock,
  Pin,
  PinOff,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Play,
  MapPin as MapIcon
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PlaceDetailPage({ params }: PageProps) {
  const [place, setPlace] = useState<any>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [galleryPage, setGalleryPage] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [youtubeLinks, setYoutubeLinks] = useState<string[]>([]);
  const { user, isLoaded } = useUser();

  const imagesPerPage = 6;

  // Utility function to detect YouTube links (improved to handle complex URLs with parameters)
  const detectYouTubeLinks = (text: string): string[] => {
    // Enhanced regex to handle complex YouTube URLs with parameters
    // This handles URLs like: https://www.youtube.com/watch?embeds_referring_euri=http%3A%2F%2F192.168.86.232%2F&v=7iLbVwgdiBw
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?(?:[^&\s]*&)*v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(?:\?[^&\s]*)?/g;
    const matches = text.match(youtubeRegex);
    return matches ? matches : [];
  };

  // Utility function to extract YouTube video ID (improved to handle complex URLs)
  const getYouTubeVideoId = (url: string): string => {
    // Enhanced regex to handle complex YouTube URLs with parameters
    // This handles URLs like: https://www.youtube.com/watch?embeds_referring_euri=http%3A%2F%2F192.168.86.232%2F&v=7iLbVwgdiBw
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?(?:[^&\s]*&)*v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  // Utility function to open address in maps
  const openInMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/places/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setPlace(data.place);
          
          // Detect YouTube links in description and content
          const description = data.place.description || '';
          const content = data.place.content || '';
          const allText = `${description} ${content}`;
          const detectedLinks = detectYouTubeLinks(allText);
          setYoutubeLinks(detectedLinks);
        }
      } catch (error) {
        console.error('Error fetching place:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlace();
  }, [params]);

  useEffect(() => {
    if (isLoaded && user && place) {
      fetchPinStatus();
    }
  }, [user, isLoaded, place]);

  const fetchPinStatus = async () => {
    try {
      const response = await fetch(`/api/places/${place._id}/pins?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setIsPinned(data.isPinned);
      }
    } catch (error) {
      console.error('Error fetching pin status:', error);
    }
  };

  const handlePinToggle = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para guardar lugares');
      return;
    }

    try {
      const response = await fetch(`/api/places/${place._id}/pins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsPinned(data.isPinned);
        
        if (data.isPinned) {
          toast.success(`${place.title} guardado en tu lista`);
        } else {
          toast.success(`${place.title} eliminado de guardados`);
        }
      } else {
        throw new Error('Failed to toggle pin');
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Error al actualizar la lista');
    }
  };

  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setSelectedImageIndex(-1);
  };

  const nextImage = () => {
    if (place.gallery && selectedImageIndex < place.gallery.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Lugar no encontrado</h1>
            <p className="text-gray-600 mb-6">El lugar que buscas no existe o ha sido eliminado.</p>
            <Link
              href="/pages/lugares"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Lugares</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format date for display
  const formattedDate = new Date(place.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const totalGalleryPages = place.gallery ? Math.ceil(place.gallery.length / imagesPerPage) : 0;
  const currentGalleryImages = place.gallery ? place.gallery.slice(
    galleryPage * imagesPerPage,
    (galleryPage + 1) * imagesPerPage
  ) : [];

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

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <div className="max-w-4xl">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm font-medium">{place.location}</span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
                  {place.title}
                </h1>
                {user && (
                  <button
                    onClick={handlePinToggle}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isPinned 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    title={isPinned ? 'Quitar de guardados' : 'Guardar lugar'}
                  >
                    {isPinned ? (
                      <Pin className="w-6 h-6" />
                    ) : (
                      <PinOff className="w-6 h-6" />
                    )}
                  </button>
                )}
              </div>
              <p className="text-xl sm:text-2xl text-white/90 mb-6 max-w-3xl">
                {place.subtitle}
              </p>
              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">{formattedDate}</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Sobre este Lugar</h2>
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed text-lg">
                  {place.description.split(' ').map((word: string, index: number) => {
                    // Check if word looks like an address (contains common address indicators)
                    const isAddress = /^\d+/.test(word) && (
                      word.includes('St') || 
                      word.includes('Ave') || 
                      word.includes('Rd') || 
                      word.includes('Blvd') || 
                      word.includes('Dr') ||
                      word.includes('Calle') ||
                      word.includes('Avenida') ||
                      word.includes('Carrera')
                    );
                    
                    if (isAddress) {
                      return (
                        <button
                          key={index}
                          onClick={() => openInMaps(word)}
                          className="text-green-600 hover:text-green-700 underline decoration-dotted underline-offset-2 transition-colors"
                          title="Abrir en Google Maps"
                        >
                          {word}
                        </button>
                      );
                    }
                    
                    return <span key={index}>{word} </span>;
                  })}
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            {place.gallery && place.gallery.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                    <Camera className="w-6 h-6 mr-3 text-green-600" />
                    Galería de Imágenes
                  </h3>
                  <span className="text-sm text-gray-500">
                    {place.gallery.length} imagen{place.gallery.length !== 1 ? 'es' : ''}
                  </span>
                </div>
                
                {/* Gallery Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {currentGalleryImages.map((image, index) => {
                    const globalIndex = galleryPage * imagesPerPage + index;
                    return (
                      <div 
                        key={globalIndex} 
                        className="aspect-square relative rounded-lg overflow-hidden shadow-lg cursor-pointer group"
                        onClick={() => openGallery(globalIndex)}
                      >
                        <Image
                          src={image}
                          alt={`${place.title} - Imagen ${globalIndex + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                      </div>
                    );
                  })}
                </div>

                {/* Gallery Pagination */}
                {totalGalleryPages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setGalleryPage(Math.max(0, galleryPage - 1))}
                      disabled={galleryPage === 0}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Anterior
                    </button>
                    <span className="text-sm text-gray-600">
                      Página {galleryPage + 1} de {totalGalleryPages}
                    </span>
                    <button
                      onClick={() => setGalleryPage(Math.min(totalGalleryPages - 1, galleryPage + 1))}
                      disabled={galleryPage === totalGalleryPages - 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
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
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Ubicación</p>
                    <button
                      onClick={() => openInMaps(place.location)}
                      className="flex items-center space-x-2 text-left hover:text-green-600 transition-colors group"
                    >
                      <span className="font-medium text-gray-900 group-hover:text-green-600">
                        {place.location}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="font-medium text-gray-900">{formattedDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube Videos */}
            {youtubeLinks.length > 0 && (
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Play className="w-5 h-5 mr-2 text-red-600" />
                  Videos Relacionados
                </h3>
                <div className="space-y-4">
                  {youtubeLinks.map((link, index) => {
                    const videoId = getYouTubeVideoId(link);
                    return (
                      <div key={index} className="relative">
                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={`YouTube video ${index + 1}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                          title="Abrir en YouTube"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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

      {/* Gallery Modal */}
      {isGalleryOpen && selectedImageIndex >= 0 && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeGallery}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            {selectedImageIndex > 0 && (
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {selectedImageIndex < place.gallery.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={place.gallery[selectedImageIndex]}
                alt={`${place.title} - Imagen ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 text-white px-4 py-2 rounded-full text-sm">
              {selectedImageIndex + 1} de {place.gallery.length}
            </div>
          </div>
        </div>
      )}

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
}
