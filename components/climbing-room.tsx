'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import {
  cameraMode,
  cameraStyle,
  idleTarget,
  stepCamera,
  type Camera,
} from '@/lib/climbing-scene';

type SpareHold = [x: number, y: number, sprite: number, angle: number];

// Grey holds on the walls around the route, in percent of each plane.
const overhangHolds: SpareHold[] = [
  [12, 20, 1, 20],
  [35, 12, 4, -15],
  [62, 22, 7, 12],
  [86, 10, 2, -20],
  [20, 52, 5, 10],
  [48, 45, 0, -12],
  [78, 60, 6, 18],
  [10, 82, 3, -8],
  [55, 78, 2, 25],
  [90, 86, 4, 0],
];
// The left wall runs from the viewer (x = 0) to the back corner.
const leftWallHolds: SpareHold[] = [
  [33, 71, 4, 15],
  [62, 87, 1, -10],
  [84, 64, 7, 6],
  [50, 59, 2, -12],
  [72, 77, 5, 9],
];
// The right wall runs from the back corner (x = 0) to the viewer.
const rightWallHolds: SpareHold[] = [
  [13, 59, 3, 12],
  [42, 67, 0, -14],
  [24, 84, 5, 8],
  [58, 91, 2, -20],
  [76, 76, 6, 10],
];

export function spritePosition(sprite: number) {
  return `${((sprite % 4) * 100) / 3}% ${Math.floor(sprite / 4) * 100}%`;
}

export function SpareHolds({ holds }: { holds: SpareHold[] }) {
  return holds.map(([x, y, sprite, angle], index) => (
    <span
      key={index}
      className="room-hold rock-sprite"
      aria-hidden="true"
      style={
        {
          left: `${x}%`,
          top: `${y}%`,
          backgroundPosition: spritePosition(sprite),
          '--r': `${angle}deg`,
        } as CSSProperties
      }
    />
  ));
}

export function ClimbingRoom({
  paused,
  label,
  children,
}: {
  paused: boolean;
  label?: string;
  children: ReactNode;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const wakeRef = useRef<() => void>(() => {});

  useEffect(() => {
    const viewport = viewportRef.current;
    const stage = stageRef.current;
    const room = roomRef.current;
    if (!viewport || !stage || !room) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(pointer: fine)');
    let inView = false;
    let pointer: Camera | null = null;
    let camera: Camera = { x: 0, y: 0 };
    let frame = 0;
    let last = 0;

    const apply = (c: Camera) => {
      const style = cameraStyle(c);
      stage.style.perspectiveOrigin = style.perspectiveOrigin;
      room.style.transform = style.transform;
    };
    const mode = () =>
      cameraMode({
        reducedMotion: reduced.matches,
        finePointer: fine.matches,
        inView,
        popoverOpen: pausedRef.current,
      });
    const tick = (time: number) => {
      frame = 0;
      if (mode() !== 'live') return;
      const dt = last ? Math.min(time - last, 100) : 0;
      last = time;
      camera = stepCamera(camera, pointer ?? idleTarget(time), dt);
      apply(camera);
      frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      const current = mode();
      if (current === 'static') {
        cancelAnimationFrame(frame);
        frame = 0;
        camera = { x: 0, y: 0 };
        apply(camera);
      } else if (current === 'live' && !frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    wakeRef.current = wake;

    const clamp = (value: number) => Math.max(-0.5, Math.min(0.5, value));
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = viewport.getBoundingClientRect();
      pointer = {
        x: clamp((event.clientX - rect.left) / rect.width - 0.5),
        y: clamp((event.clientY - rect.top) / rect.height - 0.5),
      };
    };
    const onLeave = () => {
      pointer = null;
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      wake();
    });
    observer.observe(viewport);
    viewport.addEventListener('pointermove', onMove);
    viewport.addEventListener('pointerleave', onLeave);
    reduced.addEventListener('change', wake);
    fine.addEventListener('change', wake);
    wake();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      viewport.removeEventListener('pointermove', onMove);
      viewport.removeEventListener('pointerleave', onLeave);
      reduced.removeEventListener('change', wake);
      fine.removeEventListener('change', wake);
    };
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
    wakeRef.current();
  }, [paused]);

  return (
    <div className="wall-surface" ref={viewportRef}>
      <div className="room-stage" ref={stageRef}>
        <div className="room" ref={roomRef}>
          <div className="room-plane room-floor" />
          <div className="room-plane room-left">
            <SpareHolds holds={leftWallHolds} />
          </div>
          <div className="room-plane room-right">
            <SpareHolds holds={rightWallHolds} />
          </div>
          <div className="room-plane room-over">
            <SpareHolds holds={overhangHolds} />
          </div>
          <div
            className="room-plane room-back"
            role={label ? 'group' : undefined}
            aria-label={label}
          >
            {children}
          </div>
        </div>
      </div>
      <div className="room-fade" aria-hidden="true" />
    </div>
  );
}
