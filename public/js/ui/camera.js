/**
 * Camera system that follows the player and handles coordinate transforms.
 * Keeps the grid visible with configurable padding and centers small grids.
 * Supports zoom for effects like zoom power-down (reduced visibility).
 */
class Camera {
    /**
     * @param {Grid} grid - Grid instance for boundary calculations
     */
    constructor(grid) {
        this.grid = grid          // Grid reference for bounds
        this.x = 0                // Camera center X in world space
        this.y = 0                // Camera center Y in world space
        this.viewportWidth = 800  // Canvas width in pixels
        this.viewportHeight = 600 // Canvas height in pixels
        this.padding = 60         // Minimum padding from grid edge to viewport edge
        this.zoom = 1             // Current zoom level (1 = normal, >1 = zoomed in)
        this.targetZoom = 1       // Target zoom for smooth transition
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
     * Set target zoom level for smooth transition.
     * @param {number} target - Target zoom level (1 = normal)
     */
    setTargetZoom(target) {
        this.targetZoom = target
    }

    /**
     * Update zoom interpolation toward target.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @param {number} speed - Exponential lerp factor per ms
     */
    update(delta, speed) {
        if (this.zoom !== this.targetZoom) {
            const t = 1 - Math.pow(1 - speed, delta)
            this.zoom += (this.targetZoom - this.zoom) * t
            if (Math.abs(this.zoom - this.targetZoom) < 0.01) {
                this.zoom = this.targetZoom
            }
        }
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
     * Accounts for zoom level when calculating visible area.
     */
    clamp() {
        const grid = this.grid
        const effectiveWidth = this.viewportWidth / this.zoom
        const effectiveHeight = this.viewportHeight / this.zoom
        const halfWidth = effectiveWidth / 2
        const halfHeight = effectiveHeight / 2

        // Grid bounds in world space
        const gridLeft = 0
        const gridRight = (grid.width - 1) * grid.cellSize
        const gridTop = 0
        const gridBottom = (grid.height - 1) * grid.cellSize

        const gridWidth = gridRight - gridLeft
        const gridHeight = gridBottom - gridTop

        // Available viewport space (minus padding on both sides)
        const availableWidth = effectiveWidth - this.padding * 2
        const availableHeight = effectiveHeight - this.padding * 2

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
     * Accounts for zoom level in the transform.
     * @param {number} worldX - X position in world space
     * @param {number} worldY - Y position in world space
     * @returns {Object} Screen coordinates {x, y}
     */
    worldToScreen(worldX, worldY) {
        const effectiveWidth = this.viewportWidth / this.zoom
        const effectiveHeight = this.viewportHeight / this.zoom
        return {
            x: worldX - this.x + effectiveWidth / 2,
            y: worldY - this.y + effectiveHeight / 2
        }
    }
}
