import { ReactNode } from "react";
import Image from "next/image";
import Pagination from "components/reuseable/Pagination";
import ResourcesSidebar, { SortOption } from "./ResourcesSidebar";
import ResourceCard from "components/reuseable/product-cards/ResourceCard";
import { ResourceCardFeatured } from "./ResourceCardFeatured";

// Tipos para los recursos
export interface IResource {
  id: string;
  image: string;
  title: string;
  type: string;
  description?: string;
  price: number;
  isFree?: boolean;
  url: string;
  category: string;
  date?: string;
  featured?: boolean;
  downloads?: number; // Número de descargas del recurso
  includeInSubscription?: boolean; // Indicador de si está incluido en la suscripción
  tags?: string[]; // Etiquetas relacionadas con el recurso
  limitDate?: string; // Fecha límite para descarga gratuita
  downloadLimit?: number; // Límite de descargas antes de dejar de ser gratuito
  currentDownloads?: number; // Número actual de descargas (para el sistema de urgencia)
}

interface ResourcesLayoutProps {
  featuredResources: IResource[];
  resources: IResource[];
  categories: { id: string; name: string }[];
  selectedCategory?: string;
  onlyFree?: boolean;
  sortOption?: SortOption;
  sidebar?: ReactNode;
  onCategoryChange?: (category: string) => void;
  onFreeToggleChange?: (checked: boolean) => void;
  onSortChange?: (option: SortOption) => void;
  onTagChange?: (tag: string) => void;
}

export default function ResourcesLayout({
  featuredResources,
  resources,
  categories,
  selectedCategory = "todos",
  onlyFree = false,
  sortOption = "relevance",
  sidebar,
  onCategoryChange,
  onFreeToggleChange,
  onSortChange,
  onTagChange
}: ResourcesLayoutProps) {
  return (
    <div className="row gx-lg-8 gx-xl-12 mt-10">
      {/* Sidebar - Ahora a la izquierda */}
      <aside className="col-lg-4 sidebar mt-8 mt-lg-0 order-lg-1">
        {sidebar || (
          <ResourcesSidebar 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onlyFree={onlyFree} 
            sortOption={sortOption}
            onCategoryChange={onCategoryChange}
            onFreeToggleChange={onFreeToggleChange}
            onSortChange={onSortChange}
            onTagChange={onTagChange}
          />
        )}
      </aside>

      {/* Contenido principal - Ahora a la derecha */}
      <div className="col-lg-8 order-lg-2">
        {/* Featured Resources Section */}
        {featuredResources && featuredResources.length > 0 && (
          <div className="blog classic-view mb-10">
            {featuredResources.map((resource) => (
              <ResourceCardFeatured key={resource.id} resource={resource} />
            ))}
          </div>
        )}

        {/* Main Resources Grid */}
        <div className="blog grid grid-view">
          <div className="row isotope gx-md-8 gy-8 mb-8">
            {resources.map((resource) => (
              <div className="col-md-6" key={resource.id}>
                <ResourceCard {...resource} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {resources.length > 0 && (
          <Pagination className="justify-content-start" altStyle />
        )}
      </div>
    </div>
  );
} 