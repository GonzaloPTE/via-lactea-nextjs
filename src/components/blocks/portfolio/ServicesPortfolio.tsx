"use client";

import { getServicesByCategory, serviceCategories } from "data/service-data";
import ServiceCard from "components/reuseable/service-cards/ServiceCard";

// Main component
const ServicesPortfolio = () => {
  // Get categories and their labels from service-data.ts
  const categoryMappings = {
    baby: serviceCategories.find(cat => cat.id === 'baby')?.label || '0-6 meses',
    child: serviceCategories.find(cat => cat.id === 'child')?.label || '6 meses a 6 años',
    general: serviceCategories.find(cat => cat.id === 'general')?.label || 'Servicios generales'
  };

  // Get services by category
  const babyServices = getServicesByCategory('baby');
  const childServices = getServicesByCategory('child');
  const generalServices = getServicesByCategory('general');

  return (
    <section className="wrapper bg-light wrapper-border">
      <div className="container py-7 py-md-8">
        <div className="row mb-8">
           <div className="col-lg-10 mx-auto text-center">
             <h1 className="fs-16 text-uppercase text-primary mb-3">Servicios y Tarifas</h1>
             <h2 className="display-4 mb-3">Planes de Sueño Infantil <span className="underline-3 style-2 grape">Respetuosos</span> y de Lactancia</h2>
           </div>
        </div>

        {/* 0-6 MESES */}
        {babyServices.length > 0 && (
          <>
            <div className="row mb-5">
              <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-6">
                 {/* PASO 2a: Cambiar H2 a H3 */}
                <h3 className="fs-15 text-uppercase text-grape mb-3">{categoryMappings.baby}</h3>
                 {/* PASO 2b: Cambiar H3 a H4 */}
                <h4 className="display-4 mb-5">Asesorías para bebés recién nacidos</h4>
              </div>
            </div>

            {/* Baby services */}
            {babyServices.map((service, index) => (
              <ServiceCard 
                key={service.id}
                service={service} 
                isReversed={index % 2 !== 0}
                colorClass={service.color || (index % 2 === 0 ? "grape" : "violet")}
              />
            ))}
          </>
        )}

        {/* 6 MESES A 6 AÑOS */}
        {childServices.length > 0 && (
          <>
            <div className="row mt-15 mb-5">
              <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-6">
                <h3 className="fs-15 text-uppercase text-blue mb-3">{categoryMappings.child}</h3>
                <h4 className="display-4 mb-5">Planes de sueño infantil respetuoso</h4>
              </div>
            </div>

            {/* Child services */}
            {childServices.map((service, index) => (
              <ServiceCard 
                key={service.id}
                service={service} 
                isReversed={index % 2 !== 0}
                colorClass={service.color || ["blue", "sky", "yellow", "red"][index % 4]}
              />
            ))}
          </>
        )}

        {/* SERVICIOS GENERALES */}
        {generalServices.length > 0 && (
          <>
            <div className="row mt-5 mb-5">
              <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-6">
                <h3 className="fs-15 text-uppercase text-leaf mb-3">{categoryMappings.general}</h3>
                <h4 className="display-4 mb-5">Valoraciones, consultas SOS y otros servicios complementarios</h4>
              </div>
            </div>

            {/* General services */}
            {generalServices.map((service, index) => (
              <ServiceCard 
                key={service.id}
                service={service} 
                isReversed={index % 2 !== 0}
                colorClass={service.color || ["green", "orange", "aqua", "purple"][index % 4]}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default ServicesPortfolio;

