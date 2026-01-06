/**
 * main.js - Main Application Entry Point
 * Initializes all modules and handles global events
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Metagame Layer Portal initializing...');

    // Initialize modules in order
    initializeApp();
});

/**
 * Initialize all application modules
 */
function initializeApp() {
    // 1. Theme Manager (first, so colors are correct)
    if (window.ThemeManager) {
        window.ThemeManager.init();
    }

    // 2. Cursor Manager
    if (window.CursorManager) {
        window.CursorManager.init();
    }

    // 3. Scroll Manager (GSAP animations)
    if (window.ScrollManager) {
        window.ScrollManager.init();
    }

    // 4. Audio Manager
    if (window.AudioManager) {
        window.AudioManager.init();
    }

    // 5. Achievement Manager
    if (window.AchievementManager) {
        window.AchievementManager.init();
    }

    // Set up global event listeners
    setupGlobalEvents();

    // Set up smooth scroll for anchor links
    setupSmoothScroll();

    // Set up mobile menu
    setupMobileMenu();

    console.log('✅ Metagame Layer Portal ready!');
}

/**
 * Set up global event listeners
 */
function setupGlobalEvents() {
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Refresh ScrollTrigger on resize
            if (window.ScrollManager) {
                window.ScrollManager.refresh();
            }
            // Refresh cursor targets
            if (window.CursorManager) {
                window.CursorManager.refresh();
            }
        }, 250);
    });

    // Handle visibility change (pause audio when tab hidden)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && window.AudioManager?.isPlaying) {
            window.AudioManager.audio.volume = 0;
        } else if (!document.hidden && window.AudioManager?.isPlaying) {
            window.AudioManager.audio.volume = window.AudioManager.volume;
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Escape to close mobile menu
        if (e.key === 'Escape') {
            closeMobileMenu();
        }

        // M to toggle mute
        if (e.key === 'm' || e.key === 'M') {
            if (window.AudioManager) {
                window.AudioManager.toggle();
            }
        }

        // T to cycle themes
        if (e.key === 't' || e.key === 'T') {
            if (window.ThemeManager) {
                window.ThemeManager.nextTheme();
            }
        }
    });
}

/**
 * Set up smooth scrolling for anchor links
 */
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            // Close mobile menu if open
            closeMobileMenu();

            // Scroll to target
            const offsetTop = target.offsetTop;

            if (typeof gsap !== 'undefined') {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: offsetTop, autoKill: false },
                    ease: 'power3.inOut'
                });
            } else {
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Update active nav link
            updateActiveNavLink(href);
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Update active navigation link
 * @param {string} href - The href of the active link
 */
function updateActiveNavLink(href) {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === href) {
            link.classList.add('active');
        }
    });
}

/**
 * Set up mobile menu toggle
 */
function setupMobileMenu() {
    const burger = document.querySelector('.nav__burger');
    const mobileMenu = document.querySelector('.nav__mobile-menu');
    const mobileLinks = document.querySelectorAll('.nav__mobile-link');

    if (!burger || !mobileMenu) return;

    burger.addEventListener('click', () => {
        const isOpen = burger.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
}

/**
 * Open mobile menu
 */
function openMobileMenu() {
    const burger = document.querySelector('.nav__burger');
    const mobileMenu = document.querySelector('.nav__mobile-menu');

    if (!burger || !mobileMenu) return;

    burger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Animate links
    if (typeof gsap !== 'undefined') {
        gsap.from('.nav__mobile-link', {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.4,
            ease: 'power3.out'
        });
    }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    const burger = document.querySelector('.nav__burger');
    const mobileMenu = document.querySelector('.nav__mobile-menu');

    if (!burger || !mobileMenu) return;

    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

/**
 * Utility: Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
