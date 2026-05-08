"use client";

interface Props {
  handle: string;
}

export default function TwitterTimeline({ handle }: Props) {
  return (
    <div
      style={{
        background: "#F5F5F7",
        border: "1px dashed #E8E8ED",
        borderRadius: 14,
        padding: "32px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "#DBEAFE",
          color: "#2563EB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 12px",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        ✕
      </div>

      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          color: "#1A1A1A",
          fontSize: 15,
          marginBottom: 4,
        }}
      >
        @{handle}
      </p>
      <p style={{ color: "#9B9BB0", fontSize: 13, marginBottom: 16 }}>
        最新の投稿はXでチェック！
      </p>

      <a
        href={`https://x.com/${handle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary"
        style={{ fontSize: 13, padding: "9px 20px" }}
      >
        ✕ Xのページを見る
      </a>
    </div>
  );
}
