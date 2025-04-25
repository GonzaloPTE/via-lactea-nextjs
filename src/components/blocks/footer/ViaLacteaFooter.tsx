"use client";

// GLOBAL CUSTOM COMPONENTS
import NextLink from "components/reuseable/links/NextLink";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
//import TurnstileProtection, { validateTurnstileToken } from "components/common/TurnstileProtection";
// CUSTOM DATA
import { ServiceItem } from "data/service-data";
import { serviceList } from "data/service-data";
import SubscriptionForm from "components/reuseable/SubscriptionForm";

// =================================================
type Footer3Props = { hiddenNewsletter?: boolean; service?: ServiceItem };
// =================================================

export default function ViaLacteaFooter({ hiddenNewsletter, service }: Footer3Props) {
  // Mapeo de color Tailwind
  const colorMap: Record<string,string> = { purple:'grape', aqua:'aqua', green:'green', red:'red', blue:'blue', teal:'sky', yellow:'yellow', orange:'orange', violet:'violet', pink:'pink' };
  const tailwindColor = service?.color ? (colorMap[service.color] || 'grape') : 'grape';

  return (
    <footer className={`bg-white pt-14 pb-8`}>
      <div className="container pb-7">
        {!hiddenNewsletter && (
          <div
            className={`card image-wrapper mb-13 bg-${tailwindColor}`}
          >
            <div className="card-body p-9 p-xl-11">
              <div className="row align-items-center gy-6">
                <div className="col-lg-7">
                  <h3 className="display-5 text-white">Suscríbete a nuestro newsletter</h3>
                  <p className="lead pe-lg-12 mb-0 text-white">
                    Recibe consejos, recursos y novedades sobre sueño infantil y lactancia directamente en tu email. 
                    No te preocupes, respetamos tu privacidad y no enviamos spam.
                  </p>
                </div>

                <div className="col-lg-5 col-xl-4 offset-xl-1">
                  <div className="newsletter-wrapper">
                    {/*<TurnstileProtection 
                      onTokenChange={setTurnstileToken}
                      errorElementId="newsletter-error"
                      theme="dark"
                      appearance="execute"
                    >*/}
                      <h5 className="mb-3 text-white">Únete a nuestra comunidad</h5>

                      <SubscriptionForm 
                        theme="dark"
                        colorAccent={tailwindColor}
                        successMessage="¡Gracias por suscribirte a nuestro newsletter!"
                        errorMessage="Hubo un problema al procesar tu solicitud. Inténtalo de nuevo."
                      />
                    {/*</TurnstileProtection>*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row gx-lg-0 gy-6">
          <div className="col-lg-4">
            <div className="widget">
              <h3 className="h2 mb-3 ">Vía Láctea</h3>
              <p className="lead mb-5">
                Te acompaño en el camino de la crianza, ofreciendo apoyo profesional en lactancia y sueño infantil 
                para que tu familia descanse mejor y disfrute más.
              </p>
              <CalendlyButton 
                text="Te llamo"
                icon="uil uil-whatsapp"
                className={`btn btn-${tailwindColor} rounded-pill`}
                calendlyUrl={service?.calendlyUrl}
              />
            </div>
          </div>

          <div className="col-lg-3 offset-lg-2">
            <div className="widget">
              <h3 className="h2 mb-3">Nuestros Servicios</h3>
              <ul className="list-unstyled mb-0">
                {serviceList.map(s => (
                  <li key={s.id} className="mb-1">
                    <NextLink
                      title={s.title}
                      href={`/servicios/${s.slug}`}
                      className="hover"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="widget">
              <h3 className="h2 mb-3">Síguenos</h3>
              <p>Sigue nuestro contenido en:</p>
              <nav className="nav social">
                <a href="https://www.instagram.com/vialacteasuenoylactancia" target="_blank" rel="noreferrer" className="me-4">
                  <i className="uil uil-instagram me-1"></i> @vialacteasuenoylactancia
                </a>
                <a href="https://www.facebook.com/profile.php?id=61575517253913" target="_blank" rel="noreferrer">
                  <i className="uil uil-facebook-f me-1"></i> Vía Láctea Sueño y Lactancia
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container pt-7">
        <div className="d-md-flex align-items-center justify-content-between">
          <p className="mb-2 mb-lg-0">© 2025 Vía Láctea. Todos los derechos reservados.</p>
          <NextLink title="Política de privacidad" href="/politica-privacidad" className="hover" />
        </div>
      </div>
    </footer>
  );
}
