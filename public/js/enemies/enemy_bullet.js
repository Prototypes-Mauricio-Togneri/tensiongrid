/**
 * Enemy bullet that travels along grid edges in a straight line.
 * Stops when reaching grid boundary or an excluded edge.
 */
class EnemyBullet {
    /**
     * @param {number} row - Starting grid row
     * @param {number} col - Starting grid column
     * @param {number} x - Starting world X position
     * @param {number} y - Starting world Y position
     * @param {number} dirRow - Row direction (-1, 0, or 1)
     * @param {number} dirCol - Column direction (-1, 0, or 1)
     * @param {Grid} grid - Grid instance for position/validity checks
     * @param {number} [speed] - Movement speed in pixels/second (optional, defaults to constant)
     */
    constructor(row, col, x, y, dirRow, dirCol, grid, speed) {
        this.row = row // Current grid row
        this.col = col // Current grid column
        this.x = x // Current world X position
        this.y = y // Current world Y position
        this.targetRow = row + dirRow // Target grid row for current move
        this.targetCol = col + dirCol // Target grid column for current move
        this.dirRow = dirRow // Row direction for movement
        this.dirCol = dirCol // Column direction for movement
        this.speed = speed ?? Constants.game.enemies.bullet.speed // Movement speed in pixels/second
        this.size = Constants.game.enemies.bullet.size // Bullet size in pixels
        this.grid = grid // Grid reference
        this.isMoving = true // False when bullet should be removed

        this.movement = new GridMovement(grid)
        this.wake = new WakeTrail(x, y, Constants.game.animations.wakeTrail.fast)
    }

    /**
     * Update bullet position along grid edge.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @returns {boolean} False if bullet should be removed (hit boundary)
     */
    update(delta) {
        if (!this.isMoving) return true

        const result = this.movement.update(delta, this.speed, this.x, this.y, this.targetRow, this.targetCol)
        this.x = result.x
        this.y = result.y

        if (result.arrived) {
            this.row = this.targetRow
            this.col = this.targetCol

            const nextRow = this.row + this.dirRow
            const nextCol = this.col + this.dirCol

            // Check if next position is valid and edge is not excluded
            if (this.grid.isValidPosition(nextRow, nextCol) && !this.grid.isEdgeExcluded(this.row, this.col, nextRow, nextCol)) {
                this.targetRow = nextRow
                this.targetCol = nextCol
            } else {
                return false // Remove bullet at boundary
            }
        } else {
            this.wake.update(delta, true, this.speed, this.x, this.y, result.dirX, result.dirY)
        }

        return true
    }

    /**
     * Get current world position.
     * @returns {Vector2} Current x/y position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }

    // Wake trail property getters for renderer compatibility
    get wakeIntensity() { return this.wake.intensity }
    get wakeStartX() { return this.wake.startX }
    get wakeStartY() { return this.wake.startY }
}
