# Level Design Philosophy

Guidelines for designing levels in Tension Grid.

## Core Principles

### Challenge & Density

- **Enemy placement must pose a challenge** - Don't place enemies where they can't threaten the player
- **Minimize empty space** - No more than 5% of nodes should be "rest nodes" (safe from all threats)
- **No cramping of different enemy types** - Give each enemy type room to create its own threat pattern

### Player Experience

- **Action over puzzle** - Levels should flow with timing and reflexes, not require stopping to calculate solutions
- **Multiple deaths expected** - Players will learn through failure; non-obvious dangers are acceptable
- **Multiple viable paths preferred** - Give players agency; avoid funneling into a single route
- **Mix urgency and methodical play** - Some levels have time pressure, others allow careful navigation

## Spatial Design

### Grid Layout

- **Excluded edges/nodes**: Introduce starting at level 5 to create permanent barriers and corridors
- **Chokepoints are intentional** - Narrow passages exist by design, not accident
- **Clear sightlines where possible** - Players should see threats before they become lethal
- **Limited visibility in large maps is OK** - Discovering threats is part of the challenge in bigger grids

### Start & Exit Placement

- **Open exit levels**: Place exit far from starting point (e.g., diagonal corners)
- **Switch-based levels**: Exit and switch must not be close to each other (start position is flexible)

## Enemy Design

### Synergy & Variety

- **Complementary threats** - Pair enemies that force different skills (e.g., patrol blocks route while bullets require timing)
- **Avoid redundancy** - Don't stack enemies that do the same thing in the same area (e.g., two bullets on the same lane)
- **One new mechanic per level** - Introduce new enemies or mechanics individually before combining them

### Patrol Paths

- **Prefer short, predictable paths** - Easy to memorize and time
- **Long paths must be recognizable** - If a patrol has a complex route, make it visually obvious

### Intermittent Timing

- **Timings can vary within a level** - Different on/off cycles create complexity
- **Avoid synchronized patterns** - Staggered timings feel more dynamic

## Difficulty Progression

### Across Levels

- **Each level harder than the previous** - Difficulty should consistently increase as the player progresses
- **Front-loaded clarity** - First few moves in any level should be learnable quickly (not random death)
- **Escalating difficulty within a level** - The path toward the exit should generally get harder, not easier

### Switch Mechanics

- **TTL should not be too generous** - Create tension; the timer should feel tight but fair
- **Switch placement creates the challenge** - Distance and obstacles between switch and exit matter

## Power-Ups & Power-Downs

### Power-Ups (Levels 1-10: Tutorial)

- Part of teaching mechanics; can be on accessible paths

### Power-Ups (Level 11+)

- **Not trivial to collect** - Require detours or risk to obtain
- **Essential, not bonuses** - Place them to help overcome specific challenges

### Power-Downs

- **Place on the main path** - Force players to actively avoid them
- **Create decision points** - Faster route with power-down vs safer route without

## Level Completion Time

Not a fixed rule. Depends on:

- Player skill level
- Grid size
- Enemy complexity and density

## Enemy Reference

| Enemy    | Behavior                           | Challenge Type        |
| -------- | ---------------------------------- | --------------------- |
| Bullet   | Linear movement across grid        | Timing lanes          |
| Laser    | Static beam, can be intermittent   | Timing windows        |
| Trap     | Static point hazard                | Route planning        |
| Mine     | Trigger-based explosive            | Risk/reward decisions |
| Shooter  | Fires in configured directions     | Pattern prediction    |
| Patrol   | Follows cyclic path                | Dynamic avoidance     |
| Follower | Chases player (greedy pathfinding) | Active evasion        |
