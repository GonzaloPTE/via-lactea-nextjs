import IconProps from 'types/icon';

// Importar iconos de la carpeta lineal
import CloudComputingTwo from 'icons/lineal/CloudComputingTwo';
import ChatTwo from 'icons/lineal/ChatTwo';
import LightBulb from 'icons/lineal/LightBulb';
import ClockThree from 'icons/lineal/ClockThree';
import List from 'icons/lineal/List';
import Target from 'icons/lineal/Target';
import Shield from 'icons/lineal/Shield';
import Medal from 'icons/lineal/Medal';
import VideoEditing from 'icons/lineal/VideoEditing';

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
  module: `${ICON_PATH}video-chat.svg`,
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
  downloads?: number; // Número total de descargas del producto
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
  
  // Propiedades para la barra de urgencia
  downloadLimit?: number; // Límite máximo de descargas para la promoción
  limitDate?: string; // Fecha límite de la promoción
  currentDownloads?: number; // Descargas actuales durante la promoción (distintas del total)
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

// Función para generar un número pseudoaleatorio determinista basado en una semilla
const seededRandom = (seed: string): () => number => {
  // Función hash simple para convertir string en número
  const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a entero de 32 bits
    }
    return hash;
  };
  
  const seedValue = hashString(seed);
  
  // Implementación de un generador congruencial lineal
  let state = seedValue || 1;
  
  return () => {
    // Parámetros del generador congruencial
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    
    // Actualizar estado
    state = (a * state + c) % m;
    
    // Normalizar a [0, 1)
    return state / m;
  };
};

// Función para calcular descargas basado en la fecha de publicación
const calculateDownloads = (publishDate: string): number => {
  const pubDate = new Date(publishDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - pubDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Algoritmo simple: base + (días * factor aleatorio)
  // Creamos una semilla determinista para que el resultado sea consistente
  const seed = `downloads-${publishDate}-${today.toISOString().split('T')[0]}`;
  const random = seededRandom(seed);
  
  const base = 50;
  const dailyFactor = 2 + random() * 3; // Entre 2 y 5 descargas por día
  
  return Math.floor(base + (diffDays * dailyFactor));
};

// Función para calcular las descargas actuales durante una promoción
const calculateCurrentDownloads = (downloadLimit: number, limitDate: string): number => {
  // Convertir fechas a objetos Date
  const endDate = new Date(limitDate);
  const today = new Date();
  
  // Calcular porcentaje de tiempo transcurrido de la promoción
  // Asumimos que una promoción típica dura 30 días
  const promoStartDate = new Date(endDate);
  promoStartDate.setDate(promoStartDate.getDate() - 30);
  
  // Si la fecha de inicio de la promoción es futura, retornamos 0
  if (promoStartDate > today) {
    return 0;
  }
  
  // Calcular el tiempo transcurrido como porcentaje de la duración total
  const totalDuration = endDate.getTime() - promoStartDate.getTime();
  let elapsedTime = today.getTime() - promoStartDate.getTime();
  
  // Si la promoción ya terminó, consideramos el 100% del tiempo
  if (elapsedTime > totalDuration) {
    elapsedTime = totalDuration;
  }
  
  const timePercentage = elapsedTime / totalDuration;
  
  // Crear una semilla basada en los inputs para asegurar resultados deterministas
  // Usamos una fecha fija (hoy al inicio del día) para que no cambie cada segundo
  const fixedToday = new Date();
  fixedToday.setHours(0, 0, 0, 0); // Inicio del día actual
  const seed = `${downloadLimit}-${limitDate}-${fixedToday.toISOString().split('T')[0]}`;
  const random = seededRandom(seed);
  
  // Generar un número de descargas basado en tiempo transcurrido
  // Añadimos algo de aleatoriedad para simular picos de descargas
  // El objetivo es generar un número entre 60% y 85% del límite cuando estamos a mitad de tiempo
  const baseProgress = timePercentage * 1.2; // 120% para acelerar al inicio
  const randomFactor = 0.1 * (random() - 0.5); // ±5% de variación
  const progressPercentage = Math.min(Math.max(baseProgress + randomFactor, 0), 0.95); // Limitar entre 0 y 95%
  
  // Calcular el número base de descargas
  const baseDownloads = Math.floor(downloadLimit * progressPercentage);
  
  // Añadir una variación natural para evitar números muy redondos
  // Esto hace que los números no terminen en 0 o 5 y tengan una apariencia más orgánica
  let naturalVariation = 0;
  
  // Si el número es múltiplo de 5, añadimos entre -4 y +4 descargas
  if (baseDownloads % 5 === 0) {
    naturalVariation = Math.floor(random() * 9) - 4; // Valor entre -4 y +4
  } 
  // Si el número termina en 3 o 7, a veces lo dejamos así para mantener algunos patrones naturales
  else if (baseDownloads % 10 === 3 || baseDownloads % 10 === 7) {
    if (random() < 0.7) { // 70% de probabilidad de mantenerlo
      naturalVariation = 0;
    } else {
      naturalVariation = Math.floor(random() * 3) - 1; // Pequeña variación: -1, 0, o +1
    }
  } 
  // Para otros números, añadimos una pequeña variación
  else {
    naturalVariation = Math.floor(random() * 5) - 2; // Valor entre -2 y +2
  }
  
  // Asegurar que el resultado final sea positivo y no exceda el límite
  return Math.min(Math.max(baseDownloads + naturalVariation, 1), downloadLimit - 5);
};

// Datos de los productos
const mainProductList: ProductItem[] = [
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
    thumbnailUrl: '/img/via-lactea/photos/recurso-mockup.jpg',
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
    thumbnailUrl: '/img/via-lactea/photos/recurso-mockup.jpg',
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

// Agregar productos adicionales convertidos desde resourcesData
const additionalProducts: ProductItem[] = [
  {
    id: 3,
    title: "Guía de Sueño - 0 a 6 meses",
    slug: "guia-sueno-0-6-meses",
    level: "module",
    levelLabel: "Guía",
    formats: ["guide", "pdf"],
    formatLabels: ["Guía", "PDF"],
    primaryFormat: "guide",
    iconUrl: iconUrls.guide,
    description: "Soluciones prácticas para mejorar el sueño de bebés de 0 a 6 meses. Aprende técnicas efectivas para ayudar a tu bebé a dormir mejor y establecer rutinas saludables.",
    shortDescription: "Soluciones prácticas para mejorar el sueño de bebés de 0 a 6 meses.",
    prices: [
      { format: "guide", price: 19.99 },
      { format: "pdf", price: 19.99 }
    ],
    isFree: false,
    includeInSubscription: true,
    publishDate: "2024-10-15",
    topic: "sueño",
    benefits: [
      {
        id: 1,
        title: "Información precisa sobre horas de sueño necesarias",
        icon: ClockThree,
        description: "Aprende exactamente cuánto sueño necesita tu bebé en cada etapa de desarrollo."
      },
      {
        id: 2,
        title: "Rutinas efectivas adaptadas a cada mes",
        icon: List,
        description: "Rutinas personalizadas según la edad de tu bebé."
      }
    ],
    highlighted: true,
    thumbnailUrl: "/img/via-lactea/photos/recurso-mockup.jpg",
    tags: ["Sueño infantil", "Rutinas", "Recién nacido"],
    formatDetails: [
      {
        format: "guide",
        details: {
          pageCount: 50,
          fileSize: "7.5 MB",
          fileFormat: "PDF"
        }
      }
    ],
    difficulty: "principiante",
    downloads: calculateDownloads("2024-10-15")
  },
  {
    id: 4,
    title: "Cómo manejar las tomas nocturnas",
    slug: "tomas-nocturnas",
    level: "publication",
    levelLabel: "Infografía",
    formats: ["infographic", "pdf"],
    formatLabels: ["Infografía", "PDF"],
    primaryFormat: "infographic",
    iconUrl: iconUrls.infographic,
    description: "Consejos para gestionar las tomas nocturnas manteniendo la lactancia. Una guía visual con pasos prácticos para equilibrar el descanso y la alimentación de tu bebé.",
    shortDescription: "Consejos para gestionar las tomas nocturnas manteniendo la lactancia.",
    prices: [
      { format: "infographic", price: 0 },
      { format: "pdf", price: 0 }
    ],
    isFree: true,
    includeInSubscription: false,
    publishDate: "2024-11-20",
    topic: "lactancia",
    benefits: [
      {
        id: 1,
        title: "Identificación de patrones de alimentación nocturna",
        icon: ClockThree,
        description: "Reconoce los patrones normales de tu bebé durante la noche."
      },
      {
        id: 2,
        title: "Técnicas para mantener la lactancia",
        icon: Shield,
        description: "Estrategias para equilibrar tu descanso sin interrumpir la lactancia."
      }
    ],
    highlighted: true,
    thumbnailUrl: "/img/via-lactea/photos/recurso-mockup.jpg",
    tags: ["Lactancia", "Sueño nocturno", "Alimentación"],
    formatDetails: [
      {
        format: "infographic",
        details: {
          dimensions: "1920x1080px",
          fileSize: "2.5 MB",
          fileFormat: "PDF/PNG"
        }
      }
    ],
    difficulty: "principiante",
    downloads: calculateDownloads("2024-11-20"),
    downloadLimit: 500,
    limitDate: "2024-07-30"
  },
  {
    id: 5,
    title: "Desarrollo del sueño por etapas",
    slug: "curso-desarrollo-sueno",
    level: "course",
    levelLabel: "Curso",
    formats: ["course", "module"],
    formatLabels: ["Curso", "Módulos"],
    primaryFormat: "course",
    iconUrl: iconUrls.video,
    description: "Todo lo que necesitas saber sobre el desarrollo del sueño desde el nacimiento hasta los 4 años. Incluye videos, material descargable y ejemplos prácticos.",
    shortDescription: "Curso completo sobre desarrollo del sueño infantil de 0 a 4 años.",
    prices: [
      { format: "course", price: 49.99 },
      { format: "module", price: 19.99 }
    ],
    isFree: false,
    includeInSubscription: true,
    publishDate: "2024-12-05",
    topic: "sueño",
    benefits: [
      {
        id: 1,
        title: "Conocimientos avanzados sobre el sueño infantil",
        icon: Shield,
        description: "Base científica actualizada sobre el desarrollo del sueño."
      },
      {
        id: 2,
        title: "Material multimedia para cada etapa",
        icon: VideoEditing,
        description: "Videos explicativos y ejemplos prácticos para cada edad."
      }
    ],
    thumbnailUrl: "/img/via-lactea/photos/recurso-mockup.jpg",
    tags: ["Desarrollo infantil", "Sueño", "Etapas"],
    formatDetails: [
      {
        format: "course",
        details: {
          duration: "6h 30min",
          lessonCount: 24,
          videoQuality: "HD"
        }
      }
    ],
    difficulty: "intermedio",
    downloads: calculateDownloads("2024-12-05")
  },
  {
    id: 6,
    title: "Señales tempranas de hambre",
    slug: "senales-hambre",
    level: "publication",
    levelLabel: "Infografía",
    formats: ["infographic", "pdf"],
    formatLabels: ["Infografía", "PDF"],
    primaryFormat: "infographic",
    iconUrl: iconUrls.infographic,
    description: "Aprende a reconocer las señales sutiles que indican que tu bebé tiene hambre antes de que llegue al llanto.",
    shortDescription: "Guía visual para reconocer las señales de hambre antes del llanto.",
    prices: [
      { format: "infographic", price: 0 },
      { format: "pdf", price: 0 }
    ],
    isFree: true,
    includeInSubscription: false,
    publishDate: "2025-01-18",
    topic: "lactancia",
    benefits: [
      {
        id: 1,
        title: "Reconocimiento de señales sutiles",
        icon: Target,
        description: "Identifica las señales tempranas para anticiparte a las necesidades de tu bebé."
      },
      {
        id: 2,
        title: "Menos llanto, más calma",
        icon: Shield,
        description: "Cómo mantener la calma familiar respondiendo a tiempo."
      }
    ],
    thumbnailUrl: "/img/via-lactea/photos/recurso-mockup.jpg",
    tags: ["Lactancia", "Alimentación", "Lenguaje corporal"],
    formatDetails: [
      {
        format: "infographic",
        details: {
          dimensions: "1920x1080px",
          fileSize: "1.8 MB",
          fileFormat: "PDF/PNG"
        }
      }
    ],
    difficulty: "principiante",
    downloads: calculateDownloads("2025-01-18"),
    downloadLimit: 500,
    limitDate: "2024-07-15"
  },
  {
    id: 7,
    title: "Calendario de desarrollo del primer año",
    slug: "calendario-desarrollo",
    level: "module",
    levelLabel: "Calendario",
    formats: ["pdf", "guide"],
    formatLabels: ["PDF", "Guía"],
    primaryFormat: "pdf",
    iconUrl: iconUrls.pdf,
    description: "Un calendario mensual con los hitos de desarrollo más importantes del primer año de vida.",
    shortDescription: "Calendario detallado de hitos del desarrollo en el primer año.",
    prices: [
      { format: "pdf", price: 9.99 },
      { format: "guide", price: 9.99 }
    ],
    isFree: false,
    includeInSubscription: true,
    publishDate: "2025-02-01",
    topic: "desarrollo",
    benefits: [
      {
        id: 1,
        title: "Seguimiento mes a mes del desarrollo",
        icon: ClockThree,
        description: "Hitos de desarrollo organizados cronológicamente."
      },
      {
        id: 2,
        title: "Actividades recomendadas por edad",
        icon: LightBulb,
        description: "Propuestas de actividades para estimular cada área."
      }
    ],
    thumbnailUrl: "/img/via-lactea/photos/recurso-mockup.jpg",
    tags: ["Desarrollo", "Primer año", "Hitos"],
    formatDetails: [
      {
        format: "pdf",
        details: {
          pageCount: 24,
          fileSize: "5.2 MB",
          fileFormat: "PDF"
        }
      }
    ],
    difficulty: "principiante",
    downloads: calculateDownloads("2025-02-01")
  },
  {
    id: 8,
    title: "Canciones de cuna recomendadas",
    slug: "canciones-cuna",
    level: "module",
    levelLabel: "Audio",
    formats: ["module"],
    formatLabels: ["Audio"],
    primaryFormat: "module",
    iconUrl: iconUrls.module,
    description: "Colección de nanas y sonidos relajantes perfectos para ayudar a dormir a tu bebé.",
    shortDescription: "Colección de nanas y sonidos para ayudar a dormir a tu bebé.",
    prices: [
      { format: "module", price: 7.99 }
    ],
    isFree: false,
    includeInSubscription: true,
    publishDate: "2025-02-15",
    topic: "sueño",
    benefits: [
      {
        id: 1,
        title: "Música seleccionada para mejorar el sueño",
        icon: CloudComputingTwo,
        description: "Melodías específicas que favorecen la relajación."
      },
      {
        id: 2,
        title: "Sonidos blancos y ruido rosa",
        icon: Shield,
        description: "Variedad de sonidos ambientales para diferentes necesidades."
      }
    ],
    thumbnailUrl: "/img/via-lactea/photos/recurso-mockup.jpg",
    tags: ["Música", "Relajación", "Sueño infantil"],
    formatDetails: [
      {
        format: "module",
        details: {
          duration: "60min",
          fileSize: "120 MB",
          fileFormat: "MP3"
        }
      }
    ],
    difficulty: "principiante",
    downloads: calculateDownloads("2025-02-15")
  },
  {
    id: 9,
    title: "10 consejos para amamantar gemelos",
    slug: "amamantar-gemelos",
    level: "publication",
    levelLabel: "Guía PDF",
    formats: ["guide", "pdf"],
    formatLabels: ["Guía", "PDF"],
    primaryFormat: "guide",
    iconUrl: iconUrls.guide,
    description: "Consejos prácticos para facilitar la lactancia de gemelos o múltiples. Aprende técnicas de posicionamiento y organización.",
    shortDescription: "Consejos prácticos para amamantar gemelos o múltiples.",
    prices: [
      { format: "guide", price: 0 },
      { format: "pdf", price: 0 }
    ],
    isFree: true,
    includeInSubscription: false,
    publishDate: "2024-08-25",
    topic: "lactancia",
    benefits: [
      {
        id: 1,
        title: "Posiciones optimizadas para gemelos",
        icon: Shield,
        description: "Las mejores posiciones para amamantar a dos bebés simultáneamente."
      },
      {
        id: 2,
        title: "Organización y logística",
        icon: List,
        description: "Cómo organizar tu tiempo y espacio para facilitar la lactancia múltiple."
      }
    ],
    thumbnailUrl: "/img/via-lactea/photos/recurso-mockup.jpg",
    tags: ["Lactancia", "Gemelos", "Múltiples"],
    formatDetails: [
      {
        format: "guide",
        details: {
          pageCount: 15,
          fileSize: "3.2 MB",
          fileFormat: "PDF"
        }
      }
    ],
    difficulty: "intermedio",
    downloads: calculateDownloads("2024-08-25"),
    downloadLimit: 500,
    limitDate: "2024-08-30"
  },
  {
    id: 10,
    title: "Rutinas para bebés de alto contacto",
    slug: "bebes-alto-contacto",
    level: "publication",
    levelLabel: "Infografía",
    formats: ["infographic", "pdf"],
    formatLabels: ["Infografía", "PDF"],
    primaryFormat: "infographic",
    iconUrl: iconUrls.infographic,
    description: "Organiza tu día con un bebé de alto contacto. Estrategias para respetar sus necesidades y mantener la calma.",
    shortDescription: "Estrategias para organizar tu día con un bebé de alto contacto.",
    prices: [
      { format: "infographic", price: 0 },
      { format: "pdf", price: 0 }
    ],
    isFree: true,
    includeInSubscription: false,
    publishDate: "2024-09-10",
    topic: "sueño",
    benefits: [
      {
        id: 1,
        title: "Rutinas respetuosas",
        icon: Shield,
        description: "Cómo crear rutinas que respeten las necesidades de contacto."
      },
      {
        id: 2,
        title: "Porteo y sueño seguro",
        icon: LightBulb,
        description: "Técnicas de porteo para facilitar el descanso."
      }
    ],
    thumbnailUrl: "/img/via-lactea/photos/recurso-mockup.jpg",
    tags: ["Colecho", "Porteo", "Alto contacto"],
    formatDetails: [
      {
        format: "infographic",
        details: {
          dimensions: "1920x1080px",
          fileSize: "2.2 MB",
          fileFormat: "PDF/PNG"
        }
      }
    ],
    difficulty: "principiante",
    downloads: calculateDownloads("2024-09-10"),
    downloadLimit: 500,
    limitDate: "2024-08-20"
  },
  {
    id: 11,
    title: "Comunicación temprana con tu bebé",
    slug: "comunicacion-temprana",
    level: "module",
    levelLabel: "Guía PDF",
    formats: ["guide", "pdf"],
    formatLabels: ["Guía", "PDF"],
    primaryFormat: "guide",
    iconUrl: iconUrls.guide,
    description: "Aprende a reconocer y responder a las primeras señales comunicativas de tu bebé, fortaleciendo vuestro vínculo.",
    shortDescription: "Cómo reconocer y responder a las señales comunicativas de tu bebé.",
    prices: [
      { format: "guide", price: 0 },
      { format: "pdf", price: 0 }
    ],
    isFree: true,
    includeInSubscription: false,
    publishDate: "2024-10-05",
    topic: "desarrollo",
    benefits: [
      {
        id: 1,
        title: "Lenguaje pre-verbal",
        icon: ChatTwo,
        description: "Cómo interpretar el lenguaje corporal y las vocalizaciones."
      },
      {
        id: 2,
        title: "Fortalecimiento del vínculo",
        icon: Shield,
        description: "Actividades para fortalecer la conexión emocional."
      }
    ],
    thumbnailUrl: "/img/via-lactea/photos/recurso-mockup.jpg",
    tags: ["Comunicación", "Desarrollo", "Vínculo"],
    formatDetails: [
      {
        format: "guide",
        details: {
          pageCount: 20,
          fileSize: "4.5 MB",
          fileFormat: "PDF"
        }
      }
    ],
    difficulty: "principiante",
    downloads: calculateDownloads("2024-10-05"),
    downloadLimit: 500,
    limitDate: "2024-08-05"
  },
  {
    id: 12,
    title: "Guía de alimentación complementaria",
    slug: "alimentacion-complementaria",
    level: "module",
    levelLabel: "Guía PDF",
    formats: ["guide", "pdf"],
    formatLabels: ["Guía", "PDF"],
    primaryFormat: "guide",
    iconUrl: iconUrls.guide,
    description: "Todo lo que necesitas saber para iniciar la alimentación complementaria. Includes recetas adaptadas por etapas.",
    shortDescription: "Guía completa para iniciar la alimentación complementaria con éxito.",
    prices: [
      { format: "guide", price: 0 },
      { format: "pdf", price: 0 }
    ],
    isFree: true,
    includeInSubscription: false,
    publishDate: "2024-07-15",
    topic: "lactancia",
    benefits: [
      {
        id: 1,
        title: "Introducción segura de alimentos",
        icon: Shield,
        description: "Calendario de introducción de alimentos según la edad."
      },
      {
        id: 2,
        title: "Recetas adaptadas por etapas",
        icon: List,
        description: "Recetas fáciles y nutritivas para cada etapa del desarrollo."
      }
    ],
    thumbnailUrl: "/img/via-lactea/photos/recurso-mockup.jpg",
    tags: ["Alimentación", "BLW", "Destete"],
    formatDetails: [
      {
        format: "guide",
        details: {
          pageCount: 35,
          fileSize: "6.8 MB",
          fileFormat: "PDF"
        }
      }
    ],
    difficulty: "principiante",
    downloads: calculateDownloads("2024-07-15"),
    downloadLimit: 500,
    limitDate: "2024-07-20"
  },
  {
    id: 13,
    title: "Checklist para viajes con bebés",
    slug: "viajes-bebes",
    level: "publication",
    levelLabel: "Checklist",
    formats: ["pdf"],
    formatLabels: ["PDF"],
    primaryFormat: "pdf",
    iconUrl: iconUrls.pdf,
    description: "Lista completa de todo lo necesario para viajar con tu bebé. Organizada por categorías y con consejos adicionales.",
    shortDescription: "Lista completa organizada por categorías para viajar con bebés.",
    prices: [
      { format: "pdf", price: 0 }
    ],
    isFree: true,
    includeInSubscription: false,
    publishDate: "2024-06-20",
    topic: "desarrollo",
    benefits: [
      {
        id: 1,
        title: "Lista organizada por categorías",
        icon: List,
        description: "Artículos esenciales clasificados para no olvidar nada importante."
      },
      {
        id: 2,
        title: "Consejos para diferentes tipos de viaje",
        icon: LightBulb,
        description: "Recomendaciones específicas para viajes en avión, coche o tren."
      }
    ],
    thumbnailUrl: "/img/via-lactea/photos/recurso-mockup.jpg",
    tags: ["Viajes", "Organización", "Consejos prácticos"],
    formatDetails: [
      {
        format: "pdf",
        details: {
          pageCount: 10,
          fileSize: "2.1 MB",
          fileFormat: "PDF"
        }
      }
    ],
    difficulty: "principiante",
    downloads: calculateDownloads("2024-06-20")
  }
];

// Exportamos un listado combinado para uso en componentes
export const productList: ProductItem[] = [];

// Primero procesamos los productos principales
[...mainProductList].forEach(product => {
  // Calcular currentDownloads para productos gratuitos con límite de descargas
  if (product.isFree && product.downloadLimit && product.limitDate && !product.currentDownloads) {
    product.currentDownloads = calculateCurrentDownloads(product.downloadLimit, product.limitDate);
  }
  
  productList.push(product);
});

// Luego procesamos los productos adicionales
[...additionalProducts].forEach(product => {
  // Calcular currentDownloads para productos gratuitos con límite de descargas
  if (product.isFree && product.downloadLimit && product.limitDate && !product.currentDownloads) {
    product.currentDownloads = calculateCurrentDownloads(product.downloadLimit, product.limitDate);
  }
  
  productList.push(product);
});

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

// Si se necesitan exportaciones adicionales, mantenerlas aquí
export default productList; 