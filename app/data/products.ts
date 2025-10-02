export interface ProductTag {
  type: string; // 'color', 'size', 'material', etc.
  value: string; // 'red', 'large', 'cotton', etc.
  label?: string; // Optional display label
}

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  mainImage: string;
  images: string[];
  description: string;
  longDescription: string;
  tags: ProductTag[];
  inStock: boolean;
  category: string;
}

export const products: Product[] = [
  {
    id: "shirt-hiking",
    name: "Camiseta Hiking",
    price: 25,
    currency: "USD",
    mainImage: "/shirt-hiking.png",
    images: ["/shirt-hiking.png"],
    description: "Camiseta cómoda y resistente para tus aventuras de senderismo.",
    longDescription: "Nuestra camiseta de hiking está diseñada para brindarte la máxima comodidad durante tus aventuras al aire libre. Fabricada con materiales transpirables y de secado rápido, esta camiseta te mantendrá fresco y seco durante todo el día. El diseño ergonómico permite libertad de movimiento, mientras que la tecnología anti-olor mantiene la frescura durante actividades prolongadas.",
    tags: [
      { type: "color", value: "green", label: "Verde" },
      { type: "size", value: "S", label: "Small" },
      { type: "size", value: "M", label: "Medium" },
      { type: "size", value: "L", label: "Large" },
      { type: "size", value: "XL", label: "Extra Large" },
      { type: "material", value: "polyester", label: "Poliester" }
    ],
    inStock: true,
    category: "clothing"
  },
  {
    id: "hat-hiking",
    name: "Sombrero Hiking",
    price: 20,
    currency: "USD",
    mainImage: "/hat-hiking.png",
    images: ["/hat-hiking.png"],
    description: "Sombrero protector para el sol durante tus excursiones.",
    longDescription: "Protege tu cabeza del sol con nuestro sombrero de hiking de alta calidad. Con ala ancha y material UPF 50+, este sombrero te protege de los rayos UV dañinos mientras mantiene tu cabeza fresca. El diseño ajustable garantiza un ajuste perfecto durante todas las actividades.",
    tags: [
      { type: "color", value: "brown", label: "Marrón" },
      { type: "size", value: "one-size", label: "Talla Única" },
      { type: "material", value: "cotton", label: "Algodón" }
    ],
    inStock: true,
    category: "accessories"
  },
  {
    id: "shirt-photographer",
    name: "Camiseta Fotógrafo",
    price: 25,
    currency: "USD",
    mainImage: "/shirt-photographer.jpg",
    images: ["/shirt-photographer.jpg"],
    description: "Camiseta diseñada para fotógrafos aventureros.",
    longDescription: "Una camiseta diseñada específicamente para fotógrafos que buscan capturar momentos únicos. Con bolsillos especiales para accesorios y un diseño que no interfiere con el equipo fotográfico. La tela suave y cómoda te permite moverte libremente mientras capturas la imagen perfecta.",
    tags: [
      { type: "color", value: "black", label: "Negro" },
      { type: "size", value: "S", label: "Small" },
      { type: "size", value: "M", label: "Medium" },
      { type: "size", value: "L", label: "Large" },
      { type: "size", value: "XL", label: "Extra Large" },
      { type: "material", value: "cotton", label: "Algodón" }
    ],
    inStock: true,
    category: "clothing"
  },
  {
    id: "shirt-vzla",
    name: "Camiseta Venezuela",
    price: 25,
    currency: "USD",
    mainImage: "/shirt-vzla.jpg",
    images: ["/shirt-vzla.jpg"],
    description: "Camiseta con orgullo venezolano para tus aventuras.",
    longDescription: "Lleva contigo el orgullo venezolano en cada aventura con nuestra camiseta especial. Diseñada con amor para todos los venezolanos que exploran el mundo. La calidad premium y el diseño único la convierten en una pieza esencial para cualquier viajero.",
    tags: [
      { type: "color", value: "blue", label: "Azul" },
      { type: "size", value: "S", label: "Small" },
      { type: "size", value: "M", label: "Medium" },
      { type: "size", value: "L", label: "Large" },
      { type: "size", value: "XL", label: "Extra Large" },
      { type: "material", value: "cotton", label: "Algodón" }
    ],
    inStock: true,
    category: "clothing"
  },
  {
    id: "shirt-wanted",
    name: "Camiseta Wanted",
    price: 25,
    currency: "USD",
    mainImage: "/shirt-wanted.png",
    images: ["/shirt-wanted.png"],
    description: "Camiseta con diseño aventurero y estilo único.",
    longDescription: "Una camiseta que expresa tu espíritu aventurero y tu amor por la exploración. Con un diseño llamativo y mensaje inspirador, esta camiseta es perfecta para aquellos que buscan aventuras y nuevas experiencias. La comodidad y calidad están garantizadas.",
    tags: [
      { type: "color", value: "white", label: "Blanco" },
      { type: "size", value: "S", label: "Small" },
      { type: "size", value: "M", label: "Medium" },
      { type: "size", value: "L", label: "Large" },
      { type: "size", value: "XL", label: "Extra Large" },
      { type: "material", value: "cotton", label: "Algodón" }
    ],
    inStock: true,
    category: "clothing"
  },
  {
    id: "shirt-abajocadenas",
    name: "Camiseta Abajo Cadenas",
    price: 25,
    currency: "USD",
    mainImage: "/shirt-abajocadenas.jpg",
    images: ["/shirt-abajocadenas.jpg"],
    description: "Camiseta con diseño único y mensaje especial.",
    longDescription: "Una camiseta que combina estilo urbano con mensaje social. Diseñada para aquellos que no tienen miedo de expresar sus ideas y valores. La calidad del material y la impresión garantizan durabilidad y comodidad durante todo el día.",
    tags: [
      { type: "color", value: "black", label: "Negro" },
      { type: "size", value: "S", label: "Small" },
      { type: "size", value: "M", label: "Medium" },
      { type: "size", value: "L", label: "Large" },
      { type: "size", value: "XL", label: "Extra Large" },
      { type: "material", value: "cotton", label: "Algodón" }
    ],
    inStock: true,
    category: "clothing"
  }
];

// Helper function to get a product by ID
export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

// Helper function to get all product IDs (useful for static generation)
export function getAllProductIds(): string[] {
  return products.map(product => product.id);
}

// Helper function to get featured products (for homepage)
export function getFeaturedProducts(): Product[] {
  return products.slice(0, 4); // Return first 4 products as featured
}

// Helper function to get products by category
export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category);
}

// Helper function to format price
export function formatPrice(product: Product): string {
  return `${product.currency} ${product.price}`;
}
