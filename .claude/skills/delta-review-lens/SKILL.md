---
name: delta-review-lens
description: Project lens for Tension Grid, an HTML5 canvas arcade game in vanilla JavaScript with no build system and no dependencies. Supplies the project-specific briefs — architecture, domain, security, resource parity and style — that the delta-review skill turns into reviewer agents. Not a standalone review skill: it defines no change-set collection, orchestration, severities, or fixes of its own.
---

This file is a **lens**, not a review. The `delta-review` skill reads it, takes each `##` section below as one reviewer brief, and owns everything else — collecting the change set, spawning agents, refuting findings, assigning severity, reporting, and fixing. Nothing here overrides that.

**The project.** A retro-futuristic grid arcade game. Static site, no build step, no dependencies, no linter, no test suite — every rule below is enforced by review alone. Source lives in `public/js/` across eight directories: `main` (entry point and constants), `engine` (grid, player, game orchestration, collision, structural elements), `enemies`, `effects`, `animations`, `helpers` (shared behaviour managers), `io` (input, audio, storage, UI, error notification), and `ui` (renderer, camera, screens). Levels are JSON files in `public/levels/`.

**What to read first.** `AGENTS.md` and `docs/architecture.md` for every review. Add `docs/level-design.md` and `docs/levels.md` whenever the change touches `public/levels/` — design rules there are binding, and a level change is judged against them, not against taste.

## Architecture

Layer boundaries, registration, reuse conventions, framework-idiom misuse, and the failure modes of a 60fps canvas game.

- **Rendering belongs to `Renderer`.** Entities hold state and expose it; they do not draw. A `ctx` call appearing in `engine/`, `enemies/`, `effects/` or `animations/` is a boundary break. Conversely, game logic — collision decisions, state transitions, scoring — must not live in `ui/` or in screen handling.
- **Reuse the existing abstractions rather than re-deriving them:** `GridMovement` for node-to-node interpolation, `WakeTrail` for trails, `IntermittentState` for on/off hazard cycling, `ParticleExplosion` for particle bursts, `Collision` for every hit test, `Vector2`, `Grid`, `Camera`, `EffectManager`/`EffectTypes`/`Effect`, `LocalStorage`, `AudioManager`, `Analytics`. A change that hand-rolls interpolation, its own timer toggle, or its own distance check is duplicating a tested abstraction and will drift from it.
- **New effects go through the `EffectTypes` registry** — `category`, `stackMode`, `stackGroup`, `apply`/`remove`/`onHit`, `renderHint` — not through bespoke booleans on `Player`. `Player` helpers like `hasShield()` must stay thin delegations to `effectManager`.
- **New enemies follow the enemy contract:** config-driven constructor, `update(delta)`, position and state exposed for the renderer, lifecycle owned by `EnemyManager`. Anything a switch can target additionally implements `open(ttl)` / `close()` and is discoverable through `Game.registerUnlockables()` with an `id`.
- **`localStorage` is reached only through `js/io/local_storage.js`**, whose access is try/catch-guarded for Safari private browsing. A direct `localStorage` call anywhere else throws in that mode and takes the screen down with it.
- **Every new file must be added as a `<script>` tag in `public/index.html`.** There is no bundler and no module loader — 41 tags load 41 files by hand, in dependency order. A new class that nothing loads is dead code that looks alive; a tag in the wrong order is a runtime `undefined`.
- **One class per file. `async`/`await`, never `Promise`/`.then`.**
- **Runtime failure modes to hunt, all specific to a per-frame loop:** allocation inside `update()`/`draw()` — object, array, or closure literals created every frame become GC hitches; `ctx.shadowBlur` set per entity rather than per layer; redundant `worldToScreen` conversions for the same point; draw calls that break the glow → main → highlight layering; `requestAnimationFrame` loops, listeners, or intervals not cancelled when a screen changes; and any use of `delta` that bypasses the `Constants.physics` clamp, so a backgrounded tab resumes with a step large enough to teleport an entity through a hazard.

**Report shape:** the class or screen affected, the boundary or convention broken, and the runtime or maintenance consequence that follows.

## Domain

Game rules, grid maths, and level integrity — everywhere code can run perfectly and still produce the wrong game.

- **Coordinate order is the highest-frequency silent bug in this codebase.** Level JSON uses `{x, y}` meaning column and row; `Grid` methods take `(row, col)`. A swap yields a valid position on a square grid and a wrong one everywhere else. Check every conversion at the JSON boundary, and every call into `getNodePosition`, `isValidPosition`, `isExcluded`, `wrapPosition`.
- **Grid topology:** toroidal wrapping through `wrapPosition`; excluded edges are bidirectional and `isEdgeExcluded` must answer the same for both orderings; walls block every node lying on their segment, not just the endpoints.
- **Collision strategies are not interchangeable.** Circle collision with the `0.7` threshold applies to bullets, patrols and followers; grid collision — exact node match, and only while the player is stationary — applies to lasers, traps, shooters, powers, exit, switches and portals. Mines detect contact to start a countdown and must never kill on touch. Using the wrong strategy makes a hazard feel unfair or become unreachable.
- **Everything is delta-timed.** Movement, animation progress, effect countdowns, blink frequencies and spawn intervals all scale with `delta` and respect the `Constants.physics` maximum. Anything counting frames instead drifts on 120Hz displays and after tab restore.
- **Effect lifecycle:** effects in the same `stackGroup` replace rather than stack; durations come from the level's `ttl` except immunity, which is fixed; warning blink starts at `warningDuration` before expiry. A power collected while its own effect is active must not silently extend or double-apply.
- **Run timer and stars.** `runElapsed` accumulates only during live gameplay — never during death pause, exit animation, or pause — and resets on death and restart. Star thresholds are compared against it; `setStars` persists only an improvement; gym and custom levels bypass progression and analytics entirely. A timer that keeps ticking through a pause silently devalues every star threshold in the game.
- **Reset semantics.** Death reset restores powers, switches, mines, exit state and clears buffered input, while static elements — traps, walls — persist by design. A new element must declare which side it is on; getting it wrong makes a level unwinnable or trivial after one death.
- **Switch integrity:** every `unlocks` id resolves through `registerUnlockables()`, TTL expiry re-locks the target, and death re-closes it. The `connection` path is cosmetic, but it must follow the routing rules in `docs/level-design.md`.
- **Level JSON changes** are judged against `docs/level-design.md`: star thresholds strictly decreasing from star 1 to star 3, portals paired by group, patrol paths cyclic and reachable, no unavoidable death at spawn, and the exit actually reachable given walls, excluded nodes and excluded edges.

**Report shape:** a reachable in-game scenario, the rule or invariant it violates, and what the player observes.

## Security

The trust boundary is narrow but real: an uploaded custom level file, hand-editable local storage, and outbound links. There is no server, no account, and no secret worth stealing — so weight findings by whether they crash the game or let level content reach a dangerous sink, not by conventional web-app severity.

- **Uploaded level JSON is attacker-controlled input.** `handleCustomLevelFile` does `JSON.parse` inside a `try`/`catch` that only covers malformed *syntax*; a structurally valid file with missing fields, wrong types, negative or enormous grid dimensions, absurd entity counts, or unresolvable switch targets flows straight into `Game.start()`. Any change touching that path must keep failures contained to the parse/handoff site and must not let level data reach an unbounded allocation or an infinite loop.
- **Never let level-provided values reach a markup or code sink.** `innerHTML` currently appears only in `ui/screen.js` and only to clear containers; assigning level-derived text into it, or introducing `eval`, `new Function`, `document.write` or `insertAdjacentHTML`, turns a shared level file into script execution. Level strings rendered anywhere must go in as text.
- **No level-derived value may become a URL, fetch target, or resource path** — sound keys, image paths and external links are all resolved from `Constants`, and they must stay that way.
- **Local storage is user-editable.** Values read back — current level, per-level stars, the three settings toggles — must be validated and clamped on read. This is single-player, so tampering is the player's business; a hand-edited value that crashes the menu or blocks progression is not.
- **External links** (`Constants.urls`) stay static and, when opened in a new tab, carry `rel="noopener"`.
- **Analytics must never carry user content** — a custom level's name or file contents must not reach `Analytics.sendEvent`.
- **Everything shipped is public.** A key or token added to `constants.js` is published the moment it deploys.

**Report shape:** the attacker capability (a crafted level file, an edited storage value, a hostile link), the path from that input to the sink, the asset or behaviour affected, and the smallest fix.

## Resource parity

The game ships no translations, but several sets must stay in step, and drift between them is silent.

- **Adding or editing a file in `public/levels/` requires all three:** the JSON file itself, `Constants.game.totalLevels`, and an entry in `docs/levels.md`. A level added without the count bumped is unreachable; a count bumped past the files causes a failed fetch on completion.
- **Every asset path in `Constants.audio.sounds` and `Constants.audio.music` must exist on disk**, and every sound played must go through a constant rather than a literal path.
- **`Constants.screens` and `Constants.actions.*` must correspond to real markup and real handlers.** An action string with no branch in the menu handler, or a screen constant with no element, dead-ends silently — nothing throws.
- **`Constants.storage` keys are a persistence contract.** Renaming one orphans existing players' stars, progress and settings with no migration path; the game will look freshly installed to everyone who had played it.
- **Settings toggles must be honoured at every production site.** Glow is suppressed through `Renderer.shadow()`, so a new `ctx.shadowBlur` written directly ignores the setting; scanlines through the `body::after` rule; audio through `AudioManager`. A new effect that bypasses its toggle makes the setting look broken.
- **CSS and JS are coupled by class name.** A class toggled from JavaScript — `body.game-active` and its kin — must exist in `styles.css`, and a renamed CSS class must be followed everywhere it is toggled.

**Report shape:** the two sides that drifted, and the user-visible consequence of the drift.

## Style

Written conventions no tool enforces here — there is no linter, no formatter, and no CI. Everything in this section is a **Nit**; if it has a behavioural consequence it belongs to Architecture or Domain instead.

- **No semicolons.**
- **Naming:** files `snake_case`, classes `PascalCase`, functions `camelCase` with no underscore prefix.
- **No abbreviations.** Full descriptive names for variables; only `i`, `j`, `x`, `y`, `dx`, `dy` and `ctx` may be short. Unused parameters are `_`, `__`, `___` in order.
- **No magic values.** Every tunable, colour, duration, size, speed, threshold and key belongs in `public/js/main/constants.js`. Check `constants.js` before flagging a literal — and flag a new constant that duplicates an existing one under a different name.
- **Comments follow a fixed shape:** a JSDoc block on every class describing its role; a JSDoc block on every function with `@param` and `@returns`; an inline end-of-line comment on each field declaration; plain comments above non-obvious blocks. A new public method with no doc block is a finding.
- **CSS comments:** `===` decorated dividers for sections, a single-line comment above a rule, describing visual purpose rather than implementation.
- **Idiom:** `async`/`await` over `Promise`/`.then`; one class per file; no dead code introduced by the change.

**Report shape:** `file:line`, the rule as written above, and the conforming form.
