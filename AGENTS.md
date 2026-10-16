## Project

HTML5 canvas game "Tension Grid" - a retro-futuristic arcade game. Vanilla JS/CSS/HTML, no build system, no dependencies.

## How to Run

Static site — open `public/index.html` in a browser.

## Reference Docs

- @docs/architecture.md — Visual design, class architecture, game mechanics
- @docs/level-design.md — MUST read in full before creating or editing any file in `public/levels/`
- @docs/levels.md — MUST update after creating or editing any file in `public/levels/`

## Rules

- **Centralized Constants**: All magic constants go in `public/js/main/constants.js` — no hardcoded values elsewhere.
- **Async Patterns**: Prefer `async`/`await` over `Promise`/`then`.
- **Maintenance**: Keep `AGENTS.md` and `docs/architecture.md` up to date after changes.
