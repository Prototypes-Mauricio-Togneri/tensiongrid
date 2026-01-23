/**
 * Manages audio playback for sound effects.
 * Respects the audio toggle setting and supports overlapping sounds.
 * Persists toggle state to localStorage.
 */
class AudioManager {
    /**
     * Initialize audio manager with toggle reference and sound cache.
     * Loads persisted audio state and sets up change listener.
     */
    constructor() {
        this.audioToggle = document.getElementById(Constants.dom.ids.audioToggle) // Audio toggle checkbox
        this.sounds = {} // Cache of preloaded Audio elements by sound key
        this.currentMusic = null    // Currently playing music Audio element
        this.currentMusicKey = null // Key of current music track
        this.userInteracted = false // Whether user has interacted with the page
        this.boundHandleFirstInteraction = this.handleFirstInteraction.bind(this) // Bound handler for cleanup
        this.preloadSounds()
        this.setupInteractionListeners()

        // Load persisted state and sync checkbox
        if (this.audioToggle) {
            this.audioToggle.checked = this.loadAudioState()
            this.audioToggle.addEventListener(Constants.events.change, () => {
                this.saveAudioState()
                // Pause or resume current music based on toggle state
                if (this.currentMusic) {
                    if (this.audioToggle.checked) {
                        this.currentMusic.play().catch(() => {})
                    } else {
                        this.currentMusic.pause()
                    }
                }
            })
        }
    }

    /**
     * Load audio enabled state from localStorage.
     * @returns {boolean} True if audio should be enabled (default: true)
     */
    loadAudioState() {
        const value = localStorage.getItem(Constants.storage.keys.audioEnabled)
        // Default to true if key doesn't exist, only false if explicitly 'false'
        return value !== 'false'
    }

    /**
     * Save current audio toggle state to localStorage.
     */
    saveAudioState() {
        if (this.audioToggle) {
            localStorage.setItem(Constants.storage.keys.audioEnabled, this.audioToggle.checked)
        }
    }

    /**
     * Preload all sound files defined in Constants.audio.sounds.
     * Creates Audio elements for each sound to enable fast playback.
     */
    preloadSounds() {
        for (const path of Object.values(Constants.audio.sounds)) {
            this.sounds[path] = new Audio(path)
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
     * Play a sound effect by path.
     * Clones the audio element to allow overlapping plays.
     * @param {string} soundPath - Path from Constants.audio.sounds
     */
    playSound(soundPath) {
        if (!this.isEnabled()) return

        const sound = this.sounds[soundPath]
        if (!sound) return

        // Clone audio to allow overlapping playback
        const clone = sound.cloneNode()
        clone.play().catch(() => {
            // Silently ignore autoplay restrictions
        })
    }

    /**
     * Play background music by key.
     * Loops continuously. Does nothing if same track already playing.
     * @param {string} musicKey - Key from Constants.audio.music
     */
    playMusic(musicKey) {
        // Skip if same track is already playing
        if (this.currentMusicKey === musicKey) return

        // Stop any currently playing music
        this.stopMusic()

        const config = Constants.audio.music[musicKey]
        if (!config) return

        // Create and configure music element
        this.currentMusic = new Audio(config.path)
        this.currentMusic.loop = true
        this.currentMusic.volume = config.volume
        this.currentMusicKey = musicKey

        // Only play if audio is enabled
        if (this.isEnabled()) {
            this.currentMusic.play().catch(() => {
                // Silently ignore autoplay restrictions
            })
        }
    }

    /**
     * Stop currently playing background music.
     */
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause()
            this.currentMusic.currentTime = 0
        }
        this.currentMusic = null
        this.currentMusicKey = null
    }

    /**
     * Set up event listeners to detect first user interaction.
     * Required to unlock audio playback due to browser autoplay policies.
     */
    setupInteractionListeners() {
        const events = [Constants.events.click, Constants.events.keydown, Constants.events.touchstart]
        events.forEach(event => {
            document.addEventListener(event, this.boundHandleFirstInteraction, { once: true })
        })
    }

    /**
     * Handle first user interaction to unlock audio playback.
     * Attempts to play current music if one is pending, then removes listeners.
     */
    handleFirstInteraction() {
        if (this.userInteracted) return
        this.userInteracted = true

        // Remove all interaction listeners
        const events = [Constants.events.click, Constants.events.keydown, Constants.events.touchstart]
        events.forEach(event => {
            document.removeEventListener(event, this.boundHandleFirstInteraction)
        })

        // Resume music if audio is enabled and music was requested
        if (this.currentMusic && this.isEnabled()) {
            this.currentMusic.play().catch(() => {})
        }
    }
}
