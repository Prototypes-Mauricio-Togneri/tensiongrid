/**
 * Canvas renderer with cyberpunk visual effects.
 * Handles drawing grid, player, enemies with glows, shadows, and gradients.
 */
class Renderer {
    /**
     * @param {HTMLCanvasElement} canvas - Game canvas element
     * @param {Camera} camera - Camera for coordinate transforms
     */
    constructor(canvas, camera) {
        this.canvas = canvas                   // Canvas element
        this.ctx = canvas.getContext('2d')     // 2D rendering context
        this.colors = Constants.game.colors    // Color palette reference
        this.camera = camera                   // Camera for world-to-screen transforms
    }

    /**
     * Update camera reference (called when game reinitializes).
     * @param {Camera} camera - New camera instance
     */
    setCamera(camera) {
        this.camera = camera
    }

    /**
     * Convert world coordinates to screen coordinates.
     * @param {number} worldX - X position in world space
     * @param {number} worldY - Y position in world space
     * @returns {Object} Screen coordinates {x, y}
     */
    toScreen(worldX, worldY) {
        if (!this.camera) {
            return { x: worldX, y: worldY }
        }
        return this.camera.worldToScreen(worldX, worldY)
    }

    /**
     * Clear the canvas.
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    /**
     * Append alpha value to hex color string.
     * @param {string} hex - Base hex color (e.g., '#ffffff')
     * @param {number} alpha - Alpha value 0-1
     * @returns {string} Hex color with alpha (e.g., '#ffffff80')
     */
    hexWithAlpha(hex, alpha) {
        const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0')
        return hex + alphaHex
    }

    /**
     * Draw the grid with edges, edge glows, and nodes.
     * @param {Grid} grid - Grid instance to draw
     */
    drawGrid(grid) {
        const ctx = this.ctx

        // Draw edge glows first (wider, semi-transparent)
        ctx.strokeStyle = this.colors.edgeGlow
        ctx.lineWidth = 8
        ctx.lineCap = 'round'

        // Horizontal edge glows
        for (let row = 0; row < grid.height; row++) {
            for (let col = 0; col < grid.width - 1; col++) {
                if (grid.isExcluded(row, col) || grid.isExcluded(row, col + 1) || grid.isEdgeExcluded(row, col, row, col + 1)) continue
                const p1World = grid.getNodePosition(row, col)
                const p2World = grid.getNodePosition(row, col + 1)
                const p1 = this.toScreen(p1World.x, p1World.y)
                const p2 = this.toScreen(p2World.x, p2World.y)
                this.drawLine(p1, p2)
            }
        }

        // Vertical edge glows
        for (let row = 0; row < grid.height - 1; row++) {
            for (let col = 0; col < grid.width; col++) {
                if (grid.isExcluded(row, col) || grid.isExcluded(row + 1, col) || grid.isEdgeExcluded(row, col, row + 1, col)) continue
                const p1World = grid.getNodePosition(row, col)
                const p2World = grid.getNodePosition(row + 1, col)
                const p1 = this.toScreen(p1World.x, p1World.y)
                const p2 = this.toScreen(p2World.x, p2World.y)
                this.drawLine(p1, p2)
            }
        }

        // Draw main edges (thinner, more opaque)
        ctx.strokeStyle = this.colors.edge
        ctx.lineWidth = grid.edgeWidth

        // Horizontal edges
        for (let row = 0; row < grid.height; row++) {
            for (let col = 0; col < grid.width - 1; col++) {
                if (grid.isExcluded(row, col) || grid.isExcluded(row, col + 1) || grid.isEdgeExcluded(row, col, row, col + 1)) continue
                const p1World = grid.getNodePosition(row, col)
                const p2World = grid.getNodePosition(row, col + 1)
                const p1 = this.toScreen(p1World.x, p1World.y)
                const p2 = this.toScreen(p2World.x, p2World.y)
                this.drawLine(p1, p2)
            }
        }

        // Vertical edges
        for (let row = 0; row < grid.height - 1; row++) {
            for (let col = 0; col < grid.width; col++) {
                if (grid.isExcluded(row, col) || grid.isExcluded(row + 1, col) || grid.isEdgeExcluded(row, col, row + 1, col)) continue
                const p1World = grid.getNodePosition(row, col)
                const p2World = grid.getNodePosition(row + 1, col)
                const p1 = this.toScreen(p1World.x, p1World.y)
                const p2 = this.toScreen(p2World.x, p2World.y)
                this.drawLine(p1, p2)
            }
        }

        // Draw nodes
        for (let row = 0; row < grid.height; row++) {
            for (let col = 0; col < grid.width; col++) {
                if (grid.isExcluded(row, col)) continue
                const posWorld = grid.getNodePosition(row, col)
                const pos = this.toScreen(posWorld.x, posWorld.y)

                // Main node circle
                ctx.beginPath()
                ctx.arc(pos.x, pos.y, grid.nodeRadius, 0, Math.PI * 2)
                ctx.fillStyle = this.colors.node
                ctx.fill()

                // Inner highlight (small offset circle for 3D effect)
                ctx.beginPath()
                ctx.arc(pos.x - 2, pos.y - 2, grid.nodeRadius * 0.4, 0, Math.PI * 2)
                ctx.fillStyle = this.colors.nodeHighlight
                ctx.fill()
            }
        }
    }

    /**
     * Draw the player with wake effect, glow, and inner highlight.
     * @param {Player} player - Player instance to draw
     */
    drawPlayer(player) {
        const ctx = this.ctx
        const pos = this.toScreen(player.x, player.y)

        // Draw tapered wake trail behind player
        if (player.wakeIntensity > 0.01) {
            const dx = player.wakeStartX - player.x
            const dy = player.wakeStartY - player.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist > 1) {
                const dirX = dx / dist
                const dirY = dy / dist

                const wakeStart = this.toScreen(player.wakeStartX, player.wakeStartY)

                // Gradient from player (bright) to wake end (transparent)
                const gradient = ctx.createLinearGradient(pos.x, pos.y, wakeStart.x, wakeStart.y)
                gradient.addColorStop(0, this.hexWithAlpha(this.colors.player, 0.6 * player.wakeIntensity))
                gradient.addColorStop(0.5, this.hexWithAlpha(this.colors.player, 0.25 * player.wakeIntensity))
                gradient.addColorStop(1, this.colors.playerWakeEnd)

                ctx.save()
                ctx.shadowColor = this.colors.playerWakeShadow
                ctx.shadowBlur = 10 * player.wakeIntensity

                // Calculate perpendicular for wake width
                const perpX = -dirY
                const perpY = dirX
                const startWidth = player.size * 0.5
                const endWidth = player.size * 0.1

                // Draw tapered quad shape
                ctx.beginPath()
                ctx.moveTo(pos.x + perpX * startWidth, pos.y + perpY * startWidth)
                ctx.lineTo(pos.x - perpX * startWidth, pos.y - perpY * startWidth)
                ctx.lineTo(wakeStart.x - perpX * endWidth, wakeStart.y - perpY * endWidth)
                ctx.lineTo(wakeStart.x + perpX * endWidth, wakeStart.y + perpY * endWidth)
                ctx.closePath()
                ctx.fillStyle = gradient
                ctx.fill()
                ctx.restore()
            }
        }

        // Outer glow (larger, transparent rhombus)
        ctx.save()
        ctx.shadowColor = this.colors.player
        ctx.shadowBlur = 20
        this.drawRhombus(pos.x, pos.y, player.size + 4, this.colors.playerGlow)
        ctx.restore()

        // Main player rhombus
        ctx.save()
        ctx.shadowColor = this.colors.player
        ctx.shadowBlur = 15
        this.drawRhombus(pos.x, pos.y, player.size, this.colors.player)
        ctx.restore()

        // Inner highlight (smaller rhombus offset upward)
        ctx.fillStyle = this.colors.playerHighlight
        ctx.beginPath()
        ctx.moveTo(pos.x, pos.y - player.size * 0.5)
        ctx.lineTo(pos.x + player.size * 0.3, pos.y)
        ctx.lineTo(pos.x, pos.y + player.size * 0.2)
        ctx.lineTo(pos.x - player.size * 0.3, pos.y)
        ctx.closePath()
        ctx.fill()
    }

    /**
     * Draw enemy bullets with wake effects, threat rings, and glows.
     * @param {EnemyBullet[]} enemies - Array of bullet instances
     */
    drawBullets(enemies) {
        const ctx = this.ctx

        for (const enemy of enemies) {
            const size = enemy.size
            const pos = this.toScreen(enemy.x, enemy.y)

            // Draw tapered wake trail behind bullet
            if (enemy.wakeIntensity > 0.01) {
                const dx = enemy.wakeStartX - enemy.x
                const dy = enemy.wakeStartY - enemy.y
                const dist = Math.sqrt(dx * dx + dy * dy)

                if (dist > 1) {
                    const dirX = dx / dist
                    const dirY = dy / dist

                    const wakeStart = this.toScreen(enemy.wakeStartX, enemy.wakeStartY)

                    // Gradient from enemy (bright) to wake end (transparent)
                    const gradient = ctx.createLinearGradient(pos.x, pos.y, wakeStart.x, wakeStart.y)
                    gradient.addColorStop(0, this.hexWithAlpha(this.colors.enemy, 0.6 * enemy.wakeIntensity))
                    gradient.addColorStop(0.5, this.hexWithAlpha(this.colors.enemy, 0.25 * enemy.wakeIntensity))
                    gradient.addColorStop(1, this.colors.enemyWakeEnd)

                    ctx.save()
                    ctx.shadowColor = this.colors.enemyWakeShadow
                    ctx.shadowBlur = 10 * enemy.wakeIntensity

                    // Calculate perpendicular for wake width
                    const perpX = -dirY
                    const perpY = dirX
                    const startWidth = size * 0.5
                    const endWidth = size * 0.1

                    // Draw tapered quad shape
                    ctx.beginPath()
                    ctx.moveTo(pos.x + perpX * startWidth, pos.y + perpY * startWidth)
                    ctx.lineTo(pos.x - perpX * startWidth, pos.y - perpY * startWidth)
                    ctx.lineTo(wakeStart.x - perpX * endWidth, wakeStart.y - perpY * endWidth)
                    ctx.lineTo(wakeStart.x + perpX * endWidth, wakeStart.y + perpY * endWidth)
                    ctx.closePath()
                    ctx.fillStyle = gradient
                    ctx.fill()
                    ctx.restore()
                }
            }

            // Threat ring (subtle danger indicator around bullet)
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, size + 10, 0, Math.PI * 2)
            ctx.fillStyle = this.colors.enemyThreatRing
            ctx.fill()

            // Outer glow
            ctx.save()
            ctx.shadowColor = Constants.game.colors.enemy
            ctx.shadowBlur = 8
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, size + 3, 0, Math.PI * 2)
            ctx.fillStyle = Constants.game.colors.enemyGlow
            ctx.fill()
            ctx.restore()

            // Main enemy circle
            ctx.save()
            ctx.shadowColor = Constants.game.colors.enemy
            ctx.shadowBlur = 5
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2)
            ctx.fillStyle = Constants.game.colors.enemy
            ctx.fill()
            ctx.restore()

            // Inner highlight (small offset for 3D effect)
            ctx.beginPath()
            ctx.arc(pos.x - size * 0.3, pos.y - size * 0.3, size * 0.35, 0, Math.PI * 2)
            ctx.fillStyle = this.colors.enemyHighlight
            ctx.fill()
        }
    }

    /**
     * Draw a line between two screen-space points.
     * @param {Object} p1 - Start point {x, y}
     * @param {Object} p2 - End point {x, y}
     */
    drawLine(p1, p2) {
        this.ctx.beginPath()
        this.ctx.moveTo(p1.x, p1.y)
        this.ctx.lineTo(p2.x, p2.y)
        this.ctx.stroke()
    }

    /**
     * Draw a filled rhombus (diamond) shape.
     * @param {number} x - Center X position
     * @param {number} y - Center Y position
     * @param {number} size - Distance from center to each vertex
     * @param {string} color - Fill color
     */
    drawRhombus(x, y, size, color) {
        this.ctx.fillStyle = color
        this.ctx.beginPath()
        this.ctx.moveTo(x, y - size)      // Top
        this.ctx.lineTo(x + size, y)      // Right
        this.ctx.lineTo(x, y + size)      // Bottom
        this.ctx.lineTo(x - size, y)      // Left
        this.ctx.closePath()
        this.ctx.fill()
    }

    /**
     * Draw lasers with pulsing glow effect.
     * @param {EnemyLaser[]} lasers - Array of laser instances
     * @param {number} time - Current animation timestamp for pulse calculation
     */
    drawLasers(lasers, time) {
        const ctx = this.ctx

        // Calculate pulse intensity based on time (sine wave oscillation)
        const pulseSpeed = 0.003
        const pulseIntensity = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * pulseSpeed))

        for (const laser of lasers) {
            const positions = laser.getWorldPositions()
            const start = this.toScreen(positions.start.x, positions.start.y)
            const end = this.toScreen(positions.end.x, positions.end.y)
            const isActive = laser.isActive()

            // Apply reduced opacity for inactive lasers
            ctx.save()
            if (!isActive) {
                ctx.globalAlpha = 0.3
            }

            // Outer glow (wide, semi-transparent)
            ctx.save()
            ctx.strokeStyle = this.colors.laserGlow
            ctx.lineWidth = 12 * pulseIntensity
            ctx.lineCap = 'round'
            ctx.shadowColor = this.colors.laser
            ctx.shadowBlur = 20 * pulseIntensity
            ctx.beginPath()
            ctx.moveTo(start.x, start.y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
            ctx.restore()

            // Main laser line (thin core)
            ctx.save()
            ctx.strokeStyle = this.colors.laser
            ctx.lineWidth = 3
            ctx.lineCap = 'round'
            ctx.shadowColor = this.colors.laser
            ctx.shadowBlur = 10 * pulseIntensity
            ctx.globalAlpha = (isActive ? 0.7 + 0.3 * pulseIntensity : 0.3)
            ctx.beginPath()
            ctx.moveTo(start.x, start.y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
            ctx.restore()

            ctx.restore() // Restore opacity
        }
    }

    /**
     * Draw traps with pulsing 4-pointed spike effect.
     * Inactive traps are rendered dimmed.
     * @param {EnemyTrap[]} traps - Array of trap instances
     * @param {number} time - Current animation timestamp for pulse calculation
     */
    drawTraps(traps, time) {
        const ctx = this.ctx

        // Calculate pulse intensity based on time (sine wave oscillation)
        const pulseSpeed = 0.004
        const pulseIntensity = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(time * pulseSpeed))

        for (const trap of traps) {
            const pos = this.toScreen(trap.x, trap.y)
            const size = trap.size * pulseIntensity
            const innerSize = size * 0.35 // Inner points are shorter
            const isActive = trap.isActive()

            // Apply reduced opacity for inactive traps
            ctx.save()
            if (!isActive) {
                ctx.globalAlpha = 0.3
            }

            // Outer glow
            ctx.save()
            ctx.shadowColor = this.colors.trap
            ctx.shadowBlur = 15 * pulseIntensity
            ctx.fillStyle = this.colors.trapGlow
            this.drawSpike(pos.x, pos.y, size + 4, innerSize + 2)
            ctx.restore()

            // Main spike shape
            ctx.save()
            ctx.shadowColor = this.colors.trap
            ctx.shadowBlur = 8 * pulseIntensity
            ctx.fillStyle = this.colors.trap
            this.drawSpike(pos.x, pos.y, size, innerSize)
            ctx.restore()

            // Inner highlight
            ctx.fillStyle = this.colors.enemyHighlight
            this.drawSpike(pos.x, pos.y, size * 0.5, innerSize * 0.5)

            ctx.restore() // Restore opacity
        }
    }

    /**
     * Draw a 4-pointed spike (star) shape.
     * @param {number} x - Center X position
     * @param {number} y - Center Y position
     * @param {number} outerSize - Distance from center to outer points
     * @param {number} innerSize - Distance from center to inner points
     */
    drawSpike(x, y, outerSize, innerSize) {
        const ctx = this.ctx
        ctx.beginPath()
        // Start at top point
        ctx.moveTo(x, y - outerSize)
        // Top-right inner
        ctx.lineTo(x + innerSize, y - innerSize)
        // Right point
        ctx.lineTo(x + outerSize, y)
        // Bottom-right inner
        ctx.lineTo(x + innerSize, y + innerSize)
        // Bottom point
        ctx.lineTo(x, y + outerSize)
        // Bottom-left inner
        ctx.lineTo(x - innerSize, y + innerSize)
        // Left point
        ctx.lineTo(x - outerSize, y)
        // Top-left inner
        ctx.lineTo(x - innerSize, y - innerSize)
        ctx.closePath()
        ctx.fill()
    }

    /**
     * Draw mines with visual state indication.
     * Dormant: subtle pulse, Triggered: accelerating blink, Exploded: not drawn.
     * @param {EnemyMine[]} mines - Array of mine instances
     * @param {number} time - Current animation timestamp for effects
     */
    drawMines(mines, time) {
        const ctx = this.ctx

        // Base pulse (subtle when dormant)
        const basePulse = 0.8 + 0.2 * (0.5 + 0.5 * Math.sin(time * 0.003))

        for (const mine of mines) {
            if (mine.isExploded()) continue

            const pos = this.toScreen(mine.x, mine.y)
            const blinkIntensity = mine.getBlinkIntensity()
            const size = mine.size * basePulse

            ctx.save()
            ctx.globalAlpha = blinkIntensity

            // Outer glow
            ctx.save()
            ctx.shadowColor = this.colors.mine
            ctx.shadowBlur = 15 * blinkIntensity
            ctx.fillStyle = this.colors.mineGlow
            this.drawHexagon(pos.x, pos.y, size + 4)
            ctx.restore()

            // Main mine shape (hexagon for visual distinction)
            ctx.save()
            ctx.shadowColor = this.colors.mine
            ctx.shadowBlur = 8 * blinkIntensity
            ctx.fillStyle = this.colors.mine
            this.drawHexagon(pos.x, pos.y, size)
            ctx.restore()

            // Inner highlight
            ctx.fillStyle = '#ffffff33'
            this.drawHexagon(pos.x, pos.y, size * 0.4)

            ctx.restore()
        }
    }

    /**
     * Draw a hexagon shape with pointy top.
     * @param {number} x - Center X position
     * @param {number} y - Center Y position
     * @param {number} size - Distance from center to vertices
     */
    drawHexagon(x, y, size) {
        const ctx = this.ctx
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2 // Start at top (pointy)
            const px = x + size * Math.cos(angle)
            const py = y + size * Math.sin(angle)
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fill()
    }

    /**
     * Draw a hexagon shape with flat top.
     * @param {number} x - Center X position
     * @param {number} y - Center Y position
     * @param {number} size - Distance from center to vertices
     */
    drawFlatHexagon(x, y, size) {
        const ctx = this.ctx
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i // Start at right (flat top)
            const px = x + size * Math.cos(angle)
            const py = y + size * Math.sin(angle)
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fill()
    }

    /**
     * Draw shooters with arms only for active directions.
     * @param {EnemyShooter[]} shooters - Array of shooter instances
     * @param {number} time - Current animation timestamp (unused, kept for consistency)
     */
    drawShooters(shooters, time) {
        const ctx = this.ctx

        for (const shooter of shooters) {
            const pos = this.toScreen(shooter.x, shooter.y)
            const size = shooter.size
            const armWidth = Constants.game.enemies.shooter.armWidth
            const directions = shooter.getActiveDirections()
            const hubRadius = armWidth * 1.2 // Center hub size

            ctx.save()
            ctx.translate(pos.x, pos.y)
            ctx.rotate(shooter.getRotation())

            // Outer glow - arms
            ctx.save()
            ctx.shadowColor = this.colors.shooter
            ctx.shadowBlur = 15
            ctx.fillStyle = this.colors.shooterGlow
            this.drawArms(0, 0, size + 3, armWidth + 2, directions)
            ctx.restore()

            // Outer glow - center hub
            ctx.save()
            ctx.shadowColor = this.colors.shooter
            ctx.shadowBlur = 15
            ctx.fillStyle = this.colors.shooterGlow
            ctx.beginPath()
            ctx.arc(0, 0, hubRadius + 2, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()

            // Main arms
            ctx.save()
            ctx.shadowColor = this.colors.shooter
            ctx.shadowBlur = 8
            ctx.fillStyle = this.colors.shooter
            this.drawArms(0, 0, size, armWidth, directions)
            ctx.restore()

            // Main center hub
            ctx.save()
            ctx.shadowColor = this.colors.shooter
            ctx.shadowBlur = 8
            ctx.fillStyle = this.colors.shooter
            ctx.beginPath()
            ctx.arc(0, 0, hubRadius, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()

            // Inner highlight - center hub only
            ctx.fillStyle = '#ffffff33'
            ctx.beginPath()
            ctx.arc(0, 0, hubRadius * 0.5, 0, Math.PI * 2)
            ctx.fill()

            ctx.restore() // Restore translation and rotation
        }
    }

    /**
     * Draw tapered barrel arms for active directions only.
     * Arms are wider at the center hub and narrow toward the tip.
     * @param {number} x - Center X (0 when pre-translated)
     * @param {number} y - Center Y (0 when pre-translated)
     * @param {number} armLength - Length from center to arm tip
     * @param {number} armWidth - Width at base of each arm
     * @param {string[]} directions - Active direction keys
     */
    drawArms(x, y, armLength, armWidth, directions) {
        const ctx = this.ctx
        const baseWidth = armWidth          // Width at center hub
        const tipWidth = armWidth * 0.4     // Width at tip (tapered)

        for (const dir of directions) {
            ctx.beginPath()
            switch (dir) {
                case 'up':
                    // Trapezoid pointing up
                    ctx.moveTo(x - baseWidth / 2, y)
                    ctx.lineTo(x + baseWidth / 2, y)
                    ctx.lineTo(x + tipWidth / 2, y - armLength)
                    ctx.lineTo(x - tipWidth / 2, y - armLength)
                    break
                case 'down':
                    // Trapezoid pointing down
                    ctx.moveTo(x - baseWidth / 2, y)
                    ctx.lineTo(x + baseWidth / 2, y)
                    ctx.lineTo(x + tipWidth / 2, y + armLength)
                    ctx.lineTo(x - tipWidth / 2, y + armLength)
                    break
                case 'left':
                    // Trapezoid pointing left
                    ctx.moveTo(x, y - baseWidth / 2)
                    ctx.lineTo(x, y + baseWidth / 2)
                    ctx.lineTo(x - armLength, y + tipWidth / 2)
                    ctx.lineTo(x - armLength, y - tipWidth / 2)
                    break
                case 'right':
                    // Trapezoid pointing right
                    ctx.moveTo(x, y - baseWidth / 2)
                    ctx.lineTo(x, y + baseWidth / 2)
                    ctx.lineTo(x + armLength, y + tipWidth / 2)
                    ctx.lineTo(x + armLength, y - tipWidth / 2)
                    break
            }
            ctx.closePath()
            ctx.fill()
        }
    }

    /**
     * Draw patrols with wake trail and glow effects.
     * @param {EnemyPatrol[]} patrols - Array of patrol instances
     */
    drawPatrols(patrols) {
        const ctx = this.ctx

        for (const patrol of patrols) {
            const pos = this.toScreen(patrol.x, patrol.y)
            const size = patrol.size

            // Draw tapered wake trail behind patrol
            if (patrol.wakeIntensity > 0.01) {
                const dx = patrol.wakeStartX - patrol.x
                const dy = patrol.wakeStartY - patrol.y
                const dist = Math.sqrt(dx * dx + dy * dy)

                if (dist > 1) {
                    const dirX = dx / dist
                    const dirY = dy / dist

                    const wakeStart = this.toScreen(patrol.wakeStartX, patrol.wakeStartY)

                    // Gradient from patrol (bright) to wake end (transparent)
                    const gradient = ctx.createLinearGradient(pos.x, pos.y, wakeStart.x, wakeStart.y)
                    gradient.addColorStop(0, this.hexWithAlpha(this.colors.patrol, 0.6 * patrol.wakeIntensity))
                    gradient.addColorStop(0.5, this.hexWithAlpha(this.colors.patrol, 0.25 * patrol.wakeIntensity))
                    gradient.addColorStop(1, this.hexWithAlpha(this.colors.patrol, 0))

                    ctx.save()
                    ctx.shadowColor = this.hexWithAlpha(this.colors.patrol, 0.5)
                    ctx.shadowBlur = 10 * patrol.wakeIntensity

                    // Calculate perpendicular for wake width
                    const perpX = -dirY
                    const perpY = dirX
                    const startWidth = size * 0.5
                    const endWidth = size * 0.1

                    // Draw tapered quad shape
                    ctx.beginPath()
                    ctx.moveTo(pos.x + perpX * startWidth, pos.y + perpY * startWidth)
                    ctx.lineTo(pos.x - perpX * startWidth, pos.y - perpY * startWidth)
                    ctx.lineTo(wakeStart.x - perpX * endWidth, wakeStart.y - perpY * endWidth)
                    ctx.lineTo(wakeStart.x + perpX * endWidth, wakeStart.y + perpY * endWidth)
                    ctx.closePath()
                    ctx.fillStyle = gradient
                    ctx.fill()
                    ctx.restore()
                }
            }

            // Outer glow
            ctx.save()
            ctx.shadowColor = this.colors.patrol
            ctx.shadowBlur = 15
            ctx.fillStyle = this.colors.patrolGlow
            this.drawFlatHexagon(pos.x, pos.y, size + 4)
            ctx.restore()

            // Main patrol shape
            ctx.save()
            ctx.shadowColor = this.colors.patrol
            ctx.shadowBlur = 8
            ctx.fillStyle = this.colors.patrol
            this.drawFlatHexagon(pos.x, pos.y, size)
            ctx.restore()

            // Inner highlight
            ctx.fillStyle = '#ffffff33'
            this.drawFlatHexagon(pos.x, pos.y, size * 0.4)
        }
    }

    /**
     * Draw snakes as continuous thick lines with rounded ends.
     * @param {EnemySnake[]} snakes - Array of snake instances
     */
    drawSnakes(snakes) {
        const ctx = this.ctx

        for (const snake of snakes) {
            const path = snake.getBodyPath()
            if (path.length < 2) continue

            const lineWidth = snake.size * 2

            // Outer glow
            ctx.save()
            ctx.strokeStyle = this.colors.snakeGlow
            ctx.lineWidth = lineWidth + 6
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.shadowColor = this.colors.snake
            ctx.shadowBlur = 15
            this.drawPathLine(path)
            ctx.restore()

            // Main body
            ctx.save()
            ctx.strokeStyle = this.colors.snake
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.shadowColor = this.colors.snake
            ctx.shadowBlur = 8
            this.drawPathLine(path)
            ctx.restore()

            // Inner highlight line
            ctx.save()
            ctx.strokeStyle = '#ffffff33'
            ctx.lineWidth = lineWidth * 0.4
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            this.drawPathLine(path)
            ctx.restore()
        }
    }

    /**
     * Draw a path as a smooth stroked line using quadratic curves.
     * @param {Array<{x: number, y: number}>} path - Array of world positions
     */
    drawPathLine(path) {
        const ctx = this.ctx
        if (path.length < 2) return

        ctx.beginPath()
        const first = this.toScreen(path[0].x, path[0].y)
        ctx.moveTo(first.x, first.y)

        if (path.length === 2) {
            const second = this.toScreen(path[1].x, path[1].y)
            ctx.lineTo(second.x, second.y)
        } else {
            // Use quadratic curves through midpoints for smooth corners
            for (let i = 1; i < path.length - 1; i++) {
                const curr = this.toScreen(path[i].x, path[i].y)
                const next = this.toScreen(path[i + 1].x, path[i + 1].y)
                const midX = (curr.x + next.x) / 2
                const midY = (curr.y + next.y) / 2
                ctx.quadraticCurveTo(curr.x, curr.y, midX, midY)
            }
            // Draw to the last point
            const last = this.toScreen(path[path.length - 1].x, path[path.length - 1].y)
            ctx.lineTo(last.x, last.y)
        }
        ctx.stroke()
    }

    /**
     * Draw a pentagon shape.
     * @param {number} x - Center X position
     * @param {number} y - Center Y position
     * @param {number} size - Distance from center to vertices
     */
    drawPentagon(x, y, size) {
        const ctx = this.ctx
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i - Math.PI / 2 // Start at top
            const px = x + size * Math.cos(angle)
            const py = y + size * Math.sin(angle)
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fill()
    }

    /**
     * Draw followers as rotating triangles with wake trail and glow effects.
     * @param {EnemyFollower[]} followers - Array of follower instances
     */
    drawFollowers(followers) {
        const ctx = this.ctx

        for (const follower of followers) {
            const pos = this.toScreen(follower.x, follower.y)
            const size = follower.size

            // Draw tapered wake trail behind follower
            if (follower.wakeIntensity > 0.01) {
                const dx = follower.wakeStartX - follower.x
                const dy = follower.wakeStartY - follower.y
                const dist = Math.sqrt(dx * dx + dy * dy)

                if (dist > 1) {
                    const dirX = dx / dist
                    const dirY = dy / dist

                    const wakeStart = this.toScreen(follower.wakeStartX, follower.wakeStartY)

                    // Gradient from follower (bright) to wake end (transparent)
                    const gradient = ctx.createLinearGradient(pos.x, pos.y, wakeStart.x, wakeStart.y)
                    gradient.addColorStop(0, this.hexWithAlpha(this.colors.follower, 0.6 * follower.wakeIntensity))
                    gradient.addColorStop(0.5, this.hexWithAlpha(this.colors.follower, 0.25 * follower.wakeIntensity))
                    gradient.addColorStop(1, this.hexWithAlpha(this.colors.follower, 0))

                    ctx.save()
                    ctx.shadowColor = this.hexWithAlpha(this.colors.follower, 0.5)
                    ctx.shadowBlur = 10 * follower.wakeIntensity

                    // Calculate perpendicular for wake width
                    const perpX = -dirY
                    const perpY = dirX
                    const startWidth = size * 0.5
                    const endWidth = size * 0.1

                    // Draw tapered quad shape
                    ctx.beginPath()
                    ctx.moveTo(pos.x + perpX * startWidth, pos.y + perpY * startWidth)
                    ctx.lineTo(pos.x - perpX * startWidth, pos.y - perpY * startWidth)
                    ctx.lineTo(wakeStart.x - perpX * endWidth, wakeStart.y - perpY * endWidth)
                    ctx.lineTo(wakeStart.x + perpX * endWidth, wakeStart.y + perpY * endWidth)
                    ctx.closePath()
                    ctx.fillStyle = gradient
                    ctx.fill()
                    ctx.restore()
                }
            }

            // Draw rotated triangle
            ctx.save()
            ctx.translate(pos.x, pos.y)
            ctx.rotate(follower.getRotation())

            // Outer glow
            ctx.save()
            ctx.shadowColor = this.colors.follower
            ctx.shadowBlur = 15
            ctx.fillStyle = this.colors.followerGlow
            this.drawTriangleAt(0, 0, size + 4)
            ctx.restore()

            // Main follower shape
            ctx.save()
            ctx.shadowColor = this.colors.follower
            ctx.shadowBlur = 8
            ctx.fillStyle = this.colors.follower
            this.drawTriangleAt(0, 0, size)
            ctx.restore()

            // Inner highlight
            ctx.fillStyle = '#ffffff33'
            this.drawTriangleAt(0, 0, size * 0.4)

            ctx.restore() // Restore translation and rotation
        }
    }

    /**
     * Draw an equilateral triangle pointing up (before rotation).
     * @param {number} x - Center X position (0 when pre-translated)
     * @param {number} y - Center Y position (0 when pre-translated)
     * @param {number} size - Distance from center to vertices
     */
    drawTriangleAt(x, y, size) {
        const ctx = this.ctx
        ctx.beginPath()
        // Top vertex (pointing up, before rotation)
        ctx.moveTo(x, y - size)
        // Bottom-right vertex (cos(30deg) = 0.866, sin(30deg) = 0.5)
        ctx.lineTo(x + size * 0.866, y + size * 0.5)
        // Bottom-left vertex
        ctx.lineTo(x - size * 0.866, y + size * 0.5)
        ctx.closePath()
        ctx.fill()
    }
}
