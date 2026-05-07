"use client";

export default function StarsBg() {
  return (
    <div className="light-deco" aria-hidden>
      <div className="deco-blob" style={{ background: "#FFE000", left: "5%",  top: "0%",   width: "500px", height: "500px", animationDelay: "0s" }} />
      <div className="deco-blob" style={{ background: "#FF8C00", left: "75%", top: "10%",  width: "400px", height: "400px", animationDelay: "-5s" }} />
      <div className="deco-blob" style={{ background: "#3D8EFF", left: "50%", top: "60%",  width: "450px", height: "450px", animationDelay: "-10s" }} />
      <div className="deco-blob" style={{ background: "#FF3CAC", left: "10%", top: "70%",  width: "350px", height: "350px", animationDelay: "-7s" }} />
    </div>
  );
}
