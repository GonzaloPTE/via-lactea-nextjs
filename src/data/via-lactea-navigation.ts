// Estructura de navegación para Vía Láctea
// Basada en los requisitos definidos en la tarea TASK-002

// Enlaces principales del sitio
export const mainNavigation = [
  { id: 1, title: "Inicio", url: "/" },
  // { id: 2, title: "Sobre mí", url: "/sobre-mi" }, // TODO: Descomentar cuando esté implementada
  
  // --- Dropdown: 0-6 meses ---
  {
    id: 2, // New ID for this dropdown
    title: "0-6 meses",
    url: "#", // Set URL to # for dropdown toggle
    children: [
      { id: 31, title: "Asesoría integral Big Bang", url: "/servicios/asesoria-big-bang" },
      { id: 32, title: "Asesoría de lactancia Vía láctea", url: "/servicios/asesoria-lactancia" },
    ]
  },
  
  // --- Dropdown: 6 meses a 6 años ---
  {
    id: 4, // New ID for this dropdown
    title: "6 meses a 6 años",
    url: "#",
    children: [
      { id: 41, title: "Plan de sueño Luna", url: "/servicios/plan-luna" },
      { id: 42, title: "Plan de sueño Enana Blanca", url: "/servicios/plan-enana-blanca" },
      { id: 43, title: "Plan de sueño Sol", url: "/servicios/plan-sol" },
      { id: 44, title: "Plan de sueño Gigante Roja", url: "/servicios/plan-gigante-roja" },
    ]
  },
  
  // --- Dropdown: Servicios generales ---
  {
    id: 5, // New ID for this dropdown
    title: "Servicios generales",
    url: "#",
    children: [
       { id: 51, title: "Valoración gratuita", url: "/servicios/valoracion-gratuita" },
       { id: 52, title: "Videollamada SOS", url: "/servicios/videollamada-sos" },
       { id: 53, title: "Semana de seguimiento", url: "/servicios/semana-seguimiento" },
       { id: 54, title: "Asesorías grupales", url: "/servicios/asesoria-grupal" },
       // Link a todos los servicios puede ir aquí o como item separado
       //{ id: 59, title: "Ver todos los servicios", url: "/servicios" }
    ]
  },
  
  // { id: 12, title: "Recursos", url: "/recursos" }, // TODO: Descomentar cuando esté implementado
  // { id: 6, title: "Contacto", url: "/contacto" } 
  { id: 6, title: "Servicios y Tarifas", url: "/servicios" },
  { id: 11, title: "Blog", url: "/blog" },
];

// Información de contacto para el footer y la barra lateral móvil
export const contactInfo = {
  email: "info@via-lactea.com",
  phone: "+34 600 000 000",
  socialLinks: [
    { id: 1, title: "Instagram", url: "https://instagram.com/via-lactea", icon: "uil-instagram" },
    { id: 2, title: "Facebook", url: "https://facebook.com/via-lactea", icon: "uil-facebook-f" },
    { id: 3, title: "WhatsApp", url: "https://wa.me/34600000000", icon: "uil-whatsapp" }
  ]
};

// Enlaces para el footer
export const footerNavigation = {
  services: [
    { id: 1, title: "Asesoría de sueño infantil", url: "/servicios/plan-sol" },
    { id: 2, title: "Asesoría de lactancia", url: "/servicios/asesoria-lactancia" },
    { id: 3, title: "Valoración gratuita", url: "/servicios/valoracion-gratuita" },
    { id: 4, title: "Ver todos los servicios", url: "/servicios" }
  ],
  company: [
    { id: 1, title: "Sobre mí", url: "/sobre-mi" },
    { id: 2, title: "FAQ", url: "/faq" },
    { id: 3, title: "Recursos", url: "/recursos" }
  ],
  legal: [
    { id: 1, title: "Política de privacidad", url: "/politica-privacidad" },
    { id: 2, title: "Términos y condiciones", url: "/terminos-condiciones" }
  ]
}; 