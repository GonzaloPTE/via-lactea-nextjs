import Image from "next/image";
import NextLink from "../links/NextLink";

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
  downloads = 0
}: ResourceCardProps) {
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
        <div className="d-flex justify-content-between mb-2">
          <div className="badge bg-pale-blue text-blue rounded-pill fs-sm">{type}</div>
          {isFree ? (
            <div className="badge bg-pale-green text-green rounded-pill fs-sm d-flex align-items-center">Gratuito</div>
          ) : (
            <div className="text-primary fw-bold">{price}€</div>
          )}
        </div>

        <h4 className="card-title mb-3">
          <NextLink href={url} title={title} className="link-dark" />
        </h4>

        {description && <p className="card-text mb-4 text-truncate">{description}</p>}

        <div className="d-flex justify-content-between align-items-center">
          <NextLink 
            href={url} 
            className="btn btn-sm btn-primary rounded-pill"
            title={isFree ? "Obtener" : "Ver"}
          />
          <div className="text-muted fs-sm">
            <i className="uil uil-download-alt me-1"></i>
            {downloads.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
} 