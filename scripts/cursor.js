/**
 * cursor.js - Magnetic Cursor System
 * Custom cursor with smooth following and magnetic hover effects
 */

const CursorManager = {
    cursor: null,
    dot: null,
    ring: null,

    // Position tracking
    mouseX: 0,
    mouseY: 0,
    dotX: 0,
    dotY: 0,
    ringX: 0,
    ringY: 0,

    // GSAP quickTo functions for smooth animation
    dotXTo: null,
    dotYTo: null,
    ringXTo: null,
    ringYTo: null,

    // Magnetic elements
    magneticElements: [],
    isHovering: false,

    /**
     * Initialize the cursor system
     */
    init() {
        // Check if device supports hover (not touch)
        if (!this.supportsHover()) {
            console.log('🖱️ Custom cursor disabled on touch device');
            return;
        }

        this.cursor = document.querySelector('.cursor');
        this.dot = document.querySelector('.cursor__dot');
        this.ring = document.querySelector('.cursor__ring');

        if (!this.cursor || !this.dot || !this.ring) {
            console.warn('Cursor elements not found');
            return;
        }

        // Initialize GSAP quickTo for smooth animations
        if (typeof gsap !== 'undefined') {
            this.dotXTo = gsap.quickTo(this.dot, 'x', { duration: 0.1, ease: 'power2.out' });
            this.dotYTo = gsap.quickTo(this.dot, 'y', { duration: 0.1, ease: 'power2.out' });
            this.ringXTo = gsap.quickTo(this.ring, 'x', { duration: 0.3, ease: 'power2.out' });
            this.ringYTo = gsap.quickTo(this.ring, 'y', { duration: 0.3, ease: 'power2.out' });
        }

        // Set up event listeners
        this.setupEventListeners();

        // Find magnetic elements
        this.findMagneticElements();

        console.log('🖱️ Custom cursor initialized');
    },

    /**
     * Check if device supports hover
     * @returns {boolean}
     */
    supportsHover() {
        return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    },

    /**
     * Set up mouse and element event listeners
     */
    setupEventListeners() {
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.updateCursor();
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            gsap.to(this.cursor, { opacity: 0, duration: 0.3 });
        });

        document.addEventListener('mouseenter', () => {
            gsap.to(this.cursor, { opacity: 1, duration: 0.3 });
        });

        // Click effect
        document.addEventListener('mousedown', () => {
            gsap.to(this.ring, { scale: 0.8, duration: 0.1 });
        });

        document.addEventListener('mouseup', () => {
            gsap.to(this.ring, { scale: 1, duration: 0.2 });
        });
    },

    /**
     * Find and attach magnetic behavior to elements
     */
    findMagneticElements() {
        const selectors = [
            '.btn--magnetic',
            '.card--3d',
            '.nav__link',
            '.social-link',
            '.theme-selector__toggle',
            '.audio-toggle'
        ];

        this.magneticElements = document.querySelectorAll(selectors.join(', '));

        this.magneticElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.onMagneticEnter(el));
            el.addEventListener('mouseleave', () => this.onMagneticLeave(el));
            el.addEventListener('mousemove', (e) => this.onMagneticMove(e, el));
        });
    },

    /**
     * Update cursor position
     */
    updateCursor() {
        if (this.dotXTo && this.dotYTo && this.ringXTo && this.ringYTo) {
            this.dotXTo(this.mouseX);
            this.dotYTo(this.mouseY);
            this.ringXTo(this.mouseX);
            this.ringYTo(this.mouseY);
        }
    },

    /**
     * Handle magnetic element hover enter
     * @param {HTMLElement} el - The element being hovered
     */
    onMagneticEnter(el) {
        this.isHovering = true;
        this.cursor.classList.add('hovering');

        // Scale up element slightly
        gsap.to(el, {
            scale: 1.03,
            duration: 0.3,
            ease: 'power2.out'
        });
    },

    /**
     * Handle magnetic element hover leave
     * @param {HTMLElement} el - The element being left
     */
    onMagneticLeave(el) {
        this.isHovering = false;
        this.cursor.classList.remove('hovering');

        // Reset element transform
        gsap.to(el, {
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    },

    /**
     * Handle magnetic movement - pull cursor towards element center
     * @param {MouseEvent} e - Mouse event
     * @param {HTMLElement} el - The magnetic element
     */
    onMagneticMove(e, el) {
        if (!this.isHovering) return;

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // Move element towards cursor (magnetic effect)
        const strength = 0.3;
        gsap.to(el, {
            x: deltaX * strength,
            y: deltaY * strength,
            duration: 0.3,
            ease: 'power2.out'
        });
    },

    /**
     * Refresh magnetic elements (call after DOM changes)
     */
    refresh() {
        this.findMagneticElements();
    }
};

// Export for use in other modules
window.CursorManager = CursorManager;
