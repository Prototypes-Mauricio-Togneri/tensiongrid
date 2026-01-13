/**
 * 2D vector utility class for mathematical operations.
 * Used throughout the game for position calculations and collision detection.
 */
class Vector2 {
    /**
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    constructor(x = 0, y = 0) {
        this.x = x // X coordinate
        this.y = y // Y coordinate
    }

    /**
     * Calculate Euclidean distance between two points.
     * @param {Vector2} a - First point
     * @param {Vector2} b - Second point
     * @returns {number} Distance between the points
     */
    static distance(a, b) {
        const dx = a.x - b.x
        const dy = a.y - b.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    /**
     * Calculate normalized direction vector from one point to another.
     * @param {Vector2} from - Starting point
     * @param {Vector2} to - Target point
     * @returns {Vector2} Unit vector pointing from start to target, or zero vector if same point
     */
    static direction(from, to) {
        const dx = to.x - from.x
        const dy = to.y - from.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist === 0) return new Vector2(0, 0)
        return new Vector2(dx / dist, dy / dist)
    }
}
