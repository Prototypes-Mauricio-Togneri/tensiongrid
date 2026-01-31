/**
 * Analytics helper for tracking game events via Google Analytics 4.
 * All methods are static - no instantiation required.
 */
class Analytics {

    /**
     * Send a generic event to GA4.
     * @param {string} name - Event name
     * @param {Object} data - Event parameters
     */
    static sendEvent(name, data = {}) {
        console.log('Analytics:', name, data)
        if (typeof gtag !== 'function') return
        gtag('event', name, data)
    }

    // ==========================================
    // Session Events
    // ==========================================

    /**
     * Track when a browser session starts.
     */
    static trackSessionStart() {
        this.sendEvent('session_start')
    }

    /**
     * Track when a browser session ends.
     * @param {number} duration - Session duration in milliseconds
     */
    static trackSessionEnd(duration) {
        this.sendEvent('session_end', {
            duration_ms: duration
        })
    }

    // ==========================================
    // Level Events
    // ==========================================

    /**
     * Track when a player starts a level.
     * @param {string|number} levelId - Level identifier
     */
    static trackLevelStart(levelId) {
        this.sendEvent('level_start', {
            level_id: String(levelId)
        })
    }

    /**
     * Track when a player completes a level.
     * @param {string|number} levelId - Level identifier
     * @param {number} deaths - Number of deaths during the level
     * @param {number} duration - Time to complete in milliseconds
     */
    static trackLevelComplete(levelId, deaths, duration) {
        this.sendEvent('level_complete', {
            level_id: String(levelId),
            deaths: deaths,
            duration_ms: duration
        })
    }

    /**
     * Track when a player quits a level mid-game.
     * @param {string|number} levelId - Level identifier
     * @param {number} deaths - Number of deaths before quitting
     */
    static trackLevelQuit(levelId, deaths) {
        this.sendEvent('level_quit', {
            level_id: String(levelId),
            deaths: deaths
        })
    }

    // ==========================================
    // Player Events
    // ==========================================

    /**
     * Track when a player dies.
     * @param {string|number} levelId - Level identifier
     * @param {string} cause - What killed the player (enemy type)
     */
    static trackPlayerDeath(levelId, cause) {
        this.sendEvent('player_death', {
            level_id: String(levelId),
            cause: cause
        })
    }

    /**
     * Track when a player collects a power-up or power-down.
     * @param {string|number} levelId - Level identifier
     * @param {string} powerType - Type of power collected (fast, slow, shield, mirror)
     */
    static trackPowerCollected(levelId, powerType) {
        this.sendEvent('power_collected', {
            level_id: String(levelId),
            power_type: powerType
        })
    }

    /**
     * Track when a player collects the exit switch.
     * @param {string|number} levelId - Level identifier
     */
    static trackSwitchCollected(levelId) {
        this.sendEvent('switch_collected', {
            level_id: String(levelId)
        })
    }
}
