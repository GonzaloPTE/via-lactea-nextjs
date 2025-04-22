import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";

export default function ViaLacteaHero() {
  return (
    <section className="wrapper bg-soft-primary">
      <div className="container pt-12 pt-lg-12 pt-xl-10 pt-xxl-10 pb-lg-10 pb-xl-10 pb-xxl-0">
        <div className="row gx-md-8 gx-xl-12 gy-10 align-items-center text-center text-lg-start mb-15">
          <div className="col-lg-6" data-cues="slideInDown" data-group="page-title" data-delay="900">
            <h1 className="display-1 mb-4 me-xl-5 mt-lg-8">
              Asesoría profesional en <br className="d-none d-md-block d-lg-none" />
              <span className="text-grape">sueño infantil y lactancia</span>
            </h1>

            <p className="lead fs-24 lh-sm mb-7 pe-xxl-15">
              Te ayudo a recuperar el descanso familiar y <br className="d-none d-md-block d-lg-none" />
              a disfrutar plenamente de la crianza de tu bebé.
            </p>

            <div className="d-inline-flex me-2">
              <CalendlyButton 
                text="Agenda YA tu valoración GRATUITA"
                icon="uil uil-calendar-alt"
                className="btn btn-lg btn-grape rounded"
              />
            </div>
          </div>

          <div className="col-10 col-md-7 mx-auto col-lg-6 col-xl-5 ms-xl-5 mt-13 position-relative">
            <div className="img-mask mask-3" style={{ transform: 'scale(1.3)', transformOrigin: 'center center' }}>
                <img
                className="img-fluid"
                srcSet="/img/via-lactea/photos/perfil-hero.png"
                src="/img/via-lactea/photos/perfil-hero.png"
                data-cue="fadeIn"
                data-delay="300"
                alt="3d"
                />
            </div>
          </div>
        </div>
      </div>

      <figure>
        <img src="/img/photos/clouds.png" alt="Clouds" />
      </figure>
    </section>
  );
} 