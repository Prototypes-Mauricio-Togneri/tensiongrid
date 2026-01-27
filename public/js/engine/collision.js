/**
 * Handles collision detection between player and enemies.
 * Uses distance-based detection for bullets and grid-based detection for lasers and traps.
 */
class Collision {
    /**
     * @param {Object} config - Collision configuration from Constants
     */
    constructor(config) {
        this.threshold = config.collisionThreshold // Multiplier for collision distance
    }

    // ========================================
    // Collision Strategy Helpers
    // ========================================

    /**
     * Check circle-to-circle collision using distance.
     * @param {Player} player - Player instance
     * @param {Object} entity - Entity with getPosition() method
     * @param {number} entitySize - Size of the entity
     * @returns {boolean} True if collision detected
     */
    circleCollides(player, entity, entitySize) {
        const playerPos = player.getPosition()
        const entityPos = entity.getPosition()
        const collisionDist = (player.size + entitySize) * this.threshold
        return Vector2.distance(playerPos, entityPos) < collisionDist
    }

    /**
     * Check grid-based collision using exact row/col match.
     * @param {Player} player - Player instance
     * @param {Object} entity - Entity with row and col properties
     * @returns {boolean} True if on same grid node
     */
    gridCollides(player, entity) {
        return player.row === entity.row && player.col === entity.col
    }

    // ========================================
    // Generic Check Methods
    // ========================================

    /**
     * Check if player collides with any entity in the array.
     * @param {Player} player - Player instance
     * @param {Array} entities - Array of entities to check
     * @param {Function} checkFn - Function (player, entity) => boolean
     * @returns {boolean} True if any collision detected
     */
    checkAny(player, entities, checkFn) {
        for (const entity of entities) {
            if (checkFn(player, entity)) {
                return true
            }
        }
        return false
    }

    /**
     * Find first entity that collides with player.
     * @param {Player} player - Player instance
     * @param {Array} entities - Array of entities to check
     * @param {Function} checkFn - Function (player, entity) => boolean
     * @returns {Object|null} First matching entity or null
     */
    findFirst(player, entities, checkFn) {
        for (const entity of entities) {
            if (checkFn(player, entity)) {
                return entity
            }
        }
        return null
    }

    // ========================================
    // Public Collision Check Methods
    // ========================================

    /**
     * Check if player collides with any bullet using circle-to-circle detection.
     * @param {Player} player - Player instance
     * @param {EnemyBullet[]} bullets - Array of active bullets
     * @returns {boolean} True if collision detected
     */
    checkPlayerBulletCollision(player, bullets) {
        return this.checkAny(player, bullets, (p, bullet) =>
            this.circleCollides(p, bullet, Constants.game.enemies.bullet.size)
        )
    }

    /**
     * Check if player's grid position intersects any active laser.
     * @param {Player} player - Player instance
     * @param {EnemyLaser[]} lasers - Array of lasers
     * @returns {boolean} True if player is on an active laser
     */
    checkPlayerLaserCollision(player, lasers) {
        return this.checkAny(player, lasers, (p, laser) =>
            !p.isMoving && laser.isActive() && laser.containsNode(p.row, p.col)
        )
    }

    /**
     * Check if player's grid position matches any active trap position.
     * @param {Player} player - Player instance
     * @param {EnemyTrap[]} traps - Array of traps
     * @returns {boolean} True if player is on an active trap
     */
    checkPlayerTrapCollision(player, traps) {
        return this.checkAny(player, traps, (p, trap) =>
            trap.isActive() && this.gridCollides(p, trap)
        )
    }

    /**
     * Check if player's grid position matches any dormant mine position.
     * Triggers the mine countdown on contact (does NOT return collision for death).
     * @param {Player} player - Player instance
     * @param {EnemyMine[]} mines - Array of mines
     * @returns {boolean} True if any mine was triggered this frame
     */
    checkPlayerMineContact(player, mines) {
        let triggered = false
        for (const mine of mines) {
            if (mine.isDormant() && this.gridCollides(player, mine)) {
                mine.trigger()
                triggered = true
            }
        }
        return triggered
    }

    /**
     * Check if player's grid position matches any shooter position.
     * Shooters kill player on contact.
     * @param {Player} player - Player instance
     * @param {EnemyShooter[]} shooters - Array of shooters
     * @returns {boolean} True if player is on a shooter
     */
    checkPlayerShooterCollision(player, shooters) {
        return this.checkAny(player, shooters, (p, shooter) =>
            this.gridCollides(p, shooter)
        )
    }

    /**
     * Check if player collides with any patrol using circle-to-circle detection.
     * @param {Player} player - Player instance
     * @param {EnemyPatrol[]} patrols - Array of patrols
     * @returns {boolean} True if collision detected
     */
    checkPlayerPatrolCollision(player, patrols) {
        return this.checkAny(player, patrols, (p, patrol) =>
            this.circleCollides(p, patrol, Constants.game.enemies.patrol.size)
        )
    }

    /**
     * Check if player collides with any follower using circle-to-circle detection.
     * @param {Player} player - Player instance
     * @param {EnemyFollower[]} followers - Array of followers
     * @returns {boolean} True if collision detected
     */
    checkPlayerFollowerCollision(player, followers) {
        return this.checkAny(player, followers, (p, follower) =>
            this.circleCollides(p, follower, Constants.game.enemies.follower.size)
        )
    }

    /**
     * Check if player collides with any uncollected power using circle-to-circle detection.
     * @param {Player} player - Player instance
     * @param {Power[]} powers - Array of powers (both power-ups and power-downs)
     * @returns {Power|null} The collected power, or null if none
     */
    checkPlayerPowerCollision(player, powers) {
        return this.findFirst(player, powers, (p, power) =>
            !power.isCollected() && this.circleCollides(p, power, power.size)
        )
    }

    /**
     * Check if player's grid position matches the exit portal position.
     * @param {Player} player - Player instance
     * @param {Exit} exit - Exit portal instance
     * @returns {boolean} True if player is on the exit node
     */
    checkPlayerExitCollision(player, exit) {
        return this.gridCollides(player, exit)
    }
}
