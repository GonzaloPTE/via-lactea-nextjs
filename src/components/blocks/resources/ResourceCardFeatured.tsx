import Image from "next/image";
import NextLink from "components/reuseable/links/NextLink";
import { IResource } from "./ResourcesLayout";
import { UrgencyProgressBar } from "../../reuseable/UrgencyProgressBar";
import { useRouter } from "next/navigation";

interface ResourceCardFeaturedProps {
  resource: IResource & {
    author?: {
      name?: string;
    };
  };
}

export function ResourceCardFeatured({ resource }: ResourceCardFeaturedProps) {
  const router = useRouter();
  
  const { 
    id, 
    image, 
    title, 
    type, 
    description, 
    price, 
    isFree, 
    url, 
    category, 
    downloads = 0, 
    includeInSubscription = false,
    limitDate,
    downloadLimit,
    currentDownloads,
    tags = [],
    publishDate,
    author
  } = resource;

  // Limitar las etiquetas mostradas para evitar desbordamiento (mostrar máximo 4)
  const displayTags = tags.slice(0, 4);
  const hasMoreTags = tags.length > 4;
  
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
    <article className="post mb-12">
      <div className="card">
        <figure className="card-img-top overlay overlay-1 hover-scale">
          <NextLink href={url} title={
            <Image 
              width={960} 
              height={600} 
              src={image} 
              alt={title} 
              className="img-fluid" 
            />
          } />
          <span className="bg" />
          <figcaption>
            <h5 className="from-top mb-0 ">Ver detalles</h5>
          </figcaption>
        </figure>

        <div className="card-body">
          <div className="post-header">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h2 className="post-title h3 mb-0 pe-3" style={{ 
                maxWidth: '75%',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis'
              }}>
                <NextLink title={title} href={url} className="link-dark" />
              </h2>
              
              {/* Precio */}
              {isFree ? (
                <div className="d-flex align-items-baseline">
                  <span className="text-decoration-line-through text-danger me-2 fs-15">19.99€</span>
                  <span className="fs-24 fw-bold text-primary">0€</span>
                </div>
              ) : (
                <div className="d-flex align-items-baseline">
                  <span className="fs-24 fw-bold text-primary">{price.toFixed(2)}€</span>
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
          </div>

          <div className="post-content">
            <p>{description}</p>
          </div>

          {/* Barra de urgencia para recursos gratuitos con fecha límite */}
          {isFree && limitDate && downloadLimit && (
              <div className="mt-12 mb-4">
                <UrgencyProgressBar
                  currentDownloads={currentDownloads}
                  downloadLimit={downloadLimit}
                  limitDate={limitDate}
                />
              </div>
            )}
        </div>

        <div className="card-footer">
          <ul className="post-meta d-flex mb-3 align-items-center">
            <li className="post-date">
              {formattedDate && (
                <span className="d-flex align-items-center text-body">
                  <i className="uil uil-calendar-alt me-1"></i>
                  {formattedDate}
                  <span className="mx-2">•</span>
                  <i className="uil uil-download-alt me-1"></i>
                  {downloads.toLocaleString()}
                </span>
              )}
            </li>
            
            <li className="post-comments ms-auto">
              <NextLink 
                href={url}
                title={
                  isFree ? 
                  <><i className="uil uil-download-alt me-1"></i>Descargar</> : 
                  <><i className="uil uil-eye me-1"></i>Ver detalles</>
                }
                className={`btn ${isFree ? 'bg-primary text-white' : 'btn-primary text-white'} rounded-pill fw-bold px-3 py-2 d-flex align-items-center`}
              />
            </li>
          </ul>
          
          {/* Etiquetas del producto */}
          {displayTags.length > 0 && (
            <div className="d-flex flex-nowrap overflow-hidden" style={{ maxWidth: '100%' }}>
              {displayTags.map((tag, index) => (
                <a 
                  key={index}
                  href="#" 
                  onClick={(e) => handleTagClick(tag, e)}
                  className="text-muted fs-sm me-2 text-nowrap"
                >
                  <span className="text-primary fw-medium">#{tag}</span>
                </a>
              ))}
              {hasMoreTags && <span className="text-muted fs-sm">...</span>}
            </div>
          )}
        </div>
      </div>
    </article>
  );
} 