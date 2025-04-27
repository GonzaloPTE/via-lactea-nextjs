import { Fragment } from "react";
import { Metadata } from 'next';

// VIA LACTEA CUSTOM COMPONENTS
import ViaLacteaHero from "components/blocks/hero/ViaLacteaHero";
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
import ViaLacteaAbout from "components/blocks/about/ViaLacteaAbout";
import ViaLacteaFacts from "components/blocks/facts/ViaLacteaFacts";
import ViaLacteaTestimonials from "components/blocks/testimonial/ViaLacteaTestimonials";
import ViaLacteaPortfolio from "components/blocks/portfolio/ViaLacteaPortfolio";
import ViaLacteaFAQ from "components/blocks/faq/ViaLacteaFAQ";
import ViaLacteaContact from "components/blocks/contact/ViaLacteaContact";
import ViaLacteaFooter from "components/blocks/footer/ViaLacteaFooter";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
import ViaLacteaServicesHome from "components/blocks/services/ViaLacteaServicesHome";

// SEO Metadata
export const metadata: Metadata = {
  title: "Vía Láctea | Asesoría de Sueño Infantil y Lactancia Online",
  description: "Especialistas en sueño infantil respetuoso y lactancia. Consultas 100% online y personalizadas para tu familia.",
  keywords: ["asesoría sueño infantil respetuoso", "asesoría lactancia online", "tarifas asesoría sueño respetuoso", "precios consulta lactancia", "planes sueño respetuoso bebé"], // Optional: Add keywords if desired
};

export default function HomePage() {
  return (
    <Fragment>
      {/* ========== header ========== */}
      <header className="wrapper bg-soft-primary">
        <ViaLacteaNavbar button={<CalendlyButton />} />
      </header>

      {/* ========== main content ========== */}
      <main className="content-wrapper">
        {/* ========== hero section ========== */}
        <ViaLacteaHero />

        {/* ========== sobre mi section ========== */}
        <section className="wrapper bg-light mb-md-custom-350">
          <div className="container py-7 py-md-8">
            <ViaLacteaAbout />
            <ViaLacteaFacts />
          </div>
        </section>

        {/* ========== testimonials section ========== */}
        <ViaLacteaTestimonials />

        {/* ========== what do we do section ========== */}
        <ViaLacteaServicesHome />

        {/* ========== partners section ========== */}
        <ViaLacteaPortfolio />

        {/* ========== FAQ section ========== */}
        <ViaLacteaFAQ />

        {/* ========== Contact & social media section ========== */}
        <ViaLacteaContact />
        
      </main>
      {/* ========== Subscribe to newsletter footer section ========== */}
      <ViaLacteaFooter />
    </Fragment>
  );
}
