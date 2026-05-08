"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PLAYER, BULLET, DIFFICULTY, COLORS } from "./constants";
import { drawField, drawPlayer, drawBullet, drawParticles, drawHUD } from "./renderer";
import {
  BulletObj, Particle,
  getSpeed, getInterval, getCount, getPattern, spawnBullets, spawnParticles,
} from "./bullet-patterns";
import AdBanner from "@/components/AdBanner";

declare global {
  interface Window {
    adBreak?: (params: {
      type: string;
      name: string;
      beforeAd?: () => void;
      afterAd?: () => void;
      adBreakDone?: (info: { breakStatus: string }) => void;
    }) => void;
  }
}

type GameState = "title" | "playing" | "gameover";
const STORAGE_KEY = "brawl-dodge-best";

export default function GameCanvas() {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const joystickZoneRef = useRef<HTMLDivElement>(null);
  const animationRef   = useRef<number>(0);

  // ── Game state refs (live inside rAF loop) ──────────────────────────────
  const playerRef     = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const joystickInputRef = useRef({ x: 0, y: 0 }); // normalized -1..1
  const keysRef       = useRef<Record<string, boolean>>({});
  const startTimeRef  = useRef<number>(0);
  const lastSpawnRef  = useRef<number>(0);
  const gameStateRef  = useRef<GameState>("title");
  const bulletsRef    = useRef<BulletObj[]>([]);
  const particlesRef  = useRef<Particle[]>([]);
  const flashRef      = useRef<number>(0);        // alpha 0..1
  const timeScaleRef  = useRef<number>(1.0);      // slow-motion
  const hitRef        = useRef<boolean>(false);   // death in progress
  const hitTimeRef    = useRef<number>(0);        // when hit happened

  // ── React state ─────────────────────────────────────────────────────────
  const [gameState, setGameState]   = useState<GameState>("title");
  const [isPortrait, setIsPortrait] = useState(false);
  const [bestScore, setBestScore]   = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isNewBest, setIsNewBest]   = useState(false);
  const gameOverCountRef = useRef(0);
  const startGameRef     = useRef<(() => void) | null>(null);

  // Sync gameState → ref
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  // Init
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setBestScore(parseFloat(saved));
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Orientation
  useEffect(() => {
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    check();
    window.addEventListener("resize", check);
    screen.orientation?.addEventListener("change", check);
    return () => {
      window.removeEventListener("resize", check);
      screen.orientation?.removeEventListener("change", check);
    };
  }, []);

  // Canvas resize
  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Draw title-screen background
  useEffect(() => {
    if (gameState !== "title") return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    drawField(ctx, c.width, c.height);
  }, [gameState]);

  // ── Start game ───────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    playerRef.current    = { x: c.width / 2, y: c.height / 2, vx: 0, vy: 0 };
    joystickInputRef.current = { x: 0, y: 0 };
    keysRef.current      = {};
    bulletsRef.current   = [];
    particlesRef.current = [];
    flashRef.current     = 0;
    timeScaleRef.current = 1.0;
    hitRef.current       = false;
    startTimeRef.current = performance.now();
    lastSpawnRef.current = performance.now();
    setGameState("playing");
  }, []);

  useEffect(() => { startGameRef.current = startGame; }, [startGame]);

  // Retry with optional interstitial every 3rd game
  const retryGame = useCallback(() => {
    gameOverCountRef.current += 1;
    if (
      gameOverCountRef.current % 3 === 0 &&
      typeof window !== "undefined" &&
      typeof window.adBreak === "function"
    ) {
      window.adBreak({
        type: "next",
        name: "game-over",
        adBreakDone: () => { startGameRef.current?.(); },
      });
    } else {
      startGameRef.current?.();
    }
  }, []);

  // ── Game loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    resizeCanvas();

    // Keyboard
    const onKeyDown = (e: KeyboardEvent) => { keysRef.current[e.key] = true; };
    const onKeyUp   = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);

    // nippleJS
    let joystickManager: { destroy: () => void } | null = null;
    let nippleCleanup = false;

    import("nipplejs").then((mod) => {
      if (nippleCleanup || !joystickZoneRef.current) return;
      const manager = mod.default.create({
        zone: joystickZoneRef.current,
        mode: "static",
        position: { left: "15%", bottom: "25%" },
        size: 120,
        color: "rgba(255, 185, 33, 0.6)",
        restOpacity: 0.5,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (manager as any).on("move", (_: unknown, data: any) => {
        const force = Math.min(data.force, 1);
        const angle = data.angle.radian;
        joystickInputRef.current = {
          x:  Math.cos(angle) * force,
          y: -Math.sin(angle) * force,
        };
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (manager as any).on("end", () => { joystickInputRef.current = { x: 0, y: 0 }; });
      joystickManager = manager;
    });

    // ── rAF loop ─────────────────────────────────────────────────────────
    const loop = (now: number) => {
      if (gameStateRef.current !== "playing") return;

      const W = canvas.width;
      const H = canvas.height;
      const p = playerRef.current;
      const keys = keysRef.current;
      const elapsed = (now - startTimeRef.current) / 1000;
      const ts = timeScaleRef.current; // time scale (slow-mo)

      // ── Handle slow-motion → game over transition ────────────────────
      if (hitRef.current) {
        if (now - hitTimeRef.current > 500) {
          // Transition to game over
          const score = hitTimeRef.current
            ? (hitTimeRef.current - startTimeRef.current) / 1000
            : elapsed;

          cancelAnimationFrame(animationRef.current);

          const prev = parseFloat(localStorage.getItem(STORAGE_KEY) || "0");
          const isNew = score > prev;
          if (isNew) {
            localStorage.setItem(STORAGE_KEY, score.toFixed(1));
            setBestScore(score);
          }
          setFinalScore(score);
          setIsNewBest(isNew);
          setGameState("gameover");
          return;
        }
        // Still in slow-mo — continue rendering with reduced timeScale
      }

      // ── Player movement ───────────────────────────────────────────────
      const joy = joystickInputRef.current;
      const hasJoystick = joy.x !== 0 || joy.y !== 0;

      if (hasJoystick) {
        // Joystick → direct velocity (instantly responsive, like Brawl Stars)
        p.vx = joy.x * PLAYER.MAX_SPEED * ts;
        p.vy = joy.y * PLAYER.MAX_SPEED * ts;
      } else {
        // Keyboard → acceleration model
        let inputX = 0, inputY = 0;
        if (keys["ArrowLeft"]  || keys["a"] || keys["A"]) inputX -= 1;
        if (keys["ArrowRight"] || keys["d"] || keys["D"]) inputX += 1;
        if (keys["ArrowUp"]    || keys["w"] || keys["W"]) inputY -= 1;
        if (keys["ArrowDown"]  || keys["s"] || keys["S"]) inputY += 1;

        if (inputX !== 0 && inputY !== 0) {
          const len = Math.sqrt(2);
          inputX /= len;
          inputY /= len;
        }

        if (inputX !== 0 || inputY !== 0) {
          p.vx += inputX * PLAYER.ACCEL * ts;
          p.vy += inputY * PLAYER.ACCEL * ts;
          // Clamp keyboard speed
          const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (spd > PLAYER.MAX_SPEED) {
            p.vx = (p.vx / spd) * PLAYER.MAX_SPEED;
            p.vy = (p.vy / spd) * PLAYER.MAX_SPEED;
          }
        } else {
          // No input → friction
          p.vx *= PLAYER.FRICTION;
          p.vy *= PLAYER.FRICTION;
          if (Math.abs(p.vx) < 0.05) p.vx = 0;
          if (Math.abs(p.vy) < 0.05) p.vy = 0;
        }
      }

      p.x = Math.max(PLAYER.WIDTH, Math.min(W - PLAYER.WIDTH, p.x + p.vx));
      p.y = Math.max(PLAYER.HEIGHT, Math.min(H - PLAYER.HEIGHT, p.y + p.vy));

      // ── Bullet spawning ───────────────────────────────────────────────
      if (!hitRef.current) {
        const interval = getInterval(elapsed);
        if (now - lastSpawnRef.current >= interval) {
          lastSpawnRef.current = now;
          const speed = getSpeed(elapsed);
          const count = getCount(elapsed);
          const pattern = getPattern(elapsed);

          // Spawn `count` rounds of the chosen pattern
          for (let i = 0; i < count; i++) {
            // Alternate aim shots in a round to avoid pile-up
            const pat = i > 0 && pattern === "wave" ? "aim" : pattern;
            bulletsRef.current.push(...spawnBullets(pat, W, H, speed, p.x, p.y));
          }
        }
      }

      // ── Move bullets + update trails ──────────────────────────────────
      bulletsRef.current = bulletsRef.current.filter((b) => {
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > BULLET.TRAIL_LENGTH) b.trail.shift();

        b.x += b.vx * ts;
        b.y += b.vy * ts;
        return b.x > -60 && b.x < W + 60 && b.y > -60 && b.y < H + 60;
      });

      // ── Collision detection ───────────────────────────────────────────
      if (!hitRef.current) {
        for (const b of bulletsRef.current) {
          const dx = p.x - b.x;
          const dy = p.y - b.y;
          if (Math.sqrt(dx * dx + dy * dy) < PLAYER.HITBOX_RADIUS + b.radius) {
            hitRef.current  = true;
            hitTimeRef.current = now;
            timeScaleRef.current = 0.3;
            flashRef.current = 0.6;
            particlesRef.current.push(...spawnParticles(p.x, p.y));
            break;
          }
        }
      }

      // ── Particles ─────────────────────────────────────────────────────
      particlesRef.current = particlesRef.current.filter((pt) => {
        pt.x += pt.vx * ts;
        pt.y += pt.vy * ts;
        pt.life -= 0.04 * ts;
        return pt.life > 0;
      });

      // ── Flash decay ───────────────────────────────────────────────────
      if (flashRef.current > 0) {
        flashRef.current = Math.max(0, flashRef.current - 0.04 * ts);
      }

      // ── Render ────────────────────────────────────────────────────────
      drawField(ctx, W, H);

      // Bullets
      for (const b of bulletsRef.current) drawBullet(ctx, b);

      // Particles (rendered behind player if alive)
      if (particlesRef.current.length > 0) drawParticles(ctx, particlesRef.current);

      // Player (hidden once killed)
      if (!hitRef.current) drawPlayer(ctx, p.x, p.y);

      // Flash overlay
      if (flashRef.current > 0) {
        ctx.fillStyle = `rgba(255,71,87,${flashRef.current})`;
        ctx.fillRect(0, 0, W, H);
      }

      // HUD
      const best = parseFloat(localStorage.getItem(STORAGE_KEY) || "0");
      drawHUD(ctx, elapsed, best, W);

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      nippleCleanup = true;
      joystickManager?.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, resizeCanvas]);

  // ── Portrait warning ─────────────────────────────────────────────────────
  if (isPortrait) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", height: "100vh", gap: 16, padding: 24,
        background: "#FAFAFA",
      }}>
        <div style={{ fontSize: 52 }}>📱</div>
        <p style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 700,
          fontSize: 20, color: "#1A1A1A", textAlign: "center",
        }}>
          スマホを横にして<br />プレイしてね！
        </p>
      </div>
    );
  }

  // ── Shared overlay card style ─────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(16px)",
    borderRadius: 24,
    padding: "44px 64px",
    textAlign: "center",
    border: "1px solid #E8E8ED",
    boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>

      {/* Canvas — always mounted */}
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, display: "block" }} />

      {/* Joystick zone */}
      {gameState === "playing" && (
        <div ref={joystickZoneRef} style={{ position: "absolute", inset: 0, zIndex: 10 }} />
      )}

      {/* ── Title ── */}
      {gameState === "title" && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", zIndex: 20,
        }}>
          {/* Banner ad — top (150px+ above card) */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
            <AdBanner slot={process.env.NEXT_PUBLIC_AD_SLOT_TITLE ?? "XXXXXXXXXX"} />
          </div>

          <div style={cardStyle}>
            <h1 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 800,
              fontSize: "clamp(24px, 4vw, 40px)", color: "#1A1A1A", margin: "0 0 4px",
            }}>
              弾避けトレーニング
            </h1>
            <p style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 600,
              fontSize: "clamp(13px, 2vw, 17px)", color: "#9B9BB0",
              margin: "0 0 28px", letterSpacing: 2,
            }}>
              DODGE TRAINING
            </p>

            {bestScore > 0 && (
              <p style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                fontSize: 15, color: "#6B6B80", marginBottom: 28,
              }}>
                ベスト:{" "}
                <span style={{ color: "#FFB921", fontWeight: 800 }}>{bestScore.toFixed(1)}s</span>
              </p>
            )}

            <button
              onClick={startGame}
              style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18,
                color: "#000", background: "#FFB921", border: "none", borderRadius: 12,
                padding: "14px 56px", cursor: "pointer", transition: "background 0.15s",
                display: "block", width: "100%", marginBottom: 20,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F5A800")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FFB921")}
            >
              START
            </button>

            <p style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 12, color: "#9B9BB0", margin: 0 }}>
              {isTouchDevice ? "バーチャルパッドで操作" : "WASD / 矢印キーで操作"}
            </p>
          </div>
        </div>
      )}

      {/* ── Game Over ── */}
      {gameState === "gameover" && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", zIndex: 20,
          background: "rgba(240,237,230,0.65)", backdropFilter: "blur(4px)",
        }}>
          <div style={cardStyle}>
            <p style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 800,
              fontSize: "clamp(20px, 3.5vw, 32px)", color: "#FF4757",
              margin: "0 0 8px", letterSpacing: 3,
            }}>
              GAME OVER
            </p>

            <p style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 800,
              fontSize: "clamp(48px, 8vw, 72px)", color: COLORS.TEXT,
              margin: "0 0 4px", lineHeight: 1,
            }}>
              {finalScore.toFixed(1)}
              <span style={{ fontSize: "0.45em", fontWeight: 700, color: "#6B6B80" }}> s</span>
            </p>

            {isNewBest && (
              <p style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 700,
                fontSize: 16, color: "#FFB921", margin: "4px 0 0", letterSpacing: 1,
              }}>
                NEW BEST!
              </p>
            )}

            {!isNewBest && bestScore > 0 && (
              <p style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                fontSize: 14, color: "#9B9BB0", margin: "8px 0 0",
              }}>
                ベスト:{" "}
                <span style={{ color: "#FFB921", fontWeight: 800 }}>{bestScore.toFixed(1)}s</span>
              </p>
            )}

            <button
              onClick={retryGame}
              style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18,
                color: "#000", background: "#FFB921", border: "none", borderRadius: 12,
                padding: "14px 56px", cursor: "pointer", transition: "background 0.15s",
                display: "block", width: "100%", marginTop: 32,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F5A800")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FFB921")}
            >
              RETRY
            </button>
          </div>

          {/* Banner ad — bottom */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
            <AdBanner slot={process.env.NEXT_PUBLIC_AD_SLOT_GAMEOVER ?? "XXXXXXXXXX"} />
          </div>
        </div>
      )}
    </div>
  );
}
