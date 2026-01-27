/**
 * Patrol enemy that follows a cyclical path along grid nodes.
 * Moves with smooth interpolation between nodes, killing player on contact.
 */
class EnemyPatrol {
    /**
     * @param {Object} config - Patrol configuration from level data
     * @param {Grid} grid - Grid instance for position calculations
     */
    constructor(config, grid) {
        this.grid = grid // Grid reference
        this.path = config.path // Array of {x, y} node coordinates
        this.speed = config.speed // Movement speed in pixels/second
        this.size = Constants.game.enemies.patrol.size // Patrol size in pixels

        this.pathIndex = 0 // Current position index in path array
        this.row = config.path[0].y // Current grid row (y in config = row)
        this.col = config.path[0].x // Current grid column (x in config = col)

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x // Current world X position
        this.y = pos.y // Current world Y position

        this.wake = new WakeTrail(pos.x, pos.y, Constants.game.animations.wakeTrail.slow)
    }

    /**
     * Update patrol position along path with smooth interpolation.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        const moveAmount = this.speed * delta / 1000

        // Get next target in cyclical path
        const nextIndex = (this.pathIndex + 1) % this.path.length
        const targetNode = this.path[nextIndex]
        const target = this.grid.getNodePosition(targetNode.y, targetNode.x)
        const current = new Vector2(this.x, this.y)
        const distance = Vector2.distance(current, target)

        // Reached target node, advance to next in cycle
        if (distance < moveAmount) {
            this.x = target.x
            this.y = target.y
            this.row = targetNode.y
            this.col = targetNode.x
            this.pathIndex = nextIndex

            // Reset wake at waypoint
            this.wake.reset(this.x, this.y)
        } else {
            // Interpolate toward target
            const dir = Vector2.direction(current, target)
            this.x += dir.x * moveAmount
            this.y += dir.y * moveAmount
            this.wake.update(delta, true, this.x, this.y, dir.x, dir.y)
        }
    }

    /**
     * Get current world position.
     * @returns {Vector2} Position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }

    // Wake trail property getters for renderer compatibility
    get wakeIntensity() { return this.wake.intensity }
    get wakeStartX() { return this.wake.startX }
    get wakeStartY() { return this.wake.startY }
}
