"use client";

import { Fragment, useState, useEffect, Suspense } from "react";
import ResourcesHero from "components/blocks/hero/ResourcesHero";
import ResourcesLayout, { IResource } from "components/blocks/resources/ResourcesLayout";
import ResourcesSubscriptionCTA from "components/blocks/call-to-action/ResourcesSubscriptionCTA";
import ComingSoonResources from "components/blocks/resources/ComingSoonResources";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SortOption } from "components/blocks/resources/ResourcesSidebar";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
import productList from "data/product-data";
import { ProductItem } from "data/product-data";

// Función para convertir productos de ProductItem a IResource
const mapProductToResource = (product: ProductItem): IResource => {
  return {
    id: product.id.toString(),
    image: product.thumbnailUrl || "",
    title: product.title,
    type: product.levelLabel,
    description: product.description,
    price: product.prices?.[0]?.price || 0,
    isFree: product.isFree,
    url: `/recursos/${product.slug}`,
    category: product.topic.charAt(0).toUpperCase() + product.topic.slice(1), // Capitalizar primera letra
    featured: product.highlighted || false,
    date: product.publishDate,
    downloads: product.downloads || 0,
    includeInSubscription: product.includeInSubscription,
    tags: product.tags || [],
    publishDate: product.publishDate,
    limitDate: product.limitDate,
    downloadLimit: product.downloadLimit,
    currentDownloads: product.currentDownloads,
    author: product.author ? {
      name: product.author.name
    } : undefined
  };
};

// Mapear productos del listado a recursos para la interfaz
const resourcesWithDownloads = productList.map(mapProductToResource);

// Categories for the filter selector
const categories = [
  { id: "todos", name: "Todos" },
  { id: "sueno", name: "Sueño" },
  { id: "lactancia", name: "Lactancia" },
  { id: "desarrollo", name: "Desarrollo" }
];

// Componente principal pero con Suspense
export default function ResourcesPage() {
  return (
    <Suspense fallback={<div className="text-center p-5">Cargando recursos...</div>}>
      <ResourcesContent />
    </Suspense>
  );
}

// Componente interno que usa useSearchParams
function ResourcesContent() {
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