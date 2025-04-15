import NextLink from "components/reuseable/links/NextLink";
import Link from "next/link";

export default function ValacteaCTAFAQ() {
  return (
    <div className="card bg-soft-primary rounded-0">
      <div className="card-body pt-8 pb-14">
        <div className="row text-center">
          <div className="col-xl-11 col-xxl-10 mx-auto">
            <h2 className="fs-16 text-uppercase text-primary mb-3">¿Tienes cualquier otra duda?</h2>
            <h3 className="display-2 mb-9 px-xxl-10">
              Agenda una valoración con nosotros totalmente <span className="underline-3 style-1 primary">gratis</span> y sin compromiso
            </h3>
            <NextLink 
                href="/valoracion" 
                title={<><i className="uil uil-calendar-alt fs-25 me-2"></i> Resuelve todas tus dudas</>} 
                className="btn btn-lg btn-grape rounded" 
              />
          </div>
        </div>
      </div>
    </div>
  );
}
