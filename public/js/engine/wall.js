/**
 * Static wall that blocks movement to nodes along its path.
 * Walls are purely visual and movement-blocking; they do not damage the player.
 * Can be toggled by switches via open()/close().
 */
class Wall {
    /**
     * @param {Grid} grid - Grid instance for position calculations
     * @param {Object} config - Wall configuration from level data
     */
    constructor(grid, config) {
        this.id = config.id || null // Optional element id for switch targeting
        this.grid = grid
        this.fromX = config.from.x  // Start node column
        this.fromY = config.from.y  // Start node row
        this.toX = config.to.x      // End node column
        this.toY = config.to.y      // End node row
        this.active = true           // Whether wall blocks movement
        this._opacity = 1.0          // Current visual opacity
    }

    /**
     * Disable the wall (called by switch system).
     * @param {number} _ttl - Time to live in ms (managed by switch, unused here)
     */
    open(_ttl) {
        this.active = false
    }

    /**
     * Re-enable the wall (called when switch TTL expires).
     */
    close() {
        this.active = true
    }

    /**
     * Update opacity transitions for smooth visual feedback.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        const wallConfig = Constants.game.enemies.wall
        const target = this.active ? 1.0 : wallConfig.opacityMin
        const speed = wallConfig.opacityTransitionSpeed
        if (this._opacity < target) {
            this._opacity = Math.min(target, this._opacity + speed * delta)
        } else if (this._opacity > target) {
            this._opacity = Math.max(target, this._opacity - speed * delta)
        }
    }

    /** Opacity getter for renderer compatibility. */
    get opacity() { return this._opacity }

    /**
     * Check if a node lies on this wall's path.
     * Returns false when wall is inactive (deactivated by switch).
     * Uses line segment intersection to determine if node is on the wall.
     * @param {number} row - Node row
     * @param {number} col - Node column
     * @returns {boolean} True if node is on the wall and wall is active
     */
    containsNode(row, col) {
        if (!this.active) return false

        // Check if point (col, row) lies on line segment from (fromX, fromY) to (toX, toY)
        const x1 = this.fromX
        const y1 = this.fromY
        const x2 = this.toX
        const y2 = this.toY

        // Check if point is collinear with the line segment
        const crossProduct = (col - x1) * (y2 - y1) - (row - y1) * (x2 - x1)
        if (crossProduct !== 0) return false

        // Check if point is within the bounding box of the segment
        const minX = Math.min(x1, x2)
        const maxX = Math.max(x1, x2)
        const minY = Math.min(y1, y2)
        const maxY = Math.max(y1, y2)

        return col >= minX && col <= maxX && row >= minY && row <= maxY
    }

    /**
     * Get world positions of wall endpoints.
     * @returns {Object} Object with start and end Vector2 positions
     */
    getWorldPositions() {
        return {
            start: this.grid.getNodePosition(this.fromY, this.fromX),
            end: this.grid.getNodePosition(this.toY, this.toX)
        }
    }
}
