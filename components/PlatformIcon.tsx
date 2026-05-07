import type { PlatformName } from "@/types/creator";

interface Props {
  platform: PlatformName;
  size?: number;
}

const CONFIGS: Record<
  PlatformName,
  { label: string; color: string; bg: string; icon: string }
> = {
  youtube:   { label: "YouTube",    color: "#FF4444", bg: "rgba(255,68,68,0.15)",    icon: "▶" },
  twitter:   { label: "X (Twitter)",color: "#E0E0E0", bg: "rgba(255,255,255,0.08)",  icon: "✕" },
  tiktok:    { label: "TikTok",     color: "#69C9D0", bg: "rgba(105,201,208,0.12)",  icon: "♪" },
  twitch:    { label: "Twitch",     color: "#9147FF", bg: "rgba(145,71,255,0.15)",   icon: "◉" },
  instagram: { label: "Instagram",  color: "#E1306C", bg: "rgba(225,48,108,0.12)",   icon: "◎" },
};

export default function PlatformIcon({ platform, size = 20 }: Props) {
  const config = CONFIGS[platform];
  return (
    <span
      title={config.label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "8px",
        background: config.bg,
        color: config.color,
        fontSize: size * 0.48,
        fontWeight: "bold",
        border: `1.5px solid ${config.color}40`,
      }}
    >
      {config.icon}
    </span>
  );
}

export { CONFIGS };
