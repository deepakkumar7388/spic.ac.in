// Store pages object
window.Pages = window.Pages || {};

document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    
    // Save initial home content
    if (appContent && !window.Pages['index']) {
        window.Pages['index'] = appContent.innerHTML;
    }

    initGlobalUI();
    initPageComponents();
    initRouter();
});

// Runs ONCE
function initGlobalUI() {
    // 1. Mobile Menu Toggle
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.createElement('div');
    menuToggle.classList.add('menu-toggle');
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.navbar .container').prepend(menuToggle);

    const backdrop = document.createElement('div');
    backdrop.classList.add('nav-backdrop');
    document.body.appendChild(backdrop);

    function toggleMenu() {
        navMenu.classList.toggle('active');
        backdrop.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', toggleMenu);

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) toggleMenu();
        });
    });

    // 2. Scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.classList.add('scroll-top');
    document.body.appendChild(scrollBtn);

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 3. Shrinking Header Logic
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }

        const siteHeader = document.getElementById('site-header');
        const titleObj = document.getElementById('school-title');
        const addressObj = document.getElementById('school-address');

        if (siteHeader && titleObj && addressObj) {
            if (window.scrollY > 50) {
                if (!siteHeader.classList.contains('scrolled')) {
                    siteHeader.classList.add('scrolled');
                    titleObj.style.opacity = '0';
                    addressObj.style.opacity = '0';
                    setTimeout(() => {
                        titleObj.textContent = 'SPIC';
                        addressObj.textContent = 'Prayagraj';
                        titleObj.style.opacity = '1';
                        addressObj.style.opacity = '1';
                    }, 300);
                }
            } else {
                if (siteHeader.classList.contains('scrolled')) {
                    siteHeader.classList.remove('scrolled');
                    titleObj.style.opacity = '0';
                    addressObj.style.opacity = '0';
                    setTimeout(() => {
                        titleObj.textContent = 'SARDAR PATEL INTER COLLEGE';
                        addressObj.textContent = 'Sikaron Koraon, Prayagraj 212306';
                        titleObj.style.opacity = '1';
                        addressObj.style.opacity = '1';
                    }, 300);
                }
            }
        }
    });
}

// Runs on EVERY page change
function initPageComponents() {
    // Update active nav link
    const currentPath = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const linkPath = link.getAttribute('href').replace('.html', '');
        if (linkPath === currentPath || (currentPath === 'index' && linkPath === '')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Image Slider
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
        }
        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        if (window.sliderInterval) clearInterval(window.sliderInterval);
        window.sliderInterval = setInterval(nextSlide, 5000);
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Video Observer
    const videoSection = document.querySelector('.video-showcase');
    if (videoSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const overlay = document.getElementById('video-overlay');
                    const video = document.getElementById('promo-video');
                    if (overlay && video) {
                        overlay.style.opacity = '0';
                        overlay.style.pointerEvents = 'none';
                        setTimeout(() => overlay.style.display = 'none', 500);
                        video.play().catch(e => console.log("Play failed"));
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(videoSection);
    }
}

// Global functions for inline HTML handlers
window.playPromoVideo = function() {
    const overlay = document.getElementById('video-overlay');
    const video = document.getElementById('promo-video');
    if (overlay && video) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        setTimeout(() => overlay.style.display = 'none', 500);
        video.play().catch(e => console.log(e));
    }
};

window.validateForm = function(formData) {
    const errors = [];
    if (!formData.name || formData.name.length < 2) errors.push('Name must be at least 2 characters');
    if (!formData.email || !formData.email.includes('@')) errors.push('Valid email is required');
    if (!formData.phone || formData.phone.length < 10) errors.push('Valid phone number is required');
    return errors;
};

// SPA Router Engine
function initRouter() {
    const appContent = document.getElementById('app-content');
    appContent.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';

    function navigateTo(pageName) {
        if (!window.Pages[pageName]) {
            pageName = 'index';
        }

        // Fade Out
        appContent.style.opacity = '0';
        appContent.style.transform = 'translateY(10px)';

        setTimeout(() => {
            // Swap Content
            appContent.innerHTML = window.Pages[pageName];
            
            // Re-initialize page specific JS
            initPageComponents();
            
            // Scroll to top instantly
            window.scrollTo({ top: 0, behavior: 'instant' });
            
            // Fade In
            requestAnimationFrame(() => {
                appContent.style.opacity = '1';
                appContent.style.transform = 'translateY(0)';
            });
        }, 200);
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.hostname === window.location.hostname && !link.hash && !link.getAttribute('target')) {
            const href = link.getAttribute('href');
            if (href.endsWith('.html') || href === '/') {
                e.preventDefault();
                
                let pageName = href.split('/').pop().replace('.html', '');
                if (!pageName || pageName === '') pageName = 'index';

                const newUrl = pageName === 'index' ? window.location.pathname : '?p=' + pageName;
                history.pushState({ page: pageName }, '', newUrl);
                navigateTo(pageName);
            }
        }
    });

    window.addEventListener('popstate', (e) => {
        const urlParams = new URLSearchParams(window.location.search);
        let pageName = urlParams.get('p') || 'index';
        navigateTo(pageName);
    });

    // Handle Initial Load based on Query Param
    const urlParams = new URLSearchParams(window.location.search);
    let initialPage = urlParams.get('p');
    if (initialPage && window.Pages[initialPage]) {
        appContent.innerHTML = window.Pages[initialPage];
        initPageComponents();
    }
}