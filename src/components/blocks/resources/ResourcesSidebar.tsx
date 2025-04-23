import { Fragment, useId } from "react";
import NextLink from "components/reuseable/links/NextLink";

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
}

export default function ResourcesSidebar({ 
  categories, 
  selectedCategory = "todos", 
  onlyFree = false,
  sortOption = "relevance",
  onCategoryChange,
  onFreeToggleChange,
  onSortChange
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

  // Generar IDs únicos para evitar conflictos en caso de múltiples instancias
  const checkboxId = useId();
  
  return (
    <Fragment>
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