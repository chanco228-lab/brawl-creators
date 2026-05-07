import type { Creator } from "@/types/creator";
import { CONFIGS } from "@/components/PlatformIcon";

interface Props {
  creator: Creator;
}

const PLATFORM_LABELS: Record<string, string> = {
  youtube:   "YouTube",
  twitter:   "X (Twitter)",
  tiktok:    "TikTok",
  twitch:    "Twitch",
  instagram: "Instagram",
};

export default function PlatformLinks({ creator }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {creator.platforms.map((p) => {
        const config = CONFIGS[p.name];
        return (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="platform-badge flex items-center gap-3 p-3.5"
          >
            {/* アイコン */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{
                background: config.bg,
                border: `1.5px solid ${config.color}40`,
                color: config.color,
              }}
            >
              {config.icon}
            </div>

            {/* ラベル + ハンドル */}
            <div className="flex-1 min-w-0">
              <p className="text-xs" style={{ color: "#606080" }}>
                {PLATFORM_LABELS[p.name]}
              </p>
              <p
                className="text-sm truncate"
                style={{ color: "#FFFFFF", fontFamily: "'Lilita One', sans-serif" }}
              >
                {p.handle}
              </p>
            </div>

            {/* カウント */}
            <div className="text-right flex-shrink-0">
              <p
                className="text-xl"
                style={{
                  fontFamily: "'Lilita One', sans-serif",
                  color: "#FFB921",
                }}
              >
                {p.count}
              </p>
              <p className="text-xs" style={{ color: "#606080" }}>{p.label}</p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
