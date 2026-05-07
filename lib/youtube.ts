export interface YouTubeVideo {
  videoId: string;
  title: string;
  published: string;
  thumbnail: string;
  url: string;
}

export async function getLatestYouTubeVideos(
  channelId: string,
  count = 3
): Promise<YouTubeVideo[]> {
  if (!channelId) return [];

  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/rss+xml, application/xml, text/xml, */*",
        },
        next: { revalidate: 1800 },
      }
    );
    if (!res.ok) return [];
    const xml = await res.text();

    const entries: YouTubeVideo[] = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(xml)) !== null && entries.length < count) {
      const entry = match[1];
      const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const titleMatch = entry.match(/<title>(.*?)<\/title>/);
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/);

      if (videoIdMatch && titleMatch) {
        const videoId = videoIdMatch[1];
        const title = titleMatch[1]
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
        const published = publishedMatch
          ? new Date(publishedMatch[1]).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "";

        entries.push({
          videoId,
          title,
          published,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${videoId}`,
        });
      }
    }

    return entries;
  } catch {
    return [];
  }
}
