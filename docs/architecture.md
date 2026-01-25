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
- **Scanline overlay** - Subtle horizontal lines for CRT effect (via `body::after`)
- **Title design** - Stacked "TENSION" / "GRID" layout with:
  - "TENSION" in red (#ff2020) with molten heat glow and scan line overlay
  - Warning bar with diagonal danger stripes
  - "GRID" in white with angular corner accents
  - Pulsing burn animation and subtle flicker effects
- **Vignette** - Radial gradient darkening canvas edges
- **Screen shake** - CSS keyframe animation on collision

## Class Architecture

### Configuration

**Constants** (`js/constants.js`) - Immutable game constants:
- `scale`: mobile breakpoint (768px), mobile scale factor (0.5)
- `physics`: max delta time (100ms), collision threshold (0.7)
- `grid`: cell size (80px), node radius (5px), edge width (2px)
- `player`: size (12px), speed (200px/s)
- `physics.deathPauseMs`: pause duration after death (1000ms)
- `enemies`: bullet size (5px), bullet speed (130px/s), trap size (14px), trap opacity transition speed (0.004/ms), trap opacity min/max (0.3/1.0), mine size (12px), mine patrol spawn delay (1500ms), shooter size (14px), patrol size (12px), follower size (8px), follower default speed (100px/s), follower rotation speed (3 rad/s)
- `powers.[type].size`: (16px) - collectible size per power type (fast, slow, shield, mirror)
- `powers.[type].iconScale`: (0.65) - icon size multiplier per power type
- `effects.fast`: duration (5000ms), speed multiplier (1.5x), warningDuration (1000ms), blinkFrequency (0.015) - blinks before expiring
- `effects.slow`: duration (5000ms), speed multiplier (0.5x), warningDuration (1000ms), blinkFrequency (0.015) - blinks before expiring
- `effects.shield`: duration (5000ms), warningDuration (1000ms), blinkFrequency (0.015) - blinks before expiring naturally
- `effects.immunity`: duration (2000ms), blink frequency (0.015) - effect behavior
- `effects.mirror`: duration (5000ms), warningDuration (1000ms), blinkFrequency (0.015) - inverts player controls, blinks before expiring
- `colors`: all game element colors with glow variants
- `game.animations.pixelScatter`: particle count (16), particle size (3px), spawn radius (45px), duration (250ms) - wrap teleport effect
- `game.animations.collectionWave`: start radius (8px), end radius (35px), duration (300ms), line width (3px)
- `game.animations.pixelExplosion`: particle count (16), particle size (5px), end radius (40px), duration (800ms)
- `game.animations.mineExplosion`: particle count (12), particle size (4px), end radius (35px), duration (600ms)
- `audio.sounds`: paths to sound effect files (shooterTurn, menuChange, menuSelect, etc.)
- `audio.music`: paths to music files (mainMenu)
- `storage`: localStorage key names (audioEnabled, firstPlay)
- `swipe.minDistance`: minimum swipe distance in pixels (30px)

- `version`: UTC build timestamp (auto-updated by `scripts/version.sh` at deploy time)

### Core Classes

**Vector2** (`js/vector2.js`) - 2D vector utility:
- `distance(a, b)` - Euclidean distance
- `direction(from, to)` - Normalized direction vector

**Grid** (`js/grid.js`) - Grid coordinate system:
- `getNodePosition(row, col)` - Grid coords to world pixels
- `isValidPosition(row, col)` - Bounds and exclusion checking
- `isExcluded(row, col)` - Check if node is excluded
- `isEdgeExcluded(row1, col1, row2, col2)` - Check if edge between two nodes is excluded
- `wrapPosition(row, col)` - Toroidal wrapping
- Supports `excludes.nodes` config to remove nodes and their edges from the grid
- Supports `excludes.edges` config to remove specific edges (bidirectional)

**Camera** (`js/camera.js`) - Viewport and camera system:
- `setViewport(width, height)` - Update viewport size on canvas resize
- `follow(targetX, targetY, instant)` - Center camera on target with edge clamping
- `worldToScreen(worldX, worldY)` - Transform world coordinates to screen coordinates
- `clamp()` - Constrain camera so viewport stays within grid bounds (centers grid if smaller than viewport)

**InputManager** (`js/io/input_manager.js`) - Keyboard and touch input:
- Supports arrow keys, WASD, and touch drag gestures
- `getDirection()` - Returns movement delta or null (checks swipe first, then keyboard)
- `setSwipeEnabled(callback)` - Set callback to determine if swipes trigger movement
- `triggerEscape()` - Programmatically trigger escape (used by browser back button)
- `clearPendingInput()` - Clear buffered swipe state (called on player death/reset)
- Auto-disables after edge wrap
- Continuous drag detection: triggers move when drag exceeds 30px threshold, resets start position for chaining multiple moves without lifting finger

**LocalStorage** (`js/io/local_storage.js`) - Centralized localStorage operations:
- `getAudioEnabled()` - Get audio enabled state (default: true)
- `setAudioEnabled(enabled)` - Set audio enabled state
- `hasCurrentLevel()` - Check if current game level exists
- `getCurrentLevel()` - Get current game level
- `setCurrentLevel(level)` - Set current game level, preloads next level
- `getLevelPath(level)` - Build level file path from level number
- `preloadLevel(level)` - Preload level JSON into browser cache

### Effect System

**Effect** (`js/effects/effect.js`) - Effect instance data:
- Holds type, duration, remaining time, and config for an active effect
- `update(delta)` - Decrements timer, returns true if effect just expired
- `getProgress()` - Returns 0-1 ratio (1 = just started, 0 = expired)

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

**Player** (`js/engine/player.js`) - Player entity:
- Grid-snapped target-based movement
- Wake effect - gradient trail during movement
- `effectManager` - EffectManager instance for handling active effects
- `moveTo(row, col, teleport)` - Movement with optional teleport
- `hasSpeedBoost()` - Check if fast effect is active (delegates to effectManager)
- `isSlowed()` - Check if slow effect is active (delegates to effectManager)
- `hasShield()` - Check if shield effect is active (delegates to effectManager)
- `isImmune()` - Check if immunity effect is active (delegates to effectManager)
- `isProtected()` - Check if player has shield OR immunity (cannot die from collision)

**PlayerExplosionAnimation** (`js/animations/player_explosion_animation.js`) - Death effect:
- Visual effect for player death, particles scatter outward from center
- 16 small square particles with random angles (uses pixelExplosion config)
- Ease-out animation for smooth deceleration over 800ms
- Particles fade out as they scatter
- `update(delta)` - Advance animation
- `isComplete()` - Returns true when animation finished
- `getParticles()` - Returns particle data {x, y, opacity} for rendering
- `getPosition()` - Returns center position in world coordinates

**PlayerWrapAnimation** (`js/animations/player_wrap_animation.js`) - Wrap teleport effect:
- Visual effect for player wrap-around teleportation
- 16 small square particles converge from scattered positions to center
- Particles start at random angles within 45px radius
- Ease in-out animation for smooth convergence over 250ms
- `update(delta)` - Advance animation
- `isComplete()` - Returns true when animation finished
- `getParticles()` - Returns particle data {x, y, opacity} for rendering
- `getPosition()` - Returns center position in world coordinates

**PowerCollectionAnimation** (`js/animations/power_collection_animation.js`) - Power-up/down collection effect:
- Visual effect for power-up/power-down collection
- Single expanding ring that fades out as it grows
- Color passed as constructor parameter (blue for power-up, red for power-down)
- Ease-out expansion over 300ms
- `update(delta)` - Advance animation
- `isComplete()` - Returns true when animation finished
- `getWaveData()` - Returns wave data {radius, opacity} for rendering
- `getPosition()` - Returns center position in world coordinates
- `getColor()` - Returns wave color

**MineExplosionAnimation** (`js/animations/mine_explosion_animation.js`) - Mine detonation effect:
- Visual effect for mine explosion
- 12 yellow square particles scatter outward from center
- Ease-out animation for smooth deceleration over 600ms
- Particles fade out as they scatter
- `update(delta)` - Advance animation
- `isComplete()` - Returns true when animation finished
- `getParticles()` - Returns particle data {x, y, opacity} for rendering
- `getPosition()` - Returns center position in world coordinates

**EnemyBullet** (`js/enemies/enemy_bullet.js`) - Threat entity:
- Linear movement along grid lines
- Wake effect - gradient trail during movement
- Removed when exiting bounds

**EnemyLaser** (`js/enemies/enemy_laser.js`) - Static threat entity:
- Axis-aligned line segment between two grid nodes
- Pink/magenta glow that transitions with state (ramps up when activating, ramps down when deactivating, holds steady while on/off)
- Kills player on contact with any node along the laser
- Optional intermittent mode: `timeOn`/`timeOff` (ms) to blink on/off (starts on)

**EnemyTrap** (`js/enemies/enemy_trap.js`) - Static point hazard:
- Fixed position on a single grid node
- Orange color (#ff8800)
- Rhombus visual shape
- Kills player on contact (grid-based collision)
- Other entities (bullets) pass through unaffected
- Persists across player deaths (static level feature)
- Optional intermittent mode: `timeOn`/`timeOff` (ms) to cycle on/off (starts on, smooth opacity transition between states)
- Optional `ttl` (ms): time to live, trap is removed when TTL reaches zero

**EnemyMine** (`js/enemies/enemy_mine.js`) - Triggered explosive hazard:
- Fixed position on a single grid node
- Hexagonal visual shape (distinguishes from trap spike)
- Yellow color (#ffcc00)
- States: `dormant` → `triggered` → `exploded`
- Dormant until player touches the same node (touch does NOT kill)
- On touch: begins countdown with accelerating blink frequency (2Hz → 10Hz)
- After delay: spawns bullets in ALL valid directions from its node (one per connected edge)
- One-time use: disappears after explosion (resets with level reset)
- Config: `x`, `y`, `delay` (ms, mandatory), optional `ttl` (ms, time to live)

**EnemyShooter** (`js/enemies/enemy_shooter.js`) - Static turret hazard:
- Fixed position on a single grid node
- Green cross/plus visual shape (#44ff88)
- Fires EnemyBullet instances in configured directions
- Each direction has independent timer (can fire multiple directions simultaneously)
- Optional continuous rotation that affects bullet direction
- Rotation snaps fired bullets to nearest cardinal direction
- Kills player on contact (grid-based collision)
- Config: `x`, `y`, plus optional `leftDelay`, `rightDelay`, `upDelay`, `downDelay` (ms between shots), `rotationDelay` (ms per 90-degree rotation)

**EnemyPatrol** (`js/enemies/enemy_patrol.js`) - Moving path-based hazard:
- Moves along a predefined cyclical path of grid nodes
- Purple flat-top hexagon visual shape (#aa44ff)
- Smooth interpolation between nodes (like EnemyBullet)
- Wake effect - gradient trail during movement
- Kills player on contact (grid-based collision)
- Path wraps cyclically: after reaching last node, returns to first
- Config: `speed` (pixels/second), `path` (array of {x, y} node coordinates)

**EnemyFollower** (`js/enemies/enemy_follower.js`) - Player-tracking hazard:
- Actively pursues player by moving toward the best adjacent node
- Cyan square visual shape (#00ccff) that continuously rotates on its center
- Smooth interpolation between nodes (like EnemyPatrol)
- Wake effect - gradient trail during movement
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
- Config: `x`, `y` (node position), `type` ('fast', 'shield', or 'slow')

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

**Collision** (`js/engine/collision.js`) - Collision detection:
- Strategy helpers: `circleCollides(player, entity, size)`, `gridCollides(player, entity)`
- Generic methods: `checkAny(player, entities, checkFn)`, `findFirst(player, entities, checkFn)`
- Circle collision for bullets, patrols, followers, and powers with threshold multiplier (0.7)
- Grid-based collision for lasers, traps, and shooters (exact node match)
- Mine contact detection: triggers mine countdown (does not cause collision/death)
- Power collection detection: returns collected power for effect application

**Renderer** (`js/ui/renderer.js`) - Canvas drawing:
- Multi-layer rendering: glow → main → highlight
- Mobile scaling: `setScale(factor)` applies canvas context transform for 50% size on mobile
- Wake effect with tapered gradient for player and enemies
- Camera-aware: transforms all world coordinates to screen space via `toScreen()`
- `drawWakeTrail(entity, size, color, shadowColor?, endColor?)` - Unified wake trail rendering for moving entities
- `drawGlowedShape(x, y, size, color, glowColor, drawShape)` - Standard 3-layer glow effect (outer glow → main → highlight)
- Power rendering with pulsing circle and type-specific icon (lightning bolt for fast, shield icon for shield, turtle for slow, parallel arrows for mirror)
- Player boost indicator: cyan glow when speed boost is active, red glow when slowed
- Shield rendering: light blue pulsing circular aura around player when shield is active
- Immunity blinking: player blinks rapidly during post-shield immunity period

**UIManager** (`js/io/ui_manager.js`) - UI effects:
- Screen shake trigger on collision

**Game** (`js/engine/game.js`) - Main orchestrator:
- `start(levelData)` - Initializes game with level configuration (grid, player, enemies, powers)
- `update(delta)` - Main update loop, delegates to helper methods
- `updateAnimations(delta)` - Updates visual effect animations
- `checkCollisionsAndHandle()` - Coordinates all collision checks and responses
- `checkEnemyCollisions()` - Returns true if player hit by any enemy
- `handleEnemyHit()` - Processes enemy collision (shield break or death)
- `handlePowerCollection(power)` - Applies effect, plays sound, creates wave animation
- Receives shared AudioManager from main.js, passes to EnemyManager for sound effects
- Delta-time game loop via requestAnimationFrame
- Death pause: 1000ms freeze with explosion effect before reset
- Collision → death pause → reset flow (infinite lives)
- Collision handling via `player.effectManager.handleCollision()` - returns true if effect absorbed hit
- Camera follows player each frame (instant jump on teleport)
- Single powers array for both power-ups and power-downs
- Power collection creates effects via `player.effectManager.addEffect(type, config)`
- Collection wave animation on power pickup (cyan/blue for power-ups, red for power-downs)
- Powers respawn on player death
- Responsive canvas with window resize handling and mobile scaling (50% at <768px viewport)

## Game Mechanics

- **Movement**: One grid cell at a time, smooth interpolation
- **Edge wrapping**: Toroidal topology - exit one edge, appear on opposite
- **Enemies**: Various threat types (bullets, lasers, traps), each with unique movement and collision mechanics
- **Collision**: Collisions reset the level (infinite lives)

## Code Style

### JavaScript Conventions

- Do not use semicolons
- One class per file
- Naming
  - Files: `snake_case`
  - Classes: `PascalCase`
  - Functions: `camelCase` (no underscore prefixes)
- All magic values in `constants.js`
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
