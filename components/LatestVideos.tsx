import Image from "next/image";
import { getLatestYouTubeVideos } from "@/lib/youtube";

interface Props {
  channelId: string;
  channelUrl: string;
  color: string;
}

export default async function LatestVideos({ channelId, channelUrl, color }: Props) {
  const videos = await getLatestYouTubeVideos(channelId, 3);

  if (videos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-3xl mb-2">▶</p>
        <p className="text-sm" style={{ color: "#64748B" }}>
          YouTubeのチャンネルIDを設定すると最新動画が表示されます
        </p>
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-sm font-bold text-red-500 hover:text-red-600 underline underline-offset-2"
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
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={v.thumbnail}
                alt={v.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="play-overlay absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg ml-0.5">▶</span>
                </div>
              </div>
            </div>
            <div className="p-3">
              <p
                className="text-sm font-semibold line-clamp-2 leading-snug"
                style={{ color: "#1E1B2E" }}
              >
                {v.title}
              </p>
              <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>{v.published}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-4 text-center">
        <a
          href={channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
          style={{
            background: "rgba(255,0,0,0.07)",
            color: "#CC0000",
            border: "1.5px solid rgba(255,0,0,0.2)",
            fontFamily: "'Lilita One', sans-serif",
          }}
        >
          ▶ YouTubeチャンネルを見る
        </a>
      </div>
    </div>
  );
}
