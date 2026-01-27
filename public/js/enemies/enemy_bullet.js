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
     */
    constructor(row, col, x, y, dirRow, dirCol, grid) {
        this.row = row // Current grid row
        this.col = col // Current grid column
        this.x = x // Current world X position
        this.y = y // Current world Y position
        this.targetRow = row + dirRow // Target grid row for current move
        this.targetCol = col + dirCol // Target grid column for current move
        this.dirRow = dirRow // Row direction for movement
        this.dirCol = dirCol // Column direction for movement
        this.speed = Constants.game.enemies.bullet.speed // Movement speed in pixels/second
        this.size = Constants.game.enemies.bullet.size // Bullet size in pixels
        this.grid = grid // Grid reference
        this.isMoving = true // False when bullet should be removed

        this.wake = new WakeTrail(x, y, Constants.game.animations.wakeTrail.fast)
    }

    /**
     * Update bullet position along grid edge.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @returns {boolean} False if bullet should be removed (hit boundary)
     */
    update(delta) {
        if (!this.isMoving) return true

        const moveAmount = this.speed * delta / 1000
        const target = this.grid.getNodePosition(this.targetRow, this.targetCol)
        const current = new Vector2(this.x, this.y)
        const distance = Vector2.distance(current, target)

        // Reached target node, try to continue
        if (distance < moveAmount) {
            this.x = target.x
            this.y = target.y
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
            // Interpolate toward target
            const dir = Vector2.direction(current, target)
            this.x += dir.x * moveAmount
            this.y += dir.y * moveAmount
            this.wake.update(delta, true, this.x, this.y, dir.x, dir.y)
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
