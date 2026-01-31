# Level Design Philosophy

Guidelines for designing levels in Tension Grid.

## Core Philosophy

**Perfect information + irreversible decisions.** The player should always understand the rules and be able to simulate the next move mentally. Difficulty comes from state-space complexity, not hidden mechanics. Every move matters because players commit to consequences. The game respects their intelligence.

## Core Principles

### Challenge & Density

- **Every tile should ask a question** - Each move should force a decision: "Is this safe now?", "Do I bait or detour?", "Rush or wait?"
- **Enemy placement must pose a challenge** - Don't place enemies where they can't threaten the player
- **Minimize empty space** - No more than 5% of nodes should be "rest nodes" (safe from all threats)
- **No cramping of different enemy types** - Give each enemy type room to create its own threat pattern
- **Scale enemy count with grid size** - Larger grids need more threats; aim for consistent density across levels

### Player Experience

- **Action over puzzle** - Levels should flow with timing and reflexes, not require stopping to calculate solutions
- **Multiple deaths expected** - Players will learn through failure; non-obvious dangers are acceptable
- **Every death should feel fair** - Players should understand why they died and how to avoid it next time; no cheap or random deaths
- **Forgiving hitboxes** - Player's collision area should be slightly smaller than visual; near-misses feel skillful, not cheap
- **Multiple viable paths preferred** - Aim for 2-4 viable solutions, not dozens; tight solution space but expressive execution
- **Mix urgency and methodical play** - Some levels have time pressure, others allow careful navigation
- **Brief grace period at spawn** - Give players a moment to orient before threats reach them

### Pacing Within Levels

- **Tension and release cycles** - Alternate between high-pressure zones and moments of breathing room
- **Don't frontload all danger** - Space out intense sections; constant pressure is exhausting
- **Waiting should have consequences** - Enemies that advance, patrols that desync, or rewards for faster routes; delay should be a choice, not a free action

## Spatial Design

### Grid Layout

- **Excluded edges/nodes**: Introduce starting at level 5 to create permanent barriers and corridors
- **Chokepoints are intentional** - Narrow passages exist by design, not accident
- **Clear sightlines where possible** - Players should see threats before they become lethal
- **Limited visibility in large maps is OK** - Discovering threats is part of the challenge in bigger grids

### Start & Exit Placement

- **Open exit levels**: Place exit far from starting point (e.g., diagonal corners)
- **Switch-based levels**: Exit and switch must not be close to each other (start position is flexible)
- **Design the last move first** - Create the ending, then design backward; ensures the final moment feels earned

### Guiding Through Design

- **Use enemies to suggest paths** - Enemy placement can implicitly guide players away from dead ends or toward the intended route
- **Gaps in threats signal opportunity** - A clear lane between dangers invites the player to move through it

### Grid Size Guidelines

- **Small grids (7x7)** - Best for introducing new mechanics; limited space forces engagement with threats
- **Medium grids (8x8 to 9x9)** - Good for combining mechanics; enough room for multiple threat types
- **Large grids (10x10+)** - Best for complex scenarios with patrols, followers, and exploration; requires more enemies to avoid empty space

## Enemy Design

### Synergy & Variety

- **Complementary threats** - Pair enemies that force different skills (e.g., patrol blocks route while bullets require timing)
- **Enemies should create dilemmas together** - One blocks escape, another punishes waiting, a third forces detours; more enemies ≠ more interesting
- **Avoid redundancy** - Don't stack enemies that do the same thing in the same area (e.g., two bullets on the same lane)
- **One new mechanic per level** - Introduce new enemies or mechanics individually before combining them
- **End levels early** - Don't milk an idea; end the level as soon as the concept is proven
- **Safe first encounters** - When introducing a new enemy type, make the first encounter forgiving so players can learn its behavior

### Patrol Paths

- **Prefer short, predictable paths** - Easy to memorize and time
- **Long paths must be recognizable** - If a patrol has a complex route, make it visually obvious
- **Learning the dance, not reaction** - Predictable patterns create choreography; players memorize and execute, not react in panic

### Intermittent Timing

- **Safety depends on timing, not just position** - Design tiles whose safety changes based on when you step on them
- **Timings can vary within a level** - Different on/off cycles create complexity
- **Avoid synchronized patterns** - Staggered timings feel more dynamic

### Enemy Speed

- **Enemies should generally be slower than the player** - Allows reaction time and feeling of control
- **Faster enemies require more predictable patterns** - If an enemy is fast, its behavior must be easy to anticipate

### Telegraphing

- **Signal before state changes** - If an enemy is about to act (turn, fire, explode), give a visual cue beforehand
- **No surprise attacks** - Players should have time to react to telegraphed danger

## Difficulty Progression

### Across Levels

- **Each level harder than the previous** - Difficulty should consistently increase as the player progresses
- **Avoid difficulty spikes** - Progression should be gradual; no sudden jumps in difficulty between consecutive levels
- **Increase complexity, not just raw difficulty** - Combine previously-learned mechanics in new ways rather than simply adding more enemies or making them faster
- **Front-loaded clarity** - First few moves in any level should be learnable quickly (not random death)
- **Escalating difficulty within a level** - The path toward the exit should generally get harder, not easier
- **End with relief, not chaos** - The final move should feel like escape or victory; avoid random dodging near the exit

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

## Replay Value

- **Multiple viable paths** - Different routes encourage replaying to find optimal strategies
- **Speedrun potential** - Skilled players should be able to find faster, riskier routes
- **Mastery reward** - Levels that felt hard should feel satisfying once mastered

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
