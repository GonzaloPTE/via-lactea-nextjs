import Image from "next/image";
import { Fragment } from "react";
// GLOBAL CUSTOM COMPONENTS
import NextLink from "components/reuseable/links/NextLink";
// IMAGES
import notFoundImage from "../../public/img/via-lactea/illustrations/404.png";
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
import ViaLacteaFooter from "components/blocks/footer/ViaLacteaFooter";

export default function NotFound() {
  return (
    <Fragment>
      {/* ========== header ========== */}
      <header className="wrapper bg-soft-primary">
        <ViaLacteaNavbar button={<CalendlyButton />} />
      </header>

      <main className="content-wrapper">
        <section className="wrapper bg-soft-primary">
          <div className="container pt-12 pt-md-14 pb-14 pb-md-16">
            <div className="row">
              <div className="col-lg-9 col-xl-8 mx-auto">
                <figure className="mb-10">
                  <Image src={notFoundImage} alt="not found" />
                </figure>
              </div>

              <div className="col-lg-8 col-xl-7 col-xxl-6 mx-auto text-center">
                <h1 className="mb-3">Oops! Página no encontrada.</h1>
                <p className="lead mb-7 px-md-12 px-lg-5 px-xl-7">
                  La página que estás buscando no está disponible o ha sido movida. Intenta con una página diferente o ve a la página principal con el botón de abajo.
                </p>

                <NextLink title="Ir a la página principal" href="/" className="btn btn-primary rounded-pill" />
              </div>
            </div>
          </div>
        </section>
        <figure className="bg-soft-primary">
            <img src="/img/photos/clouds.png" alt="Clouds" />
          </figure>
      </main>

      {/* ========== Subscribe to newsletter footer section ========== */}
      <ViaLacteaFooter />
    </Fragment>
  );
}
