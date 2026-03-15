// ================= PRELOADER =================
(function () {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Dismiss preloader after bar fill animation completes (~4s total)
    setTimeout(function () {
        preloader.classList.add('fade-out');
        // Start hero animations after preloader fades
        setTimeout(function () {
            startHeroAnimations();
        }, 300);
        // Remove from DOM after transition
        setTimeout(function () {
            preloader.remove();
        }, 700);
    }, 4000);
})();

// ================= HERO TYPING ANIMATION =================
function startHeroAnimations() {
    // Activate slide-in animations
    var slideElements = document.querySelectorAll('.anim-slide-in');
    slideElements.forEach(function (el) {
        el.classList.add('anim-active');
    });

    // Start typing effect after slide-ins begin
    setTimeout(function () {
        var typingEl = document.querySelector('.typing-text');
        if (typingEl) {
            typeText(typingEl, typingEl.getAttribute('data-text'), 0);
        }
    }, 500);
}

function typeText(element, text, index) {
    if (index <= text.length) {
        element.textContent = text.substring(0, index);
        setTimeout(function () {
            typeText(element, text, index + 1);
        }, 35);
    } else {
        // Typing done — remove cursor after a short pause
        setTimeout(function () {
            element.classList.add('done');
        }, 1200);
    }
}

// ================= SCROLL REVEAL SECTIONS =================
function initScrollReveal() {
    var sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(function (section) {
        if (!section.classList.contains('scroll-reveal')) {
            section.classList.add('scroll-reveal');
        }
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.scroll-reveal').forEach(function (el) {
        observer.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', initScrollReveal);

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Close menu when link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        }
    });
});

// Booking Form Handling
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            eventDate: document.getElementById('eventDate').value,
            packageType: document.getElementById('packageType').value,
            location: document.getElementById('location').value,
            message: document.getElementById('message').value,
            submittedAt: new Date().toISOString()
        };

        try {
            // Save to localStorage (for demo purposes)
            let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.push(formData);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            // Also attempt to send to email service (using formspree or similar)
            sendToEmailService(formData);

            // Show success message
            showSuccessMessage();

            // Reset form
            bookingForm.reset();

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your booking. Please try again or contact us directly.');
        }
    });
}

// Send booking to email service
function sendToEmailService(data) {
    // Using FormSubmit.co (free service) - replace with your email
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('subject', `New Booking Request - ${data.name}`);
    formData.append('message', `
        Name: ${data.name}
        Email: ${data.email}
        Phone: ${data.phone}
        Event Date: ${data.eventDate}
        Package: ${data.packageType}
        Location: ${data.location}
        Additional Requirements: ${data.message}
    `)

    // Uncomment and replace YOUR_EMAIL with your actual email
    // fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //     method: 'POST',
    //     body: formData
    // });
}

// Show success message
function showSuccessMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 9999;
        animation: slideInDown 0.3s ease;
    `;
    message.textContent = 'Booking request submitted successfully! We will contact you soon.';
    document.body.appendChild(message);

    setTimeout(() => {
        message.style.animation = 'slideInUp 0.3s ease';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Open Booking Form Modal
function openBookingForm(packageName, price) {
    const modal = document.getElementById('bookingModal');
    const modalInfo = document.getElementById('modalPackageInfo');
    
    if (modal) {
        modalInfo.innerHTML = `
            <h3>${packageName}</h3>
            <p>Price: ₹${price.toLocaleString()}</p>
            <p style="font-size: 0.9rem; opacity: 0.8;">Booking Amount: ₹10,000</p>
        `;
        modal.classList.add('active');
    }
}

// Close Booking Form Modal
function closeBookingForm() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Open Contact Form (for custom quotes)
function openContactForm() {
    alert('Please contact us directly:\n\nPhone: +91-80808-08080\nWhatsApp: Click the WhatsApp button below\n\nWe will create a customized quote for you!');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeBookingForm();
    }
}

// Smooth scroll link tracking
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Scroll reveal animation
const revealElements = function() {
    const reveals = document.querySelectorAll('[class*="card"], [class*="item"], section > div');
    
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveal.style.opacity = '1';
            reveal.style.transform = 'translateY(0)';
        }
    });
};

// Initialize
window.addEventListener('load', revealElements);
window.addEventListener('scroll', revealElements);

// Add initial opacity to elements for reveal animation
document.addEventListener('DOMContentLoaded', function() {
    const reveals = document.querySelectorAll('[class*="card"], [class*="item"]');
    reveals.forEach(reveal => {
        reveal.style.opacity = '0';
        reveal.style.transform = 'translateY(20px)';
        reveal.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

// Analytics - Track form submissions
function trackBookingSubmission(packageName) {
    console.log(`Booking for ${packageName} - ${new Date().toLocaleString()}`);
    // Can be connected to Google Analytics or other tracking service
}

// Keyboard navigation
let currentHeroSlideIndex = 0;
let heroSlides = [];
let heroSliderTimer = null;

function animateHeroContent() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    heroContent.classList.remove('hero-content-active');
    void heroContent.offsetWidth;
    heroContent.classList.add('hero-content-active');
}

function showHeroSlide(index) {
    if (!heroSlides.length) return;

    heroSlides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === index);
    });

    currentHeroSlideIndex = index;
    animateHeroContent();
}

function changeSlide(direction) {
    if (!heroSlides.length) return;

    const nextIndex = (currentHeroSlideIndex + direction + heroSlides.length) % heroSlides.length;
    showHeroSlide(nextIndex);

    if (heroSliderTimer) {
        clearInterval(heroSliderTimer);
        heroSliderTimer = setInterval(() => changeSlide(1), 5000);
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('bookingModal');
        if (modal && modal.classList.contains('active')) {
            closeBookingForm();
        }
    }

    // arrow keys for slider control
    if (e.key === 'ArrowRight') changeSlide(1);
    if (e.key === 'ArrowLeft') changeSlide(-1);
});

document.addEventListener('DOMContentLoaded', function() {
    heroSlides = Array.from(document.querySelectorAll('.hero-slide'));

    const prevButton = document.querySelector('.hero-control.prev');
    const nextButton = document.querySelector('.hero-control.next');

    if (prevButton) {
        prevButton.addEventListener('click', () => changeSlide(-1));
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => changeSlide(1));
    }

    if (heroSlides.length) {
        showHeroSlide(0);
        heroSliderTimer = setInterval(() => changeSlide(1), 5000);
    }
});

// WhatsApp button functionality (if needed)
function sendWhatsAppMessage() {
    const phoneNumber = '919199076247';
    const message = 'Hi! I am interested in your wedding photography packages.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Make WhatsApp links functional
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // WhatsApp link will open as is
        return true;
    });
});

// Simple form validation
function validateForm(formElement) {
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            field.style.borderColor = '#e0e0e0';
        }
    });

    return isValid;
}

// Add validation to form
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        if (!validateForm(bookingForm)) {
            e.preventDefault();
            alert('Please fill in all required fields.');
        }
    });
}

// Add focus styles to form fields
const formInputs = document.querySelectorAll('input, select, textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        this.style.borderColor = '#e74c3c';
    });

    input.addEventListener('blur', function() {
        this.style.boxShadow = '';
        if (!this.value) {
            this.style.borderColor = '#e0e0e0';
        }
    });
});

// Gallery lazy loading
const galleryImages = document.querySelectorAll('.gallery-item img');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
        }
    });
});

galleryImages.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    imageObserver.observe(img);
});

// Sticky navigation enhancement
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Date picker - disable past dates
const eventDateInput = document.getElementById('eventDate');
if (eventDateInput) {
    const today = new Date().toISOString().split('T')[0];
    eventDateInput.setAttribute('min', today);
}

// Easter egg - scroll to top button
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #e74c3c;
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 999;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
        transition: all 0.3s ease;
    `;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
        } else {
            button.style.display = 'none';
        }
    });

    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    button.addEventListener('mouseover', function() {
        this.style.background = '#c0392b';
        this.style.transform = 'scale(1.1)';
    });

    button.addEventListener('mouseout', function() {
        this.style.background = '#e74c3c';
        this.style.transform = 'scale(1)';
    });

    document.body.appendChild(button);
}

// Initialize scroll to top button
window.addEventListener('load', createScrollToTopButton);

// Export bookings as CSV (for admin)
function exportBookingsAsCSV() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    
    if (bookings.length === 0) {
        alert('No bookings to export');
        return;
    }

    let csv = 'Name,Email,Phone,Event Date,Package,Location,Message,Submitted At\n';
    
    bookings.forEach(booking => {
        csv += `"${booking.name}","${booking.email}","${booking.phone}","${booking.eventDate}","${booking.packageType}","${booking.location}","${booking.message}","${booking.submittedAt}"\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', 'bookings.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Log app info
console.log('%cCapture Creation Studio', 'color: #e74c3c; font-size: 20px; font-weight: bold;');
console.log('%cWedding Photography Services - Bhagalpur', 'color: #764ba2; font-size: 14px;');
console.log('Contact: +91-9199076247');
console.log('WhatsApp: Available for direct booking');

