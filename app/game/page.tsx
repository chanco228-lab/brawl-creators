import type { Metadata } from "next";
import GameCanvas from "./GameCanvas";

export const metadata: Metadata = {
  title: "弾避けトレーニング | BRAWL CREATORS",
  description: "ブロスタの弾避けを練習できるミニゲーム。バーチャルパッドで動かして弾を避け続けろ！",
};

export default function GamePage() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <GameCanvas />
    </div>
  );
}
