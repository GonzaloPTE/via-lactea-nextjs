import { Fragment } from "react";

// VIA LACTEA CUSTOM COMPONENTS
import ViaLacteaHero from "components/blocks/hero/ViaLacteaHero";
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
import ViaLacteaServices from "components/blocks/services/ViaLacteaServices";
import ViaLacteaAbout from "components/blocks/about/ViaLacteaAbout";
import ViaLacteaFacts from "components/blocks/facts/ViaLacteaFacts";
import ViaLacteaTestimonials from "components/blocks/testimonial/ViaLacteaTestimonials";
import ViaLacteaPortfolio from "components/blocks/portfolio/ViaLacteaPortfolio";
import ViaLacteaFAQ from "components/blocks/faq/ViaLacteaFAQ";
import ViaLacteaContact from "components/blocks/contact/ViaLacteaContact";
import ViaLacteaFooter from "components/blocks/footer/ViaLacteaFooter";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";

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
        <ViaLacteaServices />

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
