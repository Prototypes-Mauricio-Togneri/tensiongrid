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
        this.type = config.type    // Power-up type (e.g., 'fast')
        this.grid = grid           // Grid reference

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x   // World X coordinate
        this.y = pos.y   // World Y coordinate

        const powerUpConfig = Constants.game.powerUp[this.type]
        this.size = powerUpConfig.size                       // Size in pixels
        this.speedMultiplier = powerUpConfig.speedMultiplier // Speed multiplier for fast type
        this.duration = powerUpConfig.duration               // Effect duration in ms

        this.collected = false   // Whether power-up has been collected
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

    /**
     * Get the effect data for this power-up type.
     * @returns {Object} Effect data with type-specific properties
     */
    getEffect() {
        return {
            type: this.type,
            speedMultiplier: this.speedMultiplier,
            duration: this.duration
        }
    }

    /**
     * Get current world position.
     * @returns {Vector2} Position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }
}
