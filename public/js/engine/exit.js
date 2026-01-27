/**
 * Exit portal entity that allows player to complete the level.
 * Sits at a grid position with pulsing glow border and orbiting particles.
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
        this.particles = this.initParticles()
    }

    /**
     * Initialize orbiting particles with varied orbit radii and speeds.
     * @returns {Array} Array of particle objects
     */
    initParticles() {
        const { particleCount, particleOrbitMin, particleOrbitMax, particleSpeedMin, particleSpeedMax } = Constants.game.exit
        const particles = []
        const orbitRange = particleOrbitMax - particleOrbitMin
        const speedRange = particleSpeedMax - particleSpeedMin

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                angle: Math.random() * Math.PI * 2,
                radius: particleOrbitMin + Math.random() * orbitRange,
                speed: particleSpeedMin + Math.random() * speedRange
            })
        }
        return particles
    }

    /**
     * Update pulse and particle animations.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        this.pulsePhase += Constants.game.exit.pulseSpeed * delta

        // Update orbiting particles
        for (const p of this.particles) {
            p.angle += p.speed * delta
        }
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
     * Get particle positions for rendering.
     * @returns {Array} Array of particle objects with x, y offsets, angle, and radius
     */
    getParticles() {
        return this.particles.map(p => ({
            x: Math.cos(p.angle) * p.radius,
            y: Math.sin(p.angle) * p.radius,
            angle: p.angle,
            radius: p.radius
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
