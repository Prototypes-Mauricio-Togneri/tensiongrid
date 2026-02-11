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
        this.id = config.id || null   // Optional element id for switch targeting
        this.row = config.y
        this.col = config.x
        this.isOpen = config.status === 'open'

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x
        this.y = pos.y

        this.size = Constants.game.exit.size
        this.rings = []      // Array of active shrinking rings
        this.spawnTimer = 0  // Timer for spawning new rings

        // Timer arc state (null when not active)
        this.timerDuration = null   // Total TTL duration in ms
        this.timerRemaining = null  // Remaining time in ms
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

        // Update timer countdown
        if (this.timerRemaining !== null) {
            this.timerRemaining -= delta
            if (this.timerRemaining < 0) {
                this.timerRemaining = 0
            }
        }
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
     * Open the exit portal.
     * @param {number} [ttl] - Optional time-to-live in ms (for timer arc display)
     */
    open(ttl) {
        this.isOpen = true
        if (ttl !== undefined) {
            this.timerDuration = ttl
            this.timerRemaining = ttl
        }
    }

    /**
     * Close the exit portal.
     */
    close() {
        this.isOpen = false
        this.timerDuration = null
        this.timerRemaining = null
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

    /**
     * Get timer arc progress data for rendering.
     * @returns {Object|null} Timer data {progress, isWarning} or null if no timer
     */
    getTimerProgress() {
        if (this.timerDuration === null || this.timerRemaining === null) {
            return null
        }
        const progress = this.timerRemaining / this.timerDuration
        const { timerArcWarningThreshold } = Constants.game.exit
        return {
            progress: Math.max(0, Math.min(1, progress)),
            isWarning: progress <= timerArcWarningThreshold
        }
    }
}
