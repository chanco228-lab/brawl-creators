interface Props {
  avatar: string;     // 絵文字 or 画像URL (http...)
  size: number;       // px
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
    background: `linear-gradient(135deg, ${color1}25, ${color2}18)`,
    border: `2px solid ${color1}40`,
    boxShadow: `0 4px 16px ${color1}25`,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

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
    <div
      style={{ ...baseStyle, fontSize: size * 0.45 }}
      className={className}
    >
      {avatar}
    </div>
  );
}
