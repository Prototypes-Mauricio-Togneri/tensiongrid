/**
 * Collectible power-up entity that grants temporary effects to the player.
 * Sits at a grid position and is collected on player contact.
 */
class PowerUp {
    /**
     * @param {Object} config - Power-up configuration from level data
     * @param {Grid} grid - Grid instance for position calculation
     */
    constructor(config, grid) {
        this.row = config.y        // Grid row position
        this.col = config.x        // Grid column position
        this.type = config.type    // Power-up type (e.g., 'fast', 'shield')

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x             // World X coordinate
        this.y = pos.y             // World Y coordinate

        this.size = Constants.game.powers.size  // Size in pixels
        this.collected = false     // Whether power-up has been collected
    }

    /**
     * Mark power-up as collected.
     */
    collect() {
        this.collected = true
    }

    /**
     * Check if power-up has been collected.
     * @returns {boolean} True if collected
     */
    isCollected() {
        return this.collected
    }
}
