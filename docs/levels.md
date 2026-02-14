# Level Catalog

Descriptions for all levels in `public/levels/`. Each entry documents the level's structure, enemies, challenge, and design intent.

## Mechanic Introduction Order

- **Level 1** — Bullets
- **Level 2** — Lasers
- **Level 3** — Patrols
- **Level 4** — Traps
- **Level 5** — Excluded edges
- **Level 6** — Excluded nodes
- **Level 7** — Shooters
- **Level 8** — Mines
- **Level 9** — Follower
- **Level 10** — Edge wrapping
- **Level 11** — Exit switches
- **Level 12** — Power-ups (Fast)
- **Level 13** — Power-downs (Slow)
- **Level 14** — Portals
- **Level 15** — Switch-controlled laser
- **Level 16** — Power-ups (Shield)

---

## Levels

### Level 001

**Grid:** 7x7 | **Start:** (1,1) &rarr; **Exit:** (5,5) open | **Stars:** 15s / 7.5s / 4s
**Difficulty:** &#9733;&#9734;&#9734;&#9734;&#9734;

**Layout:** Fully walled on all four edges. No excluded nodes or edges. A clean, enclosed arena.

**Enemies:** Bullet x8

**Other elements:** None

**Introduces:** Bullets

**Challenge:** Cross diagonally from top-left to bottom-right while timing movement through bullet streams arriving from all four edges. Bullets are slow (speed 80 vs player 200) with generous intervals (~3.5-4s), giving the player time to learn the rhythm. Staggered delays across lanes mean no two bullets arrive simultaneously, creating readable patterns.

**Design rationale:** Teaches the core mechanic (bullets) in isolation on a small grid. The diagonal path forces the player to cross multiple lanes in both axes. Slow speed and wide intervals ensure deaths feel fair and learnable. Eight bullets from all four edges establish that threats can come from any direction.

---

### Level 002

**Grid:** 7x7 | **Start:** (1,1) &rarr; **Exit:** (5,5) open | **Stars:** 17.5s / 10s / 6s
**Difficulty:** &#9733;&#9734;&#9734;&#9734;&#9734;

**Layout:** Fully walled on all four edges. Same size as Level 1.

**Enemies:** Bullet x6, Laser x1

**Other elements:** None

**Introduces:** Lasers

**Challenge:** A full-width horizontal laser at y=3 bisects the grid into two halves with a 2s on / 2s off cycle. The player must time their crossing during the off window while also dodging six bullets from various edges. The even on/off ratio is forgiving but forces commitment to the crossing.

**Design rationale:** Introduces lasers as rhythmic gates. The full-width laser is impossible to go around, forcing a single timing-based crossing decision. The 2s/2s cycle is generous for a first encounter. Bullets add secondary pressure without overwhelming, teaching the player to juggle two threat types.

---

### Level 003

**Grid:** 7x7 | **Start:** (1,1) &rarr; **Exit:** (5,5) open | **Stars:** 20s / 12.5s / 7.5s
**Difficulty:** &#9733;&#9733;&#9734;&#9734;&#9734;

**Layout:** Fully walled on all four edges. Same size as Levels 1-2.

**Enemies:** Bullet x5, Laser x1, Patrol x2

**Other elements:** None

**Introduces:** Patrols

**Challenge:** A full-height vertical laser at x=3 divides the grid into a relatively safe left half and a patrol-guarded right half. Two patrols loop in small 2x2 squares (at y=1-2 and y=3-4) in the right half, blocking the path to the exit. The player must commit to crossing the laser, then weave between the patrols while also dodging bullets.

**Design rationale:** Introduces patrols by placing them in a contained area the player must enter. The vertical laser creates a clear "point of no return" feeling. The two small 2x2 loops are short and predictable, teaching observation before the player faces more complex patrol paths. Patrols occupy the direct route to the exit, forcing the player to time their movement around them.

---

### Level 004

**Grid:** 8x8 | **Start:** (1,6) &rarr; **Exit:** (6,1) | **Stars:** 22.5s / 14s / 9s
**Difficulty:** &#9733;&#9733;&#9734;&#9734;&#9734;

**Layout:** Fully walled on all four edges. First grid size increase (from 7x7 to 8x8). Start is bottom-left, exit is top-right, reversing the direction from the first three levels.

**Enemies:** Bullet x5, Laser x1, Trap x9 (5 persistent, 4 intermittent), Patrol x2

**Other elements:** None

**Introduces:** Traps (persistent and intermittent), 8x8 grid

**Challenge:** Navigate upward through nine scattered traps while crossing a partial horizontal laser at y=3 (spanning x=2 to x=5) that is flanked by two patrolling guards oscillating horizontally. Five persistent traps block direct paths permanently, while four intermittent traps (with varied on/off timings from 1.8s to 2.2s) add timing requirements to route planning. The reversed start/exit direction (bottom to top) breaks muscle memory from the first three levels.

**Design rationale:** Introduces traps as route-shaping obstacles. The mix of persistent and intermittent types teaches that traps can behave differently: some are permanent walls to route around, others are timed gates to pass through. The larger 8x8 grid accommodates the denser threat layout. The flanking patrols on the laser row create a multi-layered crossing challenge.

---

### Level 005

**Grid:** 8x8 | **Start:** (1,6) &rarr; **Exit:** (6,6) open | **Stars:** 25s / 15s / 10s
**Difficulty:** &#9733;&#9733;&#9733;&#9734;&#9734;

**Layout:** Fully walled on all four edges. Five excluded vertical edges between x=3 and x=4 (from y=2 to y=6) create a vertical barrier that splits the grid into two halves. The only way across is via the top rows (y=0-1) where no barrier exists.

**Enemies:** Bullet x6 (4 fast at speed 100 with 1.5s intervals), Laser x1, Trap x3 (2 persistent, 1 intermittent), Patrol x1

**Other elements:** None

**Introduces:** Excluded edges (spatial barriers)

**Challenge:** The player starts bottom-left and must reach the exit at bottom-right, but the vertical barrier forces a long detour through the top of the grid. The left half has a laser at y=4 and a patrol at y=3. The right half has four fast bullet streams (speed 100, 1.5s intervals) shuttling between the barrier and the right edge, creating a dangerous corridor. An intermittent trap at (5,6) directly guards the exit.

**Design rationale:** Introduces excluded edges as a level design tool. The barrier makes the short straight-line distance deceptive: the player must travel far to go what seems close. The right-half bullet streams are notably faster than anything seen before (speed 100 vs 80-85 in prior levels), escalating difficulty through speed. The intermittent trap on the exit forces one final timing decision.

---

### Level 006

**Grid:** 8x8 | **Start:** (1,1) &rarr; **Exit:** (6,6) open | **Stars:** 27.5s / 17.5s / 11s
**Difficulty:** &#9733;&#9733;&#9733;&#9734;&#9734;

**Layout:** Fully walled on all four edges. Four excluded nodes at (2,2), (2,3), (5,4), and (5,5) create permanent holes in the grid that narrow available paths.

**Enemies:** Bullet x5 (4 cascading downward at x=3-6 with staggered delays), Laser x2, Trap x4 (2 persistent, 2 intermittent), Patrol x4

**Other elements:** None

**Introduces:** Excluded nodes

**Challenge:** Excluded nodes narrow the paths near two staggered horizontal lasers (y=4 left-half, y=3 right-half), creating tight corridors. Four patrol loops (2x2 each) guard the corners of the grid, forcing the player to weave between them. Four cascading downward bullets at columns x=3-6 with staggered delays (500ms apart) create a rolling wave pattern that sweeps across the middle of the grid.

**Design rationale:** Introduces excluded nodes as spatial obstacles that reshape the grid topology. The two staggered lasers create alternating gates: when one is dangerous the other may be safe, generating routing decisions about which half to traverse. The four symmetrically-placed patrol loops create a consistent "dodge the guards" pattern across the entire grid. The cascading bullet wave teaches pattern recognition.

---

### Level 007

**Grid:** 8x8 | **Start:** (1,1) &rarr; **Exit:** (6,6) open | **Stars:** 30s / 19s / 12.5s
**Difficulty:** &#9733;&#9733;&#9733;&#9734;&#9734;

**Layout:** Fully walled on all four edges. No excluded nodes or edges.

**Enemies:** Bullet x2, Laser x1, Trap x6 (all intermittent with varied timings), Patrol x1, Shooter x2

**Other elements:** None

**Introduces:** Shooters (static and rotating variants)

**Challenge:** Two shooters with contrasting behaviors dominate the grid. A static dual-arm shooter at (3,3) fires left and right every 2.2s, controlling horizontal movement through the middle. A rotating clockwise single-arm shooter at (5,5) sweeps its arm in a circle every 1.3s, creating a constantly shifting danger zone near the exit. The bottom rows (y=5-6) are a gauntlet of six intermittent traps with varied timings (1s, 1.5s, 2s, and 4s cycles), preventing any single "wait and go" strategy.

**Design rationale:** Introduces both shooter variants simultaneously: the static shooter is predictable and teaches arm-awareness, while the rotating shooter demands continuous positional awareness. Their complementary placement (center vs near-exit) creates layered threats. The varied trap timings at the bottom produce complex rhythms that can't be solved by waiting for a single synchronized safe window.

---

### Level 008

**Grid:** 8x8 | **Start:** (1,1) &rarr; **Exit:** (6,6) open | **Stars:** 32.5s / 20s / 14s
**Difficulty:** &#9733;&#9733;&#9733;&#9733;&#9734;

**Layout:** Fully walled on all four edges. No excluded nodes or edges.

**Enemies:** Bullet x1, Laser x1, Trap x2 (both intermittent), Patrol x2 (speed 160), Shooter x1 (4-arm), Mine x3

**Other elements:** None

**Introduces:** Mines

**Challenge:** Two mines near spawn at (2,1) and (1,2) force an immediate decision: trigger them and dodge the explosions, or carefully navigate around them? A third mine at (6,4) guards the exit approach. The laser at y=4 has a punishing 3s on / 1s off ratio, giving only a 1-second window to cross. Two fast patrols (speed 160) sweep horizontally at y=5 and y=6. A 4-arm shooter at (5,3) fires in all four directions every 1.7s. Intermittent traps at (5,6) and (6,5) guard the final approach to the exit.

**Design rationale:** Introduces mines by placing them directly adjacent to spawn. The player encounters them within their first few moves and learns the trigger-countdown-explosion mechanic immediately. The tight laser window (1s off out of a 4s cycle) is the most punishing timing yet, forcing precise commitment. The 4-arm shooter is the most threatening shooter variant seen so far, demanding wide clearance from all directions.

---

### Level 009

**Grid:** 8x8 | **Start:** (1,1) &rarr; **Exit:** (6,6) open | **Stars:** 35s / 22.5s / 15s
**Difficulty:** &#9733;&#9733;&#9733;&#9733;&#9734;

**Layout:** Fully walled on all four edges. No excluded nodes or edges.

**Enemies:** Bullet x1, Laser x1, Trap x5 (1 persistent, 4 intermittent), Patrol x1 (speed 160), Shooter x2, Mine x3, Follower x1 (speed 90)

**Other elements:** None

**Introduces:** Follower

**Challenge:** The follower starts at (6,2) and immediately begins chasing the player. There is no time to stop and plan: every moment of hesitation lets the follower close in. The player must navigate through mines at (2,2), (1,2), and (6,4), time the laser crossing at y=4, dodge the fast patrol at y=5, and slip between two column-aligned shooters at x=4 (top and bottom edges, firing inward). The exit area is surrounded by four intermittent traps with varied timings, requiring precise timing even while being pursued. This is the first level combining all basic enemy types.

**Design rationale:** Introduces the follower, the only enemy that actively seeks the player. Its speed (90 pixels/s) is well below the player's (200 pixels/s), but fast enough that hesitation is punished. All previously learned enemy types appear together, creating the first true "use everything you've learned" level. The intermittent traps surrounding the exit are especially demanding with a follower on your tail, as waiting for safe windows means the follower draws closer.

---

### Level 010

**Grid:** 8x8 | **Start:** (1,1) &rarr; **Exit:** (6,6) open | **Stars:** 40s / 25s / 17.5s
**Difficulty:** &#9733;&#9733;&#9733;&#9733;&#9734;

**Layout:** Partial walls leave the corners open for edge wrapping. Top edge covers x=2-7, left edge covers y=2-7, right edge covers y=2-7, bottom edge covers x=2-7. Corners (x=0-1, y=0-1 area) allow movement to wrap to the opposite side.

**Enemies:** Bullet x3, Laser x2 (perpendicular intersection), Trap x6 (3 persistent, 3 intermittent), Patrol x1 (large square loop), Mine x3, Follower x1 (speed 85)

**Other elements:** None

**Introduces:** Edge wrapping (partial walls)

**Challenge:** Open corners enable wrapping as a new movement option, offering escape routes and shortcuts but also uncertainty about where threats reach. Three persistent traps at (0,0), (2,1), (1,2) seal off the top-left corner, forcing the player away from the start area. A mine column at x=6 (y=2-4) punishes direct rightward movement. Two perpendicular lasers (horizontal at y=5, vertical at x=5) intersect near the exit, demanding the player time two independent cycles simultaneously. A follower adds constant pursuit pressure. A large patrol loop in the center blocks the obvious middle path.

**Design rationale:** Introduces edge wrapping by leaving specific corners open. The trap cluster near start and the mine column near exit create a natural flow that encourages trying the wrap. The two perpendicular lasers create the hardest laser obstacle yet since two independent timing cycles must align. The longest star times in the game (40s/25s/17.5s) reflect this being the most complex open-exit level. This is the culmination of open-exit difficulty before switches are introduced.

---

### Level 011

**Grid:** 9x9 | **Start:** (1,7) &rarr; **Exit:** (1,1) closed | **Stars:** 20s / 15s / 12s
**Difficulty:** &#9733;&#9733;&#9733;&#9733;&#9734;

**Layout:** 9x9 grid (first size increase since 8x8). A horizontal barrier of 8 excluded edges between y=3 and y=4 spans almost the entire width, with a single gap at x=7 serving as the only crossing point. Partial walls on the left and right edges (y=0-3 only) and full wall on the bottom edge. The top rows allow wrapping on the left and right sides.

**Enemies:** Bullet x3, Laser x1 (vertical at x=6), Trap x3 (all persistent), Patrol x1 (rectangular loop), Shooter x1 (dual-arm at (7,1)), Mine x2, Follower x1 (speed 80)

**Other elements:** Switch at (7,3) unlocking exit, TTL 10,000ms

**Introduces:** Switches, closed exits, 9x9 grid

**Challenge:** A three-phase journey. Phase 1: Navigate from the bottom-left (1,7) through the lower half, dodging the laser at x=6, bullets, and the follower (starting at (7,7)) to reach the switch at (7,3). Phase 2: Cross the barrier's only gap at x=7 into the upper half. Phase 3: Race leftward to the exit at (1,1) before the 10-second TTL expires, past a dual-arm shooter at (7,1), a patrol loop at x=4-6 y=1-2, a mine at (3,1), and persistent traps. The barrier creates forced routing: the gap is far right, the exit is far left.

**Design rationale:** Introduces the switch mechanic, transforming the game from "reach the exit" to "plan a multi-objective journey." The horizontal barrier with a single gap forces specific routing, teaching that switches demand planned journeys, not improvisation. The 10-second TTL creates urgency on the return trip. The 9x9 grid accommodates the longer route while keeping the playfield focused through the barrier constraint.

---

### Level 012

**Grid:** 10x10 | **Start:** (8,8) &rarr; **Exit:** (8,1) closed | **Stars:** 25s / 18s / 14s
**Difficulty:** &#9733;&#9733;&#9733;&#9733;&#9733;

**Layout:** 10x10 grid (first 10x10, the largest grid yet). Walls on top and bottom edges fully, and on left and right edges only for y=0-5. The bottom half (y=6-9) left and right edges are open, allowing wrapping.

**Enemies:** Bullet x5 (3 fast at y=3-5 with ~1.4s intervals and speed 140-150), Laser x1 (horizontal at y=7), Trap x6 (2 persistent, 4 intermittent at y=1), Patrol x1, Shooter x1 (dual-arm at (5,2)), Mine x2, Follower x1 (speed 85)

**Other elements:** Switch at (1,6) with TTL 12,000ms. Power-up: Fast at (2,8).

**Introduces:** Power-ups (Fast), 10x10 grid

**Challenge:** A long cross-grid journey from bottom-right (8,8) to far-left switch (1,6), then a race back to top-right exit (8,1). Three fast bullet streams (speed 140-150, ~1.4s intervals) at y=3-5 create a lethal horizontal gauntlet that must be crossed twice (going and returning). The Fast power-up at (2,8) is essential for surviving the return trip under time pressure. A follower from (8,6) chases throughout. Four intermittent traps at y=1 guard the exit row with varied timings. The laser at y=7 gates progress in the bottom section.

**Design rationale:** Introduces power-ups as essential tools, not bonuses. The Fast pickup is deliberately placed near the switch approach to assist with the return trip's tight timer: without it, reaching the exit before the 12-second TTL expires is significantly harder. The three fast bullet lanes (speed 140-150 vs the usual 80-90) are the most aggressive bullet setup yet, creating a "bullet hell corridor" that demands precise timing on every crossing. The 10x10 grid makes this the largest level, with the longest absolute distances to cover.

---

### Level 013

**Grid:** 10x10 | **Start:** (1,8) &rarr; **Exit:** (1,1) closed | **Stars:** 30s / 22s / 16s
**Difficulty:** &#9733;&#9733;&#9733;&#9733;&#9733;

**Layout:** 10x10 grid. Walls on top edge, left and right edges for y=0-3, bottom and left edges forming a semi-enclosed starting corner at the bottom-left (walls on y=7 from x=0-4, y=7-9 on left, y=9 full bottom). This creates an enclosed bottom-left pocket that the player must leave.

**Enemies:** Bullet x5, Laser x1 (wide horizontal at y=4, spanning x=1-8), Trap x3 (2 persistent, 1 intermittent), Patrol x1 (large loop at x=6-9 y=5-7), Shooter x1 (4-arm at (4,2)), Mine x3, Follower x1 (speed 80)

**Other elements:** Switch at (8,2) with TTL 11,000ms. Power-down: Slow at (3,8).

**Introduces:** Power-downs (Slow)

**Challenge:** Navigate from the enclosed bottom-left corner (1,8) across to the far-right switch (8,2), then race back to top-left exit (1,1). A Slow power-down sits at (3,8), directly on the obvious rightward path from spawn: collecting it halves player speed for 5 seconds, making the 11-second return trip extremely tight. The wide laser at y=4 bisects the grid. A 4-arm shooter at (4,2) controls the center-upper area where the exit is. The follower from (8,7) and a large patrol loop guard the right side. Three mines along the main corridors create triggered hazards that can block escape routes.

**Design rationale:** Introduces power-downs as obstacles to avoid. The Slow at (3,8) is deliberately on the most obvious path from spawn to teach situational awareness: careless movement is punished. The wall layout creates a semi-enclosed starting corner that guides the player rightward, directly through the power-down. The 4-arm shooter at (4,2) guards the final approach to the exit, demanding careful timing on the return trip. With the switch, power-down, 4-arm shooter, follower, mines, and wide laser, this is the most mechanically dense level in the game.

---

### Level 014

**Grid:** 10x10 | **Start:** (1,8) &rarr; **Exit:** (1,1) closed | **Stars:** 32s / 24s / 18s
**Difficulty:** &#9733;&#9733;&#9733;&#9733;&#9733;

**Layout:** 10x10 grid split vertically into two disconnected sections by 10 excluded edges between x=4 and x=5. Left section (x=0-4) contains the start, exit, and one portal. Right section (x=5-9) contains the switch, follower, and the paired portal. Full walls on top, left, and right edges. Bottom edge partially walled (x=2-6), leaving gaps at x=0-1 (left section) and x=7-9 (right section) for strategic wrapping escapes.

**Enemies:** Bullet x5 (2 rightward in left section at y=4 and y=6, 1 downward at x=4, 1 downward at x=5, 1 leftward at y=4 in right section), Laser x1 (horizontal at y=3, spanning x=0-4), Trap x3 (1 persistent near exit at (2,2), 1 intermittent at (1,6), 1 persistent at (7,8)), Patrol x1 (2x2 loop at (7,3)-(8,4), speed 120), Shooter x1 (dual-arm at (7,7), fires up and left), Mine x3 ((3,3) behind laser, (6,3) on switch approach, (8,6) on return path), Follower x1 (speed 80, starts at (9,2))

**Other elements:** Switch at (8,2) with TTL 11,000ms. Portal pair: (3,5) &harr; (6,5), group "A".

**Introduces:** Portals

**Challenge:** A four-phase journey across two disconnected grid sections. Phase 1: Navigate up from spawn (1,8) through the intermittent trap at (1,6), bullet lanes at y=4 and y=6, to the left portal at (3,5). Phase 2: Teleport to (6,5) in the right section and navigate up to the switch at (8,2), passing through a mine at (6,3), dodging the patrol loop at (7,3)-(8,4), and outrunning the follower from (9,2). Phase 3: Hit the switch (11s TTL starts), navigate back down to the portal at (6,5) while the follower closes in and the mine at (8,6) threatens the return path. Phase 4: Teleport back to (3,5), race up through the laser gate at y=3 (1.8s on / 1.5s off) and past the mine at (3,3) to reach the exit at (1,1). The bottom wrapping gaps offer alternative routes: in the left section, wrapping from (1,9) to (1,0) provides a shortcut to the exit that avoids the laser; in the right section, wrapping from (8,9) to (8,0) helps escape the follower.

**Design rationale:** Introduces portals by making them the only way to cross between two disconnected grid halves. The vertical split of excluded edges is visually clear and immediately communicates that normal movement won't work. The player discovers portals naturally when they see the spinning vortex and have no other option. The four-phase journey forces bidirectional portal use, teaching that portals work both ways. The follower is confined to the right section and cannot follow through portals, rewarding quick play on that side and providing relief when returning to the left. The two bottom wrapping gaps create risk/reward escape routes within each section without bypassing the portal requirement (left/right walls prevent cross-section wrapping). Bullet lanes at x=4 and x=5 frame the split visually, reinforcing the boundary.

---

### Level 015

**Grid:** 10x10 | **Start:** (1,8) &rarr; **Exit:** (8,1) closed | **Stars:** 35s / 25s / 19s
**Difficulty:** &#9733;&#9733;&#9733;&#9733;&#9733;

**Layout:** 10x10 grid. Walls on top and bottom edges fully. Left and right edges walled from y=0 to y=5, blocking horizontal wrapping in the top half. Bottom half (y=6-8) has open left and right edges, enabling horizontal wrapping for escape routes.

**Enemies:** Bullet x4 (2 horizontal in bottom half at y=7 and y=6, 2 vertical in top half at x=6 and x=3), Laser x1 (constant, full-width horizontal at y=5, always on), Trap x3 (1 intermittent at (2,6), 2 persistent at (4,1) and (3,3)), Mine x3, Shooter x1 (dual-arm at (5,3)), Patrol x1 (2x2 loop at (6,1)-(7,2), speed 120), Follower x1 (speed 80, starts at (8,8))

**Other elements:** Switch at (7,7) unlocking laser (TTL 5,000ms), Switch at (2,2) unlocking exit (TTL 10,000ms)

**Introduces:** Switch-controlled laser (constant laser disabled by switch), multiple switches

**Challenge:** A constant full-width horizontal laser at y=5 divides the grid into two halves: a bottom half containing the start and laser switch, and a top half containing the exit switch and exit. The laser is always on and cannot be passed without collecting the laser switch first. Phase 1: Navigate from spawn (1,8) rightward through the bottom half, dodging bullets at y=7 and y=6, a mine at (4,8) on the direct path, an intermittent trap at (2,6), and a mine at (6,6), while a follower from (8,8) creates urgency. Phase 2: Collect the laser switch at (7,7) (5s TTL) and cross the deactivated laser at y=5 into the top half before it reactivates. Phase 3: Navigate the top half past two downward bullet lanes at x=6 and x=3, a dual-arm shooter at (5,3) controlling horizontal movement, persistent traps at (4,1) and (3,3), and a mine at (8,3) to reach the exit switch at (2,2). Phase 4: Collect the exit switch (10s TTL) and race right to the exit at (8,1), dodging the 2x2 patrol loop at (6,1)-(7,2) guarding the exit area. The follower can cross the laser (enemies are not affected by lasers), adding persistent pressure throughout both halves. The bottom half's open edges allow horizontal wrapping to escape the follower and dodge bullets; the top half's walled edges create tighter constraints after crossing.

**Design rationale:** Introduces the concept that switches can control elements beyond the exit. The constant laser is the first always-on laser in the game, creating an impassable barrier that clearly communicates the need for the nearby switch. Two switches with different targets (laser vs exit) and independent TTLs teach the extensibility of the switch system. The visual connection lines from each switch to its respective target (laser beam vs exit portal) help the player understand the relationships at a glance. The 5-second laser TTL is generous for a first encounter with the mechanic but creates urgency for crossing. The top half's lack of horizontal wrapping escalates difficulty after the midpoint crossing, while the bottom half's open edges provide escape routes from the follower and bullets. The four-phase journey (navigate to laser switch, cross laser, navigate to exit switch, race to exit) creates the most complex multi-objective level yet.

---

### Level 016

**Grid:** 10x10 | **Start:** (8,8) &rarr; **Exit:** (1,1) closed | **Stars:** 35s / 26s / 20s
**Difficulty:** &#9733;&#9733;&#9733;&#9733;&#9733;

**Layout:** 10x10 grid. Walls on top and bottom edges fully. Left and right edges walled from y=0 to y=5, blocking horizontal wrapping in the upper half. Lower half (y=6-8) has open left and right edges, enabling horizontal wrapping for escape routes.

**Enemies:** Bullet x6 (4 shower streams at y=4 with speed 200 and 600ms intervals creating an impassable horizontal wall, 1 rightward at y=7 with speed 100, 1 downward at x=3 with speed 90), Laser x1 (horizontal at y=2, x=2-6, intermittent 1.8s/1.5s), Trap x3 (1 intermittent at (2,6), 1 intermittent at (3,3), 1 persistent at (6,1)), Mine x3 ((6,7) on path to shield, (7,2) near switch, (3,1) near exit), Shooter x1 (dual-arm at (5,3)), Patrol x1 (2x2 loop at (4,7)-(5,8), speed 120), Follower x1 (speed 80, starts at (7,7))

**Other elements:** Switch at (8,1) unlocking exit (TTL 11,000ms). Power-up: Shield at (1,8).

**Introduces:** Power-ups (Shield)

**Challenge:** A four-phase journey centered around the shield power-up. Four bullet streams at y=4 (speed 200, interval 600ms, staggered delays) create an impassable horizontal shower that divides the grid into two halves. The shield at (1,8) is the only way through. Phase 1: Navigate leftward from spawn (8,8) through the lower half to reach the shield at (1,8), dodging a mine at (6,7), the patrol loop at (4,7)-(5,8), an intermittent trap at (2,6), a rightward bullet at y=7, and the follower chasing from (7,7). Phase 2: Collect the shield and move up through the bullet shower at y=4. The shield absorbs one bullet hit, then 1s post-shield immunity covers the rest of the crossing. Phase 3: Navigate the upper half rightward to the switch at (8,1), past the shooter at (5,3) controlling horizontal movement, an intermittent trap at (3,3), the laser gate at y=2 (x=2-6), a downward bullet at x=3, and a mine at (7,2). Phase 4: Collect the switch (11s TTL) and race leftward to the exit at (1,1), past a persistent trap at (6,1) and a mine at (3,1), while the laser at y=2 continues cycling. The follower is immune to bullets and follows through the shower into the upper half, maintaining persistent pressure across all phases. Open edges at y=6-8 provide horizontal wrapping escape routes in the lower half; the upper half's walled edges prevent shortcutting to the exit.

**Design rationale:** Introduces the shield as an essential tool, not a bonus. The impassable bullet shower makes the shield's purpose immediately clear: without it, the player cannot progress. This teaches that power-ups can be mandatory for level completion, not just helpful extras. The four-phase structure mirrors Level 15's complexity but replaces the switch-controlled laser mechanic with a power-up-gated barrier. The shower's visual intensity (4 streams of fast bullets) creates a dramatic moment when the player crosses through with the shield. The follower's ability to follow through the shower (enemies are immune to bullets) prevents the upper half from feeling like a safe haven. The reversed start/exit direction (bottom-right to top-left) compared to Level 15's (bottom-left to top-right) breaks muscle memory. One mine per phase ensures the player faces triggered-hazard decisions throughout the journey.
