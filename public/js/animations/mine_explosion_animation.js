/**
 * Visual effect for mine explosion.
 * Yellow square particles that scatter outward from the mine position.
 */
class MineExplosionAnimation extends ParticleExplosion {
    /**
     * @param {number} x - Center X position in world coordinates
     * @param {number} y - Center Y position in world coordinates
     */
    constructor(x, y) {
        super(x, y, Constants.game.animations.mineExplosion)
    }
}
