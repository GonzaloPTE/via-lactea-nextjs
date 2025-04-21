import { getHighlightedServices } from "data/service-data";

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
  processData?: Process;
}

export default function ViaLacteaProcess({ processData }: ViaLacteaProcessProps = {}) {
  // Si no se pasa un proceso específico, usamos el primer servicio destacado que tenga un proceso definido
  let process = processData;
  
  if (!process) {
    const highlightedServices = getHighlightedServices();
    const serviceWithProcess = highlightedServices.find(service => service.process);
    
    // Si no hay servicios destacados con proceso, no renderizamos la sección
    if (!serviceWithProcess || !serviceWithProcess.process) return null;
    
    process = serviceWithProcess.process;
  }

  return (
    <section className="wrapper bg-light">
      <div className="container py-14 py-md-16">
        <div className="row gx-lg-8 gx-xl-12 gy-10 mb-15 mb-md-17 align-items-center">
          <div className="col-lg-7">
            <figure>
              <img
                alt="proceso"
                className="w-auto"
                src="/img/photos/bg38.jpg"
              />
            </figure>
          </div>

          <div className="col-lg-5">
            <h3 className="fs-16 text-uppercase text-muted mb-3">¿Cómo Funciona?</h3>
            <h3 className="display-4 mb-6">{process.title}</h3>

            <div className="row gy-4">
              {process.steps.map((step) => (
                <div className="col-md-6" key={step.id}>
                  <h4>
                    <span className="text-grape">{step.id}.</span> {step.title}
                  </h4>
                  <p className="mb-0">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
