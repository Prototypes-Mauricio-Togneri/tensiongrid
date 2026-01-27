/**
 * Visual effect for player entering the exit portal.
 * Player shrinks and fades while moving to the exit center.
 */
class PlayerExitAnimation {
    /**
     * @param {number} playerX - Player's starting X position in world coordinates
     * @param {number} playerY - Player's starting Y position in world coordinates
     * @param {number} exitX - Exit center X position in world coordinates
     * @param {number} exitY - Exit center Y position in world coordinates
     */
    constructor(playerX, playerY, exitX, exitY) {
        this.startX = playerX
        this.startY = playerY
        this.targetX = exitX
        this.targetY = exitY
        this.duration = Constants.game.animations.playerExit.duration
        this.elapsed = 0
    }

    /**
     * Update animation progress.
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
     * Get current scale factor (1 to 0).
     * @returns {number} Scale value
     */
    getScale() {
        return 1 - this.getProgress()
    }

    /**
     * Get current opacity (1 to 0).
     * @returns {number} Opacity value
     */
    getOpacity() {
        return 1 - this.getProgress()
    }

    /**
     * Get interpolated player position moving toward exit center.
     * @returns {Object} Position {x, y} in world coordinates
     */
    getPosition() {
        const progress = this.getProgress()
        // Ease out for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 2)
        return {
            x: this.startX + (this.targetX - this.startX) * eased,
            y: this.startY + (this.targetY - this.startY) * eased
        }
    }
}
