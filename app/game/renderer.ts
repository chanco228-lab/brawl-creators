import { PLAYER, BULLET, FIELD, COLORS } from "./constants";
import type { BulletObj, Particle } from "./bullet-patterns";

// ── Field ──────────────────────────────────────────────────────────────────

export function drawField(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // Base colour — sandy beige like Brawl Stars ground
  ctx.fillStyle = FIELD.BG;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = FIELD.GRID;
  ctx.lineWidth = 1;

  // Horizontal lines — tighter near the top (perspective)
  const lineCount = 20;
  for (let i = 0; i <= lineCount; i++) {
    const t = i / lineCount;
    const y = H * (0.05 + t * 0.92);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Diagonal lines (left-leaning and right-leaning) → diamond grid feel
  const gridSize = 60;
  for (let x = -H; x < W + H; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + H * 0.6, H);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + H * 0.6, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  // Field border
  ctx.strokeStyle = FIELD.BORDER;
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);
}

// ── Player ─────────────────────────────────────────────────────────────────

export function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Ground shadow
  ctx.fillStyle = "rgba(0,0,0,0.10)";
  ctx.beginPath();
  ctx.ellipse(x, y + 7, 18, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = PLAYER.COLOR;
  ctx.strokeStyle = PLAYER.STROKE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y, PLAYER.WIDTH, PLAYER.HEIGHT, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Highlight
  ctx.fillStyle = "rgba(255,255,255,0.30)";
  ctx.beginPath();
  ctx.ellipse(x, y - 3, 9, 5, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ── Bullet ─────────────────────────────────────────────────────────────────

export function drawBullet(ctx: CanvasRenderingContext2D, b: BulletObj) {
  const r = b.radius;

  // Trail
  b.trail.forEach((pos, i) => {
    const alpha = ((i + 1) / b.trail.length) * BULLET.TRAIL_ALPHA;
    ctx.fillStyle = `rgba(255,71,87,${alpha})`;
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y, r * 0.8, r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.beginPath();
  ctx.ellipse(b.x, b.y + 4, r, r * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = BULLET.COLOR;
  ctx.beginPath();
  ctx.ellipse(b.x, b.y, r, r * 0.75, 0, 0, Math.PI * 2);
  ctx.fill();

  // Highlight
  ctx.fillStyle = "rgba(255,255,255,0.40)";
  ctx.beginPath();
  ctx.ellipse(b.x - 1, b.y - 2, r * 0.35, r * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ── Particles ──────────────────────────────────────────────────────────────

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = PLAYER.COLOR;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.radius * p.life, p.radius * p.life * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ── HUD ────────────────────────────────────────────────────────────────────

export function drawHUD(
  ctx: CanvasRenderingContext2D,
  score: number,
  best: number,
  W: number,
) {
  // Current score (left)
  ctx.textAlign = "left";
  ctx.font = "700 28px 'Outfit', sans-serif";
  ctx.fillStyle = COLORS.TEXT;
  ctx.fillText(`${score.toFixed(1)}s`, 20, 38);

  // Best (right)
  if (best > 0) {
    ctx.textAlign = "right";
    ctx.font = "500 15px 'Outfit', sans-serif";
    ctx.fillStyle = COLORS.TEXT_MUTED;
    ctx.fillText(`BEST  ${best.toFixed(1)}s`, W - 20, 34);
  }

  ctx.textAlign = "left";
}
