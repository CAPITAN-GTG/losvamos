// Cart utilities for local storage management
export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Get cart from localStorage
export function getCart(userId: string): Cart {
  if (typeof window === 'undefined') {
    return { items: [], total: 0, itemCount: 0 };
  }

  try {
    const cartKey = `cart_${userId}`;
    const cartData = localStorage.getItem(cartKey);
    
    if (!cartData) {
      return { items: [], total: 0, itemCount: 0 };
    }

    const cart = JSON.parse(cartData);
    return {
      items: cart.items || [],
      total: cart.total || 0,
      itemCount: cart.itemCount || 0
    };
  } catch (error) {
    console.error('Error getting cart from localStorage:', error);
    return { items: [], total: 0, itemCount: 0 };
  }
}

// Save cart to localStorage
export function saveCart(userId: string, cart: Cart): void {
  if (typeof window === 'undefined') return;

  try {
    const cartKey = `cart_${userId}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

// Add item to cart
export function addToCart(
  userId: string,
  productId: string,
  productName: string,
  price: number,
  currency: string,
  image: string,
  quantity: number = 1
): Cart {
  const cart = getCart(userId);
  
  // Check if item already exists
  const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
  
  if (existingItemIndex > -1) {
    // Update existing item quantity
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({
      productId,
      productName,
      price,
      currency,
      image,
      quantity,
      addedAt: new Date().toISOString()
    });
  }

  // Recalculate totals
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  saveCart(userId, cart);
  return cart;
}

// Remove item from cart
export function removeFromCart(userId: string, productId: string): Cart {
  const cart = getCart(userId);
  
  cart.items = cart.items.filter(item => item.productId !== productId);
  
  // Recalculate totals
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  saveCart(userId, cart);
  return cart;
}

// Update item quantity in cart
export function updateCartQuantity(userId: string, productId: string, quantity: number): Cart {
  const cart = getCart(userId);
  
  if (quantity <= 0) {
    return removeFromCart(userId, productId);
  }

  const itemIndex = cart.items.findIndex(item => item.productId === productId);
  
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    
    // Recalculate totals
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    saveCart(userId, cart);
  }

  return cart;
}

// Clear entire cart
export function clearCart(userId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const cartKey = `cart_${userId}`;
    localStorage.removeItem(cartKey);
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
}

// Get cart item count
export function getCartItemCount(userId: string): number {
  const cart = getCart(userId);
  return cart.itemCount;
}

// Check if item is in cart
export function isItemInCart(userId: string, productId: string): boolean {
  const cart = getCart(userId);
  return cart.items.some(item => item.productId === productId);
}

// Get item quantity in cart
export function getItemQuantity(userId: string, productId: string): number {
  const cart = getCart(userId);
  const item = cart.items.find(item => item.productId === productId);
  return item ? item.quantity : 0;
}

