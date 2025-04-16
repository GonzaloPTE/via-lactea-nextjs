"use client";

import NextLink from "components/reuseable/links/NextLink";
import { useEffect } from "react";
import Head from "next/head";

// Add Calendly type declaration for TypeScript
declare global {
  interface Window {
    Calendly?: any;
  }
}

export default function ViaLacteaHero() {
  useEffect(() => {
    // Load Calendly script dynamically
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    // Add Calendly CSS
    const link = document.createElement("link");
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Cleanup on component unmount
    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  const handleCalendlyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/asesoriainfantilvialactea/30min?hide_gdpr_banner=1&primary_color=605dba'
      });
    }
    return false;
  };

  return (
    <section className="wrapper bg-soft-primary">
      <div className="container pt-12 pt-lg-12 pt-xl-10 pt-xxl-10 pb-lg-10 pb-xl-10 pb-xxl-0">
        <div className="row gx-md-8 gx-xl-12 gy-10 align-items-center text-center text-lg-start mb-15">
          <div className="col-lg-6" data-cues="slideInDown" data-group="page-title" data-delay="900">
            <h1 className="display-1 mb-4 me-xl-5 mt-lg-8">
              Asesoría profesional en <br className="d-none d-md-block d-lg-none" />
              <span className="text-grape">sueño infantil y lactancia</span>
            </h1>

            <p className="lead fs-24 lh-sm mb-7 pe-xxl-15">
              Te ayudo a recuperar el descanso familiar y <br className="d-none d-md-block d-lg-none" />
              a disfrutar plenamente de la crianza de tu bebé.
            </p>

            <div className="d-inline-flex me-2">
              <a 
                href="#" 
                onClick={handleCalendlyClick} 
                className="btn btn-lg btn-grape rounded"
              >
                <i className="uil uil-calendar-alt fs-25 me-2"></i> Agenda YA tu valoración GRATUITA
              </a>
            </div>
          </div>

          <div className="col-10 col-md-7 mx-auto col-lg-6 col-xl-5 ms-xl-5 mt-13 mt-lg-n8 position-relative">
            <div className="img-mask mask-3" style={{ transform: 'scale(1.2)', transformOrigin: 'center center' }}>
                <img
                className="img-fluid"
                srcSet="/img/photos/about36@2x.jpg 2x"
                src="/img/photos/about36.jpg"
                data-cue="fadeIn"
                data-delay="300"
                alt="3d"
                />
            </div>
          </div>
        </div>
      </div>

      <figure>
        <img src="/img/photos/clouds.png" alt="Clouds" />
      </figure>
    </section>
  );
} 