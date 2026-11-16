// Camera and climber maths for the walk-in climbing room.

/** Normalised camera offset; each axis runs from -0.5 to 0.5. */
export type Camera = { x: number; y: number };
export type CameraMode = 'static' | 'paused' | 'live';

const CAMERA_TAU_MS = 750;
const IDLE = { xAmp: 0.2, yAmp: 0.1, xPeriodMs: 7000, yPeriodMs: 9500 };

/** Horizontal position of the standing climber, in percent of the back wall. */
export const CLIMBER_X = 12;
const MAX_LEAN_DEG = 3;

export function cameraMode(o: {
  reducedMotion: boolean;
  finePointer: boolean;
  inView: boolean;
  popoverOpen: boolean;
}): CameraMode {
  if (o.reducedMotion || !o.finePointer) return 'static';
  if (!o.inView || o.popoverOpen) return 'paused';
  return 'live';
}

/** Slow drift used while the pointer is away from the wall. */
export function idleTarget(timeMs: number): Camera {
  return {
    x: Math.sin(timeMs / IDLE.xPeriodMs) * IDLE.xAmp,
    y: Math.cos(timeMs / IDLE.yPeriodMs) * IDLE.yAmp,
  };
}

export function stepCamera(
  current: Camera,
  target: Camera,
  dtMs: number,
): Camera {
  const k = 1 - Math.exp(-dtMs / CAMERA_TAU_MS);
  return {
    x: current.x + (target.x - current.x) * k,
    y: current.y + (target.y - current.y) * k,
  };
}

const round = (value: number) => Math.round(value * 100) / 100 || 0;

export function cameraStyle(c: Camera): {
  perspectiveOrigin: string;
  transform: string;
} {
  return {
    perspectiveOrigin: `${round(50 + c.x * 34)}% ${round(50 + c.y * 24)}%`,
    transform: `translate3d(${round(-c.x * 18)}px, ${round(-c.y * 12)}px, 0)`,
  };
}

/** Degrees the climber turns toward an open paper hold. */
export function climberLean(holdX: number | null, climberX = CLIMBER_X) {
  if (holdX === null) return 0;
  const lean = (holdX - climberX) * 0.08;
  return Math.max(-MAX_LEAN_DEG, Math.min(MAX_LEAN_DEG, lean)) || 0;
}
