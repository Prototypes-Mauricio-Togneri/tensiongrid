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
        this.allButtons = document.querySelectorAll(Constants.dom.selectors.homeMenuButtons)      // All home menu buttons
        this.levelsButtons = document.querySelectorAll(Constants.dom.selectors.levelsMenuButtons) // Level select buttons (legacy)
        this.timelineMarkers = []  // Timeline level markers (generated dynamically)
        this.markersContainer = document.getElementById(Constants.dom.ids.timelineMarkers)       // Markers container element
        this.levelCurrentEl = document.getElementById(Constants.dom.ids.levelCurrent)            // Current level counter
        this.levelTotalEl = document.getElementById(Constants.dom.ids.levelTotal)                // Total levels counter
        this.menuIndex = 0    // Selected index in home menu
        this.levelsIndex = 0  // Selected index in levels menu (legacy)
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
            if (i % 5 === 0) {
                marker.classList.add('milestone')
            }
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
        if (this.levelTotalEl) {
            this.levelTotalEl.textContent = totalLevels
        }

        // Initialize selection and position
        this.updateTimelineSelection()
        this.updateTimelinePosition()
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

        // Update timeline position when entering levels screen
        if (screenName === Constants.screens.levels) {
            this.updateTimelinePosition()
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
    }

    /**
     * Update timeline position to always center selected level.
     * Container is positioned at left: 50%, so we translate to put selected marker at origin.
     */
    updateTimelinePosition() {
        if (!this.markersContainer || this.timelineMarkers.length === 0) return

        // Get marker dimensions
        const marker = this.timelineMarkers[0]
        const markerWidth = marker.offsetWidth
        const gap = parseFloat(getComputedStyle(this.markersContainer).gap) || 52

        // Calculate offset: move so selected marker's center is at the container's left edge (which is screen center)
        // Selected marker position from container start = (selectedLevel - 1) * (markerWidth + gap)
        // We need to offset by that plus half the marker width to center it
        const offset = (this.selectedLevel - 1) * (markerWidth + gap) + markerWidth / 2

        this.markersContainer.style.transform = `translateX(-${offset}px)`
    }

    /**
     * Update level counter display.
     */
    updateLevelCounter() {
        if (this.levelCurrentEl) {
            this.levelCurrentEl.textContent = this.selectedLevel
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
        this.updateTimelinePosition()
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
