/**
 * Centralized localStorage operations.
 * Handles type conversion and default values for persistent settings.
 */
class LocalStorage {
    /**
     * Get audio enabled state from localStorage.
     * @returns {boolean} True if audio enabled (default: true if not set)
     */
    getAudioEnabled() {
        const value = localStorage.getItem(Constants.storage.settingsAudioEnabled)
        return value !== 'false'
    }

    /**
     * Set audio enabled state in localStorage.
     * @param {boolean} enabled - Whether audio is enabled
     */
    setAudioEnabled(enabled) {
        localStorage.setItem(Constants.storage.settingsAudioEnabled, enabled)
    }

    /**
     * Check if current game level exists in localStorage.
     * @returns {boolean} True if level is set
     */
    hasCurrentLevel() {
        const value =  localStorage.getItem(Constants.storage.gameCurrentLevel)

        if (value === null) {
            this.preloadLevel(1)

            return false
        } else {
            this.preloadLevel(parseInt(value, 10))

            return true
        }
    }

    /**
     * Get current game level from localStorage.
     * @returns {number} Current level number
     */
    getCurrentLevel() {
        if (!this.hasCurrentLevel()) {
            this.setCurrentLevel(1)
        }

        return parseInt(localStorage.getItem(Constants.storage.gameCurrentLevel), 10)
    }

    /**
     * Set current game level in localStorage.
     * Triggers preloading of the level.
     * @param {number} level - Level number to save
     */
    setCurrentLevel(level) {
        localStorage.setItem(Constants.storage.gameCurrentLevel, level)
        this.preloadLevel(level)
    }

    /**
     * Build level file path from level number.
     * @param {number} level - Level number
     * @returns {string} Path to level JSON file
     */
    getLevelPath(level) {
        return `levels/level_${String(level).padStart(3, '0')}.json`
    }

    /**
     * Preload a level's JSON file into browser cache.
     * @param {number} level - Level number to preload
     */
    preloadLevel(level) {
        fetch(this.getLevelPath(level)).catch(() => {})
    }
}
