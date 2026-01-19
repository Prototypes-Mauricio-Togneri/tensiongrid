/**
 * Main game orchestrator.
 * Coordinates game loop, entities, collision detection, and rendering.
 */
class Game {
    /**
     * @param {string} canvasId - DOM ID of the game canvas
     * @param {InputManager} inputManager - Shared input manager instance
     */
    constructor(canvasId, inputManager) {
        this.canvas = document.getElementById(canvasId) // Game canvas element
        this.inputManager = inputManager  // Shared input manager
        this.ui = new UIManager()         // HUD manager
        this.running = false              // True while game loop is active

        window.addEventListener(Constants.events.resize, () => this.resizeCanvas())
    }

    /**
     * Resize canvas to fit parent container and update camera viewport.
     */
    resizeCanvas() {
        const wrapper = this.canvas.parentElement
        const width = wrapper.clientWidth
        const height = wrapper.clientHeight

        this.canvas.width = width
        this.canvas.height = height

        if (!this.camera) return
        this.camera.setViewport(width, height)
        this.camera.follow(this.player.x, this.player.y)
    }

    /**
     * Update game state for one frame.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    update(delta) {
        // During death pause, update explosion and count down timer
        if (this.dead) {
            this.explosion.update(delta)
            this.deathTimer -= delta
            if (this.deathTimer <= 0) {
                this.reset()
            }
            return
        }

        this.processInput()
        const boostExpired = this.player.update(delta)
        if (boostExpired) {
            this.audioManager.playSound(Constants.audio.keys.powerExpired)
        }
        this.enemyManager.update(delta, this.player.row, this.player.col)

        // Camera follows player position
        this.camera.follow(this.player.x, this.player.y)
        this.player.teleported = false

        // Award 1 point per second survived
        this.scoreTimer += delta
        if (this.scoreTimer >= 1000) {
            this.ui.addScore(1)
            this.scoreTimer -= 1000
        }

        // Check collisions
        const hitByEnemy = this.collisionSystem.checkPlayerBulletCollision(
            this.player,
            this.enemyManager.getBullets()
        )
        const hitByLaser = this.collisionSystem.checkPlayerLaserCollision(
            this.player,
            this.enemyManager.getLasers()
        )
        const hitByTrap = this.collisionSystem.checkPlayerTrapCollision(
            this.player,
            this.enemyManager.getTraps()
        )
        const hitByShooter = this.collisionSystem.checkPlayerShooterCollision(
            this.player,
            this.enemyManager.getShooters()
        )
        const hitByPatrol = this.collisionSystem.checkPlayerPatrolCollision(
            this.player,
            this.enemyManager.getPatrols()
        )
        const hitByFollower = this.collisionSystem.checkPlayerFollowerCollision(
            this.player,
            this.enemyManager.getFollowers()
        )

        // Check for mine trigger (does not kill player, just starts countdown)
        const mineTriggered = this.collisionSystem.checkPlayerMineContact(
            this.player,
            this.enemyManager.getAllMines()
        )
        if (mineTriggered) {
            this.audioManager.playSound(Constants.audio.keys.mineAlarm)
        }

        // Check for power-up collection
        const collectedPowerUp = this.collisionSystem.checkPlayerPowerUpCollision(
            this.player,
            this.powerUps
        )
        if (collectedPowerUp) {
            collectedPowerUp.collect()
            const effect = collectedPowerUp.getEffect()
            this.player.applySpeedBoost(effect.speedMultiplier, effect.duration)
            this.audioManager.playSound(Constants.audio.keys.powerUp)
        }

        // Check for power-down collection
        const collectedPowerDown = this.collisionSystem.checkPlayerPowerDownCollision(
            this.player,
            this.powerDowns
        )
        if (collectedPowerDown) {
            collectedPowerDown.collect()
            const effect = collectedPowerDown.getEffect()
            this.player.applySpeedBoost(effect.speedMultiplier, effect.duration)
            this.audioManager.playSound(Constants.audio.keys.powerDown)
        }

        // Start death pause on collision
        if (hitByEnemy || hitByLaser || hitByTrap || hitByShooter || hitByPatrol || hitByFollower) {
            this.audioManager.playSound(Constants.audio.keys.explosionPlayer)
            this.ui.shake()
            this.dead = true
            this.deathTimer = Constants.game.physics.deathPauseMs
            this.explosion = new PlayerExplosion(this.player.x, this.player.y)
        }
    }

    /**
     * Process input and move player if valid.
     * Handles grid wrapping and edge exclusion checks.
     */
    processInput() {
        // Only accept input when player is stationary
        if (this.player.isMoving) return

        const direction = this.inputManager.getDirection()
        if (!direction) return

        const newRow = this.player.row + direction.dRow
        const newCol = this.player.col + direction.dCol
        const wrapped = this.grid.wrapPosition(newRow, newCol)

        // Block movement to excluded nodes
        if (this.grid.isExcluded(wrapped.row, wrapped.col)) return
        // Block movement across excluded edges (unless wrapping)
        if (!wrapped.wrapped && this.grid.isEdgeExcluded(this.player.row, this.player.col, wrapped.row, wrapped.col)) return

        this.player.moveTo(wrapped.row, wrapped.col, wrapped.wrapped)
        // Disable input briefly after wrapping to prevent rapid teleporting
        if (wrapped.wrapped) {
            this.inputManager.disable()
        }
    }

    /**
     * Render all game entities.
     * @param {number} time - Current animation timestamp for effects
     */
    render(time) {
        this.renderer.clear()
        this.renderer.drawGrid(this.grid)
        this.renderer.drawLasers(this.enemyManager.getLasers())
        this.renderer.drawTraps(this.enemyManager.getTraps(), time)
        this.renderer.drawMines(this.enemyManager.getMines(), time)
        this.renderer.drawBullets(this.enemyManager.getBullets())
        this.renderer.drawShooters(this.enemyManager.getShooters(), time)
        this.renderer.drawPatrols(this.enemyManager.getPatrols())
        this.renderer.drawFollowers(this.enemyManager.getFollowers())
        this.renderer.drawPowerUps(this.powerUps, time)
        this.renderer.drawPowerDowns(this.powerDowns, time)

        // Draw explosion instead of player during death pause
        if (this.dead) {
            this.renderer.drawPlayerExplosion(this.explosion)
        } else {
            this.renderer.drawPlayerWithBoost(this.player)
        }
    }

    /**
     * Reset player position and clear enemies.
     */
    reset() {
        this.dead = false
        this.deathTimer = 0
        this.explosion = null
        this.player.reset()
        this.enemyManager.clear()
        this.initPowerUps(this.levelData.powerUps)   // Respawn power-ups
        this.initPowerDowns(this.levelData.powerDowns) // Respawn power-downs
        this.camera.follow(this.player.x, this.player.y)
        this.ui.score = 0
        this.scoreTimer = 0
        this.ui.updateDisplay()
    }

    /**
     * Main game loop using requestAnimationFrame.
     * @param {number} currentTime - Current animation timestamp
     */
    gameLoop(currentTime) {
        if (!this.running) return

        const delta = currentTime - this.lastTime
        this.lastTime = currentTime

        // Skip frame if delta is too large (prevents tunneling on tab switch)
        if (delta > Constants.game.physics.maxDeltaTime) {
            requestAnimationFrame((t) => this.gameLoop(t))
            return
        }

        this.update(delta)
        this.render(currentTime)
        requestAnimationFrame((t) => this.gameLoop(t))
    }

    /**
     * Initialize game objects from level data.
     * @param {Object} levelData - Level configuration from JSON
     */
    init(levelData) {
        this.levelData = levelData // Store for reset
        this.grid = new Grid({ ...Constants.game.grid, ...levelData.grid })
        this.camera = new Camera(this.grid)
        this.player = new Player(this.grid, { ...Constants.game.player, ...levelData.player })
        this.audioManager = new AudioManager() // Audio manager for sound effects
        this.enemyManager = new EnemyManager(this.grid, levelData.enemies, this.audioManager)
        this.collisionSystem = new CollisionSystem(Constants.game.physics)
        this.renderer = new Renderer(this.canvas, this.camera)
        this.powerUps = []           // Active power-ups
        this.powerDowns = []         // Active power-downs
        this.initPowerUps(levelData.powerUps)
        this.initPowerDowns(levelData.powerDowns)
    }

    /**
     * Initialize power-ups from level data.
     * @param {Object[]} powerUpData - Array of power-up configurations
     */
    initPowerUps(powerUpData) {
        this.powerUps = []
        if (powerUpData) {
            for (const config of powerUpData) {
                this.powerUps.push(new PowerUp(config, this.grid))
            }
        }
    }

    /**
     * Initialize power-downs from level data.
     * @param {Object[]} powerDownData - Array of power-down configurations
     */
    initPowerDowns(powerDownData) {
        this.powerDowns = []
        if (powerDownData) {
            for (const config of powerDownData) {
                this.powerDowns.push(new PowerDown(config, this.grid))
            }
        }
    }

    /**
     * Start a new game with the given level.
     * @param {Object} levelData - Level configuration from JSON
     */
    start(levelData) {
        if (this.running) return
        this.init(levelData)
        this.resizeCanvas()
        this.reset()
        this.ui.reset()
        this.running = true
        this.lastTime = 0   // Last frame timestamp
        this.scoreTimer = 0 // Time since last score increment
        requestAnimationFrame((t) => this.gameLoop(t))
    }

    /**
     * Stop the game loop completely.
     */
    stop() {
        this.running = false
    }

    /**
     * Pause the game loop (for pause menu).
     */
    pause() {
        this.running = false
    }

    /**
     * Resume the game loop after pausing.
     */
    resume() {
        if (this.running) return
        this.running = true
        this.lastTime = performance.now() // Reset time to prevent large delta
        requestAnimationFrame((t) => this.gameLoop(t))
    }
}
