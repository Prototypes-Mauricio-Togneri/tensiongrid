/**
 * Global constants and configuration for Grid Runner.
 * All magic values are centralized here for easy adjustment.
 */
const Constants = {

    // ==========================================
    // DOM Element References
    // ==========================================
    dom: {
        ids: {
            score: 'score',               // Score display element
            canvasWrapper: 'canvasWrapper', // Wrapper for shake effect
            homeScreen: 'homeScreen',     // Home menu screen
            gameScreen: 'gameScreen',     // Game play screen
            levelsScreen: 'levelsScreen', // Level selection screen
            settingsScreen: 'settingsScreen', // Settings screen
            aboutScreen: 'aboutScreen',   // About/credits screen
            audioToggle: 'audioToggle',   // Audio toggle button
            pauseOverlay: 'pauseOverlay', // Pause menu overlay
            gameCanvas: 'gameCanvas',     // Main game canvas
            bgAnimation: 'bgAnimation'    // Background animation container
        },
        classes: {
            shake: 'shake',       // Screen shake animation class
            active: 'active',     // Visible screen class
            selected: 'selected', // Selected menu item class
            menuButton: 'menu-button' // Menu button class
        },
        selectors: {
            homeMenuButtons: '#homeScreen .menu-button',   // Home menu buttons
            aboutMenuButtons: '#aboutScreen .menu-button', // About menu buttons
            levelsMenuButtons: '#levelsScreen .menu-button' // Level select buttons
        }
    },

    // ==========================================
    // Event Types
    // ==========================================
    events: {
        keydown: 'keydown', // Key press event
        keyup: 'keyup',     // Key release event
        resize: 'resize'    // Window resize event
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
          row: -1, // Move up decreases row
          col: 0
        },
        down: {
          row: 1,  // Move down increases row
          col: 0
        },
        left: {
          row: 0,
          col: -1  // Move left decreases column
        },
        right: {
          row: 0,
          col: 1   // Move right increases column
        },
        none: {
          row: 0,  // No movement
          col: 0
        }
    },

    // ==========================================
    // Menu Action Identifiers
    // ==========================================
    actions: {
        home: {
            continue: 'continue', // Continue last game
            levels: 'levels',     // Open level select
            settings: 'settings', // Open settings
            about: 'about'        // Open about screen
        },
        pause: {
            continue: 'continue', // Resume game
            restart: 'restart',   // Restart current level
            quit: 'quit'          // Return to main menu
        },
        levels: {
            level_01: 'level_01', // Level 1 filename
            level_02: 'level_02', // Level 2 filename
            level_03: 'level_03'  // Level 3 filename
        },
        about: {
            credits: 'credits', // Credits section
            terms: 'terms',     // Terms of service
            privacy: 'privacy'  // Privacy policy
        }
    },

    // ==========================================
    // Screen Names
    // ==========================================
    screens: {
        home: 'home',         // Main menu screen
        game: 'game',         // Game play screen
        levels: 'levels',     // Level selection screen
        settings: 'settings', // Settings screen
        about: 'about'        // About/info screen
    },

    // ==========================================
    // Game Configuration
    // ==========================================
    game: {
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

        // Enemy settings
        enemies: {
            bullet: {
                size: 5,   // Bullet size in pixels
                speed: 130 // Bullet speed in pixels/second
            },
            trap: {
                size: 14   // Trap size in pixels
            },
            mine: {
                size: 12,              // Mine size in pixels
                patrolSpawnDelay: 1500 // Detonation delay for patrol-spawned mines in ms
            },
            shooter: {
                size: 28,   // Turret arm length from center in pixels
                armWidth: 10 // Turret arm thickness in pixels
            },
            patrol: {
                size: 12   // Patrol size in pixels
            },
            snake: {
                size: 10  // Half-width of snake body (line will be size * 2 thick)
            },
            follower: {
                size: 12,         // Follower size in pixels
                speed: 100,       // Default speed in pixels/second
                rotationSpeed: 3  // Rotation speed in radians/second
            }
        },

        // Physics settings
        physics: {
            maxDeltaTime: 100,       // Max delta cap to prevent tunneling (ms)
            collisionThreshold: 0.7  // Collision distance multiplier
        },

        // Color palette (hex with optional alpha)
        colors: {
            // Player colors
            player: '#ffffff',             // Player fill color
            playerGlow: '#ffffff99',       // Player glow effect
            playerHighlight: '#ffffff66',  // Player inner highlight
            playerWakeEnd: '#ffffff00',    // Wake trail end (transparent)
            playerWakeShadow: '#ffffff80', // Wake shadow effect

            // Enemy colors
            enemy: '#cc2244',             // Enemy fill color
            enemyGlow: '#cc22444d',       // Enemy glow effect
            enemyHighlight: '#ffffff26',  // Enemy inner highlight
            enemyThreatRing: '#cc22440d', // Threat proximity ring
            enemyWakeEnd: '#cc224400',    // Wake trail end (transparent)
            enemyWakeShadow: '#cc224480', // Wake shadow effect

            // Grid colors
            node: '#1a3a4a44',          // Grid node fill
            nodeHighlight: '#ffffff0d', // Node highlight effect
            edge: '#00f5ff22',          // Grid edge color
            edgeGlow: '#00f5ff0d',      // Edge glow effect

            // Laser colors
            laser: '#ff2a6d',       // Laser beam color
            laserGlow: '#ff2a6d80', // Laser glow effect

            // Trap colors
            trap: '#cc2244',       // Trap fill color (matches enemy)
            trapGlow: '#cc22444d', // Trap glow effect

            // Mine colors
            mine: '#ffaa00',       // Mine fill color (yellow/orange)
            mineGlow: '#ffaa004d', // Mine glow effect

            // Shooter colors
            shooter: '#44ff88',       // Shooter cross color (green)
            shooterGlow: '#44ff884d', // Shooter glow effect

            // Patrol colors
            patrol: '#aa44ff',       // Patrol fill color (purple)
            patrolGlow: '#aa44ff4d', // Patrol glow effect

            // Snake colors
            snake: '#ffaa00',       // Snake segment fill (orange)
            snakeGlow: '#ffaa004d', // Snake glow effect

            // Follower colors
            follower: '#ff8800',       // Follower fill color (orange)
            followerGlow: '#ff88004d'  // Follower glow effect
        }
    },

    // ==========================================
    // Audio Configuration
    // ==========================================
    audio: {
        sounds: {
            shooterTurn: 'audio/sound/shooter_turn.wav' // Turret rotation sound effect
        }
    },

    // ==========================================
    // Storage Configuration
    // ==========================================
    storage: {
        keys: {
            audioEnabled: 'audio.enabled' // localStorage key for audio toggle state
        }
    }
}
