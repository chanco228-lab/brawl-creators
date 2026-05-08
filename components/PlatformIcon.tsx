import type { PlatformName } from "@/types/creator";

interface Props {
  platform: PlatformName;
  size?: number;
}

const STYLES: Record<PlatformName, { label: string; color: string; bg: string }> = {
  youtube:   { label: "YouTube",    color: "#DC2626", bg: "#FEE2E2" },
  twitter:   { label: "X (Twitter)",color: "#000000", bg: "#F3F4F6" },
  tiktok:    { label: "TikTok",     color: "#1A1A1A", bg: "#F3F4F6" },
  twitch:    { label: "Twitch",     color: "#7C3AED", bg: "#EDE9FE" },
  instagram: { label: "Instagram",  color: "#DB2777", bg: "#FCE7F3" },
};

function YouTubeIcon({ size }: { size: number }) {
  return (
    <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none">
      <path
        d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.6 2.8 12 2.8 12 2.8s-4.6 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.2.7 11.5v2.1c0 2.2.3 4.4.3 4.4s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.5 22.1 12 22.2 12 22.2s4.6 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.2.3-4.4v-2.1C23.3 9.2 23 7 23 7z"
        fill="#DC2626"
      />
      <polygon points="9.7,15.5 9.7,8.5 16.3,12" fill="#FFFFFF" />
    </svg>
  );
}

function XIcon({ size }: { size: number }) {
  return (
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function TikTokIcon({ size }: { size: number }) {
  return (
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.02a8.16 8.16 0 004.77 1.52V7.1a4.85 4.85 0 01-1-.41z" />
    </svg>
  );
}

function TwitchIcon({ size }: { size: number }) {
  return (
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  );
}

function InstagramIcon({ size }: { size: number }) {
  return (
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

const ICON_MAP: Record<PlatformName, (size: number) => React.ReactNode> = {
  youtube:   (s) => <YouTubeIcon size={s} />,
  twitter:   (s) => <XIcon size={s} />,
  tiktok:    (s) => <TikTokIcon size={s} />,
  twitch:    (s) => <TwitchIcon size={s} />,
  instagram: (s) => <InstagramIcon size={s} />,
};

export default function PlatformIcon({ platform, size = 20 }: Props) {
  const style = STYLES[platform];
  return (
    <span
      title={style.label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "8px",
        background: style.bg,
        color: style.color,
        flexShrink: 0,
      }}
    >
      {ICON_MAP[platform](size)}
    </span>
  );
}

// CONFIGS for PlatformLinks (keeps icon + color info)
const CONFIGS: Record<PlatformName, { label: string; color: string; bg: string; icon: (size: number) => React.ReactNode }> = {
  youtube:   { ...STYLES.youtube,   icon: (s) => <YouTubeIcon size={s} /> },
  twitter:   { ...STYLES.twitter,   icon: (s) => <XIcon size={s} /> },
  tiktok:    { ...STYLES.tiktok,    icon: (s) => <TikTokIcon size={s} /> },
  twitch:    { ...STYLES.twitch,    icon: (s) => <TwitchIcon size={s} /> },
  instagram: { ...STYLES.instagram, icon: (s) => <InstagramIcon size={s} /> },
};

export { CONFIGS };
