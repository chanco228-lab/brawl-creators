import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "linear-gradient(180deg, #1E2A4A 0%, #16213E 100%)",
        borderBottom: "3px solid #FFB921",
        boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl float-anim inline-block select-none">⭐</span>
            <div>
              <span
                className="block text-xl leading-none tracking-wide"
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  color: "#FFB921",
                  WebkitTextStroke: "1px #000",
                  textShadow: "2px 2px 0 #000",
                }}
              >
                BRAWL CREATORS
              </span>
              <span
                className="block text-[10px] tracking-widest mt-0.5"
                style={{ color: "#606080", fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                ブロスタ クリエイターズ
              </span>
            </div>
          </Link>

          {/* Nav */}
          <div className="flex items-center gap-2">
            <Link href="/" className="btn-secondary text-sm">
              クリエイター一覧
            </Link>
            <a href="#about" className="btn-secondary text-sm hidden sm:inline-flex">
              サイトについて
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}
