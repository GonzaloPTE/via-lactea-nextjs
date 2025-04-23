import { Fragment, useId } from "react";
import NextLink from "components/reuseable/links/NextLink";
import Image from "next/image";
import { IResource } from "./ResourcesLayout";
import SocialLinks from "components/reuseable/SocialLinks";

export type SortOption = "relevance" | "newest" | "price-asc" | "price-desc";

// Definimos la interfaz de CategoryItem localmente
interface CategoryItem {
  id: string;
  name: string;
}

export interface ResourcesSidebarProps {
  categories: CategoryItem[];
  selectedCategory?: string;
  onlyFree?: boolean;
  sortOption?: SortOption;
  onCategoryChange?: (categoryId: string) => void;
  onFreeToggleChange?: (checked: boolean) => void;
  onSortChange?: (option: SortOption) => void;
  onTagChange?: (tag: string) => void;
  popularResources?: IResource[];
}

// Tags de ejemplo para los recursos
const resourceTags = [
  { id: "sueno-infantil", title: "Sueño infantil", url: "/recursos?tag=sueno-infantil" },
  { id: "lactancia", title: "Lactancia", url: "/recursos?tag=lactancia" },
  { id: "desarrollo", title: "Desarrollo", url: "/recursos?tag=desarrollo" },
  { id: "rutinas", title: "Rutinas", url: "/recursos?tag=rutinas" },
  { id: "recien-nacido", title: "Recién nacido", url: "/recursos?tag=recien-nacido" },
  { id: "alimentacion", title: "Alimentación", url: "/recursos?tag=alimentacion" },
  { id: "musica", title: "Música", url: "/recursos?tag=musica" },
  { id: "primer-ano", title: "Primer año", url: "/recursos?tag=primer-ano" }
];

// Recursos populares de ejemplo
const popularResourcesExample: IResource[] = [
  {
    id: "pop1",
    title: "Cómo manejar las tomas nocturnas",
    url: "/recursos/tomas-nocturnas",
    image: "/img/via-lactea/photos/recurso-mockup.jpg",
    downloads: 256,
    date: "2024-11-20",
    category: "Lactancia",
    isFree: true,
    price: 0,
    type: "Infografía"
  },
  {
    id: "pop2",
    title: "Señales tempranas de hambre",
    url: "/recursos/senales-hambre",
    image: "/img/via-lactea/photos/recurso-mockup.jpg",
    downloads: 320,
    date: "2025-01-18",
    category: "Lactancia",
    isFree: true,
    price: 0,
    type: "Infografía"
  },
  {
    id: "pop3",
    title: "Guía de Sueño - 0 a 6 meses",
    url: "/recursos/guia-sueno-0-6-meses",
    image: "/img/via-lactea/photos/recurso-mockup.jpg",
    downloads: 128,
    date: "2024-10-15",
    category: "Sueño",
    isFree: false,
    price: 19.99,
    type: "Guía PDF"
  }
];

export default function ResourcesSidebar({ 
  categories, 
  selectedCategory = "todos", 
  onlyFree = false,
  sortOption = "relevance",
  onCategoryChange,
  onFreeToggleChange,
  onSortChange,
  onTagChange,
  popularResources = popularResourcesExample
}: ResourcesSidebarProps) {
  // Función para normalizar strings (eliminar acentos y convertir a minúsculas)
  const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
  // Handler para el cambio de categoría
  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, categoryId: string) => {
    e.preventDefault();
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };
  
  // Handler para el toggle de recursos gratuitos
  const handleFreeToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFreeToggleChange) {
      onFreeToggleChange(e.target.checked);
    }
  };
  
  // Handler para el cambio de orden
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onSortChange) {
      onSortChange(e.target.value as SortOption);
    }
  };

  // Añadir función handleTagClick
  const handleTagClick = (e: React.MouseEvent<HTMLAnchorElement>, tag: string) => {
    e.preventDefault();
    if (onTagChange) {
      onTagChange(tag);
    }
  };

  // Generar IDs únicos para evitar conflictos en caso de múltiples instancias
  const checkboxId = useId();
  
  return (
    <Fragment>
      {/* About Us & Social Media */}
      <div className="widget">
        <h4 className="widget-title mb-3">Síguenos</h4>
        <p className="mb-3">
          Sigue nuestras redes sociales para acceder a la información más actualizada sobre lactancia y sueño infantil.
          Compartimos consejos, novedades y respondemos tus consultas.
        </p>
        
        <SocialLinks className="nav social" />
      </div>

      {/* Popular Resources section */}
      <div className="widget">
        <h4 className="widget-title mb-3">Descargas Populares</h4>

        <ul className="image-list">
          {popularResources.map(({ id, title, image, url, downloads, date }) => (
            <li key={id} className="mb-3">
              <NextLink 
                title={
                  <figure className="rounded">
                    <Image width={100} height={100} src={image} alt={title} className="img-fluid" />
                  </figure>
                } 
                href={url} 
              />

              <div className="post-content">
                <h6 className="mb-2">
                  <NextLink className="link-dark" title={title} href={url} />
                </h6>

                <ul className="post-meta">
                  <li className="post-date">
                    <i className="uil uil-calendar-alt" />
                    <span>{new Date(date || '').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </li>

                  <li className="post-comments">
                    <i className="uil uil-download-alt" /> 
                    <span>{downloads?.toLocaleString()}</span>
                  </li>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories Widget */}
      <div className="widget">
        <h4 className="widget-title mb-3">Categorías</h4>
        <ul className="unordered-list bullet-primary text-reset">
          {categories.map((category) => (
            <li key={category.id}>
              <a 
                href={`#${category.id}`} 
                className={normalizeString(selectedCategory) === normalizeString(category.id) ? "text-primary" : ""}
                onClick={(e) => handleCategoryClick(e, category.id)}
              >
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Filter Toggles */}
      <div className="widget">
        <h4 className="widget-title mb-3">Filtros</h4>
        <div className="form-check mb-2">
          <input 
            className="form-check-input" 
            type="checkbox" 
            id={`checkFree-${checkboxId}`} 
            checked={onlyFree}
            onChange={handleFreeToggleChange}
          />
          <label className="form-check-label" htmlFor={`checkFree-${checkboxId}`}>
            Solo recursos gratuitos
          </label>
        </div>
        
        {/* Botón para borrar filtros */}
        <button 
          className="btn btn-sm btn-outline-primary rounded-pill mt-3 w-100"
          onClick={() => {
            // Reiniciar todos los filtros
            if (onCategoryChange) onCategoryChange('todos');
            if (onFreeToggleChange) onFreeToggleChange(false);
            if (onSortChange) onSortChange('relevance');
            if (onTagChange) onTagChange('');
          }}
        >
          <i className="uil uil-filter-slash me-1"></i> Borrar filtros
        </button>
      </div>

      {/* Sorting Options */}
      <div className="widget">
        <h4 className="widget-title mb-3">Ordenar por</h4>
        <div className="form-select-wrapper">
          <select 
            className="form-select" 
            aria-label="Ordenar recursos"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="relevance">Relevancia</option>
            <option value="newest">Más recientes</option>
            <option value="price-asc">Precio: Menor a mayor</option>
            <option value="price-desc">Precio: Mayor a menor</option>
          </select>
        </div>
      </div>

      {/* Tags section */}
      <div className="widget">
        <h4 className="widget-title mb-3">Etiquetas</h4>
        <ul className="list-unstyled tag-list">
          {resourceTags.map(({ id, title, url }) => (
            <li key={id} className="d-inline-block me-1 mb-2">
              <NextLink 
                title={title} 
                href={url} 
                className="btn btn-soft-ash btn-sm rounded-pill" 
                onClick={(e: any) => handleTagClick(e, title)}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Subscribe Banner */}
      <div className="widget">
        <div className="card shadow-lg">
          <div className="card-body p-6">
            <div className="d-flex flex-row">
              <div>
                <span className="icon btn btn-circle btn-sm btn-primary pe-none me-4">
                  <i className="uil uil-star"></i>
                </span>
              </div>
              <div>
                <h4 className="mb-1">Suscripción Premium</h4>
                <p className="mb-0">Accede a todos los recursos con nuestra suscripción mensual.</p>
                <NextLink 
                  href="/suscripcion" 
                  title="Saber más" 
                  className="more hover link-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
} 