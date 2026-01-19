/**
 * Static laser beam that spans between two grid nodes.
 * Can be persistent or intermittent (cycling on/off).
 */
class EnemyLaser {
    /**
     * @param {Grid} grid - Grid instance for position calculations
     * @param {Object} config - Laser configuration from level data
     */
    constructor(grid, config) {
        this.grid = grid          // Grid reference
        this.startX = config.startX // Start node column
        this.startY = config.startY // Start node row
        this.endX = config.endX     // End node column
        this.endY = config.endY     // End node row

        this.timeOn = config.timeOn   // Time active in ms (undefined for persistent)
        this.timeOff = config.timeOff // Time inactive in ms (undefined for persistent)
        this.active = true            // Whether laser is currently dangerous
        this.timer = 0                // Time elapsed in current state

        // Glow intensity for visual transitions
        const laserConfig = Constants.game.enemies.laser
        this.glowIntensity = laserConfig.glowMax // Start at max since laser starts active
        this.glowMin = laserConfig.glowMin
        this.glowMax = laserConfig.glowMax
        this.glowSpeed = laserConfig.glowTransitionSpeed
    }

    /**
     * Check if laser has intermittent on/off behavior.
     * @returns {boolean} True if laser cycles on and off
     */
    isIntermittent() {
        return this.timeOn !== undefined && this.timeOff !== undefined
    }

    /**
     * Check if laser is currently active (dangerous).
     * @returns {boolean} True if laser can damage player
     */
    isActive() {
        return this.active
    }

    /**
     * Update intermittent laser state and glow transitions.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        // Update glow intensity based on active state
        if (this.active) {
            // Ramp up to max when active
            if (this.glowIntensity < this.glowMax) {
                this.glowIntensity = Math.min(this.glowMax, this.glowIntensity + this.glowSpeed * delta)
            }
        } else {
            // Ramp down to min when inactive
            if (this.glowIntensity > this.glowMin) {
                this.glowIntensity = Math.max(this.glowMin, this.glowIntensity - this.glowSpeed * delta)
            }
        }

        if (!this.isIntermittent()) return

        this.timer += delta

        // Toggle state when timer exceeds duration
        if (this.active) {
            if (this.timer >= this.timeOn) {
                this.active = false
                this.timer = 0
            }
        } else {
            if (this.timer >= this.timeOff) {
                this.active = true
                this.timer = 0
            }
        }
    }

    /**
     * Check if a grid node falls within the laser's line segment.
     * Only supports horizontal and vertical lasers.
     * @param {number} row - Grid row to check
     * @param {number} col - Grid column to check
     * @returns {boolean} True if node is on the laser path
     */
    containsNode(row, col) {
        const minX = Math.min(this.startX, this.endX)
        const maxX = Math.max(this.startX, this.endX)
        const minY = Math.min(this.startY, this.endY)
        const maxY = Math.max(this.startY, this.endY)

        // Horizontal laser
        if (this.startY === this.endY) {
            return row === this.startY && col >= minX && col <= maxX
        }

        // Vertical laser
        if (this.startX === this.endX) {
            return col === this.startX && row >= minY && row <= maxY
        }

        return false
    }

    /**
     * Get world positions of laser endpoints.
     * @returns {Object} Object with start and end Vector2 positions
     */
    getWorldPositions() {
        const start = this.grid.getNodePosition(this.startY, this.startX)
        const end = this.grid.getNodePosition(this.endY, this.endX)
        return { start, end }
    }
}
