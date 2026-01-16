/**
 * Manages audio playback for sound effects.
 * Respects the audio toggle setting and supports overlapping sounds.
 */
class AudioManager {
    /**
     * Initialize audio manager with toggle reference and sound cache.
     */
    constructor() {
        this.audioToggle = document.getElementById(Constants.dom.ids.audioToggle) // Audio toggle checkbox
        this.sounds = {} // Cache of preloaded Audio elements by sound key
        this.preloadSounds()
    }

    /**
     * Preload all sound files defined in Constants.audio.sounds.
     * Creates Audio elements for each sound to enable fast playback.
     */
    preloadSounds() {
        for (const [key, path] of Object.entries(Constants.audio.sounds)) {
            this.sounds[key] = new Audio(path)
        }
    }

    /**
     * Check if audio is currently enabled.
     * @returns {boolean} True if audio toggle is checked
     */
    isEnabled() {
        return this.audioToggle && this.audioToggle.checked
    }

    /**
     * Play a sound effect by key.
     * Clones the audio element to allow overlapping plays.
     * @param {string} soundKey - Key from Constants.audio.sounds
     */
    playSound(soundKey) {
        if (!this.isEnabled()) return

        const sound = this.sounds[soundKey]
        if (!sound) return

        // Clone audio to allow overlapping playback
        const clone = sound.cloneNode()
        clone.play().catch(() => {
            // Silently ignore autoplay restrictions
        })
    }
}
