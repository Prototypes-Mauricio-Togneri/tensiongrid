/**
 * Portal entity that teleports the player to its paired partner.
 * Portals come in pairs identified by a shared group string.
 * Renders as a spinning vortex with counter-rotating arc rings.
 */
class Portal {
    /**
     * @param {Object} config - Portal configuration from level data
     * @param {string} config.group - Group identifier to pair portals
     * @param {number} config.x - Grid column position
     * @param {number} config.y - Grid row position
     * @param {Grid} grid - Grid instance for position calculation
     */
    constructor(config, grid) {
        this.group = config.group
        this.row = config.y
        this.col = config.x
        this.partner = null // Set after construction to link paired portal

        const pos = grid.getNodePosition(this.row, this.col)
        this.x = pos.x
        this.y = pos.y

        this.size = Constants.game.portal.size
        this.angle = Math.random() * Math.PI * 2 // Random initial rotation
    }

    /**
     * Update vortex rotation angle.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        this.angle += Constants.game.portal.rotationSpeed * delta
    }

    /**
     * Get current world position.
     * @returns {Vector2} Position in world coordinates
     */
    getPosition() {
        return new Vector2(this.x, this.y)
    }
}
