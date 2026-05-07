import Image from "next/image";
import { getLatestYouTubeVideos } from "@/lib/youtube";

interface Props {
  channelId: string;
  channelUrl: string;
  color: string;
}

export default async function LatestVideos({ channelId, channelUrl }: Props) {
  const videos = await getLatestYouTubeVideos(channelId, 3);

  if (videos.length === 0) {
    return (
      <div
        style={{
          background: "linear-gradient(180deg, #1E2A4A 0%, #16213E 100%)",
          border: "2px dashed #2A3A5A",
          borderRadius: 16,
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(255,0,0,0.12)",
            border: "2px solid rgba(255,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: 22,
            color: "#FF4444",
          }}
        >
          ▶
        </div>
        <p style={{ color: "#606080", fontSize: 13, marginBottom: 12 }}>
          チャンネルIDを設定すると最新動画が表示されます
        </p>
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ fontSize: 12 }}
        >
          YouTubeチャンネルへ →
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {videos.map((v) => (
          <a
            key={v.videoId}
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="video-card block"
          >
            <div className="relative aspect-video" style={{ background: "#0D0D1A" }}>
              <Image
                src={v.thumbnail}
                alt={v.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="play-overlay absolute inset-0 flex items-center justify-center bg-black/40">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "#FF0000",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 20px rgba(255,0,0,0.5)",
                  }}
                >
                  <span style={{ color: "#fff", fontSize: 16, marginLeft: 2 }}>▶</span>
                </div>
              </div>
            </div>
            <div className="p-3">
              <p
                className="text-sm line-clamp-2 leading-snug"
                style={{ color: "#FFFFFF", fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 700 }}
              >
                {v.title}
              </p>
              <p className="text-xs mt-1" style={{ color: "#606080" }}>{v.published}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-4 text-center">
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ fontSize: 13 }}
        >
          ▶ YouTubeチャンネルを見る
        </a>
      </div>
    </div>
  );
}
