/**
 * Handles collision detection between player and enemies.
 * Uses distance-based detection for bullets and grid-based detection for lasers and traps.
 */
class CollisionSystem {
    /**
     * @param {Object} config - Collision configuration from Constants
     */
    constructor(config) {
        this.threshold = config.collisionThreshold // Multiplier for collision distance
    }

    /**
     * Check if player collides with any bullet using circle-to-circle detection.
     * @param {Player} player - Player instance
     * @param {EnemyBullet[]} bullets - Array of active bullets
     * @returns {boolean} True if collision detected
     */
    checkPlayerBulletCollision(player, bullets) {
        const playerPos = player.getPosition()
        const collisionDist = (player.size + Constants.game.enemies.bullet.size) * this.threshold

        for (const bullet of bullets) {
            const bulletPos = bullet.getPosition()
            if (Vector2.distance(playerPos, bulletPos) < collisionDist) {
                return true
            }
        }
        return false
    }

    /**
     * Check if player's grid position intersects any active laser.
     * @param {Player} player - Player instance
     * @param {EnemyLaser[]} lasers - Array of lasers
     * @returns {boolean} True if player is on an active laser
     */
    checkPlayerLaserCollision(player, lasers) {
        for (const laser of lasers) {
            if (laser.isActive() && laser.containsNode(player.row, player.col)) {
                return true
            }
        }
        return false
    }

    /**
     * Check if player's grid position matches any active trap position.
     * @param {Player} player - Player instance
     * @param {EnemyTrap[]} traps - Array of traps
     * @returns {boolean} True if player is on an active trap
     */
    checkPlayerTrapCollision(player, traps) {
        for (const trap of traps) {
            if (trap.isActive() && player.row === trap.row && player.col === trap.col) {
                return true
            }
        }
        return false
    }

    /**
     * Check if player's grid position matches any dormant mine position.
     * Triggers the mine countdown on contact (does NOT return collision for death).
     * @param {Player} player - Player instance
     * @param {EnemyMine[]} mines - Array of mines
     */
    checkPlayerMineContact(player, mines) {
        for (const mine of mines) {
            if (mine.isDormant() && player.row === mine.row && player.col === mine.col) {
                mine.trigger()
            }
        }
    }

    /**
     * Check if player's grid position matches any shooter position.
     * Shooters kill player on contact.
     * @param {Player} player - Player instance
     * @param {EnemyShooter[]} shooters - Array of shooters
     * @returns {boolean} True if player is on a shooter
     */
    checkPlayerShooterCollision(player, shooters) {
        for (const shooter of shooters) {
            if (player.row === shooter.row && player.col === shooter.col) {
                return true
            }
        }
        return false
    }

    /**
     * Check if player's grid position matches any patrol position.
     * Patrols kill player on contact.
     * @param {Player} player - Player instance
     * @param {EnemyPatrol[]} patrols - Array of patrols
     * @returns {boolean} True if player is on a patrol's current node
     */
    checkPlayerPatrolCollision(player, patrols) {
        for (const patrol of patrols) {
            if (player.row === patrol.row && player.col === patrol.col) {
                return true
            }
        }
        return false
    }

    /**
     * Check if player's grid position matches any snake segment position.
     * Snakes kill player on contact with any segment (head or body).
     * @param {Player} player - Player instance
     * @param {EnemySnake[]} snakes - Array of snakes
     * @returns {boolean} True if player is on any snake segment
     */
    checkPlayerSnakeCollision(player, snakes) {
        for (const snake of snakes) {
            const segments = snake.getSegmentGridPositions()
            for (const segment of segments) {
                if (player.row === segment.row && player.col === segment.col) {
                    return true
                }
            }
        }
        return false
    }
}
