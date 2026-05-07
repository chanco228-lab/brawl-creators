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
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <div className="relative pt-16 overflow-hidden">
        {/* Creator color bg strip */}
        <div
          className="absolute inset-x-0 top-0 h-48 -z-10"
          style={{
            background: `linear-gradient(180deg, ${creator.color1}18 0%, rgba(244,246,255,0) 100%)`,
          }}
        />

        <div className="max-w-4xl mx-auto px-4 pt-10 pb-8">
          <Link href="/" className="btn-secondary inline-flex gap-1.5 mb-8 text-sm">
            ← 一覧へ戻る
          </Link>

          {/* プロフィールカード：アイコンの隣に名前 */}
          <div className="white-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* アバター */}
              <Avatar
                avatar={creator.avatar}
                size={112}
                color1={creator.color1}
                color2={creator.color2}
                className="float-anim"
              />

              {/* 名前など */}
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start mb-3">
                  {creator.tags.map((tag) => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>

                <h1
                  className="text-4xl sm:text-5xl mb-1"
                  style={{
                    fontFamily: "'Fredoka One', cursive",
                    background: `linear-gradient(135deg, ${creator.color1}, ${creator.color2})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {creator.name}
                </h1>

                <p
                  className="text-base mb-1"
                  style={{ fontFamily: "'Lilita One', sans-serif", color: "#64748B" }}
                >
                  {creator.kana}
                </p>
                <p className="text-sm" style={{ color: "#94A3B8" }}>
                  活動開始: {creator.joinedDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── コンテンツ ── */}
      <div className="max-w-4xl mx-auto px-4 pb-24 space-y-8">

        {/* メッセージ */}
        <section>
          <SectionLabel label="クリエイターからのメッセージ" icon="💬" color={creator.color1} />
          <div
            className="white-card p-5 relative overflow-hidden"
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r-sm"
              style={{ background: `linear-gradient(180deg, ${creator.color1}, ${creator.color2})` }}
            />
            <p
              className="pl-5 text-base leading-relaxed italic"
              style={{ color: "#64748B" }}
            >
              "{creator.message}"
            </p>
          </div>
        </section>

        {/* SNSリンク */}
        <section>
          <SectionLabel label="SNS・チャンネルリンク" icon="🔗" color="#FFB921" />
          <PlatformLinks creator={creator} />
        </section>

        {/* YouTube */}
        {youtubeInfo && (
          <section>
            <SectionLabel label="最新YouTube動画" icon="▶" color="#FF0000" />
            <div className="white-card p-4">
              <LatestVideos
                channelId={creator.youtubeChannelId ?? ""}
                channelUrl={youtubeInfo.url}
                color={creator.color1}
              />
            </div>
          </section>
        )}

        {/* X投稿 */}
        {twitterInfo && creator.twitterHandle && (
          <section>
            <SectionLabel label="最新X投稿" icon="✕" color="#000000" />
            <div className="white-card p-4">
              <TwitterTimeline handle={creator.twitterHandle} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SectionLabel({
  label,
  icon,
  color,
}: {
  label: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
        style={{
          background: `${color}14`,
          border: `1.5px solid ${color}30`,
          color,
        }}
      >
        {icon}
      </div>
      <h2
        className="text-base"
        style={{ fontFamily: "'Lilita One', sans-serif", color: "#1E1B2E" }}
      >
        {label}
      </h2>
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(90deg, ${color}25, transparent)` }}
      />
    </div>
  );
}
