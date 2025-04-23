"use client";

import { Fragment, useState, useEffect } from "react";
import ResourcesHero from "components/blocks/hero/ResourcesHero";
import ResourcesLayout, { IResource } from "components/blocks/resources/ResourcesLayout";
import ResourcesSubscriptionCTA from "components/blocks/call-to-action/ResourcesSubscriptionCTA";
import ComingSoonResources from "components/blocks/resources/ComingSoonResources";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SortOption } from "components/blocks/resources/ResourcesSidebar";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
import { calculateDownloads } from "utils/downloads";

// Demo data - this would be replaced with real data from a CMS or API
const resourcesData: IResource[] = [
  {
    id: "1",
    image: "/img/via-lactea/photos/recurso-mockup.jpg",
    title: "Guía de Sueño - 0 a 6 meses",
    type: "Guía PDF",
    description: "Soluciones prácticas para mejorar el sueño de bebés de 0 a 6 meses. Aprende técnicas efectivas para ayudar a tu bebé a dormir mejor y establecer rutinas saludables.",
    price: 19.99,
    isFree: false,
    url: "/recursos/guia-sueno-0-6-meses",
    category: "Sueño",
    featured: true,
    date: "2024-10-15",
    downloads: 0, // Se calculará dinámicamente
    includeInSubscription: true,
    tags: ["Sueño infantil", "Rutinas", "Recién nacido"]
  },
  {
    id: "2",
    image: "/img/via-lactea/photos/recurso-mockup.jpg",
    title: "Cómo manejar las tomas nocturnas",
    type: "Infografía",
    description: "Consejos para gestionar las tomas nocturnas manteniendo la lactancia. Una guía visual con pasos prácticos para equilibrar el descanso y la alimentación de tu bebé.",
    price: 0,
    isFree: true,
    url: "/recursos/tomas-nocturnas",
    category: "Lactancia",
    featured: true,
    date: "2024-11-20",
    downloads: 0, // Se calculará dinámicamente
    includeInSubscription: false,
    tags: ["Lactancia", "Sueño nocturno", "Alimentación"],
    limitDate: new Date().toISOString().split('T')[0], // Fecha actual para que siempre sea "último día"
    downloadLimit: 500,
    currentDownloads: 395 // 79% de 500 - casi cerca del límite
  },
  {
    id: "3",
    image: "/img/via-lactea/photos/recurso-mockup.jpg",
    title: "Desarrollo del sueño por etapas",
    type: "Curso",
    description: "Todo lo que necesitas saber sobre el desarrollo del sueño desde el nacimiento hasta los 4 años. Incluye videos, material descargable y ejemplos prácticos.",
    price: 49.99,
    isFree: false,
    url: "/recursos/curso-desarrollo-sueno",
    category: "Sueño",
    date: "2024-12-05",
    downloads: 0, // Se calculará dinámicamente
    includeInSubscription: true,
    tags: ["Desarrollo infantil", "Sueño", "Etapas"]
  },
  {
    id: "4",
    image: "/img/via-lactea/photos/recurso-mockup.jpg",
    title: "Señales tempranas de hambre",
    type: "Infografía",
    description: "Aprende a reconocer las señales sutiles que indican que tu bebé tiene hambre antes de que llegue al llanto.",
    price: 0,
    isFree: true,
    url: "/recursos/senales-hambre",
    category: "Lactancia",
    date: "2025-01-18",
    downloads: 0, // Se calculará dinámicamente
    includeInSubscription: false,
    tags: ["Lactancia", "Alimentación", "Lenguaje corporal"],
    limitDate: "2025-04-20",
    downloadLimit: 400,
    currentDownloads: 244 // 61% de 400
  },
  {
    id: "5",
    image: "/img/via-lactea/photos/recurso-mockup.jpg",
    title: "Calendario de desarrollo del primer año",
    type: "Calendario",
    description: "Un calendario mensual con los hitos de desarrollo más importantes del primer año de vida.",
    price: 9.99,
    isFree: false,
    url: "/recursos/calendario-desarrollo",
    category: "Desarrollo",
    date: "2025-02-01",
    downloads: 0, // Se calculará dinámicamente
    includeInSubscription: true,
    tags: ["Desarrollo", "Primer año", "Hitos"]
  },
  {
    id: "6",
    image: "/img/via-lactea/photos/recurso-mockup.jpg",
    title: "Canciones de cuna recomendadas",
    type: "Audio",
    description: "Colección de nanas y sonidos relajantes perfectos para ayudar a dormir a tu bebé.",
    price: 7.99,
    isFree: false,
    url: "/recursos/canciones-cuna",
    category: "Sueño",
    date: "2025-02-15",
    downloads: 0, // Se calculará dinámicamente
    includeInSubscription: true,
    tags: ["Música", "Relajación", "Sueño infantil"]
  },
  // Nuevo - 1 día restante, pocos cupos
  {
    id: "7",
    image: "/img/via-lactea/photos/recurso-mockup.jpg",
    title: "10 consejos para amamantar gemelos",
    type: "Guía PDF",
    description: "Consejos prácticos para facilitar la lactancia de gemelos o múltiples. Aprende técnicas de posicionamiento y organización.",
    price: 0,
    isFree: true,
    url: "/recursos/amamantar-gemelos",
    category: "Lactancia",
    date: "2024-08-25",
    downloads: 0,
    includeInSubscription: false,
    tags: ["Lactancia", "Gemelos", "Múltiples"],
    // Un día después de hoy
    limitDate: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    })(),
    downloadLimit: 300,
    currentDownloads: 285 // 95% ocupado - muy pocos cupos
  },
  // Nuevo - 3 días restantes, cupos medios
  {
    id: "8",
    image: "/img/via-lactea/photos/recurso-mockup.jpg",
    title: "Rutinas para bebés de alto contacto",
    type: "Infografía",
    description: "Organiza tu día con un bebé de alto contacto. Estrategias para respetar sus necesidades y mantener la calma.",
    price: 0,
    isFree: true,
    url: "/recursos/bebes-alto-contacto",
    category: "Sueño",
    date: "2024-09-10",
    downloads: 0,
    includeInSubscription: false,
    tags: ["Colecho", "Porteo", "Alto contacto"],
    // 3 días después de hoy
    limitDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      return date.toISOString().split('T')[0];
    })(),
    downloadLimit: 350,
    currentDownloads: 240 // 69% ocupado
  },
  // Nuevo - 7 días restantes, bastantes cupos
  {
    id: "9",
    image: "/img/via-lactea/photos/recurso-mockup.jpg",
    title: "Comunicación temprana con tu bebé",
    type: "Guía PDF",
    description: "Aprende a reconocer y responder a las primeras señales comunicativas de tu bebé, fortaleciendo vuestro vínculo.",
    price: 0,
    isFree: true,
    url: "/recursos/comunicacion-temprana",
    category: "Desarrollo",
    date: "2024-10-05",
    downloads: 0,
    includeInSubscription: false,
    tags: ["Comunicación", "Desarrollo", "Vínculo"],
    // 7 días después de hoy
    limitDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date.toISOString().split('T')[0];
    })(),
    downloadLimit: 400,
    currentDownloads: 200 // 50% ocupado
  },
  // Nuevo - 14 días restantes, muchos cupos
  {
    id: "10",
    image: "/img/via-lactea/photos/recurso-mockup.jpg",
    title: "Guía de alimentación complementaria",
    type: "Guía PDF",
    description: "Todo lo que necesitas saber para iniciar la alimentación complementaria. Includes recetas adaptadas por etapas.",
    price: 0,
    isFree: true,
    url: "/recursos/alimentacion-complementaria",
    category: "Lactancia",
    date: "2024-07-15",
    downloads: 0,
    includeInSubscription: false,
    tags: ["Alimentación", "BLW", "Destete"],
    // 14 días después de hoy
    limitDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 14);
      return date.toISOString().split('T')[0];
    })(),
    downloadLimit: 500,
    currentDownloads: 150 // 30% ocupado
  },
  // Nuevo - 30 días restantes, pocos cupos usados
  {
    id: "11",
    image: "/img/via-lactea/photos/recurso-mockup.jpg",
    title: "Checklist para viajes con bebés",
    type: "Checklist",
    description: "Lista completa de todo lo necesario para viajar con tu bebé. Organizada por categorías y con consejos adicionales.",
    price: 0,
    isFree: true,
    url: "/recursos/viajes-bebes",
    category: "Desarrollo",
    date: "2024-06-20",
    downloads: 0,
    includeInSubscription: false,
    tags: ["Viajes", "Organización", "Consejos prácticos"],
    // 30 días después de hoy
    limitDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date.toISOString().split('T')[0];
    })(),
    downloadLimit: 600,
    currentDownloads: 120 // 20% ocupado
  }
];

// Calcular descargas para cada recurso
const resourcesWithDownloads = resourcesData.map(resource => ({
  ...resource,
  downloads: calculateDownloads(resource.date || '2023-01-01'),
  publishDate: resource.date // Añadir el campo publishDate usando el date existente
}));

// Categories for the filter selector
const categories = [
  { id: "todos", name: "Todos" },
  { id: "sueno", name: "Sueño" },
  { id: "lactancia", name: "Lactancia" },
  { id: "desarrollo", name: "Desarrollo" }
];

export default function ResourcesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() ?? '/';

  // Función para normalizar strings
  const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Obtener parámetros de la URL
  const categoryParam: string = searchParams?.get('categoria') || 'todos';
  const onlyFreeParam: boolean = searchParams?.get('gratuito') === 'true';
  const sortOptionParam: SortOption = (searchParams?.get('ordenar') as SortOption) || 'relevance';
  const tagParam: string = searchParams?.get('tag') || '';

  // Estado para filtros y ordenación
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [onlyFree, setOnlyFree] = useState<boolean>(onlyFreeParam);
  const [sortOption, setSortOption] = useState<SortOption>(sortOptionParam);
  const [selectedTag, setSelectedTag] = useState<string>(tagParam);
  
  // Estado para recursos filtrados
  const [filteredResources, setFilteredResources] = useState<IResource[]>(resourcesWithDownloads);
  const [featuredResources, setFeaturedResources] = useState<IResource[]>([]);
  const [mainResources, setMainResources] = useState<IResource[]>([]);
  
  // Cargar datos iniciales basados en los parámetros de URL
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setOnlyFree(onlyFreeParam);
    setSortOption(sortOptionParam);
    setSelectedTag(tagParam);
  }, [categoryParam, onlyFreeParam, sortOptionParam, tagParam]);

  // Actualizar URL cuando cambien los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedCategory !== 'todos') {
      // Usamos el nombre de categoría normalizado para la URL
      const normalizedCategory = normalizeString(selectedCategory);
      params.set('categoria', normalizedCategory);
    }
    
    if (onlyFree) {
      params.set('gratuito', 'true');
    }
    
    if (sortOption !== 'relevance') {
      params.set('ordenar', sortOption);
    }

    // Añadir el parámetro de tag si está seleccionado
    if (selectedTag) {
      params.set('tag', selectedTag);
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [selectedCategory, onlyFree, sortOption, selectedTag, pathname, router]);

  // Aplicar filtros y ordenación cuando cambien los parámetros
  useEffect(() => {
    let filtered = [...resourcesWithDownloads];
    
    // Filtrar por categoría
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(resource => {
        // Normalizamos las cadenas para comparar correctamente, eliminando acentos y pasando a minúsculas
        const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
        return normalizeString(resource.category) === normalizeString(selectedCategory);
      });
    }
    
    // Filtrar por tag si hay uno seleccionado
    if (selectedTag) {
      filtered = filtered.filter(resource => {
        return resource.tags?.some(tag => 
          normalizeString(tag) === normalizeString(selectedTag)
        );
      });
    }
    
    // Filtrar por gratis/no gratis
    if (onlyFree) {
      filtered = filtered.filter(resource => resource.isFree);
    }
    
    // Ordenar recursos
    switch (sortOption) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => 
          a.date && b.date ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0
        );
        break;
      case 'price-asc':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      default:
        // Por defecto, mantener el orden original (relevancia)
        break;
    }
    
    setFilteredResources(filtered);

    // Separar recursos destacados
    const featured = filtered.filter(resource => resource.featured);
    const main = filtered.filter(resource => !resource.featured);
    
    setFeaturedResources(featured);
    setMainResources(main);
  }, [selectedCategory, onlyFree, sortOption, selectedTag]);

  // Manejadores de eventos para filtros y ordenación
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleFreeToggleChange = (checked: boolean) => {
    setOnlyFree(checked);
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
  };

  // Comprobar si hay recursos para mostrar
  const hasResources = filteredResources.length > 0;

  return (
    <Fragment>
      {/* ========== header ========== */}
      <header className="wrapper bg-soft-transparent">
        <ViaLacteaNavbar button={<CalendlyButton />} whiteBackground={true} />
      </header>

      <main className="content-wrapper">
        {/* ========== Hero section ========== */}
        <ResourcesHero />

        {hasResources ? (
          <Fragment>
            {/* ========== Resources Layout Section ========== */}
            <section className="wrapper bg-soft-primary">
              <div className="container py-3 py-md-4">
                <ResourcesLayout 
                  featuredResources={featuredResources}
                  resources={mainResources}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onlyFree={onlyFree}
                  onCategoryChange={handleCategoryChange}
                  onFreeToggleChange={handleFreeToggleChange}
                  onSortChange={handleSortChange}
                  sortOption={sortOption}
                  onTagChange={handleTagChange}
                />
              </div>
            </section>

            {/* ========== Subscription CTA section ========== */}
            <section className="wrapper bg-soft-primary pb-15">
              <ResourcesSubscriptionCTA />
            </section>
          </Fragment>
        ) : (
          /* ========== Coming Soon section (when no products) ========== */
          <section className="wrapper bg-soft-primary pb-15">
            <div className="container">
              <div className="row">
                <div className="col-md-10 offset-md-1">
                  <ComingSoonResources />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </Fragment>
  );
} 