"use client";

import { Fragment, useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
// GLOBAL CUSTOM COMPONENTS
import ThumbsCarousel from "components/reuseable/ThumbsCarousel";
// LOCAL CUSTOM COMPONENTS
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
// CUSTOM DATA
import { productList, getProductBySlug, ProductItem } from "../../../data/product-data";
// Importar el componente ResourceDetailActions
import ResourceDetailActions from "components/reuseable/products/ResourceDetailActions";

// Tipado para params como Promise
interface ResourceDetailParams {
  params: Promise<{ slug: string }>;
}

// Componente para mostrar los beneficios como sección independiente
const ProductBenefits = ({ benefits }: { benefits: any[] }) => {
  return (
    <div className="row mt-8">
      <div className="col-12 text-center">
        <h3 className="mb-4 text-center">Beneficios</h3>
        <div className="row gx-lg-8 gx-xl-12 gy-6 process-wrapper justify-content-center">
          {benefits.map((benefit: any) => {
            const Icon = benefit.icon;
            return (
              <div className="col-md-6 col-lg-3" key={benefit.id}>
                <div className="d-flex flex-column h-100 align-items-center text-center">
                    <Icon className="icon-svg mx-0 my-4" />
                  <h4 className="mb-3">{benefit.title}</h4>
                  <p className="mb-0">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Componente para mostrar el autor con nombre y apellido separados
const ProductAuthor = ({ author }: { author: any }) => {
  if (!author) return null;
  
  const firstName = author.name?.split(' ')[0] || '';
  const lastName = author.name?.split(' ').slice(1).join(' ') || '';
  
  return (
    <div className="row mt-8">
      <div className="col-12">
        <h3 className="mb-4">Acerca del autor</h3>
        <div className="card">
          <div className="card-body d-flex flex-row">
            <div className="col-md-2 text-center">
              <img src={author.imageUrl} alt={author.name} className="rounded-circle w-20 mb-4" />
            </div>
            <div className="col-md-10 ps-md-3">
              <div className="d-flex flex-wrap mb-2">
                <h4 className="mb-0 me-2">{firstName}</h4>
                <h4 className="mb-0">{lastName}</h4>
              </div>
              <h6 className="mb-3">{author.role}</h6>
              <p>{author.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente reutilizable para la sección de detalles
const ProductDetails = ({ product }: { product: ProductItem }) => {
  return (
    <div className="mt-12">
      <ul className="nav nav-tabs nav-tabs-basic">
        <li className="nav-item">
          <a 
            className="nav-link active"
            style={{ cursor: "pointer" }}
          >
            Detalles
          </a>
        </li>
      </ul>
      
      <div className="tab-content mt-0 mt-md-5">
        <div className="tab-pane fade show active">
          <div className="row">
            <div className="col-lg-12">
              <div className="table-responsive">
                <table className="table table-striped">
                  <tbody>
                    {product.formatDetails?.find(fd => fd.format === product.primaryFormat) && (
                      <>
                        {product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.pageCount && (
                          <tr>
                            <td className="w-25"><strong>Número de páginas</strong></td>
                            <td>{product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.pageCount}</td>
                          </tr>
                        )}
                        {product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.fileSize && (
                          <tr>
                            <td><strong>Tamaño del archivo</strong></td>
                            <td>{product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.fileSize}</td>
                          </tr>
                        )}
                        {product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.fileFormat && (
                          <tr>
                            <td><strong>Formato</strong></td>
                            <td>{product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.fileFormat}</td>
                          </tr>
                        )}
                        {product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.duration && (
                          <tr>
                            <td><strong>Duración</strong></td>
                            <td>{product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.duration}</td>
                          </tr>
                        )}
                        {product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.lessonCount && (
                          <tr>
                            <td><strong>Número de lecciones</strong></td>
                            <td>{product.formatDetails.find(fd => fd.format === product.primaryFormat)?.details.lessonCount}</td>
                          </tr>
                        )}
                      </>
                    )}
                    <tr>
                      <td className="w-25"><strong>Fecha de publicación</strong></td>
                      <td>{new Date(product.publishDate).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</td>
                    </tr>
                    {product.lastUpdated && (
                      <tr>
                        <td><strong>Última actualización</strong></td>
                        <td>{new Date(product.lastUpdated).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}</td>
                      </tr>
                    )}
                    {product.topic && (
                      <tr>
                        <td><strong>Categoría</strong></td>
                        <td>{product.topic}</td>
                      </tr>
                    )}
                    {product.tags && product.tags.length > 0 && (
                      <tr>
                        <td><strong>Etiquetas</strong></td>
                        <td>{product.tags.join(', ')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ResourceDetailPage({ params }: ResourceDetailParams) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductItem[]>([]);
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
          .filter(Boolean) as ProductItem[];
        setRelatedProducts(related);
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

  // Determinar precio basado en el formato principal
  const priceInfo = product.prices.find(p => p.format === product.primaryFormat);
  const price = priceInfo ? priceInfo.price : 0;
  const isFree = product.isFree || price === 0;

  return (
    <Fragment>
      {/* ========== Header with Navbar ========== */}
      <header className="wrapper bg-soft-primary">
        <ViaLacteaNavbar 
          fancy
          logoAlt="via-lactea-logo"
        />
      </header>

      {/* ========== product info section ========== */}
      <section className="wrapper bg-soft-primary">
        <div className="container py-2 py-md-4">
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
            <div className="col-lg-6">
              <ResourceDetailActions product={product} />
            </div>
          </div>
        </div>
        <figure>
          <img src="/img/photos/clouds.png" alt="Clouds" />
        </figure>
      </section>

      {/* ========== beneficios section ========== */}
      {product.benefits && product.benefits.length > 0 && (
        <section className="wrapper bg-light">
          <div className="container py-2 py-md-4">
            <ProductBenefits benefits={product.benefits} />
          </div>
        </section>
      )}
      
      {/* ========== details section ========== */}
      <section className="wrapper bg-light">
        <div className="container py-2 py-md-4">
          <ProductDetails product={product} />
        </div>
        <figure className="bg-soft-primary">
          <img src="/img/photos/clouds.png" alt="Clouds" style={{ transform: 'scaleY(-1)' }} />
        </figure>
      </section>

      {/* ========== related products section ========== */}
      {relatedProducts.length > 0 && (
      <section className="wrapper bg-gray">
        <div className="container py-2 py-md-4">
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
