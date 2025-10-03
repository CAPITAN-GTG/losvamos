'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X, Plus, Image as ImageIcon, Upload } from 'lucide-react';
import { uploadToCloudinary, dataURLtoFile, validateImageFile } from '@/lib/cloudinary-utils';

interface PlaceFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function PlaceForm({ onClose, onSuccess }: PlaceFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    date: '',
    heroImage: '',
    description: '',
    location: '',
    gallery: [] as string[],
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [heroImagePreview, setHeroImagePreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedHeroFile, setSelectedHeroFile] = useState<File | null>(null);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  
  const heroImageRef = useRef<HTMLInputElement>(null);
  const galleryImageRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (heroImagePreview) URL.revokeObjectURL(heroImagePreview);
      galleryPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleHeroImageSelection = (file: File) => {
    if (!validateImageFile(file, 10)) {
      toast.error('Archivo inválido. Solo imágenes hasta 10MB.');
      return;
    }

    setSelectedHeroFile(file);
    const previewUrl = URL.createObjectURL(file);
    setHeroImagePreview(previewUrl);
    toast.success('Imagen principal seleccionada');
  };

  const handleGalleryImageSelection = (files: File[]) => {
    const validFiles: File[] = [];
    
    files.forEach(file => {
      if (validateImageFile(file, 10)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length === 0) {
      return;
    }

    // Store files locally
    setSelectedGalleryFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      setGalleryPreviews(prev => [...prev, previewUrl]);
    });

    toast.success(`${validFiles.length} imagen${validFiles.length > 1 ? 'es' : ''} agregada${validFiles.length > 1 ? 's' : ''} a la galería`);
  };

  const handleAddGalleryImageByURL = () => {
    if (newGalleryImage.trim() && !formData.gallery.includes(newGalleryImage.trim())) {
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, newGalleryImage.trim()]
      }));
      setGalleryPreviews(prev => [...prev, newGalleryImage.trim()]);
      setNewGalleryImage('');
      toast.success('Imagen agregada a la galería');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    // Remove from selected files
    setSelectedGalleryFiles(prev => prev.filter((_, i) => i !== index));
    
    // Remove from previews and revoke object URL
    setGalleryPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedHeroFile) {
      toast.error('La imagen principal es requerida');
      return;
    }

    setIsLoading(true);
    setUploading(true);

    try {
      // Upload hero image to Cloudinary
      const heroResult = await uploadToCloudinary(selectedHeroFile, 'losvamos/places');
      
      // Upload gallery images to Cloudinary
      const galleryImages: string[] = [];
      for (const file of selectedGalleryFiles) {
        const result = await uploadToCloudinary(file, 'losvamos/places/gallery');
        galleryImages.push(result.secure_url);
      }

      // Add any URL-based gallery images
      const allGalleryImages = [...galleryImages, ...formData.gallery.filter(img => img.startsWith('http'))];

      // Submit form with uploaded image URLs
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          heroImage: heroResult.secure_url,
          gallery: allGalleryImages
        }),
      });

      if (response.ok) {
        toast.success('Lugar creado exitosamente');
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al crear el lugar');
      }
    } catch (error) {
      toast.error('Error al crear el lugar');
      console.error('Create place error:', error);
    } finally {
      setIsLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Lugar</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                placeholder="Ej: Angels Flight"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtítulo *
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                placeholder="Ej: Funicular histórico en Los Ángeles"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                placeholder="Ej: Los Angeles, California"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
              placeholder="Describe el lugar..."
            />
          </div>

          {/* Hero Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen Principal *
            </label>
            <div className="space-y-4">
              <div
                onClick={() => !uploading && heroImageRef.current?.click()}
                className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {heroImagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={heroImagePreview}
                      alt="Preview"
                      className="mx-auto h-32 w-auto object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-600">
                      {uploading ? 'Subiendo...' : 'Click para cambiar imagen'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {uploading ? 'Subiendo imagen...' : 'Click para subir imagen'}
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                  </div>
                )}
              </div>
              <input
                ref={heroImageRef}
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleHeroImageSelection(file);
                  }
                }}
                className="hidden"
              />
            </div>
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Galería de Imágenes
            </label>
            <div className="space-y-4">
              <div
                onClick={() => !uploading && galleryImageRef.current?.click()}
                className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition-colors ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="space-y-2">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {uploading ? 'Subiendo...' : 'Click para agregar imágenes a la galería'}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB cada una</p>
                </div>
              </div>
              <input
                ref={galleryImageRef}
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleGalleryImageSelection(files);
                }}
                className="hidden"
              />
              
              {/* URL Input as fallback */}
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={newGalleryImage}
                  onChange={(e) => setNewGalleryImage(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black text-sm"
                  placeholder="O pegar URL de imagen"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGalleryImageByURL())}
                />
                <button
                  type="button"
                  onClick={handleAddGalleryImageByURL}
                  disabled={uploading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Gallery Preview */}
            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                {galleryPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label className="text-sm font-medium text-gray-700">
              Lugar activo
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading || uploading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || uploading || !selectedHeroFile}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando...' : uploading ? 'Subiendo...' : 'Crear Lugar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
