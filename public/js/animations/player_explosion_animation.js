/**
 * Visual effect for player death explosion.
 * Small square particles that scatter outward from the player position.
 */
class PlayerExplosionAnimation extends ParticleExplosion {
    /**
     * @param {number} x - Center X position in world coordinates
     * @param {number} y - Center Y position in world coordinates
     */
    constructor(x, y) {
        super(x, y, Constants.game.animations.playerExplosion)
    }
}
