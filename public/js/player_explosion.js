/**
 * Visual effect for player death explosion.
 * Creates fragments that fly outward and rotate from the player's position.
 */
class PlayerExplosion {
    /**
     * @param {number} x - Center X position in world coordinates
     * @param {number} y - Center Y position in world coordinates
     */
    constructor(x, y) {
        const config = Constants.game.player
        this.fragmentSize = config.explosionFragmentSize
        this.speed = config.explosionSpeed
        this.rotationSpeed = config.explosionRotationSpeed

        // Initialize fragments with evenly distributed directions
        const count = config.explosionFragments
        this.fragments = []
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count
            this.fragments.push({
                x: x,
                y: y,
                dx: Math.cos(angle),
                dy: Math.sin(angle),
                rotation: 0
            })
        }
    }

    /**
     * Update fragment positions and rotations.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        const moveAmount = this.speed * delta / 1000
        const rotateAmount = this.rotationSpeed * delta / 1000
        for (const fragment of this.fragments) {
            fragment.x += fragment.dx * moveAmount
            fragment.y += fragment.dy * moveAmount
            fragment.rotation += rotateAmount
        }
    }

    /**
     * Get fragment data for rendering.
     * @returns {Object[]} Array of fragment data {x, y, rotation}
     */
    getFragments() {
        return this.fragments
    }
}
