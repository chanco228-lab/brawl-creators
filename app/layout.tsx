import type { Metadata } from "next";
import Script from "next/script";
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {process.env.NEXT_PUBLIC_ADSENSE_ID &&
          process.env.NEXT_PUBLIC_ADSENSE_ID !== "ca-pub-XXXXXXXXXX" && (
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          )}
        <StarsBg />
        <Navbar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
