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

### HUD Layout

- Score displayed with 6-digit zero-padding

## Class Architecture

### Configuration

**Constants** (`js/constants.js`) - Immutable game constants:
- `physics`: max delta time (100ms), collision threshold (0.7)
- `grid`: cell size (80px), node radius (5px), edge width (2px)
- `player`: size (12px), speed (200px/s), explosion fragments (7), explosion fragment size (5px), explosion speed (30-50px/s random), explosion rotation speed (3 rad/s)
- `physics.deathPauseMs`: pause duration after death (1000ms)
- `enemies`: bullet size (5px), bullet speed (130px/s), trap size (14px), mine size (12px), mine patrol spawn delay (1500ms), shooter size (14px), patrol size (12px), follower size (8px), follower default speed (100px/s), follower rotation speed (3 rad/s)
- `colors`: all game element colors with glow variants
- `audio.sounds`: paths to sound effect files (shooterTurn, menuChange, menuSelect, etc.)
- `audio.music`: paths to music files (mainMenu)
- `storage.keys`: localStorage key names (audioEnabled)

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

**InputManager** (`js/input_manager.js`) - Keyboard input:
- Supports arrow keys and WASD
- `getDirection()` - Returns movement delta or null
- Auto-disables after edge wrap

**Player** (`js/player.js`) - Player entity:
- Grid-snapped target-based movement
- Wake effect - gradient trail during movement
- `moveTo(row, col, teleport)` - Movement with optional teleport

**PlayerExplosion** (`js/player_explosion.js`) - Death effect:
- Visual effect for player death, fragments fly outward and rotate from center
- 7 small rhombus fragments with evenly distributed directions
- Each fragment has random speed (30-50px/s) and rotates on its own center
- `update(delta)` - Move fragments outward and update rotation
- `getFragments()` - Returns fragment data {x, y, rotation} for rendering

**EnemyBullet** (`js/enemy_bullet.js`) - Threat entity:
- Linear movement along grid lines
- Wake effect - gradient trail during movement
- Removed when exiting bounds

**EnemyLaser** (`js/enemy_laser.js`) - Static threat entity:
- Axis-aligned line segment between two grid nodes
- Pink/magenta glow that transitions with state (ramps up when activating, ramps down when deactivating, holds steady while on/off)
- Kills player on contact with any node along the laser
- Optional intermittent mode: `timeOn`/`timeOff` (ms) to blink on/off (starts on)

**EnemyTrap** (`js/enemy_trap.js`) - Static point hazard:
- Fixed position on a single grid node
- Pulsing 4-pointed spike/star visual effect
- Kills player on contact (grid-based collision)
- Other entities (bullets) pass through unaffected
- Persists across player deaths (static level feature)
- Optional intermittent mode: `timeOn`/`timeOff` (ms) to blink on/off (starts on, dimmed when inactive)
- Optional `ttl` (ms): time to live, trap is removed when TTL reaches zero

**EnemyMine** (`js/enemy_mine.js`) - Triggered explosive hazard:
- Fixed position on a single grid node
- Hexagonal visual shape (distinguishes from trap spike)
- Yellow/orange color (#ffaa00)
- States: `dormant` → `triggered` → `exploded`
- Dormant until player touches the same node (touch does NOT kill)
- On touch: begins countdown with accelerating blink frequency (2Hz → 10Hz)
- After delay: spawns bullets in ALL valid directions from its node (one per connected edge)
- One-time use: disappears after explosion (resets with level reset)
- Config: `x`, `y`, `delay` (ms, mandatory), optional `ttl` (ms, time to live)

**EnemyShooter** (`js/enemy_shooter.js`) - Static turret hazard:
- Fixed position on a single grid node
- Green cross/plus visual shape (#44ff88)
- Fires EnemyBullet instances in configured directions
- Each direction has independent timer (can fire multiple directions simultaneously)
- Optional continuous rotation that affects bullet direction
- Rotation snaps fired bullets to nearest cardinal direction
- Kills player on contact (grid-based collision)
- Config: `x`, `y`, plus optional `leftDelay`, `rightDelay`, `upDelay`, `downDelay` (ms between shots), `rotationDelay` (ms per 90-degree rotation)

**EnemyPatrol** (`js/enemy_patrol.js`) - Moving path-based hazard:
- Moves along a predefined cyclical path of grid nodes
- Purple flat-top hexagon visual shape (#aa44ff)
- Smooth interpolation between nodes (like EnemyBullet)
- Wake effect - gradient trail during movement
- Kills player on contact (grid-based collision)
- Path wraps cyclically: after reaching last node, returns to first
- Optional trap/mine spawning: when timer fires, marks next node; spawns when patrol arrives there
- Skips spawning if a fixed enemy (trap, mine, shooter) already exists at target node
- Config: `speed` (pixels/second), `path` (array of {x, y} node coordinates), optional `trapFrequency`/`trapTtl` (ms), optional `mineFrequency`/`mineTtl` (ms)

**EnemyFollower** (`js/enemy_follower.js`) - Player-tracking hazard:
- Actively pursues player by moving toward the best adjacent node
- Orange square visual shape (#ff8800) that continuously rotates on its center
- Smooth interpolation between nodes (like EnemyPatrol)
- Wake effect - gradient trail during movement
- At each node, calculates which adjacent node minimizes distance to player
- While moving between nodes, does NOT recalculate - continues to target
- Handles blocked paths by choosing next best option; stays if all blocked
- Kills player on contact (circle-based collision)
- Config: `startX`, `startY` (starting node), `speed` (pixels/second)

**AudioManager** (`js/audio_manager.js`) - Sound and music playback:
- Preloads sound files from Constants.audio.sounds
- Respects audio toggle setting in UI
- Persists toggle state to localStorage (defaults to enabled)
- Clones audio elements to allow overlapping playback
- Unlocks audio playback on first user interaction (click/key/touch) due to browser autoplay policies
- `playSound(soundKey)` - Play sound by key if audio enabled
- `playMusic(musicKey)` - Play looping background music (skips if same track already playing)
- `stopMusic()` - Stop and reset current background music

**EnemyManager** (`js/enemy_manager.js`) - Spawning and lifecycle:
- Spawns from all four borders
- Minimum distance check prevents clustering
- Triggers sound effects via AudioManager (turret rotation)

**CollisionSystem** (`js/collision_system.js`) - Collision detection:
- Circle collision for bullets, patrols, and followers with threshold multiplier (0.7)
- Grid-based collision for lasers, traps, and shooters (exact node match)
- Mine contact detection: triggers mine countdown (does not cause collision/death)

**Renderer** (`js/renderer.js`) - Canvas drawing:
- Multi-layer rendering: glow → main → highlight
- Wake effect with tapered gradient for player and enemies
- Camera-aware: transforms all world coordinates to screen space via `toScreen()`

**UIManager** (`js/ui_manager.js`) - DOM-based HUD:
- Score display with zero-padding
- Screen shake trigger on collision

**Game** (`js/game.js`) - Main orchestrator:
- `start(levelData)` - Initializes game with level configuration (grid, player, enemies)
- Creates AudioManager and passes to EnemyManager for sound effects
- Delta-time game loop via requestAnimationFrame
- Score accumulation (1 point/second)
- Death pause: 1000ms freeze with explosion effect before reset
- Collision → death pause → reset flow (infinite lives)
- Camera follows player each frame (instant jump on teleport)
- Responsive canvas with window resize handling

## Game Mechanics

- **Movement**: One grid cell at a time, smooth interpolation
- **Edge wrapping**: Toroidal topology - exit one edge, appear on opposite
- **Enemies**: Various threat types (bullets, lasers, traps), each with unique movement and collision mechanics
- **Collision**: Collisions cause score reset (infinite lives)
- **Scoring**: 1 point per second survived

## Code Style

### JavaScript Conventions

- Do not use semicolons in Javascript code
- One class per file
- Naming
  - Files: `snake_case`
  - Classes: `PascalCase`
  - Functions: `camelCase`
- All magic values in `constants.js`

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
