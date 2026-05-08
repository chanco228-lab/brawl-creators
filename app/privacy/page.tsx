import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | BRAWL CREATORS",
  description: "BRAWL CREATORSのプライバシーポリシーページです。",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      <div className="max-w-2xl mx-auto px-4 pt-28 pb-24">

        <Link
          href="/"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            color: "#9B9BB0",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 32,
          }}
        >
          ← トップに戻る
        </Link>

        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(24px, 5vw, 36px)",
            color: "#1A1A1A",
            marginBottom: 8,
          }}
        >
          プライバシーポリシー
        </h1>
        <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 13, color: "#9B9BB0", marginBottom: 40 }}>
          最終更新日: 2026年5月
        </p>

        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E8ED",
            borderRadius: 20,
            padding: "36px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >
          {sections.map((s) => (
            <section key={s.title}>
              <h2
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#1A1A1A",
                  marginBottom: 12,
                }}
              >
                {s.title}
              </h2>
              <div
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  fontSize: 14,
                  color: "#6B6B80",
                  lineHeight: 1.85,
                  whiteSpace: "pre-wrap",
                }}
              >
                {s.body}
              </div>
            </section>
          ))}
        </div>

        <p
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 12,
            color: "#9B9BB0",
            textAlign: "center",
            marginTop: 40,
          }}
        >
          © 2025 BRAWL CREATORS — 非公式ファンサイト
        </p>
      </div>
    </div>
  );
}

const sections = [
  {
    title: "1. サイトについて",
    body: "BRAWL CREATORS（以下「当サイト」）は、Brawl Stars（ブロスタ）界隈のクリエイター情報をまとめた非公式ファンサイトです。Supercell社とは一切関係ありません。",
  },
  {
    title: "2. 収集する情報",
    body: "当サイトでは、以下の情報を収集・利用することがあります。\n\n・アクセスログ（IPアドレス、ブラウザ情報、閲覧ページ等）\n・ミニゲームのベストスコア（お使いのブラウザのlocalStorageに保存。外部には送信されません）\n・Cookieおよび類似技術（広告配信・アクセス解析のため）",
  },
  {
    title: "3. Google AdSense・広告について",
    body: "当サイトは、Google AdSenseを利用して広告を表示する場合があります。GoogleはCookieを使用して、ユーザーが以前このサイトや他のサイトを訪問した際の情報に基づいて広告を配信します。\n\nGoogleによる広告のCookie使用はGoogleのプライバシーポリシーに基づきます。\nhttps://policies.google.com/privacy\n\n広告のパーソナライズを無効にしたい場合は、Googleの広告設定ページをご利用ください。",
  },
  {
    title: "4. Google Analytics（アクセス解析）",
    body: "当サイトは、Googleが提供するアクセス解析ツール「Google Analytics」を利用する場合があります。Google AnalyticsはCookieを使用してアクセス情報を収集しますが、個人を特定する情報は含まれません。",
  },
  {
    title: "5. 外部リンクについて",
    body: "当サイトには、YouTube・X（Twitter）・TikTok・Twitch・Instagramなどの外部サービスへのリンクが含まれます。これらの外部サービスにおける個人情報の取り扱いは、各サービスのプライバシーポリシーに従います。",
  },
  {
    title: "6. 免責事項",
    body: "当サイトに掲載しているクリエイター情報は、公開されている情報をもとにファンが作成したものです。情報の正確性について最善を尽くしていますが、内容の完全性・最新性は保証しかねます。\n\nまた、当サイトのご利用により生じた損害について、運営者は一切の責任を負いません。",
  },
  {
    title: "7. ポリシーの変更",
    body: "本ポリシーの内容は、法令の改正や運営方針の変更に伴い、予告なく変更することがあります。最新の内容はこのページでご確認ください。",
  },
  {
    title: "8. お問い合わせ",
    body: "本ポリシーに関するご質問は、X（Twitter）のDMまたは各クリエイターのSNSを通じてお問い合わせください。",
  },
];
