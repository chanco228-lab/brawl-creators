export type PlatformName =
  | "youtube"
  | "twitter"
  | "tiktok"
  | "twitch"
  | "instagram";

export interface PlatformInfo {
  name: PlatformName;
  url: string;
  handle: string;
  count: string; // e.g. "12.5万"
  label: string; // e.g. "登録者" or "フォロワー"
}

export interface Creator {
  id: string;
  name: string;
  kana: string;
  avatar: string; // emoji or image URL
  color1: string; // theme gradient start (hex or tailwind)
  color2: string; // theme gradient end
  message: string;
  tags: string[];
  platforms: PlatformInfo[];
  youtubeChannelId?: string;
  twitterHandle?: string;
  joinedDate: string; // "2024-01"
}
