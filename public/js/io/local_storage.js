/**
 * Centralized localStorage operations.
 * Handles type conversion and default values for persistent settings.
 * All access is guarded against exceptions (e.g. Safari Private Browsing).
 */
class LocalStorage {
    /**
     * Safe wrapper for localStorage.getItem.
     * Returns null if localStorage is unavailable.
     * @param {string} key - Storage key
     * @returns {string|null} Stored value or null
     */
    safeGet(key) {
        try {
            return localStorage.getItem(key)
        } catch (_) {
            return null
        }
    }

    /**
     * Safe wrapper for localStorage.setItem.
     * Silently fails if localStorage is unavailable.
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     */
    safeSet(key, value) {
        try {
            localStorage.setItem(key, value)
        } catch (_) {
            // Silently ignore (e.g. Safari Private Browsing)
        }
    }

    /**
     * Safe wrapper for localStorage.removeItem.
     * Silently fails if localStorage is unavailable.
     * @param {string} key - Storage key
     */
    safeRemove(key) {
        try {
            localStorage.removeItem(key)
        } catch (_) {
            // Silently ignore
        }
    }

    /**
     * Get audio enabled state from localStorage.
     * @returns {boolean} True if audio enabled (default: true if not set)
     */
    getAudioEnabled() {
        const value = this.safeGet(Constants.storage.settingsAudioEnabled)
        return value !== 'false'
    }

    /**
     * Set audio enabled state in localStorage.
     * @param {boolean} enabled - Whether audio is enabled
     */
    setAudioEnabled(enabled) {
        this.safeSet(Constants.storage.settingsAudioEnabled, enabled)
    }

    /**
     * Get scanlines enabled state from localStorage.
     * @returns {boolean} True if scanlines enabled (default: true if not set)
     */
    getScanlinesEnabled() {
        const value = this.safeGet(Constants.storage.settingsScanlinesEnabled)
        return value !== 'false'
    }

    /**
     * Set scanlines enabled state in localStorage.
     * @param {boolean} enabled - Whether scanlines are enabled
     */
    setScanlinesEnabled(enabled) {
        this.safeSet(Constants.storage.settingsScanlinesEnabled, enabled)
    }

    /**
     * Get glow enabled state from localStorage.
     * @returns {boolean} True if glow enabled (default: true if not set)
     */
    getGlowEnabled() {
        const value = this.safeGet(Constants.storage.settingsGlowEnabled)
        return value !== 'false'
    }

    /**
     * Set glow enabled state in localStorage.
     * @param {boolean} enabled - Whether glow is enabled
     */
    setGlowEnabled(enabled) {
        this.safeSet(Constants.storage.settingsGlowEnabled, enabled)
    }

    /**
     * Check if current game level exists in localStorage.
     * @returns {boolean} True if level is set
     */
    hasCurrentLevel() {
        const value = this.safeGet(Constants.storage.gameCurrentLevel)

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
     * @returns {number} Current level number (defaults to 1 if invalid)
     */
    getCurrentLevel() {
        if (!this.hasCurrentLevel()) {
            this.setCurrentLevel(1)
        }

        const level = parseInt(this.safeGet(Constants.storage.gameCurrentLevel), 10)
        // Validate: must be a positive integer
        if (isNaN(level) || level < 1) {
            this.setCurrentLevel(1)
            return 1
        }
        return level
    }

    /**
     * Set current game level in localStorage.
     * @param {number} level - Level number to save
     */
    setCurrentLevel(level) {
        this.safeSet(Constants.storage.gameCurrentLevel, level)
    }

    /**
     * Check if a level is unlocked based on current progress.
     * @param {number} level - Level number to check
     * @returns {boolean} True if level is unlocked
     */
    isLevelUnlocked(level) {
        return level <= this.getCurrentLevel()
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
     * Get best star count for a level.
     * @param {number} levelId - Level number
     * @returns {number} Star count (0 if no stars saved)
     */
    getStars(levelId) {
        const value = this.safeGet(Constants.storage.starsPrefix + levelId)
        const stars = parseInt(value, 10)
        return isNaN(stars) ? 0 : stars
    }

    /**
     * Save star count for a level (only if better than existing).
     * @param {number} levelId - Level number
     * @param {number} stars - Star count (1-3)
     */
    setStars(levelId, stars) {
        const current = this.getStars(levelId)
        if (stars > current) {
            this.safeSet(Constants.storage.starsPrefix + levelId, stars)
        }
    }

    /**
     * Clear all saved star data.
     */
    clearStars() {
        for (let i = 1; i <= Constants.game.totalLevels; i++) {
            this.safeRemove(Constants.storage.starsPrefix + i)
        }
    }

    /**
     * Preload a level's JSON file into browser cache.
     * @param {number} level - Level number to preload
     */
    preloadLevel(level) {
        if (level < 1 || level > Constants.game.totalLevels) {
            return
        }

        const path = this.getLevelPath(level)
        fetch(path).catch((_) => {
            // Ignore errors during preloading
        })
    }
}
