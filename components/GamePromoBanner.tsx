"use client";

import Link from "next/link";

export default function GamePromoBanner() {
  return (
    <Link
      href="/game"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        background: "#FFF3D6",
        border: "1.5px solid #FFD166",
        borderRadius: 18,
        padding: "22px 32px",
        textDecoration: "none",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(255,185,33,0.25)";
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#FFB921";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#FFD166";
      }}
    >
      <span style={{ fontSize: 40, flexShrink: 0 }}>🎮</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(16px, 2.5vw, 20px)",
            color: "#1A1A1A",
            margin: "0 0 4px",
          }}
        >
          弾避けトレーニングで腕を磨こう！
        </p>
        <p
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 13,
            color: "#6B6B80",
            margin: 0,
          }}
        >
          ブロスタの弾避けを練習できるミニゲーム。何秒生き残れる？
        </p>
      </div>
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          color: "#FFB921",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        今すぐプレイ →
      </span>
    </Link>
  );
}
