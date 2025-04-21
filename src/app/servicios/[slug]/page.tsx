"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getServiceBySlug, ServiceItem } from "data/service-data";

// VIA LACTEA CUSTOM COMPONENTS
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
import ViaLacteaFooter from "components/blocks/footer/ViaLacteaFooter";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
import ViaLacteaProcess from "components/blocks/process/ViaLacteaProcess";
import ViaLacteaHeroService from "components/blocks/hero/ViaLacteaHeroService";

export default function ServiceDetail({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { slug } = params;
  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    // Obtener el servicio correspondiente al slug
    const serviceData = getServiceBySlug(slug as string);
    setService(serviceData || null);
    setLoading(false);
  }, [slug]);

  // Manejar la redirección si el servicio no existe
  useEffect(() => {
    if (!loading && !service) {
      router.push('/servicios');
    }
  }, [loading, service, router]);

  // Si está cargando o no hay servicio, mostrar pantalla de carga
  if (loading || !service) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-grape" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      {/* ========== header ========== */}
      <header className="wrapper bg-soft-primary">
        <ViaLacteaNavbar button={<CalendlyButton />} whiteBackground={true} />
      </header>

      {/* ========== main content ========== */}
      <main className="content-wrapper">
        {/* ========== hero section ========== */}
        <ViaLacteaHeroService service={service} />

        {/* ========== service features section ========== */}
        <section className="wrapper bg-light">
          <div className="container py-14 py-md-16">
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <div className="card shadow-lg">
                  <div className="row gx-0">
                    <div className="col-lg-6 image-wrapper bg-image bg-cover rounded-top rounded-lg-start" 
                         style={{ backgroundImage: "url(/img/photos/bg38.jpg)" }} />
                    
                    <div className="col-lg-6">
                      <div className="p-10 p-md-11 p-lg-13">
                        <h2 className="display-4 mb-3">{service.title}</h2>
                        <p className="lead fs-lg">{service.shortDescription}</p>
                        <ul className="icon-list bullet-bg bullet-soft-primary mt-7">
                          {service.features.map((feature, index) => (
                            <li key={index}><i className="uil uil-check"></i><span>{feature}</span></li>
                          ))}
                        </ul>
                        <div className="d-flex align-items-center mt-8">
                          <div>
                            <h3 className="mb-0">
                              {service.price === 0 ? (
                                <span className="price display-6 text-green">Gratis</span>
                              ) : (
                                <span className={`price display-6 text-${service.color ? service.color : 'grape'}`}>{service.price}€</span>
                              )}
                            </h3>
                            <span className="fs-15 text-muted">{service.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* ========== process section ========== */}
        {service.process && <ViaLacteaProcess processData={service.process} />}
      </main>

      {/* ========== footer ========== */}
      <ViaLacteaFooter />
    </Fragment>
  );
} 