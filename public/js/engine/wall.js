/**
 * Static wall that blocks movement to nodes along its path.
 * Walls are purely visual and movement-blocking; they do not damage the player.
 */
class Wall {
    /**
     * @param {Grid} grid - Grid instance for position calculations
     * @param {Object} config - Wall configuration from level data
     */
    constructor(grid, config) {
        this.grid = grid
        this.fromX = config.from.x  // Start node column
        this.fromY = config.from.y  // Start node row
        this.toX = config.to.x      // End node column
        this.toY = config.to.y      // End node row
    }

    /**
     * Check if a node lies on this wall's path.
     * Uses line segment intersection to determine if node is on the wall.
     * @param {number} row - Node row
     * @param {number} col - Node column
     * @returns {boolean} True if node is on the wall
     */
    containsNode(row, col) {
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
