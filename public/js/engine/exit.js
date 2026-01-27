/**
 * Exit portal entity that allows player to complete the level.
 * Sits at a grid position with flickering neon border segments.
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
        this.segments = this.initSegments()
    }

    /**
     * Initialize flickering border segments.
     * Each segment has independent phase and speed for varied flicker timing.
     * @returns {Array} Array of segment objects
     */
    initSegments() {
        const count = Constants.game.exit.segmentCount
        const segments = []
        const baseSpeed = Constants.game.exit.flickerSpeed

        for (let i = 0; i < count; i++) {
            segments.push({
                startAngle: (Math.PI * 2 * i) / count,
                endAngle: (Math.PI * 2 * (i + 1)) / count,
                phase: Math.random() * Math.PI * 2,
                speed: baseSpeed * (0.7 + Math.random() * 0.6)
            })
        }
        return segments
    }

    /**
     * Update segment flicker animation.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        for (const seg of this.segments) {
            seg.phase += seg.speed * delta
        }
    }

    /**
     * Get segment visibility states for rendering.
     * @returns {Array} Array of segment objects with visibility data
     */
    getSegments() {
        const threshold = Constants.game.exit.flickerThreshold
        return this.segments.map(seg => ({
            startAngle: seg.startAngle,
            endAngle: seg.endAngle,
            intensity: Math.max(0, (Math.sin(seg.phase) + 1) / 2),
            visible: Math.sin(seg.phase) > -threshold
        }))
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
