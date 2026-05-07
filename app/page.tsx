import { creators } from "@/data/creators";
import CreatorCard from "@/components/CreatorCard";

export default function HomePage() {
  const ytCount  = creators.reduce((s, c) => s + c.platforms.filter((p) => p.name === "youtube").length, 0);
  const snsCount = creators.reduce((s, c) => s + c.platforms.length, 0);

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        {/* 背景：黄色グラデーション帯 */}
        <div
          className="absolute inset-x-0 top-0 h-72 -z-10"
          style={{
            background: "linear-gradient(180deg, rgba(255,185,33,0.12) 0%, rgba(244,246,255,0) 100%)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7 text-sm"
            style={{
              background: "rgba(255,185,33,0.12)",
              border: "1.5px solid rgba(255,185,33,0.35)",
              color: "#9B6500",
              fontFamily: "'Lilita One', sans-serif",
            }}
          >
            <span className="float-anim inline-block">⭐</span>
            ブロスタ クリエイターまとめサイト
          </div>

          {/* Title */}
          <h1
            className="mb-5 leading-tight"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            <span
              className="block text-6xl sm:text-8xl"
              style={{
                background: "linear-gradient(135deg, #FF8C00 0%, #FFB921 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 2px 8px rgba(255,140,0,0.2))",
              }}
            >
              BRAWL
            </span>
            <span
              className="block text-6xl sm:text-8xl"
              style={{ color: "#1E1B2E" }}
            >
              CREATORS
            </span>
          </h1>

          <p
            className="text-base max-w-md mx-auto mb-10 leading-relaxed"
            style={{ color: "#64748B" }}
          >
            ブロスタ（Brawl Stars）で活躍するクリエイターを一挙紹介。
            <br className="hidden sm:block" />
            最新動画・SNS・クリエイターのメッセージをまとめてチェック！
          </p>

          {/* Stats */}
          <div className="flex items-stretch justify-center gap-3 flex-wrap">
            {[
              { value: creators.length, label: "クリエイター", icon: "⭐", color: "#FF8C00" },
              { value: ytCount,          label: "YouTube",     icon: "▶",  color: "#FF0000" },
              { value: snsCount,         label: "SNS総数",     icon: "◉",  color: "#3D8EFF" },
            ].map((s) => (
              <div
                key={s.label}
                className="white-card px-6 py-4 min-w-[100px]"
              >
                <p
                  className="text-3xl sm:text-4xl"
                  style={{
                    fontFamily: "'Fredoka One', cursive",
                    color: s.color,
                  }}
                >
                  {s.value}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "#94A3B8", fontFamily: "'Lilita One', sans-serif" }}
                >
                  {s.icon} {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Creator Grid ── */}
      <section className="px-4 pb-24 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="section-label">クリエイター一覧</span>
          <span
            className="text-sm px-3 py-0.5 rounded-full"
            style={{
              background: "rgba(255,185,33,0.1)",
              border: "1.5px solid rgba(255,185,33,0.25)",
              color: "#9B6500",
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
            style={{
              fontFamily: "'Lilita One', sans-serif",
              color: "#1E1B2E",
            }}
          >
            このサイトについて
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
            BRAWL CREATORSは、ブロスタ（Brawl Stars）界隈で活躍するクリエイターの情報をまとめた非公式ファンサイトです。
            各クリエイターのYouTube・X・TikTokなどのリンクや最新情報をまとめてチェックできます。
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-8 text-center text-xs"
        style={{ borderTop: "1px solid #E8ECF4", color: "#94A3B8" }}
      >
        <p>© 2025 BRAWL CREATORS — 非公式ファンサイト</p>
        <p className="mt-1">Brawl Stars は Supercell の登録商標です。</p>
      </footer>
    </div>
  );
}
