/**
 * scroll.js - Premium GSAP ScrollTrigger Animations
 * Buttery smooth, progressive, modern scroll-driven effects
 */

const ScrollManager = {
    progressBar: null,
    lenis: null, // Smooth scroll instance placeholder

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

        // Set default GSAP settings for buttery animations
        gsap.defaults({
            ease: 'power3.out',
            duration: 1
        });

        // Get elements
        this.progressBar = document.querySelector('.progress-bar');

        // Initialize all scroll animations
        this.initProgressBar();
        this.initNavScroll();
        this.initHeroAnimations();
        this.initParallaxBackgrounds();
        this.initSectionAnimations();
        this.initFeaturedProjectAnimations();
        this.initCardAnimations();
        this.initSkillsAnimations();
        this.initTimelineAnimations();
        this.initContactAnimations();
        this.initFloatingElements();
        this.initTextRevealEffects();
        this.initMagneticHoverEffects();

        console.log('📜 Premium scroll animations initialized');
    },

    /**
     * Progress bar that tracks scroll position with smooth gradient
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
                scrub: 0.5
            }
        });
    },

    /**
     * Navigation with smooth blur and backdrop transitions
     */
    initNavScroll() {
        const nav = document.querySelector('.nav');
        if (!nav) return;

        ScrollTrigger.create({
            start: 'top -50',
            onUpdate: (self) => {
                if (self.scroll() > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }
        });

        // Subtle nav hide on scroll down, show on scroll up
        let lastScroll = 0;
        ScrollTrigger.create({
            onUpdate: (self) => {
                const currentScroll = self.scroll();
                if (currentScroll > lastScroll && currentScroll > 400) {
                    gsap.to(nav, { y: -100, duration: 0.4, ease: 'power2.inOut' });
                } else {
                    gsap.to(nav, { y: 0, duration: 0.4, ease: 'power2.out' });
                }
                lastScroll = currentScroll;
            }
        });
    },

    /**
     * Cinematic hero entrance with staggered reveals
     */
    initHeroAnimations() {
        const heroTl = gsap.timeline({
            defaults: { ease: 'power4.out' }
        });

        // Initial state - hide everything
        gsap.set(['.hero__subtitle', '.hero__title-line', '.hero__description', '.hero__micro-copy', '.hero__cta-group .btn', '.hero__scroll-indicator'], {
            opacity: 0,
            y: 60
        });

        gsap.set('.nav', { opacity: 0, y: -50 });

        // Cinematic entrance sequence
        heroTl
            // Nav slides down with fade
            .to('.nav', {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out'
            })
            // Subtitle fades up with slight delay
            .to('.hero__subtitle', {
                y: 0,
                opacity: 1,
                duration: 0.8
            }, '-=0.6')
            // Title lines stagger in dramatically
            .to('.hero__title-line', {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: {
                    each: 0.15,
                    ease: 'power2.out'
                }
            }, '-=0.5')
            // Description with smooth reveal
            .to('.hero__description', {
                y: 0,
                opacity: 1,
                duration: 0.9
            }, '-=0.6')
            // Micro-copy
            .to('.hero__micro-copy', {
                y: 0,
                opacity: 1,
                duration: 0.7
            }, '-=0.5')
            // Buttons bounce in
            .to('.hero__cta-group .btn', {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.12,
                ease: 'back.out(1.5)'
            }, '-=0.4')
            // Scroll indicator with bounce
            .to('.hero__scroll-indicator', {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)'
            }, '-=0.3');

        // Continuous floating animation for scroll indicator
        gsap.to('.hero__scroll-arrow', {
            y: 10,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    },

    /**
     * Parallax backgrounds with depth
     */
    initParallaxBackgrounds() {
        // Hero gradient parallax
        gsap.to('.hero__gradient', {
            yPercent: 50,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            }
        });

        // Create floating orbs in hero
        const heroContent = document.querySelector('.hero__content');
        if (heroContent) {
            // Add floating orbs dynamically
            for (let i = 0; i < 3; i++) {
                const orb = document.createElement('div');
                orb.className = 'floating-orb';
                orb.style.cssText = `
                    position: absolute;
                    width: ${100 + i * 80}px;
                    height: ${100 + i * 80}px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(var(--primary-rgb), 0.15), transparent 70%);
                    pointer-events: none;
                    z-index: -1;
                `;
                heroContent.appendChild(orb);

                // Animate each orb differently
                gsap.to(orb, {
                    x: () => Math.random() * 200 - 100,
                    y: () => Math.random() * 200 - 100,
                    scale: () => 0.8 + Math.random() * 0.4,
                    duration: 8 + i * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }
        }

        // Section backgrounds subtle parallax
        document.querySelectorAll('.section').forEach(section => {
            gsap.to(section, {
                backgroundPosition: '50% 100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2
                }
            });
        });
    },

    /**
     * Section headers with premium reveal
     */
    initSectionAnimations() {
        const sections = ['#projects', '#skills', '#journey', '#contact'];

        sections.forEach(sectionId => {
            const section = document.querySelector(sectionId);
            if (!section) return;

            const header = section.querySelector('.section__header');
            if (!header) return;

            const label = header.querySelector('.section__label');
            const title = header.querySelector('.section__title');
            const description = header.querySelector('.section__description');

            // Create staggered reveal timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });

            if (label) {
                gsap.set(label, { opacity: 0, x: -30 });
                tl.to(label, {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    ease: 'power3.out'
                });
            }

            if (title) {
                gsap.set(title, { opacity: 0, y: 40, clipPath: 'inset(100% 0% 0% 0%)' });
                tl.to(title, {
                    opacity: 1,
                    y: 0,
                    clipPath: 'inset(0% 0% 0% 0%)',
                    duration: 0.8,
                    ease: 'power3.out'
                }, '-=0.3');
            }

            if (description) {
                gsap.set(description, { opacity: 0, y: 20 });
                tl.to(description, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power2.out'
                }, '-=0.4');
            }
        });
    },

    /**
     * Featured project with dramatic reveal
     */
    initFeaturedProjectAnimations() {
        const featured = document.querySelector('.featured-project');
        if (!featured) return;

        // Initial state
        gsap.set(featured, {
            opacity: 0,
            y: 100,
            scale: 0.95
        });

        // Reveal timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: featured,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        tl.to(featured, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out'
        });

        // Stagger internal elements
        const badge = featured.querySelector('.card__badge');
        const title = featured.querySelector('.featured-project__title');
        const subtitle = featured.querySelector('.featured-project__subtitle');
        const description = featured.querySelector('.featured-project__description');
        const tags = featured.querySelectorAll('.tag');
        const bullets = featured.querySelectorAll('.featured-project__bullets li');
        const links = featured.querySelectorAll('.featured-project__links .btn');

        gsap.set([badge, title, subtitle, description], { opacity: 0, y: 30 });
        gsap.set(tags, { opacity: 0, scale: 0.8, y: 20 });
        gsap.set(bullets, { opacity: 0, x: -30 });
        gsap.set(links, { opacity: 0, y: 20, scale: 0.9 });

        tl.to(badge, { opacity: 1, y: 0, duration: 0.5 }, '-=0.6')
            .to(title, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
            .to(subtitle, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
            .to(description, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
            .to(tags, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.05,
                ease: 'back.out(1.5)'
            }, '-=0.3')
            .to(bullets, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out'
            }, '-=0.2')
            .to(links, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: 'back.out(1.3)'
            }, '-=0.2');

        // Parallel glow effect on scroll
        gsap.to('.featured-project__glow', {
            opacity: 0.5,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: {
                trigger: featured,
                start: 'top center',
                end: 'bottom center',
                scrub: 1
            }
        });
    },

    /**
     * Project cards with 3D hover and staggered reveal
     */
    initCardAnimations() {
        const cards = document.querySelectorAll('.projects__grid .card');
        if (!cards.length) return;

        // Initial state
        gsap.set(cards, {
            opacity: 0,
            y: 80,
            rotateX: -15,
            transformPerspective: 1000
        });

        // Staggered reveal
        gsap.to(cards, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            stagger: {
                each: 0.15,
                from: 'start'
            },
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.projects__grid',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // Enhanced 3D hover effect for each card
        cards.forEach(card => {
            const glow = card.querySelector('.card__glow');
            const content = card.querySelector('.card__content');
            const icon = card.querySelector('.card__icon');

            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.03,
                    boxShadow: '0 25px 50px -12px rgba(var(--primary-rgb), 0.25)',
                    duration: 0.4,
                    ease: 'power2.out'
                });
                if (glow) {
                    gsap.to(glow, { opacity: 1, duration: 0.4 });
                }
                if (icon) {
                    gsap.to(icon, { scale: 1.1, rotate: 5, duration: 0.4, ease: 'back.out(1.5)' });
                }
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    boxShadow: 'none',
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.4
                });
                if (glow) {
                    gsap.to(glow, { opacity: 0, duration: 0.4 });
                }
                if (icon) {
                    gsap.to(icon, { scale: 1, rotate: 0, duration: 0.4 });
                }
            });

            // 3D tilt effect on mousemove - subtle rotation only
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                // Reduced tilt intensity for smoother effect
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    duration: 0.5,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            });
        });
    },

    /**
     * Skills categories with wave reveal
     */
    initSkillsAnimations() {
        const categories = document.querySelectorAll('.skill-category');
        if (!categories.length) return;

        gsap.set(categories, {
            opacity: 0,
            y: 60,
            scale: 0.9
        });

        gsap.to(categories, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: {
                each: 0.1,
                from: 'start',
                ease: 'power2.out'
            },
            ease: 'back.out(1.2)',
            scrollTrigger: {
                trigger: '.skills__grid',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // Hover effects for skill categories
        categories.forEach(cat => {
            const icon = cat.querySelector('.skill-category__icon');
            const items = cat.querySelectorAll('.skill-category__list li');

            cat.addEventListener('mouseenter', () => {
                gsap.to(cat, {
                    y: -8,
                    boxShadow: '0 20px 40px -15px rgba(var(--primary-rgb), 0.2)',
                    borderColor: 'rgba(var(--primary-rgb), 0.5)',
                    duration: 0.4,
                    ease: 'power2.out'
                });
                if (icon) {
                    gsap.to(icon, { scale: 1.1, rotate: 10, duration: 0.4, ease: 'back.out(1.5)' });
                }
                gsap.to(items, {
                    x: 5,
                    duration: 0.3,
                    stagger: 0.03,
                    ease: 'power2.out'
                });
            });

            cat.addEventListener('mouseleave', () => {
                gsap.to(cat, {
                    y: 0,
                    boxShadow: 'none',
                    borderColor: 'rgba(var(--primary-rgb), 0.15)',
                    duration: 0.4
                });
                if (icon) {
                    gsap.to(icon, { scale: 1, rotate: 0, duration: 0.4 });
                }
                gsap.to(items, { x: 0, duration: 0.3 });
            });
        });
    },

    /**
     * Timeline with progressive reveal
     */
    initTimelineAnimations() {
        const items = document.querySelectorAll('.timeline-item');
        if (!items.length) return;

        items.forEach((item, index) => {
            const marker = item.querySelector('.timeline-item__marker');
            const content = item.querySelector('.timeline-item__content');

            gsap.set(marker, { scale: 0, opacity: 0 });
            gsap.set(content, { opacity: 0, x: -50 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });

            tl.to(marker, {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: 'back.out(2)'
            })
                .to(content, {
                    opacity: 1,
                    x: 0,
                    duration: 0.7,
                    ease: 'power3.out'
                }, '-=0.3');

            // Hover effect
            item.addEventListener('mouseenter', () => {
                gsap.to(content, {
                    x: 10,
                    boxShadow: '0 15px 35px -10px rgba(var(--primary-rgb), 0.15)',
                    borderColor: 'rgba(var(--primary-rgb), 0.4)',
                    duration: 0.4,
                    ease: 'power2.out'
                });
                gsap.to(marker, {
                    scale: 1.2,
                    duration: 0.3,
                    ease: 'back.out(1.5)'
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(content, {
                    x: 0,
                    boxShadow: 'none',
                    borderColor: 'rgba(var(--primary-rgb), 0.15)',
                    duration: 0.4
                });
                gsap.to(marker, { scale: 1, duration: 0.3 });
            });
        });

        // Animate the timeline line itself
        const timeline = document.querySelector('.journey__timeline');
        if (timeline) {
            gsap.fromTo(timeline,
                { '--line-height': '0%' },
                {
                    '--line-height': '100%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: timeline,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        scrub: 1
                    }
                }
            );
        }
    },

    /**
     * Contact section with magnetic CTA
     */
    initContactAnimations() {
        const contactContent = document.querySelector('.contact__content');
        if (!contactContent) return;

        const elements = contactContent.children;
        gsap.set(elements, { opacity: 0, y: 50 });

        gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: contactContent,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // Social links hover
        const socials = document.querySelectorAll('.social-link');
        socials.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    scale: 1.15,
                    rotate: 10,
                    duration: 0.3,
                    ease: 'back.out(1.5)'
                });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    scale: 1,
                    rotate: 0,
                    duration: 0.3
                });
            });
        });
    },

    /**
     * Continuous floating elements for ambient feel
     */
    initFloatingElements() {
        // Float animation for various decorative elements
        const floatElements = document.querySelectorAll('.card__glow, .featured-project__glow');

        floatElements.forEach((el, i) => {
            gsap.to(el, {
                y: -10 + Math.random() * 20,
                x: -10 + Math.random() * 20,
                duration: 3 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.2
            });
        });
    },

    /**
     * Text reveal effects with clip-path
     */
    initTextRevealEffects() {
        // Add reveal class to titles for CSS enhancement
        document.querySelectorAll('.section__title, .featured-project__title, .timeline-item__title').forEach(title => {
            title.classList.add('reveal-text');
        });
    },

    /**
     * Magnetic hover for buttons - DISABLED to prevent cursor conflicts
     * The cursor.js handles hover effects for interactive elements
     */
    initMagneticHoverEffects() {
        // Magnetic effects disabled - was causing cursor wobble
        // The cursor now handles all hover scaling effects
        // If you want to re-enable button magnetic pull,
        // uncomment the code below:

        /*
        const magneticItems = document.querySelectorAll('.btn--magnetic');

        magneticItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(item, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    x: 0,
                    y: 0,
                    duration: 0.4,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
        */
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
