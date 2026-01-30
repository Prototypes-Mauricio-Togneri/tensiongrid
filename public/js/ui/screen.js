/**
 * Manages UI screens and menu navigation.
 * Handles showing/hiding screens and tracking selected menu items.
 */
class Screen {
    constructor() {
        this.screens = { // Map of screen name to DOM element
            [Constants.screens.home]: document.getElementById(Constants.dom.ids.homeScreen),
            [Constants.screens.game]: document.getElementById(Constants.dom.ids.gameScreen),
            [Constants.screens.levels]: document.getElementById(Constants.dom.ids.levelsScreen),
            [Constants.screens.settings]: document.getElementById(Constants.dom.ids.settingsScreen)
        }
        this.allButtons = document.querySelectorAll(Constants.dom.selectors.homeMenuButtons) // All home menu buttons
        this.gridNodes = document.querySelectorAll(Constants.dom.selectors.gridNodes)      // Grid coordinate nodes
        this.menuIndex = 0       // Selected index in home menu
        this.selectedLevel = 1   // Selected level number (1-10) for grid
        this.currentScreen = Constants.screens.home // Currently active screen
        this.cachedVisibleButtons = null // Cached visible buttons (invalidated on resize)

        // Invalidate button cache on resize (visibility may change)
        window.addEventListener(Constants.events.resize, () => this.invalidateButtonCache())

        this.updateButtonSelection()
        this.updateLevelsButtonSelection()
    }

    /**
     * Invalidate cached visible buttons (called on resize).
     */
    invalidateButtonCache() {
        this.cachedVisibleButtons = null
    }

    /**
     * Get visible home menu buttons (excludes hidden mobile-only buttons on desktop).
     * Cached to avoid expensive offsetParent checks on every call.
     * @returns {HTMLElement[]} Array of visible button elements
     */
    get buttons() {
        if (this.cachedVisibleButtons === null) {
            this.cachedVisibleButtons = Array.from(this.allButtons).filter(btn => btn.offsetParent !== null)
        }
        return this.cachedVisibleButtons
    }

    /**
     * Show a screen and hide all others.
     * @param {string} screenName - Screen name from Constants.screens
     */
    show(screenName) {
        const previousScreen = this.currentScreen

        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove(Constants.dom.classes.active)
        })

        // Show requested screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add(Constants.dom.classes.active)
            this.currentScreen = screenName
        }

        // Reset selected level when entering levels screen (except when returning from game)
        if (screenName === Constants.screens.levels && previousScreen !== Constants.screens.game) {
            this.selectedLevel = 1
            this.updateLevelsButtonSelection()
        }
    }

    /**
     * Navigate home menu up or down.
     * @param {string} direction - Direction key from Constants.keys
     */
    navigateMenu(direction) {
        if (this.currentScreen !== Constants.screens.home) return false

        const len = this.buttons.length
        let changed = false
        if (direction === Constants.keys.up && this.menuIndex > 0) {
            this.menuIndex--
            changed = true
        } else if (direction === Constants.keys.down && this.menuIndex < len - 1) {
            this.menuIndex++
            changed = true
        }

        if (changed) this.updateButtonSelection()
        return changed
    }

    /**
     * Navigate grid in given direction (4-directional).
     * @param {string} direction - Direction key from Constants.keys (up/down/left/right)
     */
    navigateLevels(direction) {
        if (this.currentScreen !== Constants.screens.levels) return false

        const nav = Constants.levelGrid.navigation[this.selectedLevel]
        if (!nav) return false

        const newLevel = nav[direction]
        if (newLevel === null || newLevel === undefined) return false

        this.selectedLevel = newLevel
        this.updateLevelsButtonSelection()
        return true
    }

    /**
     * Update visual selection state for home menu buttons.
     */
    updateButtonSelection() {
        this.buttons.forEach((btn, i) => {
            btn.classList.toggle(Constants.dom.classes.selected, i === this.menuIndex)
        })
    }

    /**
     * Update visual selection state for grid nodes.
     */
    updateLevelsButtonSelection() {
        this.gridNodes.forEach(node => {
            const level = parseInt(node.dataset.level, 10)
            node.classList.toggle(Constants.dom.classes.selected, level === this.selectedLevel)
        })
    }

    /**
     * Update locked state for grid nodes based on progress.
     * @param {LocalStorage} storage - Storage instance to check unlock state
     */
    updateLevelButtonStates(storage) {
        this.gridNodes.forEach(node => {
            const levelNumber = parseInt(node.dataset.level, 10)
            if (storage.isLevelUnlocked(levelNumber)) {
                node.classList.remove(Constants.dom.classes.locked)
            } else {
                node.classList.add(Constants.dom.classes.locked)
            }
        })
    }

    /**
     * Get action string from currently selected home menu button.
     * @returns {string|null} Action data attribute value
     */
    getSelectedAction() {
        const selectedButton = this.buttons[this.menuIndex]
        return selectedButton ? selectedButton.dataset.action : null
    }

    /**
     * Get action string from currently selected grid node.
     * @returns {string|null} Action data attribute value (level filename)
     */
    getSelectedLevelsAction() {
        const node = Array.from(this.gridNodes).find(
            n => parseInt(n.dataset.level, 10) === this.selectedLevel
        )
        return node ? node.dataset.action : null
    }

    /**
     * Get currently active screen name.
     * @returns {string} Current screen from Constants.screens
     */
    getCurrentScreen() {
        return this.currentScreen
    }
}
