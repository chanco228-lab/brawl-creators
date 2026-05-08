export const PLAYER = {
  WIDTH: 16,         // ellipse x-radius
  HEIGHT: 12,        // ellipse y-radius
  HITBOX_RADIUS: 10, // collision radius (forgiving)
  MAX_SPEED: 4.5,
  ACCEL: 0.8,
  FRICTION: 0.85,
  COLOR: "#FFB921",
  STROKE: "#E5A000",
};

export const BULLET = {
  BASE_SPEED: 2.5,   // initial speed
  MAX_SPEED: 3.8,    // speed ceiling
  MIN_RADIUS: 6,
  MAX_RADIUS: 8,
  COLOR: "#FF4757",
  TRAIL_ALPHA: 0.12,
  TRAIL_LENGTH: 6,
};

export const DIFFICULTY = {
  INITIAL_INTERVAL: 600,  // ms between spawns
  MIN_INTERVAL: 200,
  INITIAL_COUNT: 2,
  MAX_COUNT: 6,
  SPEED_RAMP_TIME: 60,    // seconds to reach max speed
};

export const FIELD = {
  BG: "#F0EDE6",
  GRID: "rgba(0, 0, 0, 0.04)",
  BORDER: "rgba(0, 0, 0, 0.08)",
};

export const COLORS = {
  TEXT: "#1A1A1A",
  TEXT_MUTED: "#9B9BB0",
  SCORE: "#FFB921",
  FLASH: "rgba(255, 71, 87, 0.15)",
};
