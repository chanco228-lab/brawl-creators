import { creators } from "@/data/creators";
import CreatorCard from "@/components/CreatorCard";

export default function HomePage() {
  const ytCount  = creators.reduce((s, c) => s + c.platforms.filter((p) => p.name === "youtube").length, 0);
  const snsCount = creators.reduce((s, c) => s + c.platforms.length, 0);

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section
        className="relative pt-28 pb-16 px-4 overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, #0F3460 0%, #1A1A2E 60%, #0D0D1A 100%)",
        }}
      >
        {/* 放射光 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,185,33,0.04) 30deg, transparent 60deg, rgba(255,185,33,0.02) 120deg, transparent 150deg)",
            animation: "hero-rotate 30s linear infinite",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7 text-sm"
            style={{
              background: "linear-gradient(90deg, #FFB921, #FFE35B)",
              border: "2px solid #000",
              color: "#000",
              fontFamily: "'Lilita One', sans-serif",
            }}
          >
            <span className="float-anim inline-block">⭐</span>
            ブロスタ クリエイターまとめサイト
          </div>

          {/* Title */}
          <h1 className="mb-5 leading-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>
            <span
              className="block text-6xl sm:text-8xl"
              style={{
                color: "#FFB921",
                WebkitTextStroke: "3px #000",
                textShadow: "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 4px 8px rgba(0,0,0,0.5)",
              }}
            >
              BRAWL
            </span>
            <span
              className="block text-6xl sm:text-8xl"
              style={{
                color: "#FFFFFF",
                WebkitTextStroke: "3px #000",
                textShadow: "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
              }}
            >
              CREATORS
            </span>
          </h1>

          <p className="text-base max-w-md mx-auto mb-10 leading-relaxed" style={{ color: "#A0A0C0" }}>
            ブロスタ（Brawl Stars）で活躍するクリエイターを一挙紹介。
            <br className="hidden sm:block" />
            最新動画・SNS・クリエイターのメッセージをまとめてチェック！
          </p>

          {/* Stats */}
          <div className="flex items-stretch justify-center gap-3 flex-wrap">
            {[
              { value: creators.length, label: "クリエイター", icon: "⭐" },
              { value: ytCount,          label: "YouTube",     icon: "▶" },
              { value: snsCount,         label: "SNS総数",     icon: "◉" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "linear-gradient(180deg, #1E2A4A 0%, #16213E 100%)",
                  border: "2px solid #2A3A5A",
                  borderRadius: 14,
                  padding: "20px 28px",
                  minWidth: 100,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.4)",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Lilita One', sans-serif",
                    fontSize: 36,
                    color: "#FFB921",
                    WebkitTextStroke: "1px #000",
                    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </p>
                <p
                  className="text-xs mt-1.5"
                  style={{ color: "#A0A0C0", fontFamily: "'Lilita One', sans-serif" }}
                >
                  {s.icon} {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Creator Grid ── */}
      <section className="px-4 pt-12 pb-24 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="section-label">クリエイター一覧</span>
          <span
            className="text-sm px-3 py-0.5 rounded-full"
            style={{
              background: "rgba(255,185,33,0.15)",
              border: "1px solid rgba(255,185,33,0.3)",
              color: "#FFB921",
              fontFamily: "'Lilita One', sans-serif",
            }}
          >
            {creators.length} 人
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {creators.map((creator, i) => (
            <CreatorCard key={creator.id} creator={creator} index={i} />
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="px-4 pb-24 max-w-2xl mx-auto">
        <div className="white-card p-8 text-center">
          <p
            className="text-base mb-3"
            style={{ fontFamily: "'Lilita One', sans-serif", color: "#FFB921" }}
          >
            このサイトについて
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#A0A0C0" }}>
            BRAWL CREATORSは、ブロスタ（Brawl Stars）界隈で活躍するクリエイターの情報をまとめた非公式ファンサイトです。
            各クリエイターのYouTube・X・TikTokなどのリンクや最新情報をまとめてチェックできます。
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-8 text-center text-xs"
        style={{ borderTop: "1px solid #2A3A5A", color: "#606080" }}
      >
        <p>© 2025 BRAWL CREATORS — 非公式ファンサイト</p>
        <p className="mt-1">Brawl Stars は Supercell の登録商標です。</p>
      </footer>
    </div>
  );
}
