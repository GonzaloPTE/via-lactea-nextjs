'use client';

import { Fragment } from "react";
import ServiceCardViaLactea from "components/reuseable/service-cards/ServiceCardViaLactea";
// import LightBulb from 'icons/lineal/LightBulb'; // No longer needed
import { LinkType } from "types/demo-1";

// Importamos los datos y tipos de servicios de Vía Láctea
import { serviceList, serviceCategories, ServiceItem } from "../../../data/service-data";

export default function ViaLacteaServices() {

  // Agrupar servicios por categoría
  const groupedServices = serviceCategories.map(category => ({
    ...category,
    services: serviceList.filter(service => service.category === category.id)
  }));

  return (
    <section className="wrapper bg-white">
      <div className="container pt-20 pb-15">
        <div className="row text-center mb-10">
          <div className="col-lg-9 col-xl-10 col-xxl-10 mx-auto">
            <h2 className="fs-16 text-uppercase text-primary mb-3">Nuestros Servicios</h2>
            <h3 className="display-4 mb-3">Acompañamiento profesional para cada etapa</h3>
          </div>
        </div>

        {groupedServices.map((group) => {
          // No renderizar la sección si no hay servicios en esa categoría
          if (group.services.length === 0) return null;

          return (
            <Fragment key={group.id}>
              <div className="row text-center mt-10 mb-5">
                 <div className="col-lg-9 col-xl-8 col-xxl-7 mx-auto">
                  {/* Título de la categoría */}
                  <h3 className="display-5 mb-0 text-primary">{group.label}</h3>
                  <p>{group.description}</p>
                </div>
              </div>

              {/* Grid de servicios para la categoría */}
              {/* Ajuste de gy (gap y) para dar más espacio vertical entre cards */}
              <div className="row gx-md-8 gy-8 text-center justify-content-center"> 
                {group.services.map((service: ServiceItem) => (
                  <ServiceCardViaLactea
                    key={service.id}
                    title={service.title}
                    description={service.shortDescription} 
                    linkUrl={`/servicios/${service.slug}`} 
                    linkType={LinkType.violet} // Using default as color mapping is complex
                    heroImageUrl={service.heroImageUrl} // Pass the actual image URL
                    color={service.color} // Pass the color prop
                  />
                ))}
              </div>
            </Fragment>
          );
        })}
      </div>
    </section>
  );
} 