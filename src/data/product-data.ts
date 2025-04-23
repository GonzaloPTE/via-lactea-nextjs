import { StaticImageData } from 'next/image';
import IconProps from 'types/icon';

// Importar iconos de la carpeta lineal
import CloudComputingTwo from 'icons/lineal/CloudComputingTwo';
import ChatTwo from 'icons/lineal/ChatTwo';
import LightBulb from 'icons/lineal/LightBulb';
import ShoppingBasket from 'icons/lineal/ShoppingBasket';
import ClockThree from 'icons/lineal/ClockThree';
import List from 'icons/lineal/List';
import Email from 'icons/lineal/Email';
import Target from 'icons/lineal/Target';
import Shield from 'icons/lineal/Shield';
import Medal from 'icons/lineal/Medal';
import VideoEditing from 'icons/lineal/VideoEditing';
import Browser from 'icons/lineal/Browser';

// Definimos las rutas a los iconos SVG disponibles en public/img/icons/solid
const ICON_PATH = '/img/icons/solid/';
const iconUrls = {
  book: `${ICON_PATH}book.svg`,
  video: `${ICON_PATH}video-chat.svg`,
  guide: `${ICON_PATH}list.svg`,
  instagram: `${ICON_PATH}instagram.svg`,
  facebook: `${ICON_PATH}facebook.svg`,
  blog: `${ICON_PATH}note.svg`,
  newsletter: `${ICON_PATH}email.svg`,
  infographic: `${ICON_PATH}design.svg`,
  subscription: `${ICON_PATH}employees.svg`,
  pdf: `${ICON_PATH}document.svg`,
};

// Definición de formatos de producto
export type ProductFormat = 'instagram' | 'facebook' | 'blog' | 'newsletter' | 'guide' | 'module' | 'book' | 'course' | 'infographic' | 'pdf';

// Interfaz para detalles específicos por formato
export interface FormatDetails {
  // Detalles para formatos de texto (libros, guías, etc.)
  pageCount?: number;
  wordCount?: number;
  fileSize?: string; // Por ejemplo, "2.5 MB"
  
  // Detalles para formatos de video (cursos, módulos, etc.)
  duration?: string; // Por ejemplo, "1h 20min"
  lessonCount?: number;
  videoQuality?: string; // Por ejemplo, "HD", "4K"
  
  // Detalles para formatos de imagen (infografías, etc.)
  dimensions?: string; // Por ejemplo, "1200x1800px"
  fileFormat?: string; // Por ejemplo, "JPG", "PNG", "PDF"
  
  // Detalles para publicaciones
  platform?: string;
  publishedUrl?: string;
  engagementStats?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
}

// Definición de tipos para los productos
export interface ProductItem {
  id: number;
  title: string;
  slug: string;
  level: 'publication' | 'module' | 'course';
  levelLabel: string;
  
  // En lugar de un formato único, ahora es un array de formatos
  formats: ProductFormat[];
  formatLabels: string[];
  // El formato principal para mostrar por defecto
  primaryFormat: ProductFormat;
  
  iconUrl: string; // Ruta al SVG del icono
  description: string;
  shortDescription: string;
  
  // Precio para cada formato disponible
  prices: {
    format: ProductFormat;
    price: number;
  }[];
  
  isFree: boolean;
  includeInSubscription: boolean;
  publishDate: string; // Fecha de publicación
  topic: string; // Tema del producto (sueño, lactancia, etc.)
  benefits: {
    id: number;
    title: string;
    icon: React.FC<IconProps>; // Componente Icon
    description: string;
  }[];
  relatedProductIds?: number[]; // IDs de productos relacionados
  highlighted?: boolean;
  downloads?: number; // Número de descargas
  color?: string; // Color representativo del producto
  thumbnailUrl?: string; // URL de la imagen de miniatura
  
  // URLs específicas para cada formato
  formatUrls?: {
    format: ProductFormat;
    url: string;
  }[];
  
  // Nuevo: URLs de previsualización para cada formato
  previewUrls?: {
    format: ProductFormat;
    url: string;
  }[];
  
  // Nuevo: Contenido para formatos que lo permiten
  content?: {
    format: ProductFormat;
    excerpt: string; // Fragmento para mostrar como preview
    fullContent?: string; // Contenido completo (para formatos de texto)
  }[];
  
  // Nuevo: Valoraciones de usuarios
  ratings?: {
    average: number; // Promedio de calificación (1-5)
    count: number; // Número de valoraciones
    reviews?: {
      id: number;
      userName: string;
      rating: number;
      comment: string;
      date: string;
    }[];
  };
  
  // Nuevo: FAQ específicas del producto
  faq?: {
    question: string;
    answer: string;
  }[];
  
  // Nuevo: Información sobre autor/experto
  author?: {
    name: string;
    role: string;
    bio: string;
    imageUrl: string;
  };
  
  parentId?: number; // ID del producto padre (si es parte de un módulo o curso)
  
  // Nuevo: Ruta de aprendizaje sugerida
  learningPath?: number[]; // IDs de productos en orden recomendado
  
  // Nuevo: Indicador de novedad
  isNew?: boolean;
  
  // Nuevo: Etiquetas para búsqueda
  tags?: string[];
  
  // Nuevo: Detalles específicos por formato
  formatDetails?: {
    format: ProductFormat;
    details: FormatDetails;
  }[];
  
  // Nuevo: Nivel de dificultad
  difficulty?: 'principiante' | 'intermedio' | 'avanzado';
  
  // Nuevo: Tiempo estimado para consumir el contenido
  estimatedTimeToComplete?: string;
  
  // Nuevo: Requisitos previos
  prerequisites?: string[];
  
  // Nuevo: Fecha de última actualización
  lastUpdated?: string;
}

// Categorías de nivel de productos
export const productLevels = [
  {
    id: 'publication',
    label: 'Publicación',
    description: 'Publicaciones en Instagram, Facebook, Blog o Newsletter'
  },
  {
    id: 'module',
    label: 'Módulo/Guía',
    description: 'Agrupación de publicaciones con un objetivo común'
  },
  {
    id: 'course',
    label: 'Curso/Libro',
    description: 'Colección de módulos o guías con un objetivo común'
  }
];

// Categorías de formato de productos
export const productFormats = [
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Publicación en Instagram'
  },
  {
    id: 'facebook',
    label: 'Facebook',
    description: 'Publicación en Facebook'
  },
  {
    id: 'blog',
    label: 'Blog',
    description: 'Publicación en Blog'
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    description: 'Publicación en Newsletter'
  },
  {
    id: 'guide',
    label: 'Guía',
    description: 'Guía en formato texto'
  },
  {
    id: 'module',
    label: 'Módulo',
    description: 'Módulo en formato vídeo + texto'
  },
  {
    id: 'book',
    label: 'Libro',
    description: 'Libro en formato texto'
  },
  {
    id: 'course',
    label: 'Curso',
    description: 'Curso en formato vídeo + texto'
  },
  {
    id: 'infographic',
    label: 'Infografía',
    description: 'Material visual informativo'
  },
  {
    id: 'pdf',
    label: 'PDF',
    description: 'Documento en formato PDF'
  }
];

// Función para calcular descargas basado en la fecha de publicación
const calculateDownloads = (publishDate: string): number => {
  const pubDate = new Date(publishDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - pubDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Algoritmo simple: base + (días * factor aleatorio)
  const base = 50;
  const dailyFactor = 2 + Math.random() * 3; // Entre 2 y 5 descargas por día
  
  return Math.floor(base + (diffDays * dailyFactor));
};

// Datos de los productos
export const productList: ProductItem[] = [
  // Producto: Big Bang - Sus primeros momentos (Guía)
  {
    id: 1,
    title: 'Big Bang - Sus primeros momentos',
    slug: 'big-bang-primeros-momentos',
    level: 'module',
    levelLabel: 'Guía',
    formats: ['guide', 'pdf', 'instagram', 'blog'],
    formatLabels: ['Guía', 'PDF', 'Instagram', 'Blog'],
    primaryFormat: 'guide',
    iconUrl: iconUrls.guide,
    description: '¿Te sientes abrumado por el sueño de tu recién nacido? Descubre la tranquilidad que necesitas con nuestra guía especializada. Los primeros 6 meses son cruciales para el desarrollo del sueño de tu bebé. Esta guía esencial te ofrece un mapa detallado mes a mes de sus patrones de sueño y necesidades cambiantes, eliminando la incertidumbre y el estrés de las noches sin descanso.',
    shortDescription: 'Guía esencial para entender y mejorar el sueño de tu bebé en sus primeros 6 meses.',
    prices: [
      { format: 'guide', price: 40 },
      { format: 'pdf', price: 35 },
      { format: 'instagram', price: 0 },
      { format: 'blog', price: 0 }
    ],
    isFree: false,
    includeInSubscription: true,
    publishDate: '2023-10-15',
    topic: 'sueño',
    benefits: [
      {
        id: 1,
        title: 'Información precisa sobre horas de sueño necesarias',
        icon: ClockThree,
        description: 'Aprende exactamente cuánto sueño necesita tu bebé en cada etapa de desarrollo.'
      },
      {
        id: 2,
        title: 'Estrategias para establecer rutinas saludables',
        icon: List,
        description: 'Técnicas prácticas para crear rutinas efectivas desde el primer día.'
      },
      {
        id: 3,
        title: 'Técnicas para fomentar sueño reparador',
        icon: Medal,
        description: 'Métodos probados para ayudar a toda la familia a descansar mejor.'
      },
      {
        id: 4,
        title: 'Soluciones a desafíos comunes',
        icon: LightBulb,
        description: 'Respuestas a los problemas más frecuentes del sueño infantil.'
      }
    ],
    formatUrls: [
      { format: 'instagram', url: 'https://www.instagram.com/p/bigbang123' },
      { format: 'blog', url: '/blog/big-bang-primeros-momentos' }
    ],
    previewUrls: [
      { format: 'guide', url: '/previews/big-bang-guide.jpg' },
      { format: 'pdf', url: '/previews/big-bang-pdf.jpg' }
    ],
    content: [
      { 
        format: 'blog', 
        excerpt: 'Los primeros 6 meses de tu bebé son fundamentales para el desarrollo de patrones de sueño saludables...', 
        fullContent: 'Contenido completo del blog post sobre Big Bang...'
      }
    ],
    highlighted: true,
    downloads: calculateDownloads('2023-10-15'),
    color: 'purple',
    thumbnailUrl: '/img/illustrations/i8.png',
    ratings: {
      average: 4.8,
      count: 65,
      reviews: [
        {
          id: 1,
          userName: 'María G.',
          rating: 5,
          comment: 'Esta guía me salvó el sueño. Literalmente. Los consejos por etapas son muy útiles.',
          date: '2024-01-20'
        },
        {
          id: 2,
          userName: 'Carlos M.',
          rating: 4,
          comment: 'Muy completa. Me habría gustado más ejemplos prácticos, pero la información es muy valiosa.',
          date: '2024-02-15'
        }
      ]
    },
    faq: [
      {
        question: '¿En qué formato recibiré la guía al comprarla?',
        answer: 'Al comprar la guía, recibirás un PDF descargable de alta calidad optimizado para leer en cualquier dispositivo o imprimir. También tendrás acceso a la versión web interactiva.'
      },
      {
        question: '¿Puedo acceder a este contenido con la suscripción mensual?',
        answer: 'Sí, esta guía está incluida en la suscripción mensual premium, junto con todos nuestros recursos y contenidos.'
      }
    ],
    author: {
      name: 'Ana Martín',
      role: 'Asesora de sueño infantil',
      bio: 'Especialista certificada en sueño infantil con más de 10 años de experiencia ayudando a familias.',
      imageUrl: '/img/team/ana.jpg'
    },
    isNew: false,
    tags: ['sueño infantil', 'recién nacido', 'primeros meses', 'rutinas', 'ventanas de sueño'],
    formatDetails: [
      {
        format: 'guide',
        details: {
          pageCount: 48,
          fileSize: '8.5 MB',
          fileFormat: 'HTML'
        }
      },
      {
        format: 'pdf',
        details: {
          pageCount: 52,
          fileSize: '10.2 MB',
          fileFormat: 'PDF'
        }
      }
    ],
    difficulty: 'principiante',
    estimatedTimeToComplete: '3-4 horas',
    lastUpdated: '2024-01-10'
  },
  
  // Sueño respetuoso de tu bebé (Curso)
  {
    id: 2,
    title: 'Sueño respetuoso de tu bebé',
    slug: 'sueno-respetuoso-bebe',
    level: 'course',
    levelLabel: 'Curso',
    formats: ['course', 'book', 'module'],
    formatLabels: ['Curso', 'Libro', 'Módulos independientes'],
    primaryFormat: 'course',
    iconUrl: iconUrls.video,
    description: 'Curso completo para ayudar a las familias a que su bebé duerma mejor mediante técnicas respetuosas y adaptadas a cada etapa de desarrollo. Aprenderás a entender las necesidades de sueño de tu bebé, implementar rutinas efectivas y resolver problemas comunes con un enfoque respetuoso.',
    shortDescription: 'Curso completo sobre sueño infantil con enfoque respetuoso y adaptado a cada etapa.',
    prices: [
      { format: 'course', price: 120 },
      { format: 'book', price: 85 },
      { format: 'module', price: 45 }
    ],
    isFree: false,
    includeInSubscription: true,
    publishDate: '2024-02-10',
    topic: 'sueño',
    benefits: [
      {
        id: 1,
        title: 'Comprensión profunda del sueño infantil',
        icon: Shield,
        description: 'Fundamentos científicos del sueño adaptados a cada etapa de desarrollo.'
      },
      {
        id: 2,
        title: 'Técnicas respetuosas para mejorar el sueño',
        icon: LightBulb,
        description: 'Métodos que respetan el ritmo natural y las necesidades emocionales del bebé.'
      },
      {
        id: 3,
        title: 'Contenido en vídeo + material descargable',
        icon: VideoEditing,
        description: 'Lecciones en vídeo complementadas con guías prácticas y recursos descargables.'
      },
      {
        id: 4,
        title: 'Acceso a los 3 módulos completos',
        icon: List,
        description: 'Incluye los módulos: Sueño del recién nacido, Ventanas de sueño y Plan de sueño.'
      }
    ],
    formatUrls: [
      { format: 'course', url: '/cursos/sueno-respetuoso-bebe' },
      { format: 'book', url: '/libros/sueno-respetuoso-bebe' }
    ],
    previewUrls: [
      { format: 'course', url: '/previews/curso-sueno-preview.mp4' },
      { format: 'book', url: '/previews/libro-sueno-preview.pdf' }
    ],
    content: [
      { 
        format: 'course', 
        excerpt: 'El sueño infantil es una de las principales preocupaciones de las familias con bebés...' 
      }
    ],
    highlighted: true,
    downloads: calculateDownloads('2024-02-10'),
    color: 'blue',
    thumbnailUrl: '/img/illustrations/i15.png',
    relatedProductIds: [3, 4, 5],
    ratings: {
      average: 4.9,
      count: 48,
      reviews: [
        {
          id: 1,
          userName: 'Laura T.',
          rating: 5,
          comment: 'El mejor curso que he encontrado. El enfoque respetuoso marca la diferencia.',
          date: '2024-03-05'
        }
      ]
    },
    faq: [
      {
        question: '¿Por cuánto tiempo tendré acceso al curso?',
        answer: 'Al adquirir el curso, tendrás acceso ilimitado a todo el contenido. Podrás ver los vídeos y descargar los materiales sin restricciones de tiempo.'
      },
      {
        question: '¿Puedo comprar los módulos por separado?',
        answer: 'Sí, cada módulo está disponible para compra individual, aunque adquirir el curso completo ofrece un importante ahorro.'
      }
    ],
    author: {
      name: 'Ana Martín',
      role: 'Asesora de sueño infantil',
      bio: 'Especialista certificada en sueño infantil con más de 10 años de experiencia ayudando a familias.',
      imageUrl: '/img/team/ana.jpg'
    },
    learningPath: [3, 4, 5],
    isNew: true,
    tags: ['sueño infantil', 'curso completo', 'métodos respetuosos', 'rutinas', 'descanso familiar'],
    formatDetails: [
      {
        format: 'course',
        details: {
          duration: '5h 30min',
          lessonCount: 18,
          videoQuality: 'HD'
        }
      },
      {
        format: 'book',
        details: {
          pageCount: 220,
          fileSize: '15.8 MB',
          fileFormat: 'PDF/EPUB'
        }
      },
      {
        format: 'module',
        details: {
          duration: '1h 45min',
          lessonCount: 6,
          videoQuality: 'HD'
        }
      }
    ],
    difficulty: 'intermedio',
    estimatedTimeToComplete: '4-6 semanas',
    prerequisites: ['Conocimientos básicos sobre desarrollo infantil'],
    lastUpdated: '2024-03-15'
  },
  
  // Nota: Continuaría con el resto de productos, actualizando su estructura
  // Aquí muestro solo los dos primeros como ejemplo del nuevo formato
];

// Función para obtener productos por nivel
export const getProductsByLevel = (level: string) => {
  return productList.filter(product => product.level === level);
};

// Función para obtener productos por formato
export const getProductsByFormat = (format: ProductFormat) => {
  return productList.filter(product => product.formats.includes(format));
};

// Función para obtener productos gratuitos
export const getFreeProducts = () => {
  return productList.filter(product => product.isFree || product.prices.some(p => p.price === 0));
};

// Función para obtener productos incluidos en la suscripción
export const getSubscriptionProducts = () => {
  return productList.filter(product => product.includeInSubscription);
};

// Función para obtener productos destacados
export const getHighlightedProducts = () => {
  return productList.filter(product => product.highlighted);
};

// Función para obtener productos nuevos
export const getNewProducts = () => {
  return productList.filter(product => product.isNew);
};

// Función para obtener un producto por su slug
export const getProductBySlug = (slug: string) => {
  return productList.find(product => product.slug === slug);
};

// Función para obtener productos relacionados
export const getRelatedProducts = (productId: number) => {
  const product = productList.find(p => p.id === productId);
  if (!product || !product.relatedProductIds) return [];
  
  return productList.filter(p => product.relatedProductIds?.includes(p.id));
};

// Función para obtener productos por tema
export const getProductsByTopic = (topic: string) => {
  return productList.filter(product => product.topic === topic);
};

// Función para obtener productos por etiqueta
export const getProductsByTag = (tag: string) => {
  return productList.filter(product => product.tags?.includes(tag));
};

// Función para obtener ruta de aprendizaje
export const getLearningPath = (productId: number) => {
  const product = productList.find(p => p.id === productId);
  if (!product || !product.learningPath) return [];
  
  return product.learningPath.map(id => productList.find(p => p.id === id)).filter(Boolean);
};

// Función para obtener el precio de un producto en un formato específico
export const getProductPrice = (productId: number, format: ProductFormat) => {
  const product = productList.find(p => p.id === productId);
  if (!product) return null;
  
  const priceInfo = product.prices.find(p => p.format === format);
  return priceInfo ? priceInfo.price : null;
};

// Función para obtener detalles específicos de un formato
export const getFormatDetails = (productId: number, format: ProductFormat) => {
  const product = productList.find(p => p.id === productId);
  if (!product || !product.formatDetails) return null;
  
  const formatDetail = product.formatDetails.find(fd => fd.format === format);
  return formatDetail ? formatDetail.details : null;
};

// Función para obtener productos por nivel de dificultad
export const getProductsByDifficulty = (difficulty: string) => {
  return productList.filter(product => product.difficulty === difficulty);
};

// Exportamos el listado para uso en componentes
export default productList; 