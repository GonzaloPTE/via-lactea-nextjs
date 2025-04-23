import Image from "next/image";
import NextLink from "components/reuseable/links/NextLink";
import { IResource } from "./ResourcesLayout";
import { UrgencyProgressBar } from "../../reuseable/UrgencyProgressBar";

interface ResourceCardFeaturedProps {
  resource: IResource;
}

export function ResourceCardFeatured({ resource }: ResourceCardFeaturedProps) {
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
    currentDownloads
  } = resource;

  // Para depuración - verificar si los recursos gratuitos tienen datos de urgencia
  if (isFree) {
    console.log(`ResourceCardFeatured [${title}] - urgency data:`, { limitDate, downloadLimit, currentDownloads });
  }

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
            <h5 className="from-top mb-0">Ver detalles</h5>
          </figcaption>
        </figure>

        <div className="card-body">
          <div className="post-header">
            <div className="d-flex flex-wrap align-items-center mb-3 justify-content-between">
              <span className="badge bg-pale-purple text-purple rounded mb-2">{category}</span>
              <span className="badge bg-pale-blue text-blue rounded mb-2">{type}</span>
            </div>
            
            <h2 className="post-title h3 mt-1 mb-3">
              <NextLink title={title} href={url} className="link-dark" />
            </h2>

            <div className="d-flex justify-content-between align-items-center mb-3">
              {isFree ? (
                <div className="d-flex align-items-baseline">
                  <span className="text-decoration-line-through text-muted me-2 fs-15">19.99€</span>
                  <span className="fs-20 fw-bold text-primary">0€</span>
                </div>
              ) : (
                <div className="d-flex align-items-baseline">
                  <span className="fs-20 fw-bold text-primary me-2">{price.toFixed(2)}€</span>
                  {includeInSubscription && (
                    <span className="badge bg-pale-yellow text-yellow rounded-pill py-1 px-2 fs-sm">Incluido en suscripción</span>
                  )}
                </div>
              )}
            </div>
            
            {/* Barra de urgencia para recursos gratuitos con fecha límite */}
            {isFree && limitDate && downloadLimit && (
              <div className="mb-4">
                <UrgencyProgressBar
                  currentDownloads={currentDownloads}
                  downloadLimit={downloadLimit}
                  limitDate={limitDate}
                />
              </div>
            )}
          </div>

          <div className="post-content">
            <p>{description}</p>
          </div>
        </div>

        <div className="card-footer">
          <ul className="post-meta d-flex mb-0 align-items-center">
            <li className="post-date">
              <i className="uil uil-download-alt me-1"></i>
              <span>{downloads.toLocaleString()}</span>
            </li>
            
            <li className="post-comments ms-auto">
              <NextLink 
                href={url}
                title={
                  isFree ? "Obtener ahora" : "Ver detalles"
                }
                className={`btn ${isFree ? 'btn-success text-white' : 'btn-primary'} rounded-pill fw-bold px-3 py-2`}
              />
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
} 