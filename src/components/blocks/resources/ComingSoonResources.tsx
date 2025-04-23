"use client";

import SubscriptionForm from "components/reuseable/SubscriptionForm";

export default function ComingSoonResources() {
  return (
    <div className="card bg-soft-blue rounded-0">
      <div className="card-body pt-8 pb-14">
        <div className="row text-center">
          <div className="col-xl-11 col-xxl-10 mx-auto">
            <div className="mb-6">
              <img src="/img/illustrations/i8.png" alt="Recursos en desarrollo" className="img-fluid w-15" />
            </div>
            <h2 className="fs-16 text-uppercase text-primary mb-3">Nuevos recursos en camino</h2>
            <h3 className="display-2 mb-6 px-xxl-10">Estamos preparando contenido valioso para ti</h3>
            
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <p className="lead mb-5">Déjanos tu correo y te avisaremos cuando publiquemos nuevos recursos</p>
                <SubscriptionForm 
                  theme="light"
                  colorAccent="primary"
                  btnText="Avisarme"
                  successMessage="¡Gracias! Te avisaremos cuando haya nuevos recursos disponibles."
                  errorMessage="Hubo un problema al registrar tu correo. Inténtalo de nuevo."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}