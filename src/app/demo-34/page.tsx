import Link from "next/link";
import { Fragment } from "react";
// GLOBAL CUSTOM COMPONENTS
import Navbar from "components/blocks/navbar/navbar-1";
import { Hero34 } from "components/blocks/hero";
import { Footer18 } from "components/blocks/footer";
import { Pricing12 } from "components/blocks/pricing";
import { Process21 } from "components/blocks/process";
import { Services37 } from "components/blocks/services";
import { About35, About36 } from "components/blocks/about";
import { Testimonial28 } from "components/blocks/testimonial";

export default function Demo34() {
  return (
    <Fragment>
      {/* ========== header section ========== */}
      <header className="wrapper bg-light mb-2">
        <Navbar
          language
          button={
            <Link href="#" className="btn btn-sm btn-primary rounded">
              Contact
            </Link>
          }
        />
      </header>

      <main className="content-wrapper">
        {/* ========== hero section ========== */}
        <Hero34 />

        {/* ========== what we do section ========== */}
        <Services37 />

        {/* ========== happy customer section ========== */}
        <Testimonial28 />

        {/* ========== why choose us section ========== */}
        <About35 />

        {/* ========== our solutions section ========== */}
        <Process21 />

        <section className="wrapper bg-light">
          <div className="container py-15 py-md-17">
            {/* ========== what make us different section ========== */}
            <About36 />

            {/* ========== our pricing & faq section ========== */}
            <Pricing12 />
          </div>
        </section>
      </main>

      {/* ========== footer section ========== */}
      <Footer18 />
    </Fragment>
  );
}
