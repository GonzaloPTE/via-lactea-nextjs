"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export default function ScrollCue({ children }: PropsWithChildren) {
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const scrollCue = (await import("plugins/scrollcue")).default;
      scrollCue.init({ interval: -400, duration: 700, percentage: 0.8 });
      if (pathname) scrollCue.update();

      return () => {
        scrollCue.enable(false);
      };
    })();
  }, [pathname]);

  return <>{children}</>;
}
