'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Pin, PinOff } from 'lucide-react';
import { toast } from 'react-toastify';

interface PinButtonProps {
  placeId: string;
  placeName: string;
  className?: string;
}

export default function PinButton({ placeId, placeName, className = '' }: PinButtonProps) {
  const { user, isLoaded } = useUser();
  const [isPinned, setIsPinned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pinCount, setPinCount] = useState(0);

  useEffect(() => {
    if (isLoaded && user && placeId) {
      fetchPinStatus();
    }
  }, [placeId, user, isLoaded]);

  const fetchPinStatus = async () => {
    try {
      const response = await fetch(`/api/places/${placeId}/pins?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setIsPinned(data.isPinned);
        setPinCount(data.pinCount);
      }
    } catch (error) {
      // Error fetching pin status
    }
  };

  const handlePinToggle = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para guardar lugares');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/places/${placeId}/pins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsPinned(data.isPinned);
        setPinCount(data.pinCount);
        
        if (data.isPinned) {
          toast.success(`${placeName} guardado en tu lista`);
        } else {
          toast.success(`${placeName} eliminado de guardados`);
        }
      } else {
        throw new Error('Failed to toggle pin');
      }
    } catch (error) {
      // Error toggling pin
      toast.error('Error al actualizar la lista');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return null;
  }

  return (
    <button
      onClick={handlePinToggle}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
        isPinned 
          ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg' 
          : 'bg-white/90 text-gray-600 hover:bg-green-100 hover:text-green-600 shadow-md'
      } ${className}`}
      title={isPinned ? 'Quitar de guardados' : 'Guardar lugar'}
    >
      {isPinned ? (
        <Pin className="w-4 h-4" />
      ) : (
        <PinOff className="w-4 h-4" />
      )}
    </button>
  );
}
