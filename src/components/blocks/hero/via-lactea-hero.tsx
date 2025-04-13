import NextLink from "components/reuseable/links/NextLink";

export default function ViaLacteaHero() {
  return (
    <section className="wrapper bg-soft-primary">
      <div className="container pt-10 pt-lg-12 pt-xl-12 pt-xxl-10 pb-lg-10 pb-xl-10 pb-xxl-0">
        <div className="row gx-md-8 gx-xl-12 gy-10 align-items-center text-center text-lg-start">
          <div className="col-lg-6" data-cues="slideInDown" data-group="page-title" data-delay="900">
            <h1 className="display-1 mb-4 me-xl-5 mt-lg-n10">
              Asesoría profesional en <br className="d-none d-md-block d-lg-none" />
              <span className="text-grape">sueño infantil y lactancia</span>
            </h1>

            <p className="lead fs-24 lh-sm mb-7 pe-xxl-15">
              Te ayudo a recuperar el descanso familiar y <br className="d-none d-md-block d-lg-none" />
              a disfrutar plenamente de la crianza de tu bebé.
            </p>

            <div className="d-inline-flex me-2">
              <NextLink 
                href="/valoracion" 
                title={<><i className="uil uil-calendar-alt fs-25 me-2"></i> Agenda YA tu valoración GRATUITA!</>} 
                className="btn btn-lg btn-grape rounded" 
              />
            </div>
          </div>

          <div className="col-10 col-md-7 mx-auto col-lg-6 col-xl-5 ms-xl-5">
            <img
              className="img-fluid mb-n12 mb-md-n14 mb-lg-n19"
              srcSet="/img/illustrations/3d11@2x.png 2x"
              src="/img/illustrations/3d11.png"
              data-cue="fadeIn"
              data-delay="300"
              alt="3d"
            />
          </div>
        </div>
      </div>

      <figure>
        <img src="/img/photos/clouds.png" alt="Clouds" />
      </figure>
    </section>
  );
} 