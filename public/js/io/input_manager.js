/**
 * Handles keyboard input for player movement and menu navigation.
 * Supports both arrow keys and WASD, with consume pattern for one-shot actions.
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
        this.bindEvents()
    }

    /**
     * Set up keyboard event listeners with key mapping.
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
    }

    /**
     * Get current movement direction based on pressed keys.
     * @returns {Object|null} Direction {dRow, dCol} or null if no movement
     */
    getDirection() {
        if (!this.enabled) return null
        if (this.keys.up) return { dRow: -1, dCol: 0 }
        if (this.keys.down) return { dRow: 1, dCol: 0 }
        if (this.keys.left) return { dRow: 0, dCol: -1 }
        if (this.keys.right) return { dRow: 0, dCol: 1 }
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
}
