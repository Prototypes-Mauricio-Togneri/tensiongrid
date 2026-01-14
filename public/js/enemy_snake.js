/**
 * Snake enemy that moves along a cyclical path with body segments following the head.
 * Head moves like EnemyPatrol; body segments follow the exact trail the head traveled.
 */
class EnemySnake {
    /**
     * @param {Object} config - Snake configuration from level data
     * @param {Grid} grid - Grid instance for position calculations
     */
    constructor(config, grid) {
        this.grid = grid                                          // Grid reference
        this.path = config.path                                   // Array of {x, y} node coordinates
        this.speed = config.speed                                 // Movement speed in pixels/second
        this.maxLength = config.length                            // Maximum number of segments (including head)
        this.size = Constants.game.enemies.snake.size             // Segment size in pixels
        this.segmentSpacing = Constants.game.enemies.snake.segmentSpacing // Distance between segments

        this.pathIndex = 0                                        // Current position index in path array
        this.row = config.path[0].y                               // Current head grid row
        this.col = config.path[0].x                               // Current head grid column

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x                                            // Current head world X position
        this.y = pos.y                                            // Current head world Y position

        this.positionHistory = [{ x: pos.x, y: pos.y }]           // Trail of head positions
        this.historyDistances = [0]                               // Cumulative distance at each history point
        this.totalDistance = 0                                    // Total distance head has traveled
        this.currentLength = 1                                    // Current segment count (grows over time)
    }

    /**
     * Update snake head position along path and manage position history.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        const prevX = this.x
        const prevY = this.y

        // Move head using same logic as EnemyPatrol
        const moveAmount = this.speed * delta / 1000
        const nextIndex = (this.pathIndex + 1) % this.path.length
        const targetNode = this.path[nextIndex]
        const target = this.grid.getNodePosition(targetNode.y, targetNode.x)
        const current = new Vector2(this.x, this.y)
        const distance = Vector2.distance(current, target)

        if (distance < moveAmount) {
            // Snap to target and advance path index
            this.x = target.x
            this.y = target.y
            this.row = targetNode.y
            this.col = targetNode.x
            this.pathIndex = nextIndex
        } else {
            // Interpolate toward target
            const dir = Vector2.direction(current, target)
            this.x += dir.x * moveAmount
            this.y += dir.y * moveAmount
        }

        // Calculate distance moved this frame
        const movedDistance = Vector2.distance(
            new Vector2(prevX, prevY),
            new Vector2(this.x, this.y)
        )

        // Add to position history if head moved
        if (movedDistance > 0.1) {
            this.totalDistance += movedDistance
            this.positionHistory.push({ x: this.x, y: this.y })
            this.historyDistances.push(this.totalDistance)
        }

        // Grow snake until max length reached
        const requiredDistance = this.currentLength * this.segmentSpacing
        if (this.currentLength < this.maxLength && this.totalDistance >= requiredDistance) {
            this.currentLength++
        }

        // Prune old history entries no longer needed for tail
        this.pruneHistory()
    }

    /**
     * Remove history entries that are too old to be needed by any segment.
     * Keeps enough history to position the tail segment.
     */
    pruneHistory() {
        // Calculate minimum distance needed for tail segment
        const tailDistance = this.totalDistance - (this.currentLength - 1) * this.segmentSpacing
        const minRequiredDistance = tailDistance - this.segmentSpacing // Buffer

        // Find first history index still needed
        let pruneIndex = 0
        while (pruneIndex < this.historyDistances.length - 1 &&
               this.historyDistances[pruneIndex + 1] < minRequiredDistance) {
            pruneIndex++
        }

        // Remove entries before pruneIndex (keep at least 2 entries)
        if (pruneIndex > 0 && this.positionHistory.length > 2) {
            this.positionHistory.splice(0, pruneIndex)
            this.historyDistances.splice(0, pruneIndex)
        }
    }

    /**
     * Calculate world positions for all segments (head + body).
     * @returns {Array<{x: number, y: number}>} Array of segment positions, head first
     */
    getSegmentPositions() {
        const positions = []

        // Head is always at current position
        positions.push({ x: this.x, y: this.y })

        // Calculate body segment positions by looking back in history
        for (let i = 1; i < this.currentLength; i++) {
            const targetDistance = this.totalDistance - (i * this.segmentSpacing)
            const pos = this.getPositionAtDistance(targetDistance)
            positions.push(pos)
        }

        return positions
    }

    /**
     * Find the position along the history trail at a specific cumulative distance.
     * Interpolates between history points for smooth positioning.
     * @param {number} targetDistance - Cumulative distance from start
     * @returns {{x: number, y: number}} Interpolated position
     */
    getPositionAtDistance(targetDistance) {
        // Clamp to valid range
        if (targetDistance <= this.historyDistances[0]) {
            return { x: this.positionHistory[0].x, y: this.positionHistory[0].y }
        }
        if (targetDistance >= this.historyDistances[this.historyDistances.length - 1]) {
            const last = this.positionHistory[this.positionHistory.length - 1]
            return { x: last.x, y: last.y }
        }

        // Binary search for the two history points bracketing targetDistance
        let low = 0
        let high = this.historyDistances.length - 1

        while (high - low > 1) {
            const mid = Math.floor((low + high) / 2)
            if (this.historyDistances[mid] <= targetDistance) {
                low = mid
            } else {
                high = mid
            }
        }

        // Interpolate between history[low] and history[high]
        const d1 = this.historyDistances[low]
        const d2 = this.historyDistances[high]
        const t = (targetDistance - d1) / (d2 - d1)

        const p1 = this.positionHistory[low]
        const p2 = this.positionHistory[high]

        return {
            x: p1.x + (p2.x - p1.x) * t,
            y: p1.y + (p2.y - p1.y) * t
        }
    }

    /**
     * Get grid positions (row, col) for all segments for collision detection.
     * @returns {Array<{row: number, col: number}>} Array of segment grid positions
     */
    getSegmentGridPositions() {
        const worldPositions = this.getSegmentPositions()
        return worldPositions.map(pos => {
            // Convert world position back to nearest grid cell
            const col = Math.round(pos.x / this.grid.cellSize)
            const row = Math.round(pos.y / this.grid.cellSize)
            return { row, col }
        })
    }

    /**
     * Get head world position (for compatibility with other enemy patterns).
     * @returns {Vector2} Head position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }
}
