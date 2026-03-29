"use client";

import React, { useState } from "react";

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  babyName: string;
  babyAge: string;
  reason: string;
  honeypot: string; // Anti-spam
}

export interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  isLoading: boolean;
}

export default function BookingForm({ onSubmit, isLoading }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    babyName: "",
    babyAge: "",
    reason: "",
    honeypot: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation">
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="firstName" className="form-label fs-14 text-dark fw-bold">Nombre *</label>
          <input 
            type="text" 
            className="form-control" 
            id="firstName" 
            name="firstName" 
            required 
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="lastName" className="form-label fs-14 text-dark fw-bold">Apellido *</label>
          <input 
            type="text" 
            className="form-control" 
            id="lastName" 
            name="lastName" 
            required 
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 mt-4">
          <label htmlFor="email" className="form-label fs-14 text-dark fw-bold">Correo electrónico *</label>
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            name="email" 
            required 
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 mt-4">
          <label htmlFor="phone" className="form-label fs-14 text-dark fw-bold">Número de teléfono *</label>
          <input 
            type="tel" 
            className="form-control" 
            id="phone" 
            name="phone" 
            placeholder="+34 "
            required 
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mt-4">
          <label htmlFor="babyName" className="form-label fs-14 text-dark fw-bold">Nombre del bebé *</label>
          <input 
            type="text" 
            className="form-control" 
            id="babyName" 
            name="babyName" 
            required 
            value={formData.babyName}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mt-4">
          <label htmlFor="babyAge" className="form-label fs-14 text-dark fw-bold">¿Qué edad tiene tu peque? *</label>
          <input 
            type="text" 
            className="form-control" 
            id="babyAge" 
            name="babyAge" 
            required 
            value={formData.babyAge}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 mt-4">
          <label htmlFor="reason" className="form-label fs-14 text-dark fw-bold">
            ¿En qué puedo ayudarte? ¿Te preocupa algo de lactancia o sueño? Cuéntame en detalle tu situación *
          </label>
          <textarea 
            className="form-control" 
            id="reason" 
            name="reason" 
            rows={4} 
            required 
            value={formData.reason}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* HONEYPOT FIELD (Hidden) */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <label htmlFor="honeypot">No llenar si eres humano</label>
          <input 
            type="text" 
            id="honeypot" 
            name="honeypot" 
            tabIndex={-1} 
            autoComplete="off"
            value={formData.honeypot}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 mt-4">
          <p className="fs-13 text-muted mb-4">
            Al continuar, confirma que ha leído y está de acuerdo con las condiciones y la Política de Privacidad.
          </p>
          <button 
            type="submit" 
            className="btn btn-grape rounded w-100 fw-bold fs-16" 
            disabled={isLoading}
          >
            {isLoading ? (
               <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            Programar evento
          </button>
        </div>
      </div>
    </form>
  );
}
