/**
 * scroll.js - GSAP ScrollTrigger Animations
 * Section transitions, pinned panels, and scroll-driven effects
 */

const ScrollManager = {
    progressBar: null,
    prologuePanels: [],
    currentProloguePanel: 0,

    /**
     * Initialize scroll animations
     */
    init() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not loaded');
            return;
        }

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Get elements
        this.progressBar = document.querySelector('.progress-bar');

        // Initialize all scroll animations
        this.initProgressBar();
        this.initNavScroll();
        this.initHeroAnimations();
        this.initSectionAnimations();
        this.initProloguePinning();
        this.initCardParallax();

        console.log('📜 Scroll animations initialized');
    },

    /**
     * Progress bar that tracks scroll position
     */
    initProgressBar() {
        if (!this.progressBar) return;

        gsap.to(this.progressBar, {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });
    },

    /**
     * Navigation background on scroll
     */
    initNavScroll() {
        const nav = document.querySelector('.nav');
        if (!nav) return;

        ScrollTrigger.create({
            start: 'top -80',
            onUpdate: (self) => {
                if (self.direction === 1 && self.scroll() > 80) {
                    nav.classList.add('scrolled');
                } else if (self.scroll() < 80) {
                    nav.classList.remove('scrolled');
                }
            }
        });
    },

    /**
     * Hero section entrance animations
     */
    initHeroAnimations() {
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Animate elements on page load
        heroTl
            .from('.nav', {
                y: -100,
                opacity: 0,
                duration: 1
            })
            .from('.hero__subtitle', {
                y: 30,
                opacity: 0,
                duration: 0.8
            }, '-=0.5')
            .from('.hero__title-line', {
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2
            }, '-=0.5')
            .from('.hero__description', {
                y: 30,
                opacity: 0,
                duration: 0.8
            }, '-=0.4')
            .from('.hero__micro-copy', {
                y: 20,
                opacity: 0,
                duration: 0.6
            }, '-=0.3')
            .from('.hero__cta-group .btn', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15
            }, '-=0.4')
            .from('.hero__scroll-indicator', {
                y: 30,
                opacity: 0,
                duration: 0.6
            }, '-=0.2');

        // Parallax on hero background
        gsap.to('.hero__gradient', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    },

    /**
     * Section entrance animations
     */
    initSectionAnimations() {
        // Generic section animations for portfolio
        const sections = ['#projects', '#skills', '#journey', '#contact'];

        sections.forEach(sectionId => {
            const section = document.querySelector(sectionId);
            if (!section) return;

            // Section header animation
            const header = section.querySelector('.section__header');
            if (header) {
                gsap.from(header.children, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: header,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                });
            }
        });

        // Featured project animation
        const featuredProject = document.querySelector('.featured-project');
        if (featuredProject) {
            gsap.from(featuredProject, {
                y: 80,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: featuredProject,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        // Project cards animation
        const projectCards = document.querySelectorAll('.projects__grid .card');
        if (projectCards.length) {
            gsap.from(projectCards, {
                y: 60,
                opacity: 0,
                scale: 0.95,
                duration: 0.6,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.projects__grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        // Skills categories animation
        const skillCategories = document.querySelectorAll('.skill-category');
        if (skillCategories.length) {
            gsap.from(skillCategories, {
                y: 60,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.skills__grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        // Timeline items animation
        const timelineItems = document.querySelectorAll('.timeline-item');
        if (timelineItems.length) {
            gsap.from(timelineItems, {
                x: -50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.journey__timeline',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        // Contact section animation
        const contactContent = document.querySelector('.contact__content');
        if (contactContent) {
            gsap.from(contactContent.children, {
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: contactContent,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }
    },

    /**
     * Prologue section with pinned panels
     */
    initProloguePinning() {
        const prologue = document.querySelector('.section--prologue');
        if (!prologue) return;

        const wrapper = prologue.querySelector('.prologue__wrapper');
        const panels = prologue.querySelectorAll('.prologue__panel');
        const progressFill = prologue.querySelector('.prologue__progress-fill');
        const dots = prologue.querySelectorAll('.prologue__dot');

        if (!wrapper || panels.length === 0) return;

        this.prologuePanels = panels;

        // Activate first panel
        panels[0].classList.add('active');
        if (dots[0]) dots[0].classList.add('active');

        // Create scroll trigger for prologue
        ScrollTrigger.create({
            trigger: prologue,
            start: 'top top',
            end: 'bottom bottom',
            pin: wrapper,
            pinSpacing: false,
            onUpdate: (self) => {
                // Update progress bar
                if (progressFill) {
                    progressFill.style.width = `${self.progress * 100}%`;
                }

                // Calculate which panel should be active
                const panelIndex = Math.min(
                    Math.floor(self.progress * panels.length),
                    panels.length - 1
                );

                if (panelIndex !== this.currentProloguePanel) {
                    // Deactivate current panel
                    panels[this.currentProloguePanel].classList.remove('active');
                    if (dots[this.currentProloguePanel]) {
                        dots[this.currentProloguePanel].classList.remove('active');
                    }

                    // Activate new panel
                    panels[panelIndex].classList.add('active');
                    if (dots[panelIndex]) {
                        dots[panelIndex].classList.add('active');
                    }

                    this.currentProloguePanel = panelIndex;

                    // Trigger achievement if completed
                    if (panelIndex === panels.length - 1 && window.AchievementManager) {
                        window.AchievementManager.unlock('storyteller');
                    }
                }
            }
        });

        // Animate orbs
        panels.forEach((panel, index) => {
            const orb = panel.querySelector('.prologue__orb');
            if (orb) {
                gsap.to(orb, {
                    scale: 1.2,
                    rotate: 360,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: prologue,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1
                    }
                });
            }
        });
    },

    /**
     * 3D card parallax effect
     */
    initCardParallax() {
        const cards3D = document.querySelectorAll('.card--3d');

        cards3D.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });
    },

    /**
     * Refresh ScrollTrigger (call after DOM changes)
     */
    refresh() {
        ScrollTrigger.refresh();
    }
};

// Export for use in other modules
window.ScrollManager = ScrollManager;
