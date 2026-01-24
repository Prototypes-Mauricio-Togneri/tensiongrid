/**
 * Manages the game's UI effects.
 * Handles screen shake effect for collision feedback.
 */
class UIManager {
    constructor() {
        this.canvasWrapper = document.getElementById(Constants.dom.ids.canvasWrapper) // Canvas wrapper for shake effect
    }

    /**
     * Trigger screen shake effect for collision feedback.
     */
    shake() {
        this.canvasWrapper.classList.add(Constants.dom.classes.shake)
        setTimeout(() => this.canvasWrapper.classList.remove(Constants.dom.classes.shake), 400)
    }
}
