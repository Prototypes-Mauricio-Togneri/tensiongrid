/**
 * Manages intermittent on/off cycling behavior for hazard entities.
 * Handles state toggling and visual intensity transitions.
 * Used by EnemyLaser and EnemyTrap.
 */
class IntermittentState {
    /**
     * @param {Object} config - Intermittent state configuration
     * @param {number} [config.timeOn] - Time active in ms (undefined for persistent)
     * @param {number} [config.timeOff] - Time inactive in ms (undefined for persistent)
     * @param {number} config.intensityMin - Minimum visual intensity (inactive state)
     * @param {number} config.intensityMax - Maximum visual intensity (active state)
     * @param {number} config.transitionSpeed - Intensity change per ms
     */
    constructor(config) {
        this.timeOn = config.timeOn       // Time active in ms (undefined for persistent)
        this.timeOff = config.timeOff     // Time inactive in ms (undefined for persistent)
        this.active = true                // Whether currently dangerous
        this.timer = 0                    // Time elapsed in current state

        // Visual intensity for transitions
        this.intensity = config.intensityMax
        this.intensityMin = config.intensityMin
        this.intensityMax = config.intensityMax
        this.transitionSpeed = config.transitionSpeed
        this.activeThreshold = config.activeThreshold ?? config.intensityMin // Intensity required to be dangerous
    }

    /**
     * Check if entity has intermittent on/off behavior.
     * @returns {boolean} True if entity cycles on and off
     */
    isIntermittent() {
        return this.timeOn !== undefined && this.timeOff !== undefined
    }

    /**
     * Check if entity is currently active (dangerous).
     * @returns {boolean} True if entity can damage player
     */
    isActive() {
        return this.active && this.intensity >= this.activeThreshold
    }

    /**
     * Update state toggle and visual intensity transitions.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        // Update intensity based on active state
        if (this.active) {
            // Ramp up to max when active
            if (this.intensity < this.intensityMax) {
                this.intensity = Math.min(this.intensityMax, this.intensity + this.transitionSpeed * delta)
            }
        } else {
            // Ramp down to min when inactive
            if (this.intensity > this.intensityMin) {
                this.intensity = Math.max(this.intensityMin, this.intensity - this.transitionSpeed * delta)
            }
        }

        if (!this.isIntermittent()) return

        this.timer += delta

        // Toggle state when timer exceeds duration
        if (this.active) {
            if (this.timer >= this.timeOn) {
                this.active = false
                this.timer = 0
            }
        } else {
            if (this.timer >= this.timeOff) {
                this.active = true
                this.timer = 0
            }
        }
    }
}
