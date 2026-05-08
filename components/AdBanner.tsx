"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle: any[];
  }
}

interface Props {
  slot: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AdBanner({ slot, className, style }: Props) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!clientId || clientId === "ca-pub-XXXXXXXXXX") return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not ready
    }
  }, [clientId]);

  if (!clientId || clientId === "ca-pub-XXXXXXXXXX") return null;

  return (
    <ins
      className={`adsbygoogle${className ? ` ${className}` : ""}`}
      style={{ display: "block", ...style }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
