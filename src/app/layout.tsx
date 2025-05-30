import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from 'next/script';

import ThemeProvider from "theme/ThemeProvider";

import Progress from "components/Progress";
import ScrollCue from "components/ScrollCue";
import PageProgress from "components/common/PageProgress";

// ANIMATE CSS
import "animate.css";
// SWIPER CSS
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
// REACT VIDEO PLYR CSS
import "plyr-react/plyr.css";
// G-LIGHTBOX CSS
import "glightbox/dist/css/glightbox.css";
// SCROLL CUE CSS
import "plugins/scrollcue/scrollCue.css";
// BOOTSTRAP & CUSTOM CSS
import "assets/scss/style.scss";
// CUSTOM TESTIMONIALS CSS
import "../../public/css/custom-testimonials.css";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vía Láctea - Asesoría de Sueño Infantil y Lactancia",
  description: "Asesoría profesional en sueño infantil respetuoso y lactancia para familias que buscan descansar mejor."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={manrope.className}>
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-EVZL22V7LP"
        />
        <Script id="google-analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EVZL22V7LP');
          `}
        </Script>

        <ThemeProvider>{children}</ThemeProvider>

        {/* USED FOR SCROLL ANIMATION */}
        <ScrollCue />

        {/* USED FOR PAGE SCROLL PROGRESS BAR */}
        <PageProgress />

        {/* USED FOR PROGRESS BAR ANIMATE */}
        <Progress />

        {/* Schema.org Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://vialacteasuenoylactancia.com/#organization",
              "name": "Vía Láctea - Asesoría de Sueño Infantil y Lactancia",
              "url": "https://vialacteasuenoylactancia.com/",
              "logo": "https://vialacteasuenoylactancia.com/img/via-lactea/svg/via-lactea-logo.svg",
              "sameAs": [
                "https://www.instagram.com/vialacteasuenoylactancia/",
                "https://www.facebook.com/vialacteasuenoylactancia"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "contacto@vialacteasuenoylactancia.com",
                "contactType": "Customer Support"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
