/**
 * themes.js - Multi-Theme System with 10 Premium Palettes
 * Handles theme switching, persistence, and smooth transitions
 */

const ThemeManager = {
    themes: [
        { id: 'mocha-mousse', name: 'Mocha Mousse', primary: '#A47663', secondary: '#D4C4B5' },
        { id: 'velvet-dusk', name: 'Velvet Dusk', primary: '#8B5CF6', secondary: '#F472B6' },
        { id: 'bioluminescent', name: 'Bioluminescent', primary: '#00FFD1', secondary: '#00B4D8' },
        { id: 'rose-gold-noir', name: 'Rose Gold Noir', primary: '#B76E79', secondary: '#E8C4C4' },
        { id: 'aurora-borealis', name: 'Aurora Borealis', primary: '#A855F7', secondary: '#22D3EE' },
        { id: 'peach-fuzz', name: 'Peach Fuzz', primary: '#FFBE98', secondary: '#FED7AA' },
        { id: 'obsidian-flame', name: 'Obsidian Flame', primary: '#F97316', secondary: '#FBBF24' },
        { id: 'vintage-synthwave', name: 'Vintage Synthwave', primary: '#FF6B9D', secondary: '#00D4FF' },
        { id: 'sage-serenity', name: 'Sage Serenity', primary: '#84CC16', secondary: '#A3E635' },
        { id: 'chrome-mirage', name: 'Chrome Mirage', primary: '#A1A1AA', secondary: '#E4E4E7' }
    ],
    
    currentTheme: 'velvet-dusk',
    storageKey: 'metalayer-theme',
    
    /**
     * Initialize the theme system
     */
    init() {
        // Load saved theme or use default
        const savedTheme = localStorage.getItem(this.storageKey);
        if (savedTheme && this.themes.find(t => t.id === savedTheme)) {
            this.currentTheme = savedTheme;
        }
        
        // Apply the theme
        this.apply(this.currentTheme);
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('🎨 Theme Manager initialized with:', this.currentTheme);
    },
    
    /**
     * Apply a theme to the document
     * @param {string} themeId - The theme identifier
     */
    apply(themeId) {
        const theme = this.themes.find(t => t.id === themeId);
        if (!theme) return;
        
        // Update data attribute
        document.body.setAttribute('data-theme', themeId);
        this.currentTheme = themeId;
        
        // Save to localStorage
        localStorage.setItem(this.storageKey, themeId);
        
        // Update meta theme-color for mobile browsers
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme.primary);
        }
        
        // Dispatch custom event for other modules
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: themeId, data: theme } 
        }));
    },
    
    /**
     * Get the current theme data
     * @returns {Object} Current theme object
     */
    getCurrentTheme() {
        return this.themes.find(t => t.id === this.currentTheme);
    },
    
    /**
     * Cycle to the next theme
     */
    nextTheme() {
        const currentIndex = this.themes.findIndex(t => t.id === this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.apply(this.themes[nextIndex].id);
    },
    
    /**
     * Set up event listeners for theme controls
     */
    setupEventListeners() {
        // Theme selector toggle
        const toggle = document.querySelector('.theme-selector__toggle');
        const dropdown = document.querySelector('.theme-selector__dropdown');
        
        if (toggle && dropdown) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                toggle.setAttribute('aria-expanded', 'false');
            });
            
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        // Theme option buttons
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const themeId = option.getAttribute('data-theme');
                this.apply(themeId);
                
                // Close dropdown
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
                
                // Trigger theme change achievement
                if (window.AchievementManager) {
                    window.AchievementManager.unlock('designer');
                }
            });
        });
    }
};

// Export for use in other modules
window.ThemeManager = ThemeManager;
