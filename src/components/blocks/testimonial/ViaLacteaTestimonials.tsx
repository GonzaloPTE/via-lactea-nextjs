"use client";

import { useEffect, useState } from "react";
import ViaLacteaTestimonialCard from "components/reuseable/testimonial-cards/ViaLacteaTestimonialCard";
// CUSTOM DATA
import { viaLacteaTestimonials } from "../../../data/via-lactea-testimonials";

export default function ViaLacteaTestimonials() {
  // Estado para controlar qué testimonio está expandido
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Manejar cuando un testimonio se expande o contrae
  const handleTestimonialToggle = (id: number, isExpanded: boolean) => {
    setExpandedId(isExpanded ? id : null);
  };

  return (
    <section className="wrapper bg-soft-primary">
      <div className="container pt-14 pt-md-17 mb-n14 mb-md-n17">
        <div className="row mt-md-n25">
          <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2 mx-auto text-center">
            <h2 className="fs-15 text-uppercase text-primary mb-3">Testimonios de clientes</h2>
            <h3 className="display-4 mb-10 px-xl-10 px-xxl-15">
              Descubre lo que las familias dicen sobre nuestra asesoría
            </h3>
          </div>
        </div>

        {/* Grid adaptativo con flexbox */}
        <div className="row">
          {viaLacteaTestimonials.map((item) => (
            <div 
              className={`col-md-6 col-xl-4 mb-4 px-2 ${expandedId && expandedId !== item.id ? 'd-none d-md-block' : ''}`} 
              key={item.id}
              style={{ 
                transition: 'all 0.3s ease',
                ...(expandedId === item.id ? { 
                  flex: '0 0 100%', 
                  maxWidth: '100%', 
                  zIndex: 10,
                } : {})
              }}
            >
              <ViaLacteaTestimonialCard 
                {...item} 
                shadow 
                onToggleExpand={(isExpanded) => handleTestimonialToggle(item.id, isExpanded)}
                isFullWidth={expandedId === item.id}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 