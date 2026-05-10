import { BULLET } from "./constants";

export interface ObstacleObj {
  x: number; // left edge
  y: number; // top edge
  w: number;
  h: number;
}

export function generateObstacles(W: number, H: number): ObstacleObj[] {
  const obstacles: ObstacleObj[] = [];
  const cx = W / 2, cy = H / 2;
  const clearR = 130; // keep center free for player spawn
  let attempts = 0;
  const target = 4 + Math.floor(Math.random() * 2); // 4-5

  while (obstacles.length < target && attempts < 300) {
    attempts++;
    const ow = 44 + Math.floor(Math.random() * 52); // 44-96px
    const oh = 28 + Math.floor(Math.random() * 32); // 28-60px
    const margin = 36;
    const ox = margin + Math.random() * (W - ow - margin * 2);
    const oy = margin + Math.random() * (H - oh - margin * 2);

    // Don't overlap center safe zone
    const closestX = Math.max(ox, Math.min(cx, ox + ow));
    const closestY = Math.max(oy, Math.min(cy, oy + oh));
    if (Math.hypot(closestX - cx, closestY - cy) < clearR) continue;

    // Don't overlap existing obstacles (with padding)
    const pad = 20;
    const overlaps = obstacles.some(
      (o) => ox < o.x + o.w + pad && ox + ow > o.x - pad &&
              oy < o.y + o.h + pad && oy + oh > o.y - pad,
    );
    if (overlaps) continue;

    obstacles.push({ x: ox, y: oy, w: ow, h: oh });
  }
  return obstacles;
}

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

// ── Edge selection (weighted, adaptive) ────────────────────────────────────

type Edge = "top" | "left" | "right" | "bottom" | "top-left" | "top-right";

function getSpawnEdge(px?: number, py?: number, W?: number, H?: number): Edge {
  const r = Math.random();
  // When player is in the lower 40% of the field, bias spawns toward bottom/sides
  if (px !== undefined && py !== undefined && W !== undefined && H !== undefined
      && py > H * 0.6) {
    if (r < 0.30) return "top";
    if (r < 0.50) return "left";
    if (r < 0.70) return "right";
    if (r < 0.90) return "bottom";
    if (r < 0.95) return "top-left";
    return "top-right";
  }
  // Default weights (top-heavy)
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
  const edge = getSpawnEdge(px, py, W, H);
  const { x, y } = getSpawnPos(edge, W, H);
  const baseAngle = Math.atan2(py - y, px - x);
  const spread = (Math.random() - 0.5) * 0.52; // ±~15 degrees
  const angle = baseAngle + spread;
  const r = BULLET.MIN_RADIUS + Math.random() * (BULLET.MAX_RADIUS - BULLET.MIN_RADIUS);
  return [makeBullet(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, r)];
}

export function spawnSpread(W: number, H: number, speed: number, px: number, py: number): BulletObj[] {
  const edge = py > H * 0.6 ? getSpawnEdge(px, py, W, H) : "top";
  const { x, y } = getSpawnPos(edge, W, H);
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
