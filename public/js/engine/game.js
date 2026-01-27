/**
 * Main game orchestrator.
 * Coordinates game loop, entities, collision detection, and rendering.
 */
class Game {
    /**
     * @param {string} canvasId - DOM ID of the game canvas
     * @param {InputManager} inputManager - Shared input manager instance
     * @param {AudioManager} audioManager - Shared audio manager instance
     */
    constructor(canvasId, inputManager, audioManager) {
        this.canvas = document.getElementById(canvasId) // Game canvas element
        this.inputManager = inputManager  // Shared input manager
        this.audioManager = audioManager  // Shared audio manager
        this.ui = new UIManager()         // HUD manager
        this.running = false              // True while game loop is active

        this.boundResizeCanvas = () => this.resizeCanvas() // Bound handler for cleanup
        window.addEventListener(Constants.events.resize, this.boundResizeCanvas)
    }

    /**
     * Resize canvas to fit parent container and update camera viewport.
     * Applies mobile scaling when viewport is below breakpoint.
     */
    resizeCanvas() {
        const wrapper = this.canvas.parentElement
        const width = wrapper.clientWidth
        const height = wrapper.clientHeight

        this.canvas.width = width
        this.canvas.height = height

        // Calculate scale factor based on viewport width
        const { mobileBreakpoint, mobileFactor } = Constants.game.scale
        const scale = window.innerWidth < mobileBreakpoint ? mobileFactor : 1

        // Apply scale to renderer
        if (this.renderer) {
            this.renderer.setScale(scale)
        }

        if (!this.camera || !this.player) return
        // Divide viewport by scale so camera shows more of the world when scaled down
        this.camera.setViewport(width / scale, height / scale)
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
        const expiredEffects = this.player.update(delta)
        if (expiredEffects.length > 0) {
            this.audioManager.playSound(Constants.audio.sounds.powerExpired)
        }
        this.enemyManager.update(delta, this.player.row, this.player.col)

        // Update exit animation
        if (this.exit) {
            this.exit.update(delta)
        }

        // Update switches and handle expiration
        for (const sw of this.switches) {
            if (sw.update(delta)) {
                // Switch TTL expired - close exit
                if (sw.unlocks === 'exit' && this.exit) {
                    this.exit.close()
                }
            }
        }

        // Create explosion animations for mines that just exploded
        for (const pos of this.enemyManager.getExplodedMinePositions()) {
            this.mineExplosions.push(new MineExplosionAnimation(pos.x, pos.y))
        }

        // Camera follows player position
        this.camera.follow(this.player.x, this.player.y)
        this.player.teleported = false

        this.updateAnimations(delta)
        this.checkCollisionsAndHandle()
    }

    /**
     * Update visual effect animations.
     * @param {number} delta - Time elapsed since last frame in milliseconds
     */
    updateAnimations(delta) {
        if (this.pixelScatter) {
            this.pixelScatter.update(delta)
            if (this.pixelScatter.isComplete()) {
                this.pixelScatter = null
            }
        }

        if (this.collectionWave) {
            this.collectionWave.update(delta)
            if (this.collectionWave.isComplete()) {
                this.collectionWave = null
            }
        }

        // Update mine explosions (iterate backwards for safe removal)
        for (let i = this.mineExplosions.length - 1; i >= 0; i--) {
            this.mineExplosions[i].update(delta)
            if (this.mineExplosions[i].isComplete()) {
                this.mineExplosions.splice(i, 1)
            }
        }
    }

    /**
     * Check all collisions and handle results.
     */
    checkCollisionsAndHandle() {
        // Check for exit collision (level completion)
        if (this.exit && this.collision.checkPlayerExitCollision(this.player, this.exit)) {
            // Play sound only on first contact
            if (!this.touchingExit) {
                this.touchingExit = true
                const sound = this.exit.canExit()
                    ? Constants.audio.sounds.exitOpen
                    : Constants.audio.sounds.exitClosed
                this.audioManager.playSound(sound)
            }
            if (this.exit.canExit()) {
                this.handleLevelComplete()
                return
            }
            // Closed exit: do nothing, player can walk through
        } else {
            this.touchingExit = false
        }

        // Check for mine trigger (does not kill player, just starts countdown)
        if (this.collision.checkPlayerMineContact(this.player, this.enemyManager.getAllMines())) {
            this.audioManager.playSound(Constants.audio.sounds.mineAlarm)
        }

        // Check for power collection
        const collectedPower = this.collision.checkPlayerPowerCollision(this.player, this.powers)
        if (collectedPower) {
            this.handlePowerCollection(collectedPower)
        }

        // Check for switch collection
        const collectedSwitch = this.collision.checkPlayerSwitchCollision(this.player, this.switches)
        if (collectedSwitch) {
            this.handleSwitchCollection(collectedSwitch)
        }

        // Check enemy collisions and handle death
        if (this.checkEnemyCollisions()) {
            this.handleEnemyHit()
        }
    }

    /**
     * Check if player collides with any enemy.
     * @returns {boolean} True if player hit by any enemy
     */
    checkEnemyCollisions() {
        const p = this.player
        const em = this.enemyManager
        const c = this.collision

        return c.checkPlayerBulletCollision(p, em.getBullets())
            || c.checkPlayerLaserCollision(p, em.getLasers())
            || c.checkPlayerTrapCollision(p, em.getTraps())
            || c.checkPlayerShooterCollision(p, em.getShooters())
            || c.checkPlayerPatrolCollision(p, em.getPatrols())
            || c.checkPlayerFollowerCollision(p, em.getFollowers())
    }

    /**
     * Handle player being hit by an enemy.
     */
    handleEnemyHit() {
        if (this.player.effectManager.handleCollision()) {
            // Effect absorbed the hit (shield broke, immunity granted)
            this.audioManager.playSound(Constants.audio.sounds.shieldBreak)
            this.ui.shake()
        } else if (!this.player.isImmune()) {
            // Normal death (not protected)
            this.audioManager.playSound(Constants.audio.sounds.explosionPlayer)
            this.ui.shake()
            this.dead = true
            this.deathTimer = Constants.game.physics.deathPauseMs
            this.explosion = new PlayerExplosionAnimation(this.player.x, this.player.y)
        }
    }

    /**
     * Handle power collection: apply effect, play sound, create wave animation.
     * @param {Power} power - The collected power
     */
    handlePowerCollection(power) {
        power.collect()
        const effectType = power.type
        const effectConfig = Constants.game.effects[effectType]
        this.player.effectManager.addEffect(effectType, effectConfig)

        // Determine color for wave effect
        let waveColor
        if (power.isNegative) {
            this.audioManager.playSound(Constants.audio.sounds.powerDown)
            waveColor = Constants.game.colors.powerDown
        } else {
            this.audioManager.playSound(Constants.audio.sounds.powerUp)
            waveColor = effectType === Constants.game.effects.shield.type
                ? Constants.game.colors.shield
                : Constants.game.colors.powerUp
        }

        this.collectionWave = new PowerCollectionAnimation(power.x, power.y, waveColor)
    }

    /**
     * Handle switch collection: unlock target, play sound, create wave animation.
     * @param {Switch} sw - The collected switch
     */
    handleSwitchCollection(sw) {
        sw.collect()

        // Unlock the target
        if (sw.unlocks === 'exit' && this.exit) {
            this.exit.open()
        }

        // Play sound and create wave animation
        this.audioManager.playSound(Constants.audio.sounds.switchCollected)
        this.collectionWave = new PowerCollectionAnimation(sw.x, sw.y, Constants.game.colors.switch)
    }

    /**
     * Process input and move player if valid.
     * Handles grid wrapping and edge exclusion checks.
     */
    processInput() {
        // Only accept input when player is stationary
        if (this.player.isMoving) return

        let direction = this.inputManager.getDirection()
        if (!direction) return

        // Invert direction if mirror effect is active
        if (this.player.effectManager.hasEffect(Constants.game.effects.mirror.type)) {
            direction = { row: -direction.row, col: -direction.col }
        }

        const newRow = this.player.row + direction.row
        const newCol = this.player.col + direction.col
        const wrapped = this.grid.wrapPosition(newRow, newCol)

        // Block movement to excluded nodes
        if (this.grid.isExcluded(wrapped.row, wrapped.col)) return
        // Block movement across excluded edges (unless wrapping)
        if (!wrapped.wrapped && this.grid.isEdgeExcluded(this.player.row, this.player.col, wrapped.row, wrapped.col)) return

        this.player.moveTo(wrapped.row, wrapped.col, wrapped.wrapped)
        // Disable input briefly after wrapping to prevent rapid teleporting
        if (wrapped.wrapped) {
            this.inputManager.disable()
            this.audioManager.playSound(Constants.audio.sounds.wrapAround)
            // Spawn pixel scatter effect at arrival position
            const newPos = this.grid.getNodePosition(wrapped.row, wrapped.col)
            this.pixelScatter = new PlayerWrapAnimation(newPos.x, newPos.y)
        }
    }

    /**
     * Render all game entities.
     * @param {number} time - Current animation timestamp for effects
     */
    render(time) {
        this.renderer.clear()
        this.renderer.drawGrid(this.grid)

        // Draw exit portal (behind other entities)
        if (this.exit) {
            this.renderer.drawExit(this.exit)
        }

        // Draw switches
        this.renderer.drawSwitches(this.switches, time)

        this.renderer.drawPowers(this.powers, time)
        this.renderer.drawLasers(this.enemyManager.getLasers())
        this.renderer.drawTraps(this.enemyManager.getTraps())
        this.renderer.drawMines(this.enemyManager.getMines(), time)
        this.renderer.drawBullets(this.enemyManager.getBullets())
        this.renderer.drawShooters(this.enemyManager.getShooters())
        this.renderer.drawPatrols(this.enemyManager.getPatrols())
        this.renderer.drawFollowers(this.enemyManager.getFollowers())

        // Draw pixel scatter effect behind player
        if (this.pixelScatter) {
            this.renderer.drawPixelScatter(this.pixelScatter)
        }

        // Draw collection wave effect
        if (this.collectionWave) {
            this.renderer.drawCollectionWave(this.collectionWave)
        }

        // Draw mine explosion effects
        for (const explosion of this.mineExplosions) {
            this.renderer.drawMineExplosion(explosion)
        }

        // Draw explosion instead of player during death pause
        if (this.dead) {
            this.renderer.drawPlayerExplosion(this.explosion)
        } else {
            const playerScale = this.pixelScatter ? this.pixelScatter.getPlayerScale() : 1
            this.renderer.drawPlayerWithBoost(this.player, playerScale, time)
        }

        this.renderer.endFrame()
    }

    /**
     * Reset player position and clear enemies.
     */
    reset() {
        this.dead = false
        this.deathTimer = 0
        this.explosion = null
        this.collectionWave = null
        this.mineExplosions = []
        this.touchingExit = false
        this.inputManager.clearPendingInput()
        this.player.reset()
        this.pixelScatter = new PlayerWrapAnimation(this.player.x, this.player.y, true)
        this.audioManager.playSound(Constants.audio.sounds.wrapAround)
        this.enemyManager.clear()
        this.initPowers(this.levelData)   // Respawn powers
        this.initExit(this.levelData)     // Reinitialize exit (resets particle animation)
        this.initSwitches(this.levelData) // Reset switches
        this.camera.follow(this.player.x, this.player.y)
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
        this.enemyManager = new EnemyManager(this.grid, levelData.enemies, this.audioManager)
        this.collision = new Collision(Constants.game.physics)
        this.renderer = new Renderer(this.canvas, this.camera)
        this.powers = []             // Active powers (power-ups and power-downs)
        this.exit = null             // Exit portal (single per level, optional)
        this.switches = []           // Switches that unlock the exit
        this.pixelScatter = null     // Wrap pixel scatter effect
        this.collectionWave = null   // Collection wave effect
        this.mineExplosions = []     // Active mine explosion effects
        this.touchingExit = false    // True while player is on exit node
        this.initPowers(levelData)
        this.initExit(levelData)
        this.initSwitches(levelData)
    }

    /**
     * Initialize exit from level data.
     * @param {Object} levelData - Level configuration containing optional exit
     */
    initExit(levelData) {
        this.exit = levelData.exit ? new Exit(levelData.exit, this.grid) : null
    }

    /**
     * Set callback function for level completion.
     * @param {Function} callback - Function to call when level is completed
     */
    setOnLevelComplete(callback) {
        this.onLevelComplete = callback
    }

    /**
     * Handle level completion when player reaches open exit.
     */
    handleLevelComplete() {
        if (this.onLevelComplete) {
            this.onLevelComplete()
        }
    }

    /**
     * Initialize powers from level data.
     * @param {Object} levelData - Level configuration containing powerUps and powerDowns arrays
     */
    initPowers(levelData) {
        this.powers = []
        if (levelData.powerUps) {
            for (const config of levelData.powerUps) {
                this.powers.push(new Power(config, this.grid, false))
            }
        }
        if (levelData.powerDowns) {
            for (const config of levelData.powerDowns) {
                this.powers.push(new Power(config, this.grid, true))
            }
        }
    }

    /**
     * Initialize switches from level data.
     * @param {Object} levelData - Level configuration containing switches array
     */
    initSwitches(levelData) {
        this.switches = []
        if (levelData.switches) {
            for (const config of levelData.switches) {
                this.switches.push(new Switch(config, this.grid))
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
        this.running = true
        this.lastTime = performance.now() // Initialize to avoid large first-frame delta
        requestAnimationFrame((t) => this.gameLoop(t))
    }

    /**
     * Stop the game loop completely.
     */
    stop() {
        this.running = false
        window.removeEventListener(Constants.events.resize, this.boundResizeCanvas)
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
