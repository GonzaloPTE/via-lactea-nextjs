"use client";

import clsx from "clsx";
import { useState, useRef, useEffect } from "react";

// Helper function to get initials
const getInitials = (name: string): string => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  } else if (parts.length === 1 && parts[0].length > 0) {
    return parts[0][0].toUpperCase();
  }
  return '?';
};

// Helper function to get a color based on name (simple hashing)
const nameToColor = (name: string): string => {
  const colors = ['bg-primary', 'bg-grape', 'bg-green', 'bg-orange', 'bg-red', 'bg-pink', 'bg-violet', 'bg-yellow', 'bg-aqua', 'bg-leaf'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

// =================================================
interface ViaLacteaTestimonialCardProps {
  name: string;
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

  // Get initials and color
  const initials = getInitials(name);
  const bgColorClass = nameToColor(name);

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
            {/* Avatar con iniciales */}
            <div className={clsx(
              "testimonial-avatar rounded-circle d-flex align-items-center justify-content-center text-white me-3",
              bgColorClass
            )} style={{ width: '3rem', height: '3rem' }}>
              <span className="fs-18 fw-bold">{initials}</span>
            </div>
            {/* Fin Avatar con iniciales */}
            
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