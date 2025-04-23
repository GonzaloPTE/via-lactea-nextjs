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
  onSortChange
}: ResourcesLayoutProps) {
  return (
    <div className="row gx-lg-8 gx-xl-12 mt-10">
      <div className="col-lg-8">
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

      {/* Sidebar */}
      <aside className="col-lg-4 sidebar mt-8 mt-lg-0">
        {sidebar || (
          <ResourcesSidebar 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onlyFree={onlyFree} 
            sortOption={sortOption}
            onCategoryChange={onCategoryChange}
            onFreeToggleChange={onFreeToggleChange}
            onSortChange={onSortChange}
          />
        )}
      </aside>
    </div>
  );
} 