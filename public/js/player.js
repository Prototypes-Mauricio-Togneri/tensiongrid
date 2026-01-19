/**
 * Player entity controlled by keyboard input.
 * Moves between grid nodes with smooth interpolation and trailing wake effect.
 */
class Player {
    /**
     * @param {Grid} grid - Grid instance for position calculations
     * @param {Object} config - Player configuration from Constants
     */
    constructor(grid, config) {
        this.grid = grid              // Grid instance for position calculations
        this.size = config.size       // Player size in pixels
        this.baseSpeed = config.speed // Base movement speed in pixels/second
        this.speed = config.speed     // Current movement speed (affected by boosts)
        this.startY = config.startY   // Starting grid row
        this.startX = config.startX   // Starting grid column

        this.wakeIntensity = 0        // Wake trail opacity (0-1)
        this.wakeStartX = 0           // Wake trail start X position
        this.wakeStartY = 0           // Wake trail start Y position

        this.speedMultiplier = 1      // Current speed multiplier (1 = normal)
        this.speedBoostTimer = 0      // Time remaining on speed boost in ms

        this.reset()
    }

    /**
     * Reset player to starting position and clear movement state.
     */
    reset() {
        this.row = this.startY        // Current grid row
        this.col = this.startX        // Current grid column
        this.targetRow = this.startY  // Target grid row for movement
        this.targetCol = this.startX  // Target grid column for movement

        const pos = this.grid.getNodePosition(this.row, this.col)
        this.x = pos.x                // Current world X position
        this.y = pos.y                // Current world Y position

        this.isMoving = false         // True while interpolating to target
        this.teleported = false       // True if last move was a teleport

        this.wakeIntensity = 0
        this.wakeStartX = pos.x
        this.wakeStartY = pos.y

        // Clear speed boost state
        this.speedMultiplier = 1
        this.speedBoostTimer = 0
        this.speed = this.baseSpeed
    }

    /**
     * Update player position with smooth interpolation toward target.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @returns {boolean} True if speed boost expired this frame
     */
    update(delta) {
        let boostExpired = false

        // Update speed boost timer
        if (this.speedBoostTimer > 0) {
            this.speedBoostTimer -= delta
            if (this.speedBoostTimer <= 0) {
                this.speedBoostTimer = 0
                this.speedMultiplier = 1
                this.speed = this.baseSpeed
                boostExpired = true
            }
        }

        // Fade wake when stationary
        if (!this.isMoving) {
            this.wakeIntensity = Math.max(0, this.wakeIntensity - delta * 0.004)
            return boostExpired
        }

        const moveAmount = this.speed * delta / 1000
        const target = this.grid.getNodePosition(this.targetRow, this.targetCol)
        const current = new Vector2(this.x, this.y)
        const distance = Vector2.distance(current, target)

        // Snap to target if close enough, otherwise interpolate
        if (distance < moveAmount) {
            this.x = target.x
            this.y = target.y
            this.row = this.targetRow
            this.col = this.targetCol
            this.isMoving = false
        } else {
            const dir = Vector2.direction(current, target)
            this.x += dir.x * moveAmount
            this.y += dir.y * moveAmount
            this.wakeIntensity = Math.min(1, this.wakeIntensity + delta * 0.05)

            // Position wake trail behind player
            const trailDistance = 60
            this.wakeStartX = this.x - dir.x * trailDistance
            this.wakeStartY = this.y - dir.y * trailDistance
        }

        return boostExpired
    }

    /**
     * Set target position for movement or teleport instantly.
     * @param {number} targetRow - Target grid row
     * @param {number} targetCol - Target grid column
     * @param {boolean} teleport - If true, move instantly without animation
     */
    moveTo(targetRow, targetCol, teleport = false) {
        this.targetRow = targetRow
        this.targetCol = targetCol

        if (teleport) {
            const pos = this.grid.getNodePosition(targetRow, targetCol)
            this.x = pos.x
            this.y = pos.y
            this.row = targetRow
            this.col = targetCol
            this.isMoving = false
            this.teleported = true
            this.wakeIntensity = 0
            this.wakeStartX = pos.x
            this.wakeStartY = pos.y
        } else {
            this.isMoving = true
        }
    }

    /**
     * Get current world position.
     * @returns {Vector2} Current x/y position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }

    /**
     * Apply a speed boost to the player.
     * @param {number} multiplier - Speed multiplier (e.g., 2 for double speed)
     * @param {number} duration - Duration in milliseconds
     */
    applySpeedBoost(multiplier, duration) {
        this.speedMultiplier = multiplier
        this.speedBoostTimer = duration
        this.speed = this.baseSpeed * multiplier
    }

    /**
     * Check if player currently has a speed boost active.
     * @returns {boolean} True if speed boost is active
     */
    hasSpeedBoost() {
        return this.speedBoostTimer > 0
    }

    /**
     * Check if player currently has a speed slow effect active.
     * @returns {boolean} True if speed multiplier is less than 1
     */
    isSlowed() {
        return this.speedBoostTimer > 0 && this.speedMultiplier < 1
    }
}
