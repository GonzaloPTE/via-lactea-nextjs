"use client";

import { getServicesByCategory, serviceCategories } from "data/service-data";
import ServiceCard from "components/reuseable/service-cards/ServiceCard";

// Main component
const ServicesPortfolio = () => {
  // Get categories and their labels from service-data.ts
  const categoryMappings = {
    baby: serviceCategories.find(cat => cat.id === 'baby')?.label || '0-6 meses',
    child: serviceCategories.find(cat => cat.id === 'child')?.label || '6 meses a 4 años',
    general: serviceCategories.find(cat => cat.id === 'general')?.label || 'Servicios generales'
  };

  // Get services by category
  const babyServices = getServicesByCategory('baby');
  const childServices = getServicesByCategory('child');
  const generalServices = getServicesByCategory('general');

  return (
    <section className="wrapper bg-light wrapper-border">
      <div className="container py-7 py-md-8">
        {/* 0-6 MESES */}
        {babyServices.length > 0 && (
          <>
            <div className="row mb-5">
              <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-6">
                <h2 className="fs-15 text-uppercase text-grape mb-3">{categoryMappings.baby}</h2>
                <h3 className="display-4 mb-5">Asesoría para bebés recién nacidos</h3>
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

        {/* 6 MESES A 4 AÑOS */}
        {childServices.length > 0 && (
          <>
            <div className="row mt-15 mb-5">
              <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-6">
                <h2 className="fs-15 text-uppercase text-blue mb-3">{categoryMappings.child}</h2>
                <h3 className="display-4 mb-5">Planes de sueño infantil</h3>
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
                <h2 className="fs-15 text-uppercase text-leaf mb-3">{categoryMappings.general}</h2>
                <h3 className="display-4 mb-5">Otras asesorías complementarias</h3>
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

