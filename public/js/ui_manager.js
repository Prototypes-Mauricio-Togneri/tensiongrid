/**
 * Manages the game's HUD elements.
 * Handles score display and screen shake effect.
 */
class UIManager {
    constructor() {
        this.scoreEl = document.getElementById(Constants.dom.ids.score) // Score display element
        this.canvasWrapper = document.getElementById(Constants.dom.ids.canvasWrapper) // Canvas wrapper for shake effect
        this.score = 0 // Current score value

        this.updateDisplay()
    }

    /**
     * Add points to the score and update display.
     * @param {number} points - Points to add
     */
    addScore(points) {
        this.score += points
        this.updateDisplay()
    }

    /**
     * Reset score to zero.
     */
    reset() {
        this.score = 0
        this.updateDisplay()
    }

    /**
     * Update the score display with zero-padded value.
     */
    updateDisplay() {
        this.scoreEl.textContent = this.score.toString().padStart(6, '0')
    }

    /**
     * Trigger screen shake effect for collision feedback.
     */
    shake() {
        this.canvasWrapper.classList.add(Constants.dom.classes.shake)
        setTimeout(() => this.canvasWrapper.classList.remove(Constants.dom.classes.shake), 400)
    }
}
