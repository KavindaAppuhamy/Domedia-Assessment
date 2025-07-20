document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // --- Efficient Particle System ---
  function createParticles() {
    const particleCount = 15;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationDuration = `${Math.random() * 5 + 3}s`;
      fragment.appendChild(particle);
    }
    body.appendChild(fragment);
  }

  // --- Custom Cursor ---
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 500, fill: "forwards" });
    });

    document.querySelectorAll('a, button, .logo, .service-card, .social-links a, .carousel-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }

  // --- Dark Mode Toggle ---
  const darkModeToggle = document.getElementById('darkModeToggle');
  const mobileDarkModeToggle = document.getElementById('mobileDarkModeToggle');
  
  const updateThemeUI = (theme) => {
      const isDark = theme === 'dark';
      [darkModeToggle, mobileDarkModeToggle].forEach(toggle => {
          if (toggle) {
              const icon = toggle.querySelector('.toggle-icon');
              const text = toggle.querySelector('.toggle-text');
              icon.textContent = isDark ? '☀️' : '🌙';
              if (text) text.textContent = isDark ? 'Light Mode' : 'Dark Mode';
          }
      });
      body.setAttribute('data-theme', theme);
  };

  const toggleDarkMode = () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      updateThemeUI(newTheme);
  };

  darkModeToggle.addEventListener('click', toggleDarkMode);
  mobileDarkModeToggle.addEventListener('click', toggleDarkMode);

  const savedTheme = localStorage.getItem('theme') || 'light';
  updateThemeUI(savedTheme);

  // --- Sticky Header & Scroll Effects ---
  const header = document.getElementById('header');
  const scrollToTop = document.getElementById('scrollToTop');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 50);
    scrollToTop.classList.toggle('visible', scrollY > 300);
    scrollIndicator.classList.toggle('hidden', scrollY > 100);
  });

  // --- Mobile Menu ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuPopup = document.getElementById('mobileMenuPopup');

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenuPopup.classList.toggle('active');
  });

// Update the carousel functionality in script.js
const testimonialTrack = document.getElementById('testimonialTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const mobilePrevBtn = document.getElementById('mobilePrevBtn');
const mobileNextBtn = document.getElementById('mobileNextBtn');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const carouselTrackWrapper = document.querySelector('.carousel-track-wrapper');

let currentIndex = 0;
let cardWidth = 0;
let visibleCards = 1;

const updateCarousel = () => {
  visibleCards = getVisibleCards();
  
  // Calculate card width based on container width
  const containerWidth = carouselTrackWrapper.offsetWidth;
  cardWidth = (containerWidth / visibleCards) - (30 - (30 / visibleCards));
  
  // Apply the width to each card for consistent sizing
  testimonialCards.forEach(card => {
    card.style.width = `${cardWidth}px`;
  });
  
  // Calculate the total width to move
  const moveDistance = currentIndex * (cardWidth + 30);
  testimonialTrack.style.transform = `translateX(-${moveDistance}px)`;
  
  // Center the track in mobile view
  if (window.innerWidth <= 600) {
    const trackWidth = testimonialTrack.scrollWidth;
    const wrapperWidth = carouselTrackWrapper.offsetWidth;
    const offset = (wrapperWidth - cardWidth) / 2;
    testimonialTrack.style.transform = `translateX(calc(-${moveDistance}px + ${offset}px))`;
  }
};

const moveToNext = () => {
  const maxIndex = testimonialCards.length - visibleCards;
  if (currentIndex < maxIndex) {
    currentIndex++;
    updateCarousel();
  }
};

const moveToPrev = () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
};

const getVisibleCards = () => {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 992) return 2;
  return 3;
};

// Event listeners for all buttons
nextBtn.addEventListener('click', moveToNext);
prevBtn.addEventListener('click', moveToPrev);
mobileNextBtn.addEventListener('click', moveToNext);
mobilePrevBtn.addEventListener('click', moveToPrev);

// Handle window resize
window.addEventListener('resize', () => {
  const newVisibleCards = getVisibleCards();
  const maxIndex = testimonialCards.length - newVisibleCards;
  
  // Adjust currentIndex if it would be out of bounds
  if (currentIndex > maxIndex) {
    currentIndex = Math.max(0, maxIndex);
  }
  
  updateCarousel();
});

// Initialize
updateCarousel();

// Optional: Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

testimonialTrack.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

testimonialTrack.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, false);

function handleSwipe() {
  const swipeThreshold = 50;
  if (touchEndX < touchStartX - swipeThreshold) {
    moveToNext();
  }
  if (touchEndX > touchStartX + swipeThreshold) {
    moveToPrev();
  }
}


  
  // --- Chat Widget ---
  const chatWidget = document.getElementById('chatWidget');
  const chatPopup = document.getElementById('chatPopup');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');

  chatWidget.addEventListener('click', () => chatPopup.classList.add('active'));
  chatClose.addEventListener('click', () => chatPopup.classList.remove('active'));
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent! We\'ll get back to you soon.');
    chatPopup.classList.remove('active');
    e.target.reset();
  });

  // --- Scroll To Top Button ---
  scrollToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Smooth Scrolling with Header Offset ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      // Ensure it's a valid anchor on the page
      if (href.length > 1 && href.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const headerOffset = document.getElementById('header').offsetHeight + 20; // 20px buffer
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

          // Close mobile menu if open
          if (mobileMenuPopup.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            mobileMenuPopup.classList.remove('active');
          }
        }
      }
    });
  });

  // --- Intersection Observer for On-Scroll Animations ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.about-content, .service-card, .testimonial-card, .newsletter-section').forEach(el => {
    observer.observe(el);
  });

  // --- Close Popups on Outside Click ---
  document.addEventListener('click', (e) => {
    if (mobileMenuPopup.classList.contains('active') && !mobileMenuPopup.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      mobileMenuBtn.classList.remove('active');
      mobileMenuPopup.classList.remove('active');
    }
    if (chatPopup.classList.contains('active') && !chatPopup.contains(e.target) && !chatWidget.contains(e.target)) {
      chatPopup.classList.remove('active');
    }
  });
  
  // --- Form Submissions ---
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    alert(`Thank you for subscribing with ${email}!`);
    e.target.reset();
  });

  // --- Initialize ---
  createParticles();
});