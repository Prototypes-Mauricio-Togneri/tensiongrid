# Architecture & Design

Detailed reference for the "Grid Runner" game implementation.

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

- **Animated background grid** - Perspective-transformed grid with infinite scroll animation
- **Scanline overlay** - Subtle horizontal lines for CRT effect (via `body::after`)
- **Title flicker** - Subtle randomized opacity animation
- **Vignette** - Radial gradient darkening canvas edges
- **Screen shake** - CSS keyframe animation on collision

### HUD Layout

- Score displayed with 6-digit zero-padding

## Class Architecture

### Configuration

**Constants** (`js/constants.js`) - Immutable game constants:
- `physics`: max delta time (100ms), collision threshold (0.7)
- `grid`: cell size (80px), node radius (5px), edge width (2px)
- `player`: size (12px), speed (200px/s)
- `enemies`: bullet size (5px), bullet speed (130px/s), trap size (14px), mine size (12px)
- `colors`: all game element colors with glow variants

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

**EnemyBullet** (`js/enemy_bullet.js`) - Threat entity:
- Linear movement along grid lines
- Wake effect - gradient trail during movement
- Removed when exiting bounds

**EnemyLaser** (`js/enemy_laser.js`) - Static threat entity:
- Axis-aligned line segment between two grid nodes
- Pulsing pink/red visual effect
- Kills player on contact with any node along the laser
- Optional intermittent mode: `timeOn`/`timeOff` (ms) to blink on/off (starts on)

**EnemyTrap** (`js/enemy_trap.js`) - Static point hazard:
- Fixed position on a single grid node
- Pulsing 4-pointed spike/star visual effect
- Kills player on contact (grid-based collision)
- Other entities (bullets) pass through unaffected
- Persists across player deaths (static level feature)
- Optional intermittent mode: `timeOn`/`timeOff` (ms) to blink on/off (starts on, dimmed when inactive)

**EnemyMine** (`js/enemy_mine.js`) - Triggered explosive hazard:
- Fixed position on a single grid node
- Hexagonal visual shape (distinguishes from trap spike)
- Yellow/orange color (#ffaa00)
- States: `dormant` → `triggered` → `exploded`
- Dormant until player touches the same node (touch does NOT kill)
- On touch: begins countdown with accelerating blink frequency (2Hz → 10Hz)
- After delay: spawns bullets in ALL valid directions from its node (one per connected edge)
- One-time use: disappears after explosion (resets with level reset)
- Config: `x`, `y`, `delay` (ms, mandatory)

**EnemyManager** (`js/enemy_manager.js`) - Spawning and lifecycle:
- Spawns from all four borders
- Minimum distance check prevents clustering

**CollisionSystem** (`js/collision_system.js`) - Collision detection:
- Circle collision for bullets with threshold multiplier (0.7)
- Grid-based collision for lasers and traps (exact node match)
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
- Delta-time game loop via requestAnimationFrame
- Score accumulation (1 point/second)
- Collision → reset flow (infinite lives)
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

- No semicolons
- One class per file
- All magic values in `constants.js`

### Comment Conventions

All JavaScript code uses a mixed comment style:

**Class Level** - JSDoc block describing purpose:
```javascript
/**
 * Brief description of class purpose.
 * Additional context about role in the game architecture.
 */
class ClassName {
```

**Method Level** - JSDoc with parameters and return type:
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
this.x = 0              // Current X position
this.speed = config.speed // Movement speed in pixels/second
```

**Code Block Level** - Plain comments for complex logic:
```javascript
// Calculate interpolated position toward target
const dir = Vector2.direction(current, target)
```
