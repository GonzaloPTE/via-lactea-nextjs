import NextLink from "components/reuseable/links/NextLink";

export default function ResourcesSubscriptionCTA() {
  return (
    <div className="container">
      <div
        className="card image-wrapper bg-full bg-image bg-overlay bg-overlay-300 mb-14"
        style={{ backgroundImage: "url(/img/photos/bg16.png)" }}>
        <div className="card-body p-10 p-xl-12">
          <div className="row text-center">
            <div className="col-xl-11 col-xxl-9 mx-auto">
              <h2 className="fs-16 text-uppercase text-white mb-3">Suscripción Premium</h2>
              <h3 className="display-3 mb-8 px-lg-8 text-white">
                Accede a <span className="underline-3 style-2 yellow">todos los recursos</span> con nuestra suscripción mensual
              </h3>
              <p className="lead fs-18 text-white mb-7 px-md-10 px-lg-0">
                Disfruta de todos nuestros recursos, guías y herramientas para apoyarte en el sueño y lactancia de tu bebé
                por un precio mensual accesible.
              </p>
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <NextLink 
              href="/suscripcion" 
              title="Suscribirme ahora" 
              className="btn btn-white btn-lg rounded" 
            />
          </div>
        </div>
      </div>
    </div>
  );
} 