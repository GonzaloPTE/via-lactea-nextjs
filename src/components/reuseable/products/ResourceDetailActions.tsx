"use client";

import { FormEvent, useState } from "react";
import { ProductItem } from "../../../data/product-data";
import { UrgencyProgressBar } from "../UrgencyProgressBar";

interface ResourceDetailActionsProps {
  product: ProductItem;
}

export default function ResourceDetailActions({ product }: ResourceDetailActionsProps) {
  const [email, setEmail] = useState("");
  
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ email });
    // Aquí iría la lógica para procesar la descarga
  };

  // Determinar precio basado en el formato principal
  const priceInfo = product.prices.find(p => p.format === product.primaryFormat);
  const price = priceInfo ? priceInfo.price : 0;
  const isFree = product.isFree || price === 0;

  return (
    <>
      <div className="post-header mb-5">
        <h2 className="post-title display-5">
          {product.title}
        </h2>

        {/* Formato y precio en la misma línea */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="text-muted text-uppercase">
            {(product.formatLabels?.find((f: string) => product.formats?.indexOf(product.primaryFormat as any) >= 0) || product.primaryFormat).toUpperCase()}
          </h5>
          
          <h5 className="price mb-0">
            {isFree ? (
              <div className="d-flex align-items-baseline">
                <span className="text-decoration-line-through text-danger me-2 fs-20">
                  {product.prices?.find((p: {format: string, price: number}) => p.format === product.primaryFormat)?.price.toFixed(2)}€
                </span>
                <span className="amount text-primary fs-30">Gratis</span>
              </div>
            ) : (
              <span className="amount text-primary fs-30">
                {product.prices?.find((p: {format: string, price: number}) => p.format === product.primaryFormat)?.price.toFixed(2)}€
              </span>
            )}
          </h5>
        </div>
        <h6 className="text-body">
          Autor: {product.author?.name || 'Miriam Rubio'}
        </h6>
      </div>

      <div className="mb-6">
        <p>{product.description}</p>
        
        {product.content?.find((c: {format: string, excerpt: string}) => c.format === product.primaryFormat)?.excerpt && (
          <p className="mt-3">{product.content.find((c: {format: string, excerpt: string}) => c.format === product.primaryFormat)?.excerpt}</p>
        )}
      </div>

      {/* Mostrar barra de urgencia antes del componente de acciones si es un producto gratuito */}
      {product.isFree && (product.limitDate || product.downloadLimit) && (
        <div className="mb-4">
          <UrgencyProgressBar
            currentDownloads={product.currentDownloads || 0}
            downloadLimit={product.downloadLimit || 500}
            limitDate={product.limitDate || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]}
          />
        </div>
      )}
      
      {/* Formulario de descarga o botón de compra */}
      {isFree ? (
        <div className="subscription-form">
          <h3 className="h4 mb-4">Descarga gratuita</h3>
          <p className="mb-4">Introduce tu correo electrónico para recibir este recurso directamente en tu bandeja. No enviaremos spam.</p>
          
          <form onSubmit={handleFormSubmit} className="mb-3">
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
          <button type="button" className="btn btn-primary rounded-pill btn-icon btn-icon-start w-100 mb-3">
            <i className="uil uil-shopping-cart"></i> Comprar ahora
          </button>
          
          {product.includeInSubscription && (
            <div className="alert alert-blue alert-icon mb-0">
              <i className="uil uil-info-circle"></i>
              <span>Este recurso está incluido en la <a href="/suscripcion" className="alert-link hover">suscripción por 10€/mes</a></span>
            </div>
          )}
        </div>
      )}
    </>
  );
} 