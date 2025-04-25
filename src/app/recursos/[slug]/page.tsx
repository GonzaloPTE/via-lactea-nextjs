"use client";

import { Fragment, useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
// GLOBAL CUSTOM COMPONENTS
import ThumbsCarousel from "components/reuseable/ThumbsCarousel";
// LOCAL CUSTOM COMPONENTS
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
import { UrgencyProgressBar } from "components/reuseable/UrgencyProgressBar";
// CUSTOM DATA
import { productList, getProductBySlug, ProductItem } from "../../../data/product-data";

// Tipado para params como Promise
interface ResourceDetailParams {
  params: Promise<{ slug: string }>;
}

// Componente para mostrar los beneficios como sección independiente
const ProductBenefits = ({ benefits }: { benefits: any[] }) => {
  return (
    <div className="row mt-8">
      <div className="col-12">
        <h3 className="mb-4">Beneficios</h3>
        <div className="row gx-lg-8 gx-xl-12 gy-6 process-wrapper">
          {benefits.map((benefit: any) => {
            const Icon = benefit.icon;
            return (
              <div className="col-md-6 col-lg-3" key={benefit.id}>
                <div className="d-flex flex-column h-100">
                  <div className="icon btn btn-circle btn-lg btn-primary disabled mb-4">
                    <Icon className="icon-svg m-0" />
                  </div>
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

// Componente para el formulario de descarga con nombre y apellidos separados
const DownloadForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ firstName, lastName, email });
    // Aquí iría la lógica para procesar la descarga
  };
  
  return (
    <div className="subscription-form">
      <h3 className="h4 mb-4">Descarga gratuita</h3>
      <p className="mb-4">Introduce tus datos para recibir este recurso directamente en tu correo. No enviaremos spam a tu bandeja de entrada.</p>
      
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="row">
          <div className="col-md-6">
            <div className="form-floating mb-4">
              <input 
                id="firstName" 
                type="text" 
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Nombre" 
                className="form-control" 
                required 
              />
              <label htmlFor="firstName">Nombre</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-floating mb-4">
              <input 
                id="lastName" 
                type="text" 
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Apellidos" 
                className="form-control" 
                required 
              />
              <label htmlFor="lastName">Apellidos</label>
            </div>
          </div>
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
  );
};

export default function ResourceDetailPage({ params }: ResourceDetailParams) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("descripcion");

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
            <div className="col-lg-6">
              <div className="post-header mb-5">
                <h2 className="post-title display-5">
                  {product.title}
                </h2>

                {/* Etiqueta de formato y tipo */}
                <div className="d-flex align-items-center mb-3">
                  <span className="badge bg-pale-primary text-primary rounded-pill me-2">
                    {product.levelLabel}
                  </span>
                  <span className="badge bg-pale-blue text-blue rounded-pill">
                    {product.formatLabels?.find((f: string) => product.formats?.indexOf(product.primaryFormat as any) >= 0) || product.primaryFormat}
                  </span>
                </div>

                {/* Precio del producto */}
                <p className="price fs-20 mb-2">
                  {isFree ? (
                    <span className="amount text-primary">Gratis</span>
                  ) : (
                    <span className="amount">
                      {product.prices?.find((p: {format: string, price: number}) => p.format === product.primaryFormat)?.price.toFixed(2)}€
                    </span>
                  )}
                </p>
              </div>

              <p className="mb-6">
                {product.shortDescription}
              </p>

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
                <DownloadForm />
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
          </div>

          {/* ========== Tabs de descripción y detalles ========== */}
          <div className="mt-12">
            <ul className="nav nav-tabs nav-tabs-basic">
              <li className="nav-item">
                <a 
                  className={clsx("nav-link", { active: activeTab === "descripcion" })}
                  onClick={() => setActiveTab("descripcion")}
                  style={{ cursor: "pointer" }}
                >
                  Descripción
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={clsx("nav-link", { active: activeTab === "detalles" })}
                  onClick={() => setActiveTab("detalles")}
                  style={{ cursor: "pointer" }}
                >
                  Detalles
                </a>
              </li>
            </ul>
            
            <div className="tab-content mt-0 mt-md-5">
              {/* Tab de descripción */}
              <div className={clsx("tab-pane fade", { "show active": activeTab === "descripcion" })}>
                <div className="row">
                  <div className="col-lg-8">
                    <p>{product.description}</p>
                    
                    {product.content?.find((c: {format: string, excerpt: string}) => c.format === product.primaryFormat)?.excerpt && (
                      <div className="mb-5">
                        <p>{product.content.find((c: {format: string, excerpt: string}) => c.format === product.primaryFormat)?.excerpt}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Previsualización del producto */}
                  <div className="col-lg-4">
                    {product.previewUrls?.find((p: {format: string, url: string}) => p.format === product.primaryFormat) && (
                      <figure className="mb-6">
                        <img 
                          src={product.previewUrls.find((p: {format: string, url: string}) => p.format === product.primaryFormat)?.url} 
                          alt={`Vista previa de ${product.title}`} 
                          className="img-fluid rounded shadow-lg"
                        />
                        <figcaption className="mt-2 text-center fs-sm">
                          Vista previa
                        </figcaption>
                      </figure>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tab de detalles */}
              <div className={clsx("tab-pane fade", { "show active": activeTab === "detalles" })}>
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
          
          {/* ========== author section ========== */}
          {product.author && (
            <ProductAuthor author={product.author} />
          )}
          
          {/* ========== beneficios section ========== */}
          {product.benefits && product.benefits.length > 0 && (
            <ProductBenefits benefits={product.benefits} />
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
