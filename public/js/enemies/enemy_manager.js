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
        this.grid = grid // Grid reference
        this.config = config // Level enemy configuration
        this.audioManager = audioManager // Audio manager for sound effects
        this.bullets = [] // Active bullet instances
        this.lasers = [] // Laser instances
        this.traps = [] // Static trap instances
        this.mines = [] // Static mine instances
        this.shooters = [] // Static shooter instances
        this.patrols = [] // Patrol instances
        this.followers = [] // Follower instances
        this.instanceStates = [] // Per-spawner timing state
        this.explodedMinePositions = [] // Positions of mines that exploded this frame

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
        if (!this.config.enemyBullet) return
        this.instanceStates = this.config.enemyBullet.map(() => ({
            delayElapsed: false, // Whether initial delay has passed
            timer: 0             // Time elapsed since last spawn/start
        }))
    }

    /**
     * Create laser instances from level configuration.
     */
    initLasers() {
        if (!this.config.enemyLaser) return
        this.lasers = this.config.enemyLaser.map(
            laserConfig => new EnemyLaser(this.grid, laserConfig)
        )
    }

    /**
     * Create trap instances from level configuration.
     * Clears any patrol-spawned traps.
     */
    initTraps() {
        this.traps = []
        if (!this.config.enemyTrap) return
        this.traps = this.config.enemyTrap.map(
            trapConfig => new EnemyTrap(trapConfig, this.grid)
        )
    }

    /**
     * Create mine instances from level configuration.
     * Clears any patrol-spawned mines.
     */
    initMines() {
        this.mines = []
        if (!this.config.enemyMine) return
        this.mines = this.config.enemyMine.map(
            mineConfig => new EnemyMine(mineConfig, this.grid)
        )
    }

    /**
     * Create shooter instances from level configuration.
     */
    initShooters() {
        if (!this.config.enemyShooter) return
        this.shooters = this.config.enemyShooter.map(
            shooterConfig => new EnemyShooter(shooterConfig, this.grid)
        )
    }

    /**
     * Create patrol instances from level configuration.
     */
    initPatrols() {
        if (!this.config.enemyPatrol) return
        this.patrols = this.config.enemyPatrol.map(
            patrolConfig => new EnemyPatrol(patrolConfig, this.grid)
        )
    }

    /**
     * Create follower instances from level configuration.
     */
    initFollowers() {
        if (!this.config.enemyFollower) return
        this.followers = this.config.enemyFollower.map(
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

        // Update trap states (for intermittent traps)
        for (const trap of this.traps) {
            trap.update(delta)
        }

        // Update mines and spawn bullets on explosion
        this.explodedMinePositions = []
        for (const mine of this.mines) {
            const exploded = mine.update(delta)
            if (exploded) {
                this.spawnBulletsFromMine(mine)
                this.explodedMinePositions.push(mine.getPosition())
                this.audioManager.playSound(Constants.audio.sounds.explosionMine)
            }
        }

        // Update shooters and spawn bullets they fire
        for (const shooter of this.shooters) {
            const result = shooter.update(delta)
            for (const info of result.bullets) {
                this.spawnBulletFromShooter(info)
                this.audioManager.playSound(Constants.audio.sounds.shooterShot)
            }
            if (result.rotationStarted) {
                this.audioManager.playSound(Constants.audio.sounds.shooterTurn)
            }
        }

        // Update patrol positions
        for (const patrol of this.patrols) {
            patrol.update(delta)
        }

        // Update follower positions (need player position for pathfinding)
        for (const follower of this.followers) {
            follower.update(delta, playerRow, playerCol)
        }

        // Handle bullet spawning for each configured spawner
        if (!this.config.enemyBullet) return
        this.config.enemyBullet.forEach((instanceConfig, index) => {
            if (this.updateSpawnerState(this.instanceStates[index], instanceConfig, delta)) {
                this.spawnFromInstance(instanceConfig)
            }
        })
    }

    /**
     * Update spawner timing state and determine if spawn should occur.
     * @param {Object} state - Spawner state {delayElapsed, timer}
     * @param {Object} config - Spawner config {delay, interval}
     * @param {number} delta - Time elapsed in ms
     * @returns {boolean} True if a spawn should occur this frame
     */
    updateSpawnerState(state, config, delta) {
        if (!state) return false

        state.timer += delta
        const threshold = state.delayElapsed ? config.interval : config.delay

        if (state.timer >= threshold) {
            state.delayElapsed = true
            state.timer = 0
            return true
        }
        return false
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
            this.grid,
            instanceConfig.speed
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
                this.grid,
                mine.bulletSpeed
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
     * Convert direction key to row/col delta vectors.
     * @param {string} direction - Direction key from Constants.directions
     * @returns {Object} Object with row and col deltas
     */
    getDirectionVectors(direction) {
        const result = Constants.directions[direction]
        if (!result) {
            return Constants.directions.none
        }
        return result
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

    /**
     * Get positions of mines that exploded this frame.
     * @returns {Vector2[]} Array of explosion positions
     */
    getExplodedMinePositions() {
        return this.explodedMinePositions
    }
}
