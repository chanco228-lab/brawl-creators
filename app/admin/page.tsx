"use client";

import { useState, useEffect, useCallback } from "react";
import type { Creator, PlatformName } from "@/types/creator";

const PLATFORM_OPTIONS: { value: PlatformName; label: string }[] = [
  { value: "youtube",   label: "YouTube" },
  { value: "twitter",   label: "X (Twitter)" },
  { value: "tiktok",    label: "TikTok" },
  { value: "twitch",    label: "Twitch" },
  { value: "instagram", label: "Instagram" },
];

const EMPTY_CREATOR: Omit<Creator, "id"> & { id: string } = {
  id: "",
  name: "",
  kana: "",
  avatar: "",
  color1: "#7c3aed",
  color2: "#4f46e5",
  message: "",
  tags: [],
  platforms: [],
  youtubeChannelId: "",
  twitterHandle: "",
  joinedDate: "",
};

// ── Auth ──────────────────────────────────────────
function PasswordGate({ onAuth }: { onAuth: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const submit = async () => {
    const res = await fetch("/api/creators", {
      headers: { "x-admin-password": pw },
    });
    if (res.ok) {
      sessionStorage.setItem("admin_pw", pw);
      onAuth(pw);
    } else {
      setErr(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#F4F6FF" }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: 40, width: 340,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #E8ECF4",
      }}>
        <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, marginBottom: 8, color: "#1E1B2E" }}>
          ⭐ 管理画面
        </p>
        <p style={{ color: "#94A3B8", fontSize: 13, marginBottom: 24 }}>パスワードを入力してください</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setErr(false); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="パスワード"
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 10, border: `2px solid ${err ? "#f87171" : "#E8ECF4"}`,
            fontSize: 14, outline: "none", marginBottom: 12, color: "#1E1B2E",
          }}
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
function CreatorForm({
  initial,
  onSave,
  onCancel,
  isEdit,
}: {
  initial: Creator;
  onSave: (c: Creator) => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const [form, setForm] = useState<Creator>(initial);
  const [tagInput, setTagInput] = useState(initial.tags.join(", "));

  const set = (key: keyof Creator, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const addPlatform = () =>
    setForm((f) => ({
      ...f,
      platforms: [...f.platforms, { name: "youtube", url: "", handle: "", count: "", label: "登録者" }],
    }));

  const removePlatform = (i: number) =>
    setForm((f) => ({ ...f, platforms: f.platforms.filter((_, idx) => idx !== i) }));

  const setPlatform = (i: number, key: string, val: string) =>
    setForm((f) => {
      const p = [...f.platforms];
      p[i] = { ...p[i], [key]: val };
      return { ...f, platforms: p };
    });

  const handleSave = () => {
    const c: Creator = {
      ...form,
      tags: tagInput.split(",").map((t) => t.trim()).filter(Boolean),
    };
    onSave(c);
  };

  const field = (label: string, node: React.ReactNode) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, color: "#64748B", marginBottom: 4, fontFamily: "'Lilita One', sans-serif" }}>
        {label}
      </label>
      {node}
    </div>
  );

  const input = (key: keyof Creator, placeholder = "") => (
    <input
      value={(form[key] as string) ?? ""}
      onChange={(e) => set(key, e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
    />
  );

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 560,
        maxHeight: "90vh", overflowY: "auto", padding: 28,
        boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
      }}>
        <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#1E1B2E", marginBottom: 20 }}>
          {isEdit ? "クリエイターを編集" : "クリエイターを追加"}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>{field("ID（URL用・英小文字）", input("id", "例: yapimaru"))}</div>
          <div>{field("名前", input("name", "例: やぴまる"))}</div>
          <div>{field("ローマ字名", input("kana", "例: YAPIMARU"))}</div>
          <div>{field("活動開始（YYYY-MM）", input("joinedDate", "例: 2023-04"))}</div>
        </div>

        {field("アバター（絵文字 または 画像URL）", input("avatar", "例: ⭐ または https://..."))}
        {field("メッセージ",
          <textarea
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            rows={3}
            placeholder="ファンへのメッセージ"
            style={{ ...inputStyle, resize: "vertical" }}
          />
        )}
        {field("タグ（カンマ区切り）",
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="例: 攻略, 実況, ランク戦"
            style={inputStyle}
          />
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {field("テーマカラー①",
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" value={form.color1} onChange={(e) => set("color1", e.target.value)}
                style={{ width: 40, height: 36, borderRadius: 8, border: "2px solid #E8ECF4", cursor: "pointer" }} />
              <input value={form.color1} onChange={(e) => set("color1", e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            </div>
          )}
          {field("テーマカラー②",
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" value={form.color2} onChange={(e) => set("color2", e.target.value)}
                style={{ width: 40, height: 36, borderRadius: 8, border: "2px solid #E8ECF4", cursor: "pointer" }} />
              <input value={form.color2} onChange={(e) => set("color2", e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {field("YouTubeチャンネルID", input("youtubeChannelId", "UCxxxxxxxxxxxxxxxx"))}
          {field("Xハンドル（@なし）", input("twitterHandle", "例: YAPIMARU_GAMES"))}
        </div>

        {/* Platforms */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: "#64748B", fontFamily: "'Lilita One', sans-serif" }}>
              SNSプラットフォーム
            </label>
            <button onClick={addPlatform} style={{
              fontSize: 12, padding: "4px 12px", borderRadius: 50,
              background: "rgba(255,185,33,0.12)", border: "1.5px solid rgba(255,185,33,0.4)",
              color: "#9B6500", cursor: "pointer", fontFamily: "'Lilita One', sans-serif",
            }}>
              ＋ 追加
            </button>
          </div>

          {form.platforms.map((p, i) => (
            <div key={i} style={{
              background: "#F8FAFF", borderRadius: 12, padding: 12, marginBottom: 8,
              border: "1px solid #E8ECF4",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                <select
                  value={p.name}
                  onChange={(e) => setPlatform(i, "name", e.target.value)}
                  style={{ ...inputStyle, background: "#fff" }}
                >
                  {PLATFORM_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <input value={p.handle} onChange={(e) => setPlatform(i, "handle", e.target.value)}
                  placeholder="@ハンドル名" style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8 }}>
                <input value={p.url} onChange={(e) => setPlatform(i, "url", e.target.value)}
                  placeholder="URL" style={inputStyle} />
                <input value={p.count} onChange={(e) => setPlatform(i, "count", e.target.value)}
                  placeholder="登録者数" style={inputStyle} />
                <input value={p.label} onChange={(e) => setPlatform(i, "label", e.target.value)}
                  placeholder="ラベル" style={inputStyle} />
              </div>
              <button onClick={() => removePlatform(i)} style={{
                marginTop: 8, fontSize: 11, color: "#ef4444", background: "none",
                border: "none", cursor: "pointer", padding: 0,
              }}>
                削除
              </button>
            </div>
          ))}
        </div>

        {/* Preview */}
        {form.avatar && (
          <div style={{
            background: "#F8FAFF", borderRadius: 12, padding: 12, marginBottom: 16,
            border: "1px solid #E8ECF4", display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, overflow: "hidden",
              background: `linear-gradient(135deg, ${form.color1}30, ${form.color2}20)`,
              border: `2px solid ${form.color1}40`, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 22, flexShrink: 0,
            }}>
              {form.avatar.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : form.avatar}
            </div>
            <div>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1E1B2E", fontSize: 16 }}>{form.name || "名前未入力"}</p>
              <p style={{ fontSize: 11, color: "#94A3B8" }}>{form.kana}</p>
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

  // セッションから復元
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
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
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
    await fetch(`/api/creators/${id}`, {
      method: "DELETE",
      headers: { "x-admin-password": password },
    });
    await fetchCreators(password);
    notify("削除しました");
    setLoading(false);
  };

  if (!password) return <PasswordGate onAuth={(pw) => setPassword(pw)} />;

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FF", padding: "80px 16px 40px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: "#1E1B2E", margin: 0 }}>
              ⭐ 管理画面
            </h1>
            <p style={{ color: "#94A3B8", fontSize: 13, margin: "4px 0 0" }}>
              クリエイターの追加・編集・削除
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a href="/" className="btn-secondary" style={{ fontSize: 13 }}>サイトへ戻る</a>
            <button
              onClick={() => setModal({ open: true, creator: null })}
              className="btn-primary"
              disabled={loading}
            >
              ＋ クリエイターを追加
            </button>
          </div>
        </div>

        {/* Toast */}
        {msg && (
          <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 200,
            background: msg.ok ? "#10b981" : "#ef4444",
            color: "#fff", borderRadius: 10, padding: "10px 18px",
            fontFamily: "'Lilita One', sans-serif", fontSize: 14,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}>
            {msg.text}
          </div>
        )}

        {/* Creator list */}
        {creators.length === 0 ? (
          <div style={{
            background: "#fff", borderRadius: 20, padding: 48, textAlign: "center",
            border: "1px solid #E8ECF4",
          }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
            <p style={{ color: "#94A3B8", fontFamily: "'Lilita One', sans-serif" }}>
              クリエイターがまだいません
            </p>
            <button
              onClick={() => setModal({ open: true, creator: null })}
              className="btn-primary"
              style={{ marginTop: 16 }}
            >
              最初のクリエイターを追加
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {creators.map((c) => (
              <div key={c.id} style={{
                background: "#fff", borderRadius: 16, padding: "14px 18px",
                border: "1px solid #E8ECF4", display: "flex", alignItems: "center", gap: 14,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}>
                {/* Avatar */}
                <div style={{
                  width: 48, height: 48, borderRadius: 12, overflow: "hidden", flexShrink: 0,
                  background: `linear-gradient(135deg, ${c.color1}25, ${c.color2}18)`,
                  border: `2px solid ${c.color1}30`, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 22,
                }}>
                  {c.avatar.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : c.avatar}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: 17, color: "#1E1B2E", margin: 0 }}>
                    {c.name}
                  </p>
                  <p style={{ fontSize: 11, color: "#94A3B8", margin: "2px 0 0" }}>
                    {c.kana} · /creators/{c.id} · {c.platforms.length}プラットフォーム
                  </p>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", maxWidth: 180 }}>
                  {c.tags.map((t) => (
                    <span key={t} className="tag" style={{ fontSize: 10 }}>#{t}</span>
                  ))}
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => setModal({ open: true, creator: c })}
                    className="btn-secondary"
                    style={{ fontSize: 12, padding: "7px 14px" }}
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    style={{
                      fontSize: 12, padding: "7px 14px", borderRadius: 50,
                      background: "rgba(239,68,68,0.08)", border: "1.5px solid rgba(239,68,68,0.25)",
                      color: "#ef4444", cursor: "pointer", fontFamily: "'Lilita One', sans-serif",
                    }}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ color: "#CBD5E1", fontSize: 11, textAlign: "center", marginTop: 32 }}>
          ※ 変更はローカルの creators.json に保存されます。Vercel への反映は git push が必要です。
        </p>
      </div>

      {/* Modal */}
      {modal.open && (
        <CreatorForm
          initial={modal.creator ?? (EMPTY_CREATOR as Creator)}
          onSave={handleSave}
          onCancel={() => setModal({ open: false, creator: null })}
          isEdit={!!modal.creator}
        />
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 10,
  border: "1.5px solid #E8ECF4",
  fontSize: 13,
  color: "#1E1B2E",
  outline: "none",
  background: "#fff",
  fontFamily: "'Noto Sans JP', sans-serif",
};
