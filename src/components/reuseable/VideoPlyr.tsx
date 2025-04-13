"use client";

import dynamic from "next/dynamic";
import { PlyrProps } from "plyr-react";

const Plyr = dynamic(() => import("plyr-react"), { ssr: false });

export default function VideoPlyr(props: PlyrProps) {
  return <Plyr {...props} />;
}
