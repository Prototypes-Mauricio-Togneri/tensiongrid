/**
 * Bootstrap and main application loop.
 * Handles screen navigation, menu input, and game lifecycle.
 */
(() => {
    // Initialize error notifier first to catch all errors
    const errorNotifier = new ErrorNotifier()
    errorNotifier.init()

    // Core instances
    const storage = new LocalStorage()
    const input = new InputManager()
    const audioManager = new AudioManager(storage)
    const game = new Game(Constants.dom.ids.gameCanvas, input, audioManager)
    const screen = new Screen()

    // Debug: expose game globally for console inspection
    window._debug = { game, storage, screen }

    /**
     * Play main menu background music.
     */
    function playMenuMusic() {
        audioManager.playMusic(Constants.audio.music.menu)
    }

    /**
     * Check if this is the user's first play session.
     * @returns {boolean} True if no saved level exists, false otherwise
     */
    function isFirstPlay() {
        return !storage.hasCurrentLevel() || storage.getCurrentLevel() === 1
    }

    /**
     * Update the continue button text based on firstPlay state.
     */
    function updateContinueButtonText() {
        const button = document.querySelector(`[data-action="${Constants.actions.home.continue}"]`)
        if (button) {
            button.textContent = isFirstPlay() ? 'Play' : 'Continue'
        }
    }

    /**
     * Update the continue button text based on firstPlay state and fade in home screen.
     */
    function initHomeScreen() {
        updateContinueButtonText()
        const title = document.getElementById(Constants.dom.ids.homeTitle)
        const menu = document.getElementById(Constants.dom.ids.homeMenu)
        if (title) {
            title.style.opacity = '1'
        }
        if (menu) {
            menu.style.opacity = '1'
        }
    }

    // Input edge detection state (tracks previous frame to detect key-down events)
    let lastMenuInput = { up: false, down: false }        // For menu navigation
    let lastSettingsInput = { left: false, right: false } // For settings toggles
    let lastLevelsInput = { left: false, right: false }   // For levels timeline navigation

    // Continuous navigation state for levels timeline
    let levelsRepeatTimer = null   // Timer for repeat navigation
    let levelsRepeatDirection = null // Current repeat direction ('left' or 'right')
    const audioToggle = document.getElementById(Constants.dom.ids.audioToggle)

    // Pause menu state
    // Note: pauseButtons is queried once at init. Button count assumed fixed in HTML.
    const pauseOverlay = document.getElementById(Constants.dom.ids.pauseOverlay)
    const pauseButtons = pauseOverlay.querySelectorAll('.' + Constants.dom.classes.menuButton)
    let pauseIndex = 0       // Currently selected pause menu item
    let isPaused = false     // True when pause menu is visible
    let gameStartedFrom = '' // Screen to return to when quitting (home or levels)
    let currentLevel = ''    // Path to current level JSON

    // Enable swipe input on game screen (when not paused) and levels screen
    input.setSwipeEnabled(() => {
        const currentScreen = screen.getCurrentScreen()
        return (currentScreen === Constants.screens.game && !isPaused) ||
               currentScreen === Constants.screens.levels
    })

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
     * Load level JSON and preload next level.
     * @param {string} levelPath - Path to level JSON file
     * @returns {Promise<Object|null>} Level data or null on failure
     */
    async function loadLevel(levelPath) {
        try {
            const response = await fetch(levelPath)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }
            const levelData = await response.json()

            // Preload next level
            storage.preloadLevel(levelData.id + 1)

            return levelData
        } catch {
            console.error(`Failed to load level: ${levelPath}`)
            return null
        }
    }

    /**
     * Load level JSON and start game.
     * @param {string} levelPath - Path to level JSON file
     * @param {string} from - Screen to return to on quit
     */
    async function openGameScreen(levelPath, from) {
        currentLevel = levelPath
        gameStartedFrom = from

        const levelData = await loadLevel(levelPath)
        
        if (!levelData) {
            audioManager.playSound(Constants.audio.sounds.closeScreen)
            return
        }  

        audioManager.playMusic(Constants.audio.music.game)
        screen.show(Constants.screens.game)
        game.start(levelData)
        Analytics.trackLevelStart(levelData.id)

        // Set exit reached callback
        game.setOnExitReached(() => {
            const duration = performance.now() - game.startTime
            Analytics.trackLevelComplete(levelData.id, game.deathCount, Math.round(duration))

            // Unlock next level on completion
            const nextLevel = levelData.id + 1

            if (nextLevel > storage.getCurrentLevel()) {
                storage.setCurrentLevel(nextLevel)
            }

            storage.preloadLevel(nextLevel)
        })

        // Set level completion callback
        game.setOnLevelComplete(() => {
            game.stop()

            // Check if next level exists
            const nextLevel = levelData.id + 1

            if (nextLevel <= Constants.game.totalLevels) {
                // Auto-advance to next level (use openGameScreen to properly set up new callback)
                const nextLevelPath = storage.getLevelPath(nextLevel)
                openGameScreen(nextLevelPath, gameStartedFrom)
            } else {
                // Last level completed - return to previous screen
                playMenuMusic()
                screen.show(gameStartedFrom)
                if (gameStartedFrom === Constants.screens.home) {
                    updateContinueButtonText()
                }
            }
        })
    }

    /**
     * Handle home menu action selection.
     * @param {string} action - The action identifier from button dataset
     */
    function handleHomeMenuAction(action) {
        audioManager.playSound(Constants.audio.sounds.menuSelect)
        if (action === Constants.actions.home.gym) {
            openGameScreen(Constants.game.gym, Constants.screens.home)
        } else if (action === Constants.actions.home.continue) {
            const levelNumber = storage.getCurrentLevel()
            const levelPath = `levels/level_${String(levelNumber).padStart(3, '0')}.json`
            openGameScreen(levelPath, Constants.screens.home)
        } else if (action === Constants.actions.home.levels) {
            screen.updateLevelButtonStates(storage)
            screen.setSelectedToHighestUnlocked(storage)
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
            Analytics.trackLevelRestart(game.levelData.id)
            hidePauseMenu()
            game.reset()
            game.resume()
        } else if (action === Constants.actions.pause.quit) {
            Analytics.trackLevelQuit(game.levelData.id, game.deathCount, Math.round(performance.now() - game.startTime))
            audioManager.playSound(Constants.audio.sounds.closeScreen)
            hidePauseMenu()
            game.stop()
            playMenuMusic()
            screen.show(gameStartedFrom)
            if (gameStartedFrom === Constants.screens.home) {
                updateContinueButtonText()
            }
        }
    }

    /**
     * Handle levels menu action selection.
     * @param {string} action - The action identifier from button dataset
     */
    function handleLevelsMenuAction(action) {
        // Block selection of locked levels
        const levelNumber = parseInt(action.split('_')[1], 10)
        if (!storage.isLevelUnlocked(levelNumber)) {
            return
        }
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
                audioManager.playSound(Constants.audio.sounds.pauseMenu)
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
            updateContinueButtonText()
        }

        // Pause menu input handling
        if (currentScreen === Constants.screens.game && isPaused) {
            const pauseLen = pauseButtons.length

            // Navigate up/down (edge detection, clamped)
            if (input.keys.up && !lastMenuInput.up && pauseIndex > 0) {
                pauseIndex--
                updatePauseButtonSelection()
                audioManager.playSound(Constants.audio.sounds.menuChange)
            }
            if (input.keys.down && !lastMenuInput.down && pauseIndex < pauseLen - 1) {
                pauseIndex++
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
            // Navigate menu (edge detection, clamped)
            if (input.keys.up && !lastMenuInput.up) {
                if (screen.navigateMenu(Constants.keys.up)) {
                    audioManager.playSound(Constants.audio.sounds.menuChange)
                }
            }
            if (input.keys.down && !lastMenuInput.down) {
                if (screen.navigateMenu(Constants.keys.down)) {
                    audioManager.playSound(Constants.audio.sounds.menuChange)
                }
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

        // Levels screen input handling (timeline - left/right navigation with repeat)
        if (currentScreen === Constants.screens.levels) {
            // Helper to start repeat navigation
            const startRepeat = (direction) => {
                if (levelsRepeatTimer) return
                levelsRepeatDirection = direction
                levelsRepeatTimer = setTimeout(function repeat() {
                    if (screen.navigateLevels(direction)) {
                        audioManager.playSound(Constants.audio.sounds.menuChange)
                    }
                    levelsRepeatTimer = setTimeout(repeat, Constants.navigation.repeatInterval)
                }, Constants.navigation.repeatDelay)
            }

            // Helper to stop repeat navigation
            const stopRepeat = () => {
                if (levelsRepeatTimer) {
                    clearTimeout(levelsRepeatTimer)
                    levelsRepeatTimer = null
                    levelsRepeatDirection = null
                }
            }

            // Navigate timeline on initial press
            if (input.keys.left && !lastLevelsInput.left) {
                if (screen.navigateLevels(Constants.keys.left)) {
                    audioManager.playSound(Constants.audio.sounds.menuChange)
                }
                startRepeat(Constants.keys.left)
            }
            if (input.keys.right && !lastLevelsInput.right) {
                if (screen.navigateLevels(Constants.keys.right)) {
                    audioManager.playSound(Constants.audio.sounds.menuChange)
                }
                startRepeat(Constants.keys.right)
            }

            // Stop repeat when key released
            if (!input.keys.left && levelsRepeatDirection === Constants.keys.left) {
                stopRepeat()
            }
            if (!input.keys.right && levelsRepeatDirection === Constants.keys.right) {
                stopRepeat()
            }

            lastLevelsInput.left = input.keys.left
            lastLevelsInput.right = input.keys.right

            // Handle level selection
            if (input.isSelectPressed()) {
                input.consumeSelect()
                handleLevelsMenuAction(screen.getSelectedLevelsAction())
            }
        } else {
            // Clear repeat timer when leaving levels screen
            if (levelsRepeatTimer) {
                clearTimeout(levelsRepeatTimer)
                levelsRepeatTimer = null
                levelsRepeatDirection = null
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

    // Levels menu button clicks (legacy)
    screen.levelsButtons.forEach((btn, i) => {
        btn.addEventListener(Constants.events.click, () => {
            screen.levelsIndex = i
            screen.updateLevelsButtonSelection()
            handleLevelsMenuAction(btn.dataset.action)
        })
    })

    // Generate timeline markers dynamically
    screen.generateTimelineMarkers(Constants.game.totalLevels, (marker, level) => {
        if (level !== screen.selectedLevel) {
            // Navigate to this marker
            screen.selectedLevel = level
            screen.updateTimelineSelection()
            screen.updateTimelinePosition()
            screen.updateLevelCounter()
            audioManager.playSound(Constants.audio.sounds.menuChange)
        } else {
            // Already selected - activate it
            handleLevelsMenuAction(marker.dataset.action)
        }
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
    initHomeScreen()
    screen.show(Constants.screens.home)
    playMenuMusic()
    mainLoop()
})()
