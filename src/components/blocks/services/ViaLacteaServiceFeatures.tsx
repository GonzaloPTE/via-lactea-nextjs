import { ServiceItem } from "data/service-data";

interface ViaLacteaServiceFeaturesProps {
  service: ServiceItem;
}

export default function ViaLacteaServiceFeatures({ service }: ViaLacteaServiceFeaturesProps) {
  return (
    <section className="wrapper bg-light">
      <div className="container py-15 py-md-17">
        {/* Service features detailed */}
        <div className="row text-center">
          <div className="col-md-10 col-lg-9 col-xxl-8 mx-auto">
            <h2 className="fs-15 text-uppercase text-muted mb-3">Características del servicio</h2>
            <h3 className="display-4 mb-3">Todo lo que incluye {service.title}</h3>
            <div className="d-flex justify-content-center align-items-center mb-7">
              <div className="text-center">
                <h3 className="mb-0">
                  <span className={`display-6 text-${service.color ? service.color : 'grape'}`}>{service.duration}</span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="row gx-lg-8 gx-xl-12 gy-8">
          {service.features.map((feature) => (
            <div className="col-md-6 col-lg-4" key={feature.id}>
              <div className="d-flex flex-row">
                <div>
                  <feature.featureIcon className={`icon-svg-md text-${service.color} me-5 mt-1`} />
                </div>

                <div>
                  <h4 className="fs-20 ls-sm">{feature.title}</h4>
                  <p className="mb-0">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
