"use client";

import { useEffect, useRef } from "react";

interface Props {
  handle: string;
}

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load?: (el?: HTMLElement) => void;
      };
    };
  }
}

export default function TwitterTimeline({ handle }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load twitter widget script
    const existingScript = document.getElementById("twitter-widget-script");

    const loadWidget = () => {
      if (window.twttr?.widgets?.load && containerRef.current) {
        window.twttr.widgets.load(containerRef.current);
      }
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "twitter-widget-script";
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      script.onload = loadWidget;
      document.body.appendChild(script);
    } else {
      loadWidget();
    }
  }, [handle]);

  return (
    <div ref={containerRef} className="w-full">
      <a
        className="twitter-timeline"
        data-theme="dark"
        data-tweet-limit="3"
        data-chrome="noheader nofooter noborders"
        href={`https://x.com/${handle}`}
        style={{ display: "block" }}
      >
        Tweets by @{handle}
      </a>
      <div className="mt-4 text-center">
        <a
          href={`https://x.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
          style={{
            background: "rgba(255,255,255,0.1)",
            color: "#e2e8f0",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          ✕ Xのアカウントを見る
        </a>
      </div>
    </div>
  );
}
