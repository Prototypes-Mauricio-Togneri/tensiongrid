/**
 * Static shooter enemy that fires bullets from configured arms.
 * Fixed on one grid node. Optionally rotates 90° each cycle before firing.
 */
class EnemyShooter {
    /**
     * @param {Object} config - Shooter configuration from level data
     * @param {Grid} grid - Grid instance for position calculation
     */
    constructor(config, grid) {
        this.row = config.y // Grid row position
        this.col = config.x // Grid column position
        this.grid = grid // Grid reference

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x // World X coordinate
        this.y = pos.y // World Y coordinate
        this.armLength = Constants.game.enemies.shooter.armLength // Arm length from center

        // Configuration
        this.arms = config.arms // Array of arm directions ('up', 'down', 'left', 'right')
        this.delay = config.delay // Cycle delay in ms
        this.rotationDirection = config.rotation // 'clockwise', 'counterclockwise', or undefined

        // State machine: 'waiting' | 'rotating'
        this.state = 'waiting'
        this.delayTimer = 0 // Timer for waiting phase

        // Rotation animation state
        this.visualRotation = 0 // Current visual rotation in radians
        this.targetRotation = 0 // Target rotation to animate toward
        this.startRotation = 0 // Starting rotation for animation
        this.rotationAngle = 0 // Rotation amount for current animation (+/- PI/2)
        this.isRotating = false // Currently animating rotation
        this.rotationAnimDuration = 200 // Animation duration (ms)
        this.rotationAnimTimer = 0 // Animation progress timer
    }

    /**
     * Update shooter state machine: waiting -> rotating -> fire.
     * @param {number} delta - Time elapsed since last frame in ms
     * @returns {Object} Object with bullets array and rotationStarted flag
     */
    update(delta) {
        const bulletsToSpawn = []
        let rotationStarted = false

        if (this.state === 'waiting') {
            this.delayTimer += delta
            if (this.delayTimer >= this.delay) {
                this.delayTimer = 0
                if (this.rotationDirection) {
                    // Has rotation - start animation
                    rotationStarted = this.startRotationAnimation()
                    this.state = 'rotating'
                } else {
                    // No rotation - fire immediately
                    for (const arm of this.arms) {
                        bulletsToSpawn.push(this.getBulletSpawnInfo(arm))
                    }
                }
            }
        } else if (this.state === 'rotating') {
            const complete = this.updateRotationAnimation(delta)
            if (complete) {
                this.state = 'waiting'
                // Fire all arms
                for (const arm of this.arms) {
                    bulletsToSpawn.push(this.getBulletSpawnInfo(arm))
                }
            }
        }

        return { bullets: bulletsToSpawn, rotationStarted }
    }

    /**
     * Start 90-degree rotation animation in configured direction.
     * @returns {boolean} True (rotation started)
     */
    startRotationAnimation() {
        this.startRotation = this.visualRotation
        this.rotationAngle = this.rotationDirection === 'counterclockwise' ? -Math.PI / 2 : Math.PI / 2
        this.targetRotation = this.visualRotation + this.rotationAngle
        this.isRotating = true
        this.rotationAnimTimer = 0
        return true
    }

    /**
     * Update rotation animation progress.
     * @param {number} delta - Time elapsed since last frame in ms
     * @returns {boolean} True if animation completed this frame
     */
    updateRotationAnimation(delta) {
        this.rotationAnimTimer += delta
        const progress = Math.min(this.rotationAnimTimer / this.rotationAnimDuration, 1)
        // Ease-out for smooth stop
        const eased = 1 - Math.pow(1 - progress, 2)
        this.visualRotation = this.startRotation + this.rotationAngle * eased

        if (progress >= 1) {
            this.visualRotation = this.targetRotation
            this.isRotating = false
            return true
        }
        return false
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
        const rotatedDir = this.rotateVector(baseDir.row, baseDir.col, this.visualRotation)

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
        // Handle zero vector
        if (x === 0 && y === 0) {
            return { dirRow: 0, dirCol: 0 }
        }
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
        return this.visualRotation
    }

    /**
     * Get array of arm directions for rendering.
     * @returns {string[]} Array of direction keys ('left', 'right', 'up', 'down')
     */
    getActiveDirections() {
        return this.arms
    }
}
