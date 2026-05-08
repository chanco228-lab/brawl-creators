import type { PlatformName } from "@/types/creator";

interface Props {
  platform: PlatformName;
  size?: number;
}

const CONFIGS: Record<
  PlatformName,
  { label: string; color: string; bg: string; icon: string }
> = {
  youtube:   { label: "YouTube",    color: "#DC2626", bg: "#FEE2E2", icon: "▶" },
  twitter:   { label: "X (Twitter)",color: "#2563EB", bg: "#DBEAFE", icon: "✕" },
  tiktok:    { label: "TikTok",     color: "#1A1A1A", bg: "#F3F4F6", icon: "♪" },
  twitch:    { label: "Twitch",     color: "#7C3AED", bg: "#EDE9FE", icon: "◉" },
  instagram: { label: "Instagram",  color: "#DB2777", bg: "#FCE7F3", icon: "◎" },
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
        fontSize: size * 0.44,
        fontWeight: "bold",
      }}
    >
      {config.icon}
    </span>
  );
}

export { CONFIGS };
