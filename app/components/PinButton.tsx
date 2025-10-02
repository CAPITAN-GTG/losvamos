'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Pin, PinOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  addPinnedPlace, 
  removePinnedPlace, 
  isPlacePinned 
} from '@/lib/cookie-utils';

interface PinButtonProps {
  placeId: string;
  placeName: string;
  className?: string;
}

export default function PinButton({ placeId, placeName, className = '' }: PinButtonProps) {
  const { user, isLoaded } = useUser();
  const [isPinned, setIsPinned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setIsPinned(isPlacePinned(placeId, user.id));
    }
  }, [placeId, user, isLoaded]);

  const handlePinToggle = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para guardar lugares');
      return;
    }

    setIsLoading(true);
    
    try {
      if (isPinned) {
        removePinnedPlace(placeId, user.id);
        setIsPinned(false);
        toast.success(`${placeName} eliminado de guardados`);
      } else {
        addPinnedPlace(placeId, user.id);
        setIsPinned(true);
        toast.success(`${placeName} guardado en tu lista`);
      }
    } catch (error) {
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
          ? 'bg-green-500 text-white hover:bg-green-600' 
          : 'bg-white/90 text-gray-600 hover:bg-green-100 hover:text-green-600'
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
