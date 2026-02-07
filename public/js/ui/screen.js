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
            [Constants.screens.custom]: document.getElementById(Constants.dom.ids.customScreen),
            [Constants.screens.settings]: document.getElementById(Constants.dom.ids.settingsScreen),
            [Constants.screens.about]: document.getElementById(Constants.dom.ids.aboutScreen),
            [Constants.screens.moreGames]: document.getElementById(Constants.dom.ids.moreGamesScreen)
        }
        this.allButtons = document.querySelectorAll(Constants.dom.selectors.homeMenuButtons)            // All home menu buttons
        this.customButtons = document.querySelectorAll(Constants.dom.selectors.customMenuButtons)     // Custom screen menu buttons
        this.aboutButtons = document.querySelectorAll(Constants.dom.selectors.aboutMenuButtons)       // About screen menu buttons
        this.moreGamesButtons = document.querySelectorAll(Constants.dom.selectors.moreGamesMenuButtons) // More games screen menu buttons
        this.levelsButtons = document.querySelectorAll(Constants.dom.selectors.levelsMenuButtons) // Level select buttons (legacy)
        this.timelineMarkers = []  // Timeline level markers (generated dynamically)
        this.markersContainer = document.getElementById(Constants.dom.ids.timelineMarkers)       // Markers container element
        this.levelCurrentElement = document.getElementById(Constants.dom.ids.levelCurrent)            // Current level counter
        this.levelTotalElement = document.getElementById(Constants.dom.ids.levelTotal)                // Total levels counter
        this.menuIndex = 0          // Selected index in home menu
        this.customMenuIndex = 0    // Selected index in custom screen menu
        this.aboutMenuIndex = 0     // Selected index in about screen menu
        this.moreGamesMenuIndex = 0 // Selected index in more games screen menu
        this.levelsIndex = 0     // Selected index in levels menu (legacy)
        this.selectedLevel = 1 // Selected level number for timeline
        this.totalLevels = 0   // Total number of levels
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
     * Generate timeline markers dynamically.
     * @param {number} totalLevels - Total number of levels to generate
     * @param {function} onMarkerClick - Click handler for markers
     */
    generateTimelineMarkers(totalLevels, onMarkerClick) {
        this.totalLevels = totalLevels
        this.markersContainer.innerHTML = ''
        this.timelineMarkers = []

        for (let i = 1; i <= totalLevels; i++) {
            const marker = document.createElement('button')
            marker.className = 'timeline-marker'
            marker.dataset.level = i
            marker.dataset.action = `level_${String(i).padStart(3, '0')}`

            const label = document.createElement('span')
            label.className = 'marker-label'
            label.textContent = i
            marker.appendChild(label)

            marker.addEventListener(Constants.events.click, () => onMarkerClick(marker, i))

            this.markersContainer.appendChild(marker)
            this.timelineMarkers.push(marker)
        }

        // Update counter total
        if (this.levelTotalElement) {
            this.levelTotalElement.textContent = totalLevels
        }

        // Initialize selection and position (no animation on initial load)
        this.updateTimelineSelection()
        this.updateTimelinePosition(false)
        this.updateLevelCounter()
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

        // Update timeline position when entering levels screen (no animation)
        if (screenName === Constants.screens.levels) {
            this.updateTimelinePosition(false)
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
     * Navigate custom screen menu up or down.
     * @param {string} direction - Direction key from Constants.keys
     */
    navigateCustomMenu(direction) {
        if (this.currentScreen !== Constants.screens.custom) return false

        const len = this.customButtons.length
        let changed = false
        if (direction === Constants.keys.up && this.customMenuIndex > 0) {
            this.customMenuIndex--
            changed = true
        } else if (direction === Constants.keys.down && this.customMenuIndex < len - 1) {
            this.customMenuIndex++
            changed = true
        }

        if (changed) this.updateCustomButtonSelection()
        return changed
    }

    /**
     * Navigate about screen menu up or down.
     * @param {string} direction - Direction key from Constants.keys
     */
    navigateAboutMenu(direction) {
        if (this.currentScreen !== Constants.screens.about) return false

        const len = this.aboutButtons.length
        let changed = false
        if (direction === Constants.keys.up && this.aboutMenuIndex > 0) {
            this.aboutMenuIndex--
            changed = true
        } else if (direction === Constants.keys.down && this.aboutMenuIndex < len - 1) {
            this.aboutMenuIndex++
            changed = true
        }

        if (changed) this.updateAboutButtonSelection()
        return changed
    }

    /**
     * Update visual selection state for about screen menu buttons.
     */
    updateAboutButtonSelection() {
        this.aboutButtons.forEach((btn, i) => {
            btn.classList.toggle(Constants.dom.classes.selected, i === this.aboutMenuIndex)
        })
    }

    /**
     * Get action string from currently selected about screen menu button.
     * @returns {string|null} Action data attribute value
     */
    getSelectedAboutAction() {
        const selectedButton = this.aboutButtons[this.aboutMenuIndex]
        return selectedButton ? selectedButton.dataset.action : null
    }

    /**
     * Navigate more games screen menu up or down.
     * @param {string} direction - Direction key from Constants.keys
     */
    navigateMoreGamesMenu(direction) {
        if (this.currentScreen !== Constants.screens.moreGames) return false

        const len = this.moreGamesButtons.length
        let changed = false
        if (direction === Constants.keys.up && this.moreGamesMenuIndex > 0) {
            this.moreGamesMenuIndex--
            changed = true
        } else if (direction === Constants.keys.down && this.moreGamesMenuIndex < len - 1) {
            this.moreGamesMenuIndex++
            changed = true
        }

        if (changed) this.updateMoreGamesButtonSelection()
        return changed
    }

    /**
     * Update visual selection state for more games screen menu buttons.
     */
    updateMoreGamesButtonSelection() {
        this.moreGamesButtons.forEach((btn, i) => {
            btn.classList.toggle(Constants.dom.classes.selected, i === this.moreGamesMenuIndex)
        })
    }

    /**
     * Get action string from currently selected more games screen menu button.
     * @returns {string|null} Action data attribute value
     */
    getSelectedMoreGamesAction() {
        const selectedButton = this.moreGamesButtons[this.moreGamesMenuIndex]
        return selectedButton ? selectedButton.dataset.action : null
    }

    /**
     * Navigate levels timeline left or right.
     * @param {string} direction - Direction key from Constants.keys (left/right)
     */
    navigateLevels(direction) {
        if (this.currentScreen !== Constants.screens.levels) return false

        const totalLevels = this.timelineMarkers.length
        let changed = false
        if (direction === Constants.keys.left && this.selectedLevel > 1) {
            this.selectedLevel--
            changed = true
        } else if (direction === Constants.keys.right && this.selectedLevel < totalLevels) {
            this.selectedLevel++
            changed = true
        }

        if (changed) {
            this.updateTimelineSelection()
            this.updateTimelinePosition()
            this.updateLevelCounter()
        }
        return changed
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
     * Update visual selection state for custom screen menu buttons.
     */
    updateCustomButtonSelection() {
        this.customButtons.forEach((btn, i) => {
            btn.classList.toggle(Constants.dom.classes.selected, i === this.customMenuIndex)
        })
    }

    /**
     * Get action string from currently selected custom screen menu button.
     * @returns {string|null} Action data attribute value
     */
    getSelectedCustomAction() {
        const selectedButton = this.customButtons[this.customMenuIndex]
        return selectedButton ? selectedButton.dataset.action : null
    }

    /**
     * Update visual selection state for levels menu buttons (legacy).
     */
    updateLevelsButtonSelection() {
        this.levelsButtons.forEach((btn, i) => {
            btn.classList.toggle(Constants.dom.classes.selected, i === this.levelsIndex)
        })
    }

    /**
     * Update visual selection state for timeline markers.
     */
    updateTimelineSelection() {
        this.timelineMarkers.forEach(marker => {
            const level = parseInt(marker.dataset.level, 10)
            marker.classList.toggle(Constants.dom.classes.selected, level === this.selectedLevel)
        })
        this.updateMarkerVisibility()
    }

    /**
     * Update marker opacity based on distance from selected level.
     * Markers beyond visibleSideCount fade to fully transparent.
     */
    updateMarkerVisibility() {
        const sideCount = Constants.timeline.visibleSideCount
        const opacitySteps = Constants.timeline.markerOpacity

        this.timelineMarkers.forEach(marker => {
            const level = parseInt(marker.dataset.level, 10)
            const distance = Math.abs(level - this.selectedLevel)

            if (level === this.selectedLevel) {
                marker.style.opacity = ''
            } else if (distance <= sideCount) {
                marker.style.opacity = opacitySteps[distance]
            } else {
                marker.style.opacity = 0
            }
        })
    }

    /**
     * Update timeline position to always center selected level.
     * Container is positioned at left: 50%, so we translate to put selected marker at origin.
     * @param {boolean} animate - Whether to animate the transition (default: true)
     */
    updateTimelinePosition(animate = true) {
        if (!this.markersContainer || this.timelineMarkers.length === 0) return

        // Get marker dimensions
        const marker = this.timelineMarkers[0]
        const markerWidth = marker.offsetWidth
        const gap = parseFloat(getComputedStyle(this.markersContainer).gap) || 52

        // Calculate offset: move so selected marker's center is at the container's left edge (which is screen center)
        // Selected marker position from container start = (selectedLevel - 1) * (markerWidth + gap)
        // We need to offset by that plus half the marker width to center it
        const offset = (this.selectedLevel - 1) * (markerWidth + gap) + markerWidth / 2

        if (!animate) {
            this.markersContainer.style.transition = 'none'
        }
        this.markersContainer.style.transform = `translateX(-${offset}px)`
        if (!animate) {
            // Force reflow to apply transform immediately, then restore transition
            this.markersContainer.offsetHeight
            this.markersContainer.style.transition = ''
        }
    }

    /**
     * Update level counter display.
     */
    updateLevelCounter() {
        if (this.levelCurrentElement) {
            this.levelCurrentElement.textContent = this.selectedLevel
        }
    }

    /**
     * Set selected level to highest unlocked level.
     * @param {LocalStorage} storage - Storage instance to check unlock state
     */
    setSelectedToHighestUnlocked(storage) {
        let highestUnlocked = 1
        for (let i = 1; i <= this.totalLevels; i++) {
            if (storage.isLevelUnlocked(i)) {
                highestUnlocked = i
            }
        }
        this.selectedLevel = highestUnlocked
        this.updateTimelineSelection()
        this.updateTimelinePosition(false)
        this.updateLevelCounter()
    }

    /**
     * Update locked state for level buttons based on progress.
     * @param {LocalStorage} storage - Storage instance to check unlock state
     */
    updateLevelButtonStates(storage) {
        // Update legacy buttons
        this.levelsButtons.forEach(btn => {
            const levelNumber = parseInt(btn.dataset.action.split('_')[1], 10)
            if (storage.isLevelUnlocked(levelNumber)) {
                btn.classList.remove(Constants.dom.classes.locked)
            } else {
                btn.classList.add(Constants.dom.classes.locked)
            }
        })

        // Update timeline markers
        this.timelineMarkers.forEach(marker => {
            const levelNumber = parseInt(marker.dataset.level, 10)
            if (storage.isLevelUnlocked(levelNumber)) {
                marker.classList.remove(Constants.dom.classes.locked)
            } else {
                marker.classList.add(Constants.dom.classes.locked)
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
     * Get action string from currently selected timeline marker.
     * @returns {string|null} Action data attribute value (level filename)
     */
    getSelectedLevelsAction() {
        const selectedMarker = Array.from(this.timelineMarkers).find(
            marker => parseInt(marker.dataset.level, 10) === this.selectedLevel
        )
        return selectedMarker ? selectedMarker.dataset.action : null
    }

    /**
     * Get currently active screen name.
     * @returns {string} Current screen from Constants.screens
     */
    getCurrentScreen() {
        return this.currentScreen
    }
}
