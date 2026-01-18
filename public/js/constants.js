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
            score: 'score',                   // Score display element
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
            shake: 'shake',           // Screen shake animation class
            active: 'active',         // Visible screen class
            selected: 'selected',     // Selected menu item class
            menuButton: 'menu-button' // Menu button class
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
        keydown: 'keydown',       // Key press event
        keyup: 'keyup',           // Key release event
        resize: 'resize',         // Window resize event
        change: 'change',         // Input change event
        click: 'click',           // Mouse click event
        touchstart: 'touchstart'  // Touch start event
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
    // Cardinal Direction Names
    // ==========================================
    cardinalDirections: {
        up: 'up',
        down: 'down',
        left: 'left',
        right: 'right'
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
            settings: 'settings'  // Open settings
        },
        pause: {
            continue: 'continue', // Resume game
            restart: 'restart',   // Restart current level
            quit: 'quit'          // Return to main menu
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
        // Grid rendering settings
        grid: {
            cellSize: 80,   // Pixels between grid nodes
            nodeRadius: 5,  // Node circle radius in pixels
            edgeWidth: 2    // Edge line width in pixels
        },

        // Player settings
        player: {
            size: 12,                  // Player rhombus size in pixels
            speed: 200,                // Movement speed in pixels/second
            explosionFragments: 7,       // Number of explosion fragments
            explosionFragmentSize: 5,    // Size of each fragment rhombus in pixels
            explosionSpeed: 50,          // Fragment outward speed in pixels/second
            explosionRotationSpeed: 8    // Fragment rotation speed in radians/second
        },

        // Enemy settings
        enemies: {
            bullet: {
                size: 5,   // Bullet size in pixels
                speed: 130 // Bullet speed in pixels/second
            },
            laser: {
                glowTransitionSpeed: 0.004, // Glow change per ms during transitions
                glowMin: 0.3,               // Minimum glow intensity (off state, faded but visible)
                glowMax: 1.0                // Maximum glow intensity (on state)
            },
            trap: {
                size: 14   // Trap size in pixels
            },
            mine: {
                size: 12,              // Mine size in pixels
                patrolSpawnDelay: 1500 // Detonation delay for patrol-spawned mines in ms
            },
            shooter: {
                size: 28,    // Turret arm length from center in pixels
                armWidth: 10 // Turret arm thickness in pixels
            },
            patrol: {
                size: 12 // Patrol size in pixels
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
            collisionThreshold: 0.7, // Collision distance multiplier
            deathPauseMs: 1000       // Pause duration after player death before reset (ms)
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
            laser: '#ff4da6',       // Laser beam color
            laserGlow: '#ff4da680', // Laser glow effect

            // Trap colors
            trap: '#00ccff',       // Trap fill color (cyan/electric blue)
            trapGlow: '#00ccff4d', // Trap glow effect

            // Mine colors
            mine: '#ffaa00',       // Mine fill color (yellow/orange)
            mineGlow: '#ffaa004d', // Mine glow effect

            // Shooter colors
            shooter: '#44ff88',       // Shooter cross color (green)
            shooterGlow: '#44ff884d', // Shooter glow effect

            // Patrol colors
            patrol: '#aa44ff',       // Patrol fill color (purple)
            patrolGlow: '#aa44ff4d', // Patrol glow effect

            // Follower colors
            follower: '#ff8800',       // Follower fill color (orange)
            followerGlow: '#ff88004d'  // Follower glow effect
        }
    },

    // ==========================================
    // Audio Configuration
    // ==========================================
    audio: {
        musicKeys: {
            menu: 'menu',  // Main menu music key
            game: 'game'   // Game screen music key
        },
        keys: {
            shooterTurn: 'shooterTurn',
            shooterShot: 'shooterShot',
            explosionMine: 'explosionMine',
            mineAlarm: 'mineAlarm',
            menuChange: 'menuChange',
            menuSelect: 'menuSelect',
            audioToggle: 'audioToggle',
            closeScreen: 'closeScreen',
            pauseMenu: 'pauseMenu',
            explosionPlayer: 'explosionPlayer'
        },
        sounds: {
            shooterTurn: 'audio/sound/shooter_turn.wav',        // Turret rotation sound effect
            shooterShot: 'audio/sound/shooter_shot.wav',        // Turret firing sound effect
            explosionMine: 'audio/sound/explosion_mine.wav',    // Mine detonation sound effect
            mineAlarm: 'audio/sound/mine_alarm.wav',            // Mine trigger alarm sound effect
            menuChange: 'audio/sound/menu_change.wav',          // Menu navigation sound effect
            menuSelect: 'audio/sound/menu_select.wav',          // Menu button selection sound effect
            audioToggle: 'audio/sound/audio_toggle.wav',        // Audio switch toggle sound effect
            closeScreen: 'audio/sound/close_screen.wav',        // Menu/screen close sound effect
            pauseMenu: 'audio/sound/pause_menu.wav',            // Pause menu open sound effect
            explosionPlayer: 'audio/sound/explosion_player.wav' // Player death sound effect
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
        keys: {
            audioEnabled: 'audio.enabled' // localStorage key for audio toggle state
        }
    }
}
