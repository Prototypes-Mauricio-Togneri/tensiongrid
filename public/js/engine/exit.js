/**
 * Exit portal entity that allows player to complete the level.
 * Sits at a grid position with pulsing glow border effect.
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
        this.pulsePhase = 0
    }

    /**
     * Update pulse animation.
     * Creates breathing glow effect.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        this.pulsePhase += Constants.game.exit.pulseSpeed * delta
    }

    /**
     * Get current pulse intensity (0-1 range).
     * @returns {number} Current intensity based on sine wave oscillation
     */
    getPulseIntensity() {
        const { pulseMin, pulseMax } = Constants.game.exit
        const range = pulseMax - pulseMin
        return pulseMin + range * (0.5 + 0.5 * Math.sin(this.pulsePhase))
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

    /**
     * Get glow color based on open/closed state.
     * @returns {string} Color hex string with alpha from Constants
     */
    getGlowColor() {
        return this.isOpen
            ? Constants.game.colors.exitOpenGlow
            : Constants.game.colors.exitClosedGlow
    }
}
