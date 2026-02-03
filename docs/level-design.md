# Level Design Philosophy

Guidelines for designing levels in Tension Grid.

## Core Philosophy

**Perfect information + irreversible decisions.** The player should always understand the rules and be able to simulate the next move mentally. Difficulty comes from state-space complexity, not hidden mechanics. Every move matters because players commit to consequences.

## Core Principles

### Challenge & Density

- **Every node should ask a question** - Each move should force a decision: "Is this safe now?", "Do I bait or detour?", "Rush or wait?"
- **Enemy placement must pose a challenge** - Don't place enemies where they can't threaten the player
- **Minimize empty space** - No more than 5% of available nodes (i.e. nodes where the player can stand) should be "rest nodes" (safe from all threats); applies per level, excluding spawn grace period and tutorial levels
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

### Start & Exit Placement

- **Open exit levels**: Place exit far from starting point (e.g., diagonal corners)
- **Switch-based levels**: Start, switch, and exit should all be distanced from each other; the journey is start → switch → exit
- **Design the last move first** - Create the ending, then design backward; ensures the final moment feels earned

### Switch Mechanics

- **TTL should not be too generous** - Create tension; the timer should allow reaching the exit with some reasonable margin for error on the optimal path
- **Switch placement creates the challenge** - Distance and obstacles between switch and exit matter

### Guiding Through Design

- **Use enemies to suggest paths** - Enemy placement can implicitly guide players away from dead ends or toward the intended route
- **Gaps in threats signal opportunity** - A clear lane between dangers invites the player to move through it

## Enemy Design

### Synergy & Variety

- **Complementary threats** - Pair enemies that force different skills (e.g., patrol blocks route while bullets require timing)
- **Enemies should create dilemmas together** - One blocks escape, another punishes waiting, a third forces detours; more enemies ≠ more interesting
- **Avoid redundancy** - Don't stack enemies that do the same thing in the same area (e.g., two bullets on the same lane)
- **One new mechanic per level** - During the tutorial levels, present new enemies or mechanics gradually

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

- **Behavior:** Static turret fixed on a grid node; fires bullets in configured directions at intervals
- **Challenge:** Pattern prediction - player must anticipate fire timing and directions
- **Configuration:** Position, fire directions (up/down/left/right independently), interval per direction, optional rotation
- **Best for:** Creating directional pressure; controlling specific lanes from within the grid
- **Pairs well with:** Patrols (shooter controls timing, patrol controls space), Traps (limits safe positions)
- **Avoid:** Covering too many directions at once (overwhelming); unclear fire patterns

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
- **Best for:** Tutorial levels to guide players; preventing wrap-around on outer edges; creating corridors without using excluded nodes
- **Placement:** Typically on outer grid edges to disable wrapping and keep players focused on the intended play area
- **Note:** Unlike excluded edges, walls are visible barriers that clearly communicate "you cannot pass here"

## Difficulty Progression

- **Overall difficulty trend increases** - Not every level must be harder, but the player's challenge should trend upward over time
- **Avoid difficulty spikes** - Progression should be gradual; no sudden jumps in difficulty between consecutive levels
- **Increase complexity, not just raw difficulty** - Combine previously-learned mechanics in new ways rather than simply adding more enemies or making them faster
- **Front-loaded clarity** - First few moves should be learnable quickly; when introducing new enemies, make first encounters forgiving so players can learn behavior
- **Escalating difficulty within a level** - The approach toward the exit should get harder, but the final moment should be a clear path to victory
- **End with relief, not chaos** - The last move should feel like escape or victory; the journey escalates, but arrival is earned relief

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
