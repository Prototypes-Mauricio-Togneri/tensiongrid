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

        // Handle trap spawning
        if (this.trapInterval !== undefined) {
            this.trapTimer += delta
            if (this.trapTimer >= this.trapInterval) {
                this.trapTimer = 0
                const spawnNode = this.getSpawnNode()
                spawnRequests.push({ type: 'trap', row: spawnNode.row, col: spawnNode.col })
            }
        }

        // Handle mine spawning
        if (this.mineInterval !== undefined) {
            this.mineTimer += delta
            if (this.mineTimer >= this.mineInterval) {
                this.mineTimer = 0
                const spawnNode = this.getSpawnNode()
                spawnRequests.push({ type: 'mine', row: spawnNode.row, col: spawnNode.col })
            }
        }

        return spawnRequests
    }

    /**
     * Get the node two positions ahead in the cyclical path for spawning.
     * @returns {Object} Node coordinates {row, col}
     */
    getSpawnNode() {
        const spawnIndex = (this.pathIndex + 2) % this.path.length
        const node = this.path[spawnIndex]
        return { row: node.y, col: node.x }
    }

    /**
     * Get current world position.
     * @returns {Vector2} Position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }
}
