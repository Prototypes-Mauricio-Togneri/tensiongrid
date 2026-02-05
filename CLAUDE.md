# CLAUDE.md

## What

HTML5 canvas game "Tension Grid" - a retro-futuristic arcade game. Player (white rhombus) navigates a grid avoiding enemies that traverse in straight lines. Supports grids of any size with camera system that follows the player.

**Stack**: Vanilla HTML/CSS/JavaScript, no build system, no dependencies.

**Structure**:

```
public/
├── audio/
│   ├── music/       → Background music
│   └── sound/       → Sound effects
├── css/             → Stylesheets
├── img/
│   └── ico/         → Icons
├── js/
│   ├── animations/  → Animation classes
│   ├── effects/     → Visual effects
│   ├── enemies/     → Enemy types
│   ├── engine/      → Core game engine
│   ├── helpers/     → Reusable behavior helpers
│   ├── io/          → Input/output handling
│   ├── main/        → Constants and bootstrap
│   └── ui/          → UI components
├── levels/          → Level definitions (JSON)
└── index.html
```

## Reference Docs

Read these when working on specific areas:

- `docs/architecture.md` - Visual design (colors, typography, effects), class architecture with line references, game mechanics
- `docs/level-design.md` - Level design philosophy, enemy reference, difficulty progression guidelines

# Critical Instructions

## Planning

- **Context First**: Before proposing any change, read and understand the problem and all relevant files. If a file or path is referenced, you MUST open and inspect it. Do not speculate.
- **Ambiguity Handling**: If any requirement is infeasible, ambiguous, risky, or unclear, state your assumptions explicitly and ask for confirmation before proceeding. If ambiguity, risk, or rule violations remain, refuse to proceed and explain why.
- **Plan & Pause**: Propose a clear, step-by-step plan before making any code changes. Stop after planning and proceed only after I verify.

## Implementation

- **Strict Scope**: Stick to the requested task. Do not add features, refactor, optimize, rename, rewrite, or reorganize code beyond what was explicitly requested or strictly necessary for correctness. Do not design for hypothetical future requirements.
- **Analytical Rigor**: Thoroughly review the codebase for relevant facts, styles, conventions, and abstractions. Before implementation, clearly identify what will change and what will remain untouched.
- **Minimalist Approach**: Prioritize extreme simplicity. Impact only the code strictly necessary for the task to avoid complexity and prevent breaking existing functionality.
- **Maintainability Check**: Ensure the solution is readable, consistent, maintainable, simple, robust, and strictly follows the requested requirements.
- **Centralized Constants**: Declare all magic constants in `public/js/main/constants.js` and reference them from there. Do not hardcode values directly in other files.
- **Root Cause Fixes**: If a bug exists, identify and fix the root cause. Do not apply temporary or partial fixes.
- **Async Patterns**: Prefer `async` and `await` over `Promise` and `then` calls.
- **UI/UX**: Always use the `frontend-design` skill when changing the UI.

## Verification

- **Mental Execution**: Before finalizing your response, simulate the code path mentally and identify edge cases, failure modes, and race conditions.
- **Maintenance**: Always check if the files `CLAUDE.md` and `docs/architecture.md` are up-to-date after making changes. If not, update them accordingly.
