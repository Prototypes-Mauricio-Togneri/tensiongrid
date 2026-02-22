/**
 * Manages audio playback for sound effects.
 * Respects the audio toggle setting and supports overlapping sounds.
 * Persists toggle state to localStorage.
 */
class AudioManager {
    /**
     * Initialize audio manager with toggle reference and sound cache.
     * Loads persisted audio state and sets up change listener.
     * @param {LocalStorage} storage - LocalStorage instance for persistence
     */
    constructor(storage) {
        this.storage = storage // LocalStorage instance for persistence
        this.audioToggle = document.getElementById(Constants.dom.ids.audioToggle) // Audio toggle checkbox
        this.sounds = {} // Cache of preloaded Audio elements by sound path
        this.currentMusic = null         // Currently playing music Audio element
        this.currentMusicPath = null     // Path of current music track
        this.currentMusicVolume = null   // Volume of current music track
        this.musicStarted = false        // Whether music playback started successfully
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

        // Pause music when tab loses focus, resume when it regains focus
        document.addEventListener(Constants.events.visibilitychange, () => {
            if (!this.currentMusic) return
            if (document.hidden) {
                this.currentMusic.pause()
            } else if (this.isEnabled()) {
                this.currentMusic.play().catch(() => {})
            }
        })
    }

    /**
     * Load audio enabled state from localStorage.
     * @returns {boolean} True if audio should be enabled (default: true)
     */
    loadAudioState() {
        return this.storage.getAudioEnabled()
    }

    /**
     * Save current audio toggle state to localStorage.
     */
    saveAudioState() {
        if (this.audioToggle) {
            this.storage.setAudioEnabled(this.audioToggle.checked)
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
     * Play background music.
     * Loops continuously. Does nothing if same track already playing.
     * @param {Object} config - Music config with path and volume from Constants.audio.music
     */
    async playMusic(config) {
        if (!config) return

        // Skip if same track is already playing
        if (this.currentMusicPath === config.path) return

        // Stop any currently playing music
        this.stopMusic()

        // Create and configure music element
        this.currentMusic = new Audio(config.path)
        this.currentMusic.loop = true
        this.currentMusic.volume = config.volume
        this.currentMusicPath = config.path
        this.currentMusicVolume = config.volume

        // Only play if audio is enabled
        if (this.isEnabled()) {
            this.musicStarted = false
            try {
                await this.currentMusic.play()
                this.musicStarted = true
            } catch (_) {
                // Silently ignore autoplay restrictions
            }
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
        this.currentMusicPath = null
        this.currentMusicVolume = null
        this.musicStarted = false
    }

    /**
     * Set playback speed of current music.
     * @param {number} rate - Playback rate (1.0 = normal, 0.5 = half speed, 2.0 = double speed)
     */
    setMusicSpeed(rate) {
        if (this.currentMusic) {
            this.currentMusic.playbackRate = rate
        }
    }

    /**
     * Set up event listeners to detect user interaction.
     * Required to unlock audio playback due to browser autoplay policies.
     * Retries on subsequent interactions if the first attempt fails.
     */
    setupInteractionListeners() {
        this.interactionEvents = [Constants.events.click, Constants.events.keydown, Constants.events.touchstart]
        this.interactionEvents.forEach(event => {
            document.addEventListener(event, this.boundHandleFirstInteraction, { capture: true })
        })
    }

    /**
     * Remove interaction listeners after successful audio unlock.
     */
    removeInteractionListeners() {
        this.interactionEvents.forEach(event => {
            document.removeEventListener(event, this.boundHandleFirstInteraction, { capture: true })
        })
    }

    /**
     * Handle user interaction to unlock audio playback.
     * Retries on each interaction until audio plays successfully.
     */
    async handleFirstInteraction() {
        // Already unlocked — remove listeners and stop
        if (this.userInteracted) {
            this.removeInteractionListeners()
            return
        }

        // No music pending or audio disabled — skip but keep listeners
        if (!this.currentMusicPath || !this.isEnabled() || this.musicStarted) return

        // Stop old blocked element before creating new one
        if (this.currentMusic) {
            this.currentMusic.pause()
        }
        // Re-create Audio element within user gesture to unlock on mobile
        this.currentMusic = new Audio(this.currentMusicPath)
        this.currentMusic.loop = true
        this.currentMusic.volume = this.currentMusicVolume
        try {
            await this.currentMusic.play()
            this.musicStarted = true
            this.userInteracted = true
            this.removeInteractionListeners()
        } catch (_) {
            // Keep listeners active to retry on next interaction
        }
    }
}
