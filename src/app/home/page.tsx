import { Fragment } from "react";
// GLOBAL CUSTOM COMPONENTS
import { About27 } from "components/blocks/about";
import { Footer17, Footer3 } from "components/blocks/footer";
import { Pricing9 } from "components/blocks/pricing";
import { Process16 } from "components/blocks/process";
import { Contact13 } from "components/blocks/contact";
import { CTA10 } from "components/blocks/call-to-action";
import { Testimonial20 } from "components/blocks/testimonial";
import NextLink from "components/reuseable/links/NextLink";
// VIA LACTEA CUSTOM COMPONENTS
import ViaLacteaHero from "components/blocks/hero/via-lactea-hero";
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
import ViaLacteaServices from "components/blocks/services/ViaLacteaServices";
import ViaLacteaAbout from "components/blocks/about/ViaLacteaAbout";
import ViaLacteaFacts from "components/blocks/facts/ViaLacteaFacts";
import ViaLacteaTestimonials from "components/blocks/testimonial/ViaLacteaTestimonials";
import ViaLacteaPortfolio from "components/blocks/portfolio/ViaLacteaPortfolio";
import ViaLacteaFAQ from "components/blocks/faq/ViaLacteaFAQ";
import ViaLacteaContact from "components/blocks/contact/ViaLacteaContact";
import ViaLacteaFooter from "components/blocks/footer/ViaLacteaFooter";
export default function HomePage() {
  return (
    <Fragment>
      {/* ========== header ========== */}
      <header className="wrapper bg-soft-primary">
        <ViaLacteaNavbar button={<NextLink href="/contacto" title={<><i className="uil uil-whatsapp fs-25 me-1"></i> Valoracion GRATUITA</>} className="btn btn-sm btn-primary rounded" />} />
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
