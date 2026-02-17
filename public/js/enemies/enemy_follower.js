/**
 * Enemy that actively follows the player using BFS shortest path.
 * At each node, finds the shortest grid path to the player and takes the first step.
 */
class EnemyFollower {
    /**
     * @param {Object} config - Follower configuration from level data
     * @param {Grid} grid - Grid instance for position calculations
     * @param {Wall[]} walls - Active walls that block movement
     */
    constructor(config, grid, walls) {
        this.id = config.id || null // Optional element id for switch targeting
        this.grid = grid // Grid reference
        this.walls = walls // Walls that block pathfinding
        this.speed = config.speed // Movement speed in pixels/second
        this.size = Constants.game.enemies.follower.size // Follower size in pixels
        this.rotationSpeed = Constants.game.enemies.follower.rotationSpeed // Rotation speed in radians/second

        this.row = config.startY // Current grid row (y in config = row)
        this.col = config.startX // Current grid column (x in config = col)
        this.targetRow = this.row // Target grid row for current move
        this.targetCol = this.col // Target grid column for current move

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x // Current world X position
        this.y = pos.y // Current world Y position

        this.isMoving = false // True while interpolating to target
        this.rotation = 0 // Current rotation angle in radians

        this.movement = new GridMovement(grid)
        this.wake = new WakeTrail(pos.x, pos.y, Constants.game.animations.wakeTrail.slow)

        this.playerRow = 0 // Cached player row for pathfinding
        this.playerCol = 0 // Cached player column for pathfinding
    }

    /**
     * Update follower position, moving toward player.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @param {number} playerRow - Current player grid row
     * @param {number} playerCol - Current player grid column
     */
    update(delta, playerRow, playerCol) {
        // Cache player position for pathfinding
        this.playerRow = playerRow
        this.playerCol = playerCol

        // Continuous rotation
        this.rotation += this.rotationSpeed * delta / 1000

        // If not moving, calculate next best adjacent node
        if (!this.isMoving) {
            const nextNode = this.pickBestAdjacentNode()
            if (nextNode) {
                this.targetRow = nextNode.row
                this.targetCol = nextNode.col
                this.isMoving = true
            }
            // If nextNode is null, all adjacent nodes blocked - stay in place
            return
        }

        const result = this.movement.update(delta, this.speed, this.x, this.y, this.targetRow, this.targetCol)
        this.x = result.x
        this.y = result.y

        if (result.arrived) {
            this.row = this.targetRow
            this.col = this.targetCol
            this.isMoving = false
            this.wake.reset(this.x, this.y)
        } else {
            this.wake.update(delta, true, this.speed, this.x, this.y, result.dirX, result.dirY)
        }
    }

    /**
     * Find the best adjacent node using BFS shortest path to player.
     * Validates that nodes and edges are not excluded.
     * @returns {Object|null} First step toward player {row, col} or null if unreachable
     */
    pickBestAdjacentNode() {
        // Already at player position
        if (this.row === this.playerRow && this.col === this.playerCol) return null

        const directions = [
            Constants.directions.up,
            Constants.directions.down,
            Constants.directions.left,
            Constants.directions.right
        ]

        // BFS from follower to player
        const startKey = `${this.row},${this.col}`
        const queue = [{ row: this.row, col: this.col }]
        const cameFrom = new Map() // "row,col" -> { row, col } of predecessor
        cameFrom.set(startKey, null)

        while (queue.length > 0) {
            const current = queue.shift()

            // Goal reached - trace back to find first step
            if (current.row === this.playerRow && current.col === this.playerCol) {
                let step = current
                let parent = cameFrom.get(`${step.row},${step.col}`)
                while (parent.row !== this.row || parent.col !== this.col) {
                    step = parent
                    parent = cameFrom.get(`${step.row},${step.col}`)
                }
                return { row: step.row, col: step.col }
            }

            for (const dir of directions) {
                const neighborRow = current.row + dir.row
                const neighborCol = current.col + dir.col
                const neighborKey = `${neighborRow},${neighborCol}`

                if (cameFrom.has(neighborKey)) continue
                if (!this.grid.isValidPosition(neighborRow, neighborCol)) continue
                if (this.grid.isEdgeExcluded(current.row, current.col, neighborRow, neighborCol)) continue
                if (this.isNodeBlockedByWall(neighborRow, neighborCol)) continue

                cameFrom.set(neighborKey, { row: current.row, col: current.col })
                queue.push({ row: neighborRow, col: neighborCol })
            }
        }

        // Player unreachable
        return null
    }

    /**
     * Check if any wall blocks a target node.
     * @param {number} row - Target row
     * @param {number} col - Target column
     * @returns {boolean} True if a wall blocks this node
     */
    isNodeBlockedByWall(row, col) {
        for (const wall of this.walls) {
            if (wall.containsNode(row, col)) {
                return true
            }
        }
        return false
    }

    /**
     * Get current world position.
     * @returns {Vector2} Position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }

    /**
     * Get current rotation angle.
     * @returns {number} Rotation in radians
     */
    getRotation() {
        return this.rotation
    }

    // Wake trail property getters for renderer compatibility
    get wakeIntensity() { return this.wake.intensity }
    get wakeStartX() { return this.wake.startX }
    get wakeStartY() { return this.wake.startY }
}
