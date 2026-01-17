/**
 * Manages spawning and lifecycle of enemy bullets, lasers, and traps.
 * Handles timed spawning with configurable delays and intervals.
 */
class EnemyManager {
    /**
     * @param {Grid} grid - Grid instance for position calculations
     * @param {Object} config - Enemy configuration from level data
     * @param {AudioManager} audioManager - Audio manager for sound effects
     */
    constructor(grid, config, audioManager) {
        this.grid = grid                 // Grid reference
        this.config = config             // Level enemy configuration
        this.audioManager = audioManager // Audio manager for sound effects
        this.bullets = []                // Active bullet instances
        this.lasers = []                 // Laser instances
        this.traps = []                  // Static trap instances
        this.mines = []                  // Static mine instances
        this.shooters = []               // Static shooter instances
        this.patrols = []                // Patrol instances
        this.followers = []              // Follower instances
        this.instanceStates = []         // Per-spawner timing state
        this.initInstanceStates()
        this.initLasers()
        this.initTraps()
        this.initMines()
        this.initShooters()
        this.initPatrols()
        this.initFollowers()
    }

    /**
     * Initialize timing state for each bullet spawner.
     * Tracks delay completion and elapsed time for spawn intervals.
     */
    initInstanceStates() {
        if (!this.config.enemy_bullet) return
        this.instanceStates = this.config.enemy_bullet.map(() => ({
            delayElapsed: false, // Whether initial delay has passed
            timer: 0             // Time elapsed since last spawn/start
        }))
    }

    /**
     * Create laser instances from level configuration.
     */
    initLasers() {
        if (!this.config.enemy_laser) return
        this.lasers = this.config.enemy_laser.map(
            laserConfig => new EnemyLaser(this.grid, laserConfig)
        )
    }

    /**
     * Create trap instances from level configuration.
     * Clears any patrol-spawned traps.
     */
    initTraps() {
        this.traps = []
        if (!this.config.enemy_trap) return
        this.traps = this.config.enemy_trap.map(
            trapConfig => new EnemyTrap(trapConfig, this.grid)
        )
    }

    /**
     * Create mine instances from level configuration.
     * Clears any patrol-spawned mines.
     */
    initMines() {
        this.mines = []
        if (!this.config.enemy_mine) return
        this.mines = this.config.enemy_mine.map(
            mineConfig => new EnemyMine(mineConfig, this.grid)
        )
    }

    /**
     * Create shooter instances from level configuration.
     */
    initShooters() {
        if (!this.config.enemy_shooter) return
        this.shooters = this.config.enemy_shooter.map(
            shooterConfig => new EnemyShooter(shooterConfig, this.grid)
        )
    }

    /**
     * Create patrol instances from level configuration.
     */
    initPatrols() {
        if (!this.config.enemy_patrol) return
        this.patrols = this.config.enemy_patrol.map(
            patrolConfig => new EnemyPatrol(patrolConfig, this.grid)
        )
    }

    /**
     * Create follower instances from level configuration.
     */
    initFollowers() {
        if (!this.config.enemy_follower) return
        this.followers = this.config.enemy_follower.map(
            followerConfig => new EnemyFollower(followerConfig, this.grid)
        )
    }

    /**
     * Update all enemies and handle spawning.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     * @param {number} playerRow - Current player grid row (for follower AI)
     * @param {number} playerCol - Current player grid column (for follower AI)
     */
    update(delta, playerRow, playerCol) {
        // Update bullets and remove dead ones (iterate backwards for safe removal)
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const keepBullet = this.bullets[i].update(delta)
            if (!keepBullet) {
                this.bullets.splice(i, 1)
            }
        }

        // Update laser states (for intermittent lasers)
        for (const laser of this.lasers) {
            laser.update(delta)
        }

        // Update trap states (for intermittent traps) and remove expired
        for (const trap of this.traps) {
            trap.update(delta)
        }
        this.traps = this.traps.filter(trap => !trap.isExpired())

        // Update mines and spawn bullets on explosion
        for (const mine of this.mines) {
            const exploded = mine.update(delta)
            if (exploded) {
                this.spawnBulletsFromMine(mine)
                this.audioManager.playSound(Constants.audio.keys.explosionMine)
            }
        }
        this.mines = this.mines.filter(mine => !mine.isExpired())

        // Update shooters and spawn bullets they fire
        for (const shooter of this.shooters) {
            const result = shooter.update(delta)
            for (const info of result.bullets) {
                this.spawnBulletFromShooter(info)
                this.audioManager.playSound(Constants.audio.keys.shooterShot)
            }
            if (result.rotationStarted) {
                this.audioManager.playSound(Constants.audio.keys.shooterTurn)
            }
        }

        // Update patrol positions and handle spawns
        for (const patrol of this.patrols) {
            const spawnRequests = patrol.update(delta)
            for (const request of spawnRequests) {
                this.handlePatrolSpawn(request)
            }
        }

        // Update follower positions (need player position for pathfinding)
        for (const follower of this.followers) {
            follower.update(delta, playerRow, playerCol)
        }

        // Handle bullet spawning for each configured spawner
        if (!this.config.enemy_bullet) return
        this.config.enemy_bullet.forEach((instanceConfig, index) => {
            const state = this.instanceStates[index]
            if (!state) return

            state.timer += delta

            // Wait for initial delay before first spawn
            if (!state.delayElapsed) {
                if (state.timer >= instanceConfig.delay) {
                    this.spawnFromInstance(instanceConfig)
                    state.delayElapsed = true
                    state.timer = 0
                }
            } else {
                // Spawn at regular intervals after delay
                if (state.timer >= instanceConfig.interval) {
                    this.spawnFromInstance(instanceConfig)
                    state.timer = 0
                }
            }
        })
    }

    /**
     * Create a new bullet from spawner configuration.
     * @param {Object} instanceConfig - Spawner config with position and direction
     */
    spawnFromInstance(instanceConfig) {
        const { row: dirRow, col: dirCol } = this.getDirectionVectors(instanceConfig.direction)
        const row = instanceConfig.y
        const col = instanceConfig.x
        const pos = this.grid.getNodePosition(row, col)

        this.bullets.push(new EnemyBullet(
            row, col,
            pos.x, pos.y,
            dirRow, dirCol,
            this.grid
        ))
    }

    /**
     * Spawn bullets in all valid directions from an exploding mine.
     * @param {EnemyMine} mine - The mine that just exploded
     */
    spawnBulletsFromMine(mine) {
        const directions = mine.getValidDirections()
        const pos = this.grid.getNodePosition(mine.row, mine.col)

        for (const dir of directions) {
            this.bullets.push(new EnemyBullet(
                mine.row, mine.col,
                pos.x, pos.y,
                dir.dirRow, dir.dirCol,
                this.grid
            ))
        }
    }

    /**
     * Spawn a bullet from a shooter in the specified direction.
     * Validates that the target edge exists and is not excluded.
     * @param {Object} info - Bullet spawn info from shooter {row, col, x, y, dirRow, dirCol}
     */
    spawnBulletFromShooter(info) {
        const targetRow = info.row + info.dirRow
        const targetCol = info.col + info.dirCol

        // Only spawn if target position is valid and edge is not excluded
        if (this.grid.isValidPosition(targetRow, targetCol) &&
            !this.grid.isEdgeExcluded(info.row, info.col, targetRow, targetCol)) {
            this.bullets.push(new EnemyBullet(
                info.row, info.col,
                info.x, info.y,
                info.dirRow, info.dirCol,
                this.grid
            ))
        }
    }

    /**
     * Handle spawn request from a patrol enemy.
     * Creates trap or mine at the specified node if no fixed enemy exists there.
     * @param {Object} request - Spawn request {type: 'trap'|'mine', row, col, ttl}
     */
    handlePatrolSpawn(request) {
        // Skip if fixed enemy already exists at this node
        if (this.hasFixedEnemyAtNode(request.row, request.col)) return

        const config = { x: request.col, y: request.row, ttl: request.ttl }

        if (request.type === EnemyPatrol.SPAWN_TYPE_TRAP) {
            this.traps.push(new EnemyTrap(config, this.grid))
        } else if (request.type === EnemyPatrol.SPAWN_TYPE_MINE) {
            // Use default delay for patrol-spawned mines
            config.delay = Constants.game.enemies.mine.patrolSpawnDelay
            this.mines.push(new EnemyMine(config, this.grid))
        }
    }

    /**
     * Check if a fixed-position enemy exists at the given node.
     * @param {number} row - Grid row
     * @param {number} col - Grid column
     * @returns {boolean} True if a trap, mine, or shooter occupies the node
     */
    hasFixedEnemyAtNode(row, col) {
        // Check traps
        for (const trap of this.traps) {
            if (trap.row === row && trap.col === col) return true
        }

        // Check mines (including exploded ones to prevent stacking)
        for (const mine of this.mines) {
            if (mine.row === row && mine.col === col) return true
        }

        // Check shooters
        for (const shooter of this.shooters) {
            if (shooter.row === row && shooter.col === col) return true
        }

        return false
    }

    /**
     * Convert direction key to row/col delta vectors.
     * @param {string} direction - Direction key from Constants.keys
     * @returns {Object} Object with row and col deltas
     */
    getDirectionVectors(direction) {
        const dirs = Constants.directions
        switch (direction) {
            case Constants.keys.up: return dirs.up
            case Constants.keys.down: return dirs.down
            case Constants.keys.left: return dirs.left
            case Constants.keys.right: return dirs.right
            default: return dirs.none
        }
    }

    /**
     * Clear all bullets and reset spawner states.
     * Mines, shooters, and patrols are re-initialized to reset their state.
     */
    clear() {
        this.bullets = []
        this.initInstanceStates()
        this.initLasers()
        this.initTraps()
        this.initMines()
        this.initShooters()
        this.initPatrols()
        this.initFollowers()
    }

    /**
     * Get array of active bullets.
     * @returns {EnemyBullet[]} Active bullet instances
     */
    getBullets() {
        return this.bullets
    }

    /**
     * Get array of lasers.
     * @returns {EnemyLaser[]} Laser instances
     */
    getLasers() {
        return this.lasers
    }

    /**
     * Get array of traps.
     * @returns {EnemyTrap[]} Trap instances
     */
    getTraps() {
        return this.traps
    }

    /**
     * Get array of mines (excluding exploded ones for rendering).
     * @returns {EnemyMine[]} Non-exploded mine instances
     */
    getMines() {
        return this.mines.filter(m => !m.isExploded())
    }

    /**
     * Get array of all mines (for collision checking).
     * @returns {EnemyMine[]} All mine instances
     */
    getAllMines() {
        return this.mines
    }

    /**
     * Get array of shooters.
     * @returns {EnemyShooter[]} Shooter instances
     */
    getShooters() {
        return this.shooters
    }

    /**
     * Get array of patrols.
     * @returns {EnemyPatrol[]} Patrol instances
     */
    getPatrols() {
        return this.patrols
    }

    /**
     * Get array of followers.
     * @returns {EnemyFollower[]} Follower instances
     */
    getFollowers() {
        return this.followers
    }
}
