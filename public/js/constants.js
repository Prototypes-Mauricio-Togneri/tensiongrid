/**
 * Global constants and configuration for Tension Grid.
 * All magic values are centralized here for easy adjustment.
 */
const Constants = {

    // ==========================================
    // DOM Element References
    // ==========================================
    dom: {
        ids: {
            canvasWrapper: 'canvasWrapper',   // Wrapper for shake effect
            homeScreen: 'homeScreen',         // Home menu screen
            gameScreen: 'gameScreen',         // Game play screen
            levelsScreen: 'levelsScreen',     // Level selection screen
            settingsScreen: 'settingsScreen', // Settings screen
            audioToggle: 'audioToggle',       // Audio toggle button
            pauseOverlay: 'pauseOverlay',     // Pause menu overlay
            gameCanvas: 'gameCanvas',         // Main game canvas
            bgAnimation: 'bgAnimation'        // Background animation container
        },
        classes: {
            shake: 'shake',                   // Screen shake animation class
            active: 'active',                 // Visible screen class
            selected: 'selected',             // Selected menu item class
            menuButton: 'menu-button'         // Menu button class
        },
        selectors: {
            homeMenuButtons: '#homeScreen .menu-button',    // Home menu buttons
            levelsMenuButtons: '#levelsScreen .menu-button' // Level select buttons
        }
    },

    // ==========================================
    // Event Types
    // ==========================================
    events: {
        keydown: 'keydown',                  // Key press event
        keyup: 'keyup',                      // Key release event
        resize: 'resize',                    // Window resize event
        change: 'change',                    // Input change event
        click: 'click',                      // Mouse click event
        touchstart: 'touchstart',            // Touch start event
        touchmove: 'touchmove',              // Touch move event
        touchend: 'touchend',                // Touch end event
        popstate: 'popstate',                // Browser history navigation event
        visibilitychange: 'visibilitychange' // Tab visibility change event
    },

    // ==========================================
    // Swipe Configuration
    // ==========================================
    swipe: {
        minDistance: 30 // Minimum swipe distance in pixels
    },

    // ==========================================
    // Input Key Identifiers
    // ==========================================
    keys: {
        up: 'up',         // Up direction key
        down: 'down',     // Down direction key
        left: 'left',     // Left direction key
        right: 'right',   // Right direction key
        escape: 'escape', // Escape/back key
        select: 'select'  // Select/confirm key
    },

    // ==========================================
    // Direction Vectors (row/col deltas)
    // ==========================================
    directions: {
        up: {
          key: 'up',
          row: -1, // Move up decreases row
          col: 0
        },
        down: {
          key: 'down',
          row: 1,  // Move down increases row
          col: 0
        },
        left: {
          key: 'left',
          row: 0,
          col: -1  // Move left decreases column
        },
        right: {
          key: 'right',
          row: 0,
          col: 1   // Move right increases column
        },
        none: {
          key: 'none',
          row: 0,  // No movement
          col: 0
        }
    },

    // ==========================================
    // Menu Action Identifiers
    // ==========================================
    actions: {
        home: {
            continue: 'continue',     // Continue last game
            levels: 'levels',         // Open level select
            fullscreen: 'fullscreen', // Toggle fullscreen mode
            settings: 'settings'      // Open settings
        },
        pause: {
            continue: 'continue',     // Resume game
            restart: 'restart',       // Restart current level
            quit: 'quit'              // Return to main menu
        }
    },

    // ==========================================
    // Screen Names
    // ==========================================
    screens: {
        home: 'home',         // Main menu screen
        game: 'game',         // Game play screen
        levels: 'levels',     // Level selection screen
        settings: 'settings'  // Settings screen
    },

    // ==========================================
    // Game Configuration
    // ==========================================
    game: {
        // Mobile scaling settings
        scale: {
            mobileBreakpoint: 768, // Viewport width threshold in pixels
            mobileFactor: 0.73     // Scale factor for mobile (0.5 = 50% size)
        },

        // Grid rendering settings
        grid: {
            cellSize: 80,   // Pixels between grid nodes
            nodeRadius: 5,  // Node circle radius in pixels
            edgeWidth: 2    // Edge line width in pixels
        },

        // Player settings
        player: {
            size: 12,  // Player rhombus size in pixels
            speed: 200 // Movement speed in pixels/second
        },

        // Physics settings
        physics: {
            maxDeltaTime: 100,       // Max delta cap to prevent tunneling (ms)
            collisionThreshold: 0.7, // Collision distance multiplier
            deathPauseMs: 1000       // Pause duration after player death before reset (ms)
        },

        // Enemy settings
        enemies: {
            bullet: {
                size: 5,                       // Bullet size in pixels
                speed: 130                     // Bullet speed in pixels/second
            },
            laser: {
                glowTransitionSpeed: 0.004,    // Glow change per ms during transitions
                glowMin: 0.2,                  // Minimum glow intensity (off state, faded but visible)
                glowMax: 1.0,                  // Maximum glow intensity (on state)
                coreWidth: 5,                  // Main beam line thickness in pixels
                glowWidth: 10,                 // Outer glow line thickness in pixels
                coreShadowBlur: 10,            // Core line shadow blur radius in pixels
                glowShadowBlur: 20             // Outer glow shadow blur radius in pixels
            },
            trap: {
                size: 14,                      // Trap size in pixels
                opacityTransitionSpeed: 0.004, // Opacity change per ms during transitions
                opacityMin: 0.2,               // Minimum opacity (off state)
                opacityMax: 1.0                // Maximum opacity (on state)
            },
            mine: {
                size: 12,                      // Mine size in pixels
                blinkFrequencyStart: 2,        // Starting blink frequency (Hz)
                blinkFrequencyRange: 8,        // Blink frequency increase (Hz)
                blinkIntensityMin: 0.3,        // Minimum blink intensity
                blinkIntensityMax: 1.0         // Maximum blink intensity
            },
            patrol: {
                size: 12                       // Patrol size in pixels
            },
            shooter: {
                size: 28,                      // Turret arm length from center in pixels
                armWidth: 10                   // Turret arm thickness in pixels
            },
            follower: {
                size: 8,                       // Follower size in pixels
                rotationSpeed: 3               // Rotation speed in radians/second
            }
        },
        
        // Power-up/down collectible item settings (effect behavior in `effects`)
        powers: {
            size: 12,            // Collectible size in pixels
            pulseSpeed: 0.003,   // Pulse oscillation speed (radians per ms)
            pulseMin: 1,         // Minimum pulse scale
            pulseMax: 1.15,      // Maximum pulse scale
            fast: {
                iconScale: 0.7   // Icon size multiplier
            },
            slow: {
                iconScale: 0.9   // Icon size multiplier
            },
            shield: {
                iconScale: 0.6   // Icon size multiplier
            },
            mirror: {
                iconScale: 0.8   // Icon size multiplier
            }
        },

        // Effect configurations (used by EffectManager)
        effects: {
            fast: {
                type: 'fast',          // Effect type identifier
                duration: 5000,        // Effect duration in ms
                speedMultiplier: 1.5,  // Player speed multiplier
                warningDuration: 1000, // Start blinking this many ms before expiration
                blinkFrequency: 0.015  // Blink speed (radians per ms)
            },
            slow: {
                type: 'slow',          // Effect type identifier
                duration: 5000,        // Effect duration in ms
                speedMultiplier: 0.5,  // Player speed multiplier
                warningDuration: 1000, // Start blinking this many ms before expiration
                blinkFrequency: 0.015  // Blink speed (radians per ms)
            },
            shield: {
                type: 'shield',        // Effect type identifier
                duration: 5000,        // Shield active duration in ms
                warningDuration: 1000, // Start blinking this many ms before expiration
                blinkFrequency: 0.015  // Blink speed (radians per ms)
            },
            immunity: {
                type: 'immunity',      // Effect type identifier
                duration: 1000,        // Post-shield immunity duration in ms
                blinkFrequency: 0.015  // Blink speed during immunity (radians per ms)
            },
            mirror: {
                type: 'mirror',        // Effect type identifier
                duration: 5000,        // Control inversion duration in ms
                warningDuration: 1000, // Start blinking this many ms before expiration
                blinkFrequency: 0.015  // Blink speed (radians per ms)
            }
        },

        // Animation effect settings
        animations: {
            // Pixel scatter effect settings (wrap teleport)
            pixelScatter: {
                particleCount: 16,  // Number of particles
                particleSize: 3,    // Size of each square particle in pixels
                spawnRadius: 45,    // Initial scatter radius in pixels
                duration: 250       // Time for particles to converge in ms
            },

            // Pixel explosion effect settings (player death)
            pixelExplosion: {
                particleCount: 16,  // Number of particles
                particleSize: 5,    // Size of each square particle in pixels
                endRadius: 40,      // Final scatter radius in pixels
                duration: 800       // Time for particles to scatter in ms
            },

            // Collection wave effect settings (power-up/power-down pickup)
            collectionWave: {
                startRadius: 8,     // Initial ring radius in pixels
                endRadius: 35,      // Final ring radius in pixels
                duration: 300,      // Animation duration in ms
                lineWidth: 3        // Ring stroke width in pixels
            },

            // Mine explosion effect settings
            mineExplosion: {
                particleCount: 12,  // Number of particles
                particleSize: 4,    // Size of each hexagonal particle in pixels
                endRadius: 35,      // Final scatter radius in pixels
                duration: 600       // Time for particles to scatter in ms
            }
        },

        // Color palette (hex with optional alpha)
        colors: {
            // Grid colors
            node: '#1a3a4a44',              // Grid node fill
            nodeHighlight: '#ffffff0d',     // Node highlight effect
            edge: '#00f5ff22',              // Grid edge color
            edgeGlow: '#00f5ff0d',          // Edge glow effect

            // Player colors
            player: '#ffffff',              // Player fill color
            playerGlow: '#ffffff99',        // Player glow effect
            playerHighlight: '#ffffff66',   // Player inner highlight
            playerWakeEnd: '#ffffff00',     // Wake trail end (transparent)
            playerWakeShadow: '#ffffff80',  // Wake shadow effect

            // Bullet colors
            bullet: '#cc2244',              // Bullet fill color
            bulletGlow: '#cc22444d',        // Bullet glow effect
            bulletHighlight: '#ffffff26',   // Bullet inner highlight
            bulletThreatRing: '#cc22440d',  // Threat proximity ring
            bulletWakeEnd: '#cc224400',     // Wake trail end (transparent)
            bulletWakeShadow: '#cc224480',  // Wake shadow effect

            // Laser colors
            laser: '#ff4da6',               // Laser beam color
            laserGlow: '#ff4da680',         // Laser glow effect

            // Trap colors
            trap: '#ff8800',                // Trap fill color (orange)
            trapGlow: '#ff88004d',          // Trap glow effect

            // Mine colors
            mine: '#ffcc00',                // Mine fill color (yellow)
            mineGlow: '#ffcc004d',          // Mine glow effect
            mineHighlight: '#ffffff26',     // Mine inner highlight

            // Shooter colors
            shooter: '#44ff88',             // Shooter cross color (green)
            shooterGlow: '#44ff884d',       // Shooter glow effect
            shooterHighlight: '#ffffff26',  // Shooter inner highlight

            // Patrol colors
            patrol: '#aa44ff',              // Patrol fill color (purple)
            patrolGlow: '#aa44ff4d',        // Patrol glow effect
            patrolHighlight: '#ffffff26',   // Patrol inner highlight

            // Follower colors
            follower: '#00ccff',            // Follower fill color (cyan)
            followerGlow: '#00ccff4d',      // Follower glow effect
            followerHighlight: '#ffffff26', // Follower inner highlight

            // Power-up colors
            powerUp: '#00ccff',             // Power-up fill color (light blue)
            powerUpGlow: '#00ccff4d',       // Power-up glow effect
            powerUpIcon: '#ffffff',         // Power-up icon color (white)

            // Power-down colors
            powerDown: '#ff4444',           // Power-down fill color (red)
            powerDownGlow: '#ff44444d',     // Power-down glow effect
            powerDownIcon: '#ffffff',       // Power-down icon color (white)

            // Shield colors
            shield: '#00ccff',              // Shield circle color (light blue)
            shieldGlow: '#00ccff4d',        // Shield glow effect
            shieldIcon: '#ffffff'           // Shield icon color (white)
        },
    },

    // ==========================================
    // Audio Configuration
    // ==========================================
    audio: {
        sounds: {
            shooterTurn: 'audio/sound/shooter_turn.wav',         // Turret rotation sound effect
            shooterShot: 'audio/sound/shooter_shot.wav',         // Turret firing sound effect
            explosionMine: 'audio/sound/explosion_mine.wav',     // Mine detonation sound effect
            mineAlarm: 'audio/sound/mine_alarm.wav',             // Mine trigger alarm sound effect
            menuChange: 'audio/sound/menu_change.wav',           // Menu navigation sound effect
            menuSelect: 'audio/sound/menu_select.wav',           // Menu button selection sound effect
            audioToggle: 'audio/sound/audio_toggle.wav',         // Audio switch toggle sound effect
            closeScreen: 'audio/sound/close_screen.wav',         // Menu/screen close sound effect
            pauseMenu: 'audio/sound/pause_menu.wav',             // Pause menu open sound effect
            explosionPlayer: 'audio/sound/explosion_player.wav', // Player death sound effect
            powerUp: 'audio/sound/power_up.wav',                 // Power-up collection sound effect
            powerDown: 'audio/sound/power_down.wav',             // Power-down collection sound effect
            powerExpired: 'audio/sound/power_expired.wav',       // Power-up expiration sound effect
            shieldBreak: 'audio/sound/shield_break.wav',         // Shield break sound effect
            wrapAround: 'audio/sound/wrap_around.wav'            // Grid wrap teleport sound effect
        },
        music: {
            menu: {
                path: 'audio/music/menu.wav', // Main menu background music
                volume: 0.3 // Volume (0.0 to 1.0)
            },
            game: {
                path: 'audio/music/game.mp3', // Game screen background music
                volume: 0.5 // Volume (0.0 to 1.0)
            }
        }
    },

    // ==========================================
    // Storage Configuration
    // ==========================================
    storage: {
        audioEnabled: 'audio.enabled' // localStorage key for audio toggle state
    },

    // ==========================================
    // Build Version (auto-generated)
    // ==========================================
    version: '2026-01-25 14:06'
}
