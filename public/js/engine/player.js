/**
 * Player entity controlled by keyboard input.
 * Moves between grid nodes with smooth interpolation and trailing wake effect.
 */
class Player {
    /**
     * @param {Grid} grid - Grid instance for position calculations
     * @param {Object} config - Player configuration from Constants
     */
    constructor(grid, config) {
        this.grid = grid              // Grid instance for position calculations
        this.size = config.size       // Player size in pixels
        this.baseSpeed = config.speed // Base movement speed in pixels/second
        this.speed = config.speed     // Current movement speed (affected by boosts)
        this.startY = config.startY   // Starting grid row
        this.startX = config.startX   // Starting grid column

        this.wake = new WakeTrail(0, 0, Constants.game.animations.wakeTrail.fast)

        this.movement = new GridMovement(grid)
        this.effectManager = new EffectManager(this)

        this.reset()
    }

    /**
     * Reset player to starting position and clear movement state.
     */
    reset() {
        this.row = this.startY        // Current grid row
        this.col = this.startX        // Current grid column
        this.targetRow = this.startY  // Target grid row for movement
        this.targetCol = this.startX  // Target grid column for movement

        const pos = this.grid.getNodePosition(this.row, this.col)
        this.x = pos.x                // Current world X position
        this.y = pos.y                // Current world Y position

        this.isMoving = false         // True while interpolating to target
        this.teleported = false       // True if last move was a teleport

        this.wake.reset(pos.x, pos.y)

        // Clear all active effects and reset speed
        this.effectManager.clear()
        this.speed = this.baseSpeed
    }

    /**
     * Update player position with smooth interpolation toward target.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @returns {string[]} Array of effect types that expired this frame
     */
    update(delta) {
        const expiredEffects = this.effectManager.update(delta)

        // Fade wake when stationary
        if (!this.isMoving) {
            this.wake.update(delta, false, 0, this.x, this.y, 0, 0)
            return expiredEffects
        }

        const result = this.movement.update(delta, this.speed, this.x, this.y, this.targetRow, this.targetCol)
        this.x = result.x
        this.y = result.y

        if (result.arrived) {
            this.row = this.targetRow
            this.col = this.targetCol
            this.isMoving = false
        } else {
            this.wake.update(delta, true, this.speed, this.x, this.y, result.dirX, result.dirY)
        }

        return expiredEffects
    }

    /**
     * Set target position for movement or teleport instantly.
     * @param {number} targetRow - Target grid row
     * @param {number} targetCol - Target grid column
     * @param {boolean} teleport - If true, move instantly without animation
     */
    moveTo(targetRow, targetCol, teleport = false) {
        this.targetRow = targetRow
        this.targetCol = targetCol

        if (teleport) {
            const pos = this.grid.getNodePosition(targetRow, targetCol)
            this.x = pos.x
            this.y = pos.y
            this.row = targetRow
            this.col = targetCol
            this.isMoving = false
            this.teleported = true
            this.wake.reset(pos.x, pos.y)
        } else {
            this.isMoving = true
        }
    }

    /**
     * Get current world position.
     * @returns {Vector2} Current x/y position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }

    /**
     * Check if player currently has a speed boost active.
     * @returns {boolean} True if speed boost is active
     */
    hasSpeedBoost() {
        return this.effectManager.hasEffect(Constants.game.effects.fast.type)
    }

    /**
     * Check if player currently has a speed slow effect active.
     * @returns {boolean} True if slow effect is active
     */
    isSlowed() {
        return this.effectManager.hasEffect(Constants.game.effects.slow.type)
    }

    /**
     * Check if player currently has shield active.
     * @returns {boolean} True if shield is active
     */
    hasShield() {
        return this.effectManager.hasEffect(Constants.game.effects.shield.type)
    }

    /**
     * Check if player currently has immunity active.
     * @returns {boolean} True if immune
     */
    isImmune() {
        return this.effectManager.hasEffect(Constants.game.effects.immunity.type)
    }

    /**
     * Check if player is protected from death (shield OR immunity).
     * @returns {boolean} True if player cannot die from collision
     */
    isProtected() {
        return this.hasShield() || this.isImmune()
    }

    // Wake trail property accessors for renderer/game compatibility
    get wakeIntensity() { return this.wake.intensity }
    set wakeIntensity(value) { this.wake.intensity = value }
    get wakeStartX() { return this.wake.startX }
    get wakeStartY() { return this.wake.startY }
}
