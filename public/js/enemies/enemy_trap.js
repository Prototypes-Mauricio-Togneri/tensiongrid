/**
 * Static trap enemy that occupies a single grid node.
 * Kills player on contact but allows other entities to pass through.
 * Can be persistent or intermittent (cycling on/off).
 */
class EnemyTrap {
    /**
     * @param {Object} config - Trap configuration from level data
     * @param {Grid} grid - Grid instance for position calculation
     */
    constructor(config, grid) {
        this.row = config.y // Grid row position
        this.col = config.x // Grid column position
        this.grid = grid // Grid reference

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x // World X coordinate
        this.y = pos.y // World Y coordinate
        this.size = Constants.game.enemies.trap.size // Trap size in pixels

        const trapConfig = Constants.game.enemies.trap
        this.state = new IntermittentState({
            timeOn: config.timeOn,
            timeOff: config.timeOff,
            intensityMin: trapConfig.opacityMin,
            intensityMax: trapConfig.opacityMax,
            transitionSpeed: trapConfig.opacityTransitionSpeed
        })
    }

    /**
     * Check if trap has intermittent on/off behavior.
     * @returns {boolean} True if trap cycles on and off
     */
    isIntermittent() {
        return this.state.isIntermittent()
    }

    /**
     * Check if trap is currently active (dangerous).
     * @returns {boolean} True if trap can damage player
     */
    isActive() {
        return this.state.isActive()
    }

    /**
     * Update intermittent trap state and opacity transitions.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        this.state.update(delta)
    }

    // Opacity getter for renderer compatibility
    get opacity() { return this.state.intensity }

    /**
     * Get current world position.
     * @returns {Vector2} Position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }
}
