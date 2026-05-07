interface Props {
  avatar: string;
  size: number;
  color1: string;
  color2: string;
  className?: string;
}

export default function Avatar({ avatar, size, color1, color2, className = "" }: Props) {
  const isImage = avatar.startsWith("http") || avatar.startsWith("/");

  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "16px",
    flexShrink: 0,
    background: `linear-gradient(135deg, ${color1}40, ${color2}30)`,
    border: "3px solid #FFB921",
    boxShadow: "0 0 14px rgba(255,185,33,0.3), 0 4px 16px rgba(0,0,0,0.4)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // 画像なし・絵文字なし → イニシャルアイコン
  const isEmpty = !avatar || avatar.trim() === "";

  if (isEmpty) {
    return (
      <div style={{ ...baseStyle, fontSize: size * 0.4, color: "#000", fontFamily: "'Lilita One', sans-serif" }} className={className}>
        ?
      </div>
    );
  }

  if (isImage) {
    return (
      <div style={baseStyle} className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt="avatar"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }

  return (
    <div style={{ ...baseStyle, fontSize: size * 0.45 }} className={className}>
      {avatar}
    </div>
  );
}
