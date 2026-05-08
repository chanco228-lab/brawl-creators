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
          background: "#F5F5F7",
          border: "1px dashed #E8E8ED",
          borderRadius: 14,
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#FEE2E2",
            color: "#DC2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
            fontSize: 18,
          }}
        >
          ▶
        </div>
        <p style={{ color: "#9B9BB0", fontSize: 13, marginBottom: 12 }}>
          チャンネルIDを設定すると最新動画が表示されます
        </p>
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ fontSize: 13, padding: "8px 18px" }}
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
            <div className="relative aspect-video" style={{ background: "#F5F5F7" }}>
              <Image
                src={v.thumbnail}
                alt={v.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="play-overlay absolute inset-0 flex items-center justify-center bg-black/25">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: "#FF0000",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: "#fff", fontSize: 14, marginLeft: 2 }}>▶</span>
                </div>
              </div>
            </div>
            <div className="p-3">
              <p
                className="text-sm line-clamp-2 leading-snug"
                style={{ color: "#1A1A1A", fontWeight: 500 }}
              >
                {v.title}
              </p>
              <p className="text-xs mt-1" style={{ color: "#9B9BB0" }}>{v.published}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-4 text-center">
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ fontSize: 13, padding: "9px 20px" }}
        >
          ▶ YouTubeチャンネルを見る
        </a>
      </div>
    </div>
  );
}
