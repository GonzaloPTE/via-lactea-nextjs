import Image from "next/image";
import NextLink from "../links/NextLink";
import { UrgencyProgressBar } from "../../reuseable/UrgencyProgressBar";

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
  currentDownloads
}: ResourceCardProps) {
  // Para depuración - verificar si los recursos gratuitos tienen datos de urgencia
  if (isFree) {
    console.log(`ResourceCard [${title}] - urgency data:`, { limitDate, downloadLimit, currentDownloads });
  }

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

      <div className="card-body p-5">
        {/* Sección de badges y categoría */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          {category && (
            <span className="badge bg-pale-purple text-purple rounded">{category}</span>
          )}
          <span className="badge bg-pale-blue text-blue rounded">{type}</span>
        </div>

        <h4 className="card-title mb-3">
          <NextLink href={url} title={title} className="link-dark" />
        </h4>

        {description && <p className="card-text mb-4 text-truncate">{description}</p>}

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

        <div className="d-flex flex-column gap-2 mt-auto">
          {/* Precio o badge gratuito */}
          {isFree ? (
            <div className="d-flex align-items-baseline mb-2">
              <span className="text-decoration-line-through text-muted me-2 fs-15">19.99€</span>
              <span className="fs-18 fw-bold text-primary">0€</span>
            </div>
          ) : (
            <div className="d-flex align-items-baseline mb-2">
              <span className="fs-18 fw-bold text-primary me-2">{price.toFixed(2)}€</span>
              {includeInSubscription && (
                <span className="badge bg-pale-yellow text-yellow rounded-pill py-1 px-2 fs-sm">Incluido en suscripción</span>
              )}
            </div>
          )}

          {/* Botones y contador de descargas */}
          <div className="d-flex justify-content-between align-items-center">
            <NextLink 
              href={url} 
              className={`btn ${isFree ? 'bg-primary text-white' : 'btn-primary'} rounded-pill fw-bold px-3 py-2 d-flex align-items-center`}
              title={isFree ? 
                <><i className="uil uil-download-alt me-1"></i> Descargar</> : 
                "Ver detalles"
              }
            />
            <div className="text-muted">
              <i className="uil uil-download-alt me-1"></i>
              {downloads.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 