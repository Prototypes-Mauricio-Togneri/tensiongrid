/**
 * Manages UI screens and menu navigation.
 * Handles showing/hiding screens and tracking selected menu items.
 */
class ScreenManager {
    constructor() {
        this.screens = {                          // Map of screen name to DOM element
            [Constants.screens.home]: document.getElementById(Constants.dom.ids.homeScreen),
            [Constants.screens.game]: document.getElementById(Constants.dom.ids.gameScreen),
            [Constants.screens.levels]: document.getElementById(Constants.dom.ids.levelsScreen),
            [Constants.screens.settings]: document.getElementById(Constants.dom.ids.settingsScreen),
            [Constants.screens.about]: document.getElementById(Constants.dom.ids.aboutScreen)
        }
        this.buttons = document.querySelectorAll(Constants.dom.selectors.homeMenuButtons)        // Home menu buttons
        this.aboutButtons = document.querySelectorAll(Constants.dom.selectors.aboutMenuButtons)  // About screen buttons
        this.levelsButtons = document.querySelectorAll(Constants.dom.selectors.levelsMenuButtons) // Level select buttons
        this.menuIndex = 0      // Selected index in home menu
        this.aboutIndex = 0     // Selected index in about menu
        this.levelsIndex = 0    // Selected index in levels menu
        this.currentScreen = Constants.screens.home // Currently active screen

        this.updateButtonSelection()
        this.updateAboutButtonSelection()
        this.updateLevelsButtonSelection()
    }

    /**
     * Show a screen and hide all others.
     * @param {string} screenName - Screen name from Constants.screens
     */
    show(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove(Constants.dom.classes.active)
        })

        // Show requested screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add(Constants.dom.classes.active)
            this.currentScreen = screenName
        }

        // Reset menu index when entering screen
        if (screenName === Constants.screens.about) {
            this.aboutIndex = 0
            this.updateAboutButtonSelection()
        }

        if (screenName === Constants.screens.levels) {
            this.levelsIndex = 0
            this.updateLevelsButtonSelection()
        }
    }

    /**
     * Navigate home menu up or down.
     * @param {string} direction - Direction key from Constants.keys
     */
    navigateMenu(direction) {
        if (this.currentScreen !== Constants.screens.home) return

        const len = this.buttons.length
        if (direction === Constants.keys.up) {
            this.menuIndex = (this.menuIndex - 1 + len) % len
        } else if (direction === Constants.keys.down) {
            this.menuIndex = (this.menuIndex + 1) % len
        }

        this.updateButtonSelection()
    }

    /**
     * Navigate about screen menu up or down.
     * @param {string} direction - Direction key from Constants.keys
     */
    navigateAbout(direction) {
        if (this.currentScreen !== Constants.screens.about) return

        const len = this.aboutButtons.length
        if (direction === Constants.keys.up) {
            this.aboutIndex = (this.aboutIndex - 1 + len) % len
        } else if (direction === Constants.keys.down) {
            this.aboutIndex = (this.aboutIndex + 1) % len
        }

        this.updateAboutButtonSelection()
    }

    /**
     * Navigate levels menu up or down.
     * @param {string} direction - Direction key from Constants.keys
     */
    navigateLevels(direction) {
        if (this.currentScreen !== Constants.screens.levels) return

        const len = this.levelsButtons.length
        if (direction === Constants.keys.up) {
            this.levelsIndex = (this.levelsIndex - 1 + len) % len
        } else if (direction === Constants.keys.down) {
            this.levelsIndex = (this.levelsIndex + 1) % len
        }

        this.updateLevelsButtonSelection()
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
     * Update visual selection state for about menu buttons.
     */
    updateAboutButtonSelection() {
        this.aboutButtons.forEach((btn, i) => {
            btn.classList.toggle(Constants.dom.classes.selected, i === this.aboutIndex)
        })
    }

    /**
     * Update visual selection state for levels menu buttons.
     */
    updateLevelsButtonSelection() {
        this.levelsButtons.forEach((btn, i) => {
            btn.classList.toggle(Constants.dom.classes.selected, i === this.levelsIndex)
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
     * Get action string from currently selected levels button.
     * @returns {string|null} Action data attribute value (level filename)
     */
    getSelectedLevelsAction() {
        const selectedButton = this.levelsButtons[this.levelsIndex]
        return selectedButton ? selectedButton.dataset.action : null
    }

    /**
     * Get currently active screen name.
     * @returns {string} Current screen from Constants.screens
     */
    getCurrentScreen() {
        return this.currentScreen
    }
}
