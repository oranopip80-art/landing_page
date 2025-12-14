// ============================================
// DOWNLOAD & NOTIFICATION FUNCTIONS
// ============================================

/**
 * Download App Function
 * Downloads the APK file when button is clicked
 */
function downloadApp(event) {
    event.preventDefault();
    event.stopPropagation();

    // Show downloading notification
    showNotification('success', 'جاري التحميل...', 'سيبدأ تحميل التطبيق الآن');

    // Create a temporary download link
    // Replace 'penthu-app.apk' with your actual APK file path
    const link = document.createElement('a');
    link.href = 'assets/penthu-app.apk'; // Update this path to your APK file
    link.download = 'Penthu.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message after a short delay
    setTimeout(() => {
        showNotification('success', 'تم بدء التحميل! 🎉', 'يتم الآن تحميل تطبيق Penthu');
    }, 500);
}

/**
 * Show Not Available Banner
 * Shows a notification when App Store or Play Store is clicked
 */
function showNotAvailable(event, storeName) {
    event.preventDefault();
    event.stopPropagation();

    showNotification(
        'info',
        `${storeName} - قريباً! 🚀`,
        `التطبيق غير متوفر على ${storeName} حالياً. يمكنك التحميل المباشر للـ APK.`
    );
}

/**
 * Show Notification Banner
 * @param {string} type - Type of notification (success, warning, info, error)
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {number} duration - Duration in milliseconds (default 4000)
 */
function showNotification(type = 'info', title = '', message = '', duration = 4000) {
    const banner = document.getElementById('notification-banner');
    if (!banner) return;

    // Remove existing classes
    banner.className = 'notification-banner';

    // Add type class
    banner.classList.add(type);

    // Set icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '✅';
            break;
        case 'warning':
            icon = '⚠️';
            break;
        case 'info':
            icon = 'ℹ️';
            break;
        case 'error':
            icon = '❌';
            break;
        default:
            icon = '📱';
    }

    // Set content
    banner.innerHTML = `
        <button class="close-btn" onclick="hideNotification()">×</button>
        <h3>${icon} ${title}</h3>
        <p>${message}</p>
    `;

    // Show banner
    setTimeout(() => {
        banner.classList.add('show');
    }, 100);

    // Auto hide after duration
    setTimeout(() => {
        hideNotification();
    }, duration);
}

/**
 * Hide Notification Banner
 */
function hideNotification() {
    const banner = document.getElementById('notification-banner');
    if (banner) {
        banner.classList.remove('show');
    }
}

// ============================================
// PROFESSIONAL ANIMATION SYSTEM - PENTHU
// Enhanced with Page Transitions
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // 1. PAGE ENTER/EXIT TRANSITIONS
    // ============================================
    const setupPageTransitions = () => {
        // Remove page-exit class on load
        document.body.classList.remove('page-exit');

        // Add exit animation on external links
        document.querySelectorAll('a:not([href^="#"])').forEach(link => {
            link.addEventListener('click', function (e) {
                // Only for same-domain links
                if (this.hostname === window.location.hostname && !this.hasAttribute('target')) {
                    const href = this.href;
                    e.preventDefault();

                    document.body.classList.add('page-exit');

                    setTimeout(() => {
                        window.location.href = href;
                    }, 400);
                }
            });
        });
    };

    // ============================================
    // 2. SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    const setupSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    // Add active class to clicked link
                    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
                    if (this.parentElement?.classList.contains('nav') || this.classList.contains('nav')) {
                        this.classList.add('active');
                    }

                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    // Smooth scroll
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Highlight target section briefly
                    target.style.transition = 'background-color 0.3s ease';
                    const originalBg = target.style.backgroundColor;
                    target.style.backgroundColor = 'rgba(0, 150, 136, 0.03)';

                    setTimeout(() => {
                        target.style.backgroundColor = originalBg;
                    }, 1000);
                }
            });
        });
    };

    // ============================================
    // 3. STAGGERED SCROLL ANIMATIONS - FASTER
    // ============================================
    const setupScrollAnimations = () => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -80px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add visible class with faster delay
                    const delay = parseInt(entry.target.dataset.delay || 0);

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);

                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animated elements with faster stagger
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach((el, index) => {
            // Faster staggered delay (50ms instead of 100ms)
            el.dataset.delay = index * 50;
            observer.observe(el);
        });
    };

    // ============================================
    // 4. FEATURE CARDS HOVER ENHANCEMENT
    // ============================================
    const enhanceFeatureCards = () => {
        const cards = document.querySelectorAll('.feature-card');

        cards.forEach(card => {
            // Ensure card has proper z-index
            card.style.position = 'relative';
            card.style.zIndex = '1';

            card.addEventListener('mouseenter', function () {
                // Increase z-index on hover without affecting others
                this.style.zIndex = '10';
            });

            card.addEventListener('mouseleave', function () {
                // Reset z-index
                this.style.zIndex = '1';
            });
        });
    };

    // ============================================
    // 5. BUTTON RIPPLE EFFECT
    // ============================================
    const addRippleEffect = () => {
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(button => {
            button.addEventListener('click', function (e) {
                // Remove old ripples
                const oldRipple = this.querySelector('.ripple');
                if (oldRipple) oldRipple.remove();

                // Create ripple
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');

                // Position ripple
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                this.appendChild(ripple);

                // Remove ripple after animation
                setTimeout(() => ripple.remove(), 600);
            });
        });
    };

    // ============================================
    // 6. PARALLAX EFFECT (Optimized)
    // ============================================
    const setupParallax = () => {
        let ticking = false;
        let scrollPos = 0;

        function updateParallax() {
            const hero = document.querySelector('.hero');
            if (hero && scrollPos < window.innerHeight) {
                // Move background elements only (no layout shift)
                const offset = scrollPos * 0.3;
                hero.style.setProperty('--parallax-offset', `${offset}px`);
            }
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            scrollPos = window.pageYOffset;

            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    };

    // ============================================
    // 7. PHONE MOCKUP 3D TILT EFFECT
    // ============================================
    const setup3DTilt = () => {
        const phones = document.querySelectorAll('.phone-mockup, .screenshot-card');

        phones.forEach(phone => {
            phone.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Calculate rotation (subtle)
                const rotateX = (y - centerY) / 30;
                const rotateY = (centerX - x) / 30;

                // Apply 3D transform
                this.style.transform =
                    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });

            phone.addEventListener('mouseleave', function () {
                this.style.transform =
                    'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    };

    // ============================================
    // 8. LOGO ANIMATION ON SCROLL
    // ============================================
    const animateLogo = () => {
        const logo = document.querySelector('.logo');
        if (!logo) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down - shrink logo slightly
                logo.style.transform = 'scale(0.9)';
            } else {
                // Scrolling up - normal size
                logo.style.transform = 'scale(1)';
            }

            lastScroll = currentScroll;
        }, { passive: true });
    };

    // ============================================
    // 9. PROGRESSIVE IMAGE LOADING
    // ============================================
    const setupLazyLoading = () => {
        const images = document.querySelectorAll('img[loading="lazy"]');

        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports lazy loading
            images.forEach(img => {
                img.addEventListener('load', function () {
                    this.classList.add('loaded');
                });
            });
        } else {
            // Fallback for browsers that don't support lazy loading
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    };

    // ============================================
    // 10. HEADER SCROLL BEHAVIOR
    // ============================================
    const animateHeader = () => {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScroll = 0;
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Clear previous timeout
            clearTimeout(scrollTimeout);

            // Add shadow when scrolled
            if (currentScroll > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header based on scroll direction
            scrollTimeout = setTimeout(() => {
                if (currentScroll > lastScroll && currentScroll > 100) {
                    // Scrolling down - hide header
                    header.classList.add('header-hidden');
                    header.classList.remove('header-visible');
                } else {
                    // Scrolling up - show header
                    header.classList.remove('header-hidden');
                    header.classList.add('header-visible');
                }

                lastScroll = currentScroll;
            }, 100);
        }, { passive: true });
    };

    // ============================================
    // 11. PERFORMANCE MONITORING
    // ============================================
    const optimizePerformance = () => {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.body.classList.add('reduce-animations');
        }

        // Disable animations if battery is low
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2) {
                    document.body.classList.add('reduce-animations');
                }
            });
        }
    };

    // ============================================
    // 12. INITIALIZE ALL ANIMATIONS
    // ============================================
    const init = () => {
        setupPageTransitions();
        setupSmoothScroll();
        setupScrollAnimations();
        enhanceFeatureCards();
        addRippleEffect();
        setupParallax();
        setup3DTilt();
        animateLogo();
        setupLazyLoading();
        animateHeader();
        optimizePerformance();

        // Mark page as loaded
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    };

    // Start initialization
    init();

    // Reinitialize on page show (for back/forward navigation)
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.body.classList.remove('page-exit');
            init();
        }
    });
});

// ============================================
// DYNAMIC CSS INJECTION
// ============================================
const injectDynamicStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        /* Ripple Effect */
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
            z-index: 100;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(3);
                opacity: 0;
            }
        }
        
        /* Header enhancement */
        .header.scrolled {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* Logo transition */
        .logo {
            transition: transform 0.3s ease;
        }
        
        /* Image loading state */
        img {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        img.loaded,
        img[src] {
            opacity: 1;
        }
        
        /* Reduce animations class */
        .reduce-animations *,
        .reduce-animations *::before,
        .reduce-animations *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
        }
        
        /* Page loaded state */
        body.loaded .hero-content,
        body.loaded .hero-image {
            animation-delay: 0s;
        }
        
        /* Ensure no layout shift from animations */
        .feature-card,
        .screenshot-card,
        .phone-mockup {
            contain: layout style;
        }
        
        /* Smooth transform transitions */
        .feature-card,
        .screenshot-card,
        .phone-mockup,
        .btn {
            backface-visibility: hidden;
            perspective: 1000px;
        }
    `;
    document.head.appendChild(style);
};

// Inject styles when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectDynamicStyles);
} else {
    injectDynamicStyles();
}
