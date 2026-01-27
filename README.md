# Tension Grid

[Web site](https://tensiongrid.com)

- Where else can we play an sound?
- Follower another color (different from power up)

Issue: Grid position initialization
Files Affected: Exit, Switch, Power, EnemyTrap, EnemyMine, EnemyShooter
Duplicated Lines: ~20 lines
Medium Impact - Architecture
Issue: No enemy base class
Description: 7 enemy types, 7 render methods, 7 arrays, 6 collision methods
────────────────────────────────────────
Issue: Collision method proliferation
Description: 6 near-identical checkPlayer\*Collision methods
────────────────────────────────────────
Issue: main.js scattered state
Description: 6 independent state variables for menu/pause
Medium Impact - Performance
Issue: Grid renders in 4 passes
Location: renderer.js:156-236 - could be 2 passes
────────────────────────────────────────
Issue: Vector2 allocation in hot path
Location: player.js:68, collision detection
────────────────────────────────────────
Issue: Magic numbers
Location: Wake decay rates vary (0.004 vs 0.005) without clear reason
