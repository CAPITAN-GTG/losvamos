'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { uploadToCloudinary, dataURLtoFile, validateImageFile } from '@/lib/cloudinary-utils';
import { editProduct } from '@/lib/admin-api-utils';

interface ProductFormProps {
  onClose: () => void;
  onSuccess: () => void;
  editingProduct?: any;
}

export default function ProductForm({ onClose, onSuccess, editingProduct }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [] as string[],
    quantity: '',
    tags: [] as Array<{type: string, value: string, label: string}>,
    sizes: [] as string[],
    colors: [] as string[],
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const imageRef = useRef<HTMLInputElement>(null);

  // Initialize form data when editing
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price?.toString() || '',
        category: editingProduct.category || '',
        images: editingProduct.images || [],
        quantity: editingProduct.quantity?.toString() || '',
        tags: editingProduct.tags || [],
        sizes: editingProduct.sizes || [],
        colors: editingProduct.colors || [],
        isActive: editingProduct.isActive !== undefined ? editingProduct.isActive : true
      });
      setImagePreviews(editingProduct.images || []);
    }
  }, [editingProduct]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

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

  const handleImageSelection = (files: File[]) => {
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
    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => [...prev, previewUrl]);
    });

    toast.success(`${validFiles.length} imagen${validFiles.length > 1 ? 'es' : ''} seleccionada${validFiles.length > 1 ? 's' : ''}`);
  };

  const handleRemoveImage = (index: number) => {
    // Remove from selected files
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Remove from previews and revoke object URL
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const handleReorderImages = (dragIndex: number, hoverIndex: number) => {
    const newFiles = [...selectedFiles];
    const draggedFile = newFiles[dragIndex];
    newFiles.splice(dragIndex, 1);
    newFiles.splice(hoverIndex, 0, draggedFile);
    
    setSelectedFiles(newFiles);
    
    // Update previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const handleAddSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()]
      }));
      setNewSize('');
      toast.success('Talla agregada');
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(size => size !== sizeToRemove)
    }));
  };

  const handleAddColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()]
      }));
      setNewColor('');
      toast.success('Color agregado');
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProduct && selectedFiles.length === 0) {
      toast.error('Al menos una imagen es requerida');
      return;
    }

    setIsLoading(true);
    setUploading(true);

    try {
      let finalImages = formData.images;
      
      // Upload new images to Cloudinary if there are any
      if (selectedFiles.length > 0) {
        const uploadedImages: string[] = [];
        
        for (const file of selectedFiles) {
          const result = await uploadToCloudinary(file, 'losvamos/products');
          uploadedImages.push(result.secure_url);
        }
        
        // For editing, combine existing images with new ones
        if (editingProduct) {
          finalImages = [...formData.images, ...uploadedImages];
        } else {
          finalImages = uploadedImages;
        }
      }

      const productData = {
        ...formData,
        images: finalImages,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0,
        inStock: parseInt(formData.quantity) > 0,
        currency: 'USD'
      };

      if (editingProduct) {
        // Update existing product
        await editProduct(editingProduct._id.toString(), productData);
        toast.success('Producto actualizado exitosamente');
      } else {
        // Create new product
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error al crear el producto');
        }
        toast.success('Producto creado exitosamente');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      const message = editingProduct ? 'Error al actualizar el producto' : 'Error al crear el producto';
      toast.error(message);
      // Product operation error
    } finally {
      setIsLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h2>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                placeholder="100"
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

          {/* Product Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imágenes del Producto *
            </label>
            <div className="space-y-4">
              {/* File Upload Button */}
              <div
                onClick={() => !uploading && imageRef.current?.click()}
                className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-500 transition-colors ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="space-y-2">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {uploading ? 'Subiendo imagen...' : 'Click para subir imágenes'}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB cada una</p>
                  <p className="text-xs text-gray-500">La primera imagen será la principal</p>
                </div>
              </div>
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleImageSelection(files);
                }}
                className="hidden"
              />
            </div>

            {/* Image Gallery */}
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">
                    {imagePreviews.length} imagen{imagePreviews.length !== 1 ? 'es' : ''} 
                    {imagePreviews.length > 0 && (
                      <span className="ml-1 text-green-600">
                        (Primera imagen = Principal)
                      </span>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => imageRef.current?.click()}
                    disabled={uploading}
                    className="text-sm text-green-600 hover:text-green-700 disabled:opacity-50"
                  >
                    + Agregar más
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={preview}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Principal
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tallas Disponibles
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                placeholder="Ej: S, M, L, XL"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.sizes.map((size, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(size)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colores Disponibles
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                placeholder="Ej: Rojo, Azul, Verde"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(color)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
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
              disabled={isLoading || uploading || imagePreviews.length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (editingProduct ? 'Actualizando...' : 'Creando...') : uploading ? 'Subiendo...' : (editingProduct ? 'Actualizar Producto' : 'Crear Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
