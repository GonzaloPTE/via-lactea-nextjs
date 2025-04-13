import type { Metadata } from "next";
import { Manrope } from "next/font/google";

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

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sandbox - Modern & Multipurpose NextJS Template",
  description: "Sandbox is a beautiful and flawless site template."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <ThemeProvider>{children}</ThemeProvider>

        {/* USED FOR SCROLL ANIMATION */}
        <ScrollCue />

        {/* USED FOR PAGE SCROLL PROGRESS BAR */}
        <PageProgress />

        {/* USED FOR PROGRESS BAR ANIMATE */}
        <Progress />
      </body>
    </html>
  );
}
