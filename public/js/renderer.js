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
            if (!laser.isActive()) continue

            const positions = laser.getWorldPositions()
            const start = this.toScreen(positions.start.x, positions.start.y)
            const end = this.toScreen(positions.end.x, positions.end.y)

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
            ctx.globalAlpha = 0.7 + 0.3 * pulseIntensity
            ctx.beginPath()
            ctx.moveTo(start.x, start.y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
            ctx.restore()
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
}
