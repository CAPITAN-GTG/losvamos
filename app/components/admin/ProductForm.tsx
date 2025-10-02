'use client';

import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { X, Upload, Plus, Image as ImageIcon } from 'lucide-react';

interface ProductFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductForm({ onClose, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    heroImage: '',
    gallery: [] as string[],
    tags: [] as Array<{type: string, value: string, label: string}>,
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [heroImagePreview, setHeroImagePreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const heroImageRef = useRef<HTMLInputElement>(null);
  const galleryImageRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.some(tag => tag.value === newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, { type: 'general', value: newTag.trim(), label: newTag.trim() }]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag.value !== tagToRemove)
    }));
  };

  const handleAddGalleryImage = () => {
    if (newGalleryImage.trim() && !formData.gallery.includes(newGalleryImage.trim())) {
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, newGalleryImage.trim()]
      }));
      setNewGalleryImage('');
    }
  };

  const handleRemoveGalleryImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(image => image !== imageToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          inStock: true,
          stockQuantity: 0,
          currency: 'USD'
        }),
      });

      if (response.ok) {
        toast.success('Producto creado exitosamente');
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Error al crear el producto');
      }
    } catch (error) {
      toast.error('Error al crear el producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Producto</h2>
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
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                placeholder="Ej: Camiseta Los Vamos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                placeholder="29.99"
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
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
              placeholder="Describe el producto..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
              >
                <option value="">Seleccionar categoría</option>
                <option value="ropa">Ropa</option>
                <option value="accesorios">Accesorios</option>
                <option value="equipamiento">Equipamiento</option>
                <option value="souvenirs">Souvenirs</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label className="text-sm font-medium text-black">
                Producto activo
              </label>
            </div>
          </div>

          {/* Hero Image */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Imagen Principal *
            </label>
            <div className="space-y-4">
              {/* File Upload Button */}
              <div
                onClick={() => heroImageRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors"
              >
                {heroImagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={heroImagePreview}
                      alt="Preview"
                      className="mx-auto h-32 w-auto object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-600">Click para cambiar imagen</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-600">Click para subir imagen</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                  </div>
                )}
              </div>
              <input
                ref={heroImageRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 10 * 1024 * 1024) { // 10MB limit
                      toast.error('El archivo es demasiado grande. Máximo 10MB.');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const result = e.target?.result as string;
                      setHeroImagePreview(result);
                      setFormData(prev => ({ ...prev, heroImage: result }));
                      toast.success('Imagen cargada exitosamente');
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              
              {/* URL Input as fallback */}
              <div className="mt-2">
                <label className="block text-xs text-gray-500 mb-1">O pegar URL de imagen:</label>
                <input
                  type="url"
                  name="heroImage"
                  value={formData.heroImage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black text-sm"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Etiquetas
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                placeholder="Agregar etiqueta"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {tag.label}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.value)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Galería de Imágenes
            </label>
            <div className="space-y-4">
              {/* File Upload Button */}
              <div
                onClick={() => galleryImageRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition-colors"
              >
                <div className="space-y-2">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-600">Click para agregar imagen a la galería</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                </div>
              </div>
              <input
                ref={galleryImageRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 10 * 1024 * 1024) { // 10MB limit
                      toast.error('El archivo es demasiado grande. Máximo 10MB.');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const result = e.target?.result as string;
                      setFormData(prev => ({
                        ...prev,
                        gallery: [...prev.gallery, result]
                      }));
                      setGalleryPreviews(prev => [...prev, result]);
                      toast.success('Imagen agregada a la galería');
                    };
                    reader.readAsDataURL(file);
                  }
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
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGalleryImage())}
                />
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {formData.gallery.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleRemoveGalleryImage(image);
                      setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-black bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
