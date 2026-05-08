import { creators } from "@/data/creators";
import CreatorCard from "@/components/CreatorCard";

export default function HomePage() {
  const ytCount  = creators.reduce((s, c) => s + c.platforms.filter((p) => p.name === "youtube").length, 0);
  const snsCount = creators.reduce((s, c) => s + c.platforms.length, 0);

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>

      {/* ── Hero ── */}
      <section className="pt-28 pb-16 px-4 text-center" style={{ background: "#FAFAFA" }}>
        <div className="max-w-3xl mx-auto">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm"
            style={{
              background: "#FFF3D6",
              color: "#B87800",
              fontFamily: "'Noto Sans JP', sans-serif",
              fontWeight: 500,
            }}
          >
            <span className="float-anim inline-block">⭐</span>
            ブロスタ クリエイターまとめサイト
          </div>

          {/* Title */}
          <h1
            className="mb-4"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(40px, 8vw, 72px)",
              letterSpacing: "-1px",
              color: "#1A1A1A",
              lineHeight: 1.2,
            }}
          >
            <span style={{ color: "#FFB921" }}>BRAWL</span>{" "}
            CREATORS
          </h1>

          <p
            className="text-base max-w-md mx-auto mb-10 leading-relaxed"
            style={{ color: "#6B6B80" }}
          >
            ブロスタ（Brawl Stars）で活躍するクリエイターを一挙紹介。
            <br className="hidden sm:block" />
            最新動画・SNS・クリエイターのメッセージをまとめてチェック！
          </p>

          {/* Stats */}
          <div className="flex items-stretch justify-center gap-4 flex-wrap">
            {[
              { value: creators.length, label: "クリエイター", icon: "⭐" },
              { value: ytCount,          label: "YouTube",     icon: "▶" },
              { value: snsCount,         label: "SNS総数",     icon: "◉" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E8E8ED",
                  borderRadius: 14,
                  padding: "20px 32px",
                  minWidth: 100,
                  textAlign: "center",
                  transition: "border-color 0.2s",
                }}
                className="hover:border-brand"
              >
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: 32,
                    color: "#FFB921",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </p>
                <p
                  className="text-xs mt-1.5"
                  style={{ color: "#9B9BB0", fontFamily: "'Noto Sans JP', sans-serif" }}
                >
                  {s.icon} {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Creator Grid ── */}
      <section className="px-4 pt-10 pb-24 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <h2
            className="section-label"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#1A1A1A" }}
          >
            クリエイター一覧
          </h2>
          <span
            className="text-sm px-3 py-0.5 rounded-full"
            style={{
              background: "#FFF3D6",
              color: "#B87800",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
            }}
          >
            {creators.length} 人
          </span>
          <div className="flex-1 h-px" style={{ background: "#E8E8ED" }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {creators.map((creator, i) => (
            <CreatorCard key={creator.id} creator={creator} index={i} />
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="px-4 pb-24 max-w-2xl mx-auto">
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E8ED",
            borderRadius: 20,
            padding: "32px",
            textAlign: "center",
          }}
        >
          <p
            className="text-base mb-3"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "#1A1A1A" }}
          >
            このサイトについて
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#6B6B80" }}>
            BRAWL CREATORSは、ブロスタ（Brawl Stars）界隈で活躍するクリエイターの情報をまとめた非公式ファンサイトです。
            各クリエイターのYouTube・X・TikTokなどのリンクや最新情報をまとめてチェックできます。
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-8 text-center text-xs"
        style={{ borderTop: "1px solid #E8E8ED", color: "#9B9BB0" }}
      >
        <p>© 2025 BRAWL CREATORS — 非公式ファンサイト</p>
        <p className="mt-1">Brawl Stars は Supercell の登録商標です。</p>
      </footer>
    </div>
  );
}
