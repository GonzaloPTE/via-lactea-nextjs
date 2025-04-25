import { Fragment } from "react";
import { serviceList } from 'data/service-data';

// VIA LACTEA CUSTOM COMPONENTS
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
import ViaLacteaFooter from "components/blocks/footer/ViaLacteaFooter";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
import NextLink from "components/reuseable/links/NextLink";

export default function ServicesPage() {
  // Agrupar servicios por categoría
  const babyServices = serviceList.filter(service => service.category === 'baby');
  const childServices = serviceList.filter(service => service.category === 'child');
  const generalServices = serviceList.filter(service => service.category === 'general');

  return (
    <Fragment>
      {/* ========== header ========== */}
      <header className="wrapper bg-soft-primary">
        <ViaLacteaNavbar button={<CalendlyButton />} />
      </header>

      {/* ========== main content ========== */}
      <main className="content-wrapper">
        {/* ========== hero section ========== */}
        <section className="wrapper bg-soft-grape">
          <div className="container pt-10 pb-12 pt-md-14 pb-md-16 text-center">
            <div className="row">
              <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-6 mx-auto">
                <h1 className="display-1 mb-3">Servicios</h1>
                <p className="lead px-lg-5 px-xxl-8">
                  Descubre nuestras asesorías personalizadas para ayudarte con el sueño de tu bebé y la lactancia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== Servicios por categoría ========== */}
        <section className="wrapper bg-light">
          <div className="container py-14 py-md-16">
            {/* Servicios para 0-6 meses */}
            {babyServices.length > 0 && (
              <div className="mb-14">
                <div className="row mb-8">
                  <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-6">
                    <h2 className="fs-15 text-uppercase text-grape mb-3">0-6 meses</h2>
                    <h3 className="display-4 mb-5">Asesoría para bebés recién nacidos</h3>
                    <p className="lead fs-lg mb-0">
                      Servicios especializados para acompañarte durante los primeros meses de vida de tu bebé,
                      ayudándote con la lactancia y estableciendo rutinas saludables.
                    </p>
                  </div>
                </div>

                <div className="row gx-lg-8 gx-xl-12 gy-8">
                  {babyServices.map((service) => (
                    <div className="col-md-6 col-lg-4" key={service.id}>
                      <div className="card shadow-lg h-100">
                        <div className="card-body p-6">
                          <div className="d-flex flex-row align-items-center mb-5">
                            <img src={service.iconUrl} className="svg-inject icon-svg icon-svg-md text-grape me-3" alt="" />
                            <h4 className="mb-0">{service.title}</h4>
                          </div>
                          <p className="mb-4">{service.shortDescription}</p>
                          <div className="d-flex flex-row align-items-center justify-content-between mt-auto">
                            <div>
                              {service.price === 0 ? (
                                <span className="price fs-18 text-green">Gratis</span>
                              ) : (
                                <span className="price fs-18 text-grape">{service.price}€</span>
                              )}
                            </div>
                            <NextLink
                              title="Ver más"
                              href={`/servicios/${service.slug}`}
                              className="btn btn-sm btn-grape rounded-pill"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Servicios para 6 meses a 4 años */}
            {childServices.length > 0 && (
              <div className="mb-14">
                <div className="row mb-8">
                  <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-6">
                    <h2 className="fs-15 text-uppercase text-grape mb-3">6 meses a 4 años</h2>
                    <h3 className="display-4 mb-5">Planes de sueño infantil</h3>
                    <p className="lead fs-lg mb-0">
                      Soluciones personalizadas para niños de 6 meses a 4 años que les ayudarán a mejorar
                      su calidad de sueño y a toda la familia a descansar mejor.
                    </p>
                  </div>
                </div>

                <div className="row gx-lg-8 gx-xl-12 gy-8">
                  {childServices.map((service) => (
                    <div className="col-md-6 col-lg-4" key={service.id}>
                      <div className="card shadow-lg h-100">
                        <div className="card-body p-6">
                          <div className="d-flex flex-row align-items-center mb-5">
                            <img src={service.iconUrl} className="svg-inject icon-svg icon-svg-md text-grape me-3" alt="" />
                            <h4 className="mb-0">{service.title}</h4>
                          </div>
                          <p className="mb-4">{service.shortDescription}</p>
                          <div className="d-flex flex-row align-items-center justify-content-between mt-auto">
                            <div>
                              {service.price === 0 ? (
                                <span className="price fs-18 text-green">Gratis</span>
                              ) : (
                                <span className="price fs-18 text-grape">{service.price}€</span>
                              )}
                            </div>
                            <NextLink
                              title="Ver más"
                              href={`/servicios/${service.slug}`}
                              className="btn btn-sm btn-grape rounded-pill"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Servicios generales */}
            {generalServices.length > 0 && (
              <div>
                <div className="row mb-8">
                  <div className="col-md-10 col-lg-8 col-xl-7 col-xxl-6">
                    <h2 className="fs-15 text-uppercase text-grape mb-3">Servicios generales</h2>
                    <h3 className="display-4 mb-5">Otras asesorías complementarias</h3>
                    <p className="lead fs-lg mb-0">
                      Servicios adicionales que pueden complementar tu asesoría principal o adaptarse
                      a situaciones específicas de tu familia.
                    </p>
                  </div>
                </div>

                <div className="row gx-lg-8 gx-xl-12 gy-8">
                  {generalServices.map((service) => (
                    <div className="col-md-6 col-lg-4" key={service.id}>
                      <div className="card shadow-lg h-100">
                        <div className="card-body p-6">
                          <div className="d-flex flex-row align-items-center mb-5">
                            <img src={service.iconUrl} className="svg-inject icon-svg icon-svg-md text-grape me-3" alt="" />
                            <h4 className="mb-0">{service.title}</h4>
                          </div>
                          <p className="mb-4">{service.shortDescription}</p>
                          <div className="d-flex flex-row align-items-center justify-content-between mt-auto">
                            <div>
                              {service.price === 0 ? (
                                <span className="price fs-18 text-green">Gratis</span>
                              ) : (
                                <span className="price fs-18 text-grape">{service.price}€</span>
                              )}
                            </div>
                            <NextLink
                              title="Ver más"
                              href={`/servicios/${service.slug}`}
                              className="btn btn-sm btn-grape rounded-pill"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========== CTA ========== */}
        <section className="wrapper bg-grape text-white">
          <div className="container py-14 py-md-16">
            <div className="row text-center">
              <div className="col-xl-10 mx-auto">
                <h2 className="fs-15 text-uppercase text-white mb-3">¿Tienes dudas sobre qué servicio elegir?</h2>
                <h3 className="display-4 mb-10 px-xxl-15">
                  Agenda una valoración gratuita y juntos determinaremos el plan que mejor se adapte a tus necesidades
                </h3>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-7 col-xl-6 col-xxl-5">
                <div className="d-flex justify-content-center">
                  <NextLink 
                    title="Valoración gratuita" 
                    href="/servicios/valoracion-gratuita" 
                    className="btn btn-white rounded-pill mb-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========== footer ========== */}
      <ViaLacteaFooter />
    </Fragment>
  );
} 