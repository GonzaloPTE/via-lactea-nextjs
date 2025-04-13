// Estructura de navegación para Vía Láctea
// Basada en los requisitos definidos en la tarea TASK-002

// Enlaces principales del sitio
export const mainNavigation = [
  { id: 1, title: "Inicio", url: "/" },
  { id: 2, title: "Sobre mí", url: "/sobre-mi" },
  {
    id: 3,
    title: "Servicios",
    url: "/servicios",
    children: [
      { id: 31, title: "Asesoría de sueño infantil", url: "/servicios/sueno-infantil" },
      { id: 32, title: "Asesoría de lactancia", url: "/servicios/lactancia" }
    ]
  },
  { id: 4, title: "Blog", url: "/blog" },
  { id: 5, title: "Testimonios", url: "/testimonios" },
  { id: 6, title: "Recursos", url: "/recursos" },
  { id: 7, title: "Contacto", url: "/contacto" }
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
    { id: 1, title: "Asesoría de sueño infantil", url: "/servicios/sueno-infantil" },
    { id: 2, title: "Asesoría de lactancia", url: "/servicios/lactancia" }
  ],
  company: [
    { id: 1, title: "Sobre mí", url: "/sobre-mi" },
    { id: 2, title: "Testimonios", url: "/testimonios" },
    { id: 3, title: "FAQ", url: "/faq" }
  ],
  legal: [
    { id: 1, title: "Política de privacidad", url: "/politica-privacidad" },
    { id: 2, title: "Términos y condiciones", url: "/terminos-condiciones" }
  ]
}; 