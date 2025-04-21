import { StaticImageData } from 'next/image';

// Definimos las rutas a los iconos SVG que están disponibles en public/img/icons/solid
const ICON_PATH = '/img/icons/solid/';
const iconUrls = {
  pdf: `${ICON_PATH}note.svg`,
  video: `${ICON_PATH}videocall.svg`,
  infographic: `${ICON_PATH}infographic.svg`,
  guide: `${ICON_PATH}e-commerce.svg`,
  course: `${ICON_PATH}monitor.svg`,
  book: `${ICON_PATH}content.svg`,
  instagram: `${ICON_PATH}sharing.svg`,
  facebook: `${ICON_PATH}share.svg`,
  blog: `${ICON_PATH}feather.svg`,
  newsletter: `${ICON_PATH}emails.svg`,
};

// Tipos de niveles de producto
export type ProductLevel = 'publication' | 'module' | 'course';

// Tipos de formato de producto
export type ProductFormat = 'instagram' | 'facebook' | 'blog' | 'newsletter' | 'guide' | 'module' | 'book' | 'course';

// Definición de tipos para los productos
export interface ProductItem {
  id: number;
  title: string;
  slug: string;
  level: ProductLevel;
  formats: ProductFormat[];
  category: 'sleep' | 'breastfeeding' | 'general';
  categoryLabel: string;
  iconUrl: string;
  description: string;
  shortDescription: string;
  price: number | null; // null para productos gratuitos
  isPremium: boolean; // si requiere suscripción
  isFree: boolean; // si es gratuito
  isPreview: boolean; // si es una previsualización de contenido premium
  isFeatured: boolean; // si debe destacarse en la home
  publishDate: string; // fecha de publicación en formato ISO
  downloads: number; // número de descargas (real o calculado)
  coverImage: string; // ruta a la imagen de portada
  relatedProducts?: number[]; // IDs de productos relacionados
  tags: string[]; // etiquetas para filtrado
  cta?: { // Call to action personalizado
    text: string;
    url: string;
  };
  content?: { // Contenido o preview del producto
    preview: string;
    full?: string; // Solo para contenido premium
  };
}

// Categorías de productos
export const productCategories = [
  {
    id: 'sleep',
    label: 'Sueño infantil',
    description: 'Recursos sobre el sueño de tu bebé'
  },
  {
    id: 'breastfeeding',
    label: 'Lactancia',
    description: 'Recursos sobre lactancia materna y artificial'
  },
  {
    id: 'general',
    label: 'General',
    description: 'Recursos generales sobre crianza'
  }
];

// Datos de los productos
export const productList: ProductItem[] = [
  // Publicaciones (nivel 1) - Gratuitas
  {
    id: 1,
    title: '¿Tu bebé se despierta también cada 2 horas?',
    slug: 'despertares-cada-2-horas',
    level: 'publication',
    formats: ['instagram', 'facebook', 'blog', 'newsletter'],
    category: 'sleep',
    categoryLabel: 'Sueño infantil',
    iconUrl: iconUrls.infographic,
    description: 'Descubre por qué tu bebé se despierta con tanta frecuencia durante la noche y qué puedes hacer para ayudarle a consolidar su sueño de forma respetuosa.',
    shortDescription: 'Causas y soluciones para los despertares frecuentes nocturnos.',
    price: null,
    isPremium: false,
    isFree: true,
    isPreview: false,
    isFeatured: true,
    publishDate: '2023-10-15',
    downloads: 357,
    coverImage: '/img/products/despertares-cada-2-horas.jpg',
    tags: ['sueño', 'despertares', 'bebés', 'nocturno'],
    content: {
      preview: 'Los despertares frecuentes son una de las principales preocupaciones de los padres. Si tu bebé se despierta cada 2 horas durante la noche, esto puede deberse a varios factores...'
    }
  },
  {
    id: 2,
    title: 'Ventanas de sueño por edades: guía completa',
    slug: 'ventanas-sueno-edades',
    level: 'publication',
    formats: ['instagram', 'facebook', 'blog', 'newsletter'],
    category: 'sleep',
    categoryLabel: 'Sueño infantil',
    iconUrl: iconUrls.infographic,
    description: 'Aprende a identificar las ventanas de sueño de tu bebé según su edad y cómo aprovecharlas para mejorar la calidad del sueño y evitar el sobrecansancio.',
    shortDescription: 'Cómo identificar y aprovechar las ventanas de sueño según la edad.',
    price: null,
    isPremium: false,
    isFree: true,
    isPreview: false,
    isFeatured: true,
    publishDate: '2023-11-05',
    downloads: 423,
    coverImage: '/img/products/ventanas-sueno.jpg',
    tags: ['sueño', 'ventanas de sueño', 'rutinas', 'bebés'],
    content: {
      preview: 'Las ventanas de sueño son períodos óptimos durante el día en los que tu bebé está preparado para dormir. Reconocerlas te ayudará a establecer rutinas más efectivas...'
    }
  },
  {
    id: 3,
    title: 'Posiciones efectivas para una lactancia sin dolor',
    slug: 'posiciones-lactancia-sin-dolor',
    level: 'publication',
    formats: ['instagram', 'facebook', 'blog', 'newsletter'],
    category: 'breastfeeding',
    categoryLabel: 'Lactancia',
    iconUrl: iconUrls.infographic,
    description: 'Guía visual con las mejores posiciones para amamantar a tu bebé, evitando dolores y mejorando el agarre para una lactancia exitosa y placentera.',
    shortDescription: 'Aprende las posiciones más efectivas para una lactancia sin dolor.',
    price: null,
    isPremium: false,
    isFree: true,
    isPreview: false,
    isFeatured: false,
    publishDate: '2023-09-20',
    downloads: 289,
    coverImage: '/img/products/posiciones-lactancia.jpg',
    tags: ['lactancia', 'posiciones', 'agarre', 'dolor'],
    content: {
      preview: 'El dolor durante la lactancia no es normal y generalmente indica que algo puede mejorar. Estas posiciones te ayudarán a encontrar una forma cómoda y efectiva de amamantar...'
    }
  },

  // Módulos/Guías (nivel 2) - Algunos gratuitos, otros premium
  {
    id: 4,
    title: 'Qué son las ventanas de sueño y cómo aprovecharlas',
    slug: 'guia-ventanas-sueno',
    level: 'module',
    formats: ['guide', 'module'],
    category: 'sleep',
    categoryLabel: 'Sueño infantil',
    iconUrl: iconUrls.guide,
    description: 'Guía completa sobre las ventanas de sueño de tu bebé. Incluye recomendaciones por edad, señales de sueño a observar, y cómo crear rutinas adaptadas a los ritmos naturales de tu bebé.',
    shortDescription: 'Todo lo que necesitas saber sobre ventanas de sueño para mejorar el descanso de tu bebé.',
    price: 15,
    isPremium: true,
    isFree: false,
    isPreview: false,
    isFeatured: true,
    publishDate: '2023-11-10',
    downloads: 105,
    coverImage: '/img/products/guia-ventanas-sueno.jpg',
    tags: ['sueño', 'ventanas de sueño', 'guía', 'rutinas'],
    cta: {
      text: 'Descargar guía',
      url: '/recursos/guia-ventanas-sueno'
    },
    content: {
      preview: 'Las ventanas de sueño son períodos óptimos para que tu bebé concilie el sueño. En esta guía aprenderás a identificarlas según la edad y cómo estructurar las siestas para evitar el sobrecansancio...',
      full: 'Contenido completo disponible para suscriptores o tras la compra.'
    }
  },
  {
    id: 5,
    title: 'El sueño del recién nacido',
    slug: 'guia-sueno-recien-nacido',
    level: 'module',
    formats: ['guide', 'module'],
    category: 'sleep',
    categoryLabel: 'Sueño infantil',
    iconUrl: iconUrls.guide,
    description: 'Todo lo que necesitas saber sobre los patrones de sueño de tu recién nacido (0-3 meses). Comprende sus ciclos, necesidades y cómo acompañarle de forma respetuosa en esta primera etapa.',
    shortDescription: 'Guía especializada en el sueño durante los primeros 3 meses de vida.',
    price: null,
    isPremium: false,
    isFree: true,
    isPreview: false,
    isFeatured: true,
    publishDate: '2023-08-15',
    downloads: 532,
    coverImage: '/img/products/sueno-recien-nacido.jpg',
    tags: ['sueño', 'recién nacido', 'guía', 'primeros meses'],
    cta: {
      text: 'Descargar guía gratuita',
      url: '/recursos/guia-sueno-recien-nacido'
    },
    content: {
      preview: 'Los recién nacidos tienen patrones de sueño muy diferentes a los de los bebés más mayores. Durante los primeros 3 meses, tu bebé pasará por importantes cambios en sus ciclos de sueño...'
    }
  },
  {
    id: 6,
    title: 'Cómo hacer un plan de sueño personalizado',
    slug: 'guia-plan-sueno',
    level: 'module',
    formats: ['guide', 'module'],
    category: 'sleep',
    categoryLabel: 'Sueño infantil',
    iconUrl: iconUrls.guide,
    description: 'Aprende a diseñar un plan de sueño adaptado a las necesidades específicas de tu bebé y tu familia. Incluye plantillas, ejemplos y estrategias paso a paso para implementarlo con éxito.',
    shortDescription: 'Metodología para crear planes de sueño efectivos y respetuosos.',
    price: 20,
    isPremium: true,
    isFree: false,
    isPreview: false,
    isFeatured: false,
    publishDate: '2023-12-01',
    downloads: 78,
    coverImage: '/img/products/plan-sueno-personalizado.jpg',
    tags: ['sueño', 'plan', 'rutinas', 'método'],
    cta: {
      text: 'Acceder al contenido',
      url: '/recursos/guia-plan-sueno'
    },
    content: {
      preview: 'Crear un plan de sueño personalizado requiere conocer bien a tu bebé y sus necesidades. En esta guía te enseñamos el proceso paso a paso para elaborar un plan que funcione para toda la familia...',
      full: 'Contenido completo disponible para suscriptores o tras la compra.'
    }
  },
  {
    id: 7,
    title: 'La llegada del hermano: guía para preparar al primogénito',
    slug: 'guia-llegada-hermano',
    level: 'module',
    formats: ['guide', 'module'],
    category: 'general',
    categoryLabel: 'General',
    iconUrl: iconUrls.guide,
    description: 'Guía práctica para preparar a tu hijo/a para la llegada de un nuevo miembro a la familia. Estrategias por edades, recomendaciones para el momento del nacimiento y cómo gestionar los celos.',
    shortDescription: 'Prepara a tu hijo para la llegada de un nuevo hermano.',
    price: 15,
    isPremium: true,
    isFree: false,
    isPreview: false,
    isFeatured: false,
    publishDate: '2023-10-20',
    downloads: 94,
    coverImage: '/img/products/llegada-hermano.jpg',
    tags: ['hermanos', 'celos', 'adaptación', 'familia'],
    cta: {
      text: 'Descargar guía',
      url: '/recursos/guia-llegada-hermano'
    },
    content: {
      preview: 'La llegada de un nuevo bebé es un gran cambio para toda la familia, especialmente para los hermanos mayores. Esta guía te ayudará a preparar a tu hijo para este momento tan especial...',
      full: 'Contenido completo disponible para suscriptores o tras la compra.'
    }
  },

  // Cursos/Libros (nivel 3) - Premium
  {
    id: 8,
    title: 'El sueño respetuoso de tu bebé',
    slug: 'curso-sueno-respetuoso-bebe',
    level: 'course',
    formats: ['book', 'course'],
    category: 'sleep',
    categoryLabel: 'Sueño infantil',
    iconUrl: iconUrls.course,
    description: 'Curso completo sobre sueño infantil respetuoso. Comprende todas las etapas desde el nacimiento hasta los 4 años, con estrategias personalizables según temperamento y edad.',
    shortDescription: 'Aprende todo sobre el sueño infantil desde un enfoque respetuoso.',
    price: 75,
    isPremium: true,
    isFree: false,
    isPreview: false,
    isFeatured: true,
    publishDate: '2024-01-05',
    downloads: 48,
    coverImage: '/img/products/curso-sueno-respetuoso.jpg',
    relatedProducts: [4, 5, 6],
    tags: ['sueño', 'curso', 'método respetuoso', 'todas las edades'],
    cta: {
      text: 'Explorar el curso',
      url: '/recursos/curso-sueno-respetuoso-bebe'
    },
    content: {
      preview: 'El sueño infantil es un viaje que evoluciona constantemente. En este curso completo abordaremos todas las etapas y desafíos, ofreciéndote herramientas prácticas y respetuosas para mejorar el descanso de toda la familia...',
      full: 'Contenido completo disponible para suscriptores o tras la compra.'
    }
  },
  {
    id: 9,
    title: 'Lactancia Materna: de inicio a destete',
    slug: 'curso-lactancia-materna',
    level: 'course',
    formats: ['book', 'course'],
    category: 'breastfeeding',
    categoryLabel: 'Lactancia',
    iconUrl: iconUrls.course,
    description: 'Curso integral sobre lactancia materna que cubre desde la preparación prenatal hasta el destete respetuoso. Incluye soluciones para dificultades comunes y apoyo para la lactancia prolongada.',
    shortDescription: 'Todo lo que necesitas saber sobre lactancia materna de principio a fin.',
    price: 75,
    isPremium: true,
    isFree: false,
    isPreview: false,
    isFeatured: true,
    publishDate: '2023-11-30',
    downloads: 56,
    coverImage: '/img/products/curso-lactancia-materna.jpg',
    relatedProducts: [3],
    tags: ['lactancia', 'curso', 'destete', 'agarre'],
    cta: {
      text: 'Explorar el curso',
      url: '/recursos/curso-lactancia-materna'
    },
    content: {
      preview: 'La lactancia materna es un viaje único para cada díada madre-bebé. En este curso aprenderás desde las bases de un buen inicio hasta cómo navegar los desafíos más comunes. También abordaremos la lactancia prolongada y el destete respetuoso...',
      full: 'Contenido completo disponible para suscriptores o tras la compra.'
    }
  },
  {
    id: 10,
    title: 'Sueño de 6 meses a 4 años',
    slug: 'curso-sueno-6m-4a',
    level: 'course',
    formats: ['book', 'course'],
    category: 'sleep',
    categoryLabel: 'Sueño infantil',
    iconUrl: iconUrls.course,
    description: 'Curso especializado en el sueño infantil desde los 6 meses hasta los 4 años. Aborda regresiones, transiciones de siestas, pesadillas, y el paso a la cama propia de manera respetuosa.',
    shortDescription: 'Estrategias de sueño específicas para bebés mayores y niños pequeños.',
    price: 65,
    isPremium: true,
    isFree: false,
    isPreview: false,
    isFeatured: false,
    publishDate: '2024-02-10',
    downloads: 32,
    coverImage: '/img/products/curso-sueno-6m-4a.jpg',
    relatedProducts: [2, 6, 8],
    tags: ['sueño', 'curso', 'niños pequeños', 'regresiones'],
    cta: {
      text: 'Explorar el curso',
      url: '/recursos/curso-sueno-6m-4a'
    },
    content: {
      preview: 'A partir de los 6 meses, el sueño infantil presenta desafíos únicos como las regresiones, el desarrollo de la ansiedad por separación y los miedos nocturnos. Este curso te guiará a través de todas estas etapas...',
      full: 'Contenido completo disponible para suscriptores o tras la compra.'
    }
  }
];

// Función para obtener productos por categoría
export const getProductsByCategory = (category: string) => {
  return productList.filter(product => product.category === category);
};

// Función para obtener productos por nivel
export const getProductsByLevel = (level: ProductLevel) => {
  return productList.filter(product => product.level === level);
};

// Función para obtener productos destacados
export const getFeaturedProducts = () => {
  return productList.filter(product => product.isFeatured);
};

// Función para obtener productos gratuitos
export const getFreeProducts = () => {
  return productList.filter(product => product.isFree);
};

// Función para obtener productos premium
export const getPremiumProducts = () => {
  return productList.filter(product => product.isPremium);
};

// Función para obtener un producto por su slug
export const getProductBySlug = (slug: string) => {
  return productList.find(product => product.slug === slug);
};

// Función para obtener productos relacionados
export const getRelatedProducts = (productId: number) => {
  const product = productList.find(p => p.id === productId);
  if (!product || !product.relatedProducts) return [];
  
  return productList.filter(p => product.relatedProducts?.includes(p.id));
};

// Función para calcular el número de descargas basado en tiempo desde publicación
export const calculateDownloads = (product: ProductItem): number => {
  const publishDate = new Date(product.publishDate);
  const now = new Date();
  const daysSincePublish = Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Un algoritmo simple: Base + días * factor aleatorio
  const baseDownloads = product.isFree ? 50 : 10;
  const dailyFactor = product.isFree ? 5 : 2;
  const randomFactor = 0.8 + Math.random() * 0.4; // Entre 0.8 y 1.2
  
  return Math.floor(baseDownloads + (daysSincePublish * dailyFactor * randomFactor));
};

// Exportamos el listado para uso en componentes
export default productList; 