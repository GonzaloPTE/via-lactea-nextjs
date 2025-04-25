import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
// CUSTOM UTILS
import { fadeInAnimate, slideInDownAnimate } from "utils/animation";
import { ServiceItem } from "data/service-data";

interface ViaLacteaHeroServiceProps {
  service: ServiceItem;
}

export default function ViaLacteaHeroService({ service }: ViaLacteaHeroServiceProps) {
  // Mapa de colores para clases de Tailwind
  const colorMap: { [key: string]: string } = {
    'purple': 'grape',
    'aqua': 'aqua',
    'green': 'green',
    'red': 'red',
    'blue': 'blue',
    'teal': 'sky',
    'yellow': 'yellow',
    'orange': 'orange',
    'violet': 'violet',
    'pink': 'pink',
    'white': 'white',
    'transparent': 'white'
  };

  // Obtener el color de Tailwind correspondiente, o usar 'grape' como valor predeterminado
  const tailwindColor = service.color ? colorMap[service.color] || 'grape' : 'grape';

  // Mapeo de slug a imagen de hero
  const getHeroImage = (slug: string): string => {
    const imageMap: { [key: string]: string } = {
      'asesoria-big-bang': 'asesoria-big-bang-hero.png',
      'asesoria-lactancia': 'asesoria-via-lactea-hero.png',
      'valoracion-gratuita': 'valoracion-hero.png',
      'videollamada-sos': 'llamada-sos.png',
      'plan-luna': 'luna-hero.png',
      'plan-enana-blanca': 'enana-blanca-hero.png',
      'plan-sol': 'sol-hero.png',
      'plan-gigante-roja': 'gigante-roja-hero.png',
      'semana-seguimiento': 'semana-seguimiento-hero.png',
      'asesoria-grupal': 'asesoria-grupal.png'
    };

    return `/img/via-lactea/illustrations/${imageMap[slug] || 'gigante-roja-hero.png'}`;
  };

  // Obtener la ruta de la imagen basada en el slug del servicio
  const heroImagePath = getHeroImage(service.slug);

  return (
    <section className="wrapper bg-light">
      <div className="container-card">
        <div
          className="card image-wrapper bg-full bg-image bg-overlay bg-overlay-light-500 mt-2 mb-5"
          style={{ backgroundImage: "url(/img/photos/bg22.png)" }}>
          <div className="card-body py-14 px-0">
            <div className="container">
              <div className="row gx-md-8 gx-xl-12 gy-10 align-items-center text-center text-lg-start">
                <div className="col-lg-6">
                  <h1 className="display-2 mb-4 me-xl-5 me-xxl-0" style={slideInDownAnimate("900ms")}>
                    {service.title} <span className={`text-${tailwindColor}`}>{service.categoryLabel}</span>
                  </h1>

                  <p className="lead fs-23 lh-sm mb-7 pe-xxl-15" style={slideInDownAnimate("1200ms")}>
                    {service.shortDescription}
                  </p>

                  <div style={slideInDownAnimate("1800ms")}>
                    <h4 className="fs-16 text-uppercase mb-3 mt-7">¿Para quién es?</h4>
                    <ul className="list-unstyled ps-0 mt-3">
                      {service.forWho.map((target, idx) => (
                        <li key={idx} className="d-flex align-items-start mb-2">
                          <i className={`uil uil-check text-${tailwindColor} me-2 mt-1`}></i>
                          <span className="leading-snug">{target}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={slideInDownAnimate("1500ms")}>
                    <CalendlyButton
                      text={service.price === 0 ? "Reservar gratis" : `Reservar por ${service.price}€`}
                      className={`btn btn-lg btn-${tailwindColor} rounded mt-6`}
                      calendlyUrl={service.calendlyUrl}
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <img
                    alt={service.title}
                    className="img-fluid mb-n15 transform scale-200 md:scale-[1.5]"
                    src={heroImagePath}
                    srcSet={heroImagePath}
                    style={fadeInAnimate("300ms")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
