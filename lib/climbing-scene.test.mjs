import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  cameraMode,
  cameraStyle,
  idleTarget,
  stepCamera,
} from './climbing-scene.ts';

test('cameraMode', () => {
  const base = {
    reducedMotion: false,
    finePointer: true,
    inView: true,
    popoverOpen: false,
  };
  assert.equal(cameraMode(base), 'live');
  assert.equal(cameraMode({ ...base, reducedMotion: true }), 'static');
  assert.equal(cameraMode({ ...base, finePointer: false }), 'static');
  assert.equal(cameraMode({ ...base, popoverOpen: true }), 'paused');
  assert.equal(cameraMode({ ...base, inView: false }), 'paused');
  assert.equal(
    cameraMode({ ...base, reducedMotion: true, popoverOpen: true }),
    'static',
  );
});

test('idleTarget', () => {
  assert.deepEqual(idleTarget(0), { x: 0, y: 0.1 });
  for (const t of [1234, 5e4, 9e5]) {
    const c = idleTarget(t);
    assert.ok(Math.abs(c.x) <= 0.2 && Math.abs(c.y) <= 0.1);
  }
});

test('stepCamera eases with a 750 ms time constant', () => {
  const from = { x: 0, y: 0 };
  const to = { x: 0.4, y: -0.2 };
  assert.deepEqual(stepCamera(from, to, 0), from);
  const one = stepCamera(from, to, 750);
  assert.ok(Math.abs(one.x - 0.4 * (1 - Math.exp(-1))) < 1e-9);
  const far = stepCamera(from, to, 60_000);
  assert.ok(Math.abs(far.x - 0.4) < 1e-9 && Math.abs(far.y + 0.2) < 1e-9);
});

test('cameraStyle', () => {
  assert.deepEqual(cameraStyle({ x: 0, y: 0 }), {
    perspectiveOrigin: '50% 50%',
    transform: 'translate3d(0px, 0px, 0)',
  });
  assert.deepEqual(cameraStyle({ x: 0.5, y: -0.5 }), {
    perspectiveOrigin: '67% 38%',
    transform: 'translate3d(-9px, 6px, 0)',
  });
});
