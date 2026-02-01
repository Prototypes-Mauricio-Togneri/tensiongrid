---
description: Design a new level for Tension Grid following the level design philosophy.
---

Design a new level for Tension Grid.

## 1. Read the Design Guidelines

First, read `docs/level-design.md` for the complete level design philosophy including:
- Core principles and philosophy
- Enemy reference (behavior, configuration, pairings, what to avoid)
- Tutorial mechanic introduction order
- Spatial design guidelines
- Power-up/power-down usage
- Common mistakes to avoid

## 2. Context Gathering

Read existing levels to understand the current progression:
- Read `public/levels/` to see all level files
- Identify the highest level number and what mechanics have been introduced
- Understand the difficulty curve so far

## 3. Design Process

Follow the "design the last move first" principle:
1. **Define the ending** - Where is the exit? What's the final challenge?
2. **Work backward** - How does the player reach that ending?
3. **Place the start** - Far from exit, with grace period safety
4. **Add threats** - Create dilemmas, not just obstacles

## 4. Output

Write the level JSON to `public/levels/level_<NNN>.json` where NNN is the next level number (zero-padded to 3 digits).

Explain your design choices:
- What mechanics does this level focus on?
- What's the intended challenge/dilemma?
- What are the viable paths?
- How does it fit the difficulty progression?
