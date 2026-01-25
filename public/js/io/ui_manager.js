/**
 * Manages the game's UI effects.
 * Handles screen shake effect for collision feedback.
 */
class UIManager {
    constructor() {
        this.canvasWrapper = document.getElementById(Constants.dom.ids.canvasWrapper) // Canvas wrapper for shake effect
        this.shakeTimeoutId = null // Timeout ID for shake effect cleanup
    }

    /**
     * Trigger screen shake effect for collision feedback.
     */
    shake() {
        clearTimeout(this.shakeTimeoutId)
        this.canvasWrapper.classList.add(Constants.dom.classes.shake)
        this.shakeTimeoutId = setTimeout(() => this.canvasWrapper.classList.remove(Constants.dom.classes.shake), 400)
    }
}
