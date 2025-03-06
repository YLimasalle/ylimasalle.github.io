const parallaxBackground = document.querySelector('.parallax-background');
const slidesContainer = document.querySelector('.slides-container');
const slides = document.querySelectorAll('.slide');
const slideNumbers = document.querySelectorAll('.slide-number');
const totalSlides = slides.length;

const mobileArrow = document.getElementById('mobileArrow');
let currentSlideIndex = 0;

const parallaxRatio = 0.3;
const numberParallaxRatio = 0.15; // Different ratio for numbers

//for nav 
const navItems = document.querySelectorAll('.nav-item');
const progressIndicator = document.querySelector('.nav-progress');

function updateParallax() {
    const scrollPosition = slidesContainer.scrollTop;
    
    // Update main background
    const bgTranslation = -scrollPosition * parallaxRatio;
    parallaxBackground.style.transform = `translateY(${bgTranslation}px)`;
    
    // Update slide numbers
    slideNumbers.forEach(number => {
        const slideOffset = number.parentElement.offsetTop;
        const numberTranslation = (scrollPosition - slideOffset) * numberParallaxRatio;
        number.style.transform = `translate(-50%, calc(-50% + ${numberTranslation}px))`;
    });
}

function updateArrow() {
    const scrollTop = slidesContainer.scrollTop;
    currentSlideIndex = Math.round(scrollTop / window.innerHeight);
    
    // Rotate arrow on last slide
    if (currentSlideIndex === slides.length - 1) {
        mobileArrow.style.transform = 'translateX(-50%) rotate(180deg)';
    } else {
        mobileArrow.style.transform = 'translateX(-50%) rotate(0deg)';
    }
}

// Event listeners
slidesContainer.addEventListener('scroll', updateParallax);
window.addEventListener('resize', updateParallax);

// Keyboard navigation (same as previous)
document.addEventListener('keydown', (e) => {
    const currentSlide = Math.round(slidesContainer.scrollTop / window.innerHeight);
    
    if (e.key === 'ArrowDown' && currentSlide < totalSlides - 1) {
        slides[currentSlide + 1].scrollIntoView({ behavior: 'smooth' });
    }
    if (e.key === 'ArrowUp' && currentSlide > 0) {
        slides[currentSlide - 1].scrollIntoView({ behavior: 'smooth' });
    }
});

// Touch support (same as previous)
let touchStartY = 0;
document.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', e => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    const currentSlide = Math.round(slidesContainer.scrollTop / window.innerHeight);

    if (Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSlide < totalSlides - 1) {
            slides[currentSlide + 1].scrollIntoView({ behavior: 'smooth' });
        } else if (deltaY < 0 && currentSlide > 0) {
            slides[currentSlide - 1].scrollIntoView({ behavior: 'smooth' });
        }
    }
});

function updateNavigation() {
    const scrollTop = slidesContainer.scrollTop;
    const viewportHeight = window.innerHeight;
    const currentSlide = Math.round(scrollTop / viewportHeight);
    
    // Update active nav item
    navItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentSlide);
    });
    
    // Update progress indicator position
    const progress = ((currentSlide + 1) / navItems.length) * 100;
    const indicatorPos = (currentSlide / (navItems.length - 1)) * 100;
    progressIndicator.style.transform = `translateY(${indicatorPos}%)`;
    
    // Update arrow position
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        const arrow = progressIndicator.querySelector('::after');
        const itemTop = activeItem.offsetTop;
        progressIndicator.style.setProperty('--arrow-position', `${itemTop}px`);
    }
}

// Add click handlers for nav items
navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        slidesContainer.scrollTo({
            top: index * window.innerHeight,
            behavior: 'smooth'
        });
    });
});

function handleArrowClick() {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    slidesContainer.scrollTo({
        top: currentSlideIndex * window.innerHeight,
        behavior: 'smooth'
    });
}

// Update navigation on scroll
slidesContainer.addEventListener('scroll', updateNavigation);
window.addEventListener('resize', updateNavigation);
mobileArrow.addEventListener('click', handleArrowClick);
slidesContainer.addEventListener('scroll', updateArrow);

// Hide arrow during scroll on mobile
let scrollTimeout;
slidesContainer.addEventListener('scroll', () => {
    mobileArrow.style.opacity = '0';
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        mobileArrow.style.opacity = '1';
    }, 1000);
});

// Initial update
updateArrow();

// Initial positioning
updateParallax();

updateNavigation();