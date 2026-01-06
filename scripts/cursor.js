/**
 * cursor.js - Simple & Stable Custom Cursor
 * Clean cursor that follows mouse exactly with smooth hover scaling
 */

const CursorManager = {
    dot: null,
    ring: null,
    mouseX: 0,
    mouseY: 0,
    isHovering: false,
    raf: null,

    /**
     * Initialize cursor
     */
    init() {
        // Skip on touch devices
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            console.log('🖱️ Custom cursor disabled on touch device');
            return;
        }

        this.dot = document.querySelector('.cursor__dot');
        this.ring = document.querySelector('.cursor__ring');

        if (!this.dot || !this.ring) {
            console.warn('Cursor elements not found');
            return;
        }

        // Hide default cursor
        document.body.style.cursor = 'none';

        // Set initial position off-screen
        this.dot.style.transform = 'translate(-100px, -100px)';
        this.ring.style.transform = 'translate(-100px, -100px)';

        this.bindEvents();
        this.startAnimation();

        console.log('🖱️ Simple cursor initialized');
    },

    /**
     * Bind mouse events
     */
    bindEvents() {
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Cursor visibility
        document.addEventListener('mouseleave', () => {
            this.dot.style.opacity = '0';
            this.ring.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.dot.style.opacity = '1';
            this.ring.style.opacity = '1';
        });

        // Click effect
        document.addEventListener('mousedown', () => {
            this.ring.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px) scale(0.8)`;
        });

        document.addEventListener('mouseup', () => {
            const scale = this.isHovering ? 1.5 : 1;
            this.ring.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px) scale(${scale})`;
        });

        // Hover detection for interactive elements
        this.setupHoverListeners();
    },

    /**
     * Setup hover listeners for all interactive elements
     */
    setupHoverListeners() {
        const interactiveElements = document.querySelectorAll(
            'a, button, .btn, .card, .nav__link, .social-link, ' +
            '.theme-selector__toggle, .audio-toggle, .tag, ' +
            '.skill-category, .timeline-item__content, .featured-project'
        );

        interactiveElements.forEach(el => {
            el.style.cursor = 'none';

            el.addEventListener('mouseenter', () => {
                this.isHovering = true;
                this.ring.classList.add('cursor--hovering');
                this.dot.classList.add('cursor--hovering');
            });

            el.addEventListener('mouseleave', () => {
                this.isHovering = false;
                this.ring.classList.remove('cursor--hovering');
                this.dot.classList.remove('cursor--hovering');
            });
        });
    },

    /**
     * Animation loop - updates cursor position every frame
     */
    startAnimation() {
        const animate = () => {
            // Center the dot (offset by half its size: 4px for 8px element)
            this.dot.style.transform = `translate(${this.mouseX - 4}px, ${this.mouseY - 4}px)`;

            // Center the ring (offset by half its size: 20px for 40px, 30px for 60px when hovering)
            const ringOffset = this.isHovering ? 30 : 20;
            this.ring.style.transform = `translate(${this.mouseX - ringOffset}px, ${this.mouseY - ringOffset}px)`;

            this.raf = requestAnimationFrame(animate);
        };

        animate();
    },

    /**
     * Refresh hover listeners (call after DOM changes)
     */
    refresh() {
        this.setupHoverListeners();
    },

    /**
     * Destroy cursor
     */
    destroy() {
        if (this.raf) {
            cancelAnimationFrame(this.raf);
        }
        document.body.style.cursor = '';
    }
};

// Export
window.CursorManager = CursorManager;
