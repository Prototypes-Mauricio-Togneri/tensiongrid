/**
 * Static mine enemy that detonates after player contact.
 * Dormant until touched, then counts down and fires bullets in all directions.
 */
class EnemyMine {
    // State constants
    static STATE_DORMANT = 'dormant'
    static STATE_TRIGGERED = 'triggered'
    static STATE_EXPLODED = 'exploded'

    /**
     * @param {Object} config - Mine configuration from level data
     * @param {Grid} grid - Grid instance for position calculation
     */
    constructor(config, grid) {
        this.row = config.y // Grid row position
        this.col = config.x // Grid column position
        this.grid = grid // Grid reference
        this.delay = config.delay // Detonation delay in ms (mandatory)

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x // World X coordinate
        this.y = pos.y // World Y coordinate
        this.size = Constants.game.enemies.mine.size // Mine size in pixels

        this.state = EnemyMine.STATE_DORMANT
        this.timer = 0 // Time elapsed since triggered
        this.ttl = config.ttl // Time to live in ms (undefined for permanent)
    }

    /**
     * Check if mine is dormant (waiting for player contact).
     * @returns {boolean} True if mine has not been triggered
     */
    isDormant() {
        return this.state === EnemyMine.STATE_DORMANT
    }

    /**
     * Check if mine is triggered (counting down).
     * @returns {boolean} True if mine is in countdown state
     */
    isTriggered() {
        return this.state === EnemyMine.STATE_TRIGGERED
    }

    /**
     * Check if mine has exploded.
     * @returns {boolean} True if mine has detonated
     */
    isExploded() {
        return this.state === EnemyMine.STATE_EXPLODED
    }

    /**
     * Trigger the mine countdown when player touches it.
     */
    trigger() {
        if (this.state === EnemyMine.STATE_DORMANT) {
            this.state = EnemyMine.STATE_TRIGGERED
            this.timer = 0
        }
    }

    /**
     * Update mine countdown timer and TTL.
     * @param {number} delta - Time elapsed since last frame in ms
     * @returns {boolean} True if mine just exploded this frame
     */
    update(delta) {
        // Decrement TTL if set and mine hasn't exploded
        if (this.ttl !== undefined && this.state !== EnemyMine.STATE_EXPLODED) {
            this.ttl -= delta
        }

        if (this.state !== EnemyMine.STATE_TRIGGERED) return false

        this.timer += delta
        if (this.timer >= this.delay) {
            this.state = EnemyMine.STATE_EXPLODED
            return true // Signal explosion occurred
        }
        return false
    }

    /**
     * Check if mine has expired (TTL reached zero).
     * @returns {boolean} True if mine should be removed
     */
    isExpired() {
        return this.ttl !== undefined && this.ttl <= 0
    }

    /**
     * Get blink intensity for rendering (0-1, faster as detonation approaches).
     * @returns {number} Blink intensity multiplier
     */
    getBlinkIntensity() {
        if (this.state !== EnemyMine.STATE_TRIGGERED) return 1

        const config = Constants.game.enemies.mine

        // Calculate progress toward detonation (0 to 1)
        const progress = this.timer / this.delay

        // Blink frequency increases as progress approaches 1
        const frequency = config.blinkFrequencyStart + progress * config.blinkFrequencyRange
        const blinkCycle = Math.sin(this.timer * frequency * 0.01 * Math.PI * 2)

        // Return min to max range (never fully invisible)
        const center = (config.blinkIntensityMin + config.blinkIntensityMax) / 2
        const amplitude = (config.blinkIntensityMax - config.blinkIntensityMin) / 2
        return center + amplitude * blinkCycle
    }

    /**
     * Get all valid directions from this mine's node for bullet spawning.
     * @returns {Array} Array of {dirRow, dirCol} objects for valid edges
     */
    getValidDirections() {
        const directions = []
        const dirs = Constants.directions

        for (const key of Object.keys(dirs)) {
            if (key === 'none') continue

            const dir = dirs[key]
            const targetRow = this.row + dir.row
            const targetCol = this.col + dir.col

            // Check if target node is valid and edge is not excluded
            if (this.grid.isValidPosition(targetRow, targetCol) &&
                !this.grid.isEdgeExcluded(this.row, this.col, targetRow, targetCol)) {
                directions.push({ dirRow: dir.row, dirCol: dir.col })
            }
        }
        return directions
    }

    /**
     * Get current world position.
     * @returns {Vector2} Position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }
}
