import { BULLET } from "./constants";

export interface BulletObj {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  trail: { x: number; y: number }[];
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;   // 1 → 0
  radius: number;
}

// ── Edge selection (weighted) ──────────────────────────────────────────────

type Edge = "top" | "left" | "right" | "bottom" | "top-left" | "top-right";

function getSpawnEdge(): Edge {
  const r = Math.random();
  if (r < 0.45) return "top";
  if (r < 0.60) return "left";
  if (r < 0.75) return "right";
  if (r < 0.80) return "bottom";
  if (r < 0.90) return "top-left";
  return "top-right";
}

function getSpawnPos(edge: Edge, W: number, H: number): { x: number; y: number } {
  switch (edge) {
    case "top":       return { x: Math.random() * W, y: -20 };
    case "left":      return { x: -20, y: Math.random() * H };
    case "right":     return { x: W + 20, y: Math.random() * H };
    case "bottom":    return { x: Math.random() * W, y: H + 20 };
    case "top-left":  return { x: -20, y: -20 };
    case "top-right": return { x: W + 20, y: -20 };
  }
}

function makeBullet(x: number, y: number, vx: number, vy: number, radius: number): BulletObj {
  // vx/vy already carry correct speed from callers — do NOT re-normalize with radius
  return { x, y, vx, vy, radius, trail: [] };
}

// ── Difficulty helpers ─────────────────────────────────────────────────────

export function getSpeed(elapsed: number): number {
  const t = Math.min(elapsed / 60, 1);
  return BULLET.BASE_SPEED + (BULLET.MAX_SPEED - BULLET.BASE_SPEED) * t;
}

export function getInterval(elapsed: number): number {
  if (elapsed < 5)  return 600;
  if (elapsed < 15) return 450;
  if (elapsed < 25) return 350;
  if (elapsed < 40) return 300;
  if (elapsed < 60) return 250;
  return 200;
}

export function getCount(elapsed: number): number {
  if (elapsed < 5)  return 3;
  if (elapsed < 15) return 3;
  if (elapsed < 25) return Math.random() < 0.5 ? 3 : 4;
  if (elapsed < 40) return 4;
  if (elapsed < 60) return 4;
  return Math.random() < 0.5 ? 4 : 5;
}

export type PatternName = "aim" | "spread" | "wave" | "cross";

export function getPattern(elapsed: number): PatternName {
  const r = Math.random();
  if (elapsed < 5) {
    return r < 0.70 ? "aim" : "spread";
  }
  if (elapsed < 15) {
    if (r < 0.50) return "aim";
    return "spread";
  }
  if (elapsed < 25) {
    if (r < 0.40) return "aim";
    if (r < 0.65) return "spread";
    return "wave";
  }
  if (elapsed < 40) {
    if (r < 0.30) return "aim";
    if (r < 0.55) return "spread";
    if (r < 0.75) return "wave";
    return "cross";
  }
  // 40s+ — all patterns
  if (r < 0.25) return "aim";
  if (r < 0.50) return "spread";
  if (r < 0.75) return "wave";
  return "cross";
}

// ── Patterns ──────────────────────────────────────────────────────────────

export function spawnAim(W: number, H: number, speed: number, px: number, py: number): BulletObj[] {
  const edge = getSpawnEdge();
  const { x, y } = getSpawnPos(edge, W, H);
  const baseAngle = Math.atan2(py - y, px - x);
  const spread = (Math.random() - 0.5) * 0.52; // ±~15 degrees
  const angle = baseAngle + spread;
  const r = BULLET.MIN_RADIUS + Math.random() * (BULLET.MAX_RADIUS - BULLET.MIN_RADIUS);
  return [makeBullet(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, r)];
}

export function spawnSpread(W: number, H: number, speed: number, px: number, py: number): BulletObj[] {
  const { x, y } = getSpawnPos("top", W, H);
  const baseAngle = Math.atan2(py - y, px - x);
  const count = 3 + Math.floor(Math.random() * 3); // 3-5
  const spreadAngle = 0.4;
  const bullets: BulletObj[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : (i / (count - 1)) - 0.5;
    const angle = baseAngle + t * spreadAngle * 2;
    bullets.push(makeBullet(x, y, Math.cos(angle) * speed * 0.9, Math.sin(angle) * speed * 0.9, BULLET.MIN_RADIUS));
  }
  return bullets;
}

export function spawnWave(W: number, H: number, speed: number): BulletObj[] {
  const bullets: BulletObj[] = [];
  const spacing = 50;
  const total = Math.floor(W / spacing);
  const gapCount = 2;
  const gaps = new Set<number>();
  while (gaps.size < gapCount) gaps.add(Math.floor(Math.random() * total));

  for (let i = 0; i < total; i++) {
    if (gaps.has(i)) continue;
    bullets.push({
      x: i * spacing + spacing / 2,
      y: -20,
      vx: 0,
      vy: speed * 0.8,
      radius: BULLET.MAX_RADIUS,
      trail: [],
    });
  }
  return bullets;
}

export function spawnCross(W: number, H: number, speed: number): BulletObj[] {
  const bullets: BulletObj[] = [];
  const r = 7;
  // Left-to-right stream from top-left
  for (let i = 0; i < 3; i++) {
    bullets.push({
      x: -20, y: -20 + i * 30,
      vx: speed * 0.9, vy: speed * 0.7,
      radius: r, trail: [],
    });
  }
  // Right-to-left stream from top-right
  for (let i = 0; i < 3; i++) {
    bullets.push({
      x: W + 20, y: -20 + i * 30,
      vx: -speed * 0.9, vy: speed * 0.7,
      radius: r, trail: [],
    });
  }
  return bullets;
}

// ── Spawn dispatcher ───────────────────────────────────────────────────────

export function spawnBullets(
  pattern: PatternName,
  W: number,
  H: number,
  speed: number,
  px: number,
  py: number,
): BulletObj[] {
  switch (pattern) {
    case "aim":    return spawnAim(W, H, speed, px, py);
    case "spread": return spawnSpread(W, H, speed, px, py);
    case "wave":   return spawnWave(W, H, speed);
    case "cross":  return spawnCross(W, H, speed);
  }
}

// ── Particles ──────────────────────────────────────────────────────────────

export function spawnParticles(px: number, py: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.6;
    const spd = 2.5 + Math.random() * 3.5;
    particles.push({
      x: px, y: py,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      life: 1,
      radius: 5 + Math.random() * 4,
    });
  }
  return particles;
}
