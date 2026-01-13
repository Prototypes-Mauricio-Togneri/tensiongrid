/**
 * Camera system that follows the player and handles coordinate transforms.
 * Keeps the grid visible with configurable padding and centers small grids.
 */
class Camera {
    /**
     * @param {Grid} grid - Grid instance for boundary calculations
     */
    constructor(grid) {
        this.grid = grid              // Grid reference for bounds
        this.x = 0                    // Camera center X in world space
        this.y = 0                    // Camera center Y in world space
        this.viewportWidth = 800      // Canvas width in pixels
        this.viewportHeight = 600     // Canvas height in pixels
        this.padding = 60             // Minimum padding from grid edge to viewport edge
    }

    /**
     * Update viewport dimensions (called on canvas resize).
     * @param {number} width - New viewport width
     * @param {number} height - New viewport height
     */
    setViewport(width, height) {
        this.viewportWidth = width
        this.viewportHeight = height
    }

    /**
     * Center camera on target position and clamp to grid bounds.
     * @param {number} targetX - Target X position in world space
     * @param {number} targetY - Target Y position in world space
     */
    follow(targetX, targetY) {
        this.x = targetX
        this.y = targetY
        this.clamp()
    }

    /**
     * Constrain camera position to keep grid visible with padding.
     * Centers the grid if it fits within the viewport.
     */
    clamp() {
        const grid = this.grid
        const halfWidth = this.viewportWidth / 2
        const halfHeight = this.viewportHeight / 2

        // Grid bounds in world space
        const gridLeft = 0
        const gridRight = (grid.width - 1) * grid.cellSize
        const gridTop = 0
        const gridBottom = (grid.height - 1) * grid.cellSize

        const gridWidth = gridRight - gridLeft
        const gridHeight = gridBottom - gridTop

        // Available viewport space (minus padding on both sides)
        const availableWidth = this.viewportWidth - this.padding * 2
        const availableHeight = this.viewportHeight - this.padding * 2

        // Center grid if it fits, otherwise clamp with padding
        if (gridWidth <= availableWidth) {
            this.x = gridLeft + gridWidth / 2
        } else {
            const minX = gridLeft - this.padding + halfWidth
            const maxX = gridRight + this.padding - halfWidth
            this.x = Math.max(minX, Math.min(maxX, this.x))
        }

        if (gridHeight <= availableHeight) {
            this.y = gridTop + gridHeight / 2
        } else {
            const minY = gridTop - this.padding + halfHeight
            const maxY = gridBottom + this.padding - halfHeight
            this.y = Math.max(minY, Math.min(maxY, this.y))
        }
    }

    /**
     * Transform world coordinates to screen coordinates.
     * @param {number} worldX - X position in world space
     * @param {number} worldY - Y position in world space
     * @returns {Object} Screen coordinates {x, y}
     */
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x + this.viewportWidth / 2,
            y: worldY - this.y + this.viewportHeight / 2
        }
    }
}
