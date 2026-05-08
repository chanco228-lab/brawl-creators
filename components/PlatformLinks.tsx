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
            className="platform-badge flex items-center gap-3 p-4"
          >
            {/* アイコン */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: config.bg,
                color: config.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: "bold",
                flexShrink: 0,
              }}
            >
              {config.icon}
            </div>

            {/* ラベル + ハンドル */}
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 12, color: "#9B9BB0" }}>
                {PLATFORM_LABELS[p.name]}
              </p>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#1A1A1A",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {p.handle}
              </p>
            </div>

            {/* カウント */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  color: "#1A1A1A",
                  lineHeight: 1.2,
                }}
              >
                {p.count}
              </p>
              <p style={{ fontSize: 11, color: "#9B9BB0" }}>{p.label}</p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
