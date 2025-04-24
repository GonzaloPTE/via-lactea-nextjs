"use client";

import { Fragment, useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
// GLOBAL CUSTOM COMPONENTS
import Carousel from "components/reuseable/Carousel";
import ThumbsCarousel from "components/reuseable/ThumbsCarousel";
// LOCAL CUSTOM COMPONENTS
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
import ResourceDetailActions from "components/reuseable/products/ResourceDetailActions";
import ResourceDetailDescription from "components/reuseable/products/ResourceDetailDescription";
import ResourceDetailAuthor from "components/reuseable/products/ResourceDetailAuthor";
// CUSTOM DATA
import { productList, getProductBySlug } from "../../../data/product-data";

// Tipado para params como Promise
interface ResourceDetailParams {
  params: Promise<{ slug: string }>;
}

export default function ResourceDetailPage({ params }: ResourceDetailParams) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    // Obtener el producto actual por slug
    const productData = getProductBySlug(slug);
    
    if (productData) {
      setProduct(productData);
      
      // Obtener productos relacionados
      if (productData.relatedProductIds) {
        const related = productData.relatedProductIds
          .map(relId => productList.find(p => p.id === relId))
          .filter(Boolean);
        setRelatedProducts(related as any[]);
      }
    }
    
    setLoading(false);
  }, [slug]);

  // Manejar la redirección si el producto no existe
  useEffect(() => {
    if (!loading && !product) {
      router.push('/recursos');
    }
  }, [loading, product, router]);

  // Si está cargando o no hay producto, mostrar pantalla de carga
  if (loading || !product) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  const carouselBreakpoints = {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    992: { slidesPerView: 3 }
  };

  return (
    <Fragment>
      {/* ========== Header with Navbar ========== */}
      <header className="wrapper bg-light">
        <ViaLacteaNavbar 
          fancy
          logoAlt="via-lactea-logo" 
          whiteBackground
        />
      </header>

      {/* ========== product info section ========== */}
      <section className="wrapper bg-light">
        <div className="container py-14 py-md-16">
          <div className="row gx-md-8 gx-xl-12 gy-8">
            <div className="col-lg-6">
              {product.thumbnailUrl ? (
                <figure className="rounded">
                  <img 
                    src={product.thumbnailUrl}
                    alt={product.title} 
                    className="img-fluid" 
                  />
                </figure>
              ) : (
              <ThumbsCarousel />
              )}
            </div>

            {/* ========== product actions section ========== */}
            <ResourceDetailActions product={product} />
          </div>

          {/* ========== product description section ========== */}
          <ResourceDetailDescription product={product} />
          
          {/* ========== author section ========== */}
          {product.author && (
            <ResourceDetailAuthor author={product.author} />
          )}
        </div>
      </section>

      {/* ========== related products section ========== */}
      {relatedProducts.length > 0 && (
      <section className="wrapper bg-gray">
        <div className="container py-14 py-md-16">
            <h3 className="h2 mb-6 text-center">Recursos relacionados</h3>

            <div className="row gy-6">
              {relatedProducts.map((item) => (
                item && (
                  <div className="col-md-4" key={item.id}>
                    <div className="card">
                      <figure className="card-img-top">
                        <img src={item.thumbnailUrl} alt={item.title} className="img-fluid" />
                      </figure>
                      <div className="card-body">
                        <div className="d-flex flex-row align-items-center justify-content-between mb-2">
                          <div className="post-header">
                            <h2 className="post-title h3 fs-22">
                              <a href={`/recursos/${item.slug}`} className="link-dark">
                                {item.title}
                              </a>
                            </h2>
          </div>
        </div>
                        <p className="mb-6">{item.shortDescription}</p>
                        <div className="d-flex justify-content-between">
                          <span className="price fs-18">
                            {item.isFree 
                              ? <span className="amount text-primary">Gratis</span>
                              : <span className="amount">{item.prices?.[0]?.price.toFixed(2)}€</span>
                            }
                          </span>
                          <a href={`/recursos/${item.slug}`} className="btn btn-sm btn-primary rounded-pill">
                            Ver más
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
          </div>
        </div>
      </section>
      )}
    </Fragment>
  );
}
