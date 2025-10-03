'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import { isAdminClient } from '@/lib/admin-utils';
import { getProducts, getPlaces, editProduct, editPlace, deleteProduct, deletePlace } from '@/lib/admin-api-utils';
import ProductForm from '../../components/admin/ProductForm';
import PlaceForm from '../../components/admin/PlaceForm';
import { 
  Shield, 
  Users, 
  MapPin, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  AlertTriangle,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Database,
  FileText,
  Globe
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showPlaceForm, setShowPlaceForm] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingPlace, setEditingPlace] = useState<any>(null);

  const refreshData = async () => {
    setDataLoading(true);
    try {
      const [productsData, placesData] = await Promise.all([
        getProducts(),
        getPlaces()
      ]);
      setProducts(productsData);
      setPlaces(placesData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleEditPlace = (place: any) => {
    setEditingPlace(place);
    setShowPlaceForm(true);
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto "${productName}"? Esta acción no se puede deshacer.`)) {
      try {
        await deleteProduct(productId);
        await refreshData();
        alert('Producto eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleDeletePlace = async (placeId: string, placeTitle: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el lugar "${placeTitle}"? Esta acción no se puede deshacer.`)) {
      try {
        await deletePlace(placeId);
        await refreshData();
        alert('Lugar eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting place:', error);
        alert('Error al eliminar el lugar');
      }
    }
  };

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        const adminStatus = isAdminClient(user.id);
        setIsAdminUser(adminStatus);
        
        if (adminStatus) {
          refreshData();
        } else {
          setDataLoading(false);
        }
      } else {
        setDataLoading(false);
      }
      setIsLoading(false);
    }
  }, [user, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-black mb-4">Acceso Denegado</h1>
            <p className="text-black mb-6">Debes iniciar sesión para acceder al panel de administración.</p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Inicio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-black mb-4">Acceso Restringido</h1>
            <p className="text-black mb-6">No tienes permisos para acceder al panel de administración.</p>
            <Link
              href="/pages/dashboard"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/pages/dashboard"
                className="flex items-center space-x-2 text-black hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-black">
                    Panel de Administración
                  </h1>
                  <p className="text-black mt-1">
                    Gestiona el contenido y configuración del sitio
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-black">
              <span>Administrador:</span>
              <span className="font-medium text-black">{user.firstName} {user.lastName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-black">Usuarios Registrados</p>
                <p className="text-2xl font-bold text-black">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-black">Lugares Totales</p>
                <p className="text-2xl font-bold text-black">{dataLoading ? '...' : places.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-black">Productos</p>
                <p className="text-2xl font-bold text-black">{dataLoading ? '...' : products.length}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Content Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Places Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-black">Lugares ({places.length})</h2>
              <button 
                onClick={() => setShowPlaceForm(true)}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar</span>
              </button>
            </div>
            <div className="p-6">
              {dataLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : places.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {places.slice(0, 5).map((place) => (
                    <div key={place._id.toString()} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={place.heroImage} 
                          alt={place.title}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                          }}
                        />
                        <div>
                          <p className="font-medium text-black">{place.title}</p>
                          <p className="text-sm text-black">{place.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditPlace(place)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Editar lugar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePlace(place._id.toString(), place.title)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                          title="Eliminar lugar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {places.length > 5 && (
                    <p className="text-sm text-black text-center pt-2">
                      Y {places.length - 5} lugares más...
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-black mb-3">No hay lugares creados</p>
                  <button 
                    onClick={() => setShowPlaceForm(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Crear primer lugar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-black">Productos ({products.length})</h2>
              <button 
                onClick={() => setShowProductForm(true)}
                className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar</span>
              </button>
            </div>
            <div className="p-6">
              {dataLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {products.slice(0, 5).map((product) => (
                    <div key={product._id.toString()} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={product.images?.[0] || '/placeholder-image.jpg'} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                          }}
                        />
                        <div>
                          <p className="font-medium text-black">{product.name}</p>
                          <p className="text-sm text-black">${product.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Editar producto"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product._id.toString(), product.name)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {products.length > 5 && (
                    <p className="text-sm text-black text-center pt-2">
                      Y {products.length - 5} productos más...
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-black mb-3">No hay productos creados</p>
                  <button 
                    onClick={() => setShowProductForm(true)}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Crear primer producto
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
      
      {/* Forms */}
      {showPlaceForm && (
        <PlaceForm
          onClose={() => {
            setShowPlaceForm(false);
            setEditingPlace(null);
          }}
          onSuccess={() => {
            refreshData();
            setShowPlaceForm(false);
            setEditingPlace(null);
          }}
          editingPlace={editingPlace}
        />
      )}
      
      {showProductForm && (
        <ProductForm
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            refreshData();
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          editingProduct={editingProduct}
        />
      )}
      
    </div>
  );
}
