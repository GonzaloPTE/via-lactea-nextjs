export default function ViaLacteaContact() {
  return (
    <section className="wrapper bg-white">
      <div className="container pt-15">
        <div className="row gx-3 gy-10 mb-8 mb-md-10 align-items-center">
          <div className="col-lg-6">
            <figure>
              <img
                alt=""
                className="w-auto rounded-4"
                src="/img/via-lactea/photos/social-media-instagram.jpg"
                srcSet="/img/via-lactea/photos/social-media-instagram.jpg 2x"
              />
            </figure>
          </div>

          <div className="col-lg-5 offset-lg-1">
            <h2 className="fs-16 text-uppercase text-primary mb-3">Para cualquier cosa más que necesites...</h2>
            <h3 className="display-4 mb-8">Sígueme en las redes!</h3>
            <div className="d-flex flex-row">
              <div>
                <i className="uil uil-instagram fs-28 text-grape me-4 mt-n1"></i>
              </div>

              <div>
                <h5 className="mb-0">Instagram</h5>
                <p className="mb-3">
                  <a href="https://www.instagram.com/vialacteasuenoylactancia/" target="_blank" rel="noreferrer" className="link-body">
                    @vialacteasuenoylactancia
                  </a>
                </p>
              </div>
            </div>

            <div className="d-flex flex-row">
              <div>
                <i className="uil uil-facebook-f fs-28 text-grape me-4 mt-n1"></i>
              </div>

              <div>
                <h5 className="mb-0">Facebook</h5>
                <p className="mb-3">
                  <a href="https://www.facebook.com/vialacteasuenoylactancia" target="_blank" rel="noreferrer" className="link-body">
                    Vía Láctea - Sueño y Lactancia
                  </a>
                </p>
              </div>
            </div>
            
            {/* Email and Whatsapp Section */}
            {/*
            <div className="d-flex flex-row">
              <div>
                <i className="uil uil-envelope fs-28 text-grape me-4 mt-n1"></i>
              </div>

              <div>
                <h5 className="mb-0">Email</h5>
                <p className="mb-3">
                  <a href="/contacto" className="link-body">
                    Contacta conmigo
                  </a>
                </p>
              </div>
            </div>

            <div className="d-flex flex-row">
              <div>
                <i className="uil uil-whatsapp fs-28 text-grape me-4 mt-n1"></i>
              </div>

              <div>
                <h5 className="mb-0">WhatsApp</h5>
                <p className="mb-0">
                  <a href="https://wa.me/34600000000" target="_blank" rel="noreferrer" className="link-body">
                    Envíame un mensaje
                  </a>
                </p>
              </div>
            </div>
            */}
          </div>
        </div>
      </div>
    </section>
  );
}
