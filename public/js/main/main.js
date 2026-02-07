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
    let lastSettingsInput = { left: false, right: false, up: false, down: false } // For settings toggles
    let lastLevelsInput = { left: false, right: false }   // For levels timeline navigation
    let lastDebugInput = false                             // For debug mode toggle

    // Continuous navigation state for levels timeline
    let levelsRepeatTimer = null   // Timer for repeat navigation
    let levelsRepeatDirection = null // Current repeat direction ('left' or 'right')
    const audioToggle = document.getElementById(Constants.dom.ids.audioToggle)
    const scanlinesToggle = document.getElementById(Constants.dom.ids.scanlinesToggle)
    const settingsItems = document.querySelectorAll('#settingsScreen .settings-item')
    let settingsFocusIndex = 0
    const settingsToggles = [audioToggle, scanlinesToggle]

    // Changelog scroll container
    const changelogContent = document.querySelector('#changelogScreen .changelog-content')

    // Reset progress dialog state
    const resetOverlay = document.getElementById(Constants.dom.ids.resetProgressOverlay)
    const resetDialogButtons = resetOverlay.querySelectorAll('.' + Constants.dom.classes.menuButton)
    let isResetDialogOpen = false
    let resetDialogIndex = 1 // 0=Yes, 1=No (default to safe option)

    /**
     * Update visual focus indicator on settings items.
     */
    function updateSettingsFocus() {
        settingsItems.forEach((item, i) => {
            item.classList.toggle(Constants.dom.classes.focused, i === settingsFocusIndex)
        })
    }

    // Initialize scanlines toggle from persisted state
    if (scanlinesToggle) {
        scanlinesToggle.checked = storage.getScanlinesEnabled()
        if (!scanlinesToggle.checked) {
            document.body.classList.add(Constants.dom.classes.noScanlines)
        }
        scanlinesToggle.addEventListener(Constants.events.change, () => {
            storage.setScanlinesEnabled(scanlinesToggle.checked)
            document.body.classList.toggle(Constants.dom.classes.noScanlines, !scanlinesToggle.checked)
        })
    }

    // Pause menu state
    // Note: pauseButtons is queried once at init. Button count assumed fixed in HTML.
    const levelFileInput = document.getElementById(Constants.dom.ids.levelFileInput)
    const pauseOverlay = document.getElementById(Constants.dom.ids.pauseOverlay)
    const pauseLevel = document.getElementById(Constants.dom.ids.pauseLevel)
    const pauseButtons = pauseOverlay.querySelectorAll('.' + Constants.dom.classes.menuButton)
    let pauseIndex = 0       // Currently selected pause menu item
    let isPaused = false     // True when pause menu is visible
    let isSoftPaused = false // True when game is paused via P key (no menu)
    let gameStartedFrom = '' // Screen to return to when quitting (home or levels)
    let currentLevel = ''    // Path to current level JSON
    let isCustomLevel = false // True when playing a user-uploaded level

    /**
     * Whether analytics should be tracked for the current level.
     * Disabled for gym and custom (uploaded) levels.
     * @returns {boolean}
     */
    function shouldTrackAnalytics() {
        return !isCustomLevel && !currentLevel.startsWith('gyms/')
    }

    // Enable swipe input on game screen (when not paused) and levels screen
    input.setSwipeEnabled(() => {
        const currentScreen = screen.getCurrentScreen()
        return (currentScreen === Constants.screens.game && !isPaused && !isSoftPaused) ||
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
     * Get label text for the pause menu level indicator.
     */
    function getPauseLevelLabel() {
        if (isCustomLevel) return 'CUSTOM'
        if (currentLevel.startsWith('gyms/')) return 'GYM'
        return 'LEVEL ' + String(game.levelData.id).padStart(2, '0')
    }

    /**
     * Show pause menu and pause game.
     */
    function showPauseMenu() {
        isPaused = true
        pauseIndex = 0
        updatePauseButtonSelection()
        pauseLevel.textContent = getPauseLevelLabel()
        pauseOverlay.classList.add(Constants.dom.classes.active)
        game.pause()
    }

    /**
     * Hide pause menu (game must be resumed separately).
     */
    function hidePauseMenu() {
        isPaused = false
        isSoftPaused = false
        pauseOverlay.classList.remove(Constants.dom.classes.active)
    }

    /**
     * Update reset dialog button selection visual state.
     */
    function updateResetDialogSelection() {
        resetDialogButtons.forEach((btn, i) => {
            btn.classList.toggle(Constants.dom.classes.selected, i === resetDialogIndex)
        })
    }

    /**
     * Show reset progress confirmation dialog.
     */
    function showResetDialog() {
        isResetDialogOpen = true
        resetDialogIndex = 1
        updateResetDialogSelection()
        resetOverlay.classList.add(Constants.dom.classes.active)
    }

    /**
     * Hide reset progress confirmation dialog.
     */
    function hideResetDialog() {
        isResetDialogOpen = false
        resetOverlay.classList.remove(Constants.dom.classes.active)
    }

    /**
     * Handle reset dialog action selection.
     * @param {string} action - The action identifier (yes/no)
     */
    function handleResetDialogAction(action) {
        if (action === Constants.actions.resetDialog.yes) {
            audioManager.playSound(Constants.audio.sounds.menuSelect)
            storage.setCurrentLevel(1)
            hideResetDialog()
        } else if (action === Constants.actions.resetDialog.no) {
            audioManager.playSound(Constants.audio.sounds.closeScreen)
            hideResetDialog()
        }
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
        isCustomLevel = false
        currentLevel = levelPath
        gameStartedFrom = from

        const levelData = await loadLevel(levelPath)
        
        if (!levelData) {
            audioManager.playSound(Constants.audio.sounds.closeScreen)
            return
        }  

        const trackAnalytics = shouldTrackAnalytics()

        audioManager.playMusic(Constants.audio.music.game)
        screen.show(Constants.screens.game)
        game.start(levelData, trackAnalytics)
        if (trackAnalytics) Analytics.trackLevelStart(levelData.id)

        // Set exit reached callback
        game.setOnExitReached(() => {
            if (trackAnalytics) {
                const duration = performance.now() - game.startTime
                Analytics.trackLevelComplete(levelData.id, game.deathCount, Math.round(duration))
            }

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

            // Gym levels restart instead of advancing
            if (currentLevel.startsWith('gyms/')) {
                openGameScreen(currentLevel, gameStartedFrom)
                return
            }

            // Check if next level exists
            const nextLevel = levelData.id + 1

            if (nextLevel <= Constants.game.totalLevels) {
                // Auto-advance to next level (use openGameScreen to properly set up new callback)
                const nextLevelPath = storage.getLevelPath(nextLevel)
                openGameScreen(nextLevelPath, gameStartedFrom)
            } else {
                // Last level completed - return to previous screen
                playMenuMusic()
                if (gameStartedFrom === Constants.screens.levels) {
                    screen.updateLevelButtonStates(storage)
                    screen.setSelectedToHighestUnlocked(storage)
                }
                screen.show(gameStartedFrom)
                if (gameStartedFrom === Constants.screens.home) {
                    updateContinueButtonText()
                }
            }
        })
    }

    /**
     * Start game with user-provided level data (no fetch, no storage, no analytics).
     * @param {Object} levelData - Parsed level JSON object
     */
    function openCustomGameScreen(levelData) {
        isCustomLevel = true
        currentLevel = ''
        gameStartedFrom = Constants.screens.custom

        audioManager.playMusic(Constants.audio.music.game)
        screen.show(Constants.screens.game)
        game.start(levelData, false)

        // No storage update on exit reached
        game.setOnExitReached(() => {})

        // Restart custom level on completion
        game.setOnLevelComplete(() => {
            game.stop()
            openCustomGameScreen(levelData)
        })
    }

    /**
     * Read a JSON file from a file input and start the custom game.
     * @param {File} file - The selected JSON file
     */
    async function handleCustomLevelFile(file) {
        try {
            const text = await file.text()
            const levelData = JSON.parse(text)
            openCustomGameScreen(levelData)
        } catch {
            console.error('Failed to parse custom level file')
            audioManager.playSound(Constants.audio.sounds.closeScreen)
        }
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
            const levelNumber = Math.min(storage.getCurrentLevel(), Constants.game.totalLevels)
            const levelPath = `levels/level_${String(levelNumber).padStart(3, '0')}.json`
            openGameScreen(levelPath, Constants.screens.home)
        } else if (action === Constants.actions.home.levels) {
            screen.updateLevelButtonStates(storage)
            screen.setSelectedToHighestUnlocked(storage)
            screen.show(Constants.screens.levels)
        } else if (action === Constants.actions.home.custom) {
            screen.customMenuIndex = 0
            screen.updateCustomButtonSelection()
            screen.show(Constants.screens.custom)
        } else if (action === Constants.actions.home.settings) {
            settingsFocusIndex = 0
            updateSettingsFocus()
            screen.show(Constants.screens.settings)
        } else if (action === Constants.actions.home.about) {
            screen.aboutMenuIndex = 0
            screen.updateAboutButtonSelection()
            screen.show(Constants.screens.about)
        }
    }

    /**
     * Handle custom screen menu action selection.
     * @param {string} action - The action identifier from button dataset
     */
    function handleCustomMenuAction(action) {
        audioManager.playSound(Constants.audio.sounds.menuSelect)
        if (action === Constants.actions.custom.download) {
            downloadTemplateFile()
        } else if (action === Constants.actions.custom.upload) {
            levelFileInput.click()
        }
    }

    /**
     * Handle about screen menu action selection.
     * @param {string} action - The action identifier from button dataset
     */
    function handleAboutMenuAction(action) {
        audioManager.playSound(Constants.audio.sounds.menuSelect)
        if (action === Constants.actions.about.feedback) {
            window.open(Constants.urls.feedback)
        } else if (action === Constants.actions.about.changelog) {
            changelogContent.scrollTop = 0
            screen.show(Constants.screens.changelog)
        } else if (action === Constants.actions.about.moreGames) {
            screen.moreGamesMenuIndex = 0
            screen.updateMoreGamesButtonSelection()
            screen.show(Constants.screens.moreGames)
        }
    }

    /**
     * Handle more games screen menu action selection.
     * @param {string} action - The action identifier from button dataset
     */
    function handleMoreGamesMenuAction(action) {
        audioManager.playSound(Constants.audio.sounds.menuSelect)
        if (action === Constants.actions.moreGames.tensionTunnel) {
            window.open(Constants.urls.tensionTunnel, '_blank')
        } else if (action === Constants.actions.moreGames.hextrategic) {
            window.open(Constants.urls.hextrategic, '_blank')
        }
    }

    /**
     * Download the level template JSON file.
     */
    function downloadTemplateFile() {
        const link = document.createElement('a')
        link.href = Constants.game.template
        link.download = 'template.json'
        link.click()
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
            if (shouldTrackAnalytics()) {
                Analytics.trackLevelRestart(game.levelData.id)
            }
            hidePauseMenu()
            game.reset()
            game.resume()
        } else if (action === Constants.actions.pause.quit) {
            if (shouldTrackAnalytics()) {
                Analytics.trackLevelQuit(game.levelData.id, game.deathCount, Math.round(performance.now() - game.startTime))
            }
            audioManager.playSound(Constants.audio.sounds.closeScreen)
            hidePauseMenu()
            game.stop()
            playMenuMusic()
            if (gameStartedFrom === Constants.screens.levels) {
                screen.updateLevelButtonStates(storage)
                screen.setSelectedToHighestUnlocked(storage)
            }
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
            } else if (isSoftPaused) {
                // Convert soft pause to full pause (game already paused)
                isSoftPaused = false
                audioManager.playSound(Constants.audio.sounds.pauseMenu)
                isPaused = true
                pauseIndex = 0
                updatePauseButtonSelection()
                pauseOverlay.classList.add(Constants.dom.classes.active)
            } else {
                audioManager.playSound(Constants.audio.sounds.pauseMenu)
                showPauseMenu()
            }
        }

        // P on game screen toggles soft pause (no menu)
        if (currentScreen === Constants.screens.game && !isPaused && input.isPausePressed()) {
            input.consumePause()
            if (isSoftPaused) {
                isSoftPaused = false
                game.resume()
            } else {
                isSoftPaused = true
                game.pause()
            }
        }

        // ESC on other screens returns to home (skip if reset dialog is open — handled in settings block)
        if (currentScreen !== Constants.screens.home && currentScreen !== Constants.screens.game && input.isEscapePressed()) {
            if (currentScreen === Constants.screens.settings && isResetDialogOpen) {
                // Dialog ESC is handled in settings input block below
            } else if (currentScreen === Constants.screens.moreGames || currentScreen === Constants.screens.changelog) {
                // More games / changelog screen goes back to about screen
                input.consumeEscape()
                audioManager.playSound(Constants.audio.sounds.closeScreen)
                screen.show(Constants.screens.about)
            } else {
                input.consumeEscape()
                audioManager.playSound(Constants.audio.sounds.closeScreen)
                playMenuMusic()
                screen.show(Constants.screens.home)
                updateContinueButtonText()
            }
        }

        // Debug mode toggle (localhost only, game screen, not paused)
        if (currentScreen === Constants.screens.game && !isPaused) {
            if (input.keys.debug && !lastDebugInput) {
                game.debugMode = !game.debugMode
            }
            lastDebugInput = input.keys.debug
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

        // Custom screen input handling
        if (currentScreen === Constants.screens.custom) {
            // Navigate menu (edge detection, clamped)
            if (input.keys.up && !lastMenuInput.up) {
                if (screen.navigateCustomMenu(Constants.keys.up)) {
                    audioManager.playSound(Constants.audio.sounds.menuChange)
                }
            }
            if (input.keys.down && !lastMenuInput.down) {
                if (screen.navigateCustomMenu(Constants.keys.down)) {
                    audioManager.playSound(Constants.audio.sounds.menuChange)
                }
            }
            lastMenuInput.up = input.keys.up
            lastMenuInput.down = input.keys.down

            // Handle selection
            if (input.isSelectPressed()) {
                input.consumeSelect()
                handleCustomMenuAction(screen.getSelectedCustomAction())
            }
        }

        // About screen input handling
        if (currentScreen === Constants.screens.about) {
            // Navigate menu (edge detection, clamped)
            if (input.keys.up && !lastMenuInput.up) {
                if (screen.navigateAboutMenu(Constants.keys.up)) {
                    audioManager.playSound(Constants.audio.sounds.menuChange)
                }
            }
            if (input.keys.down && !lastMenuInput.down) {
                if (screen.navigateAboutMenu(Constants.keys.down)) {
                    audioManager.playSound(Constants.audio.sounds.menuChange)
                }
            }
            lastMenuInput.up = input.keys.up
            lastMenuInput.down = input.keys.down

            // Handle selection
            if (input.isSelectPressed()) {
                input.consumeSelect()
                handleAboutMenuAction(screen.getSelectedAboutAction())
            }
        }

        // More games screen input handling
        if (currentScreen === Constants.screens.moreGames) {
            // Navigate menu (edge detection, clamped)
            if (input.keys.up && !lastMenuInput.up) {
                if (screen.navigateMoreGamesMenu(Constants.keys.up)) {
                    audioManager.playSound(Constants.audio.sounds.menuChange)
                }
            }
            if (input.keys.down && !lastMenuInput.down) {
                if (screen.navigateMoreGamesMenu(Constants.keys.down)) {
                    audioManager.playSound(Constants.audio.sounds.menuChange)
                }
            }
            lastMenuInput.up = input.keys.up
            lastMenuInput.down = input.keys.down

            // Handle selection
            if (input.isSelectPressed()) {
                input.consumeSelect()
                handleMoreGamesMenuAction(screen.getSelectedMoreGamesAction())
            }
        }

        // Changelog screen input handling (scroll with arrow keys, continuous)
        if (currentScreen === Constants.screens.changelog) {
            if (input.keys.up) {
                changelogContent.scrollTop -= Constants.changelog.scrollStep
            }
            if (input.keys.down) {
                changelogContent.scrollTop += Constants.changelog.scrollStep
            }
        }

        // Settings screen input handling
        if (currentScreen === Constants.screens.settings) {
            if (isResetDialogOpen) {
                // Reset dialog navigation (left/right between Yes/No)
                if (input.keys.left && !lastSettingsInput.left) {
                    resetDialogIndex = Math.max(0, resetDialogIndex - 1)
                    updateResetDialogSelection()
                    audioManager.playSound(Constants.audio.sounds.menuChange)
                }
                if (input.keys.right && !lastSettingsInput.right) {
                    resetDialogIndex = Math.min(resetDialogButtons.length - 1, resetDialogIndex + 1)
                    updateResetDialogSelection()
                    audioManager.playSound(Constants.audio.sounds.menuChange)
                }

                // ESC/Backspace closes dialog
                if (input.isEscapePressed()) {
                    input.consumeEscape()
                    audioManager.playSound(Constants.audio.sounds.closeScreen)
                    hideResetDialog()
                }

                // Enter/Space confirms selection
                if (input.isSelectPressed()) {
                    input.consumeSelect()
                    handleResetDialogAction(resetDialogButtons[resetDialogIndex].dataset.action)
                }
            } else {
                // Navigate between settings with up/down (edge detection)
                if (input.keys.up && !lastSettingsInput.up) {
                    if (settingsFocusIndex > 0) {
                        settingsFocusIndex--
                        updateSettingsFocus()
                        audioManager.playSound(Constants.audio.sounds.menuChange)
                    }
                }
                if (input.keys.down && !lastSettingsInput.down) {
                    if (settingsFocusIndex < settingsItems.length - 1) {
                        settingsFocusIndex++
                        updateSettingsFocus()
                        audioManager.playSound(Constants.audio.sounds.menuChange)
                    }
                }

                // Toggle focused setting on left/right (only for toggle items)
                if (settingsFocusIndex < settingsToggles.length) {
                    if ((input.keys.left && !lastSettingsInput.left) ||
                        (input.keys.right && !lastSettingsInput.right)) {
                        const toggle = settingsToggles[settingsFocusIndex]
                        toggle.checked = !toggle.checked
                        toggle.dispatchEvent(new Event(Constants.events.change))
                        // Play sound (skip when disabling audio since it won't be heard)
                        if (toggle !== audioToggle || toggle.checked) {
                            audioManager.playSound(Constants.audio.sounds.audioToggle)
                        }
                    }
                }

                // Enter/Space toggles switches or opens Reset Progress dialog
                if (input.isSelectPressed()) {
                    input.consumeSelect()
                    if (settingsFocusIndex < settingsToggles.length) {
                        const toggle = settingsToggles[settingsFocusIndex]
                        toggle.checked = !toggle.checked
                        toggle.dispatchEvent(new Event(Constants.events.change))
                        if (toggle !== audioToggle || toggle.checked) {
                            audioManager.playSound(Constants.audio.sounds.audioToggle)
                        }
                    } else if (settingsFocusIndex === settingsItems.length - 1) {
                        audioManager.playSound(Constants.audio.sounds.menuSelect)
                        showResetDialog()
                    }
                }
            }

            lastSettingsInput.left = input.keys.left
            lastSettingsInput.right = input.keys.right
            lastSettingsInput.up = input.keys.up
            lastSettingsInput.down = input.keys.down
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

            // Navigate timeline on swipe (inverted: swipe left = next, swipe right = prev)
            const swipe = input.consumeSwipe()
            if (swipe) {
                const invertedKey = swipe.key === Constants.keys.left ? Constants.keys.right : Constants.keys.left
                if (screen.navigateLevels(invertedKey)) {
                    audioManager.playSound(Constants.audio.sounds.menuChange)
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

    // Hide dev-only elements when not on localhost
    const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    if (!isLocalhost) {
        document.querySelectorAll('.dev-only').forEach(el => el.style.display = 'none')
        screen.invalidateButtonCache()
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

    // Custom screen menu button clicks
    screen.customButtons.forEach((btn, i) => {
        btn.addEventListener(Constants.events.click, () => {
            screen.customMenuIndex = i
            screen.updateCustomButtonSelection()
            handleCustomMenuAction(btn.dataset.action)
        })
    })

    // About screen menu button clicks
    screen.aboutButtons.forEach((btn, i) => {
        btn.addEventListener(Constants.events.click, () => {
            screen.aboutMenuIndex = i
            screen.updateAboutButtonSelection()
            handleAboutMenuAction(btn.dataset.action)
        })
    })

    // More games screen menu button clicks
    screen.moreGamesButtons.forEach((btn, i) => {
        btn.addEventListener(Constants.events.click, () => {
            screen.moreGamesMenuIndex = i
            screen.updateMoreGamesButtonSelection()
            handleMoreGamesMenuAction(btn.dataset.action)
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

    // Reset dialog button clicks
    resetDialogButtons.forEach((btn, i) => {
        btn.addEventListener(Constants.events.click, () => {
            if (!isResetDialogOpen) return
            resetDialogIndex = i
            updateResetDialogSelection()
            handleResetDialogAction(btn.dataset.action)
        })
    })

    // Settings action button click (Reset Progress)
    document.querySelector('#settingsScreen .settings-action .menu-button').addEventListener(Constants.events.click, () => {
        if (screen.getCurrentScreen() !== Constants.screens.settings) return
        settingsFocusIndex = settingsItems.length - 1
        updateSettingsFocus()
        audioManager.playSound(Constants.audio.sounds.menuSelect)
        showResetDialog()
    })

    // Custom level file input handler
    levelFileInput.addEventListener(Constants.events.change, () => {
        const file = levelFileInput.files[0]
        if (file) {
            handleCustomLevelFile(file)
        }
        levelFileInput.value = '' // Reset so same file can be re-selected
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

    // Format changelog dates (convert ISO yyyy-mm-dd to locale "DD MMM YYYY")
    document.querySelectorAll('.changelog-date[data-date]').forEach(el => {
        const date = new Date(el.dataset.date + 'T00:00:00')
        el.textContent = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
    })

    // Initialize and start
    screen.menuIndex = 0
    screen.updateButtonSelection()
    initHomeScreen()
    screen.show(Constants.screens.home)
    playMenuMusic()
    mainLoop()
})()
