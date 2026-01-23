/**
 * Manages active effects on a target entity.
 * Handles effect lifecycle, stacking, and state queries.
 */
class EffectManager {
    /**
     * @param {Object} target - The entity effects apply to (player, enemy, etc.)
     */
    constructor(target) {
        this.target = target
        this.effects = new Map()
    }

    /**
     * Add a new effect, handling stacking rules.
     * @param {string} type - Effect type from EffectTypes
     * @param {Object} config - Effect configuration from Constants.effects
     * @returns {Effect|null} The created effect, or null if type is invalid
     */
    addEffect(type, config) {
        const typeInfo = EffectTypes[type]
        if (!typeInfo) return null

        // Handle stack groups - remove any effect in same group
        if (typeInfo.stackGroup) {
            for (const [existingType, existingEffect] of this.effects) {
                const existingInfo = EffectTypes[existingType]
                if (existingInfo.stackGroup === typeInfo.stackGroup) {
                    this.removeEffect(existingType)
                }
            }
        }

        const effect = new Effect(type, config)
        this.effects.set(type, effect)
        typeInfo.apply(this.target, effect)

        return effect
    }

    /**
     * Remove an effect by type.
     * @param {string} type - Effect type to remove
     */
    removeEffect(type) {
        const effect = this.effects.get(type)
        if (!effect) return

        const typeInfo = EffectTypes[type]
        typeInfo.remove(this.target, effect)
        this.effects.delete(type)
    }

    /**
     * Update all active effects, removing expired ones.
     * @param {number} delta - Time elapsed in milliseconds
     * @returns {string[]} Array of effect types that expired this frame
     */
    update(delta) {
        const expired = []

        for (const [type, effect] of this.effects) {
            if (effect.update(delta)) {
                expired.push(type)
            }
        }

        for (const type of expired) {
            this.removeEffect(type)
        }

        return expired
    }

    /**
     * Check if a specific effect is active.
     * @param {string} type - Effect type to check
     * @returns {boolean} True if effect is active
     */
    hasEffect(type) {
        return this.effects.has(type)
    }

    /**
     * Get active effect by type.
     * @param {string} type - Effect type
     * @returns {Effect|null} Active effect or null
     */
    getEffect(type) {
        return this.effects.get(type) || null
    }

    /**
     * Handle collision - check if any effect absorbs it.
     * @returns {boolean} True if collision was absorbed
     */
    handleCollision() {
        for (const [type, effect] of this.effects) {
            const typeInfo = EffectTypes[type]
            if (typeInfo.onHit) {
                if (typeInfo.onHit(this.target, effect, this)) {
                    return true
                }
            }
        }
        return false
    }

    /**
     * Get render hints for all active effects.
     * @returns {Object} Combined render data
     */
    getRenderHints() {
        const hints = {
            glowColor: null,
            glowColorAlpha: null,
            showShield: false,
            blink: false,
            blinkFrequency: null
        }

        // Apply hints from all active effects
        // Later effects override earlier ones (shield/immunity take priority over speed)
        for (const [type, effect] of this.effects) {
            const typeInfo = EffectTypes[type]
            if (typeInfo.renderHint) {
                Object.assign(hints, typeInfo.renderHint)
                // If effect has blink in renderHint, grab its frequency
                if (typeInfo.renderHint.blink && effect.config.blinkFrequency) {
                    hints.blinkFrequency = effect.config.blinkFrequency
                }
            }

            // Check if effect is about to expire and has warning configured
            if (effect.config.warningDuration && effect.remaining <= effect.config.warningDuration) {
                hints.blink = true
                if (effect.config.blinkFrequency) {
                    hints.blinkFrequency = effect.config.blinkFrequency
                }
            }
        }

        return hints
    }

    /**
     * Clear all effects (on death/reset).
     */
    clear() {
        for (const type of [...this.effects.keys()]) {
            this.removeEffect(type)
        }
    }
}
