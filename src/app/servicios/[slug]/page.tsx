"use client";

import { Fragment, useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getServiceBySlug, ServiceItem } from "data/service-data";

// VIA LACTEA CUSTOM COMPONENTS
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
import ViaLacteaFooter from "components/blocks/footer/ViaLacteaFooter";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
import ViaLacteaProcess from "components/blocks/process/ViaLacteaProcess";
import ViaLacteaHeroService from "components/blocks/hero/ViaLacteaHeroService";
import ViaLacteaServiceFeatures from "components/blocks/services/ViaLacteaServiceFeatures";

// Tipado para params como Promise
interface ServiceDetailParams {
  params: Promise<{ slug: string }>;
}

export default function ServiceDetail({ params }: ServiceDetailParams) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    // Obtener el servicio correspondiente al slug
    const serviceData = getServiceBySlug(slug as string);
    setService(serviceData || null);
    setLoading(false);
  }, [slug]);

  // Manejar la redirección si el servicio no existe
  useEffect(() => {
    if (!loading && !service) {
      router.push('/servicios');
    }
  }, [loading, service, router]);

  // Si está cargando o no hay servicio, mostrar pantalla de carga
  if (loading || !service) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-grape" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      {/* ========== header ========== */}
      <header className="wrapper bg-soft-transparent">
        <ViaLacteaNavbar button={<CalendlyButton />} whiteBackground={true} service={service} />
      </header>

      {/* ========== main content ========== */}
      <main className="content-wrapper">
        {/* ========== hero section ========== */}
        <ViaLacteaHeroService service={service} />

        {/* ========== service features section ========== */}
        <ViaLacteaServiceFeatures service={service} />
        
        {/* ========== process section ========== */}
        <ViaLacteaProcess service={service} />
      </main>

      {/* ========== footer ========== */}
      <ViaLacteaFooter service={service} />
    </Fragment>
  );
} 