import { Fragment } from "react";
import Accordion from "components/reuseable/accordion";
// CUSTOM DATA
import { viaLacteaFAQList1 } from "data/via-lactea-faq";
import ValacteaCTAFAQ from "../call-to-action/ValacteaCTAFAQ";

export default function ViaLacteaFAQ() {
  return (
    <section className="wrapper bg-soft-primary">
      <div className="container pt-16">
        <h2 className="fs-15 text-uppercase text-primary mb-3 text-center">Preguntas Frecuentes</h2>
        <h3 className="display-4 mb-10 px-lg-12 px-xl-15 text-center">
          Si no ves una respuesta a tu pregunta, puedes enviarnos un correo electrónico desde nuestro formulario de contacto.
        </h3>

        <div className="accordion-wrapper" id="accordion">
          <div className="row">
            {viaLacteaFAQList1.map((items, i) => (
              <div className="col-md-6" key={i}>
                {items.map((item) => (
                  <Accordion key={item.no} {...item} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <ValacteaCTAFAQ />
    </section>
  );
}
