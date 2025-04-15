import Link from "types/link";
// GLOBAL CUSTOM COMPONENTS
import NextLink from "components/reuseable/links/NextLink";
import SocialLinks from "components/reuseable/SocialLinks";
// CUSTOM DATA
import { helps, learnMore } from "data/via-lactea-footer";

// =================================================
type Footer3Props = { hiddenNewsletter?: boolean };
// =================================================

export default function ViaLacteaFooter({ hiddenNewsletter }: Footer3Props) {
  // common links section
  const widget = (list: Link[], title: string) => {
    return (
      <div className="widget">
        <h4 className="widget-title  mb-3">{title}</h4>
        <ul className="list-unstyled text-reset mb-0">
          {list.map(({ url, title, id }) => (
            <li key={id}>
              <NextLink href={url} title={title} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <footer className="bg-gradient-reverse-primary">
      <div className="container pb-7">
        {!hiddenNewsletter && (
          <div
            className="card image-wrapper bg-full bg-image bg-overlay bg-overlay-400 mb-13"
            style={{ backgroundImage: "url(/img/photos/bg2.jpg)" }}>
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
                    <div id="mc_embed_signup2">
                      <form
                        action="https://elemisfreebies.us20.list-manage.com/subscribe/post?u=aa4947f70a475ce162057838d&amp;id=b49ef47a9a"
                        method="post"
                        id="mc-embedded-subscribe-form2"
                        name="mc-embedded-subscribe-form"
                        className="validate dark-fields"
                        target="_blank">
                        <div id="mc_embed_signup_scroll2">
                          <div className="mc-field-group input-group form-floating">
                            <input
                              type="email"
                              name="EMAIL"
                              id="mce-EMAIL2"
                              placeholder="Email Address"
                              className="required email form-control"
                            />
                            <label htmlFor="mce-EMAIL2" className="position-absolute">
                              Correo Electrónico
                            </label>
                            <input
                              type="submit"
                              name="subscribe"
                              id="mc-embedded-subscribe2"
                              className="btn btn-primary"
                            />
                          </div>

                          <div id="mce-responses2" className="clear">
                            <div className="response" id="mce-error-response2" style={{ display: "none" }} />
                            <div className="response" id="mce-success-response2" style={{ display: "none" }} />
                          </div>

                          <div style={{ position: "absolute", left: -5000 }} aria-hidden="true">
                            <input type="text" name="b_ddc180777a163e0f9f66ee014_4b1bcfa0bc" tabIndex={-1} />
                          </div>

                          <div className="clear" />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row gy-6 gy-lg-0">
          <div className="col-lg-4">
            <div className="widget">
              <h3 className="h2 mb-3 ">Vía Láctea</h3>
              <p className="lead mb-5">
                Te acompaño en el camino de la crianza, ofreciendo apoyo profesional en lactancia y sueño infantil 
                para que tu familia descanse mejor y disfrute más.
              </p>
              <NextLink 
                title={<><i className="uil uil-whatsapp me-1"></i> Te llamo</>} 
                href="/contacto" 
                className="btn btn-primary rounded-pill" 
              />
            </div>
          </div>

          <div className="col-md-4 col-lg-2 offset-lg-2">{widget(helps, "Ayuda")}</div>

          <div className="col-md-4 col-lg-2">{widget(learnMore, "Servicios")}</div>

          <div className="col-md-4 col-lg-2">
            <div className="widget">
              <h4 className="widget-title  mb-3">Contacto</h4>
              <address>Madrid, España</address>
              <a href="mailto:info@vialactea.com" className="link-body">
                info@vialactea.com
              </a>
              <br /> WhatsApp: 600 000 000
            </div>
          </div>
        </div>

        <hr className="mt-13 mt-md-15 mb-7" />

        <div className="d-md-flex align-items-center justify-content-between">
          <p className="mb-2 mb-lg-0">© 2025 Vía Láctea. Todos los derechos reservados.</p>
          <SocialLinks className="nav social  text-md-end" />
        </div>
      </div>
    </footer>
  );
}
