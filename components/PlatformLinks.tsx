import type { Creator } from "@/types/creator";
import { CONFIGS } from "@/components/PlatformIcon";

interface Props {
  creator: Creator;
}

const PLATFORM_LABELS: Record<string, string> = {
  youtube: "YouTube",
  twitter: "X (Twitter)",
  tiktok: "TikTok",
  twitch: "Twitch",
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
                background: `${config.color}12`,
                border: `1.5px solid ${config.color}25`,
                color: config.color,
              }}
            >
              {config.icon}
            </div>

            {/* ラベル + ハンドル */}
            <div className="flex-1 min-w-0">
              <p className="text-xs" style={{ color: "#94A3B8" }}>
                {PLATFORM_LABELS[p.name]}
              </p>
              <p
                className="text-sm truncate"
                style={{ color: "#1E1B2E", fontFamily: "'Lilita One', sans-serif" }}
              >
                {p.handle}
              </p>
            </div>

            {/* カウント */}
            <div className="text-right flex-shrink-0">
              <p
                className="text-xl"
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  color: config.color,
                }}
              >
                {p.count}
              </p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>{p.label}</p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
