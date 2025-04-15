import { Fragment } from "react";
import NextLink from "components/reuseable/links/NextLink";
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

          <div className="row gx-md-8 gy-8 mb-15 mb-md-17 text-center">
            {serviceList.map(({ id, Icon, title, description, url }) => (
              <div className="col-md-6 col-lg-3" key={id}>
                <div className="px-md-3 px-lg-0 px-xl-3">
                  <Icon className="icon-svg-md text-grape mb-5" />
                  <h4>{title}</h4>
                  <p className="mb-3">{description}</p>
                  <NextLink title="Saber más" href={url} className="more hover" />
                </div>
              </div>
            ))}
          </div>
        </Fragment>
      </div>
    </section>
  );
} 