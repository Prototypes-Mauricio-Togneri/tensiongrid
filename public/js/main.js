/**
 * Bootstrap and main application loop.
 * Handles screen navigation, menu input, and game lifecycle.
 */
(() => {
    // Core instances
    const input = new InputManager()
    const game = new Game(Constants.dom.ids.gameCanvas, input)
    const screen = new Screen()
    const audioManager = new AudioManager() // Audio manager for menu sounds

    /**
     * Play main menu background music.
     */
    function playMenuMusic() {
        audioManager.playMusic(Constants.audio.music.menu)
    }

    // Input edge detection state (tracks previous frame to detect key-down events)
    let lastMenuInput = { up: false, down: false }        // For menu navigation
    let lastSettingsInput = { left: false, right: false } // For settings toggles
    const audioToggle = document.getElementById(Constants.dom.ids.audioToggle)

    // Pause menu state
    const pauseOverlay = document.getElementById(Constants.dom.ids.pauseOverlay)
    const pauseButtons = pauseOverlay.querySelectorAll('.' + Constants.dom.classes.menuButton)
    let pauseIndex = 0       // Currently selected pause menu item
    let isPaused = false     // True when pause menu is visible
    let gameStartedFrom = '' // Screen to return to when quitting (home or levels)
    let currentLevel = ''    // Path to current level JSON

    // Enable swipe input only on game screen when not paused
    input.setSwipeEnabled(() =>
        screen.getCurrentScreen() === Constants.screens.game && !isPaused
    )

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
        audioManager.playMusic(Constants.audio.music.game)
        currentLevel = level
        gameStartedFrom = from
        const response = await fetch(currentLevel)
        const levelData = await response.json()
        screen.show(Constants.screens.game)
        game.start(levelData)
    }

    /**
     * Handle home menu action selection.
     * @param {string} action - The action identifier from button dataset
     */
    function handleHomeMenuAction(action) {
        audioManager.playSound(Constants.audio.sounds.menuSelect)
        if (action === Constants.actions.home.continue) {
            openGameScreen('levels/level_01.json', Constants.screens.home)
        } else if (action === Constants.actions.home.gym) {
            openGameScreen(Constants.game.gym, Constants.screens.home)
        } else if (action === Constants.actions.home.levels) {
            screen.show(Constants.screens.levels)
        } else if (action === Constants.actions.home.fullscreen) {
            if (document.fullscreenElement) {
                document.exitFullscreen()
            } else {
                document.documentElement.requestFullscreen()
            }
        } else if (action === Constants.actions.home.settings) {
            screen.show(Constants.screens.settings)
        }
    }

    /**
     * Handle pause menu action selection.
     * @param {string} action - The action identifier from button dataset
     */
    function handlePauseMenuAction(action) {
        audioManager.playSound(Constants.audio.sounds.menuSelect)
        if (action === Constants.actions.pause.continue) {
            hidePauseMenu()
            game.resume()
        } else if (action === Constants.actions.pause.restart) {
            hidePauseMenu()
            game.reset()
            game.resume()
        } else if (action === Constants.actions.pause.quit) {
            audioManager.playSound(Constants.audio.sounds.closeScreen)
            hidePauseMenu()
            game.stop()
            playMenuMusic()
            screen.show(gameStartedFrom)
        }
    }

    /**
     * Handle levels menu action selection.
     * @param {string} action - The action identifier from button dataset
     */
    function handleLevelsMenuAction(action) {
        audioManager.playSound(Constants.audio.sounds.menuSelect)
        const levelPath = `levels/${action}.json`
        openGameScreen(levelPath, Constants.screens.levels)
    }

    /**
     * Main application loop.
     * Handles all input routing based on current screen state.
     */
    function mainLoop() {
        const currentScreen = screen.getCurrentScreen()

        // ESC on game screen toggles pause menu
        if (currentScreen === Constants.screens.game && input.isEscapePressed()) {
            input.consumeEscape()
            if (isPaused) {
                audioManager.playSound(Constants.audio.sounds.closeScreen)
                hidePauseMenu()
                game.resume()
            } else {
                audioManager.playSound(Constants.audio.sounds.pauseMenu)
                showPauseMenu()
            }
        }

        // ESC on other screens returns to home
        if (currentScreen !== Constants.screens.home && currentScreen !== Constants.screens.game && input.isEscapePressed()) {
            input.consumeEscape()
            audioManager.playSound(Constants.audio.sounds.closeScreen)
            playMenuMusic()
            screen.show(Constants.screens.home)
        }

        // Pause menu input handling
        if (currentScreen === Constants.screens.game && isPaused) {
            const pauseLen = pauseButtons.length

            // Navigate up/down (edge detection)
            if (input.keys.up && !lastMenuInput.up) {
                pauseIndex = (pauseIndex - 1 + pauseLen) % pauseLen
                updatePauseButtonSelection()
                audioManager.playSound(Constants.audio.sounds.menuChange)
            }
            if (input.keys.down && !lastMenuInput.down) {
                pauseIndex = (pauseIndex + 1) % pauseLen
                updatePauseButtonSelection()
                audioManager.playSound(Constants.audio.sounds.menuChange)
            }
            lastMenuInput.up = input.keys.up
            lastMenuInput.down = input.keys.down

            // Handle selection
            if (input.isSelectPressed()) {
                input.consumeSelect()
                handlePauseMenuAction(pauseButtons[pauseIndex].dataset.action)
            }
        }

        // Home screen input handling
        if (currentScreen === Constants.screens.home) {
            // Navigate menu (edge detection)
            if (input.keys.up && !lastMenuInput.up) {
                screen.navigateMenu(Constants.keys.up)
                audioManager.playSound(Constants.audio.sounds.menuChange)
            }
            if (input.keys.down && !lastMenuInput.down) {
                screen.navigateMenu(Constants.keys.down)
                audioManager.playSound(Constants.audio.sounds.menuChange)
            }
            lastMenuInput.up = input.keys.up
            lastMenuInput.down = input.keys.down

            // Handle selection
            if (input.isSelectPressed()) {
                input.consumeSelect()
                handleHomeMenuAction(screen.getSelectedAction())
            }
        }

        // Settings screen input handling
        if (currentScreen === Constants.screens.settings) {
            // Toggle audio on left/right (edge detection)
            if ((input.keys.left && !lastSettingsInput.left) ||
                (input.keys.right && !lastSettingsInput.right)) {
                audioToggle.checked = !audioToggle.checked
                audioToggle.dispatchEvent(new Event(Constants.events.change))
                // Play sound only when enabling audio (off → on)
                if (audioToggle.checked) {
                    audioManager.playSound(Constants.audio.sounds.audioToggle)
                }
            }
            lastSettingsInput.left = input.keys.left
            lastSettingsInput.right = input.keys.right
        }

        // Levels screen input handling
        if (currentScreen === Constants.screens.levels) {
            // Navigate menu (edge detection)
            if (input.keys.up && !lastMenuInput.up) {
                screen.navigateLevels(Constants.keys.up)
                audioManager.playSound(Constants.audio.sounds.menuChange)
            }
            if (input.keys.down && !lastMenuInput.down) {
                screen.navigateLevels(Constants.keys.down)
                audioManager.playSound(Constants.audio.sounds.menuChange)
            }
            lastMenuInput.up = input.keys.up
            lastMenuInput.down = input.keys.down

            // Handle level selection
            if (input.isSelectPressed()) {
                input.consumeSelect()
                handleLevelsMenuAction(screen.getSelectedLevelsAction())
            }
        }

        requestAnimationFrame(mainLoop)
    }

    // ==========================================
    // Click Handlers for Menu Buttons
    // ==========================================

    // Home menu button clicks
    screen.buttons.forEach((btn, i) => {
        btn.addEventListener(Constants.events.click, () => {
            screen.menuIndex = i
            screen.updateButtonSelection()
            handleHomeMenuAction(btn.dataset.action)
        })
    })

    // Levels menu button clicks
    screen.levelsButtons.forEach((btn, i) => {
        btn.addEventListener(Constants.events.click, () => {
            screen.levelsIndex = i
            screen.updateLevelsButtonSelection()
            handleLevelsMenuAction(btn.dataset.action)
        })
    })

    // Pause menu button clicks
    pauseButtons.forEach((btn, i) => {
        btn.addEventListener(Constants.events.click, () => {
            if (!isPaused) return
            pauseIndex = i
            updatePauseButtonSelection()
            handlePauseMenuAction(btn.dataset.action)
        })
    })

    // Capture browser back button and treat it as escape key
    history.pushState(null, '')
    window.addEventListener(Constants.events.popstate, () => {
        history.pushState(null, '')
        input.triggerEscape()
    })

    // Initialize version display (convert UTC to local time)
    const utcDate = new Date(Constants.version)
    const localVersion = utcDate.toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
    document.getElementById('versionDisplay').textContent = localVersion

    // Hide dev-only elements when not on localhost
    const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    if (!isLocalhost) {
        document.querySelectorAll('.dev-only').forEach(el => el.style.display = 'none')
    }

    // Initialize and start
    screen.menuIndex = 0
    screen.updateButtonSelection()
    screen.show(Constants.screens.home)
    playMenuMusic()
    mainLoop()
})()
