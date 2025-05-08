import CalendlyButton from "components/blocks/navbar/components/CalendlyButton";
import NextLink from "components/reuseable/links/NextLink";

interface ValacteaCTAProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonIcon?: string;
  buttonClassName?: string;
  calendlyUrl?: string;
  isCalendlyButton?: boolean;
  buttonLink?: string;
  backgroundClass?: string;
  image?: string;
}

export default function ValacteaCTA({
  title,
  subtitle,
  buttonText,
  buttonIcon = "uil uil-calendar-alt",
  buttonClassName = "btn btn-lg btn-grape rounded",
  calendlyUrl = "https://calendly.com/vialactea/valoracion-gratuita?hide_gdpr_banner=1&primary_color=605dba",
  isCalendlyButton = true,
  buttonLink = "/",
  backgroundClass = "bg-soft-primary",
  image
}: ValacteaCTAProps) {
  return (
    <div className={`card ${backgroundClass} rounded-0`}>
      <div className="card-body pt-8 pb-14">
        <div className="row text-center">
          <div className="col-xl-11 col-xxl-10 mx-auto">
            {image && (
              <div className="mb-6">
                <img src={image} alt={title} className="img-fluid w-15" />
              </div>
            )}
            <h2 className="fs-16 text-uppercase text-primary mb-3">{title}</h2>
            <h3 className="display-2 mb-9 px-xxl-10" dangerouslySetInnerHTML={{ __html: subtitle }} />
            
            {isCalendlyButton ? (
              <CalendlyButton 
                text={buttonText}
                icon={buttonIcon}
                className={buttonClassName}
                calendlyUrl={calendlyUrl}
              />
            ) : (
              <NextLink 
                title={buttonText}
                href={buttonLink}
                className={buttonClassName}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 