/**
 * Bootstrap and main application loop.
 * Handles screen navigation, menu input, and game lifecycle.
 */
(() => {
    // Core instances
    const input = new InputManager()
    const game = new Game(Constants.dom.ids.gameCanvas, input)
    const screenManager = new ScreenManager()

    // Input edge detection state (tracks previous frame to detect key-down events)
    let lastMenuInput = { up: false, down: false }       // For menu navigation
    let lastSettingsInput = { left: false, right: false } // For settings toggles
    const audioToggle = document.getElementById(Constants.dom.ids.audioToggle)

    // Pause menu state
    const pauseOverlay = document.getElementById(Constants.dom.ids.pauseOverlay)
    const pauseButtons = pauseOverlay.querySelectorAll('.' + Constants.dom.classes.menuButton)
    let pauseIndex = 0   // Currently selected pause menu item
    let isPaused = false // True when pause menu is visible
    let gameStartedFrom = '' // Screen to return to when quitting (home or levels)
    let currentLevel = ''    // Path to current level JSON

    /**
     * Update pause menu button selection visual state.
     */
    function updatePauseButtonSelection() {
        pauseButtons.forEach((btn, i) => {
            btn.classList.toggle(Constants.dom.classes.selected, i === pauseIndex)
        })
    }

    /**
     * Show pause menu and pause game.
     */
    function showPauseMenu() {
        isPaused = true
        pauseIndex = 0
        updatePauseButtonSelection()
        pauseOverlay.classList.add(Constants.dom.classes.active)
        game.pause()
    }

    /**
     * Hide pause menu (game must be resumed separately).
     */
    function hidePauseMenu() {
        isPaused = false
        pauseOverlay.classList.remove(Constants.dom.classes.active)
    }

    /**
     * Load level JSON and start game.
     * @param {string} level - Path to level JSON file
     * @param {string} from - Screen to return to on quit
     */
    async function openGameScreen(level, from) {
        currentLevel = level
        gameStartedFrom = from
        const response = await fetch(currentLevel)
        const levelData = await response.json()
        screenManager.show(Constants.screens.game)
        game.start(levelData)
    }

    /**
     * Main application loop.
     * Handles all input routing based on current screen state.
     */
    function mainLoop() {
        const currentScreen = screenManager.getCurrentScreen()

        // ESC on game screen toggles pause menu
        if (currentScreen === Constants.screens.game && input.isEscapePressed()) {
            input.consumeEscape()
            if (isPaused) {
                hidePauseMenu()
                game.resume()
            } else {
                showPauseMenu()
            }
        }

        // ESC on other screens returns to home
        if (currentScreen !== Constants.screens.home && currentScreen !== Constants.screens.game && input.isEscapePressed()) {
            input.consumeEscape()
            screenManager.show(Constants.screens.home)
        }

        // Pause menu input handling
        if (currentScreen === Constants.screens.game && isPaused) {
            const pauseLen = pauseButtons.length

            // Navigate up/down (edge detection)
            if (input.keys.up && !lastMenuInput.up) {
                pauseIndex = (pauseIndex - 1 + pauseLen) % pauseLen
                updatePauseButtonSelection()
            }
            if (input.keys.down && !lastMenuInput.down) {
                pauseIndex = (pauseIndex + 1) % pauseLen
                updatePauseButtonSelection()
            }
            lastMenuInput.up = input.keys.up
            lastMenuInput.down = input.keys.down

            // Handle selection
            if (input.isSelectPressed()) {
                input.consumeSelect()
                const action = pauseButtons[pauseIndex].dataset.action
                if (action === Constants.actions.pause.continue) {
                    hidePauseMenu()
                    game.resume()
                } else if (action === Constants.actions.pause.quit) {
                    hidePauseMenu()
                    game.stop()
                    screenManager.show(gameStartedFrom)
                }
            }
        }

        // Home screen input handling
        if (currentScreen === Constants.screens.home) {
            // Navigate menu (edge detection)
            if (input.keys.up && !lastMenuInput.up) {
                screenManager.navigateMenu(Constants.keys.up)
            }
            if (input.keys.down && !lastMenuInput.down) {
                screenManager.navigateMenu(Constants.keys.down)
            }
            lastMenuInput.up = input.keys.up
            lastMenuInput.down = input.keys.down

            // Handle selection
            if (input.isSelectPressed()) {
                input.consumeSelect()
                const action = screenManager.getSelectedAction()
                if (action === Constants.actions.home.continue) {
                    openGameScreen('levels/level_01.json', Constants.screens.home)
                } else if (action === Constants.actions.home.levels) {
                    screenManager.show(Constants.screens.levels)
                } else if (action === Constants.actions.home.settings) {
                    screenManager.show(Constants.screens.settings)
                } else if (action === Constants.actions.home.about) {
                    screenManager.show(Constants.screens.about)
                }
            }
        }

        // Settings screen input handling
        if (currentScreen === Constants.screens.settings) {
            // Toggle audio on left/right (edge detection)
            if ((input.keys.left && !lastSettingsInput.left) ||
                (input.keys.right && !lastSettingsInput.right)) {
                audioToggle.checked = !audioToggle.checked
            }
            lastSettingsInput.left = input.keys.left
            lastSettingsInput.right = input.keys.right
        }

        // About screen input handling
        if (currentScreen === Constants.screens.about) {
            // Navigate menu (edge detection)
            if (input.keys.up && !lastMenuInput.up) {
                screenManager.navigateAbout(Constants.keys.up)
            }
            if (input.keys.down && !lastMenuInput.down) {
                screenManager.navigateAbout(Constants.keys.down)
            }
            lastMenuInput.up = input.keys.up
            lastMenuInput.down = input.keys.down
        }

        // Levels screen input handling
        if (currentScreen === Constants.screens.levels) {
            // Navigate menu (edge detection)
            if (input.keys.up && !lastMenuInput.up) {
                screenManager.navigateLevels(Constants.keys.up)
            }
            if (input.keys.down && !lastMenuInput.down) {
                screenManager.navigateLevels(Constants.keys.down)
            }
            lastMenuInput.up = input.keys.up
            lastMenuInput.down = input.keys.down

            // Handle level selection
            if (input.isSelectPressed()) {
                input.consumeSelect()
                const action = screenManager.getSelectedLevelsAction()
                const levelPath = `levels/${action}.json`
                if (levelPath) {
                    openGameScreen(levelPath, Constants.screens.levels)
                }
            }
        }

        requestAnimationFrame(mainLoop)
    }

    // Initialize and start
    screenManager.show(Constants.screens.home)
    mainLoop()
})()
