/**
 * Switch entity that temporarily unlocks a target (e.g., exit) when collected.
 * Reappears after TTL expires and the target locks again.
 */
class Switch {
    /**
     * @param {Object} config - Switch configuration from level data
     * @param {number} config.x - Grid column position
     * @param {number} config.y - Grid row position
     * @param {string} config.unlocks - Target type to unlock ('exit')
     * @param {number} config.ttl - Time to live in milliseconds
     * @param {Grid} grid - Grid instance for position calculation
     */
    constructor(config, grid) {
        this.row = config.y           // Grid row position
        this.col = config.x           // Grid column position
        this.unlocks = config.unlocks // Target type ('exit')
        this.ttl = config.ttl         // Time to live in ms

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x                // World X coordinate
        this.y = pos.y                // World Y coordinate

        this.size = Constants.game.switch.size
        this.collected = false        // Whether switch has been collected
        this.resetTimer = 0           // Countdown timer when collected
    }

    /**
     * Mark switch as collected and start reset timer.
     */
    collect() {
        this.collected = true
        this.resetTimer = this.ttl
    }

    /**
     * Update switch state.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @returns {boolean} True if switch just expired (TTL reached zero)
     */
    update(delta) {
        if (!this.collected) return false

        this.resetTimer -= delta
        if (this.resetTimer <= 0) {
            this.reset()
            return true
        }
        return false
    }

    /**
     * Reset switch to uncollected state.
     */
    reset() {
        this.collected = false
        this.resetTimer = 0
    }

    /**
     * Check if switch has been collected.
     * @returns {boolean} True if collected
     */
    isCollected() {
        return this.collected
    }

    /**
     * Get current world position.
     * @returns {Vector2} Position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }
}
