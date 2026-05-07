import type { PlatformName } from "@/types/creator";

interface Props {
  platform: PlatformName;
  size?: number;
}

const CONFIGS: Record<
  PlatformName,
  { label: string; color: string; bg: string; icon: string }
> = {
  youtube:   { label: "YouTube",    color: "#FF0000", bg: "rgba(255,0,0,0.1)",     icon: "▶" },
  twitter:   { label: "X (Twitter)",color: "#000000", bg: "rgba(0,0,0,0.06)",      icon: "✕" },
  tiktok:    { label: "TikTok",     color: "#010101", bg: "rgba(0,0,0,0.06)",      icon: "♪" },
  twitch:    { label: "Twitch",     color: "#9147FF", bg: "rgba(145,71,255,0.12)", icon: "◉" },
  instagram: { label: "Instagram",  color: "#E1306C", bg: "rgba(225,48,108,0.1)", icon: "◎" },
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
        borderRadius: "50%",
        background: config.bg,
        color: config.color,
        fontSize: size * 0.48,
        fontWeight: "bold",
        border: `1.5px solid ${config.color}25`,
      }}
    >
      {config.icon}
    </span>
  );
}

export { CONFIGS };
