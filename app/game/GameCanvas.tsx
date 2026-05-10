"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PLAYER, BULLET, COLORS } from "./constants";
import { drawField, drawPlayer, drawBullet, drawParticles, drawHUD, drawObstacle } from "./renderer";
import {
  BulletObj, ObstacleObj, Particle,
  getSpeed, getInterval, getCount, getPattern, spawnBullets, spawnParticles,
  generateObstacles,
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
const JOYSTICK_RADIUS = 54;
const JOYSTICK_KNOB_RADIUS = 24;
const JOYSTICK_DEAD_ZONE = 0.08;

type JoystickVisual = {
  active: boolean;
  baseX: number;
  baseY: number;
  knobX: number;
  knobY: number;
};

export default function GameCanvas() {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const joystickZoneRef = useRef<HTMLDivElement>(null);
  const animationRef   = useRef<number>(0);
  const activePointerIdRef = useRef<number | null>(null);
  const activeTouchIdRef = useRef<number | null>(null);
  const joystickBaseRef = useRef({ x: 0, y: 0 });

  // ── Game state refs (live inside rAF loop) ──────────────────────────────
  const playerRef     = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const joystickInputRef = useRef({ x: 0, y: 0 }); // normalized -1..1
  const keysRef       = useRef<Record<string, boolean>>({});
  const startTimeRef  = useRef<number>(0);
  const lastSpawnRef  = useRef<number>(0);
  const gameStateRef  = useRef<GameState>("title");
  const bulletsRef    = useRef<BulletObj[]>([]);
  const particlesRef  = useRef<Particle[]>([]);
  const obstaclesRef  = useRef<ObstacleObj[]>([]);
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
  const [joystickVisual, setJoystickVisual] = useState<JoystickVisual>({
    active: false,
    baseX: 0,
    baseY: 0,
    knobX: 0,
    knobY: 0,
  });
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

  // Orientation — use screen.orientation.type when available (most reliable)
  useEffect(() => {
    const check = () => {
      if (screen.orientation?.type) {
        setIsPortrait(screen.orientation.type.startsWith("portrait"));
      } else {
        // Fallback: legacy window.orientation or dimension comparison
        const wo = (window as Window & { orientation?: number }).orientation;
        if (wo !== undefined) {
          setIsPortrait(wo === 0 || wo === 180);
        } else {
          setIsPortrait(window.innerHeight > window.innerWidth);
        }
      }
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    screen.orientation?.addEventListener("change", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
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

  // ── Fullscreen ───────────────────────────────────────────────────────────
  const requestFullscreen = useCallback(() => {
    const el = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    };
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }, []);

  // ── Start game ───────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    requestFullscreen();
    const c = canvasRef.current;
    if (!c) return;
    playerRef.current    = { x: c.width / 2, y: c.height / 2, vx: 0, vy: 0 };
    joystickInputRef.current = { x: 0, y: 0 };
    activePointerIdRef.current = null;
    activeTouchIdRef.current = null;
    setJoystickVisual((current) => ({ ...current, active: false }));
    keysRef.current      = {};
    bulletsRef.current   = [];
    particlesRef.current = [];
    obstaclesRef.current = generateObstacles(c.width, c.height);
    flashRef.current     = 0;
    timeScaleRef.current = 1.0;
    hitRef.current       = false;
    startTimeRef.current = performance.now();
    lastSpawnRef.current = performance.now();
    setGameState("playing");
  }, [requestFullscreen]);

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

  const updateJoystickFromPointer = useCallback((clientX: number, clientY: number) => {
    const base = joystickBaseRef.current;
    const dx = clientX - base.x;
    const dy = clientY - base.y;
    const distance = Math.hypot(dx, dy);
    const clampedDistance = Math.min(distance, JOYSTICK_RADIUS);
    const unitX = distance > 0 ? dx / distance : 0;
    const unitY = distance > 0 ? dy / distance : 0;
    const strength = clampedDistance / JOYSTICK_RADIUS;

    joystickInputRef.current = strength < JOYSTICK_DEAD_ZONE
      ? { x: 0, y: 0 }
      : { x: unitX * strength, y: unitY * strength };

    setJoystickVisual({
      active: true,
      baseX: base.x,
      baseY: base.y,
      knobX: base.x + unitX * clampedDistance,
      knobY: base.y + unitY * clampedDistance,
    });
  }, []);

  const resetJoystick = useCallback(() => {
    activePointerIdRef.current = null;
    activeTouchIdRef.current = null;
    joystickInputRef.current = { x: 0, y: 0 };
    setJoystickVisual((current) => ({ ...current, active: false }));
  }, []);

  const handleJoystickPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (
      gameStateRef.current !== "playing" ||
      activePointerIdRef.current !== null ||
      activeTouchIdRef.current !== null
    ) return;
    e.preventDefault();
    activePointerIdRef.current = e.pointerId;
    joystickBaseRef.current = { x: e.clientX, y: e.clientY };
    updateJoystickFromPointer(e.clientX, e.clientY);
    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Some mobile browsers report capture support but reject it mid-gesture.
      }
    }
  }, [updateJoystickFromPointer]);

  const handleJoystickPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    e.preventDefault();
    updateJoystickFromPointer(e.clientX, e.clientY);
  }, [updateJoystickFromPointer]);

  const handleJoystickPointerEnd = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    e.preventDefault();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    resetJoystick();
  }, [resetJoystick]);

  const handleJoystickTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (
      gameStateRef.current !== "playing" ||
      activePointerIdRef.current !== null ||
      activeTouchIdRef.current !== null
    ) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    e.preventDefault();
    activeTouchIdRef.current = touch.identifier;
    joystickBaseRef.current = { x: touch.clientX, y: touch.clientY };
    updateJoystickFromPointer(touch.clientX, touch.clientY);
  }, [updateJoystickFromPointer]);

  const getActiveTouch = useCallback((touches: React.TouchList) => {
    const touchId = activeTouchIdRef.current;
    if (touchId === null) return null;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches.item(i);
      if (touch?.identifier === touchId) return touch;
    }
    return null;
  }, []);

  const handleJoystickTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = getActiveTouch(e.touches);
    if (!touch) return;
    e.preventDefault();
    updateJoystickFromPointer(touch.clientX, touch.clientY);
  }, [getActiveTouch, updateJoystickFromPointer]);

  const handleJoystickTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = getActiveTouch(e.changedTouches);
    if (!touch) return;
    e.preventDefault();
    resetJoystick();
  }, [getActiveTouch, resetJoystick]);

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

    // Pointer joystick events are handled by the overlay below.

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
        // Joystick input is normalized, so map it directly to player speed.
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

      // ── Obstacle collision (push player out of AABB) ──────────────────
      for (const o of obstaclesRef.current) {
        const nearX = Math.max(o.x, Math.min(p.x, o.x + o.w));
        const nearY = Math.max(o.y, Math.min(p.y, o.y + o.h));
        const dx = p.x - nearX;
        const dy = p.y - nearY;
        const dist = Math.hypot(dx, dy);
        if (dist < PLAYER.HITBOX_RADIUS && dist > 0) {
          const overlap = PLAYER.HITBOX_RADIUS - dist;
          p.x += (dx / dist) * overlap;
          p.y += (dy / dist) * overlap;
          // Zero out velocity component toward obstacle
          const dot = p.vx * (dx / dist) + p.vy * (dy / dist);
          if (dot < 0) {
            p.vx -= dot * (dx / dist);
            p.vy -= dot * (dy / dist);
          }
        }
      }

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

      // Obstacles (behind bullets and player)
      for (const o of obstaclesRef.current) drawObstacle(ctx, o);

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
      resetJoystick();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, resizeCanvas, resetJoystick]);

  // ── Portrait warning ─────────────────────────────────────────────────────
  if (isPortrait) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", height: "100vh", gap: 16, padding: 24,
        background: "#FAFAFA", touchAction: "none",
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

  const joystickBaseStyle: React.CSSProperties = joystickVisual.active
    ? {
        position: "absolute",
        left: joystickVisual.baseX - JOYSTICK_RADIUS,
        top: joystickVisual.baseY - JOYSTICK_RADIUS,
        width: JOYSTICK_RADIUS * 2,
        height: JOYSTICK_RADIUS * 2,
      }
    : {
        position: "absolute",
        left: "15%",
        bottom: "25%",
        transform: "translate(-50%, 50%)",
        width: JOYSTICK_RADIUS * 2,
        height: JOYSTICK_RADIUS * 2,
      };

  const joystickKnobStyle: React.CSSProperties = joystickVisual.active
    ? {
        position: "absolute",
        left: joystickVisual.knobX - JOYSTICK_KNOB_RADIUS,
        top: joystickVisual.knobY - JOYSTICK_KNOB_RADIUS,
        width: JOYSTICK_KNOB_RADIUS * 2,
        height: JOYSTICK_KNOB_RADIUS * 2,
      }
    : {
        position: "absolute",
        left: "15%",
        bottom: "25%",
        transform: "translate(-50%, 50%)",
        width: JOYSTICK_KNOB_RADIUS * 2,
        height: JOYSTICK_KNOB_RADIUS * 2,
      };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", touchAction: "none" }}>

      {/* Canvas — always mounted */}
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, display: "block", touchAction: "none" }} />

      {/* Joystick zone — full screen, touch-action none so pointer events receive all input */}
      {gameState === "playing" && (
        <div
          ref={joystickZoneRef}
          onPointerDown={handleJoystickPointerDown}
          onPointerMove={handleJoystickPointerMove}
          onPointerUp={handleJoystickPointerEnd}
          onPointerCancel={handleJoystickPointerEnd}
          onLostPointerCapture={handleJoystickPointerEnd}
          onTouchStart={handleJoystickTouchStart}
          onTouchMove={handleJoystickTouchMove}
          onTouchEnd={handleJoystickTouchEnd}
          onTouchCancel={handleJoystickTouchEnd}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            touchAction: "none",
            userSelect: "none",
          }}
        >
          <div
            style={{
              ...joystickBaseStyle,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.28)",
              border: "2px solid rgba(255, 185, 33, 0.72)",
              boxShadow: "0 6px 24px rgba(0,0,0,0.14)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              ...joystickKnobStyle,
              borderRadius: "50%",
              background: "rgba(255, 185, 33, 0.82)",
              border: "2px solid rgba(229, 160, 0, 0.92)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
              pointerEvents: "none",
            }}
          />
        </div>
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
