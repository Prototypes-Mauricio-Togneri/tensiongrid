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
        const enabled = typeof gtag === 'function'

        console.log(`Analytics (${enabled ? 'on' : 'off'}):`, name, data)
        if (!enabled) return
        gtag('event', name, data)
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
     * Track when a player restarts a level from the pause menu.
     * @param {string|number} levelId - Level identifier
     */
    static trackLevelRestart(levelId) {
        this.sendEvent('level_restart', {
            level_id: String(levelId)
        })
    }

    /**
     * Track when a player quits a level mid-game.
     * @param {string|number} levelId - Level identifier
     * @param {number} deaths - Number of deaths before quitting
     * @param {number} duration - Time spent in level in milliseconds
     */
    static trackLevelQuit(levelId, deaths, duration) {
        this.sendEvent('level_quit', {
            level_id: String(levelId),
            deaths: deaths,
            duration_ms: duration
        })
    }

    // ==========================================
    // Player Events
    // ==========================================

    /**
     * Track when a player dies.
     * @param {string|number} levelId - Level identifier
     * @param {string} cause - What killed the player (enemy type)
     * @param {number} row - Player grid row at death
     * @param {number} col - Player grid column at death
     */
    static trackPlayerDeath(levelId, cause, row, col) {
        this.sendEvent('player_death', {
            level_id: String(levelId),
            cause: cause,
            row: row,
            col: col
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
     * @param {string} unlocks - What the switch unlocks (e.g., 'exit')
     */
    static trackSwitchCollected(levelId, unlocks) {
        this.sendEvent('switch_collected', {
            level_id: String(levelId),
            unlocks: unlocks
        })
    }
}
