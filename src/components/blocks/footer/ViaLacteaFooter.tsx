"use client";

import { useState } from 'react';
import Link from "types/link";
// GLOBAL CUSTOM COMPONENTS
import NextLink from "components/reuseable/links/NextLink";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
import TurnstileProtection, { validateTurnstileToken } from "components/common/TurnstileProtection";
// CUSTOM DATA
import { helps, learnMore } from "data/via-lactea-footer";

// =================================================
type Footer3Props = { hiddenNewsletter?: boolean };
// =================================================

export default function ViaLacteaFooter({ hiddenNewsletter }: Footer3Props) {
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

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

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar token de Turnstile antes de enviar
    if (!validateTurnstileToken(turnstileToken)) {
      const errorElement = document.getElementById('newsletter-error');
      if (errorElement) {
        errorElement.style.display = 'block';
        errorElement.textContent = 'Error en la verificación de seguridad. Por favor, intenta nuevamente.';
      }
      return;
    }

    setSubmitting(true);
    
    const email = (document.getElementById('newsletter-email') as HTMLInputElement).value;
    if (!email) {
      setSubmitting(false);
      return;
    }
    
    try {
      // Call HubSpot API to subscribe the email to the list
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, turnstileToken }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Show success message
        const successElement = document.getElementById('newsletter-success');
        if (successElement) {
          successElement.style.display = 'block';
          successElement.textContent = 'Gracias por suscribirte a nuestro boletín';
        }
        // Clear the form
        (document.getElementById('newsletter-email') as HTMLInputElement).value = '';
        // Reset turnstile token
        setTurnstileToken(null);
      } else {
        // Show error message
        const errorElement = document.getElementById('newsletter-error');
        if (errorElement) {
          errorElement.style.display = 'block';
          errorElement.textContent = data.message || 'Ha ocurrido un error. Inténtalo de nuevo.';
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorElement = document.getElementById('newsletter-error');
      if (errorElement) {
        errorElement.style.display = 'block';
        errorElement.textContent = 'Ha ocurrido un error. Inténtalo de nuevo.';
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-navbar pt-14 pb-8">
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
                    <TurnstileProtection 
                      onTokenChange={setTurnstileToken}
                      errorElementId="newsletter-error"
                      theme="dark"
                      appearance="execute"
                    >
                      <form
                        id="newsletter-form"
                        className="validate dark-fields"
                        onSubmit={handleNewsletterSubmit}
                      >
                        <div className="input-group form-floating">
                          <input
                            type="email"
                            id="newsletter-email"
                            placeholder="Email Address"
                            className="required email form-control"
                            required
                          />
                          <label htmlFor="newsletter-email" className="position-absolute">
                            Correo Electrónico
                          </label>
                          <input
                            type="submit"
                            className="btn btn-primary"
                            value="Suscribirse"
                            disabled={submitting}
                          />
                        </div>

                        <div className="response-messages">
                          <div className="response" id="newsletter-error" style={{ display: "none", color: "#ff8b8b", marginTop: "10px" }} />
                          <div className="response" id="newsletter-success" style={{ display: "none", color: "#90ee90", marginTop: "10px" }} />
                        </div>
                      </form>
                    </TurnstileProtection>
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
                className="btn btn-primary rounded-pill"
              />
            </div>
          </div>

          <div className="col-lg-3 offset-lg-2">
            <div className="widget">
              <h3 className="h2 mb-3">Nuestros Servicios</h3>
              <ul className="list-unstyled mb-0">
                <li><NextLink title="Asesoría de Sueño" href="/sueno-infantil" className="hover" /></li>
                <li><NextLink title="Asesoría de Lactancia" href="/lactancia" className="hover" /></li>
                <li><NextLink title="Consulta Puntual" href="/consulta-puntual" className="hover" /></li>
                <li><NextLink title="Llamada SOS" href="/llamada-sos" className="hover" /></li>
                <li><NextLink title="Taller Grupal" href="/taller-grupal" className="hover" /></li>
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
          <p className="mb-2 mb-lg-0">© 2023 Vía Láctea. Todos los derechos reservados.</p>
          <NextLink title="Política de privacidad" href="/politica-privacidad" className="hover" />
        </div>
      </div>
    </footer>
  );
}
