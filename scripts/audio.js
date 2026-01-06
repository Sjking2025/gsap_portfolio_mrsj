/**
 * audio.js - Audio Persistence System
 * Cinematic ambient audio with controls and state management
 */

const AudioManager = {
    audio: null,
    isPlaying: false,
    volume: 0.3,
    storageKey: 'metalayer-audio',
    audioSrc: 'assets/audio/ambient.mp3', // Will be replaced with actual audio

    /**
     * Initialize the audio system
     */
    init() {
        // Create audio element
        this.audio = new Audio();
        this.audio.loop = true;
        this.audio.volume = this.volume;

        // Load saved state
        this.loadState();

        // Set up event listeners
        this.setupEventListeners();

        console.log('🔊 Audio Manager initialized');
    },

    /**
     * Load saved audio state from localStorage
     */
    loadState() {
        try {
            const savedState = localStorage.getItem(this.storageKey);
            if (savedState) {
                const state = JSON.parse(savedState);
                this.volume = state.volume || 0.3;
                this.audio.volume = this.volume;
            }
        } catch (e) {
            console.warn('Could not load audio state:', e);
        }
    },

    /**
     * Save audio state to localStorage
     */
    saveState() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify({
                volume: this.volume,
                wasPlaying: this.isPlaying
            }));
        } catch (e) {
            console.warn('Could not save audio state:', e);
        }
    },

    /**
     * Set up event listeners for audio controls
     */
    setupEventListeners() {
        const toggleBtn = document.querySelector('.audio-toggle');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggle();
            });
        }

        // Also allow first interaction to enable audio
        document.addEventListener('click', () => this.onFirstInteraction(), { once: true });
        document.addEventListener('keydown', () => this.onFirstInteraction(), { once: true });
    },

    /**
     * Handle first user interaction (for autoplay policies)
     */
    onFirstInteraction() {
        // Check if user had audio enabled before
        try {
            const savedState = localStorage.getItem(this.storageKey);
            if (savedState) {
                const state = JSON.parse(savedState);
                if (state.wasPlaying) {
                    // Don't auto-play, just prepare
                    this.audio.src = this.audioSrc;
                    this.audio.load();
                }
            }
        } catch (e) {
            // Ignore errors
        }
    },

    /**
     * Toggle audio playback
     */
    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    },

    /**
     * Start playing audio
     */
    async play() {
        try {
            // Load source if not loaded
            if (!this.audio.src || this.audio.src === window.location.href) {
                this.audio.src = this.audioSrc;
            }

            await this.audio.play();
            this.isPlaying = true;
            this.updateUI();
            this.saveState();

            // Trigger achievement
            if (window.AchievementManager) {
                window.AchievementManager.unlock('audiophile');
            }

            console.log('🔊 Audio playing');
        } catch (e) {
            console.warn('Could not play audio:', e);
            // Audio file might not exist yet
            this.showAudioNotice();
        }
    },

    /**
     * Pause audio
     */
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateUI();
        this.saveState();
        console.log('🔇 Audio paused');
    },

    /**
     * Set volume
     * @param {number} value - Volume from 0 to 1
     */
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        this.audio.volume = this.volume;
        this.saveState();
    },

    /**
     * Update UI to reflect audio state
     */
    updateUI() {
        const toggleBtn = document.querySelector('.audio-toggle');
        if (toggleBtn) {
            toggleBtn.setAttribute('data-playing', this.isPlaying);
        }
    },

    /**
     * Show notice when audio file is not available
     */
    showAudioNotice() {
        // Create a temporary toast notification
        if (window.AchievementManager) {
            const container = document.querySelector('.achievement-container');
            if (container) {
                const toast = document.createElement('div');
                toast.className = 'achievement-toast';
                toast.innerHTML = `
                    <div class="achievement-toast__icon">🎵</div>
                    <div class="achievement-toast__content">
                        <div class="achievement-toast__title">Audio Coming Soon</div>
                        <div class="achievement-toast__text">Add ambient.mp3 to assets/audio/</div>
                    </div>
                `;
                container.appendChild(toast);

                // Show and hide toast
                setTimeout(() => toast.classList.add('show'), 100);
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }
        }
    }
};

// Export for use in other modules
window.AudioManager = AudioManager;
