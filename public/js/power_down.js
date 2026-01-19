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
        this.grid = grid           // Grid reference

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x   // World X coordinate
        this.y = pos.y   // World Y coordinate

        const powerDownConfig = Constants.game.powerDown[this.type]
        this.size = powerDownConfig.size                       // Size in pixels
        this.speedMultiplier = powerDownConfig.speedMultiplier // Speed multiplier for slow type
        this.duration = powerDownConfig.duration               // Effect duration in ms

        this.collected = false   // Whether power-down has been collected
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

    /**
     * Get the effect data for this power-down type.
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
