import { getHighlightedServices, ServiceItem } from "data/service-data";

interface ProcessStep {
  id: number;
  title: string;
  description: string;
}

interface Process {
  title: string;
  steps: ProcessStep[];
}

interface ViaLacteaProcessProps {
  service: ServiceItem;
}

export default function ViaLacteaProcess({ service }: ViaLacteaProcessProps) {
  // Extraer proceso y color del servicio
  let process = service.process;
  let serviceColor = service.color;
  
  // Si no existe proceso en el servicio, intentar obtener uno destacado
  if (!process) {
    const highlightedServices = getHighlightedServices();
    const serviceWithProcess = highlightedServices.find(s => s.process);
    if (!serviceWithProcess?.process) return null;
    process = serviceWithProcess.process;
    serviceColor = serviceWithProcess.color;
  }

  // Map color key to Tailwind
  const colorMap: Record<string,string> = { purple:'grape', aqua:'aqua', green:'green', red:'red', blue:'blue', teal:'sky', yellow:'yellow', orange:'orange', violet:'violet', pink:'pink' };
  const tailwindColor = serviceColor ? (colorMap[serviceColor] || 'grape') : 'grape';

  return (
    <section className={`wrapper bg-soft-${tailwindColor}`}>
      
      <figure>
        <img src="/img/photos/clouds.png" alt="" style={{ transform: 'scaleY(-1)' }} />
      </figure>
      <div className="container py-12">
        <div className="row gx-lg-8 gx-xl-12 gy-10 mb-15 mb-md-17 align-items-center">
          <div className="col-lg-7">
            <figure>
              <img
                alt="Pasos del proceso de asesoría Vía Láctea"
                className="w-auto"
                src="/img/via-lactea/illustrations/pasos-proceso.png"
              />
            </figure>
          </div>

          <div className="col-lg-5">
            <h3 className={`fs-16 text-uppercase text-${tailwindColor} mb-3`}>¿Cómo Funciona?</h3>
            <h3 className="display-4 mb-6">{process.title}</h3>

            <div className="row gy-4">
              {process.steps.map((step) => (
                <div className="col-md-6" key={step.id}>
                  <h4>
                    <span className={`text-${tailwindColor}`}>{step.id}.</span> {step.title}
                  </h4>
                  <p className="mb-0">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <figure>
        <img src="/img/photos/clouds.png" alt="" />
      </figure>
    </section>
  );
}
