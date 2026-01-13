/**
 * Static shooter enemy that fires bullets in configured directions.
 * Fixed on one grid node, renders with arms pointing in active fire directions.
 * Supports independent firing delays per direction and optional rotation.
 */
class EnemyShooter {
    /**
     * @param {Object} config - Shooter configuration from level data
     * @param {Grid} grid - Grid instance for position calculation
     */
    constructor(config, grid) {
        this.row = config.y // Grid row position
        this.col = config.x // Grid column position
        this.grid = grid    // Grid reference

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x   // World X coordinate
        this.y = pos.y   // World Y coordinate
        this.size = Constants.game.enemies.shooter.size // Cross arm length

        // Rotation state
        this.rotation = 0                          // Current visual rotation in radians
        this.rotationDelay = config.rotationDelay  // Time between 90-degree rotations (ms), undefined if no rotation
        this.targetRotation = 0                    // Target rotation to animate toward
        this.startRotation = 0                     // Starting rotation for animation
        this.rotationTimer = 0                     // Timer until next 90-degree rotation
        this.isRotating = false                    // Currently animating rotation
        this.rotationAnimDuration = 200            // Animation duration (ms)
        this.rotationAnimTimer = 0                 // Animation progress timer

        // Direction firing timers (each is independent)
        this.directionTimers = this.initDirectionTimers(config)
    }

    /**
     * Initialize independent timers for each configured direction.
     * @param {Object} config - Shooter config with optional leftDelay, rightDelay, upDelay, downDelay
     * @returns {Object} Object with timers for each active direction
     */
    initDirectionTimers(config) {
        const timers = {}
        const directionKeys = ['left', 'right', 'up', 'down']

        for (const dir of directionKeys) {
            const delayKey = `${dir}Delay`
            if (config[delayKey] !== undefined) {
                timers[dir] = {
                    delay: config[delayKey], // Interval between shots (ms)
                    timer: 0                 // Elapsed time since last shot
                }
            }
        }
        return timers
    }

    /**
     * Update shooter state: rotation animation and firing timers.
     * @param {number} delta - Time elapsed since last frame in ms
     * @returns {Array} Array of bullet spawn info objects (empty if none fired)
     */
    update(delta) {
        const bulletsToSpawn = []

        // Update rotation if configured
        if (this.rotationDelay !== undefined) {
            this.updateRotation(delta)
        }

        // Update each direction timer and check for firing
        for (const [direction, timerState] of Object.entries(this.directionTimers)) {
            timerState.timer += delta
            if (timerState.timer >= timerState.delay) {
                bulletsToSpawn.push(this.getBulletSpawnInfo(direction))
                timerState.timer = 0
            }
        }

        return bulletsToSpawn
    }

    /**
     * Update rotation state with discrete 90-degree steps.
     * Waits rotationDelay ms, then quickly animates 90 degrees.
     * @param {number} delta - Time elapsed since last frame in ms
     */
    updateRotation(delta) {
        if (this.isRotating) {
            // Animate toward target rotation
            this.rotationAnimTimer += delta
            const progress = Math.min(this.rotationAnimTimer / this.rotationAnimDuration, 1)
            // Ease-out for smooth stop
            const eased = 1 - Math.pow(1 - progress, 2)
            this.rotation = this.startRotation + (Math.PI / 2) * eased

            if (progress >= 1) {
                this.rotation = this.targetRotation
                this.isRotating = false
                this.rotationTimer = 0
            }
        } else {
            // Wait for next rotation
            this.rotationTimer += delta
            if (this.rotationTimer >= this.rotationDelay) {
                this.startRotation = this.rotation
                this.targetRotation = this.rotation + Math.PI / 2
                this.isRotating = true
                this.rotationAnimTimer = 0
            }
        }
    }

    /**
     * Get bullet spawn information for a given direction, accounting for rotation.
     * @param {string} direction - Base direction key ('left', 'right', 'up', 'down')
     * @returns {Object} Spawn info with row, col, x, y, dirRow, dirCol
     */
    getBulletSpawnInfo(direction) {
        // Get base direction vector
        const baseDir = this.getBaseDirectionVector(direction)

        // Apply rotation to direction vector
        const rotatedDir = this.rotateVector(baseDir.row, baseDir.col, this.rotation)

        // Snap to nearest cardinal direction for grid movement
        const snappedDir = this.snapToCardinalDirection(rotatedDir.x, rotatedDir.y)

        return {
            row: this.row,
            col: this.col,
            x: this.x,
            y: this.y,
            dirRow: snappedDir.dirRow,
            dirCol: snappedDir.dirCol
        }
    }

    /**
     * Get base direction vector from direction key.
     * @param {string} direction - Direction key
     * @returns {Object} {row, col}
     */
    getBaseDirectionVector(direction) {
        const dirs = Constants.directions
        return dirs[direction] || dirs.none
    }

    /**
     * Rotate a direction vector by given angle.
     * @param {number} dirRow - Row component (-1, 0, 1)
     * @param {number} dirCol - Col component (-1, 0, 1)
     * @param {number} angle - Rotation angle in radians (clockwise)
     * @returns {Object} Rotated vector {x, y}
     */
    rotateVector(dirRow, dirCol, angle) {
        // Convert grid direction to x/y: col = x, row = -y (inverted for screen coords)
        const x = dirCol
        const y = -dirRow // Negative because row increases downward

        // Apply 2D rotation matrix (clockwise rotation)
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        return {
            x: x * cos + y * sin,
            y: -x * sin + y * cos
        }
    }

    /**
     * Snap a rotated vector to the nearest cardinal direction.
     * @param {number} x - X component
     * @param {number} y - Y component
     * @returns {Object} {dirRow, dirCol}
     */
    snapToCardinalDirection(x, y) {
        // Determine dominant axis
        if (Math.abs(x) > Math.abs(y)) {
            // Horizontal dominant
            return { dirRow: 0, dirCol: x > 0 ? 1 : -1 }
        } else {
            // Vertical dominant (positive y = negative row for screen coords)
            return { dirRow: y > 0 ? -1 : 1, dirCol: 0 }
        }
    }

    /**
     * Get current world position.
     * @returns {Vector2} Position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }

    /**
     * Get current rotation in radians.
     * @returns {number} Rotation angle
     */
    getRotation() {
        return this.rotation
    }

    /**
     * Get array of active direction keys.
     * @returns {string[]} Array of direction keys ('left', 'right', 'up', 'down')
     */
    getActiveDirections() {
        return Object.keys(this.directionTimers)
    }
}
