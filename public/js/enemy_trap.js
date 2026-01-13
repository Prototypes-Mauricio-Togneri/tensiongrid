/**
 * Static trap enemy that occupies a single grid node.
 * Kills player on contact but allows other entities to pass through.
 */
class EnemyTrap {
    /**
     * @param {number} row - Grid row position
     * @param {number} col - Grid column position
     * @param {Grid} grid - Grid instance for position calculation
     */
    constructor(row, col, grid) {
        this.row = row   // Grid row position
        this.col = col   // Grid column position
        this.grid = grid // Grid reference

        const pos = grid.getNodePosition(row, col)
        this.x = pos.x   // World X coordinate
        this.y = pos.y   // World Y coordinate
        this.size = Constants.game.enemies.trap.size // Trap size in pixels
    }

    /**
     * Get current world position.
     * @returns {Vector2} Position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }
}
