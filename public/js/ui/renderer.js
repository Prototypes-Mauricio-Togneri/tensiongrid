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
        this.canvas = canvas                 // Canvas element
        this.ctx = canvas.getContext('2d')   // 2D rendering context
        this.colors = Constants.game.colors  // Color palette reference
        this.camera = camera                 // Camera for world-to-screen transforms
        this.scale = 1                       // Render scale (0.5 for mobile)
        this.glowEnabled = true              // Glow effects toggle
    }

    /**
     * Return blur value if glow is enabled, otherwise 0.
     * @param {number} blur - Desired shadow blur radius
     * @returns {number} blur or 0
     */
    shadow(blur) {
        return this.glowEnabled ? blur : 0
    }

    /**
     * Set render scale factor (used for mobile scaling).
     * @param {number} scale - Scale factor (1 = normal, 0.5 = half size)
     */
    setScale(scale) {
        this.scale = scale
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
     * Clear the canvas and set up scale transform for this frame.
     * Call endFrame() after all drawing is complete.
     */
    clear() {
        this.ctx.save()
        this.ctx.setTransform(1, 0, 0, 1, 0, 0) // Reset to identity for clear
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.scale(this.scale, this.scale)
    }

    /**
     * End the current frame and restore transform state.
     */
    endFrame() {
        this.ctx.restore()
    }

    /**
     * Append alpha value to hex color string.
     * @param {string} hex - Base hex color
     * @param {number} alpha - Alpha value 0-1
     * @returns {string} Hex color with alpha
     */
    hexWithAlpha(hex, alpha) {
        const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0')
        return hex + alphaHex
    }

    /**
     * Draw a tapered wake trail behind a moving entity.
     * @param {Object} entity - Entity with x, y, wakeIntensity, wakeStartX, wakeStartY properties
     * @param {number} size - Entity size for calculating wake width
     * @param {string} color - Main wake color
     * @param {string} [shadowColor] - Shadow color (defaults to color at 50% alpha)
     * @param {string} [endColor] - Gradient end color (defaults to color at 0% alpha)
     */
    drawWakeTrail(entity, size, color, shadowColor, endColor) {
        if (entity.wakeIntensity <= 0.01) return

        const dx = entity.wakeStartX - entity.x
        const dy = entity.wakeStartY - entity.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist <= 1 || !isFinite(dist)) return

        const ctx = this.ctx
        const pos = this.toScreen(entity.x, entity.y)
        const wakeStart = this.toScreen(entity.wakeStartX, entity.wakeStartY)
        const dirX = dx / dist
        const dirY = dy / dist

        // Gradient from entity (bright) to wake end (transparent)
        const gradient = ctx.createLinearGradient(pos.x, pos.y, wakeStart.x, wakeStart.y)
        gradient.addColorStop(0, this.hexWithAlpha(color, 0.6 * entity.wakeIntensity))
        gradient.addColorStop(0.5, this.hexWithAlpha(color, 0.25 * entity.wakeIntensity))
        gradient.addColorStop(1, endColor || this.hexWithAlpha(color, 0))

        ctx.save()
        ctx.shadowColor = shadowColor || this.hexWithAlpha(color, 0.5)
        ctx.shadowBlur = this.shadow(10 * entity.wakeIntensity)

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

    /**
     * Draw an entity shape with the standard 3-layer glow effect.
     * Renders: outer glow → main shape → inner highlight.
     * @param {number} x - Screen X position
     * @param {number} y - Screen Y position
     * @param {number} size - Entity size
     * @param {string} color - Main color
     * @param {string} glowColor - Outer glow color
     * @param {string} highlightColor - Inner highlight color
     * @param {Function} drawShape - Shape drawing function (x, y, size) => void
     */
    drawGlowedShape(x, y, size, color, glowColor, highlightColor, drawShape) {
        const ctx = this.ctx

        // Outer glow
        ctx.save()
        ctx.shadowColor = color
        ctx.shadowBlur = this.shadow(15)
        ctx.fillStyle = glowColor
        drawShape(x, y, size + 4)
        ctx.restore()

        // Main shape
        ctx.save()
        ctx.shadowColor = color
        ctx.shadowBlur = this.shadow(8)
        ctx.fillStyle = color
        drawShape(x, y, size)
        ctx.restore()

        // Inner highlight
        ctx.fillStyle = highlightColor
        drawShape(x, y, size * 0.4)
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
     * Draw spawn warning effects (converging particles at bullet spawn points).
     * @param {Object[]} warnings - Array of {x, y, particles, particleSize} from EnemyManager
     */
    drawSpawnWarnings(warnings) {
        const ctx = this.ctx

        for (const warning of warnings) {
            const pos = this.toScreen(warning.x, warning.y)

            ctx.save()
            for (const particle of warning.particles) {
                if (particle.opacity <= 0) continue

                const px = pos.x + particle.x
                const py = pos.y + particle.y

                ctx.shadowColor = this.colors.bullet
                ctx.shadowBlur = this.shadow(8 * particle.opacity)
                ctx.fillStyle = this.hexWithAlpha(this.colors.bullet, particle.opacity)
                ctx.fillRect(
                    px - warning.particleSize / 2,
                    py - warning.particleSize / 2,
                    warning.particleSize,
                    warning.particleSize
                )
            }
            ctx.restore()
        }
    }

    /**
     * Draw player wrap effect (particles converging to center).
     * @param {PlayerWrapAnimation} scatter - PlayerWrapAnimation instance with particle data
     */
    drawPlayerWrap(scatter) {
        const ctx = this.ctx
        const worldPos = scatter.getPosition()
        const pos = this.toScreen(worldPos.x, worldPos.y)
        const particles = scatter.getParticles()
        const size = scatter.particleSize

        ctx.save()

        for (const particle of particles) {
            if (particle.opacity <= 0) continue

            const px = pos.x + particle.x
            const py = pos.y + particle.y

            // Draw glow
            ctx.shadowColor = this.colors.player
            ctx.shadowBlur = this.shadow(8 * particle.opacity)
            ctx.fillStyle = this.hexWithAlpha(this.colors.player, particle.opacity)
            ctx.fillRect(px - size / 2, py - size / 2, size, size)
        }

        ctx.restore()
    }

    /**
     * Draw collection wave effect (expanding ring).
     * @param {CollectionWaveAnimation} wave - CollectionWaveAnimation instance
     */
    drawCollectionWave(wave) {
        const ctx = this.ctx
        const worldPos = wave.getPosition()
        const pos = this.toScreen(worldPos.x, worldPos.y)
        const data = wave.getWaveData()
        const color = wave.getColor()

        if (data.opacity <= 0) return

        ctx.save()

        // Glow effect
        ctx.shadowColor = color
        ctx.shadowBlur = this.shadow(15 * data.opacity)

        // Draw expanding ring
        ctx.strokeStyle = this.hexWithAlpha(color, data.opacity)
        ctx.lineWidth = wave.lineWidth
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, data.radius, 0, Math.PI * 2)
        ctx.stroke()

        ctx.restore()
    }

    /**
     * Draw the player with wake effect, glow, and inner highlight.
     * @param {Player} player - Player instance to draw
     */
    drawPlayer(player) {
        const ctx = this.ctx
        const pos = this.toScreen(player.x, player.y)

        this.drawWakeTrail(
            player,
            player.size,
            this.colors.player,
            this.colors.playerWakeShadow,
            this.colors.playerWakeEnd
        )

        // Outer glow (larger, transparent rhombus)
        ctx.save()
        ctx.shadowColor = this.colors.player
        ctx.shadowBlur = this.shadow(20)
        this.drawRhombus(pos.x, pos.y, player.size + 4, this.colors.playerGlow)
        ctx.restore()

        // Main player rhombus
        ctx.save()
        ctx.shadowColor = this.colors.player
        ctx.shadowBlur = this.shadow(15)
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
     * Draw player explosion particles scattering outward.
     * @param {PlayerExplosionAnimation} explosion - PlayerExplosionAnimation instance with particle data
     */
    drawPlayerExplosion(explosion) {
        const ctx = this.ctx
        const worldPos = explosion.getPosition()
        const pos = this.toScreen(worldPos.x, worldPos.y)
        const particles = explosion.getParticles()
        const size = explosion.particleSize

        ctx.save()

        for (const particle of particles) {
            if (particle.opacity <= 0) continue

            const px = pos.x + particle.x
            const py = pos.y + particle.y

            // Draw glow
            ctx.shadowColor = this.colors.player
            ctx.shadowBlur = this.shadow(8 * particle.opacity)
            ctx.fillStyle = this.hexWithAlpha(this.colors.player, particle.opacity)
            ctx.fillRect(px - size / 2, py - size / 2, size, size)
        }

        ctx.restore()
    }

    /**
     * Draw mine explosion particles scattering outward.
     * @param {MineExplosionAnimation} explosion - MineExplosionAnimation instance with particle data
     */
    drawMineExplosion(explosion) {
        const ctx = this.ctx
        const worldPos = explosion.getPosition()
        const pos = this.toScreen(worldPos.x, worldPos.y)
        const particles = explosion.getParticles()
        const size = explosion.particleSize

        ctx.save()

        for (const particle of particles) {
            if (particle.opacity <= 0) continue

            const px = pos.x + particle.x
            const py = pos.y + particle.y

            // Draw glow
            ctx.shadowColor = this.colors.mine
            ctx.shadowBlur = this.shadow(10 * particle.opacity)
            ctx.fillStyle = this.hexWithAlpha(this.colors.mine, particle.opacity)
            ctx.fillRect(px - size / 2, py - size / 2, size, size)
        }

        ctx.restore()
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

            this.drawWakeTrail(
                enemy,
                size,
                this.colors.bullet,
                this.colors.bulletWakeShadow,
                this.colors.bulletWakeEnd
            )

            // Threat ring (subtle danger indicator around bullet)
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, size + 10, 0, Math.PI * 2)
            ctx.fillStyle = this.colors.bulletThreatRing
            ctx.fill()

            // Outer glow
            ctx.save()
            ctx.shadowColor = this.colors.bullet
            ctx.shadowBlur = this.shadow(8)
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, size + 3, 0, Math.PI * 2)
            ctx.fillStyle = this.colors.bulletGlow
            ctx.fill()
            ctx.restore()

            // Main bullet circle
            ctx.save()
            ctx.shadowColor = this.colors.bullet
            ctx.shadowBlur = this.shadow(5)
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2)
            ctx.fillStyle = this.colors.bullet
            ctx.fill()
            ctx.restore()

            // Inner highlight (small offset for 3D effect)
            ctx.beginPath()
            ctx.arc(pos.x - size * 0.3, pos.y - size * 0.3, size * 0.35, 0, Math.PI * 2)
            ctx.fillStyle = this.colors.bulletHighlight
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
     * Draw lasers with glow effect based on active state transitions.
     * @param {EnemyLaser[]} lasers - Array of laser instances
     */
    drawLasers(lasers) {
        const ctx = this.ctx
        const settings = Constants.game.enemies.laser

        for (const laser of lasers) {
            const positions = laser.getWorldPositions()
            const start = this.toScreen(positions.start.x, positions.start.y)
            const end = this.toScreen(positions.end.x, positions.end.y)
            const glowIntensity = laser.glowIntensity

            // Apply overall transparency based on glow state
            ctx.save()
            ctx.globalAlpha = glowIntensity

            // Outer glow (wide, semi-transparent)
            ctx.strokeStyle = this.colors.laserGlow
            ctx.lineWidth = settings.glowWidth
            ctx.lineCap = 'round'
            ctx.shadowColor = this.colors.laser
            ctx.shadowBlur = this.shadow(settings.glowShadowBlur)
            ctx.beginPath()
            ctx.moveTo(start.x, start.y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()

            // Main laser line (thin core)
            ctx.strokeStyle = this.colors.laser
            ctx.lineWidth = settings.coreWidth
            ctx.shadowBlur = this.shadow(settings.coreShadowBlur)
            ctx.beginPath()
            ctx.moveTo(start.x, start.y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()

            ctx.restore()
        }
    }

    /**
     * Draw walls as solid bars with glow effect.
     * @param {Wall[]} walls - Array of wall instances
     */
    drawWalls(walls) {
        const ctx = this.ctx
        const settings = Constants.game.enemies.wall

        for (const wall of walls) {
            const positions = wall.getWorldPositions()
            const start = this.toScreen(positions.start.x, positions.start.y)
            const end = this.toScreen(positions.end.x, positions.end.y)

            // Outer glow (wide, semi-transparent)
            ctx.save()
            ctx.strokeStyle = this.colors.wallGlow
            ctx.lineWidth = settings.glowWidth
            ctx.lineCap = 'round'
            ctx.shadowColor = this.colors.wall
            ctx.shadowBlur = this.shadow(settings.glowShadowBlur)
            ctx.beginPath()
            ctx.moveTo(start.x, start.y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
            ctx.restore()

            // Main wall line (solid core)
            ctx.save()
            ctx.strokeStyle = this.colors.wall
            ctx.lineWidth = settings.coreWidth
            ctx.lineCap = 'round'
            ctx.shadowColor = this.colors.wall
            ctx.shadowBlur = this.shadow(settings.coreShadowBlur)
            ctx.beginPath()
            ctx.moveTo(start.x, start.y)
            ctx.lineTo(end.x, end.y)
            ctx.stroke()
            ctx.restore()
        }
    }

    /**
     * Draw traps with rhombus shape.
     * Opacity transitions smoothly based on active state.
     * @param {EnemyTrap[]} traps - Array of trap instances
     */
    drawTraps(traps) {
        const ctx = this.ctx

        for (const trap of traps) {
            const pos = this.toScreen(trap.x, trap.y)
            const size = trap.size
            const opacity = trap.opacity

            // Outer glow
            ctx.save()
            ctx.shadowColor = this.colors.trap
            ctx.shadowBlur = this.shadow(15)
            this.drawRhombus(pos.x, pos.y, size + 4, this.hexWithAlpha(this.colors.trap.slice(0, 7), 0.3 * opacity))
            ctx.restore()

            // Main rhombus shape
            ctx.save()
            ctx.shadowColor = this.colors.trap
            ctx.shadowBlur = this.shadow(8)
            this.drawRhombus(pos.x, pos.y, size, this.hexWithAlpha(this.colors.trap.slice(0, 7), opacity))
            ctx.restore()

            // Inner highlight
            this.drawRhombus(pos.x, pos.y, size * 0.4, this.hexWithAlpha('#ffffff', 0.25 * opacity))
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
     * Dormant: static, Triggered: accelerating blink, Exploded: not drawn.
     * @param {EnemyMine[]} mines - Array of mine instances
     * @param {number} time - Current animation timestamp for effects
     */
    drawMines(mines, time) {
        const ctx = this.ctx

        for (const mine of mines) {
            if (mine.isExploded()) continue

            const pos = this.toScreen(mine.x, mine.y)
            const blinkIntensity = mine.getBlinkIntensity()
            const size = mine.size

            ctx.save()
            ctx.globalAlpha = blinkIntensity

            // Outer glow
            ctx.save()
            ctx.shadowColor = this.colors.mine
            ctx.shadowBlur = this.shadow(15 * blinkIntensity)
            ctx.fillStyle = this.colors.mineGlow
            this.drawHexagon(pos.x, pos.y, size + 4)
            ctx.restore()

            // Main mine shape (hexagon for visual distinction)
            ctx.save()
            ctx.shadowColor = this.colors.mine
            ctx.shadowBlur = this.shadow(8 * blinkIntensity)
            ctx.fillStyle = this.colors.mine
            this.drawHexagon(pos.x, pos.y, size)
            ctx.restore()

            // Inner highlight
            ctx.fillStyle = this.colors.mineHighlight
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
     * Draw shooters with square hub and rectangular barrels as unified shapes.
     * @param {EnemyShooter[]} shooters - Array of shooter instances
     */
    drawShooters(shooters) {
        const ctx = this.ctx

        for (const shooter of shooters) {
            const pos = this.toScreen(shooter.x, shooter.y)
            const armLength = shooter.armLength
            const size = Constants.game.enemies.shooter.size
            const directions = shooter.getActiveDirections()
            const hubSize = size / 2 // Center hub half-width (matches arm width)

            ctx.save()
            ctx.translate(pos.x, pos.y)
            ctx.rotate(shooter.getRotation())

            // Outer glow (hub + arms combined)
            ctx.save()
            ctx.shadowColor = this.colors.shooter
            ctx.shadowBlur = this.shadow(15)
            ctx.fillStyle = this.colors.shooterGlow
            this.drawShooterShape(0, 0, armLength + 3, size + 3, hubSize + 2, directions)
            ctx.restore()

            // Main shape (hub + arms combined)
            ctx.save()
            ctx.shadowColor = this.colors.shooter
            ctx.shadowBlur = this.shadow(8)
            ctx.fillStyle = this.colors.shooter
            this.drawShooterShape(0, 0, armLength, size, hubSize, directions)
            ctx.restore()

            // Inner highlight - center hub only
            ctx.fillStyle = this.colors.shooterHighlight
            this.drawSquareAt(0, 0, hubSize * 0.5)

            ctx.restore() // Restore translation and rotation
        }
    }

    /**
     * Draw complete shooter shape (hub + barrels) as a single unified path.
     * @param {number} x - Center X (0 when pre-translated)
     * @param {number} y - Center Y (0 when pre-translated)
     * @param {number} armLength - Length from center to arm tip
     * @param {number} size - Width of each arm
     * @param {number} hubSize - Half-width of center hub
     * @param {string[]} directions - Active direction keys
     */
    drawShooterShape(x, y, armLength, size, hubSize, directions) {
        const ctx = this.ctx
        const halfWidth = size / 2

        ctx.beginPath()

        // Draw center hub
        ctx.rect(x - hubSize, y - hubSize, hubSize * 2, hubSize * 2)

        // Draw arms for active directions
        for (const dir of directions) {
            switch (dir) {
                case Constants.directions.up.key:
                    ctx.rect(x - halfWidth, y - armLength, size, armLength)
                    break
                case Constants.directions.down.key:
                    ctx.rect(x - halfWidth, y, size, armLength)
                    break
                case Constants.directions.left.key:
                    ctx.rect(x - armLength, y - halfWidth, armLength, size)
                    break
                case Constants.directions.right.key:
                    ctx.rect(x, y - halfWidth, armLength, size)
                    break
            }
        }

        ctx.fill()
    }

    /**
     * Draw charge-up circles at shooter arm tips before firing.
     * Rendered before drawShooters so circles appear behind the arms.
     * @param {EnemyShooter[]} shooters - Array of shooter instances
     */
    drawShooterCharges(shooters) {
        const ctx = this.ctx
        const maxRadius = Constants.game.enemies.shooter.size / 2

        for (const shooter of shooters) {
            const progress = shooter.getChargeProgress()
            if (progress <= 0) continue

            const pos = this.toScreen(shooter.x, shooter.y)
            const tipOffsets = shooter.getArmTipOffsets()
            const radius = maxRadius * progress

            ctx.save()
            ctx.translate(pos.x, pos.y)
            ctx.rotate(shooter.getRotation())

            ctx.shadowColor = this.colors.bullet
            ctx.shadowBlur = this.shadow(10 * progress)
            ctx.fillStyle = this.hexWithAlpha(this.colors.bullet, 0.7 * progress)

            for (const tip of tipOffsets) {
                ctx.beginPath()
                ctx.arc(tip.x, tip.y, radius, 0, Math.PI * 2)
                ctx.fill()
            }

            ctx.restore()
        }
    }

    /**
     * Draw patrols with wake trail and glow effects.
     * @param {EnemyPatrol[]} patrols - Array of patrol instances
     */
    drawPatrols(patrols) {
        for (const patrol of patrols) {
            const pos = this.toScreen(patrol.x, patrol.y)

            this.drawWakeTrail(patrol, patrol.size, this.colors.patrol)

            this.drawGlowedShape(
                pos.x, pos.y, patrol.size,
                this.colors.patrol, this.colors.patrolGlow, this.colors.patrolHighlight,
                (x, y, size) => this.drawFlatHexagon(x, y, size)
            )
        }
    }

    /**
     * Draw followers as rotating squares with wake trail and glow effects.
     * @param {EnemyFollower[]} followers - Array of follower instances
     */
    drawFollowers(followers) {
        const ctx = this.ctx

        for (const follower of followers) {
            const pos = this.toScreen(follower.x, follower.y)

            this.drawWakeTrail(follower, follower.size, this.colors.follower)

            // Draw rotated square
            ctx.save()
            ctx.translate(pos.x, pos.y)
            ctx.rotate(follower.getRotation())

            this.drawGlowedShape(
                0, 0, follower.size,
                this.colors.follower, this.colors.followerGlow, this.colors.followerHighlight,
                (x, y, size) => this.drawSquareAt(x, y, size)
            )

            ctx.restore()
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

    /**
     * Draw a square centered at position (before rotation).
     * @param {number} x - Center X position (0 when pre-translated)
     * @param {number} y - Center Y position (0 when pre-translated)
     * @param {number} size - Distance from center to edge midpoints
     */
    drawSquareAt(x, y, size) {
        const ctx = this.ctx
        ctx.beginPath()
        ctx.moveTo(x - size, y - size)
        ctx.lineTo(x + size, y - size)
        ctx.lineTo(x + size, y + size)
        ctx.lineTo(x - size, y + size)
        ctx.closePath()
        ctx.fill()
    }

    /**
     * Draw powers with pulsing circle and type-specific icon.
     * @param {Power[]} powers - Array of power instances (both power-ups and power-downs)
     * @param {number} time - Current animation timestamp for pulse calculation
     */
    drawPowers(powers, time) {
        const ctx = this.ctx

        // Calculate pulse intensity based on time (sine wave oscillation)
        const { pulseSpeed, pulseMin, pulseMax } = Constants.game.powers
        const pulseRange = pulseMax - pulseMin
        const pulseIntensity = pulseMin + pulseRange * (0.5 + 0.5 * Math.sin(time * pulseSpeed))

        for (const power of powers) {
            if (power.isCollected()) continue

            const pos = this.toScreen(power.x, power.y)
            const size = power.size * pulseIntensity

            // Select colors and icon based on power type
            let color, glowColor, iconColor, iconScale, drawIcon
            if (power.isNegative) {
                color = this.colors.powerDown
                glowColor = this.colors.powerDownGlow
                iconColor = this.colors.powerDownIcon
                if (power.type === Constants.game.effects.mirror.type) {
                    iconScale = Constants.game.powers.mirror.iconScale
                    drawIcon = (x, y, size, color) => this.drawMirrorIcon(x, y, size, color)
                } else {
                    iconScale = Constants.game.powers.slow.iconScale
                    drawIcon = (x, y, size, color) => this.drawTurtleIcon(x, y, size, color)
                }
            } else if (power.type === Constants.game.effects.shield.type) {
                color = this.colors.shield
                glowColor = this.colors.shieldGlow
                iconColor = this.colors.shieldIcon
                iconScale = Constants.game.powers.shield.iconScale
                drawIcon = (x, y, size, color) => this.drawShieldIcon(x, y, size, color)
            } else {
                color = this.colors.powerUp
                glowColor = this.colors.powerUpGlow
                iconColor = this.colors.powerUpIcon
                iconScale = Constants.game.powers.fast.iconScale
                drawIcon = (x, y, size, color) => this.drawLightningBolt(x, y, size, color)
            }

            // Outer glow
            ctx.save()
            ctx.shadowColor = color
            ctx.shadowBlur = this.shadow(20 * pulseIntensity)
            ctx.fillStyle = glowColor
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, size + 4, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()

            // Main circle
            ctx.save()
            ctx.shadowColor = color
            ctx.shadowBlur = this.shadow(10 * pulseIntensity)
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()

            // Draw icon
            drawIcon(pos.x, pos.y, size * iconScale, iconColor)
        }
    }

    /**
     * Draw exit portal with tunnel animation (shrinking rings).
     * @param {Exit} exit - Exit instance to draw
     */
    drawExit(exit) {
        const ctx = this.ctx
        const pos = this.toScreen(exit.x, exit.y)
        const size = exit.size
        const borderColor = exit.getBorderColor()
        const { ringThickness, ringOpacity } = Constants.game.exit

        // Draw shrinking rings (tunnel effect)
        const rings = exit.getRings()
        for (const ring of rings) {
            const progress = 1 - (ring.radius / size)  // 0 at outer, 1 at center
            const opacity = ringOpacity * (1 - progress)  // Fade as it shrinks
            const thickness = ringThickness * (1 - progress * 0.7)  // Thinner toward center

            ctx.save()
            ctx.globalAlpha = opacity
            ctx.strokeStyle = borderColor
            ctx.lineWidth = thickness
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, ring.radius, 0, Math.PI * 2)
            ctx.stroke()
            ctx.restore()
        }

        // Draw static outer ring (always visible)
        ctx.save()
        ctx.globalAlpha = ringOpacity
        ctx.strokeStyle = borderColor
        ctx.lineWidth = ringThickness
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()

        // Draw timer arc (if active)
        const timerData = exit.getTimerProgress()
        if (timerData && timerData.progress > 0) {
            const { timerArcOffset, timerArcThickness } = Constants.game.exit
            const arcRadius = size + timerArcOffset

            // Arc starts at top (-π/2) and depletes clockwise
            const startAngle = -Math.PI / 2
            const endAngle = startAngle + (timerData.progress * Math.PI * 2)

            ctx.save()
            ctx.globalAlpha = 0.6
            ctx.strokeStyle = this.colors.exitTimerFull
            ctx.lineWidth = timerArcThickness
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, arcRadius, startAngle, endAngle)
            ctx.stroke()
            ctx.restore()
        }
    }

    /**
     * Draw switches with rhombus shape and pulse animation.
     * @param {Switch[]} switches - Array of switch instances
     * @param {number} time - Animation timestamp for pulse calculation
     */
    drawSwitches(switches, time) {
        const ctx = this.ctx
        const { pulsePeriod, pulseScale, pulseAlpha } = Constants.game.switch

        // Pulse: linear ramp 0→1 that resets, wave expands outward and fades
        const pulse = (time % pulsePeriod) / pulsePeriod
        const pScale = 1 + (pulseScale - 1) * pulse
        const pAlpha = pulseAlpha * (1 - pulse)

        for (const switchItem of switches) {
            if (switchItem.isCollected()) continue

            const pos = this.toScreen(switchItem.x, switchItem.y)
            const size = switchItem.size

            const half = size * 0.5

            // Pulse ring (expanding, fading rhombus)
            ctx.save()
            ctx.globalAlpha = pAlpha
            this.drawRhombus(pos.x, pos.y, half * pScale, this.colors.switch)
            ctx.restore()

            // Outer glow
            ctx.save()
            ctx.shadowColor = this.colors.switch
            ctx.shadowBlur = this.shadow(15)
            this.drawRhombus(pos.x, pos.y, half + 3, this.colors.switchGlow)
            ctx.restore()

            // Main rhombus
            ctx.save()
            ctx.shadowColor = this.colors.switch
            ctx.shadowBlur = this.shadow(8)
            this.drawRhombus(pos.x, pos.y, half, this.colors.switch)
            ctx.restore()

            // Inner highlight
            this.drawRhombus(pos.x, pos.y, half * 0.4, this.colors.switchHighlight)
        }
    }

    /**
     * Draw dashed connection lines from uncollected switches to their targets.
     * @param {Switch[]} switches - Array of switch instances
     */
    drawSwitchConnections(switches) {
        const ctx = this.ctx
        const { lineWidth, dash, opacity, glowBlur } = Constants.game.switch.connection

        for (const switchItem of switches) {
            if (switchItem.isCollected()) continue
            if (!switchItem.path || switchItem.path.length < 2) continue

            const start = this.toScreen(switchItem.path[0].x, switchItem.path[0].y)

            ctx.save()
            ctx.strokeStyle = this.hexWithAlpha(this.colors.switch, opacity)
            ctx.lineWidth = lineWidth
            ctx.setLineDash(dash)
            ctx.shadowColor = this.colors.switch
            ctx.shadowBlur = this.shadow(glowBlur)

            ctx.beginPath()
            ctx.moveTo(start.x, start.y)
            for (let i = 1; i < switchItem.path.length; i++) {
                const point = this.toScreen(switchItem.path[i].x, switchItem.path[i].y)
                ctx.lineTo(point.x, point.y)
            }
            ctx.stroke()
            ctx.restore()
        }
    }

    /**
     * Draw a lightning bolt icon centered at position.
     * @param {number} x - Center X position
     * @param {number} y - Center Y position
     * @param {number} size - Size of the icon
     * @param {string} iconColor - Fill color for the icon
     */
    drawLightningBolt(x, y, size, iconColor) {
        const ctx = this.ctx
        ctx.save()
        ctx.fillStyle = iconColor || this.colors.powerUpIcon

        ctx.beginPath()
        // Lightning bolt shape (7 points)
        ctx.moveTo(x + size * 0.1, y - size)        // Top right of upper segment
        ctx.lineTo(x - size * 0.5, y + size * 0.1)  // Left middle point
        ctx.lineTo(x - size * 0.05, y + size * 0.1) // Inner notch left
        ctx.lineTo(x - size * 0.25, y + size)       // Bottom left point
        ctx.lineTo(x + size * 0.5, y - size * 0.1)  // Right middle point
        ctx.lineTo(x + size * 0.05, y - size * 0.1) // Inner notch right
        ctx.closePath()
        ctx.fill()

        ctx.restore()
    }

    /**
     * Draw a turtle icon centered at position.
     * @param {number} x - Center X position
     * @param {number} y - Center Y position
     * @param {number} size - Size of the icon
     * @param {string} iconColor - Fill color for the icon
     */
    drawTurtleIcon(x, y, size, iconColor) {
        const ctx = this.ctx
        ctx.save()
        ctx.fillStyle = iconColor

        // Offset to center the turtle (head extends right more than shell extends left)
        const offsetX = x - size * 0.125

        // Shell (oval dome)
        ctx.beginPath()
        ctx.ellipse(offsetX, y, size * 0.7, size * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()

        // Head (small circle protruding right)
        ctx.beginPath()
        ctx.arc(offsetX + size * 0.7, y, size * 0.25, 0, Math.PI * 2)
        ctx.fill()

        // Front leg (small rectangle)
        ctx.fillRect(offsetX + size * 0.2, y + size * 0.3, size * 0.25, size * 0.35)

        // Back leg (small rectangle)
        ctx.fillRect(offsetX - size * 0.45, y + size * 0.3, size * 0.25, size * 0.35)

        ctx.restore()
    }

    /**
     * Draw a mirror icon (two vertical parallel arrows) centered at position.
     * @param {number} x - Center X position
     * @param {number} y - Center Y position
     * @param {number} size - Size of the icon
     * @param {string} iconColor - Fill color for the icon
     */
    drawMirrorIcon(x, y, size, iconColor) {
        const ctx = this.ctx
        ctx.save()
        ctx.fillStyle = iconColor

        const arrowWidth = size * 0.25
        const spacing = size * 0.4

        // Left arrow pointing down
        const leftX = x - spacing
        ctx.fillRect(leftX - arrowWidth / 2, y - size * 0.6, arrowWidth, size * 0.8)
        ctx.beginPath()
        ctx.moveTo(leftX - size * 0.35, y + size * 0.2)
        ctx.lineTo(leftX + size * 0.35, y + size * 0.2)
        ctx.lineTo(leftX, y + size * 0.8)
        ctx.closePath()
        ctx.fill()

        // Right arrow pointing up
        const rightX = x + spacing
        ctx.fillRect(rightX - arrowWidth / 2, y - size * 0.2, arrowWidth, size * 0.8)
        ctx.beginPath()
        ctx.moveTo(rightX - size * 0.35, y - size * 0.2)
        ctx.lineTo(rightX + size * 0.35, y - size * 0.2)
        ctx.lineTo(rightX, y - size * 0.8)
        ctx.closePath()
        ctx.fill()

        ctx.restore()
    }

    /**
     * Draw a shield icon centered at position.
     * @param {number} x - Center X position
     * @param {number} y - Center Y position
     * @param {number} size - Size of the icon
     * @param {string} iconColor - Fill color for the icon
     */
    drawShieldIcon(x, y, size, iconColor) {
        const ctx = this.ctx
        ctx.save()
        ctx.fillStyle = iconColor

        // Shield shape: flat top, tapered sides, pointed bottom
        ctx.beginPath()
        ctx.moveTo(x - size * 0.8, y - size * 0.9)  // Top left
        ctx.lineTo(x + size * 0.8, y - size * 0.9)  // Top right
        ctx.lineTo(x + size * 0.8, y - size * 0.2)  // Right upper side
        ctx.quadraticCurveTo(x + size * 0.7, y + size * 0.5, x, y + size) // Right curve to bottom
        ctx.quadraticCurveTo(x - size * 0.7, y + size * 0.5, x - size * 0.8, y - size * 0.2) // Left curve from bottom
        ctx.closePath()
        ctx.fill()

        ctx.restore()
    }

    /**
     * Draw debug coordinate labels on each grid node.
     * @param {Grid} grid - Grid instance to draw coordinates for
     */
    drawDebugNodeCoordinates(grid) {
        const ctx = this.ctx
        const { fontSize, fontFamily, textColor, textOffsetY } = Constants.game.debug

        ctx.save()
        ctx.font = `${fontSize}px ${fontFamily}`
        ctx.fillStyle = textColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'

        for (let row = 0; row < grid.height; row++) {
            for (let col = 0; col < grid.width; col++) {
                if (grid.isExcluded(row, col)) continue
                const posWorld = grid.getNodePosition(row, col)
                const pos = this.toScreen(posWorld.x, posWorld.y)
                ctx.fillText(`${col},${row}`, pos.x, pos.y + textOffsetY)
            }
        }

        ctx.restore()
    }

    /**
     * Draw shield circle around player.
     * @param {number} x - Screen X position
     * @param {number} y - Screen Y position
     * @param {number} playerSize - Player size for shield radius calculation
     */
    drawShield(x, y, playerSize) {
        const ctx = this.ctx
        const radius = playerSize + 10

        ctx.save()

        // Outer glow
        ctx.shadowColor = this.colors.shield
        ctx.shadowBlur = this.shadow(20)
        ctx.strokeStyle = this.colors.shieldGlow
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.arc(x, y, radius + 3, 0, Math.PI * 2)
        ctx.stroke()

        // Main shield circle
        ctx.shadowBlur = this.shadow(12)
        ctx.strokeStyle = this.colors.shield
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.stroke()

        ctx.restore()
    }

    /**
     * Draw the player with wake effect, glow, shield, and optional speed effect indicator.
     * @param {Player} player - Player instance to draw
     * @param {number} scale - Scale factor for player size (default 1)
     * @param {number} time - Animation timestamp for effects (default 0)
     * @param {number} opacity - Opacity multiplier (default 1)
     */
    drawPlayerWithBoost(player, scale = 1, time = 0, opacity = 1) {
        const ctx = this.ctx
        const pos = this.toScreen(player.x, player.y)
        const hints = player.effectManager.getRenderHints()
        const hasSpeedEffect = player.hasSpeedBoost() || player.isSlowed()
        const size = player.size * scale

        // Apply opacity multiplier for exit animation
        if (opacity < 1) {
            ctx.save()
            ctx.globalAlpha = opacity
        }

        // Apply blinking effect (immunity or warning before effect expires)
        if (hints.blink && hints.blinkFrequency) {
            const blinkAlpha = 0.3 + 0.7 * Math.abs(Math.sin(time * hints.blinkFrequency))
            ctx.save()
            ctx.globalAlpha *= blinkAlpha
        }

        // Determine effect color based on render hints
        let effectColor = this.colors.player
        let effectGlow = this.colors.playerGlow
        if (hints.glowColor) {
            effectColor = this.colors[hints.glowColor]
            effectGlow = this.colors[hints.glowColorAlpha]
        }

        this.drawWakeTrail(player, player.size, effectColor)

        // Speed effect glow (larger glow behind player when boosted or slowed)
        if (hasSpeedEffect) {
            ctx.save()
            ctx.shadowColor = effectColor
            ctx.shadowBlur = this.shadow(30)
            this.drawRhombus(pos.x, pos.y, size + 8, effectGlow)
            ctx.restore()
        }

        // Outer glow (larger, transparent rhombus)
        ctx.save()
        ctx.shadowColor = effectColor
        ctx.shadowBlur = this.shadow(20)
        this.drawRhombus(pos.x, pos.y, size + 4, this.colors.playerGlow)
        ctx.restore()

        // Main player rhombus
        ctx.save()
        ctx.shadowColor = effectColor
        ctx.shadowBlur = this.shadow(15)
        this.drawRhombus(pos.x, pos.y, size, this.colors.player)
        ctx.restore()

        // Inner highlight (smaller rhombus offset upward)
        ctx.fillStyle = this.colors.playerHighlight
        ctx.beginPath()
        ctx.moveTo(pos.x, pos.y - size * 0.5)
        ctx.lineTo(pos.x + size * 0.3, pos.y)
        ctx.lineTo(pos.x, pos.y + size * 0.2)
        ctx.lineTo(pos.x - size * 0.3, pos.y)
        ctx.closePath()
        ctx.fill()

        // Draw shield circle if active
        if (hints.showShield) {
            this.drawShield(pos.x, pos.y, player.size)
        }

        // Restore alpha if blinking was applied
        if (hints.blink && hints.blinkFrequency) {
            ctx.restore()
        }

        // Restore alpha if opacity was applied
        if (opacity < 1) {
            ctx.restore()
        }
    }
}
