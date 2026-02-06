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
        this.grid = grid // Grid reference
        this.startX = config.startX // Start node column
        this.startY = config.startY // Start node row
        this.endX = config.endX // End node column
        this.endY = config.endY // End node row

        const laserConfig = Constants.game.enemies.laser
        this.state = new IntermittentState({
            timeOn: config.timeOn,
            timeOff: config.timeOff,
            intensityMin: laserConfig.glowMin,
            intensityMax: laserConfig.glowMax,
            transitionSpeed: laserConfig.glowTransitionSpeed,
            activeThreshold: laserConfig.activeThreshold
        })
    }

    /**
     * Check if laser has intermittent on/off behavior.
     * @returns {boolean} True if laser cycles on and off
     */
    isIntermittent() {
        return this.state.isIntermittent()
    }

    /**
     * Check if laser is currently active (dangerous).
     * @returns {boolean} True if laser can damage player
     */
    isActive() {
        return this.state.isActive()
    }

    /**
     * Update intermittent laser state and glow transitions.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        this.state.update(delta)
    }

    // Glow intensity getter for renderer compatibility
    get glowIntensity() { return this.state.intensity }

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
