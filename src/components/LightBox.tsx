"use client";

import { useEffect, useCallback } from "react";

export default function LightBox() {
  const lightboxLoad = useCallback(async () => {
    const { default: GLightbox } = await import("glightbox");

    const lightbox = GLightbox({
      loop: false,
      moreLength: 0,
      zoomable: false,
      autoplayVideos: true,
      touchNavigation: true,
      selector: "*[data-glightbox]",
      plyr: {
        config: {
          fullscreen: { enabled: false, iosNative: false },
          youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3 },
          vimeo: { byline: false, portrait: false, title: false, transparent: false }
        }
      }
    });

    return () => lightbox?.destroy();
  }, []);

  useEffect(() => {
    const cleanup = lightboxLoad();

    return () => {
      cleanup.then((dispose) => dispose && dispose());
    };
  }, [lightboxLoad]);

  return null;
}
