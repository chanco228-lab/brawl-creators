import Link from "next/link";
import type { Creator } from "@/types/creator";
import PlatformIcon from "@/components/PlatformIcon";
import Avatar from "@/components/Avatar";

interface Props {
  creator: Creator;
  index: number;
}

export default function CreatorCard({ creator, index }: Props) {
  const youtubeInfo = creator.platforms.find((p) => p.name === "youtube");
  const delayClass = ["", "delay-1", "delay-2", "delay-3", "delay-4", "delay-5"][Math.min(index, 5)];

  return (
    <Link href={`/creators/${creator.id}`} className="block">
      <div className={`creator-card ${delayClass}`}>

        {/* Creator color top strip */}
        <div
          className="h-1.5"
          style={{ background: `linear-gradient(90deg, ${creator.color1}, ${creator.color2})` }}
        />

        <div className="p-5">
          {/* ── アイコン（アバター）の隣に名前 ── */}
          <div className="flex items-center gap-4 mb-4">

            {/* Avatar */}
            <Avatar
              avatar={creator.avatar}
              size={64}
              color1={creator.color1}
              color2={creator.color2}
            />

            {/* 名前 */}
            <div className="min-w-0">
              <h2
                className="text-xl leading-tight truncate"
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  color: "#1E1B2E",
                }}
              >
                {creator.name}
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ fontFamily: "'Lilita One', sans-serif", color: "#94A3B8" }}
              >
                {creator.kana}
              </p>
              {/* YouTube count */}
              {youtubeInfo && (
                <p
                  className="text-xs font-bold mt-0.5"
                  style={{ color: creator.color1, fontFamily: "'Lilita One', sans-serif" }}
                >
                  ▶ YouTube {youtubeInfo.count} {youtubeInfo.label}
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {creator.tags.map((tag) => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>

          {/* Message */}
          <p
            className="text-sm leading-relaxed line-clamp-2 mb-4"
            style={{ color: "#64748B" }}
          >
            {creator.message}
          </p>

          {/* Bottom row */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {creator.platforms.map((p) => (
                <PlatformIcon key={p.name} platform={p.name} size={28} />
              ))}
            </div>
            <span className="btn-primary text-xs">
              詳しく見る →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
