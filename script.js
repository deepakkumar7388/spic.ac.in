// Mobile Menu Toggle
const navMenu = document.querySelector('.nav-menu');
const menuToggle = document.createElement('div');
menuToggle.classList.add('menu-toggle');
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
document.querySelector('.navbar .container').prepend(menuToggle);

// Backdrop for mobile menu
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

// Close menu when clicking a link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Image Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Auto advance slides every 5 seconds
if (slides.length > 0) {
    setInterval(nextSlide, 5000);
}

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Validation (for contact form)
function validateForm(formData) {
    const errors = [];

    if (!formData.name || formData.name.length < 2) {
        errors.push('Name must be at least 2 characters');
    }

    if (!formData.email || !formData.email.includes('@')) {
        errors.push('Valid email is required');
    }

    if (!formData.phone || formData.phone.length < 10) {
        errors.push('Valid phone number is required');
    }

    return errors;
}

// Scroll to top button
const scrollBtn = document.createElement('button');
scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollBtn.classList.add('scroll-top');
document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
    // Scroll To Top Button Logic
    if (window.pageYOffset > 300) {
        scrollBtn.style.display = 'flex';
    } else {
        scrollBtn.style.display = 'none';
    }

    // Shrinking Header Logic
    const siteHeader = document.getElementById('site-header');
    const titleObj = document.getElementById('school-title');
    const addressObj = document.getElementById('school-address');

    if (siteHeader && titleObj && addressObj) {
        if (window.scrollY > 50) {
            if (!siteHeader.classList.contains('scrolled')) {
                siteHeader.classList.add('scrolled');

                // Smooth transition: Fade out -> Change Text -> Fade In
                titleObj.style.opacity = '0';
                addressObj.style.opacity = '0';

                setTimeout(() => {
                    titleObj.textContent = 'SPIC';
                    addressObj.textContent = 'Prayagraj';

                    requestAnimationFrame(() => {
                        titleObj.style.opacity = '1';
                        addressObj.style.opacity = '1';
                    });
                }, 300); // Wait for CSS opacity transition to complete
            }
        } else {
            if (siteHeader.classList.contains('scrolled')) {
                siteHeader.classList.remove('scrolled');

                // Smooth transition: Fade out -> Revert Text -> Fade In
                titleObj.style.opacity = '0';
                addressObj.style.opacity = '0';

                setTimeout(() => {
                    titleObj.textContent = 'SARDAR PATEL INTER COLLEGE';
                    addressObj.textContent = 'Sikaron Koraon, Prayagraj 212306';

                    requestAnimationFrame(() => {
                        titleObj.style.opacity = '1';
                        addressObj.style.opacity = '1';
                    });
                }, 300);
            }
        }
    }
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// (Styles moved to style.css)

// Play Promo Video Logic
let videoPlayed = false;

function playPromoVideo() {
    if (videoPlayed) return;

    const overlay = document.getElementById('video-overlay');
    const video = document.getElementById('promo-video');
    if (overlay && video) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);

        // For local video element, use play() method
        video.play().catch(error => {
            console.error("Video play failed:", error);
        });
        videoPlayed = true;
    }
}

// Auto play video when it scrolls into view
const videoSection = document.querySelector('.video-showcase');
if (videoSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                playPromoVideo();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video section is visible
    });

    observer.observe(videoSection);
}