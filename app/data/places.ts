export interface Place {
  id: string;
  name: string;
  image: string;
  location: string;
  address: string;
  date: string;
  description: string;
  content: string;
  images: string[];
}

export const places: Place[] = [
  {
    id: "angels-flight",
    name: "Angels Flight",
    image: "/angels-flight.png",
    location: "Los Angeles, California",
    address: "350 S Grand Ave, Los Angeles, CA 90071",
    date: "2024-01-15",
    images: ["/angels-flight.png"],
    description: "Un funicular histórico en el centro de Los Ángeles que conecta Bunker Hill con la calle Hill. Este icono de la ciudad ofrece una experiencia única y vistas panorámicas del centro de LA.",
    content: "Angels Flight es uno de los funiculares más famosos del mundo y una atracción histórica en el corazón de Los Ángeles. Construido en 1901, este pequeño tren de cable ha transportado a millones de pasajeros a lo largo de su historia. Aunque ha tenido varios cierres y reaperturas debido a problemas de seguridad, sigue siendo un símbolo querido de la ciudad.\n\nEl viaje en Angels Flight es corto pero memorable, ofreciendo una perspectiva única del centro de Los Ángeles. Desde la estación superior, puedes disfrutar de vistas impresionantes de los rascacielos del distrito financiero y el horizonte de la ciudad."
  },
  {
    id: "gaylord-resort",
    name: "Gaylord Resort",
    image: "/gaylord-resort.jpg",
    location: "Nashville, Tennessee",
    address: "2800 Opryland Dr, Nashville, TN 37214",
    date: "2024-01-20",
    images: ["/gaylord-resort.jpg"],
    description: "Un resort de lujo en Nashville conocido por sus jardines interiores y su proximidad al Grand Ole Opry.",
    content: "El Gaylord Resort en Nashville es un destino de vacaciones de clase mundial que combina lujo, entretenimiento y la rica cultura musical de Tennessee. Con sus impresionantes jardines interiores, múltiples restaurantes y una ubicación privilegiada cerca del Grand Ole Opry, este resort ofrece una experiencia verdaderamente única.\n\nEl resort cuenta con más de 2,800 habitaciones y suites, múltiples piscinas, un spa de servicio completo y más de 50,000 pies cuadrados de espacio para eventos. Sus jardines interiores son especialmente impresionantes, creando un oasis tropical en el corazón de Nashville."
  },
  {
    id: "ostrich-land",
    name: "Ostrich Land",
    image: "/ostrich-land.png",
    location: "Solvang, California",
    address: "610 E Hwy 246, Buellton, CA 93427",
    date: "2024-02-01",
    images: ["/ostrich-land.png"],
    description: "Una granja de avestruces única en Solvang donde puedes alimentar y conocer de cerca a estas fascinantes criaturas.",
    content: "Ostrich Land es una experiencia única en Solvang, California, donde los visitantes pueden interactuar con avestruces y emús en un entorno seguro y controlado. Esta granja familiar ofrece una oportunidad educativa y divertida para aprender sobre estas aves no voladoras.\n\nLos visitantes pueden alimentar a los avestruces con tazones especiales, observar sus comportamientos naturales y aprender sobre su biología y hábitat. Es una excelente actividad para familias y personas interesadas en la vida silvestre."
  },
  {
    id: "pesca-venezuela",
    name: "Pesca Venezuela",
    image: "/pesca-venezuela.jpg",
    location: "Venezuela",
    address: "Múltiples ubicaciones costeras",
    date: "2024-02-10",
    images: ["/pesca-venezuela.jpg"],
    description: "Experiencias de pesca en las costas venezolanas, conocidas por sus aguas ricas en vida marina.",
    content: "Venezuela ofrece algunas de las mejores oportunidades de pesca deportiva en el Caribe. Con más de 2,800 kilómetros de costa, el país cuenta con una gran variedad de especies marinas y ecosistemas únicos.\n\nDesde la pesca de peces vela en Los Roques hasta la pesca de dorado en la costa oriental, Venezuela tiene algo para todos los tipos de pescadores. Las aguas cristalinas y la abundante vida marina hacen de este destino un paraíso para los amantes de la pesca."
  },
  {
    id: "red-rock",
    name: "Red Rock Canyon",
    image: "/red-rock.jpg",
    location: "Las Vegas, Nevada",
    address: "1000 Scenic Loop Dr, Las Vegas, NV 89161",
    date: "2024-02-15",
    images: ["/red-rock.jpg"],
    description: "Un área de conservación nacional con formaciones rocosas rojas espectaculares y senderos para caminar cerca de Las Vegas.",
    content: "Red Rock Canyon es un oasis natural a solo 17 millas al oeste de Las Vegas. Este área de conservación nacional de 195,819 acres ofrece un contraste dramático con el bullicio de la ciudad del pecado.\n\nEl área es famosa por sus formaciones rocosas de arenisca roja, que se formaron hace millones de años. Los visitantes pueden disfrutar de más de 30 millas de senderos para caminar, escalada en roca, ciclismo de montaña y observación de vida silvestre. Es un destino perfecto para una escapada de un día desde Las Vegas."
  },
  {
    id: "solvang",
    name: "Solvang",
    image: "/solvang.jpg",
    location: "California, USA",
    address: "Solvang, CA 93463",
    date: "2024-02-20",
    images: ["/solvang.jpg"],
    description: "Un pueblo danés auténtico en el corazón de California, conocido por sus molinos de viento y pastelerías.",
    content: "Solvang es un pedazo de Dinamarca en California. Fundado en 1911 por inmigrantes daneses, este encantador pueblo mantiene su herencia danesa con arquitectura auténtica, molinos de viento y tiendas que venden productos daneses tradicionales.\n\nLos visitantes pueden explorar museos daneses, disfrutar de pasteles daneses frescos, y experimentar la cultura escandinava sin salir de California. El pueblo es especialmente hermoso durante las celebraciones navideñas, cuando se ilumina con luces festivas y decoraciones tradicionales danesas."
  },
  {
    id: "sulphur-springs",
    name: "Sulphur Springs",
    image: "/sulphur-springs.jpg",
    location: "Arkansas, USA",
    address: "Múltiples ubicaciones en Arkansas",
    date: "2024-03-01",
    images: ["/sulphur-springs.jpg"],
    description: "Manantiales de azufre naturales en Arkansas, conocidos por sus propiedades terapéuticas y aguas minerales.",
    content: "Arkansas es conocida como 'The Natural State' por una buena razón, y sus manantiales de azufre son una de sus características más únicas. Estos manantiales naturales contienen altas concentraciones de azufre y otros minerales que se cree que tienen propiedades terapéuticas.\n\nLos manantiales de azufre han sido utilizados durante siglos por los pueblos nativos americanos y los primeros colonos por sus supuestos beneficios para la salud. Hoy en día, los visitantes pueden experimentar estas aguas naturales en varios balnearios y áreas de conservación en todo el estado."
  },
  {
    id: "union-station",
    name: "Union Station",
    image: "/union-station.jpeg",
    location: "Los Angeles, California",
    address: "800 N Alameda St, Los Angeles, CA 90012",
    date: "2024-03-05",
    images: ["/union-station.jpeg"],
    description: "Una estación de tren histórica en Los Ángeles que combina arquitectura clásica con modernidad.",
    content: "Union Station de Los Ángeles es una de las estaciones de tren más hermosas de Estados Unidos. Inaugurada en 1939, esta estación combina elementos arquitectónicos españoles coloniales, art deco y modernos para crear un espacio verdaderamente único.\n\nLa estación sirve como un importante centro de transporte para Amtrak, Metro Rail y varios servicios de autobús. Más allá de su función de transporte, Union Station es también un destino cultural, con restaurantes, tiendas y espacios para eventos que celebran la rica historia de Los Ángeles."
  }
];

// Helper function to get a place by ID
export function getPlaceById(id: string): Place | undefined {
  return places.find(place => place.id === id);
}

// Helper function to get all place IDs (useful for static generation)
export function getAllPlaceIds(): string[] {
  return places.map(place => place.id);
}

// Helper function to get featured places (for homepage)
export function getFeaturedPlaces(): Place[] {
  return places.slice(0, 3); // Return first 3 places as featured
}
