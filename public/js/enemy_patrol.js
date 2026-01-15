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
        this.grid = grid                                      // Grid reference
        this.path = config.path                               // Array of {x, y} node coordinates
        this.speed = config.speed                             // Movement speed in pixels/second
        this.size = Constants.game.enemies.patrol.size        // Patrol size in pixels

        this.pathIndex = 0                                    // Current position index in path array
        this.row = config.path[0].y                           // Current grid row (y in config = row)
        this.col = config.path[0].x                           // Current grid column (x in config = col)

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x                                        // Current world X position
        this.y = pos.y                                        // Current world Y position

        this.wakeIntensity = 0                                // Wake trail opacity (0-1)
        this.wakeStartX = pos.x                               // Wake trail start X position
        this.wakeStartY = pos.y                               // Wake trail start Y position

        this.trapInterval = config.trap                       // Trap spawn interval in ms (optional)
        this.mineInterval = config.mine                       // Mine spawn interval in ms (optional)
        this.trapTimer = 0                                    // Time since last trap spawn
        this.mineTimer = 0                                    // Time since last mine spawn
        this.pendingTrapIndex = null                          // Path index where trap will spawn (null if none)
        this.pendingMineIndex = null                          // Path index where mine will spawn (null if none)
    }

    /**
     * Update patrol position along path with smooth interpolation.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @returns {Array} Array of spawn requests {type: 'trap'|'mine', row, col}
     */
    update(delta) {
        const spawnRequests = []
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

            // Spawn pending trap/mine when arriving at marked node
            if (this.pendingTrapIndex === this.pathIndex) {
                const node = this.path[this.pathIndex]
                spawnRequests.push({ type: 'trap', row: node.y, col: node.x })
                this.pendingTrapIndex = null
            }
            if (this.pendingMineIndex === this.pathIndex) {
                const node = this.path[this.pathIndex]
                spawnRequests.push({ type: 'mine', row: node.y, col: node.x })
                this.pendingMineIndex = null
            }

            // Reset wake at waypoint
            this.wakeStartX = this.x
            this.wakeStartY = this.y
            this.wakeIntensity = 0
        } else {
            // Interpolate toward target
            const dir = Vector2.direction(current, target)
            this.x += dir.x * moveAmount
            this.y += dir.y * moveAmount
            this.wakeIntensity = Math.min(1, this.wakeIntensity + delta * 0.005)

            // Position wake trail behind patrol
            const trailDistance = 50
            this.wakeStartX = this.x - dir.x * trailDistance
            this.wakeStartY = this.y - dir.y * trailDistance
        }

        // Handle trap timer - mark next node for spawn when interval reached
        if (this.trapInterval !== undefined) {
            this.trapTimer += delta
            if (this.trapTimer >= this.trapInterval && this.pendingTrapIndex === null) {
                this.trapTimer = 0
                this.pendingTrapIndex = (this.pathIndex + 1) % this.path.length
            }
        }

        // Handle mine timer - mark next node for spawn when interval reached
        if (this.mineInterval !== undefined) {
            this.mineTimer += delta
            if (this.mineTimer >= this.mineInterval && this.pendingMineIndex === null) {
                this.mineTimer = 0
                this.pendingMineIndex = (this.pathIndex + 1) % this.path.length
            }
        }

        return spawnRequests
    }

    /**
     * Get current world position.
     * @returns {Vector2} Position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }
}
