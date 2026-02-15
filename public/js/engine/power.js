/**
 * Collectible power entity that grants temporary effects to the player.
 * Sits at a grid position and is collected on player contact.
 * Can be positive (power-up) or negative (power-down) based on isNegative flag.
 */
class Power {
    /**
     * @param {Object} config - Power configuration from level data
     * @param {Grid} grid - Grid instance for position calculation
     * @param {boolean} isNegative - True for power-downs, false for power-ups
     */
    constructor(config, grid, isNegative = false) {
        this.row = config.y        // Grid row position
        this.col = config.x        // Grid column position
        this.type = config.type    // Power type (e.g., 'fast', 'shield', 'slow')
        this.ttl = config.ttl      // Effect duration in ms (from level data)
        this.isNegative = isNegative // True for power-downs

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x             // World X coordinate
        this.y = pos.y             // World Y coordinate

        this.size = Constants.game.powers.size  // Size in pixels
        this.collected = false     // Whether power has been collected
    }

    /**
     * Mark power as collected.
     */
    collect() {
        this.collected = true
    }

    /**
     * Check if power has been collected.
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
