/**
 * Visual effect for power-up/power-down collection.
 * Single expanding ring that fades out as it grows.
 */
class CollectionWaveAnimation {
    /**
     * @param {number} x - Center X position in world coordinates
     * @param {number} y - Center Y position in world coordinates
     * @param {string} color - Wave color (hex string)
     */
    constructor(x, y, color) {
        const config = Constants.game.animations.collectionWave
        this.x = x
        this.y = y
        this.color = color
        this.startRadius = config.startRadius
        this.endRadius = config.endRadius
        this.duration = config.duration
        this.lineWidth = config.lineWidth
        this.elapsed = 0
    }

    /**
     * Update wave animation.
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
     * Get current wave data for rendering.
     * @returns {Object} Wave data {radius, opacity}
     */
    getWaveData() {
        const progress = this.getProgress()
        // Ease-out for smooth expansion that slows at the end
        const eased = 1 - Math.pow(1 - progress, 2)
        const radius = this.startRadius + (this.endRadius - this.startRadius) * eased
        // Fade out as wave expands
        const opacity = 1 - progress
        return { radius, opacity }
    }

    /**
     * Get center position in world coordinates.
     * @returns {Object} Position {x, y}
     */
    getPosition() {
        return { x: this.x, y: this.y }
    }

    /**
     * Get wave color.
     * @returns {string} Hex color string
     */
    getColor() {
        return this.color
    }
}
