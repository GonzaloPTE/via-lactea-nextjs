import { Fragment } from "react";
// GLOBAL CUSTOM COMPONENTS
import { About27 } from "components/blocks/about";
import { Footer17 } from "components/blocks/footer";
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
        <section className="wrapper bg-light">
          <div className="container py-14 py-md-16">
            <ViaLacteaAbout />
            <ViaLacteaFacts />
          </div>
        </section>

        <section className="wrapper bg-white">
          <div className="container pt-15 pb-15 pb-md-17">
            {/* ========== what do we do section ========== */}
            <ViaLacteaServices />

            {/* ========== why choose us section ========== */}
            <About27 />

            {/* ========== our solutions section ========== */}
            <Process16 />

            {/* ========== happy customers section ========== */}
            <Testimonial20 />

            {/* ========== our pricing section ========== */}
            <Pricing9 />

            {/* ========== let's talk section ========== */}
            <Contact13 />
          </div>
        </section>

        {/* ========== analyze now section ========== */}
        <CTA10 />
      </main>

      {/* ========== footer section ========== */}
      <Footer17 />
    </Fragment>
  );
}
