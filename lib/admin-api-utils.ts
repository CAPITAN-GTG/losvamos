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

export async function getBlogPosts() {
  try {
    const response = await fetch('/api/blog');
    if (!response.ok) throw new Error('Failed to fetch blog posts');
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
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
