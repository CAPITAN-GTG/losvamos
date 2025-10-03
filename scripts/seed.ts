import connectDB from '@/lib/mongodb';
import Place from '@/lib/schemas/Place';
import Product from '@/lib/schemas/Product';

// Sample places data
const placesData = [
  {
    name: "Angels Flight",
    description: "Un funicular histórico en el centro de Los Ángeles que conecta Bunker Hill con la calle Hill. Este icono de la ciudad ofrece una experiencia única y vistas panorámicas del centro de LA.",
    content: "Angels Flight es uno de los funiculares más famosos del mundo y una atracción histórica en el corazón de Los Ángeles. Construido en 1901, este pequeño tren de cable ha transportado a millones de pasajeros a lo largo de su historia. Aunque ha tenido varios cierres y reaperturas debido a problemas de seguridad, sigue siendo un símbolo querido de la ciudad.\n\nEl viaje en Angels Flight es corto pero memorable, ofreciendo una perspectiva única del centro de Los Ángeles. Desde la estación superior, puedes disfrutar de vistas impresionantes de los rascacielos del distrito financiero y el horizonte de la ciudad.",
    location: "Los Angeles, California",
    address: "350 S Grand Ave, Los Angeles, CA 90071",
    heroImage: "/angels-flight.png",
    gallery: ["/angels-flight.png"],
    category: "attraction",
    rating: 4.5,
    priceRange: "$",
    date: "2024-01-15",
    amenities: ["Historic", "Scenic Views", "Transportation"],
    isActive: true
  },
  {
    name: "Gaylord Resort",
    description: "Un resort de lujo en Nashville conocido por sus jardines interiores y su proximidad al Grand Ole Opry.",
    content: "El Gaylord Resort en Nashville es un destino de vacaciones de clase mundial que combina lujo, entretenimiento y la rica cultura musical de Tennessee. Con sus impresionantes jardines interiores, múltiples restaurantes y una ubicación privilegiada cerca del Grand Ole Opry, este resort ofrece una experiencia verdaderamente única.\n\nEl resort cuenta con más de 2,800 habitaciones y suites, múltiples piscinas, un spa de servicio completo y más de 50,000 pies cuadrados de espacio para eventos. Sus jardines interiores son especialmente impresionantes, creando un oasis tropical en el corazón de Nashville.",
    location: "Nashville, Tennessee",
    address: "2800 Opryland Dr, Nashville, TN 37214",
    heroImage: "/gaylord-resort.jpg",
    gallery: ["/gaylord-resort.jpg"],
    category: "resort",
    rating: 4.8,
    priceRange: "$$$$",
    date: "2024-01-20",
    amenities: ["Luxury", "Indoor Gardens", "Spa", "Restaurants"],
    isActive: true
  },
  {
    name: "Ostrich Land",
    description: "Una granja de avestruces única en Solvang donde puedes alimentar y conocer de cerca a estas fascinantes criaturas.",
    content: "Ostrich Land es una experiencia única en Solvang, California, donde los visitantes pueden interactuar con avestruces y emús en un entorno seguro y controlado. Esta granja familiar ofrece una oportunidad educativa y divertida para aprender sobre estas aves no voladoras.\n\nLos visitantes pueden alimentar a los avestruces con tazones especiales, observar sus comportamientos naturales y aprender sobre su biología y hábitat. Es una excelente actividad para familias y personas interesadas en la vida silvestre.",
    location: "Solvang, California",
    address: "610 E Hwy 246, Buellton, CA 93427",
    heroImage: "/ostrich-land.png",
    gallery: ["/ostrich-land.png"],
    category: "attraction",
    rating: 4.2,
    priceRange: "$$",
    date: "2024-02-01",
    amenities: ["Family Friendly", "Educational", "Wildlife"],
    isActive: true
  }
];

// Sample products data
const productsData = [
  {
    name: "Camiseta Hiking",
    description: "Camiseta cómoda y resistente para tus aventuras de senderismo.",
    longDescription: "Nuestra camiseta de hiking está diseñada para brindarte la máxima comodidad durante tus aventuras al aire libre. Fabricada con materiales transpirables y de secado rápido, esta camiseta te mantendrá fresco y seco durante todo el día. El diseño ergonómico permite libertad de movimiento, mientras que la tecnología anti-olor mantiene la frescura durante actividades prolongadas.",
    price: 25,
    currency: "USD",
    heroImage: "/shirt-hiking.png",
    gallery: ["/shirt-hiking.png"],
    category: "clothing",
    inStock: true,
    stockQuantity: 50,
    tags: [
      { type: "color", value: "green", label: "Verde" },
      { type: "size", value: "S", label: "Small" },
      { type: "size", value: "M", label: "Medium" },
      { type: "size", value: "L", label: "Large" },
      { type: "size", value: "XL", label: "Extra Large" },
      { type: "material", value: "polyester", label: "Poliester" }
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["green"],
    isActive: true
  },
  {
    name: "Sombrero Hiking",
    description: "Sombrero protector para el sol durante tus excursiones.",
    longDescription: "Protege tu cabeza del sol con nuestro sombrero de hiking de alta calidad. Con ala ancha y material UPF 50+, este sombrero te protege de los rayos UV dañinos mientras mantiene tu cabeza fresca. El diseño ajustable garantiza un ajuste perfecto durante todas las actividades.",
    price: 20,
    currency: "USD",
    heroImage: "/hat-hiking.png",
    gallery: ["/hat-hiking.png"],
    category: "accessories",
    inStock: true,
    stockQuantity: 30,
    tags: [
      { type: "color", value: "brown", label: "Marrón" },
      { type: "size", value: "one-size", label: "Talla Única" },
      { type: "material", value: "cotton", label: "Algodón" }
    ],
    sizes: ["one-size"],
    colors: ["brown"],
    isActive: true
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    
    // Clear existing data
    await Place.deleteMany({});
    await Product.deleteMany({});
    
    // Insert new data
    const insertedPlaces = await Place.insertMany(placesData);
    const insertedProducts = await Product.insertMany(productsData);
    
  } catch (error) {
    // Error seeding database
  } finally {
    process.exit(0);
  }
}

seedDatabase();
