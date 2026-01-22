/**
 * Collectible power-down entity that applies temporary negative effects to the player.
 * Sits at a grid position and is collected on player contact.
 */
class PowerDown {
    /**
     * @param {Object} config - Power-down configuration from level data
     * @param {Grid} grid - Grid instance for position calculation
     */
    constructor(config, grid) {
        this.row = config.y        // Grid row position
        this.col = config.x        // Grid column position
        this.type = config.type    // Power-down type (e.g., 'slow')

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x             // World X coordinate
        this.y = pos.y             // World Y coordinate

        this.size = Constants.game.powers.size  // Size in pixels
        this.collected = false     // Whether power-down has been collected
    }

    /**
     * Mark power-down as collected.
     */
    collect() {
        this.collected = true
    }

    /**
     * Check if power-down has been collected.
     * @returns {boolean} True if collected
     */
    isCollected() {
        return this.collected
    }
}
