import { Fragment } from "react";
import NextLink from "components/reuseable/links/NextLink";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
// Importamos los datos de servicios de Vía Láctea
import { serviceList } from "../../../data/via-lactea-services";

export default function ViaLacteaServices() {
  return (
    <section className="wrapper bg-white">
      <div className="container pt-20">
        <Fragment>
          <div className="row text-center">
            <div className="col-lg-9 col-xl-8 col-xxl-7 mx-auto">
              <h2 className="fs-16 text-uppercase text-primary mb-3">Servicios de ayuda integral</h2>
              <h3 className="display-4 mb-9">Acompañamiento profesional para ti y tu bebé</h3>
            </div>
          </div>

          <div className="row gx-md-8 gy-12 mb-15 mb-md-17 text-center">
            {serviceList.map(({ id, Icon, title, description, url }) => (
              <div className="col-md-6 col-lg-3" key={id}>
                <div className="px-md-3 px-lg-0 px-xl-3">
                  <Icon className="icon-svg-md text-grape mb-5" />
                  <h4>{title}</h4>
                  <p className="mb-3">{description}</p>
                  
                  {id === 1 ? (
                    // Para la tarjeta de valoración gratuita (id=1), usar el popup de Calendly
                    <CalendlyButton 
                      text="TE LLAMO" 
                      icon="uil uil-phone-alt" 
                      className="btn btn-sm btn-grape rounded" 
                    />
                  ) : (
                    // Para el resto de tarjetas, usar el enlace normal
                    <NextLink title="Saber más" href={url} className="more hover" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Fragment>
      </div>
    </section>
  );
} 