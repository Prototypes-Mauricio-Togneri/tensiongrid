# Tension Grid

[Web site](https://tensiongrid.com)

## UI/UX

- Sound when player moving?

## BUGS

- Bug with laser:
  1. Step on a laser node when it's off
  2. Start moving alonside the line of the laser while it's off
  3. When the laser turns on, if the player still didn't reach the target node, the player doesn't die. it should die as soon as the laser is on

- Bug killing with laser just turning on (and it didn't glow yet)

- Review collision strategy for all entities
  - Which type has each entity?
  - Can it be improved?
  - Does it miss some collisions?
  - Does it trigger some false positives?

## Level ideas

- Several lasers one after the other. there is a gap where the player has to wait for a laser to turn off before moving forward. but bullets pass through that gap, so the player has to time the movement carefully.
- Maze with followers at intersections. Player has to move quickly between cover spots to avoid them.

## Enemy patterns

- **Bullet rain:** A few consecutive rows where in each there is a bullet going horizontally across the entire row. Intercalating one going to the left and the next row going to the right.
- **Trap field:** A cluster of intermittent traps with some "safe heaven" spots where the player can wait for the right moment to move.
- **Laser grid** A set of parallel lasers that follow an intermittent pattern, creating windows for the player to move through.

## New levels

11. **Switches** - Time pressure and objective sequencing
12. **Power-ups** - Fast movement
13. **Power-ups** - Shields
14. **Power-downs** - Slow movement
15. **Power-downs** - Mirror controls

## Prompt

you did a good job implementing level X. now create level Y.
this levels introduces the XXX enemy.
but it also should have bullets, 1 laser, 1 patrol, 1 follower, 1 shooter, 2-3 mines and 2-3 traps.
leave some edges strategically so the player can use them to escape some hazards.
but also add walls to the player can't just wrap around the grid to reach the exit directly.
plan it and ask me questions if it's not clear.
use the @docs/level-design.md skill.
