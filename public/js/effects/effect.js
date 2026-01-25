/**
 * Represents an active effect on a target entity.
 * Effects are data objects managed by EffectManager.
 */
class Effect {
    /**
     * @param {string} type - Effect type identifier from Constants.game.effects.X.type
     * @param {Object} config - Effect configuration from Constants.effects
     */
    constructor(type, config) {
        this.type = type                 // Effect type identifier
        this.duration = config.duration  // Total duration in ms
        this.remaining = config.duration // Time remaining in ms
        this.config = config             // Original config object
        this.expired = false             // Whether effect has expired
    }

    /**
     * Update effect timer.
     * @param {number} delta - Time elapsed in milliseconds
     * @returns {boolean} True if effect just expired this frame
     */
    update(delta) {
        if (this.expired) return false

        this.remaining -= delta
        if (this.remaining <= 0) {
            this.remaining = 0
            this.expired = true
            return true
        }
        return false
    }
}
