/**
 * Exit portal entity that allows player to complete the level.
 * Sits at a grid position with animated electric border effect.
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
        this.particles = this.initParticles()
    }

    /**
     * Initialize electric border particles evenly distributed around the circle.
     * Each particle has a phase offset for varied animation timing.
     * @returns {Array} Array of particle objects
     */
    initParticles() {
        const count = Constants.game.exit.particleCount
        const particles = []
        for (let i = 0; i < count; i++) {
            particles.push({
                angle: (Math.PI * 2 * i) / count,
                offset: 0,
                speed: Constants.game.exit.particleSpeed * (0.5 + Math.random() * 0.5),
                phase: Math.random() * Math.PI * 2
            })
        }
        return particles
    }

    /**
     * Update particle animation.
     * Creates oscillating radial movement for the sparky effect.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        const amplitude = Constants.game.exit.particleAmplitude
        for (const p of this.particles) {
            p.phase += p.speed * delta
            p.offset = Math.sin(p.phase) * amplitude
        }
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
     * Get particle data for rendering.
     * @returns {Array} Array of particle objects with angle, offset properties
     */
    getParticles() {
        return this.particles
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
