/**
 * Enemy that actively follows the player by moving toward the best adjacent node.
 * Calculates shortest path to player at each node, choosing the adjacent node
 * that minimizes distance to player.
 */
class EnemyFollower {
    /**
     * @param {Object} config - Follower configuration from level data
     * @param {Grid} grid - Grid instance for position calculations
     */
    constructor(config, grid) {
        this.grid = grid // Grid reference
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

        this.wakeIntensity = 0 // Wake trail opacity (0-1)
        this.wakeStartX = pos.x // Wake trail start X position
        this.wakeStartY = pos.y // Wake trail start Y position

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

        const moveAmount = this.speed * delta / 1000

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

        // Interpolate toward target node
        const target = this.grid.getNodePosition(this.targetRow, this.targetCol)
        const current = new Vector2(this.x, this.y)
        const distance = Vector2.distance(current, target)

        if (distance < moveAmount) {
            // Reached target node
            this.x = target.x
            this.y = target.y
            this.row = this.targetRow
            this.col = this.targetCol
            this.isMoving = false

            // Reset wake at waypoint
            this.wakeStartX = this.x
            this.wakeStartY = this.y
            this.wakeIntensity = 0
        } else {
            // Continue interpolating
            const dir = Vector2.direction(current, target)
            this.x += dir.x * moveAmount
            this.y += dir.y * moveAmount
            this.wakeIntensity = Math.min(1, this.wakeIntensity + delta * 0.005)

            // Position wake trail behind follower
            const trailDistance = 50
            this.wakeStartX = this.x - dir.x * trailDistance
            this.wakeStartY = this.y - dir.y * trailDistance
        }
    }

    /**
     * Find the best adjacent node that minimizes distance to player.
     * Validates that target node and edge are not excluded.
     * @returns {Object|null} Best adjacent node {row, col} or null if all blocked
     */
    pickBestAdjacentNode() {
        const directions = [
            Constants.directions.up,
            Constants.directions.down,
            Constants.directions.left,
            Constants.directions.right
        ]

        const playerPos = this.grid.getNodePosition(this.playerRow, this.playerCol)
        let bestNode = null
        let bestDistance = Infinity

        for (const dir of directions) {
            const candidateRow = this.row + dir.row
            const candidateCol = this.col + dir.col

            // Skip if target node is invalid (out of bounds or excluded)
            if (!this.grid.isValidPosition(candidateRow, candidateCol)) continue

            // Skip if edge to target is excluded
            if (this.grid.isEdgeExcluded(this.row, this.col, candidateRow, candidateCol)) continue

            // Calculate distance from candidate to player
            const candidatePos = this.grid.getNodePosition(candidateRow, candidateCol)
            const distToPlayer = Vector2.distance(candidatePos, playerPos)

            if (distToPlayer < bestDistance) {
                bestDistance = distToPlayer
                bestNode = { row: candidateRow, col: candidateCol }
            }
        }

        return bestNode
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
}
