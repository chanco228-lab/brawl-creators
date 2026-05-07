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
      <div
        className="relative pt-16 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${creator.color1}18 0%, #1A1A2E 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 pt-10 pb-8">
          <Link href="/" className="btn-secondary inline-flex gap-1.5 mb-8 text-sm">
            ← 一覧へ戻る
          </Link>

          {/* プロフィールカード */}
          <div
            style={{
              background: "linear-gradient(135deg, #1E2A4A 0%, #0F3460 100%)",
              border: "2px solid #2A3A5A",
              borderRadius: 20,
              padding: "32px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            {/* creator color accent line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${creator.color1}, ${creator.color2})`,
              }}
            />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-2">
              <Avatar
                avatar={creator.avatar}
                size={100}
                color1={creator.color1}
                color2={creator.color2}
                className="float-anim"
              />

              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start mb-3">
                  {creator.tags.map((tag) => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>

                <h1
                  className="text-4xl sm:text-5xl mb-1"
                  style={{
                    fontFamily: "'Lilita One', sans-serif",
                    color: "#FFB921",
                    WebkitTextStroke: "2px #000",
                    textShadow: "2px 2px 0 #000, 0 0 10px rgba(255,185,33,0.3)",
                  }}
                >
                  {creator.name}
                </h1>

                <p
                  className="text-base mb-1"
                  style={{ fontFamily: "'Lilita One', sans-serif", color: "#606080" }}
                >
                  {creator.kana}
                </p>
                {creator.joinedDate && (
                  <p className="text-sm" style={{ color: "#606080" }}>
                    活動開始: {creator.joinedDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── コンテンツ ── */}
      <div className="max-w-4xl mx-auto px-4 pb-24 space-y-8">

        {/* メッセージ */}
        <section>
          <SectionLabel label="クリエイターからのメッセージ" icon="💬" iconBg="rgba(155,89,182,0.2)" iconColor="#9B59B6" lineColor="#9B59B6" />
          <div
            style={{
              background: "rgba(155,89,182,0.08)",
              borderLeft: "4px solid #9B59B6",
              borderRadius: "0 12px 12px 0",
              padding: "20px 24px",
            }}
          >
            <p
              className="text-base leading-relaxed italic"
              style={{ color: "#A0A0C0" }}
            >
              &ldquo;{creator.message}&rdquo;
            </p>
          </div>
        </section>

        {/* SNSリンク */}
        <section>
          <SectionLabel label="SNS・チャンネルリンク" icon="🔗" iconBg="rgba(255,185,33,0.15)" iconColor="#FFB921" lineColor="#FFB921" />
          <PlatformLinks creator={creator} />
        </section>

        {/* YouTube */}
        {youtubeInfo && (
          <section>
            <SectionLabel label="最新YouTube動画" icon="▶" iconBg="rgba(255,0,0,0.15)" iconColor="#FF4444" lineColor="#FF4444" />
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
            <SectionLabel label="最新X投稿" icon="✕" iconBg="rgba(255,255,255,0.08)" iconColor="#E0E0E0" lineColor="#2A3A5A" />
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
  iconBg,
  iconColor,
  lineColor,
}: {
  label: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  lineColor: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
        style={{ background: iconBg, color: iconColor, border: `1px solid ${iconColor}30` }}
      >
        {icon}
      </div>
      <h2
        className="text-base"
        style={{ fontFamily: "'Lilita One', sans-serif", color: "#FFFFFF" }}
      >
        {label}
      </h2>
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(90deg, ${lineColor}40, transparent)` }}
      />
    </div>
  );
}
