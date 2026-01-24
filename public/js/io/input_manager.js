/**
 * Handles keyboard and touch input for player movement and menu navigation.
 * Supports arrow keys, WASD, and swipe gestures with consume pattern for one-shot actions.
 */
class InputManager {
    constructor() {
        this.keys = { // Current state of tracked keys
            [Constants.keys.up]: false,
            [Constants.keys.down]: false,
            [Constants.keys.left]: false,
            [Constants.keys.right]: false,
            [Constants.keys.escape]: false,
            [Constants.keys.select]: false
        }
        this.enabled = true // False to ignore movement input

        // Touch/swipe state
        this.touchStartX = null       // Touch start X coordinate
        this.touchStartY = null       // Touch start Y coordinate
        this.swipeDirection = null    // Pending swipe direction (consumed on read)
        this.isSwipeEnabled = null    // Callback to check if swipes should trigger movement

        this.bindEvents()
    }

    /**
     * Set callback to determine if swipes should trigger movement.
     * @param {Function} callback - Returns true if swipes should be processed
     */
    setSwipeEnabled(callback) {
        this.isSwipeEnabled = callback
    }

    /**
     * Set up keyboard and touch event listeners.
     */
    bindEvents() {
        const keyMap = {
            ArrowUp: Constants.keys.up,
            ArrowDown: Constants.keys.down,
            ArrowLeft: Constants.keys.left,
            ArrowRight: Constants.keys.right,
            w: Constants.keys.up,
            s: Constants.keys.down,
            a: Constants.keys.left,
            d: Constants.keys.right,
            W: Constants.keys.up,
            S: Constants.keys.down,
            A: Constants.keys.left,
            D: Constants.keys.right,
            Escape: Constants.keys.escape,
            Backspace: Constants.keys.escape,
            Enter: Constants.keys.select,
            ' ': Constants.keys.select
        }

        document.addEventListener(Constants.events.keydown, (e) => {
            if (e.key in keyMap) {
                e.preventDefault()
                // Re-enable input on any valid keypress
                if (!this.enabled) {
                    this.enabled = true
                }
                this.keys[keyMap[e.key]] = true
            }
        })

        document.addEventListener(Constants.events.keyup, (e) => {
            if (e.key in keyMap) {
                this.keys[keyMap[e.key]] = false
            }
        })

        // Touch events for continuous drag detection
        document.addEventListener(Constants.events.touchstart, (e) => {
            if (e.touches.length === 1) {
                this.touchStartX = e.touches[0].clientX
                this.touchStartY = e.touches[0].clientY
                // Re-enable input on touch (same as keydown behavior)
                if (!this.enabled) {
                    this.enabled = true
                }
            }
        })

        document.addEventListener(Constants.events.touchmove, (e) => {
            if (this.touchStartX === null || !this.isSwipeEnabled?.()) return

            // Re-enable input on drag (same as keydown behavior)
            if (!this.enabled) {
                this.enabled = true
            }

            const touch = e.touches[0]
            const deltaX = touch.clientX - this.touchStartX
            const deltaY = touch.clientY - this.touchStartY

            // Determine dominant axis and check threshold
            const absX = Math.abs(deltaX)
            const absY = Math.abs(deltaY)
            const minDist = Constants.swipe.minDistance

            if (absX > absY && absX >= minDist) {
                this.swipeDirection = deltaX > 0 ? Constants.directions.right : Constants.directions.left
                // Reset start position for chaining moves
                this.touchStartX = touch.clientX
                this.touchStartY = touch.clientY
                e.preventDefault()
            } else if (absY >= minDist) {
                this.swipeDirection = deltaY > 0 ? Constants.directions.down : Constants.directions.up
                // Reset start position for chaining moves
                this.touchStartX = touch.clientX
                this.touchStartY = touch.clientY
                e.preventDefault()
            }
        }, { passive: false })

        document.addEventListener(Constants.events.touchend, () => {
            this.touchStartX = null
            this.touchStartY = null
        })
    }

    /**
     * Get current movement direction based on pressed keys or swipe.
     * @returns {Object|null} Direction {row, col} or null if no movement
     */
    getDirection() {
        if (!this.enabled) return null

        // Check swipe first (consumed on read)
        if (this.swipeDirection) {
            const direction = this.swipeDirection
            this.swipeDirection = null
            return direction
        }

        // Check keyboard keys
        if (this.keys.up) return Constants.directions.up
        if (this.keys.down) return Constants.directions.down
        if (this.keys.left) return Constants.directions.left
        if (this.keys.right) return Constants.directions.right
        return null
    }

    /**
     * Disable movement input (e.g., during collision cooldown).
     */
    disable() {
        this.enabled = false
    }

    /**
     * Check if escape key is currently pressed.
     * @returns {boolean} True if escape is pressed
     */
    isEscapePressed() {
        return this.keys.escape
    }

    /**
     * Consume escape key press (reset state after handling).
     */
    consumeEscape() {
        this.keys.escape = false
    }

    /**
     * Check if select key (Enter/Space) is currently pressed.
     * @returns {boolean} True if select is pressed
     */
    isSelectPressed() {
        return this.keys.select
    }

    /**
     * Consume select key press (reset state after handling).
     */
    consumeSelect() {
        this.keys.select = false
    }

    /**
     * Programmatically trigger escape key (e.g., from browser back button).
     */
    triggerEscape() {
        this.keys.escape = true
    }
}
