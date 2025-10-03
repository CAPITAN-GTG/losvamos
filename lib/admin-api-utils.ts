// Utility functions for admin dashboard data fetching

export async function getProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getPlaces() {
  try {
    const response = await fetch('/api/places');
    if (!response.ok) throw new Error('Failed to fetch places');
    const data = await response.json();
    return data.places || [];
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
}

// Edit functions
export async function editProduct(id: string, productData: any) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) throw new Error('Failed to update product');
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function editPlace(id: string, placeData: any) {
  try {
    const response = await fetch(`/api/places/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(placeData),
    });
    
    if (!response.ok) throw new Error('Failed to update place');
    return await response.json();
  } catch (error) {
    console.error('Error updating place:', error);
    throw error;
  }
}

// Delete functions
export async function deleteProduct(id: string) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete product');
    return await response.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export async function deletePlace(id: string) {
  try {
    const response = await fetch(`/api/places/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete place');
    return await response.json();
  } catch (error) {
    console.error('Error deleting place:', error);
    throw error;
  }
}
