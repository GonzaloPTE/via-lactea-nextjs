"use client";

import Link from "next/link";
import { ServiceItem } from "data/service-data";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
import ListColumn from "components/reuseable/ListColumn";

interface ServiceCardProps {
  service: ServiceItem | undefined;
  variant?: 'full' | 'half';
  isReversed?: boolean;
  colorClass?: string;
}

const ServiceCard = ({ 
  service, 
  variant = 'full', 
  isReversed = false,
  colorClass = 'violet'
}: ServiceCardProps) => {
  // Safety checks for undefined service
  const title = service?.title || 'Servicio';
  const categoryLabel = service?.categoryLabel || '0-6 meses';
  const shortDescription = service?.shortDescription || 'Descripción del servicio';
  const price = service?.price || 0;
  const heroImageUrl = service?.heroImageUrl || '/img/photos/cs16.jpg';
  const slug = service?.slug || '';
  const forWho = service?.forWho || ['Este servicio es para ti'];
  
  // Format forWho for ListColumn (single column)
  const formatForWho = (): string[][] => {
    // forWho is already an array of strings, so we just need to wrap it in another array
    // to make it a single column for ListColumn
    return [Array.isArray(forWho) ? forWho : [String(forWho)]];
  };
  
  // Full width card (standard layout)
  return (
    <div className={`card bg-soft-${colorClass} mb-10`}>
      <div className="card-body p-12 pb-0">
        <div className="row">
          {isReversed ? (
            <>
              <div className="col-lg-7 align-self-end mb-14">
                <figure>
                  <img className="img-fluid" src={heroImageUrl} alt={title} />
                </figure>
              </div>
              <div className="col-lg-4 offset-lg-1 pb-12 align-self-center order-lg-2">
                <div className={`post-category mb-3 text-${colorClass}`}>{categoryLabel}</div>
                
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h3 className="h1 post-title mb-0">{title}</h3>
                </div>
                <div className={`fs-40 fw-bold text-${colorClass} my-2 `}>{price}€</div>
                
                <p>{shortDescription}</p>
                
                {forWho && forWho.length > 0 && (
                  <div className="mb-4">
                    <h6 className="mb-3">¿Para quién es?</h6>
                    <ListColumn
                      list={formatForWho()}
                      bulletColor={colorClass}
                      colWidth="col-12"
                    />
                  </div>
                )}
                
                <div className="d-flex align-items-center gap-3 mt-8 justify-content-end">
                  <Link 
                    href={`/servicios/${slug}`} 
                    className={`btn btn-outline-${colorClass} rounded-pill`}
                  >
                    Saber más <span className="ms-2">→</span>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="col-lg-4 pb-12 align-self-center">
                <div className={`post-category mb-3 text-${colorClass}`}>{categoryLabel}</div>
                
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h3 className="h1 post-title mb-0">{title}</h3>
                </div>
                <div className={`fs-40 fw-bold text-${colorClass} my-2 `}>{price}€</div>

                
                
                <p>{shortDescription}</p>
                
                {forWho && forWho.length > 0 && (
                  <div className="mb-4">
                    <h6 className="mb-3">¿Para quién es?</h6>
                    <ListColumn
                      list={formatForWho()}
                      bulletColor={colorClass}
                      colWidth="col-12"
                    />
                  </div>
                )}
                
                <div className="d-flex align-items-center gap-3 mt-8">
                  <Link 
                    href={`/servicios/${slug}`} 
                    className={`btn btn-outline-${colorClass} rounded-pill`}
                  >
                    Saber más <span className="ms-2">→</span>
                  </Link>
                </div>
              </div>
              <div className="col-lg-7 offset-lg-1 align-self-end mb-14">
                <figure>
                  <img className="img-fluid" src={heroImageUrl} alt={title} />
                </figure>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard; 