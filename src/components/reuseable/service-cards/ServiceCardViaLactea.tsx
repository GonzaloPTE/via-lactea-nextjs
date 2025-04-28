import NextLink from "../links/NextLink";
import Image from "next/image";
import Link from "next/link";

import { LinkType } from "types/demo-1";

// ===============================================================
interface ServiceCardViaLacteaProps {
  title: string;
  linkUrl: string;
  linkType: LinkType;
  description: string;
  heroImageUrl: string;
  cardClassName?: string;
  color?: string;
}
// ===============================================================

export default function ServiceCardViaLactea({
  title,
  linkUrl,
  linkType,
  description,
  heroImageUrl,
  cardClassName = "",
  color
}: ServiceCardViaLacteaProps) {
  const bgColorClass = color ? `bg-soft-${color}` : 'bg-soft-primary';

  return (
    <div className="col-md-6 col-lg-3 col-xl-3 d-flex">
      <div className={`card shadow-xl ${cardClassName} h-100 w-100 border border-gray-200 border-start-0 border-end-0 border-bottom border-top-0 border-5 border-${color || 'primary'}`}>
        <Link href={linkUrl} className="card-img-top overlay overlay-1 hover-scale group d-block">
          <figure className={`m-0 ${bgColorClass}`}>
            <Image 
              src={heroImageUrl}
              alt={title}
              width={400}
              height={250}
              style={{ width: '100%', height: 'auto' }}
            />
            <figcaption className="bg-dark bg-opacity-50 p-3 group-hover:bg-black/30 transition-all duration-300">
              <h5 className="from-top mb-0 text-white">Saber más</h5>
            </figcaption>
          </figure>
        </Link>

        <div className="card-body p-6 d-flex flex-column">
          <h5 className="mb-1">{title}</h5>
          <p className="mb-2">{description}</p>
          <NextLink title="Ver Detalles" href={linkUrl} className={`more hover link-${linkType} mt-auto`} />
        </div>
      </div>
    </div>
  );
}
