/**
 * Manages wake trail effect state for moving entities.
 * Encapsulates intensity, position, and update logic for the gradient trail
 * that appears behind moving entities like Player, Bullet, Patrol, and Follower.
 */
class WakeTrail {
    /**
     * @param {number} x - Initial X position
     * @param {number} y - Initial Y position
     * @param {Object} config - Wake trail configuration
     * @param {number} config.buildRate - Intensity increase per ms while moving
     * @param {number} config.trailDistance - Distance in pixels behind entity
     * @param {number} [config.fadeRate] - Intensity decrease per ms when stationary (default: 0)
     */
    constructor(x, y, config) {
        this.intensity = 0          // Wake trail opacity (0-1)
        this.startX = x             // Wake trail start X position
        this.startY = y             // Wake trail start Y position
        this.buildRate = config.buildRate
        this.fadeRate = config.fadeRate || 0
        this.trailDistance = config.trailDistance
    }

    /**
     * Update wake trail state based on movement.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @param {boolean} isMoving - Whether the entity is currently moving
     * @param {number} x - Current entity X position
     * @param {number} y - Current entity Y position
     * @param {number} dirX - Movement direction X component (normalized)
     * @param {number} dirY - Movement direction Y component (normalized)
     */
    update(delta, isMoving, x, y, dirX, dirY) {
        if (!isMoving) {
            if (this.fadeRate > 0) {
                this.intensity = Math.max(0, this.intensity - delta * this.fadeRate)
            }
            return
        }
        this.intensity = Math.min(1, this.intensity + delta * this.buildRate)
        this.startX = x - dirX * this.trailDistance
        this.startY = y - dirY * this.trailDistance
    }

    /**
     * Reset wake trail to a position with zero intensity.
     * @param {number} x - Reset X position
     * @param {number} y - Reset Y position
     */
    reset(x, y) {
        this.intensity = 0
        this.startX = x
        this.startY = y
    }
}
