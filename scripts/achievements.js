/**
 * achievements.js - Achievement/Notification System
 * Gamified browsing experience with unlockable achievements
 */

const AchievementManager = {
    achievements: [
        {
            id: 'explorer',
            title: 'Explorer',
            description: 'Visit all sections of the portal',
            icon: '🧭',
            unlocked: false
        },
        {
            id: 'nexus-visitor',
            title: 'Nexus Member',
            description: 'Enter the Nexus hub',
            icon: '👥',
            unlocked: false
        },
        {
            id: 'audiophile',
            title: 'Audiophile',
            description: 'Enable cinematic audio',
            icon: '🔊',
            unlocked: false
        },
        {
            id: 'storyteller',
            title: 'Storyteller',
            description: 'Complete the Prologue',
            icon: '📖',
            unlocked: false
        },
        {
            id: 'designer',
            title: 'Theme Master',
            description: 'Change the color theme',
            icon: '🎨',
            unlocked: false
        },
        {
            id: 'connector',
            title: 'Connector',
            description: 'Reach the Contact section',
            icon: '💬',
            unlocked: false
        }
    ],

    storageKey: 'metalayer-achievements',
    sectionsVisited: new Set(),
    toastQueue: [],
    isShowingToast: false,

    /**
     * Initialize the achievement system
     */
    init() {
        // Load saved achievements
        this.loadState();

        // Set up section observers
        this.setupSectionObservers();

        // Update vault display
        this.updateVaultDisplay();

        console.log('🏆 Achievement Manager initialized');
    },

    /**
     * Load saved achievements from localStorage
     */
    loadState() {
        try {
            const savedState = localStorage.getItem(this.storageKey);
            if (savedState) {
                const state = JSON.parse(savedState);
                state.unlocked?.forEach(id => {
                    const achievement = this.achievements.find(a => a.id === id);
                    if (achievement) {
                        achievement.unlocked = true;
                    }
                });
            }
        } catch (e) {
            console.warn('Could not load achievements:', e);
        }
    },

    /**
     * Save achievements to localStorage
     */
    saveState() {
        try {
            const unlocked = this.achievements
                .filter(a => a.unlocked)
                .map(a => a.id);
            localStorage.setItem(this.storageKey, JSON.stringify({ unlocked }));
        } catch (e) {
            console.warn('Could not save achievements:', e);
        }
    },

    /**
     * Set up Intersection Observers for sections
     */
    setupSectionObservers() {
        const sections = document.querySelectorAll('section[id]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                    const sectionId = entry.target.id;
                    this.onSectionVisit(sectionId);
                }
            });
        }, {
            threshold: 0.3
        });

        sections.forEach(section => observer.observe(section));
    },

    /**
     * Handle section visit
     * @param {string} sectionId - The section ID
     */
    onSectionVisit(sectionId) {
        // Track visited sections
        this.sectionsVisited.add(sectionId);

        // Section-specific achievements
        switch (sectionId) {
            case 'nexus':
                this.unlock('nexus-visitor');
                break;
            case 'contact':
                this.unlock('connector');
                break;
        }

        // Check for explorer achievement (all sections visited)
        const allSections = ['hero', 'nexus', 'vault', 'prologue', 'about', 'contact'];
        const allVisited = allSections.every(s => this.sectionsVisited.has(s));
        if (allVisited) {
            this.unlock('explorer');
        }
    },

    /**
     * Unlock an achievement
     * @param {string} id - Achievement ID
     */
    unlock(id) {
        const achievement = this.achievements.find(a => a.id === id);
        if (!achievement || achievement.unlocked) return;

        achievement.unlocked = true;
        this.saveState();
        this.updateVaultDisplay();
        this.showToast(achievement);

        console.log(`🏆 Achievement unlocked: ${achievement.title}`);
    },

    /**
     * Show achievement toast notification
     * @param {Object} achievement - Achievement data
     */
    showToast(achievement) {
        // Add to queue
        this.toastQueue.push(achievement);

        // Process queue if not already showing
        if (!this.isShowingToast) {
            this.processToastQueue();
        }
    },

    /**
     * Process the toast queue
     */
    processToastQueue() {
        if (this.toastQueue.length === 0) {
            this.isShowingToast = false;
            return;
        }

        this.isShowingToast = true;
        const achievement = this.toastQueue.shift();

        const container = document.querySelector('.achievement-container');
        if (!container) return;

        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML = `
            <div class="achievement-toast__icon">${achievement.icon}</div>
            <div class="achievement-toast__content">
                <div class="achievement-toast__title">Achievement Unlocked!</div>
                <div class="achievement-toast__text">${achievement.title}</div>
            </div>
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Animate out after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
                this.processToastQueue();
            }, 300);
        }, 3000);
    },

    /**
     * Update the vault section display
     */
    updateVaultDisplay() {
        const unlockedCount = this.achievements.filter(a => a.unlocked).length;
        const totalCount = this.achievements.length;

        // Update progress bar
        const progressFill = document.querySelector('.vault__progress-fill');
        if (progressFill) {
            progressFill.style.setProperty('--progress', `${(unlockedCount / totalCount) * 100}%`);
        }

        // Update progress text
        const progressText = document.querySelector('.vault__progress-text');
        if (progressText) {
            progressText.textContent = `${unlockedCount} / ${totalCount} Achievements Unlocked`;
        }

        // Update individual achievement cards
        this.achievements.forEach(achievement => {
            const card = document.querySelector(`[data-achievement="${achievement.id}"]`);
            if (card) {
                if (achievement.unlocked) {
                    card.classList.add('unlocked');
                    const status = card.querySelector('.achievement-card__status');
                    if (status) {
                        status.innerHTML = '<span>✓</span>';
                    }
                }
            }
        });
    },

    /**
     * Get achievement progress
     * @returns {Object} Progress data
     */
    getProgress() {
        const unlocked = this.achievements.filter(a => a.unlocked).length;
        return {
            unlocked,
            total: this.achievements.length,
            percentage: Math.round((unlocked / this.achievements.length) * 100)
        };
    },

    /**
     * Reset all achievements (for testing)
     */
    reset() {
        this.achievements.forEach(a => a.unlocked = false);
        this.sectionsVisited.clear();
        localStorage.removeItem(this.storageKey);
        this.updateVaultDisplay();
        console.log('🔄 Achievements reset');
    }
};

// Export for use in other modules
window.AchievementManager = AchievementManager;
