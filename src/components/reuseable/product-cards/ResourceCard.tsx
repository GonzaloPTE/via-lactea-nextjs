"use client";

import Image from "next/image";
import NextLink from "../links/NextLink";
import { UrgencyProgressBar } from "../../reuseable/UrgencyProgressBar";
import { useRouter } from "next/navigation";

// =======================================================================================
interface ResourceCardProps {
  id: string;
  image: string;
  title: string;
  type: string;
  description?: string;
  price: number;
  isFree?: boolean;
  url: string;
  downloads?: number;
  category?: string;
  includeInSubscription?: boolean;
  limitDate?: string;
  downloadLimit?: number;
  currentDownloads?: number;
  tags?: string[];
  publishDate?: string;
  author?: {
    name?: string;
  };
}
// =======================================================================================

export default function ResourceCard({
  id,
  image,
  title,
  type,
  description,
  price,
  isFree = false,
  url,
  downloads = 0,
  category = "",
  includeInSubscription = false,
  limitDate,
  downloadLimit,
  currentDownloads,
  tags = [],
  publishDate,
  author
}: ResourceCardProps) {
  const router = useRouter();

  // Limitar las etiquetas mostradas para evitar desbordamiento (mostrar máximo 3)
  const displayTags = tags.slice(0, 3);
  const hasMoreTags = tags.length > 3;
  
  // Manejar clic en una etiqueta
  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    // Redirigir a la página de recursos con el filtro de tag aplicado
    router.push(`/recursos?tag=${encodeURIComponent(tag)}`);
  };

  // Formatear fecha de publicación
  const formattedDate = publishDate ? new Date(publishDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : null;

  return (
    <div className="card shadow-sm h-100">
      <figure className="card-img-top overflow-hidden">
        <NextLink href={url} title={
          <Image 
            width={600} 
            height={400} 
            src={image} 
            alt={title} 
            className="img-fluid w-100"
            style={{ height: "200px", objectFit: "cover" }}
          />
        } />
      </figure>

      <div className="card-body p-5 d-flex flex-column" style={{ height: "calc(100% - 200px)" }}>
        {/* Sección superior con contenido variable */}
        <div className="mb-auto">
          {/* Sección de título y precio */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h4 className="card-title mb-0 pe-3" style={{ 
              maxWidth: '75%',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis'
            }}>
              <NextLink href={url} title={title} className="link-dark" />
            </h4>
            
            {/* Precio */}
            {isFree ? (
              <div className="d-flex align-items-baseline">
                <span className="text-decoration-line-through text-danger me-2 fs-15">19.99€</span>
                <span className="fs-22 fw-bold text-primary">0€</span>
              </div>
            ) : (
              <div className="d-flex align-items-baseline">
                <span className="fs-22 fw-bold text-primary">{price.toFixed(2)}€</span>
              </div>
            )}
          </div>

          {/* Tipo de producto y categoría */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            {type && (
              <h6 className="mb-0">{type.toUpperCase()}</h6>
            )}
            
            {category && (
              <span className="fs-sm">{category}</span>
            )}
          </div>

          {/* Autor */}
          {author?.name && (
            <h6 className="text-body mb-3">
              Autor: {author.name}
            </h6>
          )}

          {description && (
            <p className="card-text mb-4" style={{ 
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis'
            }}>
              {description}
            </p>
          )}
        </div>
        
        {/* Sección intermedia con barra de urgencia y botón */}
        <div className="mb-4">
          {/* Barra de urgencia para recursos gratuitos con fecha límite */}
          {isFree && limitDate && downloadLimit && (
            <div className="mb-3">
              <UrgencyProgressBar
                currentDownloads={currentDownloads}
                downloadLimit={downloadLimit}
                limitDate={limitDate}
              />
            </div>
          )}
          
          {/* Botón de descarga o ver detalles */}
          <div className="d-flex justify-content-center">
            <NextLink 
              href={url} 
              className={`btn ${isFree ? 'bg-primary text-white' : 'btn-primary text-white'} rounded-pill fw-bold px-3 py-2 d-flex align-items-center`}
              title={isFree ? 
                <><i className="uil uil-download-alt me-1"></i> Descargar</> : 
                <><i className="uil uil-eye me-1"></i> Ver detalles</>
              }
            />
          </div>
        </div>
        
        {/* Sección inferior siempre al final */}
        <div className="mt-3">
          {/* Fecha y descargas juntas */}
          <div className="d-flex align-items-center mb-2">
            {formattedDate && (
              <div className="fs-sm d-flex align-items-center">
                <i className="uil uil-calendar-alt me-1"></i>
                {formattedDate}
                <span className="mx-2">•</span>
                <i className="uil uil-download-alt me-1"></i>
                {downloads.toLocaleString()}
              </div>
            )}
          </div>

          {/* Etiquetas */}
          {displayTags.length > 0 && (
            <div className="d-flex flex-nowrap overflow-hidden" style={{ maxWidth: '100%' }}>
              {displayTags.map((tag, index) => (
                <a 
                  key={index}
                  href="#" 
                  onClick={(e) => handleTagClick(tag, e)}
                  className="fs-sm me-2 text-nowrap"
                >
                  <span className="text-primary fw-medium">#{tag}</span>
                </a>
              ))}
              {hasMoreTags && <span className="text-muted fs-sm">...</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 