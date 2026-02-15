# Level Design Philosophy

Guidelines for designing levels in Tension Grid.

## Core Philosophy

**Perfect information + irreversible decisions.** The player should always understand the rules and be able to simulate the next move mentally. Difficulty comes from state-space complexity, not hidden mechanics. Every move matters because players commit to consequences.

## Core Principles

### Challenge & Density

- **Every node should ask a question** - Each move should force a decision: "Is this safe now?", "Do I bait or detour?", "Rush or wait?"
- **Enemy placement must pose a challenge** - Don't place enemies where they can't threaten the player
- **Minimize empty space** - No more than 5% of available nodes (i.e. nodes where the player can stand) should be "rest nodes" (safe from all threats); applies per level, excluding spawn grace period
- **No cramping of different enemy types** - Give each enemy type room to create its own threat pattern
- **Scale enemy count with grid size** - Larger grids need more threats; aim for consistent density across levels

### Player Experience

- **Flow over deliberation** - Players should think while moving, not stop to solve; decisions are made in motion, not through extended calculation
- **Multiple deaths expected** - Players will learn through failure; dangers don't need to be obvious on first glance, but must be learnable through observation or one death
- **Every death should feel fair** - Players should understand why they died and how to avoid it next time; no cheap or random deaths; one death should be enough to understand a new threat
- **Forgiving hitboxes** - Player's collision area should be slightly smaller than visual; near-misses feel skillful, not cheap
- **Multiple viable paths preferred** - Aim for 2-3 viable solutions, not dozens; tight solution space but expressive execution; timing variations count as different paths
- **Mix urgency and methodical play** - Some levels have time pressure, others allow careful navigation; methodical levels have slower consequences for waiting, not zero
- **Brief grace period at spawn** - Give players ~1000ms to orient before threats reach them

### Pacing Within Levels

- **Tension and release cycles** - Alternate between high-pressure zones and moments of breathing room
- **Don't frontload all danger** - Space out intense sections; constant pressure is exhausting
- **Waiting should have consequences** - Standing still shouldn't be safe forever; followers advance, timing windows shift, and faster completion is rewarded
- **End levels early** - Don't milk an idea; end the level as soon as the concept is proven

## Spatial Design

### Grid Layout

- **Excluded edges/nodes**: Introduce starting at level 5 to create permanent barriers and corridors
- **Chokepoints are intentional** - Narrow passages exist by design, not accident
- **Clear sightlines where possible** - Players should see threats before they become lethal
- **Limited visibility in large maps is OK** - Discovering threats is part of the challenge in bigger grids; perfect information applies within the viewport, discovery outside it; should never create unavoidable death on discovery

### Grid Size Progression

- **Start small, grow with complexity** - New mechanics need room; increase grid size when the current one feels cramped, not on a fixed schedule
- **7×7 for fundamentals** - Sufficient for 1-2 enemy types in isolation; keeps the player focused on learning core mechanics
- **8×8 for spatial complexity** - Needed when traps, excluded edges/nodes, or multiple enemy types share the grid
- **9×9+ for multi-objective levels** - Switch-based levels need routing room for barriers, gaps, and the longer journeys between objectives
- **10×10 for multi-section levels** - Portal levels and complex switch levels benefit from the extra space to create distinct zones
- **Larger grids demand more threats** - An empty 10×10 feels barren; scale enemy count and variety to maintain density

### Start & Exit Placement

- **Open exit levels**: Place exit far from starting point (e.g., diagonal corners)
- **Switch-based levels**: Start, switch, and exit should all be distanced from each other; the journey is start → switch → exit
- **Design the last move first** - Create the ending, then design backward; ensures the final moment feels earned
- **Vary start/exit direction across levels** - Repeating the same diagonal (e.g., top-left to bottom-right) builds muscle memory; reversing direction forces players to re-read the grid

### Switch Mechanics

- **TTL should not be too generous** - Create tension; the timer should allow reaching the exit with some reasonable margin for error on the optimal path
- **Switch placement creates the challenge** - Distance and obstacles between switch and exit matter

#### Connection Path (`connection` property)

Each switch has a `connection` array in the JSON: an ordered list of `{x, y}` grid positions from the switch to its unlock target. This path is rendered as a dashed line in-game. The first element is the switch position; the last is the target position.

**How to calculate the path:**

1. Start at the switch position
2. Find the shortest path to the target using 4-directional movement (up, down, left, right — no diagonals)
3. Walls block nodes — any grid node that lies on a wall's line segment is impassable
4. Excluded nodes and excluded edges from the grid config are impassable
5. Enemy positions are costly but traversable — traps, mines, shooters (their grid node), and lasers (all nodes along the laser's span) should be avoided when possible, but the path may route through them if no alternative exists
6. The target endpoint is always reachable even if it sits on a blocked or costly node
7. When multiple shortest paths exist, prefer the one that avoids costly nodes

**Target position:**

- For exits: the exit's `{x, y}` position
- For lasers: the midpoint of the laser span — `{x: round((startX + endX) / 2), y: round((startY + endY) / 2)}`
- For other enemies: the enemy's `{x, y}` position
- For walls: the wall's `from` position

**When no path exists** (e.g., the grid is split by excluded edges and only connected by portals), omit the `connection` property. No connection line will be drawn.

### Multi-Phase Journeys

- **Switch and portal levels create distinct phases** - Typically: navigate to switch/portal → activate/teleport → race to exit; design each phase with its own threat profile
- **Each phase should escalate or shift** - Phase 1 might be methodical navigation, phase 2 a timed sprint; avoid repeating the same challenge across phases
- **Barriers define phases spatially** - Excluded edges with a single gap, or disconnected grid sections linked by portals, create natural phase boundaries
- **The return trip should feel different** - After hitting a switch the player retraces ground, but time pressure and new awareness (follower closing in, TTL ticking) change the experience
- **Confine enemies to sections when useful** - Followers and patrols can be restricted to one side of a barrier or portal split, giving the player relief when they cross to the other side

### Guiding Through Design

- **Use enemies to suggest paths** - Enemy placement can implicitly guide players away from dead ends or toward the intended route
- **Gaps in threats signal opportunity** - A clear lane between dangers invites the player to move through it

## Enemy Design

### Synergy & Variety

- **Complementary threats** - Pair enemies that force different skills (e.g., patrol blocks route while bullets require timing)
- **Enemies should create dilemmas together** - One blocks escape, another punishes waiting, a third forces detours; more enemies ≠ more interesting
- **Avoid redundancy** - Don't stack enemies that do the same thing in the same area (e.g., two bullets on the same lane)

### Patrol Paths

- **Prefer short, predictable paths** - Easy to memorize and time
- **Long paths must be recognizable** - If a patrol has a complex route, make it visually obvious
- **Learning the dance, not reaction** - Predictable patterns create choreography; players memorize and execute, not react in panic

### Intermittent Timing

- **Safety depends on timing, not just position** - A node can be safe one moment and deadly the next (laser turns on, bullet passes through, patrol arrives); players must time movements, not just plot routes
- **Timings can vary within a level** - Different on/off cycles create complexity; typical range is 500ms-2000ms for on/off states
- **Avoid synchronized patterns** - Don't make all intermittent hazards turn on/off at the same time; stagger their cycles so players must read each hazard individually rather than waiting for one "safe window"

### Enemy Speed

- **Enemies should generally be slower than the player** - Allows reaction time and feeling of control
- **Faster enemies require more predictability** - If an enemy moves at or above player speed (e.g., some bullets), its path must be simple and telegraphed

### Telegraphing

- **Signal before state changes** - If an enemy is about to act (turn, fire, explode), give a visual cue at least 500ms beforehand
- **No surprise attacks** - Players should have time to react to telegraphed danger

## Enemy Reference

### Bullet

- **Behavior:** Spawns from grid borders, moves linearly across the grid until reaching the opposite edge
- **Challenge:** Timing lanes - player must find gaps between bullet streams
- **Configuration:** Spawn edge, direction, delay before first spawn, interval between spawns, speed
- **Best for:** Creating rhythm and flow; forcing players to time movements
- **Pairs well with:** Lasers (timing + timing), Patrols (timing + spatial)
- **Avoid:** Multiple bullets on the same lane (redundant), excessive bullet count without clear lanes

### Laser

- **Behavior:** Static beam spanning between two grid nodes (horizontal or vertical only)
- **Challenge:** Timing windows - player must pass through when laser is off
- **Configuration:** Start/end nodes, persistent or intermittent, on/off duration (500ms-2000ms typical)
- **Best for:** Blocking corridors temporarily; creating rhythmic gates
- **Pairs well with:** Bullets (forces commitment during timing windows), Traps (spatial + timing)
- **Avoid:** Synchronized lasers (feels mechanical), lasers blocking the only path without off-cycle

### Trap

- **Behavior:** Static point hazard occupying a single grid node; kills on contact
- **Challenge:** Route planning - player must navigate around fixed obstacles
- **Configuration:** Position, persistent or intermittent (with on/off timing)
- **Best for:** Shaping available paths; creating maze-like navigation
- **Pairs well with:** Bullets (limits dodge space), Patrols (forces timing around static obstacles)
- **Avoid:** Persistent traps that completely block the only path; intermittent traps can gate paths since players wait for off-cycles

### Mine

- **Behavior:** Dormant until player contact; triggers countdown with accelerating blink; explodes and spawns bullets in all valid adjacent directions
- **Challenge:** Risk/reward decisions - trigger early using an escape route to dodge the bullets, or avoid entirely?
- **Configuration:** Position, countdown delay (1000-2000ms typical)
- **Best for:** Creating tactical choices; punishing or rewarding different strategies
- **Pairs well with:** Followers (can be used to create obstacles for follower), Patrols (timing the trigger)
- **Avoid:** Placing where explosion is unavoidable; too many mines creating chaos

### Shooter

- **Behavior:** Static turret fixed on a grid node; optionally rotates 90° each cycle, then fires bullets from all configured arms simultaneously
- **Challenge:** Pattern prediction - player must anticipate fire timing and (if rotating) arm positions
- **Configuration:** Position, arms array, cycle delay (ms), optional rotation direction ("clockwise"/"counterclockwise")
- **Best for:** Creating directional pressure; controlling specific lanes from within the grid
- **Pairs well with:** Patrols (shooter controls timing, patrol controls space), Traps (limits safe positions)
- **Avoid:** Too many arms (overwhelming); unclear rotation patterns

### Patrol

- **Behavior:** Moves along a cyclic path of grid nodes; returns to start after completing route
- **Challenge:** Dynamic avoidance - player must read and time movement around moving obstacle
- **Configuration:** Path nodes (cyclic), speed
- **Best for:** Creating moving barriers; forcing players to observe and time
- **Pairs well with:** Bullets (moving + static timing), other Patrols (interlocking patterns)
- **Avoid:** Long complex paths that feel random; paths that completely seal off areas

### Follower

- **Behavior:** Actively chases player using greedy pathfinding; recalculates direction only at nodes
- **Challenge:** Active evasion - player must constantly move and outmaneuver
- **Configuration:** Starting position, speed
- **Best for:** Creating urgency; punishing hesitation; forcing continuous movement
- **Pairs well with:** Traps (limits escape routes), Bullets (adds timing pressure to evasion)
- **Avoid:** Multiple followers in small grids
- **Note:** Must be outplayable. Greedy pathfinding and node-based recalculation allow players to "juke" them.

## Structural Elements

Non-threatening elements that shape the playable space.

### Wall

- **Behavior:** Static barrier between two grid nodes; blocks player movement but does not damage
- **Purpose:** Constrains player movement; prevents edge wrapping in specific areas
- **Configuration:** Start/end nodes (can span multiple nodes in a line)
- **Best for:** Preventing wrap-around on outer edges; creating corridors without using excluded nodes
- **Placement:** Typically on outer grid edges to disable wrapping and keep players focused on the intended play area
- **Prevent trivial shortcuts:** When the exit is reachable in fewer moves by wrapping around the grid edges than by traversing the intended play area, add walls on those edges to block the shortcut and force the designed route
- **Note:** Unlike excluded edges, walls are visible barriers that clearly communicate "you cannot pass here"

### Portal

- **Behavior:** Paired teleportation points; stepping on one instantly transports the player to its partner
- **Purpose:** Enables non-adjacent traversal; connects disconnected grid sections; creates strategic shortcuts
- **Configuration:** Position (x, y) and group string; two portals with the same group form a bidirectional pair
- **Best for:** Connecting split grid sections; creating multi-phase journeys; enabling escape routes
- **Pairs well with:** Followers (portal escapes follower's section), Switches (forces multi-section journeys), excluded edges (creates the disconnection that portals solve)
- **Avoid:** Placing portals where enemies can camp the destination; more than one pair per level until players are comfortable with the mechanic
- **Note:** Only the player can use portals; enemies cannot teleport through them. A cooldown prevents re-teleportation until the player steps off the portal node.

## Difficulty Progression

- **Overall difficulty trend increases** - Not every level must be harder, but the player's challenge should trend upward over time
- **Avoid difficulty spikes** - Progression should be gradual; no sudden jumps in difficulty between consecutive levels
- **Increase complexity, not just raw difficulty** - Combine previously-learned mechanics in new ways rather than simply adding more enemies or making them faster
- **Front-loaded clarity** - First few moves should be learnable quickly; when introducing new enemies, make first encounters forgiving so players can learn behavior
- **Escalating difficulty within a level** - The approach toward the exit should get harder, but the final moment should be a clear path to victory
- **End with relief, not chaos** - The last move should feel like escape or victory; the journey escalates, but arrival is earned relief

### Star Thresholds

- **Star 1 (bronze):** Generous completion time; a player who knows the route but doesn't optimize should earn it comfortably — roughly 2-3× the optimal clear time for open-exit levels
- **Star 2 (silver):** Midpoint between star 1 and star 3 — roughly 50-65% of star 1 for open-exit levels
- **Star 3 (gold):** Near-optimal execution; demands route knowledge and precise timing — roughly 35-45% of the star 1 time for open-exit levels
- **Switch levels have tighter spreads** - The TTL creates a hard floor on completion time, so star 3 is closer to star 1 (~55-60% of star 1) and star 2 sits at ~70-75%
- **Scale with grid size and objective count** - Larger grids and multi-phase journeys need longer base times; a 10×10 switch level naturally takes longer than a 7×7 open-exit level
- **Playtest the gold time** - The star 3 threshold should feel achievable but demanding; if a skilled player can't reach it after several attempts, it's too tight

## Power-Ups & Power-Downs

### Power-Ups

- **Not trivial to collect** - Require detours or risk to obtain
- **Essential, not bonuses** - Place them to help overcome specific challenges

#### Fast

- **Effect:** Increases player speed temporarily
- **Design use:** Help outrun followers or reach exit before tight TTL expires
- **Placement:** Before follower-heavy sections; reward for risky detours; near switches with tight timers

#### Shield

- **Effect:** Absorbs one hit, then disappears
- **Design use:** Allow passage through otherwise too-tight spots
- **Placement:** Before unavoidable near-misses; as safety net for hard sections; enable risky shortcuts

### Power-Downs

- **Place on the main path** - Force players to actively avoid them
- **Create decision points** - Faster route with power-down vs safer route without

#### Slow

- **Effect:** Decreases player speed temporarily
- **Design use:** Punishes careless paths; creates decision points
- **Placement:** On the main/obvious path to reward players who find alternate routes

#### Mirror

- **Effect:** Inverts player controls temporarily
- **Design use:** Forces concentration; disrupts muscle memory
- **Placement:** On tempting shortcuts; guarding valuable power-ups to create risk/reward

#### Zoom

- **Effect:** Zooms camera in, drastically reducing visible area
- **Design use:** Breaks "perfect information" temporarily; creates tension from unseen threats
- **Placement:** On main paths in levels with off-screen threats (bullets, followers); before sections where spatial awareness matters

## Level Characteristics

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

## Adding New Levels

Checklist when creating a new level:

1. Create the level file at `public/levels/level_<NNN>.json` (zero-padded to 3 digits)
2. Update `totalLevels` in `public/js/main/constants.js` to reflect the new count
3. Add a description for the new level in `docs/levels.md`
