"use client";

import Image from "next/image";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";

// =================================================
interface ViaLacteaTestimonialCardProps {
  name: string;
  image?: string;
  review: string;
  shadow?: boolean;
  designation: string;
  hideRating?: boolean;
  onToggleExpand?: (isExpanded: boolean) => void;
  isFullWidth?: boolean;
}
// =================================================

export default function ViaLacteaTestimonialCard({
  name,
  image,
  review,
  shadow,
  hideRating,
  designation,
  onToggleExpand,
  isFullWidth = false
}: ViaLacteaTestimonialCardProps) {
  // Estado para controlar si el testimonio está expandido
  const [expanded, setExpanded] = useState(false);
  
  // Referencia para la tarjeta
  const cardRef = useRef<HTMLDivElement>(null);

  // Truncar el texto si es necesario
  const maxLength = 150;
  const needsTruncation = review.length > maxLength;
  const isTruncated = needsTruncation && !expanded;
  const displayText = isTruncated 
    ? `${review.substring(0, maxLength)}...` 
    : review;

  // Placeholder default image
  const defaultImage = "/img/avatars/avatar.jpg";
  const imageSource = image && image.trim() !== "" ? image : defaultImage;

  // Sincronizar estado expandido con la propiedad isFullWidth
  useEffect(() => {
    if (isFullWidth !== expanded) {
      setExpanded(isFullWidth);
    }
  }, [isFullWidth, expanded]);

  // Manejar cambio de estado expandido
  const handleExpandToggle = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    
    // Notificar al componente padre sobre el cambio
    if (onToggleExpand) {
      onToggleExpand(newExpandedState);
    }
    
    if (newExpandedState) {
      // Al expandir, dar tiempo para que se renderice y hacer scroll
      setTimeout(() => {
        const card = cardRef.current;
        if (card) {
          const rect = card.getBoundingClientRect();
          if (rect.top < 0) {
            // Si la tarjeta está por encima del viewport, hacer scroll a ella
            window.scrollTo({
              top: window.scrollY + rect.top - 20,
              behavior: 'smooth'
            });
          }
        }
      }, 50);
    }
  };

  return (
    <div 
      ref={cardRef}
      className={clsx(
        "card testimonial-card", 
        { "shadow-lg": shadow },
        { "testimonial-expanded": expanded },
        { "testimonial-full-width": isFullWidth }
      )}
    >
      <div className="card-body">
        {hideRating ? null : <span className="ratings five mb-3" />}

        <blockquote className="icon mb-0">
          <div className="testimonial-text-container">
            <p>"{displayText}"</p>
          </div>
          
          {needsTruncation && (
            <div className="read-more-container">
              <button 
                onClick={handleExpandToggle}
                className="read-more-btn"
              >
                {expanded ? "Leer menos" : "Leer más"}
              </button>
            </div>
          )}

          <div className="testimonial-details mt-3">
            <figure className="rounded-circle w-12 overflow-hidden">
              <Image 
                alt={`Testimonio de ${name}`} 
                width={100} 
                height={100} 
                src={imageSource}
                className="w-100 h-auto" 
              />
            </figure>

            <div className="info">
              <h5 className="mb-0">{name}</h5>
              <p className="mb-0">{designation}</p>
            </div>
          </div>
        </blockquote>
      </div>
    </div>
  );
} 