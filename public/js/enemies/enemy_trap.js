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

        this.timeOn = config.timeOn // Time active in ms (undefined for persistent)
        this.timeOff = config.timeOff // Time inactive in ms (undefined for persistent)
        this.active = true // Whether trap is currently dangerous
        this.timer = 0 // Time elapsed in current state
        this.ttl = config.ttl // Time to live in ms (undefined for permanent)

        // Opacity for visual transitions
        const trapConfig = Constants.game.enemies.trap
        this.opacity = trapConfig.opacityMax // Start at max since trap starts active
        this.opacityMin = trapConfig.opacityMin
        this.opacityMax = trapConfig.opacityMax
        this.opacitySpeed = trapConfig.opacityTransitionSpeed
    }

    /**
     * Check if trap has intermittent on/off behavior.
     * @returns {boolean} True if trap cycles on and off
     */
    isIntermittent() {
        return this.timeOn !== undefined && this.timeOff !== undefined
    }

    /**
     * Check if trap is currently active (dangerous).
     * @returns {boolean} True if trap can damage player
     */
    isActive() {
        return this.active
    }

    /**
     * Update intermittent trap state, opacity transitions, and TTL countdown.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        // Decrement TTL if set
        if (this.ttl !== undefined) {
            this.ttl -= delta
        }

        // Update opacity based on active state
        if (this.active) {
            // Ramp up to max when active
            if (this.opacity < this.opacityMax) {
                this.opacity = Math.min(this.opacityMax, this.opacity + this.opacitySpeed * delta)
            }
        } else {
            // Ramp down to min when inactive
            if (this.opacity > this.opacityMin) {
                this.opacity = Math.max(this.opacityMin, this.opacity - this.opacitySpeed * delta)
            }
        }

        if (!this.isIntermittent()) return

        this.timer += delta

        // Toggle state when timer exceeds duration
        if (this.active) {
            if (this.timer >= this.timeOn) {
                this.active = false
                this.timer = 0
            }
        } else {
            if (this.timer >= this.timeOff) {
                this.active = true
                this.timer = 0
            }
        }
    }

    /**
     * Check if trap has expired (TTL reached zero).
     * @returns {boolean} True if trap should be removed
     */
    isExpired() {
        return this.ttl !== undefined && this.ttl <= 0
    }

    /**
     * Get current world position.
     * @returns {Vector2} Position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }
}
