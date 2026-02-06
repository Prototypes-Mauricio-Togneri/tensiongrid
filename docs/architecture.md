# Architecture & Design

Detailed reference for the "Tension Grid" game implementation.

## Visual Design

Cyberpunk/neon aesthetic with these design elements:

### Color Palette (CSS Variables)

- `--neon-cyan: #00f5ff` - Primary UI color (title, HUD)
- `--neon-pink: #ff2a6d` - Accent color
- `--deep-black: #0a0a0f` - Background

### Typography

- **Orbitron** (Google Fonts) - Title, HUD values (futuristic sans-serif)
- **Share Tech Mono** - HUD labels (monospace)

### Visual Effects

- **Menu background animation** - Multi-layered atmospheric effect (hidden during gameplay):
  - Floating geometric shapes (hexagons in cyan, diamonds in pink) with glow effects
  - Ambient pulsing glow orbs (cyan top-left, pink bottom-right)
  - Cyan particles that recede toward the horizon (aligned with grid perspective)
  - Perspective grid layer with infinite scroll
  - Uses CSS `:has()` selector to hide when game screen is active
- **Animated background grid** - Perspective-transformed grid with infinite scroll animation
- **Scanline overlay** - Subtle horizontal lines for CRT effect (via `body::after`), toggleable in settings (persisted to localStorage)
- **Title design** - Stacked "TENSION" / "GRID" layout with:
  - "TENSION" in red (#ff2020) with molten heat glow and scan line overlay
  - Warning bar with diagonal danger stripes
  - "GRID" in white with angular corner accents
  - Pulsing burn animation and subtle flicker effects
- **Vignette** - Radial gradient darkening canvas edges
- **Screen shake** - CSS keyframe animation on collision

## Class Architecture

### Configuration

**Constants** (`js/main/constants.js`) - Immutable game constants:
- `scale`: mobile breakpoint (768px), mobile scale factor (0.73)
- `physics`: max delta time (100ms), collision threshold (0.7)
- `grid`: cell size (80px), node radius (5px), edge width (2px)
- `player`: size (12px), speed (200px/s)
- `physics.deathPauseMs`: pause duration after death (1000ms)
- `enemies`: bullet size (5px), bullet speed (130px/s), trap size (14px), trap opacity transition speed (0.004/ms), trap opacity min/max (0.2/1.0), mine size (12px), shooter size (14px), shooter arm length (28px), shooter charge duration (500ms), shooter rotation duration (250ms), patrol size (12px), follower size (10px), follower rotation speed (3 rad/s), wall core width (8px), wall glow width (14px), wall shadow blur (12px/18px)
- `powers.size`: (12px) - collectible size for all power types
- `powers.[type].iconScale`: icon size multiplier per power type (fast: 0.7, slow: 0.9, shield: 0.6, mirror: 0.8)
- `exit`: size (18px), ringThickness (3px), ringOpacity (0.5), ringSpawnInterval (500ms), ringSpeed (0.01 radius/ms), timerArcOffset (6px), timerArcThickness (4px), timerArcWarningThreshold (0.25)
- `switch`: size (16px)
- `effects.fast`: duration (5000ms), speed multiplier (1.5x), warningDuration (1000ms), blinkFrequency (0.015) - blinks before expiring
- `effects.slow`: duration (5000ms), speed multiplier (0.5x), warningDuration (1000ms), blinkFrequency (0.015) - blinks before expiring
- `effects.shield`: duration (5000ms), warningDuration (1000ms), blinkFrequency (0.015) - blinks before expiring naturally
- `effects.immunity`: duration (1000ms), blink frequency (0.015) - effect behavior
- `effects.mirror`: duration (5000ms), warningDuration (1000ms), blinkFrequency (0.015) - inverts player controls, blinks before expiring
- `colors`: all game element colors with glow variants (includes switch: gold #ffd700, wall: slate blue #5588bb)
- `game.animations.playerWrap`: particle count (16), particle size (3px), spawn radius (45px), duration (250ms) - wrap teleport effect
- `game.animations.collectionWave`: start radius (8px), end radius (35px), duration (300ms), line width (3px)
- `game.animations.playerExplosion`: particle count (16), particle size (5px), end radius (40px), duration (800ms)
- `game.animations.mineExplosion`: particle count (12), particle size (4px), end radius (35px), duration (600ms)
- `game.animations.playerExit`: duration (1000ms) - player shrink/fade into exit portal
- `game.animations.spawnWarning`: particle count (10), particle size (3px), spawn radius (35px), duration (400ms) - converging particles before bullet spawn
- `game.animations.wakeTrail`: fast profile (buildRate 0.05, trailDistance 60, fadeRate 0.004), slow profile (buildRate 0.005, trailDistance 50, fadeRate 0) - wake trail effect behind moving entities
- `audio.sounds`: paths to sound effect files (shooterTurn, menuChange, menuSelect, switchCollected, etc.)
- `audio.music`: paths to music files (mainMenu)
- `actions.home`: menu actions (gym, continue, levels, upload, fullscreen, settings)
- `storage`: localStorage key names (audioEnabled, scanlinesEnabled, currentLevel)
- `swipe.minDistance`: minimum swipe distance in pixels (30px)

- `version`: UTC build timestamp (auto-updated by `scripts/version.sh` at deploy time)

### Helpers

**Analytics** (`js/helpers/analytics.js`) - GA4 event tracking (static methods only):
- `sendEvent(name, data)` - Send generic event to Google Analytics
- `trackLevelStart(levelId)` / `trackLevelComplete(levelId, deaths, duration)` / `trackLevelQuit(levelId, deaths)` - Level lifecycle
- `trackPlayerDeath(levelId, cause)` - Player death with enemy type
- `trackPowerCollected(levelId, powerType)` - Power-up/down collection
- `trackSwitchCollected(levelId)` - Exit switch collection

### Core Classes

**Vector2** (`js/engine/vector2.js`) - 2D vector utility:
- `distance(a, b)` - Euclidean distance
- `direction(from, to)` - Normalized direction vector

**Grid** (`js/engine/grid.js`) - Grid coordinate system:
- `getNodePosition(row, col)` - Grid coords to world pixels
- `isValidPosition(row, col)` - Bounds and exclusion checking
- `isExcluded(row, col)` - Check if node is excluded
- `isEdgeExcluded(row1, col1, row2, col2)` - Check if edge between two nodes is excluded
- `wrapPosition(row, col)` - Toroidal wrapping
- Supports `excludes.nodes` config to remove nodes and their edges from the grid
- Supports `excludes.edges` config to remove specific edges (bidirectional)

**GridMovement** (`js/helpers/grid_movement.js`) - Smooth interpolation movement:
- Handles movement interpolation between grid nodes
- Used by Player, EnemyBullet, EnemyPatrol, EnemyFollower
- `update(delta, speed, x, y, targetRow, targetCol)` - Calculate interpolated position
- Returns `{ arrived, x, y, dirX, dirY }` - new position and direction

**Camera** (`js/ui/camera.js`) - Viewport and camera system:
- `setViewport(width, height)` - Update viewport size on canvas resize
- `follow(targetX, targetY)` - Center camera on target with edge clamping
- `worldToScreen(worldX, worldY)` - Transform world coordinates to screen coordinates
- `clamp()` - Constrain camera so viewport stays within grid bounds (centers grid if smaller than viewport)

**InputManager** (`js/io/input_manager.js`) - Keyboard and touch input:
- Supports arrow keys, WASD, and touch drag gestures
- `getDirection()` - Returns movement delta or null (checks swipe first, then keyboard)
- `setSwipeEnabled(callback)` - Set callback to determine if swipes trigger movement
- `triggerEscape()` - Programmatically trigger escape (used by browser back button)
- `clearPendingInput()` - Clear buffered swipe state (called on player death/reset)
- `disable()` - Disable all input handling
- `isEscapePressed()` - Check if escape key is pressed
- `consumeEscape()` - Consume escape key press (resets state)
- `isSelectPressed()` - Check if select key (Enter/Space) is pressed
- `consumeSelect()` - Consume select key press (resets state)
- `isDebugPressed()` - Check if debug key (G) is pressed
- `isPausePressed()` - Check if pause key (P) is pressed
- `consumePause()` - Consume pause key press (resets state)
- `consumeDebug()` - Consume debug key press (resets state)
- Auto-disables after edge wrap
- Continuous drag detection: triggers move when drag exceeds 30px threshold, resets start position for chaining multiple moves without lifting finger

**LocalStorage** (`js/io/local_storage.js`) - Centralized localStorage operations:
- `getAudioEnabled()` - Get audio enabled state (default: true)
- `setAudioEnabled(enabled)` - Set audio enabled state
- `getScanlinesEnabled()` - Get scanlines enabled state (default: true)
- `setScanlinesEnabled(enabled)` - Set scanlines enabled state
- `hasCurrentLevel()` - Check if current game level exists
- `getCurrentLevel()` - Get current game level (highest completed + 1)
- `setCurrentLevel(level)` - Set current game level, preloads next level
- `isLevelUnlocked(level)` - Check if level is unlocked (level <= currentLevel)
- `getLevelPath(level)` - Build level file path from level number
- `preloadLevel(level)` - Preload level JSON into browser cache

### Effect System

**Effect** (`js/effects/effect.js`) - Effect instance data:
- Holds type, duration, remaining time, and config for an active effect
- `update(delta)` - Decrements timer, returns true if effect just expired

**EffectTypes** (`js/effects/effect_types.js`) - Effect behavior registry:
- Defines behavior for each effect type without subclassing
- Each type specifies: `category` (player/enemy/world), `stackMode` (replace), `stackGroup` (effects in same group replace each other)
- Handler functions: `apply(target, effect)`, `remove(target, effect)`, optional `onHit(target, effect, manager)`
- `renderHint` object provides data for renderer (glowColor, showShield, blink)
- Current types: `fast`, `slow`, `shield`, `immunity`, `mirror`

**EffectManager** (`js/effects/effect_manager.js`) - Effect lifecycle manager:
- Manages active effects on a target entity (player, enemy, etc.)
- `addEffect(type, config)` - Creates effect, handles stacking rules, calls apply()
- `removeEffect(type)` - Calls remove(), deletes effect
- `update(delta)` - Updates all effects, removes expired, returns expired type names
- `hasEffect(type)` - Check if effect is active
- `handleCollision()` - Delegates to onHit handlers, returns true if hit absorbed
- `getRenderHints()` - Returns combined render data for all active effects (includes warning blink for effects with warningDuration)
- `clear()` - Removes all effects (on death/reset)

**WakeTrail** (`js/helpers/wake_trail.js`) - Wake trail state manager:
- Manages wake trail effect state for moving entities
- Used by Player, EnemyBullet, EnemyPatrol, EnemyFollower
- `update(delta, isMoving, speed, x, y, dirX, dirY)` - Update intensity, length, and position
- `reset(x, y)` - Reset trail to position with zero intensity and zero length
- Trail length grows from 0 to `trailDistance` at entity speed, resets on `reset()` and when intensity fades to 0
- Config: `buildRate` (intensity increase per ms), `trailDistance` (max pixels behind entity), `fadeRate` (optional, intensity decrease per ms when stationary)

**IntermittentState** (`js/helpers/intermittent_state.js`) - On/off cycling state manager:
- Manages intermittent on/off behavior for hazard entities
- Used by EnemyLaser, EnemyTrap
- `isIntermittent()` - Check if entity cycles on/off
- `isActive()` - Check if currently dangerous (requires `active` AND intensity >= `activeThreshold`)
- `update(delta)` - Update state toggle and visual intensity transitions
- Config: `timeOn`/`timeOff` (ms, undefined for persistent), `intensityMin`/`intensityMax`, `transitionSpeed`, `activeThreshold` (intensity required to be dangerous, defaults to `intensityMin`)

**ParticleExplosion** (`js/helpers/particle_explosion.js`) - Particle burst animation base:
- Generic particle explosion effect with configurable parameters
- Extended by PlayerExplosionAnimation, MineExplosionAnimation
- Particles scatter outward from center with random angles and staggered delays
- Ease-out animation for smooth deceleration, particles fade as they scatter
- `update(delta)` - Advance animation timer
- `isComplete()` - Check if animation finished
- `getProgress()` - Get animation progress (0 to 1)
- `getParticles()` - Get particle data array `{x, y, opacity}` relative to center
- `getPosition()` - Get center position in world coordinates
- Config: `particleCount`, `particleSize`, `endRadius`, `duration`

**Player** (`js/engine/player.js`) - Player entity:
- Grid-snapped target-based movement via GridMovement
- Wake trail via WakeTrail instance (fast profile with fade)
- `effectManager` - EffectManager instance for handling active effects
- `moveTo(row, col, teleport)` - Movement with optional teleport
- `hasSpeedBoost()` - Check if fast effect is active (delegates to effectManager)
- `isSlowed()` - Check if slow effect is active (delegates to effectManager)
- `hasShield()` - Check if shield effect is active (delegates to effectManager)
- `isImmune()` - Check if immunity effect is active (delegates to effectManager)
- `isProtected()` - Check if player has shield OR immunity (cannot die from collision)

**PlayerExplosionAnimation** (`js/animations/player_explosion_animation.js`) - Death effect:
- Extends ParticleExplosion with `playerExplosion` config
- Visual effect for player death (16 particles, 5px size, 40px radius, 800ms)

**PlayerWrapAnimation** (`js/animations/player_wrap_animation.js`) - Wrap teleport effect:
- Visual effect for player wrap-around teleportation
- 16 small square particles converge from scattered positions to center
- Particles start at random angles within 45px radius
- Ease in-out animation for smooth convergence over 250ms
- `update(delta)` - Advance animation
- `isComplete()` - Returns true when animation finished
- `getParticles()` - Returns particle data {x, y, opacity} for rendering
- `getPosition()` - Returns center position in world coordinates
- `getProgress()` - Returns animation progress 0-1
- `getPlayerScale()` - Returns player scale during wrap (for optional scalePlayer mode)

**CollectionWaveAnimation** (`js/animations/collection_wave_animation.js`) - Collectible pickup effect:
- Visual effect for collectible item pickup (powers, switches)
- Single expanding ring that fades out as it grows
- Color passed as constructor parameter (electric blue for power-up, red for power-down, gold for switch)
- Ease-out expansion over 300ms
- `update(delta)` - Advance animation
- `isComplete()` - Returns true when animation finished
- `getWaveData()` - Returns wave data {radius, opacity} for rendering
- `getPosition()` - Returns center position in world coordinates
- `getColor()` - Returns wave color
- `getProgress()` - Returns animation progress 0-1

**MineExplosionAnimation** (`js/animations/mine_explosion_animation.js`) - Mine detonation effect:
- Extends ParticleExplosion with `mineExplosion` config
- Visual effect for mine explosion (12 particles, 4px size, 35px radius, 600ms)

**PlayerExitAnimation** (`js/animations/player_exit_animation.js`) - Exit warp effect:
- Visual effect for player entering the exit portal
- Player shrinks and fades while moving to the exit center
- Ease-out interpolation toward exit position over 1000ms
- All entities freeze during animation (like death pause)
- `update(delta)` - Advance animation
- `isComplete()` - Returns true when animation finished
- `getScale()` - Returns player scale (1 to 0)
- `getOpacity()` - Returns player opacity (1 to 0)
- `getPosition()` - Returns interpolated position toward exit center
- `getProgress()` - Returns animation progress 0-1

**EnemyBullet** (`js/enemies/enemy_bullet.js`) - Threat entity:
- Linear movement along grid lines via GridMovement
- Wake trail via WakeTrail instance (fast profile)
- Removed when exiting bounds

**EnemyLaser** (`js/enemies/enemy_laser.js`) - Static threat entity:
- Axis-aligned line segment between two grid nodes
- Pink/magenta glow that transitions with state via IntermittentState
- Kills player on contact with any node along the laser
- Optional intermittent mode: `timeOn`/`timeOff` (ms) to cycle on/off (starts on)

**EnemyTrap** (`js/enemies/enemy_trap.js`) - Static point hazard:
- Fixed position on a single grid node
- Orange color (#ff8800)
- Rhombus visual shape
- Kills player on contact (grid-based collision)
- Other entities (bullets) pass through unaffected
- Persists across player deaths (static level feature)
- Optional intermittent mode via IntermittentState: `timeOn`/`timeOff` (ms) to cycle on/off

**EnemyMine** (`js/enemies/enemy_mine.js`) - Triggered explosive hazard:
- Fixed position on a single grid node
- Hexagonal visual shape (distinguishes from trap spike)
- Yellow color (#ffcc00)
- States: `dormant` → `triggered` → `exploded`
- Dormant until player touches the same node (touch does NOT kill)
- On touch: begins countdown with accelerating blink frequency (2Hz → 10Hz)
- After delay: spawns bullets in ALL valid directions from its node (one per connected edge)
- One-time use: disappears after explosion (resets with level reset)
- Config: `x`, `y`, `delay` (ms, mandatory), `bulletSpeed` (pixels/second, optional, defaults to 130)

**EnemyShooter** (`js/enemies/enemy_shooter.js`) - Static turret hazard:
- Fixed position on a single grid node
- Green cross/plus visual shape (#44ff88)
- Fires EnemyBullet instances from configured arms simultaneously
- Cycle: wait for delay → optionally rotate 90° (250ms) → charge (500ms) → shoot all arms
- Charge-up visual cue: growing red circle (#cc2244) at each arm tip during the 500ms charging phase before firing
- If rotation enabled, arms rotate with the shooter visually
- Kills player on contact (grid-based collision)
- Config: `x`, `y`, `arms` (array of "up"/"down"/"left"/"right"), `delay` (ms per cycle), `rotation` (optional: "clockwise"/"counterclockwise")

**EnemyPatrol** (`js/enemies/enemy_patrol.js`) - Moving path-based hazard:
- Moves along a predefined cyclical path of grid nodes via GridMovement
- Purple flat-top hexagon visual shape (#aa44ff)
- Wake trail via WakeTrail instance (slow profile, resets at waypoints)
- Kills player on contact (grid-based collision)
- Path wraps cyclically: after reaching last node, returns to first
- Config: `speed` (pixels/second), `path` (array of {x, y} node coordinates)

**EnemyFollower** (`js/enemies/enemy_follower.js`) - Player-tracking hazard:
- Actively pursues player by moving toward the best adjacent node via GridMovement
- Cyan square visual shape (#00ccff) that continuously rotates on its center
- Wake trail via WakeTrail instance (slow profile, resets at waypoints)
- At each node, calculates which adjacent node minimizes distance to player
- While moving between nodes, does NOT recalculate - continues to target
- Handles blocked paths by choosing next best option; stays if all blocked
- Kills player on contact (circle-based collision)
- Config: `startX`, `startY` (starting node), `speed` (pixels/second)

**Power** (`js/engine/power.js`) - Collectible power item:
- Fixed position on a single grid node
- Holds position (x, y), type, size, isNegative flag, and collected state
- `getPosition()` - Returns world position as Vector2
- `isNegative: false` for power-ups (fast, shield), `true` for power-downs (slow, mirror)
- On collection, Game creates effect via `player.effectManager.addEffect(type, config)`
- Respawns on player death (level reset)
- Config: `x`, `y` (node position), `type` ('fast', 'shield', 'slow', or 'mirror')

**Exit** (`js/engine/exit.js`) - Level completion portal:
- Fixed position on a single grid node
- Tunnel animation: static outer ring with shrinking rings that create depth illusion
- Two states: `open` (green rings) or `closed` (red rings)
- Timer arc: when opened with TTL, displays draining arc around exit (green → red in final 25%)
- Open exit: touching completes level and returns to previous screen
- Closed exit: player can walk through without effect
- Static outer ring always visible at 50% opacity
- New rings spawn every second at outer radius, then shrink toward center
- Rings fade out and get thinner as they approach the center
- Multiple rings visible simultaneously create tunnel/portal effect
- `open(ttl?)` / `close()` methods allow dynamic state changes (used by switches)
- `getTimerProgress()` returns `{progress, isWarning}` for timer arc rendering
- Config: `x`, `y` (node position), `status` ('open' or 'closed')

**Switch** (`js/engine/switch.js`) - Timed unlock mechanism:
- Fixed position on a single grid node
- Gold/yellow rhombus with semi-transparent pulse animation
- When player touches switch: disappears, unlocks linked target (exit)
- After TTL expires: switch reappears, target locks again
- Collection triggers yellow wave animation and sound effect
- Resets on player death (switch reappears, exit closes)
- Config: `x`, `y` (node position), `unlocks` ('exit'), `ttl` (milliseconds)

**Wall** (`js/engine/wall.js`) - Static movement barrier:
- Line segment between two grid nodes (can span multiple nodes)
- Blocks player movement TO any node that lies on the wall's path
- Does not damage player (purely structural)
- Slate blue color (#5588bb) with glow effect
- Persists across player deaths (static level feature)
- Config: `from` (start node {x, y}), `to` (end node {x, y})

**AudioManager** (`js/io/audio_manager.js`) - Sound and music playback:
- Preloads sound files from Constants.audio.sounds
- Respects audio toggle setting in UI
- Persists toggle state to localStorage (defaults to enabled)
- Clones audio elements to allow overlapping playback
- Unlocks audio playback on first user interaction (click/key/touch) due to browser autoplay policies
- `playSound(soundKey)` - Play sound by key if audio enabled
- `playMusic(musicKey)` - Play looping background music (skips if same track already playing)
- `stopMusic()` - Stop and reset current background music

**EnemyManager** (`js/enemies/enemy_manager.js`) - Spawning and lifecycle:
- Spawns from all four borders
- Minimum distance check prevents clustering
- Triggers sound effects via AudioManager (turret rotation)
- `getSpawnWarnings()` - Returns converging particle data for spawners about to fire (within 400ms), with pre-generated random particle positions per spawner

**Collision** (`js/engine/collision.js`) - Collision detection:
- Strategy helpers: `circleCollides(player, entity, size)`, `gridCollides(player, entity)`
- Generic methods: `checkAny(player, entities, checkFn)`, `findFirst(player, entities, checkFn)`
- Circle collision for bullets, patrols, followers, and powers with threshold multiplier (0.7)
- Grid-based collision for lasers, traps, and shooters (exact node match, only when player is stationary)
- Mine contact detection: triggers mine countdown (does not cause collision/death)
- Power collection detection: returns collected power for effect application

**Renderer** (`js/ui/renderer.js`) - Canvas drawing:
- Multi-layer rendering: glow → main → highlight
- Mobile scaling: `setScale(factor)` applies canvas context transform for 73% size on mobile
- Wake effect with tapered gradient for player and enemies
- Camera-aware: transforms all world coordinates to screen space via `toScreen()`
- `drawWakeTrail(entity, size, color, shadowColor?, endColor?)` - Unified wake trail rendering for moving entities
- `drawGlowedShape(x, y, size, color, glowColor, drawShape)` - Standard 3-layer glow effect (outer glow → main → highlight)
- Power rendering with pulsing circle and type-specific icon (lightning bolt for fast, shield icon for shield, turtle for slow, parallel arrows for mirror)
- Player boost indicator: electric blue glow when speed boost is active, red glow when slowed
- Shield rendering: electric blue pulsing circular aura around player when shield is active
- Immunity blinking: player blinks rapidly during post-shield immunity period
- `drawSpawnWarnings(warnings)` - Draws converging bullet-red particles at spawn points before bullets fire
- `drawDebugNodeCoordinates(grid)` - Draws `row,col` text above each grid node (debug mode)

**UIManager** (`js/io/ui_manager.js`) - UI effects:
- Screen shake trigger on collision

**ErrorNotifier** (`js/io/error_notifier.js`) - Developer error visibility:
- Displays JavaScript errors via `alert()` for immediate developer visibility
- `init()` - Sets up global `window.onerror` and `unhandledrejection` handlers
- Errors still log to console for debugging

**Game** (`js/engine/game.js`) - Main orchestrator:
- `start(levelData)` - Initializes game with level configuration (grid, player, enemies, powers)
- `update(delta)` - Main update loop, delegates to helper methods
- `updateAnimations(delta)` - Updates visual effect animations
- `checkCollisionsAndHandle()` - Coordinates all collision checks and responses
- `checkEnemyCollisions()` - Returns true if player hit by any enemy
- `handleEnemyHit()` - Processes enemy collision (shield break or death)
- `handlePowerCollection(power)` - Applies effect, plays sound, creates wave animation
- `handleLevelComplete()` - Starts exit warp animation (callback called when animation completes)
- Receives shared AudioManager from main/main.js, passes to EnemyManager for sound effects
- `debugMode` - Toggle for debug overlay (localhost only, toggled via "G" key in main loop)
- Delta-time game loop via requestAnimationFrame
- Death pause: 1000ms freeze with explosion effect before reset
- Exit warp: 1000ms animation where player shrinks/fades into exit, entities freeze
- Collision → death pause → reset flow (infinite lives)
- Collision handling via `player.effectManager.handleCollision()` - returns true if effect absorbed hit
- Camera follows player each frame (instant jump on teleport)
- Single powers array for both power-ups and power-downs
- Power collection creates effects via `player.effectManager.addEffect(type, config)`
- Collection wave animation on power pickup (electric blue for power-ups, red for power-downs)
- Powers respawn on player death
- Responsive canvas with window resize handling and mobile scaling (73% at <768px viewport)

## Game Mechanics

- **Movement**: One grid cell at a time, smooth interpolation
- **Edge wrapping**: Toroidal topology - exit one edge, appear on opposite
- **Enemies**: Various threat types (bullets, lasers, traps), each with unique movement and collision mechanics
- **Collision**: Collisions reset the level (infinite lives)
- **Custom levels**: Users can upload a JSON level file from the home menu. Custom levels bypass localStorage progression updates and analytics tracking. On completion, the player returns to the home screen (no auto-advance)
- **Gym levels**: Gym levels bypass analytics tracking but otherwise function normally

## Code Style

### JavaScript Conventions

- Do not use semicolons
- One class per file
- Naming
  - Files: `snake_case`
  - Classes: `PascalCase`
  - Functions: `camelCase` (no underscore prefixes)
  - Variables: full descriptive names, avoid abbreviations
    - Allowed: `i`, `j` (loop counters), `x`, `y` (coordinates), `dx`, `dy` (deltas), `ctx` (canvas context)
    - Avoid: `p` (player), `em` (enemyManager), `el` (element), `sw` (switch), `m` (mine), etc.
- All magic values in `main/constants.js`
- Unused parameters: use `_`, `__`, `___`, etc.

### JavaScript Comment Conventions

All JavaScript code uses a mixed comment style:

**Class Level** - JSDoc block describing purpose:
```javascript
/**
 * Brief description of class purpose.
 * Additional context about role in the game architecture.
 */
class ClassName {
```

**Function Level** - JSDoc with parameters and return type:
```javascript
/**
 * Brief description of what the method does.
 * @param {Type} paramName - Description
 * @returns {Type} Description
 */
methodName(paramName) {
```

**Field Level** - Inline end-of-line comment on first declaration:
```javascript
this.x = 0                // Current X position
this.speed = config.speed // Movement speed in pixels/second
```

**Code Block Level** - Plain comments for complex logic:
```javascript
// Calculate interpolated position toward target
const dir = Vector2.direction(current, target)
```

### CSS Comment Conventions

All CSS code uses a minimal, purpose-focused comment style:

**Section Dividers** - Major sections use decorated block comments:
```css
/* ============================================
   Section Name
   ============================================ */
```

**Rule Comments** - Single-line comment above the rule:
```css
/* Animated background grid */
.background-element::before {
```

**Pseudo-element Comments** - Brief description of visual effect:
```css
/* Scan line overlay effect */
.title-text::after {
```

**Conditional Logic Comments** - Explain non-obvious selectors:
```css
/* Hide background animation when game screen is active */
body:has(.game-screen.active) .background-animation {
```

**Guidelines:**
- Place comments above the rule they describe
- Use short, descriptive phrases (not full sentences)
- Focus on visual/functional purpose, not technical implementation
- Group related selectors together (base rule, pseudo-elements, states)
- Place keyframe animations near their corresponding animation properties
