import React from "react";

export interface ServiceSummaryProps {
  title: string;
  advisorName: string;
  advisorImage: string;
  duration: string;
  type: string;
  price?: string;
  selectedDate: Date | null;
  selectedTime: string | null;
  timezone: string;
  description: string;
}

export default function ServiceSummary({
  title,
  advisorName,
  advisorImage,
  duration,
  type,
  price = "Gratis",
  selectedDate,
  selectedTime,
  timezone,
  description,
}: ServiceSummaryProps) {
  return (
    <div className="d-flex flex-column h-100">
      <div className="text-center mb-4 d-none d-md-block">
        <img
          src="/img/via-lactea/svg/via-lactea-logo.svg"
          alt="Vía Láctea"
          style={{ maxHeight: "200px", objectFit: "contain" }}
        />
      </div>

      <hr className="d-none d-md-block mb-5" />

      <div className="d-flex align-items-center mb-5">
        <div className="avatar me-3">
          <img
            src={advisorImage}
            alt={advisorName}
            className="rounded-circle img-fluid shadow-sm"
            style={{ width: "70px", height: "70px", objectFit: "cover" }}
          />
        </div>
        <div>
          <p className="mb-0 fs-15 fw-bold text-muted">{advisorName}</p>
          <h3 className="mb-0 fs-20 fw-bolder text-dark">{title}</h3>
        </div>
      </div>

      <ul className="list-unstyled flex-grow-1 fs-16 text-dark fw-medium">
        <li className="mb-3 d-flex align-items-center">
          <i className="uil uil-clock fs-22 me-2 text-grape"></i>
          <span>{duration}</span>
        </li>
        <li className="mb-3 d-flex align-items-center">
          <i className="uil uil-phone fs-22 me-2 text-grape"></i>
          <span>{type}</span>
        </li>
        {price !== "Gratis" && (
          <li className="mb-3 d-flex align-items-center">
            <i className="uil uil-euro fs-22 me-2 text-grape"></i>
            <span>{price}</span>
          </li>
        )}

        {selectedDate && selectedTime && (
          <li className="mb-3 d-flex align-items-start">
            <i className="uil uil-calendar-alt fs-22 me-2 text-grape"></i>
            <span>
              {selectedTime}, {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </li>
        )}

        <li className="mb-3 d-flex align-items-start">
          <i className="uil uil-globe fs-22 me-2 text-grape"></i>
          <span>{timezone || "Cargando zona horaria..."}</span>
        </li>
      </ul>

      <div className="mt-4 pt-4 border-top">
        <h5 className="fs-18 fw-bold mb-3 d-flex align-items-center">
          ¿Qué haremos?
        </h5>
        <div className="fs-15 mb-0 text-dark" dangerouslySetInnerHTML={{ __html: description }}>
        </div>
      </div>
    </div>
  );
}
