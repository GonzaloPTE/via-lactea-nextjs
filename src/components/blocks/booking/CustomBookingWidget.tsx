"use client";

import React, { useState, useEffect } from "react";
// En un futuro se pueden usar dayjs y otras librerias

import ServiceSummary from "./ServiceSummary";
import CalendarSelector from "./CalendarSelector";
import TimeSlotSelector from "./TimeSlotSelector";
import BookingForm, { BookingFormData } from "./BookingForm";

export default function CustomBookingWidget() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Detect timezone on mount
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(tz);
    } catch (e) {
      console.error(e);
      setTimezone("Europe/Madrid");
    }
  }, []);

  const handleBookingSubmit = async (formData: BookingFormData) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          selectedDate,
          selectedTime,
          timezone
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud al servidor");
      }

      const result = await response.json();
      if (result.success) {
        setStep(3);
      } else {
        setErrorMsg(result.error || "Ocurrió un error inesperado al procesar la reserva.");
      }
    } catch (err) {
      setErrorMsg("Error de conexión al guardar la cita. Inténtelo de nuevo más tarde.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-lg mx-auto" style={{ maxWidth: "1000px", overflow: "hidden" }}>
      <div className="row g-0 h-100">

        {/* PANEL IZQUIERDO: Resumen del Servicio */}
        <div className="col-md-5 col-lg-4 bg-light p-6 border-end d-flex flex-column h-100">
          <ServiceSummary
            title="Valoración gratuita"
            advisorName="Miriam Rubio"
            advisorImage="/img/via-lactea/photos/perfil-hero.png"
            duration="30 min"
            type="Llamada telefónica"
            price="Gratis"
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            timezone={timezone}
            description="<p class='mb-4'>🔎 <strong>Estudiaré vuestro caso</strong> detenidamente y veremos las <strong>posibles opciones</strong> durante la videollamada.</p><p class='mb-4'>👀 Si está al cuidado de dos, lo ideal es que estéis <strong>presentes ambos papás</strong> y resolver cualquier duda.</p><p class='mb-4'>🤓 ¡Y recuerda: ten a mano tus notas!</p>"
          />
        </div>

        {/* PANEL DERECHO: Flujo Interactivo */}
        <div className="col-md-7 col-lg-8 p-6 bg-white position-relative min-vh-50">
          {step === 1 && (
            <div className="animate__animated animate__fadeIn">
              <h3 className="mb-4 fs-22 fw-bold text-dark">Selecciona una fecha y hora</h3>

              <div className="row gx-lg-8 align-items-start p-4">
                <div className={`col-12 text-center transition-all ${selectedDate ? 'col-lg-7' : 'col-lg-12'} p-0`}>
                  <CalendarSelector
                    selectedDate={selectedDate}
                    onSelectDate={(date) => {
                      setSelectedDate(date);
                      setSelectedTime(null);
                    }}
                  />
                </div>

                {selectedDate && (
                  <div className="col-12 col-lg-5 mt-5 mt-lg-0 animate__animated animate__fadeInRight">
                    <TimeSlotSelector
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onSelectTime={setSelectedTime}
                      onConfirm={() => setStep(2)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate__animated animate__fadeIn">
              <button
                className="btn btn-circle btn-soft-primary btn-sm border-0 mb-4"
                onClick={() => setStep(1)}
              >
                <i className="uil uil-arrow-left"></i>
              </button>
              <h3 className="mb-4 fs-22 fw-bold text-dark">Introduzca los detalles</h3>

              {errorMsg && (
                <div className="alert alert-danger" role="alert">
                  {errorMsg}
                </div>
              )}

              <BookingForm onSubmit={handleBookingSubmit} isLoading={isSubmitting} />
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10 animate__animated animate__fadeIn">
              <i className="uil uil-check-circle text-success" style={{ fontSize: "64px" }}></i>
              <h3 className="mt-3">¡Reserva confirmada!</h3>
              <p className="text-muted">Se ha programado tu valoración gratuita.</p>
              <p>Revisa tu correo para más detalles.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
