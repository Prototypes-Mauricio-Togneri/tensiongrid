/**
 * Visual effect for particle explosions.
 * Particles scatter outward from a center point with eased motion.
 * Used by player death and mine explosion animations.
 */
class ParticleExplosion {
    /**
     * @param {number} x - Center X position in world coordinates
     * @param {number} y - Center Y position in world coordinates
     * @param {Object} config - Animation configuration
     * @param {number} config.particleCount - Number of particles
     * @param {number} config.particleSize - Size of each particle in pixels
     * @param {number} config.endRadius - Final scatter radius in pixels
     * @param {number} config.duration - Animation duration in milliseconds
     */
    constructor(x, y, config) {
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
