"use client";

interface Props {
  handle: string;
}

export default function TwitterTimeline({ handle }: Props) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #1E2A4A 0%, #16213E 100%)",
        border: "2px solid #2A3A5A",
        borderRadius: 16,
        padding: "32px 24px",
        textAlign: "center",
      }}
    >
      {/* X icon */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          background: "rgba(255,255,255,0.06)",
          border: "2px solid #2A3A5A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          fontSize: 22,
          color: "#E0E0E0",
          fontWeight: "bold",
        }}
      >
        ✕
      </div>

      <p
        style={{
          fontFamily: "'Lilita One', sans-serif",
          color: "#FFFFFF",
          fontSize: 16,
          marginBottom: 6,
        }}
      >
        @{handle}
      </p>
      <p style={{ color: "#606080", fontSize: 12, marginBottom: 20 }}>
        最新の投稿はXでチェック！
      </p>

      <a
        href={`https://x.com/${handle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        style={{ fontSize: 13 }}
      >
        ✕ Xのページを見る
      </a>
    </div>
  );
}
