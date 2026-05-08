import Link from "next/link";
import type { Creator } from "@/types/creator";
import PlatformIcon from "@/components/PlatformIcon";
import Avatar from "@/components/Avatar";

interface Props {
  creator: Creator;
  index: number;
}

export default function CreatorCard({ creator, index }: Props) {
  const delayClass = ["", "delay-1", "delay-2", "delay-3", "delay-4", "delay-5"][Math.min(index, 5)];

  function parseCount(str: string): number {
    if (!str) return 0;
    const s = str.replace(/,/g, "").trim();
    if (s.includes("万")) return parseFloat(s) * 10000;
    if (/[kK]$/.test(s)) return parseFloat(s) * 1000;
    return parseFloat(s) || 0;
  }
  const totalFollowers = creator.platforms.reduce((sum, p) => sum + parseCount(p.count), 0);
  const totalDisplay = totalFollowers >= 10000
    ? `${(totalFollowers / 10000).toFixed(totalFollowers % 10000 === 0 ? 0 : 1)}万`
    : totalFollowers > 0 ? totalFollowers.toLocaleString() : null;

  return (
    <Link href={`/creators/${creator.id}`} className="block">
      <div className={`creator-card ${delayClass}`}>

        {/* top accent bar */}
        <div
          style={{ height: 4, background: "linear-gradient(90deg, #FFB921, #FF6B35)" }}
        />

        <div className="p-5">
          {/* アバター + 名前 */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar
              avatar={creator.avatar}
              size={48}
              color1={creator.color1}
              color2={creator.color2}
            />
            <div className="min-w-0">
              <h2
                className="leading-tight truncate"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#1A1A1A",
                }}
              >
                {creator.name}
              </h2>
              <p style={{ fontSize: 12, color: "#9B9BB0" }}>{creator.kana}</p>
              {totalDisplay && (
                <p
                  style={{
                    fontSize: 12,
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    color: "#FF4757",
                    marginTop: 1,
                  }}
                >
                  総フォロワー {totalDisplay}
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
            className="text-sm line-clamp-2 mb-4"
            style={{ color: "#6B6B80", lineHeight: 1.7 }}
          >
            {creator.message}
          </p>

          {/* Bottom row */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {creator.platforms.map((p) => (
                <PlatformIcon key={p.name} platform={p.name} size={30} />
              ))}
            </div>
            <span className="btn-primary" style={{ fontSize: 13, padding: "8px 18px" }}>
              詳しく見る →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
