// Function to initialize page-specific functionality
function initPage() {
    // Mobile Menu Toggle
    const existingMenuToggle = document.querySelector('.menu-toggle');
    if (!existingMenuToggle) {
        const navMenu = document.querySelector('.nav-menu');
        const menuToggle = document.createElement('div');
        menuToggle.classList.add('menu-toggle');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        const navbarContainer = document.querySelector('.navbar .container');
        if (navbarContainer) {
            navbarContainer.prepend(menuToggle);
        }

        // Backdrop for mobile menu
        let backdrop = document.querySelector('.nav-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.classList.add('nav-backdrop');
            document.body.appendChild(backdrop);
        }

        function toggleMenu() {
            navMenu.classList.toggle('active');
            backdrop.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        }

        menuToggle.onclick = toggleMenu;
        backdrop.onclick = toggleMenu;

        navMenu.querySelectorAll('a').forEach(link => {
            link.onclick = () => {
                if (navMenu.classList.contains('active')) {
                    toggleMenu();
                }
            };
        });
    }

    // Image Slider
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        clearInterval(window.sliderInterval);
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
        }
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        window.sliderInterval = setInterval(nextSlide, 5000);
    }

    // Smooth Scroll for local anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.onclick = function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };
    });

    // Scroll to top button
    let scrollBtn = document.querySelector('.scroll-top');
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.classList.add('scroll-top');
        document.body.appendChild(scrollBtn);
    }
    
    scrollBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Re-setup Video Logic
    const videoSection = document.querySelector('.video-showcase');
    const video = document.getElementById('promo-video');
    const overlay = document.getElementById('video-overlay');

    if (videoSection && video && overlay) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !window.videoPlayed) {
                    playPromoVideo();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(videoSection);
    }

    // Update active nav link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === currentPath) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });
}

// Global functions for page-specific features (Academics/Gallery)
function showTab(tabName) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
    const buttons = document.getElementsByClassName('tab-btn');
    for (let i = 0; i < buttons.length; i++) buttons[i].classList.remove('active');
    const target = document.getElementById(tabName);
    if (target) target.classList.add('active');
    if (event && event.target) event.target.classList.add('active');
}

function filterGallery(category) {
    const items = document.getElementsByClassName('gallery-item');
    const buttons = document.getElementsByClassName('filter-btn');
    for (let i = 0; i < buttons.length; i++) buttons[i].classList.remove('active');
    if (event && event.target) event.target.classList.add('active');
    for (let i = 0; i < items.length; i++) {
        items[i].style.display = (category === 'all' || items[i].getAttribute('data-category') === category) ? 'block' : 'none';
    }
}

function openLightbox(imgSrc, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    if (lightbox && lightboxImg && lightboxCaption) {
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('active');
}

// Global Form Handlers
function submitForm(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !phone || !message) {
        alert('Please fill in all required fields');
        return false;
    }
    alert('Thank you for contacting us! We will get back to you soon.');
    if (event.target) event.target.reset();
    return false;
}

function submitEnquiry(event) {
    event.preventDefault();
    alert('Thank you for your enquiry! Our admission team will contact you soon.');
    if (event.target) event.target.reset();
    return false;
}

// Global Video Play Function
function playPromoVideo() {
    const overlay = document.getElementById('video-overlay');
    const video = document.getElementById('promo-video');
    if (overlay && video) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        setTimeout(() => { overlay.style.display = 'none'; }, 500);
        video.play().catch(console.error);
        window.videoPlayed = true;
    }
}

// Global Throttled Scroll
let isScrolling = false;
window.onscroll = () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            const scrollBtn = document.querySelector('.scroll-top');
            if (scrollBtn) scrollBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
            
            const siteHeader = document.getElementById('site-header');
            const titleObj = document.getElementById('school-title');
            const addressObj = document.getElementById('school-address');

            if (siteHeader && titleObj && addressObj) {
                if (window.scrollY > 50) {
                    if (!siteHeader.classList.contains('scrolled')) {
                        siteHeader.classList.add('scrolled');
                        titleObj.style.opacity = '0'; addressObj.style.opacity = '0';
                        setTimeout(() => {
                            titleObj.textContent = 'SPIC'; addressObj.textContent = 'Prayagraj';
                            requestAnimationFrame(() => { titleObj.style.opacity = '1'; addressObj.style.opacity = '1'; });
                        }, 300);
                    }
                } else if (siteHeader.classList.contains('scrolled')) {
                    siteHeader.classList.remove('scrolled');
                    titleObj.style.opacity = '0'; addressObj.style.opacity = '0';
                    setTimeout(() => {
                        titleObj.textContent = 'SARDAR PATEL INTER COLLEGE';
                        addressObj.textContent = 'Sikaron Koraon, Prayagraj 212306';
                        requestAnimationFrame(() => { titleObj.style.opacity = '1'; addressObj.style.opacity = '1'; });
                    }, 300);
                }
            }
            isScrolling = false;
        });
        isScrolling = true;
    }
};

// --- SPA Navigation Logic ---
async function loadPage(url, push = true) {
    const mainContent = document.getElementById('main-content') || document.body;
    
    // Smooth transition: Fade Out
    mainContent.style.transition = 'opacity 0.3s ease';
    mainContent.style.opacity = '0';
    
    try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract new main content (use #main-content if exists, else everything under body excluding header/footer)
        let newContent = doc.getElementById('main-content');
        if (!newContent) {
            // Fallback for pages not yet wrapped
            const clone = doc.body.cloneNode(true);
            const header = clone.querySelector('header');
            const footer = clone.querySelector('footer');
            const script = clone.querySelector('script');
            if (header) header.remove();
            if (footer) footer.remove();
            if (script) script.remove();
            newContent = clone;
        }

        // Update Title
        document.title = doc.title;
        
        setTimeout(() => {
            mainContent.innerHTML = newContent.innerHTML;
            window.scrollTo(0, 0);
            
            // Re-initialize
            window.videoPlayed = false;
            initPage();
            
            // Fade In
            mainContent.style.opacity = '1';
            
            if (push) {
                history.pushState({ url }, doc.title, url);
            }
        }, 300);

    } catch (error) {
        console.error('Navigation failed:', error);
        window.location.href = url; // Fallback to normal load
    }
}

// Intercept clicks
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.href.startsWith(window.location.origin)) {
        const url = link.getAttribute('href');
        // Ignore anchors, external links, and same-page links
        if (url.startsWith('#') || url.includes(':') || link.target === '_blank') return;
        
        e.preventDefault();
        loadPage(link.href);
    }
});

// Handle back/forward
window.onpopstate = (e) => {
    if (e.state && e.state.url) {
        loadPage(e.state.url, false);
    }
};

// Initial Load
document.addEventListener('DOMContentLoaded', initPage);