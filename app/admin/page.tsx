"use client";

import { useState, useEffect, useCallback } from "react";
import type { Creator, PlatformName } from "@/types/creator";

// プラットフォーム定義（固定順）
const PLATFORM_DEFS: {
  name: PlatformName;
  label: string;
  countLabel: string;
  placeholder: string;
}[] = [
  { name: "youtube",   label: "YouTube",   countLabel: "登録者数",   placeholder: "@チャンネル名" },
  { name: "twitter",   label: "X",         countLabel: "フォロワー数", placeholder: "@ユーザー名" },
  { name: "tiktok",   label: "TikTok",    countLabel: "フォロワー数", placeholder: "@ユーザー名" },
  { name: "instagram", label: "Instagram", countLabel: "フォロワー数", placeholder: "@ユーザー名" },
  { name: "twitch",   label: "Twitch",    countLabel: "フォロワー数", placeholder: "@チャンネル名" },
];

// ハンドルからURLを自動生成
function getUrl(platform: PlatformName, handle: string): string {
  const h = handle.startsWith("@") ? handle.slice(1) : handle;
  if (!h) return "";
  switch (platform) {
    case "youtube":   return `https://www.youtube.com/@${h}`;
    case "twitter":   return `https://x.com/${h}`;
    case "tiktok":    return `https://www.tiktok.com/@${h}`;
    case "instagram": return `https://www.instagram.com/${h}`;
    case "twitch":    return `https://www.twitch.tv/${h}`;
  }
}

// ラベル（登録者 or フォロワー）
function getLabel(platform: PlatformName): string {
  return platform === "youtube" ? "登録者" : "フォロワー";
}

// プラットフォームフォームの型
type PlatformFormEntry = {
  name: PlatformName;
  handle: string;   // @ 付き
  count: string;
  channelId: string; // YouTube のみ
};

// 初期プラットフォームフォーム（全5件・空）
function emptyPlatformForms(): PlatformFormEntry[] {
  return PLATFORM_DEFS.map((d) => ({ name: d.name, handle: "@", count: "", channelId: "" }));
}

// Creator → PlatformFormEntry[]
function creatorToPlatformForms(creator: Creator): PlatformFormEntry[] {
  return PLATFORM_DEFS.map((d) => {
    const p = creator.platforms.find((x) => x.name === d.name);
    if (!p) return { name: d.name, handle: "@", count: "", channelId: "" };
    const handle = p.handle.startsWith("@") ? p.handle : `@${p.handle}`;
    const channelId = d.name === "youtube" ? (creator.youtubeChannelId ?? "") : "";
    return { name: d.name, handle, count: p.count, channelId };
  });
}

const EMPTY_CREATOR: Creator = {
  id: "", name: "", kana: "", avatar: "",
  color1: "#FFB921", color2: "#FF6B35",
  message: "", tags: [], platforms: [],
  youtubeChannelId: "", twitterHandle: "", joinedDate: "",
};

// ── Auth ──────────────────────────────────────────
function PasswordGate({ onAuth }: { onAuth: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const submit = async () => {
    const res = await fetch("/api/creators", { headers: { "x-admin-password": pw } });
    if (res.ok) { sessionStorage.setItem("admin_pw", pw); onAuth(pw); }
    else setErr(true);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAFA" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 40, width: 340, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #E8E8ED" }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 6, color: "#1A1A1A" }}>
          ⭐ 管理画面
        </p>
        <p style={{ color: "#9B9BB0", fontSize: 13, marginBottom: 24 }}>パスワードを入力してください</p>
        <input
          type="password" value={pw}
          onChange={(e) => { setPw(e.target.value); setErr(false); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="パスワード"
          style={{ ...iS, border: `1.5px solid ${err ? "#f87171" : "#E8E8ED"}`, marginBottom: 12 }}
        />
        {err && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>パスワードが違います</p>}
        <button onClick={submit} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          ログイン
        </button>
      </div>
    </div>
  );
}

// ── Creator Form ───────────────────────────────────
function CreatorForm({ initial, onSave, onCancel, isEdit }: {
  initial: Creator;
  onSave: (c: Creator) => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const [form, setForm] = useState<Creator>(initial);
  const [tagInput, setTagInput] = useState(initial.tags.join(", "));
  const [pfForms, setPfForms] = useState<PlatformFormEntry[]>(
    isEdit ? creatorToPlatformForms(initial) : emptyPlatformForms()
  );
  // kana変更時にIDを自動入力（編集時は変更しない）
  const handleKanaChange = (val: string) => {
    setForm((f) => {
      const newId = isEdit ? f.id : val.toLowerCase().replace(/[^a-z0-9]/g, "");
      return { ...f, kana: val, id: newId };
    });
  };

  const setPf = (i: number, key: keyof PlatformFormEntry, val: string) => {
    setPfForms((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [key]: val };
      return next;
    });
  };

  const handleSave = () => {
    // ハンドルが入力されているプラットフォームのみ保存
    const platforms = pfForms
      .filter((p) => p.handle && p.handle !== "@")
      .map((p) => {
        const handleClean = p.handle.startsWith("@") ? p.handle.slice(1) : p.handle;
        return {
          name: p.name,
          handle: `@${handleClean}`,
          url: getUrl(p.name, p.handle),
          count: p.count,
          label: getLabel(p.name),
        };
      });

    const youtubePf = pfForms.find((p) => p.name === "youtube");
    const twitterPf = pfForms.find((p) => p.name === "twitter");
    const twitterHandle = twitterPf?.handle && twitterPf.handle !== "@"
      ? (twitterPf.handle.startsWith("@") ? twitterPf.handle.slice(1) : twitterPf.handle)
      : "";

    const creator: Creator = {
      ...form,
      tags: tagInput.split(",").map((t) => t.trim()).filter(Boolean),
      platforms,
      youtubeChannelId: youtubePf?.channelId ?? "",
      twitterHandle,
    };
    onSave(creator);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", padding: 28, boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#1A1A1A", marginBottom: 20 }}>
          {isEdit ? "クリエイターを編集" : "クリエイターを追加"}
        </h2>

        {/* 基本情報 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="名前">
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="例: やぴまる" style={iS} />
          </Field>
          <Field label="ローマ字名">
            <input value={form.kana} onChange={(e) => handleKanaChange(e.target.value)}
              placeholder="例: YAPIMARU" style={iS} />
          </Field>
          <Field label="ID（URL用・自動入力）">
            <input value={form.id} onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
              placeholder="例: yapimaru" style={iS} />
          </Field>
          <Field label="活動開始（YYYY-MM）">
            <input value={form.joinedDate} onChange={(e) => setForm((f) => ({ ...f, joinedDate: e.target.value }))}
              placeholder="例: 2023-04" style={iS} />
          </Field>
        </div>

        <Field label="アバター（絵文字 または 画像URL）">
          <input value={form.avatar} onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))}
            placeholder="例: ⭐ または https://..." style={iS} />
        </Field>

        <Field label="メッセージ">
          <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            rows={3} placeholder="ファンへのメッセージ" style={{ ...iS, resize: "vertical" }} />
        </Field>

        <Field label="タグ（カンマ区切り）">
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
            placeholder="例: 攻略, 実況, ランク戦" style={iS} />
        </Field>

        {/* SNSプラットフォーム */}
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>SNSプラットフォーム</label>
          <p style={{ fontSize: 11, color: "#9B9BB0", marginBottom: 10 }}>
            ハンドル名を入力したプラットフォームのみ表示されます
          </p>

          {pfForms.map((p, i) => {
            const def = PLATFORM_DEFS[i];
            const autoUrl = getUrl(p.name, p.handle);
            return (
              <div key={p.name} style={{ background: "#FAFAFA", borderRadius: 12, padding: "12px 14px", marginBottom: 8, border: "1px solid #E8E8ED" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, color: "#1A1A1A", minWidth: 72 }}>
                    {def.label}
                  </span>
                  <input
                    value={p.handle}
                    onChange={(e) => setPf(i, "handle", e.target.value)}
                    placeholder={def.placeholder}
                    style={{ ...iS, flex: 1 }}
                  />
                  <input
                    value={p.count}
                    onChange={(e) => setPf(i, "count", e.target.value)}
                    placeholder={def.countLabel}
                    style={{ ...iS, width: 110 }}
                  />
                </div>
                {/* YouTube: チャンネルID */}
                {p.name === "youtube" && (
                  <div style={{ marginBottom: 6 }}>
                    <input
                      value={p.channelId}
                      onChange={(e) => setPf(i, "channelId", e.target.value)}
                      placeholder="YouTubeチャンネルID（UCxxxxxxxxxx）"
                      style={{ ...iS, fontSize: 12 }}
                    />
                  </div>
                )}
                {/* URL プレビュー */}
                {autoUrl && (
                  <p style={{ fontSize: 11, color: "#9B9BB0", wordBreak: "break-all" }}>
                    URL: {autoUrl}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* アバタープレビュー */}
        {form.avatar && (
          <div style={{ background: "#FAFAFA", borderRadius: 12, padding: 12, marginBottom: 16, border: "1px solid #E8E8ED", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", border: "1.5px solid #E8E8ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, background: "#F5F5F7" }}>
              {form.avatar.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : form.avatar}
            </div>
            <div>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "#1A1A1A", fontSize: 15 }}>{form.name || "名前未入力"}</p>
              <p style={{ fontSize: 11, color: "#9B9BB0" }}>{form.kana}</p>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} className="btn-secondary">キャンセル</button>
          <button onClick={handleSave} className="btn-primary">
            {isEdit ? "保存する" : "追加する"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ────────────────────────────────
export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [modal, setModal] = useState<{ open: boolean; creator: Creator | null }>({ open: false, creator: null });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_pw");
    if (saved) setPassword(saved);
  }, []);

  const fetchCreators = useCallback(async (pw: string) => {
    const res = await fetch("/api/creators", { headers: { "x-admin-password": pw } });
    if (res.ok) setCreators(await res.json());
  }, []);

  useEffect(() => {
    if (password) fetchCreators(password);
  }, [password, fetchCreators]);

  const notify = (text: string, ok = true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSave = async (creator: Creator) => {
    if (!password) return;
    setLoading(true);
    const isEdit = !!modal.creator;
    const url = isEdit ? `/api/creators/${modal.creator!.id}` : "/api/creators";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify(creator),
    });
    const data = await res.json();
    if (res.ok) {
      await fetchCreators(password);
      setModal({ open: false, creator: null });
      notify(isEdit ? "更新しました" : "追加しました");
    } else {
      notify(data.error || "エラーが発生しました", false);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!password) return;
    if (!confirm(`「${name}」を削除しますか？`)) return;
    setLoading(true);
    await fetch(`/api/creators/${id}`, { method: "DELETE", headers: { "x-admin-password": password } });
    await fetchCreators(password);
    notify("削除しました");
    setLoading(false);
  };

  if (!password) return <PasswordGate onAuth={setPassword} />;

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", padding: "80px 16px 40px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 26, color: "#1A1A1A", margin: 0 }}>
              ⭐ 管理画面
            </h1>
            <p style={{ color: "#9B9BB0", fontSize: 13, margin: "4px 0 0" }}>クリエイターの追加・編集・削除</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a href="/" className="btn-secondary" style={{ fontSize: 13 }}>サイトへ戻る</a>
            <button onClick={() => setModal({ open: true, creator: null })} className="btn-primary" disabled={loading}>
              ＋ クリエイターを追加
            </button>
          </div>
        </div>

        {/* Toast */}
        {msg && (
          <div style={{ position: "fixed", top: 20, right: 20, zIndex: 200, background: msg.ok ? "#10b981" : "#ef4444", color: "#fff", borderRadius: 10, padding: "10px 18px", fontSize: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
            {msg.text}
          </div>
        )}

        {/* Creator list */}
        {creators.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 20, padding: 48, textAlign: "center", border: "1px solid #E8E8ED" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
            <p style={{ color: "#9B9BB0" }}>クリエイターがまだいません</p>
            <button onClick={() => setModal({ open: true, creator: null })} className="btn-primary" style={{ marginTop: 16 }}>
              最初のクリエイターを追加
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {creators.map((c) => (
              <div key={c.id} style={{ background: "#fff", borderRadius: 14, padding: "14px 18px", border: "1px solid #E8E8ED", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#F5F5F7", border: "1.5px solid #E8E8ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                  {c.avatar?.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : c.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A1A1A", margin: 0 }}>{c.name}</p>
                  <p style={{ fontSize: 11, color: "#9B9BB0", margin: "2px 0 0" }}>
                    {c.kana} · /creators/{c.id} · {c.platforms.length}プラットフォーム
                  </p>
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", maxWidth: 160 }}>
                  {c.tags.map((t) => (
                    <span key={t} className="tag" style={{ fontSize: 10 }}>#{t}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => setModal({ open: true, creator: c })} className="btn-secondary" style={{ fontSize: 12, padding: "6px 14px" }}>
                    編集
                  </button>
                  <button onClick={() => handleDelete(c.id, c.name)} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, background: "#FEE2E2", border: "none", color: "#DC2626", cursor: "pointer" }}>
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ color: "#D0D0D8", fontSize: 11, textAlign: "center", marginTop: 32 }}>
          ※ 変更はローカルの creators.json に保存されます。Vercel への反映は git push が必要です。
        </p>
      </div>

      {modal.open && (
        <CreatorForm
          initial={modal.creator ?? EMPTY_CREATOR}
          onSave={handleSave}
          onCancel={() => setModal({ open: false, creator: null })}
          isEdit={!!modal.creator}
        />
      )}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, color: "#6B6B80", marginBottom: 4,
  fontFamily: "'Outfit', sans-serif", fontWeight: 600,
};

const iS: React.CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: 10,
  border: "1.5px solid #E8E8ED", fontSize: 13, color: "#1A1A1A",
  outline: "none", background: "#fff", fontFamily: "'Noto Sans JP', sans-serif",
};
