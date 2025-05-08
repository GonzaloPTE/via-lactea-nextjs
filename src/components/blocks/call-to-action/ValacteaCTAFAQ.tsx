import ValacteaCTA from "./ValacteaCTA";

export default function ValacteaCTAFAQ() {
  return (
    <ValacteaCTA
      title="¿Tienes cualquier otra duda?"
      subtitle='Agenda una valoración con nosotros totalmente <span class="underline-3 style-1 primary">gratis</span> y sin compromiso'
      buttonText="Resuelve todas tus dudas"
      buttonIcon="uil uil-calendar-alt"
      buttonClassName="btn btn-lg btn-grape rounded"
      calendlyUrl="https://calendly.com/vialactea/valoracion-gratuita?hide_gdpr_banner=1&primary_color=605dba"
      isCalendlyButton={true}
    />
  );
}
