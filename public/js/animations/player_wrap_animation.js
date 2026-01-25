/**
 * Visual effect for player wrap-around teleportation.
 * Small square particles that converge into the player position.
 */
class PlayerWrapAnimation {
    /**
     * @param {number} x - Center X position in world coordinates
     * @param {number} y - Center Y position in world coordinates
     * @param {boolean} scalePlayer - If true, player scales from 0 to 1 during animation
     */
    constructor(x, y, scalePlayer = false) {
        const config = Constants.game.animations.pixelScatter
        this.x = x
        this.y = y
        this.scalePlayer = scalePlayer
        this.particleSize = config.particleSize
        this.duration = config.duration
        this.elapsed = 0

        // Initialize particles at random positions around center
        this.particles = []
        for (let i = 0; i < config.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2
            const distance = config.spawnRadius * (0.5 + Math.random() * 0.5)
            this.particles.push({
                startX: Math.cos(angle) * distance,
                startY: Math.sin(angle) * distance,
                // Add slight variation to convergence timing
                delay: Math.random() * 0.2
            })
        }
    }

    /**
     * Update pixel scatter animation.
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

            // Ease in-out for smooth convergence
            const eased = adjustedProgress < 0.5
                ? 2 * adjustedProgress * adjustedProgress
                : 1 - Math.pow(-2 * adjustedProgress + 2, 2) / 2

            // Interpolate from start position to center
            const x = particle.startX * (1 - eased)
            const y = particle.startY * (1 - eased)

            // Fade in as particles converge, then fade out at the end
            let opacity
            if (adjustedProgress < 0.7) {
                opacity = Math.min(1, adjustedProgress / 0.3)
            } else {
                opacity = 1 - (adjustedProgress - 0.7) / 0.3
            }

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

    /**
     * Get player scale factor for spawn animations.
     * @returns {number} Scale from 0 to 1, or 1 if not a spawn animation
     */
    getPlayerScale() {
        if (!this.scalePlayer) return 1
        return this.getProgress()
    }
}
