"use client";

import { useState } from "react";

interface SubscriptionFormProps {
  theme?: "light" | "dark";
  colorAccent?: string;
  btnText?: string;
  placeholderText?: string;
  successMessage?: string;
  errorMessage?: string;
  onSubmit?: (email: string) => Promise<boolean>;
}

export default function SubscriptionForm({
  theme = "light",
  colorAccent = "primary",
  btnText = "Suscribirse",
  placeholderText = "Correo Electrónico",
  successMessage = "¡Te avisaremos cuando haya nuevos recursos!",
  errorMessage = "Por favor, introduce un correo electrónico válido",
  onSubmit
}: SubscriptionFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState(errorMessage);

  const textColor = theme === "dark" ? "text-white" : "text-body";
  const placeholderColor = theme === "dark" ? "placeholder-white" : "";

  const submitToHubSpot = async (email: string): Promise<boolean> => {
    try {
      // Llamada a la API de HubSpot
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return true;
      } else {
        setErrorText(data.message || errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Error al suscribirse:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setShowSuccess(false);
    setShowError(false);
    setErrorText(errorMessage);

    const form = e.currentTarget;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
    const email = emailInput?.value;

    if (!email || !email.includes('@')) {
      setShowError(true);
      setSubmitting(false);
      return;
    }

    try {
      let success = false;
      
      // Si hay una función onSubmit personalizada, usamos esa
      if (onSubmit) {
        success = await onSubmit(email);
      } else {
        // Si no, usamos la llamada estándar a HubSpot
        success = await submitToHubSpot(email);
      }
      
      if (success) {
        setShowSuccess(true);
        emailInput.value = '';
      } else {
        setShowError(true);
      }
    } catch (error) {
      setShowError(true);
      console.error("Error al enviar el formulario:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={`validate ${theme}-fields`} onSubmit={handleSubmit}>
      <div className="input-group form-floating">
        <input
          type="email"
          id="subscription-email"
          placeholder="Email Address"
          className={`required email form-control ${textColor} ${placeholderColor}`}
          required
        />
        <label htmlFor="subscription-email" className={`position-absolute ${textColor}`}>
          {placeholderText}
        </label>
        <input
          type="submit"
          className={`btn btn-soft-${colorAccent}`}
          value={btnText}
          disabled={submitting}
        />
      </div>

      <div className="response-messages mt-2">
        {showError && (
          <div className="response" style={{ color: "#ff8b8b", marginTop: "10px" }}>
            {errorText}
          </div>
        )}
        {showSuccess && (
          <div className="response" style={{ color: "#90ee90", marginTop: "10px" }}>
            {successMessage}
          </div>
        )}
      </div>
    </form>
  );
} 