// DevLastStudio - JavaScript Interactions

document.addEventListener('DOMContentLoaded', () => {
  // Initialize language
  if (window.i18n) {
    window.i18n.initLanguage();
  }

  // Mobile Navigation Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Language Selector
  const langSelector = document.getElementById('lang-selector');
  const langBtn = document.getElementById('lang-btn');
  const langDropdown = document.getElementById('lang-dropdown');

  if (langBtn && langSelector) {
    // Toggle dropdown
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langSelector.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!langSelector.contains(e.target)) {
        langSelector.classList.remove('active');
      }
    });

    // Language option clicks
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
      option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang');
        if (window.i18n) {
          window.i18n.setLanguage(lang);
        }
        langSelector.classList.remove('active');

        // Update active state
        langOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
      });
    });

    // Set initial active state
    if (window.i18n) {
      const currentLang = window.i18n.getCurrentLanguage();
      langOptions.forEach(option => {
        if (option.getAttribute('data-lang') === currentLang) {
          option.classList.add('active');
        }
      });
    }
  }

  // Header scroll effect
  const header = document.getElementById('header');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // Stagger animation for feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });

  // Stagger animation for app cards
  const appCards = document.querySelectorAll('.app-card');
  appCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.15}s`;
  });

  // Hero Slider
  initHeroSlider();
});

// Hero Slider Functionality
function initHeroSlider() {
  const slider = document.getElementById('hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dots = slider.querySelectorAll('.slider-dot');
  const prevBtn = slider.querySelector('.slider-arrow-prev');
  const nextBtn = slider.querySelector('.slider-arrow-next');

  if (slides.length === 0) return;

  let currentSlide = 0;
  let autoPlayInterval;
  const autoPlayDelay = 6000; // 6 seconds

  // Go to specific slide
  function goToSlide(index) {
    // Remove active and prev classes from all slides
    slides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev');
      if (i < index) {
        slide.classList.add('prev');
      }
    });

    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));

    // Activate current slide and dot
    slides[index].classList.add('active');
    if (dots[index]) {
      dots[index].classList.add('active');
    }

    currentSlide = index;
  }

  // Next slide
  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  // Previous slide
  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
  }

  // Start auto-play
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
  }

  // Stop auto-play
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
  }

  // Event listeners for navigation
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay(); // Reset timer on manual navigation
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay(); // Reset timer on manual navigation
    });
  }

  // Event listeners for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      startAutoPlay(); // Reset timer on manual navigation
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      startAutoPlay();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      startAutoPlay();
    }
  });

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoPlay();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide(); // Swipe left, go next
      } else {
        prevSlide(); // Swipe right, go prev
      }
    }
  }

  // Start auto-play on load
  startAutoPlay();
}

// Prevent flash of unstyled content
document.documentElement.classList.add('js-loaded');
