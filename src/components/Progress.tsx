"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    Waypoint: any;
  }
}

export default function Progress() {
  const pathname = usePathname();

  useEffect(() => {
    const loadPlugins = async () => {
      require("plugins/waypoints");
      const ProgressBar = await import("plugins/progressbar");

      const pline = document.querySelectorAll(".progressbar.line");
      const pcircle = document.querySelectorAll(".progressbar.semi-circle");

      const destroyCallbacks: (() => void)[] = [];

      pline.forEach((e) => {
        const line = new ProgressBar.Line(e, {
          strokeWidth: 6,
          trailWidth: 6,
          duration: 3000,
          easing: "easeInOut",
          text: {
            style: {
              color: "inherit",
              position: "absolute",
              right: "0",
              top: "-30px",
              padding: 0,
              margin: 0,
              transform: null
            },
            autoStyleContainer: false
          },
          step: (_: any, line: any) => {
            line.setText(Math.round(line.value() * 100) + " %");
          }
        });

        const value = Number(e.getAttribute("data-value")) / 100;
        const waypoint = new window.Waypoint({
          element: e,
          offset: "bottom-in-view",
          handler: () => line.animate(value)
        });

        destroyCallbacks.push(() => {
          line.destroy();
          waypoint.destroy();
        });
      });

      pcircle.forEach((e) => {
        const circle = new ProgressBar.SemiCircle(e, {
          strokeWidth: 6,
          trailWidth: 6,
          duration: 2000,
          easing: "easeInOut",
          step: (_: any, circle: any) => {
            circle.setText(Math.round(circle.value() * 100));
          }
        });

        const value = Number(e.getAttribute("data-value")) / 100;
        const waypoint = new window.Waypoint({
          element: e,
          offset: "bottom-in-view",
          handler: () => circle.animate(value)
        });

        destroyCallbacks.push(() => {
          circle.destroy();
          waypoint.destroy();
        });
      });

      return () => {
        destroyCallbacks.forEach((callback) => callback());
      };
    };

    loadPlugins();

    return () => {
      loadPlugins().then((cleanup) => cleanup && cleanup());
    };
  }, [pathname]);

  return null;
}
