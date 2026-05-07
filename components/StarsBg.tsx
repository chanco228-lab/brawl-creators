"use client";

export default function StarsBg() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Subtle dark-mode glow blobs */}
      {[
        { color: "#FFB921", left: "5%",  top: "0%",   size: 500, delay: "0s" },
        { color: "#3A86FF", left: "75%", top: "10%",  size: 400, delay: "-5s" },
        { color: "#9B59B6", left: "50%", top: "65%",  size: 450, delay: "-10s" },
        { color: "#F01919", left: "10%", top: "70%",  size: 350, delay: "-7s" },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: b.color,
            filter: "blur(120px)",
            opacity: 0.04,
            transform: "translate(-50%, -50%)",
            animation: `blobFloat 18s ease-in-out ${b.delay} infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes blobFloat {
          0%   { transform: translate(-50%, -50%) scale(1); }
          100% { transform: translate(-48%, -52%) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
