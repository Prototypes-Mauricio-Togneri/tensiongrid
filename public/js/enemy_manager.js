/**
 * Manages spawning and lifecycle of enemy bullets and lasers.
 * Handles timed spawning with configurable delays and intervals.
 */
class EnemyManager {
    /**
     * @param {Grid} grid - Grid instance for position calculations
     * @param {Object} config - Enemy configuration from level data
     */
    constructor(grid, config) {
        this.grid = grid              // Grid reference
        this.config = config          // Level enemy configuration
        this.bullets = []             // Active bullet instances
        this.lasers = []              // Laser instances
        this.instanceStates = []      // Per-spawner timing state
        this.initInstanceStates()
        this.initLasers()
    }

    /**
     * Initialize timing state for each bullet spawner.
     * Tracks delay completion and elapsed time for spawn intervals.
     */
    initInstanceStates() {
        this.instanceStates = this.config.enemy_bullet.map(() => ({
            delayElapsed: false, // Whether initial delay has passed
            timer: 0            // Time elapsed since last spawn/start
        }))
    }

    /**
     * Create laser instances from level configuration.
     */
    initLasers() {
        this.lasers = this.config.enemy_laser.map(
            laserConfig => new EnemyLaser(this.grid, laserConfig)
        )
    }

    /**
     * Update all enemies and handle spawning.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
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

        // Handle bullet spawning for each configured spawner
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
     */
    clear() {
        this.bullets = []
        this.initInstanceStates()
        this.initLasers()
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
}
