"use client";

import { PropsWithChildren } from "react";
// GLOBAL CUSTOM HOOKS
import useIsotope from "hooks/useIsotope";

// ==============================================================
interface Props extends PropsWithChildren {
  className: string;
}
// ==============================================================

export default function MasonryGrid({ className, children }: Props) {
  // USED FOR MASONRY LAYOUT
  useIsotope();

  return <div className={className}>{children}</div>;
}
