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
        this.debugMode = false            // Debug overlay toggle (localhost only)
        this.glowEnabled = true           // Glow effects toggle

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
     * Set glow effects enabled state and propagate to renderer.
     * @param {boolean} enabled - Whether glow effects are enabled
     */
    setGlowEnabled(enabled) {
        this.glowEnabled = enabled
        if (this.renderer) {
            this.renderer.glowEnabled = enabled
        }
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

        // During exit animation, update animation and player position
        if (this.exiting) {
            this.exitAnimation.update(delta)
            const pos = this.exitAnimation.getPosition()
            this.player.x = pos.x
            this.player.y = pos.y
            this.camera.follow(this.player.x, this.player.y)
            if (this.exitAnimation.isComplete()) {
                if (this.onLevelComplete) {
                    this.onLevelComplete()
                }
            }
            return
        }

        // Accumulate run time only during live gameplay (not death, exit, or pause)
        this.runElapsed += delta

        this.processInput()
        const expiredEffects = this.player.update(delta)
        if (expiredEffects.length > 0) {
            this.audioManager.playSound(Constants.audio.sounds.powerExpired)
            // Reset music speed if fast or slow effect expired
            if (expiredEffects.includes(Constants.game.effects.fast.type) ||
                expiredEffects.includes(Constants.game.effects.slow.type)) {
                this.audioManager.setMusicSpeed(Constants.audio.musicSpeed.normal)
            }
        }
        if (!this.player.effectManager.hasEffect(Constants.game.effects.freeze.type)) {
            this.enemyManager.update(delta, this.player.targetRow, this.player.targetCol)
        }

        // Update exit animation
        if (this.exit) {
            this.exit.update(delta)
        }

        // Update portal animations
        for (const portal of this.portals) {
            portal.update(delta)
        }

        // Update wall opacity transitions
        for (const wall of this.walls) {
            wall.update(delta)
        }

        // Update switches and handle expiration
        for (const switchItem of this.switches) {
            if (switchItem.update(delta)) {
                // Switch TTL expired - close target
                const target = this.unlockables.get(switchItem.unlocks)
                if (target && typeof target.close === 'function') {
                    target.close()
                }
            }
        }

        // Create explosion animations for mines that just exploded
        for (const pos of this.enemyManager.getExplodedMinePositions()) {
            this.mineExplosions.push(new MineExplosionAnimation(pos.x, pos.y))
        }

        // Update camera zoom for zoom effect
        const zoomEffect = Constants.game.effects.zoom
        const isZoomed = this.player.effectManager.hasEffect(zoomEffect.type)
        this.camera.setTargetZoom(isZoomed ? zoomEffect.zoomLevel : 1)
        this.camera.update(delta, zoomEffect.zoomSpeed)

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
        if (this.playerWrap) {
            this.playerWrap.update(delta)
            if (this.playerWrap.isComplete()) {
                this.playerWrap = null
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
                if (this.exit.canExit()) {
                    this.audioManager.playSound(Constants.audio.sounds.levelFinished)
                }
            }
            if (this.exit.canExit()) {
                this.handleLevelComplete()
                return
            }
            // Closed exit: do nothing, player can walk through
        } else {
            this.touchingExit = false
        }

        // Check for portal teleportation
        if (this.portals.length > 0) {
            const portal = this.collision.checkPlayerPortalCollision(this.player, this.portals)
            if (portal && portal.partner && !this.portalCooldown) {
                const dest = portal.partner
                this.player.row = dest.row
                this.player.col = dest.col
                this.player.x = dest.x
                this.player.y = dest.y
                this.player.teleported = true
                this.player.wakeIntensity = 0
                this.portalCooldown = true
                this.inputManager.disable()
                this.audioManager.playSound(Constants.audio.sounds.wrapAround)
                const newPos = this.grid.getNodePosition(dest.row, dest.col)
                this.playerWrap = new PlayerWrapAnimation(newPos.x, newPos.y)
                this.camera.follow(this.player.x, this.player.y)
            } else if (!portal) {
                // Clear cooldown when player steps off all portals
                this.portalCooldown = false
            }
        }

        // Check for mine trigger (does not kill player, just starts countdown)
        // Mines cannot be triggered while freeze effect is active
        if (!this.player.effectManager.hasEffect(Constants.game.effects.freeze.type) &&
            this.collision.checkPlayerMineContact(this.player, this.enemyManager.getAllMines())) {
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
        const enemyHit = this.checkEnemyCollisions()
        if (enemyHit) {
            this.handleEnemyHit(enemyHit)
        }
    }

    /**
     * Check if player collides with any enemy.
     * @returns {string|null} Enemy type that hit the player, or null if no collision
     */
    checkEnemyCollisions() {
        const player = this.player
        const enemyManager = this.enemyManager
        const collision = this.collision

        if (collision.checkPlayerBulletCollision(player, enemyManager.getBullets())) return 'bullet'
        if (collision.checkPlayerLaserCollision(player, enemyManager.getLasers())) return 'laser'
        if (collision.checkPlayerTrapCollision(player, enemyManager.getTraps())) return 'trap'
        if (collision.checkPlayerShooterCollision(player, enemyManager.getShooters())) return 'shooter'
        if (collision.checkPlayerPatrolCollision(player, enemyManager.getPatrols())) return 'patrol'
        if (collision.checkPlayerFollowerCollision(player, enemyManager.getFollowers())) return 'follower'
        return null
    }

    /**
     * Handle player being hit by an enemy.
     * @param {string} cause - Enemy type that hit the player
     */
    handleEnemyHit(cause) {
        if (this.player.effectManager.handleCollision()) {
            // Effect absorbed the hit (shield broke, immunity granted)
            this.audioManager.playSound(Constants.audio.sounds.shieldBreak)
            this.ui.shake()
        } else if (!this.player.isImmune()) {
            // Normal death (not protected)
            this.deathCount++
            if (this.trackAnalytics) Analytics.trackPlayerDeath(this.levelData.id, cause, this.player.row, this.player.col)
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
        if (this.trackAnalytics) Analytics.trackPowerCollected(this.levelData.id, power.type)
        const effectType = power.type
        const effectConfig = { ...Constants.game.effects[effectType], duration: power.ttl }
        this.player.effectManager.addEffect(effectType, effectConfig)

        // Adjust music speed for speed effects
        if (effectType === Constants.game.effects.fast.type) {
            this.audioManager.setMusicSpeed(Constants.audio.musicSpeed.fast)
        } else if (effectType === Constants.game.effects.slow.type) {
            this.audioManager.setMusicSpeed(Constants.audio.musicSpeed.slow)
        }

        // Determine color for wave effect
        let waveColor
        if (power.isNegative) {
            this.audioManager.playSound(Constants.audio.sounds.powerDown)
            waveColor = Constants.game.colors.powerDown
        } else {
            this.audioManager.playSound(Constants.audio.sounds.powerUp)
            if (effectType === Constants.game.effects.shield.type) {
                waveColor = Constants.game.colors.shield
            } else if (effectType === Constants.game.effects.freeze.type) {
                waveColor = Constants.game.colors.freeze
            } else {
                waveColor = Constants.game.colors.powerUp
            }
        }

        this.collectionWave = new CollectionWaveAnimation(power.x, power.y, waveColor)
    }

    /**
     * Handle switch collection: unlock target, play sound, create wave animation.
     * @param {Switch} switchItem - The collected switch
     */
    handleSwitchCollection(switchItem) {
        switchItem.collect()
        if (this.trackAnalytics) Analytics.trackSwitchCollected(this.levelData.id, switchItem.unlocks)

        // Unlock the target by id
        const target = this.unlockables.get(switchItem.unlocks)
        if (target && typeof target.open === 'function') {
            target.open(switchItem.ttl)
        }

        // Play sound and create wave animation
        this.audioManager.playSound(Constants.audio.sounds.switchCollected)
        this.collectionWave = new CollectionWaveAnimation(switchItem.x, switchItem.y, Constants.game.colors.switch)
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
        // Block movement to nodes that lie on any wall
        if (this.isNodeBlockedByWall(wrapped.row, wrapped.col)) return

        this.player.moveTo(wrapped.row, wrapped.col, wrapped.wrapped)
        // Disable input briefly after wrapping to prevent rapid teleporting
        if (wrapped.wrapped) {
            this.inputManager.disable()
            this.audioManager.playSound(Constants.audio.sounds.wrapAround)
            // Spawn player wrap effect at arrival position
            const newPos = this.grid.getNodePosition(wrapped.row, wrapped.col)
            this.playerWrap = new PlayerWrapAnimation(newPos.x, newPos.y)
        }
    }

    /**
     * Render all game entities.
     * @param {number} time - Current animation timestamp for effects
     */
    render(time) {
        this.renderer.clear()
        this.renderer.drawGrid(this.grid)
        this.renderer.drawSpawnWarnings(this.enemyManager.getSpawnWarnings())
        this.renderer.drawWalls(this.walls)
        this.renderer.drawBullets(this.enemyManager.getBullets())

        // Draw exit portal (behind other entities)
        if (this.exit) {
            this.renderer.drawExit(this.exit)
        }

        // Draw portals (behind switches)
        this.renderer.drawPortals(this.portals)

        // Draw switch connection lines (behind switches)
        this.renderer.drawSwitchConnections(this.switches)

        // Draw switches
        this.renderer.drawSwitches(this.switches, time)

        this.renderer.drawPowers(this.powers, time)
        this.renderer.drawLasers(this.enemyManager.getLasers())
        this.renderer.drawTraps(this.enemyManager.getTraps())
        this.renderer.drawMines(this.enemyManager.getMines(), time)
        this.renderer.drawShooterCharges(this.enemyManager.getShooters())
        this.renderer.drawShooters(this.enemyManager.getShooters())
        this.renderer.drawPatrols(this.enemyManager.getPatrols())
        this.renderer.drawFollowers(this.enemyManager.getFollowers())

        // Draw freeze overlay on enemies
        if (this.player.effectManager.hasEffect(Constants.game.effects.freeze.type)) {
            this.renderer.drawFreezeOverlay(
                this.enemyManager.getBullets(),
                this.enemyManager.getShooters(),
                this.enemyManager.getPatrols(),
                this.enemyManager.getFollowers(),
                this.enemyManager.getMines(),
                this.enemyManager.getLasers(),
                this.enemyManager.getTraps()
            )
        }

        // Draw player wrap effect behind player
        if (this.playerWrap) {
            this.renderer.drawPlayerWrap(this.playerWrap)
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
        } else if (this.exiting) {
            const scale = this.exitAnimation.getScale()
            const opacity = this.exitAnimation.getOpacity()
            this.renderer.drawPlayerWithBoost(this.player, scale, time, opacity)
        } else {
            const playerScale = this.playerWrap ? this.playerWrap.getPlayerScale() : 1
            this.renderer.drawPlayerWithBoost(this.player, playerScale, time)
        }

        if (this.debugMode) {
            this.renderer.drawDebugNodeCoordinates(this.grid)
        }

        this.renderer.endFrame()
    }

    /**
     * Reset player position and clear enemies.
     */
    reset() {
        this.runElapsed = 0
        this.dead = false
        this.deathTimer = 0
        this.explosion = null
        this.collectionWave = null
        this.mineExplosions = []
        this.touchingExit = false
        this.exiting = false
        this.exitAnimation = null
        this.portalCooldown = false
        this.inputManager.clearPendingInput()
        this.player.reset()
        this.playerWrap = new PlayerWrapAnimation(this.player.x, this.player.y, true)
        this.audioManager.playSound(Constants.audio.sounds.wrapAround)
        this.audioManager.setMusicSpeed(Constants.audio.musicSpeed.normal)
        this.initWalls(this.levelData)    // Reinitialize walls
        this.enemyManager.walls = this.walls // Update walls reference before re-creating followers
        this.enemyManager.clear()
        this.initPowers(this.levelData)   // Respawn powers
        this.initExit(this.levelData)     // Reinitialize exit (resets particle animation)
        this.initSwitches(this.levelData) // Reset switches
        this.initPortals(this.levelData)  // Reinitialize portals
        this.registerUnlockables()        // Rebuild id-to-element map
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
        this.onLevelComplete = null // Clear old callback to prevent stale references
        this.onExitReached = null   // Clear old callback to prevent stale references
        this.grid = new Grid({ ...Constants.game.grid, ...levelData.grid })
        this.camera = new Camera(this.grid)
        this.player = new Player(this.grid, { ...Constants.game.player, ...levelData.player })
        this.collision = new Collision(Constants.game.physics)
        this.renderer = new Renderer(this.canvas, this.camera)
        this.renderer.glowEnabled = this.glowEnabled
        this.powers = []             // Active powers (power-ups and power-downs)
        this.exit = null             // Exit portal (single per level, optional)
        this.switches = []           // Switches that unlock the exit
        this.walls = []              // Static walls that block movement
        this.portals = []            // Portal pairs for teleportation
        this.portalCooldown = false  // True while player stands on a portal after teleporting
        this.unlockables = new Map() // Id-to-element lookup for switch targeting
        this.playerWrap = null       // Player wrap effect
        this.collectionWave = null   // Collection wave effect
        this.mineExplosions = []     // Active mine explosion effects
        this.touchingExit = false    // True while player is on exit node
        this.exiting = false         // True during exit warp animation
        this.exitAnimation = null    // Exit warp animation instance
        this.deathCount = 0          // Number of deaths in current level
        this.startTime = 0           // Level start timestamp (ms)
        this.runElapsed = 0          // Elapsed time for current run in ms (resets on death/restart)
        this.initWalls(levelData)
        this.enemyManager = new EnemyManager(this.grid, levelData.enemies, this.audioManager, this.walls)
        this.initPowers(levelData)
        this.initExit(levelData)
        this.initSwitches(levelData)
        this.initPortals(levelData)
        this.registerUnlockables()
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
     * Set callback function for when player reaches the exit.
     * @param {Function} callback - Function to call when player touches open exit
     */
    setOnExitReached(callback) {
        this.onExitReached = callback
    }

    /**
     * Handle level completion when player reaches open exit.
     * Calls onExitReached immediately, then starts exit animation.
     * onLevelComplete is called when animation completes.
     */
    handleLevelComplete() {
        if (this.onExitReached) {
            this.onExitReached()
        }
        this.exiting = true
        this.player.wakeIntensity = 0
        this.exitAnimation = new PlayerExitAnimation(
            this.player.x,
            this.player.y,
            this.exit.x,
            this.exit.y
        )
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
     * Initialize walls from level data.
     * @param {Object} levelData - Level configuration containing walls array
     */
    initWalls(levelData) {
        this.walls = []
        if (levelData.walls) {
            for (const config of levelData.walls) {
                this.walls.push(new Wall(this.grid, config))
            }
        }
    }

    /**
     * Initialize portals from level data and pair them by group.
     * @param {Object} levelData - Level configuration containing optional portals array
     */
    initPortals(levelData) {
        this.portals = []
        this.portalCooldown = false
        if (!levelData.portals) return

        // Create portal instances
        for (const config of levelData.portals) {
            this.portals.push(new Portal(config, this.grid))
        }

        // Pair portals by group
        const groups = new Map()
        for (const portal of this.portals) {
            const list = groups.get(portal.group) || []
            list.push(portal)
            groups.set(portal.group, list)
        }
        for (const pair of groups.values()) {
            if (pair.length === 2) {
                pair[0].partner = pair[1]
                pair[1].partner = pair[0]
            }
        }
    }

    /**
     * Register elements with ids in the unlockables map for switch targeting.
     */
    registerUnlockables() {
        this.unlockables.clear()
        if (this.exit && this.exit.id) {
            this.unlockables.set(this.exit.id, this.exit)
        }
        for (const wall of this.walls) {
            if (wall.id) {
                this.unlockables.set(wall.id, wall)
            }
        }
        for (const enemy of this.enemyManager.getAllEnemies()) {
            if (enemy.id) {
                this.unlockables.set(enemy.id, enemy)
            }
        }
    }

    /**
     * Check if any wall blocks movement to a target node.
     * A wall blocks a node if the node lies on the wall's path.
     * @param {number} row - Target row
     * @param {number} col - Target column
     * @returns {boolean} True if a wall blocks this node
     */
    isNodeBlockedByWall(row, col) {
        for (const wall of this.walls) {
            if (wall.containsNode(row, col)) {
                return true
            }
        }
        return false
    }

    /**
     * Start a new game with the given level.
     * @param {Object} levelData - Level configuration from JSON
     * @param {boolean} [trackAnalytics=true] - Whether to send in-game analytics events
     */
    start(levelData, trackAnalytics = true) {
        this.trackAnalytics = trackAnalytics
        if (this.running) return
        this.init(levelData)
        this.resizeCanvas()
        this.reset()
        this.running = true
        this.deathCount = 0
        this.startTime = performance.now()
        this.lastTime = this.startTime // Initialize to avoid large first-frame delta
        window.addEventListener(Constants.events.resize, this.boundResizeCanvas)
        requestAnimationFrame((t) => this.gameLoop(t))
    }

    /**
     * Stop the game loop completely.
     */
    stop() {
        this.running = false
        this.audioManager.setMusicSpeed(Constants.audio.musicSpeed.normal)
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
