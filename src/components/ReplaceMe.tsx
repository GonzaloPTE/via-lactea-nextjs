"use client";

import { PropsWithChildren, useEffect } from "react";

// ==============================================================
interface Props extends PropsWithChildren {
  className: string;
}
// ==============================================================

export default function ReplaceMe({ className, children }: Props) {
  useEffect(() => {
    let replace: any;

    const options = {
      speed: 2500,
      separator: ",",
      clickChange: false,
      loopCount: "infinite"
    };

    (() => {
      const ReplaceMe = require("plugins/replaceme");

      if (document.querySelector(".rotator-zoom") !== null) {
        replace = new ReplaceMe(document.querySelector(".rotator-zoom"), {
          ...options,
          animation: "animate__animated animate__zoomIn"
        });
      }
      if (document.querySelector(".rotator-fade") !== null) {
        replace = new ReplaceMe(document.querySelector(".rotator-fade"), {
          ...options,
          animation: "animate__animated animate__fadeInDown"
        });
      }
    })();

    return () => replace?.stop();
  }, []);

  return <span className={className}>{children}</span>;
}
