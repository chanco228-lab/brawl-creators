import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StarsBg from "@/components/StarsBg";

export const metadata: Metadata = {
  title: "BRAWL CREATORS | ブロスタ クリエイターズ",
  description:
    "ブロスタ（Brawl Stars）界隈の人気クリエイターをまとめたファンサイト。最新動画・SNSリンク・クリエイターからのメッセージをチェック！",
  openGraph: {
    title: "BRAWL CREATORS | ブロスタ クリエイターズ",
    description:
      "ブロスタ界隈の人気クリエイターまとめ。最新動画・SNSリンク・クリエイターからのメッセージをチェック！",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Lilita+One&family=Noto+Sans+JP:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-bs-body">
        <StarsBg />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
