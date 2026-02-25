# CLAUDE.md

## Project

HTML5 canvas game "Tension Grid" - a retro-futuristic arcade game. Vanilla JS/CSS/HTML, no build system, no dependencies.

## How to Run

Static site — open `public/index.html` in a browser. Deploy: `./scripts/deploy.sh` (runs version stamp + Firebase hosting).

## Reference Docs

- @docs/architecture.md — Visual design, class architecture, game mechanics
- @docs/level-design.md — MUST read in full before creating or editing any file in `public/levels/`
- @docs/levels.md — MUST update after creating or editing any file in `public/levels/`

## Planning

- **Plan & Pause**: Propose a clear, step-by-step plan before making any code changes. Stop after planning and proceed only after I verify.
- **Ambiguity Handling**: If any requirement is ambiguous, risky, or unclear, state your assumptions explicitly and ask for confirmation before proceeding.

## Rules

- **Strict Scope**: Do not add features, refactor, or reorganize beyond what was explicitly requested.
- **Centralized Constants**: All magic constants go in `public/js/main/constants.js` — no hardcoded values elsewhere.
- **Async Patterns**: Prefer `async`/`await` over `Promise`/`then`.
- **UI/UX**: Always use the `frontend-design` skill when changing the UI.
- **Code Review**: After completing code changes, run /delta-review before responding.
- **Maintenance**: Keep `CLAUDE.md` and `docs/architecture.md` up to date after changes.
