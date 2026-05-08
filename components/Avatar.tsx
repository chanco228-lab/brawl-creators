interface Props {
  avatar: string;
  size: number;
  color1: string;
  color2: string;
  className?: string;
}

export default function Avatar({ avatar, size, color1, color2, className = "" }: Props) {
  const isImage = avatar.startsWith("http") || avatar.startsWith("/");
  const isEmpty = !avatar || avatar.trim() === "";

  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "12px",
    flexShrink: 0,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(135deg, ${color1}20, ${color2}15)`,
    border: "1.5px solid #E8E8ED",
  };

  if (isEmpty) {
    return (
      <div style={{ ...baseStyle, fontSize: size * 0.4, color: "#9B9BB0", fontFamily: "'Outfit', sans-serif", fontWeight: 700 }} className={className}>
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
