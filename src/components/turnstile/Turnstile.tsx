"use client";

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
    };
  }
}

interface TurnstileProps {
  siteKey?: string;
  onVerify: (token: string) => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
  className?: string;
  appearance?: 'always' | 'execute' | 'interaction-only';
}

export default function Turnstile({
  siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
  onVerify,
  theme = 'dark',
  size = 'normal',
  className = '',
  appearance = 'execute'
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);

  useEffect(() => {
    // Cargar el script de Turnstile si no está ya cargado
    if (!window.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Renderizar el widget cuando el script esté cargado
    const renderWidget = () => {
      if (window.turnstile && containerRef.current && siteKey) {
        // Si ya existe un widget, resetear
        if (widgetId) {
          window.turnstile.reset(widgetId);
        }

        // Renderizar nuevo widget
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          theme: theme,
          size: size,
          'refresh-expired': 'auto',
          appearance: appearance
        });
        setWidgetId(id);
      }
    };

    // Intentar renderizar inmediatamente, o esperar a que el script cargue
    if (window.turnstile) {
      renderWidget();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      // Limpiar al desmontar
      if (widgetId && window.turnstile) {
        window.turnstile.reset(widgetId);
      }
    };
  }, [siteKey, onVerify, theme, size, appearance]);

  return <div ref={containerRef} className={className} />;
} 