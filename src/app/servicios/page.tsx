import { Fragment } from "react";

// VIA LACTEA CUSTOM COMPONENTS
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
import ViaLacteaFooter from "components/blocks/footer/ViaLacteaFooter";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
import ServicesPortfolio from "components/blocks/portfolio/ServicesPortfolio";

export default function ServicesPage() {
  return (
    <Fragment>
      {/* ========== header ========== */}
      <header className="wrapper bg-soft-primary">
        <ViaLacteaNavbar button={<CalendlyButton />} />
      </header>

      {/* ========== main content ========== */}
      <main className="content-wrapper bg-soft-primary">
        {/* ========== hero section ========== */}
        <section className="wrapper">
          <div className="row mt-8">
            <div className="col-lg-10 col-xl-9 col-xxl-8 mx-auto text-center">
              <h2 className="fs-16 text-uppercase text-primary mb-3">Catálogo de servicios</h2>
              <h3 className="display-5 mb-10">
                Descubre nuestras <span className="underline-3 style-2 grape">asesorías personalizadas</span> para ayudarte con el sueño de tu bebé y la lactancia.
              </h3>
            </div>
          </div>
          <figure className="bg-soft-primary">
            <img src="/img/photos/clouds.png" alt="Clouds" />
          </figure>
        </section>

        {/* ========== Servicios Portfolio ========== */}
        <ServicesPortfolio />

        {/* ========== CTA ========== */}
        <section className="wrapper text-primary bg-white">
          <div className="container py-7 py-md-8">
            <div className="row text-center">
              <div className="col-xl-10 mx-auto">
                <h2 className="fs-15 text-uppercase text-primary mb-3">¿Tienes dudas sobre qué servicio elegir?</h2>
                <h3 className="display-4 mb-10 px-xxl-15">
                  Agenda una valoración <span className="underline-3 style-2 grape">gratuita</span> y juntos determinaremos el plan que mejor se adapte a tus necesidades
                </h3>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-7 col-xl-6 col-xxl-5">
                <div className="d-flex justify-content-center">
                  <a 
                    href="https://calendly.com/asesoriainfantilvialactea/30min?hide_gdpr_banner=1&primary_color=605dba" 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-primary rounded-pill mb-0"
                  >
                    <i className="uil uil-calendar-alt"></i>
                    <span className="ms-2">Valoración gratuita</span>
                  </a>
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