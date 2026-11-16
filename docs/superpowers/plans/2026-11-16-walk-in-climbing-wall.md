# Walk-in Climbing Wall Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat publication-wall background with a CSS 3D bouldering-gym corner on a white page, with slow pointer parallax and a hand-drawn standing climber.

**Architecture:** Pure camera/lean maths lives in `lib/climbing-scene.ts` (unit-tested with `node:test`). A new presentational `ClimbingRoom` component renders the room planes, grey holds and fades, scales a fixed logical stage to the available width, and runs the camera loop. `BoulderingResearch` keeps its popover logic, renders paper holds and the climber into the room's back wall, and pauses the camera while a popover is open.

**Tech Stack:** React 19 + Vinext (static export), plain CSS in `app/globals.css`, Base UI Popover, Node's built-in test runner with type stripping.

**Spec:** `docs/superpowers/specs/2026-11-16-walk-in-climbing-wall-design.md`

## Global Constraints

- No new npm dependencies. Static export must keep working (`npm run build`, then `node scripts/verify-static.mjs`).
- Light white wall palette (exact values below, from mockup v2).
- Camera: time-based easing with τ = 750 ms; idle drift `x = sin(t/7000)·0.2`, `y = cos(t/9500)·0.1`; output `perspective-origin: (50 + 34x)% (50 + 24y)%` and room `translate3d(-18x px, -12y px, 0)`.
- Camera is static when `prefers-reduced-motion: reduce` or the device has no fine pointer; paused while any paper popover is open or the wall is off-screen.
- Paper holds keep their current `x`/`y` percentages in `route`; each `route` entry keeps its `id: '<arxiv>'` line (the static check greps for it).
- Holds stay `<button>`s with `aria-label` = paper title; hover preview and click-to-pin behaviour unchanged.
- Climber: `public/artwork/climber-standing.png`, transparent, 1:2 portrait, feet at the bottom; it leans toward the open paper by at most 3° over 0.6 s.
- Remove `public/artwork/climbing-wall.png`, `public/artwork/climbing-poses.png`, the `--wall-wash-*` variables, and the CSS that used them.
- Commits only with the user's go-ahead. The earlier readability/white-background edit to `app/globals.css` is still uncommitted; commit it on its own before Task 2 touches the same file.

Light wall palette (CSS custom properties on the room):

| token                        | value                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| back wall                    | `linear-gradient(172deg, #f5f6f7, #e8ebee)`                                                                   |
| overhang                     | `linear-gradient(0deg, #dfe3e8, #d3d9df)`                                                                     |
| left wall                    | `linear-gradient(90deg, #d2d8de, #dce1e6)`                                                                    |
| right wall                   | `linear-gradient(90deg, #ebe8e3, #f2f0ec)`                                                                    |
| floor                        | `linear-gradient(#d3d9df, #c4ccd3)` + white seams `rgba(255,255,255,.22)` every 225 px and `.16` every 180 px |
| bolt dots                    | `radial-gradient(circle, rgba(40,50,62,.13) 1.3px, transparent 1.8px)` on a 41 px grid                        |
| panel seams                  | `rgba(40,50,62,.05)` 1 px every 225 px (back wall)                                                            |
| hold shadow                  | `drop-shadow(4px 7px 5px rgba(25,35,45,.24))`; hover/open: `drop-shadow(6px 11px 7px …)` and `scale(1.1)`     |
| fades to `var(--background)` | top 26 %, bottom 14 %, left/right 7 %                                                                         |

Room geometry (logical px; the stage is scaled to the viewport width):

|          | stage   | perspective | back wall (w×h, z) | overhang                                           | side walls (depth×h) | floor (w×depth) | paper hold                     |
| -------- | ------- | ----------- | ------------------ | -------------------------------------------------- | -------------------- | --------------- | ------------------------------ |
| ≥ 651 px | 960×600 | 900         | 900×600, z −200    | 900×560, `rotateX(-28deg)` hinged on back-wall top | 900×1400             | 900×900         | 48                             |
| ≤ 650 px | 480×720 | 760         | 440×600, z −120    | 440×420                                            | 600×1400             | 440×600         | 60 (≥ 44 px on a 375 px phone) |

Plane transforms follow `walk-in-wall-v2.html`: left wall `translate3d(-w/2, …, +near) rotateY(90deg)`, right wall `translate3d(+w/2, …, -depth) rotateY(-90deg)`, floor `rotateX(90deg)` from the back-wall bottom edge — so every plane's front face points into the room.

## Review Focus

1. **Popover drifting off its hold** — with the camera moving, an open card must stay attached. Pausing the camera while open covers it; Task 2 checks it by hand.
2. **Touch phones** — tapping a hold must open (pin) the card, the camera must stay still, and there must be no horizontal scroll at 375 px. Task 2 checks this in the mobile viewport.
3. **Reduced motion** — no drift, no lean transition. Unit-tested via `cameraMode`; Task 3 also checks the lean CSS under `prefers-reduced-motion`.
4. **Off-screen CPU** — the animation loop must stop when the wall leaves the viewport. Unit-tested via `cameraMode`; Task 2 checks that `requestAnimationFrame` stops (no updates to `perspective-origin` while scrolled away).
5. **Keyboard** — Tab reaches every paper hold with a visible focus ring despite the 3D transform; Escape closes. Task 2 checks this by hand.

---

### Task 1: Scene maths module

**Files:**

- Create: `lib/climbing-scene.ts`
- Test: `lib/climbing-scene.test.mjs`
- Modify: `package.json` (add `"test"` script), `.github/workflows/deploy-pages.yml` (run tests after lint)

**Interfaces:**

- Produces:
  - `type Camera = { x: number; y: number }` (normalised, −0.5…0.5)
  - `type CameraMode = 'static' | 'paused' | 'live'`
  - `cameraMode(o: { reducedMotion: boolean; finePointer: boolean; inView: boolean; popoverOpen: boolean }): CameraMode`
  - `idleTarget(timeMs: number): Camera`
  - `stepCamera(current: Camera, target: Camera, dtMs: number): Camera`
  - `cameraStyle(c: Camera): { perspectiveOrigin: string; transform: string }`
  - `CLIMBER_X = 12` (percent of back-wall width)
  - `climberLean(holdX: number | null, climberX?: number): number` (degrees)

- [ ] **Step 1: Write the failing tests** in `lib/climbing-scene.test.mjs` (imports `./climbing-scene.ts`):

```js
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
  const from = { x: 0, y: 0 },
    to = { x: 0.4, y: -0.2 };
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
test('climberLean is gentle and capped at 3 degrees', () => {
  assert.equal(climberLean(null), 0);
  assert.equal(climberLean(CLIMBER_X), 0);
  assert.equal(climberLean(72), 3);
  assert.ok(Math.abs(climberLean(0) + 0.96) < 1e-9);
  assert.equal(climberLean(-100), -3);
});
```

- [ ] **Step 2: Add the script and run the tests to see them fail**

`package.json` scripts: `"test": "node --experimental-strip-types --test \"lib/**/*.test.mjs\""`.
Run: `npm test` — Expected: FAIL, cannot find module `./climbing-scene.ts`.

- [ ] **Step 3: Implement `lib/climbing-scene.ts`** with the signatures above and the constants from Global Constraints. Lean is `clamp((holdX - climberX) * 0.08, -3, 3)`. `cameraStyle` uses `-0` → `0` normalisation so the zero case prints `0px`. `static` wins over `paused`.

- [ ] **Step 4: Run the tests** — `npm test` — Expected: 5 passing.

- [ ] **Step 5: Run unit tests in CI**: add a step `- name: Run unit tests` / `run: npm test` right after "Check source" in `.github/workflows/deploy-pages.yml`.

- [ ] **Step 6: Commit** (with the user's go-ahead) — `git add lib/climbing-scene.ts lib/climbing-scene.test.mjs package.json .github/workflows/deploy-pages.yml && git commit -m "Add camera and lean maths for the climbing room"`

### Task 2: The 3D room, wired into the publication wall

**Files:**

- Create: `components/climbing-room.tsx`
- Modify: `components/bouldering-research.tsx` (render into the room; drop `supports`, `grip`, `highestHold`, the sprite climber; keep `route`, `futureHolds`, popover logic)
- Modify: `app/globals.css` (remove `.wall-surface::before`, `.climbing-canvas`, `.future-hold`, `.support-hold`, `.route-climber*` rules and their media-query copies, and `--wall-wash-*` in `:root`/`.dark`; add a `/* Walk-in climbing room. */` section)
- Modify: `scripts/verify-static.mjs` (drop `artwork/climbing-wall.png` from the asset list)
- Delete: `public/artwork/climbing-wall.png`, `content/climbing-wall-prompt.txt`

**Interfaces:**

- Consumes: `cameraMode`, `idleTarget`, `stepCamera`, `cameraStyle` from Task 1.
- Produces: `ClimbingRoom({ paused, children }: { paused: boolean; children: React.ReactNode }): React.JSX.Element`. `children` are absolutely positioned inside the back-wall plane (`.room-back`, `position: relative`, `transform-style: preserve-3d`); place them with `left`/`top` percentages. The outer element keeps class `wall-surface` (full-bleed `width: min(1440px, calc(100vw - 48px))`, centred as today).

- [ ] **Step 1: Build `ClimbingRoom`**: planes `room-floor`, `room-left`, `room-right`, `room-back` (children), `room-over`; fades; grey decorative holds on the overhang (10) and side walls (5 per side) as `aria-hidden` sprite spans with the existing `rock-sprite` class and `spritePosition`. Scale: a `ResizeObserver` on the viewport sets `transform: scale(viewport.clientWidth / stage.offsetWidth)` on the stage; the viewport's `aspect-ratio` matches the stage per breakpoint. Camera: one `requestAnimationFrame` loop that reads `cameraMode` each frame (media queries `(prefers-reduced-motion: reduce)` and `(pointer: fine)` via `matchMedia` listeners, `IntersectionObserver` for `inView`, `paused` prop for `popoverOpen`), targets the pointer position over the viewport (or `idleTarget` when the pointer is outside), and writes `cameraStyle` straight to the stage/room elements (no React state per frame). `static` sets `{x:0,y:0}` once and stops the loop; `paused` stops the loop until the mode changes.

- [ ] **Step 2: Move the wall into the room** in `bouldering-research.tsx`: `<ClimbingRoom paused={openId !== null}>` wraps the paper-hold popover triggers and the back-wall grey holds. Drop `futureHolds` entries with `x < 20 && y > 58` (the climber's spot from Task 3). Paper holds get `translateZ(12px)`, the hold shadow and the hover/open scale from the palette table; keep the pinned ring.

- [ ] **Step 3: CSS cleanup and room styles** per the palette and geometry tables. Remove the old wall rules and variables listed under Files. Delete `public/artwork/climbing-wall.png` and `content/climbing-wall-prompt.txt`; remove it from `scripts/verify-static.mjs`.

- [ ] **Step 4: Static checks** — Run: `npm run lint && npm test && npm run build && node scripts/verify-static.mjs && npx oxfmt --check app components lib scripts` — Expected: all pass, no output from the verify script.

- [ ] **Step 5: Browser check, desktop 1440×900** (dev server `site-dev` in `.claude/launch.json`): the wall reads as a white gym corner with no visible box edge; moving the pointer shifts the view slowly; hovering a hold opens its card and the card stays attached while the pointer keeps moving (Review Focus 1); Tab reaches each hold with a visible ring and Escape closes (5); after scrolling the wall out of view, `perspective-origin` on the stage stops changing (4).

- [ ] **Step 6: Browser check, mobile 375×812**: no horizontal scroll (`scrollWidth === clientWidth`), holds ≥ 44 px, tapping a hold pins its card, no drift (2).

- [ ] **Step 7: Commit** (with the user's go-ahead) — `git add -A components app scripts public content && git commit -m "Turn the publication wall into a walk-in climbing room"`

### Task 3: Standing climber

**Files:**

- Create: `public/artwork/climber-standing.png` (placeholder until the user's generated image replaces it), `content/climber-standing-prompt.json`
- Modify: `components/bouldering-research.tsx`, `app/globals.css`, `scripts/verify-static.mjs`, `README.md` (Illustration assets section and the wall paragraphs), `content/artwork-prompts.json` (`note` points to `climber-standing-prompt.json`)
- Delete: `public/artwork/climbing-poses.png`, `content/climbing-poses-prompts.json`

**Interfaces:**

- Consumes: `CLIMBER_X`, `climberLean` from Task 1; `ClimbingRoom` children slot from Task 2.

- [ ] **Step 1: Placeholder image** — draw a back-view standing figure in the site palette (teal cap `#127d7a`, navy shirt `#2e3a8c`, orange trousers `#f0691d`, skin `#f2c27e`, shoes `#24315f`, ink `#171717` outlines) as an SVG in the scratchpad, render with `rsvg-convert -w 512 -h 1024` to `public/artwork/climber-standing.png`, transparent, feet 6 % above the bottom edge.

- [ ] **Step 2: Prompt record** — `content/climber-standing-prompt.json` with `mode` ("external image generator, run by the site owner"), `references` (style reference; `climbing-poses.png` as it was before deletion), `generation_prompt` (the exact prompt given to the user on 2026-11-16), `final_asset: "public/artwork/climber-standing.png"`, `status: "placeholder until replaced"`.

- [ ] **Step 3: Render the climber** in the back wall, with `const openHold = route.find((hold) => hold.id === openId)`: `<span className="room-climber" aria-hidden="true" style={{ '--lean': `${climberLean(openHold?.x ?? null)}deg` }} />` at `left: CLIMBER_X%`, `bottom: 0`, height 39 % of the wall on desktop and 30 % on ≤ 650 px, `aspect-ratio: 1 / 2`, background `url('/artwork/climber-standing.png') center bottom / contain no-repeat`, `transform: translateX(-50%) translateZ(30px) rotate(var(--lean))`, `transform-origin: 50% 100%`, `transition: transform 0.6s ease`, the hold drop shadow; `transition: none` under reduced motion.

- [ ] **Step 4: Remove the old sprite** — delete `public/artwork/climbing-poses.png` and `content/climbing-poses-prompts.json`; in `scripts/verify-static.mjs` replace `artwork/climbing-poses.png` with `artwork/climber-standing.png`; update `README.md` and the `artwork-prompts.json` note.

- [ ] **Step 5: Static checks** — same command as Task 2 Step 4 — Expected: all pass.

- [ ] **Step 6: Browser check** — desktop: climber stands on the floor line at the left, not covering a paper hold; hovering a hold on the right leans him right (≤ 3°), closing returns him upright. Reduced-motion emulation: lean changes without animating (3). Mobile 375×812: climber visible, nothing overlaps a hold.

- [ ] **Step 7: Commit** (with the user's go-ahead) — `git add -A components app scripts public content README.md && git commit -m "Add a standing climber in front of the wall"`
