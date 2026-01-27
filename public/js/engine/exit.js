/**
 * Exit portal entity that allows player to complete the level.
 * Features a tunnel animation with shrinking rings that create depth illusion.
 * Can be open (green) or closed (red) based on level configuration.
 */
class Exit {
    /**
     * @param {Object} config - Exit configuration from level data
     * @param {number} config.x - Grid column position
     * @param {number} config.y - Grid row position
     * @param {string} config.status - Portal state ('open' or 'closed')
     * @param {Grid} grid - Grid instance for position calculation
     */
    constructor(config, grid) {
        this.row = config.y
        this.col = config.x
        this.isOpen = config.status === 'open'

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x
        this.y = pos.y

        this.size = Constants.game.exit.size
        this.rings = []      // Array of active shrinking rings
        this.spawnTimer = 0  // Timer for spawning new rings
    }

    /**
     * Update ring spawning and animation.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        const { ringSpawnInterval, ringSpeed } = Constants.game.exit

        // Spawn new ring every interval
        this.spawnTimer += delta
        if (this.spawnTimer >= ringSpawnInterval) {
            this.spawnTimer = 0
            this.rings.push({ radius: this.size })
        }

        // Update existing rings (shrink toward center)
        for (const ring of this.rings) {
            ring.radius -= ringSpeed * delta
        }

        // Remove rings that reached center
        this.rings = this.rings.filter(ring => ring.radius > 0)
    }

    /**
     * Get active shrinking rings for rendering.
     * @returns {Array} Array of ring objects with radius property
     */
    getRings() {
        return this.rings
    }

    /**
     * Check if exit is open and player can complete the level.
     * @returns {boolean} True if exit is open
     */
    canExit() {
        return this.isOpen
    }

    /**
     * Get current world position.
     * @returns {Vector2} Position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }

    /**
     * Get border color based on open/closed state.
     * @returns {string} Color hex string from Constants
     */
    getBorderColor() {
        return this.isOpen
            ? Constants.game.colors.exitOpen
            : Constants.game.colors.exitClosed
    }
}
