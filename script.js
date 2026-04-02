let currentHeroSlideIndex = 0;
let heroSlides = [];
let heroSliderTimer = null;
let heroAnimationStarted = false;
var preloaderStartedAt = Date.now();
var preloaderZoomStarted = false;

function startHeroAnimations() {
    if (heroAnimationStarted) return;

    heroAnimationStarted = true;

    document.querySelectorAll('.anim-slide-in').forEach(function (element) {
        element.classList.add('anim-active');
    });

    window.setTimeout(function () {
        typeTextSequence(Array.from(document.querySelectorAll('.hero-content .typing-line')));
    }, 220);
}

function typeText(element, text, index) {
    if (index <= text.length) {
        element.textContent = text.substring(0, index);
        window.setTimeout(function () {
            typeText(element, text, index + 1);
        }, 28);
        return;
    }

    window.setTimeout(function () {
        element.classList.add('done');
    }, 900);
}

function typeTextSequence(elements, currentIndex) {
    var index = typeof currentIndex === 'number' ? currentIndex : 0;
    if (!elements.length || index >= elements.length) return;

    var element = elements[index];
    var text = element.getAttribute('data-text') || '';
    element.classList.remove('done');
    element.textContent = '';

    typeTextAndContinue(element, text, 0, function () {
        window.setTimeout(function () {
            typeTextSequence(elements, index + 1);
        }, index < 2 ? 180 : 120);
    });
}

function typeTextAndContinue(element, text, index, onComplete) {
    if (index <= text.length) {
        element.textContent = text.substring(0, index);
        window.setTimeout(function () {
            typeTextAndContinue(element, text, index + 1, onComplete);
        }, 24);
        return;
    }

    element.classList.add('done');

    if (typeof onComplete === 'function') {
        onComplete();
    }
}

function dismissPreloader() {
    var preloader = document.getElementById('preloader');
    if (!preloader || preloader.classList.contains('fade-out')) return;

    preloader.classList.add('fade-out');
    startHeroAnimations();

    window.setTimeout(function () {
        if (preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
        }
    }, 650);
}

function startPreloaderZoom() {
    var preloader = document.getElementById('preloader');
    if (!preloader || preloaderZoomStarted) return;

    preloaderZoomStarted = true;
    preloader.classList.add('zoom-sequence');
}

(function initPreloader() {
    var preloader = document.getElementById('preloader');
    if (!preloader) {
        startHeroAnimations();
        return;
    }

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var loadingDuration = reduceMotion ? 0 : 7000;
    var zoomDuration = reduceMotion ? 0 : 3000;
    var totalDuration = loadingDuration + zoomDuration;

    function schedulePhase(fn, targetTime) {
        var elapsed = Date.now() - preloaderStartedAt;
        var remaining = Math.max(0, targetTime - elapsed);
        window.setTimeout(fn, remaining);
    }

    function scheduleDismissal() {
        schedulePhase(dismissPreloader, totalDuration);
    }

    window.addEventListener('load', function () {
        if (zoomDuration > 0) {
            schedulePhase(startPreloaderZoom, loadingDuration);
        }
        scheduleDismissal();
    });

    if (zoomDuration > 0) {
        schedulePhase(startPreloaderZoom, loadingDuration);
    }
    scheduleDismissal();
})();

function initFaqAccordion() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-question');
        var answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        var isInitiallyOpen = question.getAttribute('aria-expanded') === 'true';
        item.classList.toggle('is-open', isInitiallyOpen);
        answer.classList.toggle('faq-open', isInitiallyOpen);

        question.addEventListener('click', function () {
            var isOpen = question.getAttribute('aria-expanded') === 'true';

            faqItems.forEach(function (otherItem) {
                var otherQuestion = otherItem.querySelector('.faq-question');
                var otherAnswer = otherItem.querySelector('.faq-answer');
                if (!otherQuestion || !otherAnswer) return;

                otherQuestion.setAttribute('aria-expanded', 'false');
                otherItem.classList.remove('is-open');
                otherAnswer.classList.remove('faq-open');
            });

            if (!isOpen) {
                question.setAttribute('aria-expanded', 'true');
                item.classList.add('is-open');
                answer.classList.add('faq-open');
            }
        });
    });
}

function initScrollReveal() {
    var sections = document.querySelectorAll('section:not(.hero)');

    sections.forEach(function (section) {
        section.classList.add('scroll-reveal');
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(function (element) {
        observer.observe(element);
    });
}

function loadDeferredBackground(element) {
    if (!element || !element.dataset.bg || element.dataset.bgLoaded === 'true') return;

    element.style.backgroundImage = "url('" + element.dataset.bg + "')";
    element.dataset.bgLoaded = 'true';
}

function initDeferredMedia() {
    var deferredBackgrounds = document.querySelectorAll('.deferred-bg[data-bg]');

    if (!deferredBackgrounds.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                loadDeferredBackground(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px 0px' });

    deferredBackgrounds.forEach(function (element, index) {
        if (index < 2 || element.classList.contains('hero-slide')) {
            loadDeferredBackground(element);
            return;
        }

        observer.observe(element);
    });
}

function setMenuState(isOpen) {
    var hamburger = document.querySelector('.hamburger');
    var navLinks = document.querySelector('.nav-links');

    if (!hamburger || !navLinks) return;

    hamburger.classList.toggle('is-active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    navLinks.classList.toggle('nav-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen && window.innerWidth <= 768);
}

function initMobileMenu() {
    var hamburger = document.querySelector('.hamburger');
    var navLinks = document.querySelector('.nav-links');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
        setMenuState(!navLinks.classList.contains('nav-open'));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            setMenuState(false);
        });
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            setMenuState(false);
        }
    });
}

function animateHeroContent() {
    var heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    heroContent.classList.remove('hero-content-active');
    void heroContent.offsetWidth;
    heroContent.classList.add('hero-content-active');
}

function showHeroSlide(index) {
    if (!heroSlides.length) return;

    heroSlides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
        if (slideIndex === index) {
            loadDeferredBackground(slide);
        }
    });

    currentHeroSlideIndex = index;
    animateHeroContent();
}

function restartHeroSlider() {
    if (heroSliderTimer) {
        window.clearInterval(heroSliderTimer);
    }

    heroSliderTimer = window.setInterval(function () {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    if (!heroSlides.length) return;

    var nextIndex = (currentHeroSlideIndex + direction + heroSlides.length) % heroSlides.length;
    showHeroSlide(nextIndex);
    restartHeroSlider();
}

function initHeroSlider() {
    heroSlides = Array.from(document.querySelectorAll('.hero-slide'));

    var prevButton = document.querySelector('.hero-control.prev');
    var nextButton = document.querySelector('.hero-control.next');

    if (prevButton) {
        prevButton.addEventListener('click', function () {
            changeSlide(-1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function () {
            changeSlide(1);
        });
    }

    if (heroSlides.length) {
        showHeroSlide(0);
        restartHeroSlider();
    }
}

function initTestimonialsSlider() {
    var slider = document.querySelector('[data-slider]');
    if (!slider) return;

    var track = slider.querySelector('.testimonials-track');
    var cards = Array.from(slider.querySelectorAll('.testimonial-card'));
    var dotsContainer = slider.querySelector('[data-slider-dots]');
    if (!track || !cards.length || !dotsContainer) return;

    var currentPage = 0;
    var totalPages = 1;
    var cardsPerView = 1;
    var sliderTimer = null;

    function getCardsPerView() {
        if (window.innerWidth >= 1100) return 3;
        if (window.innerWidth >= 700) return 2;
        return 1;
    }

    function renderDots() {
        dotsContainer.innerHTML = '';

        for (var i = 0; i < totalPages; i += 1) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'testimonials-dot' + (i === currentPage ? ' is-active' : '');
            dot.setAttribute('aria-label', 'Go to review slide ' + (i + 1));
            dot.addEventListener('click', (function (pageIndex) {
                return function () {
                    goToPage(pageIndex);
                    restartSlider();
                };
            })(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateSlider() {
        cardsPerView = getCardsPerView();
        totalPages = Math.max(1, Math.ceil(cards.length / cardsPerView));
        currentPage = Math.min(currentPage, totalPages - 1);
        var cardWidth = cards[0].getBoundingClientRect().width;
        var gap = parseFloat(window.getComputedStyle(track).gap || '0');
        var offset = currentPage * cardsPerView * (cardWidth + gap);
        track.style.transform = 'translateX(-' + offset + 'px)';
        renderDots();
    }

    function goToPage(pageIndex) {
        currentPage = pageIndex;
        updateSlider();
    }

    function nextPage() {
        currentPage = (currentPage + 1) % totalPages;
        updateSlider();
    }

    function restartSlider() {
        if (sliderTimer) {
            window.clearInterval(sliderTimer);
        }

        sliderTimer = window.setInterval(nextPage, 3600);
    }

    window.addEventListener('resize', function () {
        updateSlider();
    });

    updateSlider();
    restartSlider();
}

function showSuccessMessage() {
    var message = document.createElement('div');
    message.style.cssText = [
        'position: fixed',
        'top: 20px',
        'right: 20px',
        'max-width: min(92vw, 360px)',
        'background: #27ae60',
        'color: white',
        'padding: 1rem 1.25rem',
        'border-radius: 12px',
        'z-index: 9999',
        'box-shadow: 0 18px 34px rgba(0, 0, 0, 0.18)',
        'animation: slideInUp 0.25s ease'
    ].join(';');
    message.textContent = 'Booking request submitted successfully! We will contact you soon.';
    document.body.appendChild(message);

    window.setTimeout(function () {
        message.remove();
    }, 3000);
}

function sendToEmailService(data) {
    var formData = new FormData();
    formData.append('email', data.email);
    formData.append('subject', 'New Booking Request - ' + data.name);
    formData.append('message', [
        'Name: ' + data.name,
        'Email: ' + data.email,
        'Phone: ' + data.phone,
        'Event Date: ' + data.eventDate,
        'Package: ' + data.packageType,
        'Location: ' + data.location,
        'Additional Requirements: ' + data.message
    ].join('\n'));
}

function validateForm(formElement) {
    var requiredFields = formElement.querySelectorAll('[required]');
    var isValid = true;

    requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            isValid = false;
            return;
        }

        field.style.borderColor = '#e0e0e0';
    });

    return isValid;
}

function initBookingForm() {
    var bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!validateForm(bookingForm)) {
            alert('Please fill in all required fields.');
            return;
        }

        var formData = {
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
            var bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.push(formData);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            sendToEmailService(formData);
            showSuccessMessage();
            bookingForm.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error submitting your booking. Please try again or contact us directly.');
        }
    });
}

function createScrollToTopButton() {
    var button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.setAttribute('aria-label', 'Scroll to top');
    button.style.cssText = [
        'position: fixed',
        'bottom: 24px',
        'right: 20px',
        'background: #e74c3c',
        'color: white',
        'border: none',
        'width: 48px',
        'height: 48px',
        'border-radius: 50%',
        'cursor: pointer',
        'display: none',
        'z-index: 999',
        'font-size: 1.1rem',
        'box-shadow: 0 8px 22px rgba(231, 76, 60, 0.35)'
    ].join(';');

    window.addEventListener('scroll', function () {
        button.style.display = window.scrollY > 320 ? 'flex' : 'none';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
    });

    button.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(button);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
            var href = this.getAttribute('href');
            if (!href || href === '#') return;

            var target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function initFocusStyles() {
    document.querySelectorAll('input, select, textarea').forEach(function (input) {
        input.addEventListener('focus', function () {
            this.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
            this.style.borderColor = '#e74c3c';
        });

        input.addEventListener('blur', function () {
            this.style.boxShadow = '';
            if (!this.value) {
                this.style.borderColor = '#e0e0e0';
            }
        });
    });
}

window.openBookingForm = function (packageName, price) {
    var modal = document.getElementById('bookingModal');
    var modalInfo = document.getElementById('modalPackageInfo');

    if (!modal || !modalInfo) return;

    modalInfo.innerHTML = [
        '<h3>' + packageName + '</h3>',
        '<p>Price: Rs ' + price.toLocaleString() + '</p>',
        '<p style="font-size: 0.9rem; opacity: 0.8;">Booking Amount: Rs 10,000</p>'
    ].join('');
    modal.classList.add('active');
};

window.openWhatsAppBooking = function (itemName) {
    var phoneNumber = '919199076247';
    var message = 'Hi, I want to book ' + itemName + ' from Capture Creation Studio. Please share details.';
    var url = 'https://wa.me/' + phoneNumber + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank');
};

window.closeBookingForm = function () {
    var modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('active');
    }
};

window.openContactForm = function () {
    window.openWhatsAppBooking('Custom Wedding Package');
};

window.exportBookingsAsCSV = function () {
    var bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    if (!bookings.length) {
        alert('No bookings to export');
        return;
    }

    var csv = 'Name,Email,Phone,Event Date,Package,Location,Message,Submitted At\n';

    bookings.forEach(function (booking) {
        csv += '"' + booking.name + '","' + booking.email + '","' + booking.phone + '","' + booking.eventDate + '","' + booking.packageType + '","' + booking.location + '","' + booking.message + '","' + booking.submittedAt + '"\n';
    });

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', 'bookings.csv');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

window.addEventListener('click', function (event) {
    var modal = document.getElementById('bookingModal');
    if (modal && event.target === modal) {
        window.closeBookingForm();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        window.closeBookingForm();
        setMenuState(false);
    }

    if (event.key === 'ArrowRight') changeSlide(1);
    if (event.key === 'ArrowLeft') changeSlide(-1);
});

/* ============= DARK MODE THEME TOGGLE ============= */

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    
    // Get saved theme or detect system preference
    const getSavedTheme = () => {
        return localStorage.getItem('theme');
    };
    
    const getSystemTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
    
    // Initialize theme on page load
    const initializeTheme = () => {
        const savedTheme = getSavedTheme();
        let theme;
        
        if (savedTheme) {
            theme = savedTheme;
        } else {
            theme = getSystemTheme();
            localStorage.setItem('theme', theme);
        }
        
        applyTheme(theme);
    };
    
    // Apply theme to document
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        } else {
            htmlElement.removeAttribute('data-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
        localStorage.setItem('theme', theme);
    };
    
    // Toggle theme
    const toggleTheme = () => {
        const currentTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    };
    
    // Attach click event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!getSavedTheme()) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    // Initialize on load
    initializeTheme();
}

document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initScrollReveal();
    initDeferredMedia();
    initMobileMenu();
    initHeroSlider();
    initTestimonialsSlider();
    initFaqAccordion();
    initBookingForm();
    initSmoothScroll();
    initFocusStyles();
    createScrollToTopButton();

    var eventDateInput = document.getElementById('eventDate');
    if (eventDateInput) {
        eventDateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    }

    console.log('%cCapture Creation Studio', 'color: #e74c3c; font-size: 20px; font-weight: bold;');
    console.log('%cWedding Photography Services - Bhagalpur', 'color: #764ba2; font-size: 14px;');
    console.log('Contact: +91-9199076247');
});
