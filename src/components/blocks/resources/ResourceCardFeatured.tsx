import Image from "next/image";
import NextLink from "components/reuseable/links/NextLink";
import { IResource } from "./ResourcesLayout";

interface ResourceCardFeaturedProps {
  resource: IResource;
}

export function ResourceCardFeatured({ resource }: ResourceCardFeaturedProps) {
  const { id, image, title, type, description, price, isFree, url, category, downloads = 0 } = resource;

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
            <div className="d-flex post-category text-line mb-3 justify-content-between">
              <span className="post-category text-purple">{category}</span>
              {isFree ? (
                <span className="badge bg-pale-green text-green rounded-pill d-flex align-items-center">Gratuito</span>
              ) : (
                <span className="text-primary fw-bold">{price}€</span>
              )}
            </div>
            <h2 className="post-title h3 mt-1 mb-3">
              <NextLink title={title} href={url} className="link-dark" />
            </h2>
          </div>

          <div className="post-content">
            <p>{description}</p>
          </div>
        </div>

        <div className="card-footer">
          <ul className="post-meta d-flex mb-0">
            <li className="post-date">
              <i className="uil uil-file-alt"></i>
              <span>{type}</span>
            </li>
            <li className="post-date ms-auto me-3">
              <i className="uil uil-download-alt"></i>
              <span>{downloads.toLocaleString()}</span>
            </li>
            <li className="post-comments">
              <NextLink 
                href={url}
                title={
                  <>
                    <i className="uil uil-file-search-alt"></i>
                    {isFree ? "Obtener" : "Ver detalles"}
                  </>
                }
                className="link-dark"
              />
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
} 