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

        {/* top strip */}
        <div
          className="h-1.5"
          style={{ background: "linear-gradient(90deg, #FFB921, #FF6B35, #F01919)" }}
        />

        <div className="p-5">
          {/* アバター + 名前 */}
          <div className="flex items-center gap-4 mb-4">
            <Avatar
              avatar={creator.avatar}
              size={64}
              color1={creator.color1}
              color2={creator.color2}
            />
            <div className="min-w-0">
              <h2
                className="text-xl leading-tight truncate"
                style={{
                  fontFamily: "'Lilita One', sans-serif",
                  color: "#FFB921",
                  WebkitTextStroke: "1px #000",
                  textShadow: "1px 1px 0 #000",
                }}
              >
                {creator.name}
              </h2>
              <p
                className="text-xs mt-0.5"
                style={{ fontFamily: "'Lilita One', sans-serif", color: "#606080" }}
              >
                {creator.kana}
              </p>
              {youtubeInfo && (
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "#F01919", fontFamily: "'Lilita One', sans-serif" }}
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
            style={{ color: "#A0A0C0" }}
          >
            {creator.message}
          </p>

          {/* Bottom row */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {creator.platforms.map((p) => (
                <PlatformIcon key={p.name} platform={p.name} size={30} />
              ))}
            </div>
            <span className="btn-primary" style={{ fontSize: 12 }}>
              詳しく見る →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
