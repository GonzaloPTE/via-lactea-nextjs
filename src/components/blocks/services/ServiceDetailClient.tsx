"use client";

import { Fragment, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ServiceItem } from "data/service-data"; // Adjust path if needed

// VIA LACTEA CUSTOM COMPONENTS (adjust paths if needed)
import ViaLacteaNavbar from "components/blocks/navbar/via-lactea/ViaLacteaNavbar";
import ViaLacteaFooter from "components/blocks/footer/ViaLacteaFooter";
import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
import ViaLacteaProcess from "components/blocks/process/ViaLacteaProcess";
import ViaLacteaHeroService from "components/blocks/hero/ViaLacteaHeroService";
import ViaLacteaServiceFeatures from "components/blocks/services/ViaLacteaServiceFeatures";

interface ServiceDetailClientProps {
  service: ServiceItem | null; // Receive service as a prop (can be null if not found initially)
}

export default function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  const router = useRouter();

  // Handle redirection if service is null (passed from server component)
  useEffect(() => {
    if (!service) {
      router.push('/servicios');
    }
  }, [service, router]);

  // If service is null initially (e.g., during routing transition before server provides it),
  // show loading or redirect immediately. The server component handles the main loading state.
  if (!service) {
     // You might want a more graceful handling or rely on the server's notFound()
     // For now, a simple loading state or null return might suffice here
     // as the main check happens server-side.
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-grape" role="status">
            <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );
     // Or return null;
  }

  // Render the actual page content using the service prop
  return (
    <Fragment>
      {/* ========== header ========== */}
      <header className="wrapper bg-soft-transparent">
        {/* Pass service prop if needed by Navbar */}
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
      {/* Pass service prop if needed by Footer */}
      <ViaLacteaFooter service={service} />
    </Fragment>
  );
} 