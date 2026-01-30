/**
 * Handles smooth interpolation movement between grid nodes.
 * Used by Player, EnemyBullet, EnemyPatrol, and EnemyFollower.
 */
class GridMovement {
    /**
     * @param {Grid} grid - Grid instance for position calculations
     */
    constructor(grid) {
        this.grid = grid
    }

    /**
     * Calculate interpolated movement toward a target grid node.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @param {number} speed - Movement speed in pixels/second
     * @param {number} x - Current world X position
     * @param {number} y - Current world Y position
     * @param {number} targetRow - Target grid row
     * @param {number} targetCol - Target grid column
     * @returns {Object} Movement result: { arrived, x, y, dirX, dirY }
     */
    update(delta, speed, x, y, targetRow, targetCol) {
        const moveAmount = speed * delta / 1000
        const target = this.grid.getNodePosition(targetRow, targetCol)

        const dx = target.x - x
        const dy = target.y - y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Snap to target if close enough (or already there)
        if (distance <= moveAmount || distance === 0) {
            return {
                arrived: true,
                x: target.x,
                y: target.y,
                dirX: 0,
                dirY: 0
            }
        }

        // Interpolate toward target
        const dirX = dx / distance
        const dirY = dy / distance
        return {
            arrived: false,
            x: x + dirX * moveAmount,
            y: y + dirY * moveAmount,
            dirX,
            dirY
        }
    }
}
