---
description: Design a new level for Tension Grid following the level design philosophy.
---

Design a new level for Tension Grid. Follow this workflow:

## 1. Context Gathering

First, read existing levels to understand the current progression:

- Read `public/levels/` to see all level files
- Identify the highest level number and what mechanics have been introduced
- Understand the difficulty curve so far

## 2. Design Process

Follow the "design the last move first" principle:

1. **Define the ending** - Where is the exit? What's the final challenge?
2. **Work backward** - How does the player reach that ending?
3. **Place the start** - Far from exit, with grace period safety
4. **Add threats** - Create dilemmas, not just obstacles

## 3. Level JSON Schema

```json
{
  "id": <number>,
  "grid": {
    "width": <number>,
    "height": <number>,
    "excludes": {
      "nodes": [{"x": <number>, "y": <number>}],
      "edges": [{"from": {"x": <number>, "y": <number>}, "to": {"x": <number>, "y": <number>}}]
    }
  },
  "player": {"startX": <number>, "startY": <number>},
  "exit": {"x": <number>, "y": <number>, "status": "open" | "closed"},
  "switch": {"x": <number>, "y": <number>, "ttl": <ms>},
  "walls": [{"from": {"x": <number>, "y": <number>}, "to": {"x": <number>, "y": <number>}}],
  "enemies": {
    "enemyBullet": [{"x": <number>, "y": <number>, "direction": "up"|"down"|"left"|"right", "delay": <ms>, "interval": <ms>, "speed": <number>}],
    "enemyLaser": [{"startX": <number>, "startY": <number>, "endX": <number>, "endY": <number>, "timeOn": <ms>, "timeOff": <ms>}],
    "enemyTrap": [{"x": <number>, "y": <number>, "timeOn": <ms>, "timeOff": <ms>}],
    "enemyPatrol": [{"speed": <number>, "path": [{"x": <number>, "y": <number>}]}],
    "enemyFollower": [{"x": <number>, "y": <number>, "speed": <number>}],
    "enemyShooter": [{"x": <number>, "y": <number>, "directions": ["up"|"down"|"left"|"right"], "interval": <ms>}],
    "enemyMine": [{"x": <number>, "y": <number>, "countdown": <ms>}]
  },
  "powerUps": [{"x": <number>, "y": <number>, "type": "fast"|"shield"}],
  "powerDowns": [{"x": <number>, "y": <number>, "type": "slow"|"mirror"}]
}
```

## 4. Design Principles

### Core Philosophy

- **Perfect information + irreversible decisions** - Player can mentally simulate outcomes
- **Every node asks a question** - Force decisions: "Is this safe?", "Rush or wait?"
- **Multiple deaths expected** - Fair, learnable through observation

### Enemy Guidelines

- **Complementary threats** - Pair enemies that force different skills
- **Avoid redundancy** - No two bullets on the same lane
- **Stagger timings** - Don't synchronize intermittent hazards
- **Enemies slower than player** - Allow reaction time

### Pacing

- **Grace period at spawn** - ~1000ms before threats arrive
- **Tension and release** - Alternate pressure and breathing room
- **End with relief** - Final moment should feel like earned victory

### Common Mistakes to Avoid

- Unavoidable death on spawn
- Redundant enemies doing the same job
- Empty filler space with no threats
- Chaos at the exit
- Synchronized intermittent hazards

## 5. Output

After designing, write the level JSON to `public/levels/level_<NNN>.json` where NNN is the next level number (zero-padded to 3 digits).

Explain your design choices:

- What mechanics does this level focus on?
- What's the intended challenge/dilemma?
- What are the viable paths?
- How does it fit the difficulty progression?
