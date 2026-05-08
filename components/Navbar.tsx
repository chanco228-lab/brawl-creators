import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #E8E8ED",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-xl float-anim inline-block select-none">⭐</span>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: "0.5px",
                color: "#1A1A1A",
              }}
            >
              BRAWL{" "}
              <span style={{ color: "#FFB921" }}>CREATORS</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            <Link href="/" className="btn-secondary text-sm">
              クリエイター一覧
            </Link>
            <Link href="/game" className="btn-secondary text-sm hidden sm:inline-flex">
              🎮 ミニゲーム
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
