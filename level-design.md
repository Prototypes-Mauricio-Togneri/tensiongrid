# Level Design Philosophy

Guidelines for designing levels in Tension Grid.

## Core Philosophy

**Perfect information + irreversible decisions.** The player should always understand the rules and be able to simulate the next move mentally. Difficulty comes from state-space complexity, not hidden mechanics. Every move matters because players commit to consequences. The game respects their intelligence.

## Core Principles

### Challenge & Density

- **Every tile should ask a question** - Each move should force a decision: "Is this safe now?", "Do I bait or detour?", "Rush or wait?"
- **Enemy placement must pose a challenge** - Don't place enemies where they can't threaten the player
- **Minimize empty space** - No more than 5% of nodes should be "rest nodes" (safe from all threats); applies per level, excluding spawn grace period and tutorial levels
- **No cramping of different enemy types** - Give each enemy type room to create its own threat pattern
- **Scale enemy count with grid size** - Larger grids need more threats; aim for consistent density across levels

### Player Experience

- **Flow over deliberation** - Players should think while moving, not stop to solve; decisions are made in motion, not through extended calculation
- **Multiple deaths expected** - Players will learn through failure; non-obvious dangers are acceptable
- **Every death should feel fair** - Players should understand why they died and how to avoid it next time; no cheap or random deaths; one death should be enough to understand a new threat
- **Forgiving hitboxes** - Player's collision area should be slightly smaller than visual; near-misses feel skillful, not cheap
- **Multiple viable paths preferred** - Aim for 2-4 viable solutions, not dozens; tight solution space but expressive execution; timing variations count as different paths
- **Mix urgency and methodical play** - Some levels have time pressure, others allow careful navigation; methodical levels have slower consequences for waiting, not zero
- **Brief grace period at spawn** - Give players ~1000ms to orient before threats reach them

### Pacing Within Levels

- **Tension and release cycles** - Alternate between high-pressure zones and moments of breathing room
- **Don't frontload all danger** - Space out intense sections; constant pressure is exhausting
- **Waiting should have consequences** - Enemies that advance, patrols that desync, or rewards for faster routes; delay should be a choice, not a free action
- **End levels early** - Don't milk an idea; end the level as soon as the concept is proven

## Spatial Design

### Grid Layout

- **Excluded edges/nodes**: Introduce starting at level 5 to create permanent barriers and corridors
- **Chokepoints are intentional** - Narrow passages exist by design, not accident
- **Clear sightlines where possible** - Players should see threats before they become lethal
- **Limited visibility in large maps is OK** - Discovering threats is part of the challenge in bigger grids; perfect information applies within the viewport, discovery outside it; should never create unavoidable death on discovery

### Start & Exit Placement

- **Open exit levels**: Place exit far from starting point (e.g., diagonal corners)
- **Switch-based levels**: Exit and switch must not be close to each other (start position is flexible)
- **Design the last move first** - Create the ending, then design backward; ensures the final moment feels earned

### Switch Mechanics

- **TTL should not be too generous** - Create tension; the timer should allow reaching the exit with minimal margin for error on the optimal path
- **Switch placement creates the challenge** - Distance and obstacles between switch and exit matter

### Guiding Through Design

- **Use enemies to suggest paths** - Enemy placement can implicitly guide players away from dead ends or toward the intended route
- **Gaps in threats signal opportunity** - A clear lane between dangers invites the player to move through it

### Grid Size Guidelines

- **Small grids (7x7)** - Best for introducing new mechanics; limited space forces engagement with threats; 3-6 threat sources
- **Medium grids (8x8 to 9x9)** - Good for combining mechanics; enough room for multiple threat types; 5-9 threat sources
- **Large grids (10x10+)** - Best for complex scenarios with patrols, followers, and exploration; 8-15 threat sources

*Threat sources = total enemies, hazards, and spawners. Quality over quantity.*

## Enemy Design

### Synergy & Variety

- **Complementary threats** - Pair enemies that force different skills (e.g., patrol blocks route while bullets require timing)
- **Enemies should create dilemmas together** - One blocks escape, another punishes waiting, a third forces detours; more enemies ≠ more interesting
- **Avoid redundancy** - Don't stack enemies that do the same thing in the same area (e.g., two bullets on the same lane)
- **One new mechanic per level** - During introduction phases, present new enemies or mechanics individually; combination levels come after each mechanic is learned

### Patrol Paths

- **Prefer short, predictable paths** - Easy to memorize and time
- **Long paths must be recognizable** - If a patrol has a complex route, make it visually obvious
- **Learning the dance, not reaction** - Predictable patterns create choreography; players memorize and execute, not react in panic

### Intermittent Timing

- **Safety depends on timing, not just position** - Design tiles whose safety changes based on when you step on them
- **Timings can vary within a level** - Different on/off cycles create complexity; typical range is 500ms-2000ms for on/off states
- **Avoid synchronized patterns** - Staggered timings feel more dynamic

### Enemy Speed

- **Enemies should generally be slower than the player** - Allows reaction time and feeling of control
- **Faster enemies require more predictable patterns** - If an enemy is fast, its behavior must be easy to anticipate

### Telegraphing

- **Signal before state changes** - If an enemy is about to act (turn, fire, explode), give a visual cue at least 500ms beforehand
- **No surprise attacks** - Players should have time to react to telegraphed danger
- **Audio cues for off-screen threats** - In large maps, sound can warn of approaching danger before it enters the viewport

## Enemy Reference

| Enemy    | Behavior                                                                   | Challenge Type        |
| -------- | -------------------------------------------------------------------------- | --------------------- |
| Bullet   | Spawns from grid borders with configurable delay/interval, moves linearly  | Timing lanes          |
| Laser    | Static beam, can be intermittent                                           | Timing windows        |
| Trap     | Static point hazard                                                        | Route planning        |
| Mine     | Trigger on contact, explodes after delay, spawns bullets in all directions | Risk/reward decisions |
| Shooter  | Fires in configured directions                                             | Pattern prediction    |
| Patrol   | Follows cyclic path                                                        | Dynamic avoidance     |
| Follower | Chases player (greedy pathfinding)                                         | Active evasion        |

**Note on Followers:** Followers must be outplayable. Greedy pathfinding (not optimal) and node-based recalculation allow players to "juke" them. Perfect pathfinding creates impassable walls that block multiple viable paths.

## Tutorial Sequence

Introduce mechanics in this order:

1. **Bullets** - Basic timing and lane awareness
2. **Lasers** - Intermittent timing windows
3. **Patrols** - Moving obstacles with predictable paths
4. **Traps** - Static hazards requiring route planning
5. **Excluded edges/nodes** - Permanent barriers creating corridors
6. **Shooters** - Multi-directional threats
7. **Mines** - Risk/reward decisions
8. **Followers** - Active evasion and juking
9. **Switches** - Time pressure and objective sequencing
10. **Power-ups** - Resource collection and path optimization
11. **Power-downs** - Hazard avoidance on main paths

After introduction, combine mechanics in increasing complexity.

## Difficulty Progression

- **Overall difficulty trend increases** - Not every level must be harder, but the player's challenge should trend upward over time
- **Avoid difficulty spikes** - Progression should be gradual; no sudden jumps in difficulty between consecutive levels
- **Increase complexity, not just raw difficulty** - Combine previously-learned mechanics in new ways rather than simply adding more enemies or making them faster
- **Front-loaded clarity** - First few moves should be learnable quickly; when introducing new enemies, make first encounters forgiving so players can learn behavior
- **Escalating difficulty within a level** - The approach toward the exit should get harder, but the final moment should be a clear path to victory
- **End with relief, not chaos** - The last move should feel like escape or victory; the journey escalates, but arrival is earned relief

## Power-Ups & Power-Downs

### Power-Ups (Levels 1-10: Tutorial)

- Introduced at level 9 and continue in following levels
- Part of teaching mechanics; can be on accessible paths during tutorial

### Power-Ups (Level 11+)

- **Not trivial to collect** - Require detours or risk to obtain
- **Essential, not bonuses** - Place them to help overcome specific challenges

### Power-Downs

- **Place on the main path** - Force players to actively avoid them
- **Create decision points** - Faster route with power-down vs safer route without

### Reference

| Type   | Effect                 | Design Use                          |
| ------ | ---------------------- | ----------------------------------- |
| Fast   | Increases player speed | Help outrun followers or tight TTLs |
| Shield | Absorbs one hit        | Allow passage through tight spots   |
| Slow   | Decreases player speed | Power-down; punishes careless paths |
| Mirror | Inverts controls       | Power-down; forces concentration    |

## Level Characteristics

### Completion Time

Target ranges for skilled players:

- **Small grids (7x7)**: 5-15 seconds
- **Medium grids (8x8-9x9)**: 10-25 seconds
- **Large grids (10x10+)**: 15-40 seconds

These are guidelines, not hard rules. Actual time varies with player skill and level complexity.

### Replay Value

- **Path variety encourages replay** - See "Multiple viable paths" in Player Experience
- **Speedrun potential** - Skilled players should be able to find faster, riskier routes
- **Mastery reward** - Levels that felt hard should feel satisfying once mastered

## Common Mistakes to Avoid

- **Unavoidable death on spawn** - Player must have time to observe before threats arrive
- **Hidden rules or RNG** - If a player can't mentally simulate the outcome, simplify
- **Redundant enemies** - Two bullets on the same lane, or enemies doing the same job
- **Empty filler space** - Large areas with no threat coverage or purpose
- **Difficulty spikes** - Sudden jumps that feel unfair after gradual progression
- **Chaos at the exit** - Final moments should be relief, not random dodging
- **Perfect-pathing followers** - Makes them impassable walls instead of outplayable threats
- **Synchronized intermittent hazards** - Everything blinking together feels mechanical, not dynamic
- **Teaching multiple mechanics at once** - Confuses players; introduce one at a time
- **Power-ups as bonuses** - They should be essential to the level's balance, not extras
- **Obvious single solution** - If everyone solves it identically, it's too rigid
