/**
 * Visual effect for mine explosion.
 * Yellow square particles that scatter outward from the mine position.
 */
class MineExplosionAnimation {
    /**
     * @param {number} x - Center X position in world coordinates
     * @param {number} y - Center Y position in world coordinates
     */
    constructor(x, y) {
        const config = Constants.game.animations.mineExplosion
        this.x = x
        this.y = y
        this.particleSize = config.particleSize
        this.duration = config.duration
        this.endRadius = config.endRadius
        this.elapsed = 0

        // Initialize particles with random angles and staggered delays
        this.particles = []
        for (let i = 0; i < config.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2
            const distance = this.endRadius * (0.5 + Math.random() * 0.5)
            this.particles.push({
                endX: Math.cos(angle) * distance,
                endY: Math.sin(angle) * distance,
                // Add slight variation to scatter timing
                delay: Math.random() * 0.2
            })
        }
    }

    /**
     * Update explosion animation.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        this.elapsed += delta
    }

    /**
     * Check if animation has completed.
     * @returns {boolean} True if effect has finished
     */
    isComplete() {
        return this.elapsed >= this.duration
    }

    /**
     * Get current animation progress (0 to 1).
     * @returns {number} Progress value
     */
    getProgress() {
        return Math.min(this.elapsed / this.duration, 1)
    }

    /**
     * Get particle data for rendering.
     * @returns {Object[]} Array of {x, y, opacity} relative to center
     */
    getParticles() {
        const progress = this.getProgress()
        const result = []

        for (const particle of this.particles) {
            // Adjust progress based on particle's delay
            const adjustedProgress = Math.max(0, (progress - particle.delay) / (1 - particle.delay))

            // Ease out for smooth deceleration (fast start, slow end)
            const eased = 1 - Math.pow(1 - adjustedProgress, 2)

            // Interpolate from center to end position
            const x = particle.endX * eased
            const y = particle.endY * eased

            // Fade out as particles scatter
            const opacity = 1 - adjustedProgress

            result.push({ x, y, opacity })
        }

        return result
    }

    /**
     * Get center position in world coordinates.
     * @returns {Object} Position {x, y}
     */
    getPosition() {
        return { x: this.x, y: this.y }
    }
}
