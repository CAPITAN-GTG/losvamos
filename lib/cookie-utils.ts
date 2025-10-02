import Cookies from 'js-cookie';

// Pinned Places Functions
export const getPinnedPlaces = (userId?: string): string[] => {
  if (!userId) return [];
  const pinned = Cookies.get(`pinned_places_${userId}`);
  return pinned ? JSON.parse(pinned) : [];
};

export const addPinnedPlace = (placeId: string, userId?: string): string[] => {
  if (!userId) return [];
  const currentPinned = getPinnedPlaces(userId);
  if (!currentPinned.includes(placeId)) {
    const updatedPinned = [...currentPinned, placeId];
    Cookies.set(`pinned_places_${userId}`, JSON.stringify(updatedPinned), { expires: 365 });
    return updatedPinned;
  }
  return currentPinned;
};

export const removePinnedPlace = (placeId: string, userId?: string): string[] => {
  if (!userId) return [];
  const currentPinned = getPinnedPlaces(userId);
  const updatedPinned = currentPinned.filter(id => id !== placeId);
  Cookies.set(`pinned_places_${userId}`, JSON.stringify(updatedPinned), { expires: 365 });
  return updatedPinned;
};

export const isPlacePinned = (placeId: string, userId?: string): boolean => {
  if (!userId) return false;
  const pinnedPlaces = getPinnedPlaces(userId);
  return pinnedPlaces.includes(placeId);
};

// Cart Functions
export const getCart = (userId?: string): Array<{productId: string, quantity: number}> => {
  if (!userId) return [];
  const cart = Cookies.get(`cart_${userId}`);
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (productId: string, userId?: string, quantity: number = 1): Array<{productId: string, quantity: number}> => {
  if (!userId) return [];
  const currentCart = getCart(userId);
  const existingItem = currentCart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    currentCart.push({ productId, quantity });
  }
  
  Cookies.set(`cart_${userId}`, JSON.stringify(currentCart), { expires: 30 });
  return currentCart;
};

export const removeFromCart = (productId: string, userId?: string): Array<{productId: string, quantity: number}> => {
  if (!userId) return [];
  const currentCart = getCart(userId);
  const updatedCart = currentCart.filter(item => item.productId !== productId);
  Cookies.set(`cart_${userId}`, JSON.stringify(updatedCart), { expires: 30 });
  return updatedCart;
};

export const updateCartQuantity = (productId: string, quantity: number, userId?: string): Array<{productId: string, quantity: number}> => {
  if (!userId) return [];
  const currentCart = getCart(userId);
  const updatedCart = currentCart.map(item => 
    item.productId === productId ? { ...item, quantity } : item
  ).filter(item => item.quantity > 0);
  
  Cookies.set(`cart_${userId}`, JSON.stringify(updatedCart), { expires: 30 });
  return updatedCart;
};

export const clearCart = (userId?: string): void => {
  if (!userId) return;
  Cookies.remove(`cart_${userId}`);
};

export const getCartItemCount = (userId?: string): number => {
  if (!userId) return 0;
  const cart = getCart(userId);
  return cart.reduce((total, item) => total + item.quantity, 0);
};
