/**
 * cursor.js - Premium Magnetic Cursor System
 * Buttery smooth cursor with advanced magnetic effects
 */

const CursorManager = {
    cursor: null,
    dot: null,
    ring: null,
    trail: [],

    // Position tracking
    mouseX: 0,
    mouseY: 0,

    // GSAP quickTo functions for buttery animation
    dotXTo: null,
    dotYTo: null,
    ringXTo: null,
    ringYTo: null,

    // State
    isHovering: false,
    isClicking: false,

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
            this.createCursor();
        }

        // Initialize GSAP quickTo for buttery smooth animations
        if (typeof gsap !== 'undefined') {
            // Dot follows mouse almost instantly
            this.dotXTo = gsap.quickTo(this.dot, 'x', {
                duration: 0.15,
                ease: 'power3.out'
            });
            this.dotYTo = gsap.quickTo(this.dot, 'y', {
                duration: 0.15,
                ease: 'power3.out'
            });

            // Ring has more lag for smooth trail effect
            this.ringXTo = gsap.quickTo(this.ring, 'x', {
                duration: 0.5,
                ease: 'power2.out'
            });
            this.ringYTo = gsap.quickTo(this.ring, 'y', {
                duration: 0.5,
                ease: 'power2.out'
            });
        }

        // Set up event listeners
        this.setupEventListeners();

        // Find magnetic elements
        this.setupMagneticElements();

        // Create cursor trail
        this.createCursorTrail();

        console.log('🖱️ Premium cursor initialized');
    },

    /**
     * Check if device supports hover
     */
    supportsHover() {
        return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    },

    /**
     * Create cursor elements if they don't exist
     */
    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor';

        this.dot = document.createElement('div');
        this.dot.className = 'cursor__dot';

        this.ring = document.createElement('div');
        this.ring.className = 'cursor__ring';

        this.cursor.appendChild(this.dot);
        this.cursor.appendChild(this.ring);
        document.body.appendChild(this.cursor);
    },

    /**
     * Create subtle cursor trail
     */
    createCursorTrail() {
        const trailCount = 5;

        for (let i = 0; i < trailCount; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor__trail';
            trail.style.cssText = `
                position: fixed;
                width: ${8 - i}px;
                height: ${8 - i}px;
                border-radius: 50%;
                background: rgba(var(--primary-rgb), ${0.3 - i * 0.05});
                pointer-events: none;
                z-index: 9998;
                transform: translate(-50%, -50%);
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(trail);
            this.trail.push({
                element: trail,
                x: 0,
                y: 0
            });
        }
    },

    /**
     * Set up mouse and element event listeners
     */
    setupEventListeners() {
        // Track mouse movement with requestAnimationFrame for smoothness
        let rafId;

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            // Cancel previous frame and schedule new one
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => this.updateCursor());
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            gsap.to([this.cursor, ...this.trail.map(t => t.element)], {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        document.addEventListener('mouseenter', () => {
            gsap.to(this.cursor, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        // Click effects
        document.addEventListener('mousedown', () => {
            this.isClicking = true;
            gsap.to(this.dot, {
                scale: 0.5,
                duration: 0.15,
                ease: 'power3.out'
            });
            gsap.to(this.ring, {
                scale: 0.8,
                duration: 0.2,
                ease: 'power2.out'
            });
        });

        document.addEventListener('mouseup', () => {
            this.isClicking = false;
            gsap.to(this.dot, {
                scale: 1,
                duration: 0.3,
                ease: 'elastic.out(1, 0.5)'
            });
            gsap.to(this.ring, {
                scale: 1,
                duration: 0.4,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    },

    /**
     * Set up magnetic behavior for interactive elements
     */
    setupMagneticElements() {
        const selectors = [
            '.btn--magnetic',
            '.card--3d',
            '.nav__link',
            '.social-link',
            '.theme-selector__toggle',
            '.audio-toggle',
            '.tag',
            '.skill-category',
            '.timeline-item'
        ];

        document.querySelectorAll(selectors.join(', ')).forEach(el => {
            el.addEventListener('mouseenter', () => this.onElementEnter(el));
            el.addEventListener('mouseleave', () => this.onElementLeave(el));
            el.addEventListener('mousemove', (e) => this.onElementMove(e, el));
        });

        // Text links get subtle effect
        document.querySelectorAll('a:not(.btn):not(.social-link):not(.nav__link)').forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(this.dot, { scale: 2, opacity: 0.5, duration: 0.3 });
                gsap.to(this.ring, { scale: 0.5, opacity: 0, duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(this.dot, { scale: 1, opacity: 1, duration: 0.3 });
                gsap.to(this.ring, { scale: 1, opacity: 1, duration: 0.3 });
            });
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

        // Update trail with delay
        this.trail.forEach((trail, i) => {
            gsap.to(trail.element, {
                x: this.mouseX,
                y: this.mouseY,
                opacity: this.isHovering ? 0 : 0.3 - i * 0.05,
                duration: 0.3 + i * 0.1,
                ease: 'power2.out',
                delay: i * 0.02
            });
        });
    },

    /**
     * Handle magnetic element hover enter
     */
    onElementEnter(el) {
        this.isHovering = true;
        this.cursor.classList.add('hovering');

        // Expand ring
        gsap.to(this.ring, {
            scale: 2,
            borderWidth: 1,
            opacity: 0.5,
            duration: 0.4,
            ease: 'power2.out'
        });

        // Hide dot
        gsap.to(this.dot, {
            scale: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    },

    /**
     * Handle magnetic element hover leave
     */
    onElementLeave(el) {
        this.isHovering = false;
        this.cursor.classList.remove('hovering');

        // Reset ring
        gsap.to(this.ring, {
            scale: 1,
            borderWidth: 2,
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
        });

        // Show dot
        gsap.to(this.dot, {
            scale: 1,
            duration: 0.4,
            ease: 'elastic.out(1, 0.5)'
        });

        // Reset element
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.3)'
        });
    },

    /**
     * Handle magnetic movement - pull element towards cursor
     */
    onElementMove(e, el) {
        if (!this.isHovering) return;

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // Calculate magnetic strength based on element size
        const strength = Math.min(rect.width, rect.height) > 100 ? 0.2 : 0.35;

        // Move element towards cursor (magnetic effect)
        gsap.to(el, {
            x: deltaX * strength,
            y: deltaY * strength,
            duration: 0.4,
            ease: 'power2.out'
        });

        // Move ring to element center
        gsap.to(this.ring, {
            x: centerX + deltaX * 0.2,
            y: centerY + deltaY * 0.2,
            duration: 0.4,
            ease: 'power2.out'
        });
    },

    /**
     * Refresh magnetic elements (call after DOM changes)
     */
    refresh() {
        this.setupMagneticElements();
    }
};

// Export for use in other modules
window.CursorManager = CursorManager;
