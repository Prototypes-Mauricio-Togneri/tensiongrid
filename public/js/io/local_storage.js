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
            this.setCurrentLevel(1)

            return false
        } else {
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
     * @param {number} level - Level number to save
     */
    setCurrentLevel(level) {
        localStorage.setItem(Constants.storage.gameCurrentLevel, level)
    }
}
