"use client";

import { FormEvent, useState } from "react";
import { ProductItem } from "../../../data/product-data";

interface ResourceDetailActionsProps {
  product: ProductItem;
}

export default function ResourceDetailActions({ product }: ResourceDetailActionsProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ name, email });
  };

  // Determinar precio basado en el formato principal
  const priceInfo = product.prices.find(p => p.format === product.primaryFormat);
  const price = priceInfo ? priceInfo.price : 0;
  const isFree = product.isFree || price === 0;

  return (
    <div className="col-lg-6">
      <div className="post-header mb-5">
        <h2 className="post-title display-5">
          <a href="#" className="link-dark">
            {product.title}
          </a>
        </h2>

        {/* Etiqueta de formato y tipo */}
        <div className="d-flex align-items-center mb-3">
          <span className="badge bg-pale-primary text-primary rounded-pill me-2">
            {product.levelLabel}
          </span>
          <span className="badge bg-pale-blue text-blue rounded-pill">
            {product.formatLabels.find(f => product.formats.indexOf(product.primaryFormat as any) >= 0) || product.primaryFormat}
          </span>
        </div>

        {/* Precio del producto */}
        <p className="price fs-20 mb-2">
          {isFree ? (
            <>
              <span className="amount text-primary">Gratis</span>
              {!product.includeInSubscription && (
                <span className="text-muted ms-2 text-decoration-line-through">
                  {price.toFixed(2)}€
                </span>
              )}
            </>
          ) : (
            <span className="amount">{price.toFixed(2)}€</span>
          )}
        </p>

        {product.includeInSubscription && (
          <div className="alert alert-blue alert-icon mb-4">
            <i className="uil uil-exclamation-circle"></i>
            <span>Este recurso está incluido en la <a href="/suscripcion" className="alert-link hover">suscripción premium</a></span>
          </div>
        )}
      </div>

      <p className="mb-6">
        {product.shortDescription}
      </p>

      {isFree ? (
        <div className="subscription-form">
          <h3 className="h4 mb-4">Descarga gratuita</h3>
          <p className="mb-4">Introduce tus datos para recibir este recurso directamente en tu correo. No enviaremos spam a tu bandeja de entrada.</p>
          
          <form onSubmit={handleFormSubmit} className="mb-3">
            <div className="form-floating mb-4">
              <input 
                id="name" 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nombre y apellidos" 
                className="form-control" 
                required 
              />
              <label htmlFor="name">Nombre y apellidos</label>
            </div>
            
            <div className="form-floating mb-4">
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email" 
                className="form-control" 
                required 
              />
              <label htmlFor="email">Email</label>
            </div>
            
            <button type="submit" className="btn btn-primary rounded-pill btn-icon btn-icon-start mb-2 w-100">
              <i className="uil uil-download-alt"></i> Descargar ahora
            </button>
          </form>
          
          <p className="text-muted fs-sm">
            Al descargar este recurso, recibirás ocasionalmente información sobre nuevos recursos y contenidos exclusivos que puedan ayudarte. Puedes darte de baja en cualquier momento.
          </p>
        </div>
      ) : (
        <div className="purchase-form mb-0">
          <button type="button" className="btn btn-primary rounded-pill btn-icon btn-icon-start w-100">
            <i className="uil uil-shopping-cart"></i> Comprar ahora
          </button>
          
          {product.includeInSubscription && (
            <div className="text-center mt-3">
              <span className="text-muted">o</span>
              <a href="/suscripcion" className="btn btn-soft-primary rounded-pill btn-sm mx-1">
                Acceder con suscripción
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 