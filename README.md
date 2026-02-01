# Tension Grid

[Web site](https://tensiongrid.com)

taking into account all the information in this document, are there change to be made in the levels 1, 2, 3 or 4? If so, why? What rules in the design level document do you want to apply?

- Make key yellow rombus with pulse animation
- Visual cues when a shooter is about to shoot
- Visual cues when a shooter is about to turn

- Bug calculating route of follower? It looks like it uses the last known col/row to calculate the path instead of the target col/row.

- Add oscilating behavior for patrols (defining only two nodes)

- Add zones. Zones apply an effect to the player while inside them. For example, a slow zone that reduces player speed by 50%.

- improve player wake animation
- sound when player moving?

## Level ideas

- Several lasers one after the other. there is a gap where the player has to wait for a laser to turn off before moving forward. but bullets pass through that gap, so the player has to time the movement carefully.

## New enemies

Pulsar (Zone Control)

Behavior: Stationary enemy at a grid node that periodically emits a  
 shockwave - a ring of danger that expands outward from its position,
then retracts.

Mechanics:

- Fixed position on one grid node
- Cycles: charge → expand → retract → cooldown
- Danger ring expands 1-3 nodes outward (configurable radius)
- All nodes within the ring during expansion are lethal
- Visual telegraph: pulses/glows during charge phase before  
  expanding

Challenge type: Proximity timing - player must be outside the radius
when it pulses, or inside during cooldown.

Configuration:

- x, y - Grid position
- radius - Maximum expansion (1-3 nodes)
- chargeTime - Telegraph duration before pulse (ms)
- expandTime - Duration of lethal expansion (ms)
- cooldownTime - Safe period before next charge (ms)

Pairs well with: Followers (forces player toward pulsar), Patrols  
 (blocks escape routes during cooldown)

Why it fits: Creates area denial with perfect information. Player  
 can mentally track the timing and plan routes that avoid the danger  
 zone at the right moments. Different from lasers because it's  
 radial, not linear.

---

Sentry (Sight-Line Triggered)

Behavior: Stationary enemy that watches a line of sight. When the  
 player enters its sight line, it fires a fast bullet after a short  
 telegraph delay.

Mechanics:

- Fixed position on grid node
- Watches one direction (configurable: up/down/left/right)
- When player is on the watched line: charges up (visual telegraph),
  then fires
- Cooldown before it can trigger again
- Does NOT fire if player crosses perpendicular to sight line  
  quickly

Challenge type: Line-of-sight awareness - player must recognize  
 watched lanes and either avoid them or cross quickly.

Configuration:

- x, y - Grid position
- direction - Watch direction (single direction, not multiple)
- chargeTime - Telegraph delay before firing (ms, ~500ms)
- bulletSpeed - Speed of fired bullet
- cooldown - Time before can trigger again (ms)

Pairs well with: Patrols (patrol pushes player into sentry sight  
 lines), Lasers (creates timing puzzles with sentry cooldowns)

Why it fits: Introduces reactive enemy without being unfair - the  
 telegraph gives time to escape. Creates risk/reward for taking  
 certain paths. Player-position reactive but still deterministic and  
 telegraphed.

---

Orbiter (Circular Patrol)

Behavior: Enemy that orbits around a fixed center point, tracing a  
 circular/square path around that node.

Mechanics:

- Defined center point (grid node)
- Orbits at fixed radius (1-2 nodes away from center)
- Moves in circular pattern (or square pattern following adjacent  
  nodes)
- Constant speed, predictable timing

Challenge type: Circular timing - unlike linear patrols, creates  
 rotating danger zones that require different mental model.

Configuration:

- centerX, centerY - Center of orbit
- radius - Distance from center (1-2)
- speed - Orbital speed
- clockwise - Direction of orbit (boolean)
- startAngle - Initial position on orbit (degrees)

Pairs well with: Other Orbiters (interlocking orbits), Shooters at  
 center (shooter protected by orbiting guard)

Why it fits: Fills gap between linear bullets and waypoint patrols.  
 Creates rhythmic, predictable patterns that feel different from  
 existing movement types. Easy to mentally simulate.

---

Bomber (Trail Layer)

Behavior: Patrol enemy that drops temporary traps along its path as
it moves.

Mechanics:

- Follows patrol path like regular patrol
- Every N nodes, drops a temporary trap
- Dropped traps last for configurable duration, then fade
- Creates "no-go" zones that shift over time

Challenge type: Territory denial - must track both the bomber and  
 its trail of temporary hazards.

Pairs well with: Followers (trail blocks escape routes), Other  
 patrols (interlocking danger zones)

---

Sweeper (Rotating Arm)

Behavior: A rotating arm anchored to a point, sweeping around like a
clock hand. The entire arm is lethal.

Mechanics:

- Fixed center point
- Arm extends 2-4 nodes from center
- Rotates continuously at constant speed
- Entire arm length is dangerous (line of nodes)
- Can rotate clockwise or counter-clockwise
- Can have multiple arms

Challenge type: Rotational timing - must time passage through the  
 sweep zone between rotations.

Pairs well with: Multiple sweepers (interlocking rotations),  
 Orbiters (orbit vs sweep timing)

---

Tracer (Continuous Trail)

Behavior: Moving enemy that leaves a continuous lethal trail behind
it. Trail fades over time.

Mechanics:

- Moves along patrol path
- Every node it passes becomes dangerous for N seconds
- Trail fades from oldest to newest
- Creates expanding then contracting danger zones

Challenge type: Trail tracking - must watch both the enemy AND its  
 fading trail.

Pairs well with: Fast tracers (long trails), Multiple tracers  
 (overlapping trails)
