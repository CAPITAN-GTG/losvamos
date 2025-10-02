'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  addToCart, 
  removeFromCart, 
  updateCartQuantity,
  getCart 
} from '@/lib/cookie-utils';

interface CartButtonProps {
  productId: string;
  productName: string;
  className?: string;
  showQuantity?: boolean;
}

export default function CartButton({ 
  productId, 
  productName, 
  className = '',
  showQuantity = false 
}: CartButtonProps) {
  const { user, isLoaded } = useUser();
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      const cart = getCart(user.id);
      const item = cart.find(item => item.productId === productId);
      setCartQuantity(item ? item.quantity : 0);
    }
  }, [productId, user, isLoaded]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para agregar al carrito');
      return;
    }

    setIsLoading(true);
    
    try {
      addToCart(productId, user.id, 1);
      setCartQuantity(prev => prev + 1);
      toast.success(`${productName} agregado al carrito`);
      // Dispatch event to update cart count in navigation
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      toast.error('Error al agregar al carrito');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      removeFromCart(productId, user.id);
      setCartQuantity(0);
      toast.success(`${productName} eliminado del carrito`);
      // Dispatch event to update cart count in navigation
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      toast.error('Error al eliminar del carrito');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      if (newQuantity <= 0) {
        removeFromCart(productId, user.id);
        setCartQuantity(0);
      } else {
        updateCartQuantity(productId, newQuantity, user.id);
        setCartQuantity(newQuantity);
      }
      // Dispatch event to update cart count in navigation
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      toast.error('Error al actualizar cantidad');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return null;
  }

  if (showQuantity && cartQuantity > 0) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <button
          onClick={() => handleUpdateQuantity(cartQuantity - 1)}
          disabled={isLoading}
          className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-sm font-medium min-w-[20px] text-center">
          {cartQuantity}
        </span>
        <button
          onClick={() => handleUpdateQuantity(cartQuantity + 1)}
          disabled={isLoading}
          className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={cartQuantity > 0 ? handleRemoveFromCart : handleAddToCart}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        cartQuantity > 0
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-green-500 text-white hover:bg-green-600'
      } ${className}`}
    >
      <ShoppingCart className="w-4 h-4" />
      <span>
        {cartQuantity > 0 ? 'En Carrito' : 'Agregar al Carrito'}
      </span>
    </button>
  );
}
