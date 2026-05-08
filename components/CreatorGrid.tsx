"use client";

import { useState, useMemo } from "react";
import type { Creator } from "@/types/creator";
import CreatorCard from "@/components/CreatorCard";

type SortKey = "followers" | "youtube" | "name" | "joined";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "followers", label: "総フォロワー数" },
  { key: "youtube",   label: "YouTube登録者" },
  { key: "name",      label: "名前順" },
  { key: "joined",    label: "活動開始順" },
];

function parseCount(str: string): number {
  if (!str) return 0;
  const s = str.replace(/,/g, "").trim();
  if (s.includes("万")) return parseFloat(s) * 10000;
  if (/[kK]$/.test(s)) return parseFloat(s) * 1000;
  return parseFloat(s) || 0;
}

function totalFollowers(c: Creator): number {
  return c.platforms.reduce((sum, p) => sum + parseCount(p.count), 0);
}

function youtubeCount(c: Creator): number {
  const yt = c.platforms.find((p) => p.name === "youtube");
  return yt ? parseCount(yt.count) : 0;
}

export default function CreatorGrid({ creators }: { creators: Creator[] }) {
  const [sort, setSort] = useState<SortKey>("followers");

  const sorted = useMemo(() => {
    const arr = [...creators];
    switch (sort) {
      case "followers": return arr.sort((a, b) => totalFollowers(b) - totalFollowers(a));
      case "youtube":   return arr.sort((a, b) => youtubeCount(b) - youtubeCount(a));
      case "name":      return arr.sort((a, b) => a.name.localeCompare(b.name, "ja"));
      case "joined":    return arr.sort((a, b) => (a.joinedDate ?? "").localeCompare(b.joinedDate ?? ""));
    }
  }, [creators, sort]);

  return (
    <section className="px-4 pt-10 pb-24 max-w-7xl mx-auto">
      {/* ヘッダー行 */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h2
          style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#1A1A1A" }}
        >
          クリエイター一覧
        </h2>
        <span
          style={{
            background: "#FFF3D6", color: "#B87800", borderRadius: 99,
            padding: "2px 12px", fontSize: 13,
            fontFamily: "'Outfit', sans-serif", fontWeight: 600,
          }}
        >
          {creators.length} 人
        </span>

        {/* スペーサー */}
        <div className="flex-1 hidden sm:block" style={{ height: 1, background: "#E8E8ED" }} />

        {/* ソートボタン */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#9B9BB0", alignSelf: "center", whiteSpace: "nowrap" }}>
            並び替え:
          </span>
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.key}
              onClick={() => setSort(o.key)}
              style={{
                fontSize: 12,
                padding: "5px 12px",
                borderRadius: 8,
                border: "1.5px solid",
                borderColor: sort === o.key ? "#FFB921" : "#E8E8ED",
                background: sort === o.key ? "#FFF3D6" : "#fff",
                color: sort === o.key ? "#B87800" : "#6B6B80",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: sort === o.key ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* グリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map((creator, i) => (
          <CreatorCard key={creator.id} creator={creator} index={i} />
        ))}
      </div>
    </section>
  );
}
