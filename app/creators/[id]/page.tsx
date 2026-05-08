import { notFound } from "next/navigation";
import Link from "next/link";
import { getCreatorById, creators } from "@/data/creators";
import Avatar from "@/components/Avatar";
import PlatformLinks from "@/components/PlatformLinks";
import LatestVideos from "@/components/LatestVideos";
import TwitterTimeline from "@/components/TwitterTimeline";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return creators.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const creator = getCreatorById(id);
  if (!creator) return {};
  return {
    title: `${creator.name} | BRAWL CREATORS`,
    description: creator.message,
  };
}

export default async function CreatorPage({ params }: Props) {
  const { id } = await params;
  const creator = getCreatorById(id);
  if (!creator) notFound();

  const youtubeInfo = creator.platforms.find((p) => p.name === "youtube");
  const twitterInfo = creator.platforms.find((p) => p.name === "twitter");

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>

      {/* ── ヘッダー空白 ── */}
      <div className="pt-16" />

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
        {/* 戻るボタン */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            fontWeight: 500,
            color: "#6B6B80",
            padding: "8px 0",
            transition: "color 0.2s",
            textDecoration: "none",
          }}
          className="hover:text-text-primary mb-6 block"
        >
          ← 一覧へ戻る
        </Link>
      </div>

      {/* ── コンテンツ ── */}
      <div className="max-w-4xl mx-auto px-4 pb-24 space-y-6">

        {/* プロフィールカード */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E8ED",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {/* top accent */}
          <div style={{ height: 4, background: "linear-gradient(90deg, #FFB921, #FF6B35)" }} />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <Avatar
                avatar={creator.avatar}
                size={80}
                color1={creator.color1}
                color2={creator.color2}
                className="float-anim"
              />
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start mb-2">
                  {creator.tags.map((tag) => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
                <h1
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: 28,
                    color: "#1A1A1A",
                    marginBottom: 2,
                  }}
                >
                  {creator.name}
                </h1>
                <p style={{ fontSize: 14, color: "#9B9BB0" }}>{creator.kana}</p>
                {creator.joinedDate && (
                  <p style={{ fontSize: 13, color: "#9B9BB0", marginTop: 4 }}>
                    活動開始: {creator.joinedDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* メッセージ */}
        {creator.message && (
          <section>
            <SectionTitle label="クリエイターからのメッセージ" />
            <div
              style={{
                background: "#FFF3D6",
                borderRadius: 12,
                padding: "20px 24px",
                fontSize: 15,
                color: "#1A1A1A",
                lineHeight: 1.8,
              }}
            >
              &ldquo;{creator.message}&rdquo;
            </div>
          </section>
        )}

        {/* SNSリンク */}
        <section>
          <SectionTitle label="SNS・チャンネルリンク" />
          <PlatformLinks creator={creator} />
        </section>

        {/* YouTube */}
        {youtubeInfo && (
          <section>
            <SectionTitle label="最新YouTube動画" />
            <LatestVideos
              channelId={creator.youtubeChannelId ?? ""}
              channelUrl={youtubeInfo.url}
              color={creator.color1}
            />
          </section>
        )}

        {/* X投稿 */}
        {twitterInfo && creator.twitterHandle && (
          <section>
            <SectionTitle label="最新X投稿" />
            <TwitterTimeline handle={creator.twitterHandle} />
          </section>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
      }}
    >
      <h2
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: 17,
          color: "#1A1A1A",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </h2>
      <div style={{ flex: 1, height: 1, background: "#E8E8ED" }} />
    </div>
  );
}
