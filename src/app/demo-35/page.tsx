import Link from "next/link";
// GLOBAL CUSTOM COMPONENTS
import Navbar from "components/blocks/navbar/navbar-1";
import { Blog9 } from "components/blocks/blog";
import { Hero35 } from "components/blocks/hero";
import { About37 } from "components/blocks/about";
import { Footer11, Footer18, Footer4 } from "components/blocks/footer";
import { Clients7 } from "components/blocks/clients";
import { Process22 } from "components/blocks/process";
import { Services38 } from "components/blocks/services";
import { CTA14 } from "components/blocks/call-to-action";
import { Testimonial29 } from "components/blocks/testimonial";

export default function Demo34() {
  return (
    <div className="content-wrapper">
      {/* ========== header section ========== */}
      <header className="wrapper bg-light">
        <Navbar
          language
          logoAlt="logo-light"
          navClassName="navbar navbar-expand-lg center-nav navbar-dark navbar-bg-dark bg-navy"
          button={
            <Link href="#" className="btn btn-sm btn-primary rounded">
              Contact
            </Link>
          }
        />
      </header>

      <section className="wrapper bg-light">
        <div className="container pt-14 pt-md-16">
          {/* ========== hero section ========== */}
          <Hero35 />

          {/* ========== clients section ========== */}
          <Clients7 />

          {/* ========== our features section ========== */}
          <Services38 />

          {/* ========== why choose us section ========== */}
          <About37 />

          {/* ========== happy customer section ========== */}
          <Testimonial29 />

          {/* ========== how it works section ========== */}
          <Process22 />

          {/* ========== how it works section ========== */}
          <Blog9 />

          {/* ========== how it works section ========== */}
          <CTA14 />
        </div>
      </section>

      {/* ========== footer section ========== */}
      <Footer4 />
    </div>
  );
}
