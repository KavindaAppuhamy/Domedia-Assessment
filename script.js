// Best Practice: Wrap code in DOMContentLoaded to ensure DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Best Practice: Cache frequently used DOM elements
  const body = document.body;

  // --- Efficient Particle System ---
  // Best Practice: Use document fragments for batch DOM operations
  function createParticles() {
    const particleCount = 15;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      // Best Practice: Use template literals for string interpolation
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      // Best Practice: Randomize animations for natural feel
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationDuration = `${Math.random() * 5 + 3}s`;
      fragment.appendChild(particle);
    }
    body.appendChild(fragment);
  }

  // --- Custom Cursor ---
  // Best Practice: Check for hover capability before adding cursor effects
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Best Practice: Throttle mousemove events if performance is critical
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
      // Best Practice: Use Web Animations API for smooth transitions
      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 500, fill: "forwards" });
    });

    // Best Practice: Select interactive elements comprehensively
    document.querySelectorAll('a, button, .logo, .service-card, .social-links a, .carousel-btn').forEach(el => {
      // Best Practice: Add hover state indicators
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
  // Best Practice: Cache toggle elements
  const darkModeToggle = document.getElementById('darkModeToggle');
  const mobileDarkModeToggle = document.getElementById('mobileDarkModeToggle');
  
  // Best Practice: Centralize UI update logic
  const updateThemeUI = (theme) => {
      const isDark = theme === 'dark';
      // Best Practice: Handle both desktop and mobile toggles consistently
      [darkModeToggle, mobileDarkModeToggle].forEach(toggle => {
          if (toggle) {
              const icon = toggle.querySelector('.toggle-icon');
              const text = toggle.querySelector('.toggle-text');
              icon.textContent = isDark ? '☀️' : '🌙';
              if (text) text.textContent = isDark ? 'Light Mode' : 'Dark Mode';
          }
      });
      // Best Practice: Use data attributes for theme state
      body.setAttribute('data-theme', theme);
  };

  // Best Practice: Separate toggle logic from UI updates
  const toggleDarkMode = () => {
      const currentTheme = body.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      // Best Practice: Persist user preference
      localStorage.setItem('theme', newTheme);
      updateThemeUI(newTheme);
  };

  // Best Practice: Add event listeners to both toggles
  darkModeToggle.addEventListener('click', toggleDarkMode);
  mobileDarkModeToggle.addEventListener('click', toggleDarkMode);

  // Best Practice: Initialize with saved preference or default
  const savedTheme = localStorage.getItem('theme') || 'light';
  updateThemeUI(savedTheme);

  // --- Sticky Header & Scroll Effects ---
  // Best Practice: Cache scroll-related elements
  const header = document.getElementById('header');
  const scrollToTop = document.getElementById('scrollToTop');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  // Best Practice: Throttle scroll events if performance is critical
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Best Practice: Use classList.toggle with condition
    header.classList.toggle('scrolled', scrollY > 50);
    scrollToTop.classList.toggle('visible', scrollY > 300);
    scrollIndicator.classList.toggle('hidden', scrollY > 100);
  });

  // --- Mobile Menu ---
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuPopup = document.getElementById('mobileMenuPopup');

  // Best Practice: Toggle classes for menu state
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenuPopup.classList.toggle('active');
  });

  // --- Testimonial Carousel ---
  // Best Practice: Organize carousel logic comprehensively
  const testimonialTrack = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const mobilePrevBtn = document.getElementById('mobilePrevBtn');
  const mobileNextBtn = document.getElementById('mobileNextBtn');
  
  let currentIndex = 0;
  let cardWidth = 0;
  let visibleCards = 3; // Number of cards visible at once
  let totalCards = 0;
  let maxIndex = 0;
  
  // Best Practice: Calculate dimensions responsively
  function calculateDimensions() {
      const cards = document.querySelectorAll('.testimonial-card');
      totalCards = cards.length;
      
      if (cards.length > 0) {
          const cardStyle = window.getComputedStyle(cards[0]);
          cardWidth = cards[0].offsetWidth + parseInt(cardStyle.marginRight) + 20; // Include gap
          
          // Best Practice: Dynamically determine visible cards
          const containerWidth = document.querySelector('.carousel-track-wrapper').offsetWidth;
          visibleCards = Math.floor(containerWidth / cardWidth) || 1;
          
          // Calculate maximum index
          maxIndex = Math.max(0, totalCards - visibleCards);
          
          // Update button states
          updateButtonStates();
      }
  }
  
  // Best Practice: Separate carousel update logic
  function updateCarousel() {
      if (testimonialTrack) {
          const translateX = -currentIndex * cardWidth;
          testimonialTrack.style.transform = `translateX(${translateX}px)`;
          updateButtonStates();
      }
  }
  
  // Best Practice: Keep button states in sync
  function updateButtonStates() {
      // Update prev buttons
      [prevBtn, mobilePrevBtn].forEach(btn => {
          if (btn) {
              btn.disabled = currentIndex <= 0;
          }
      });
      
      // Update next buttons
      [nextBtn, mobileNextBtn].forEach(btn => {
          if (btn) {
              btn.disabled = currentIndex >= maxIndex;
          }
      });
  }
  
  // Best Practice: Separate navigation functions
  function scrollNext() {
      if (currentIndex < maxIndex) {
          currentIndex++;
          updateCarousel();
      }
  }
  
  function scrollPrev() {
      if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
      }
  }
  
  // Best Practice: Add touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  function handleSwipe() {
      const swipeThreshold = 50;
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) > swipeThreshold) {
          if (swipeDistance > 0) {
              scrollPrev();
          } else {
              scrollNext();
          }
      }
  }
  
  // Event listeners
  if (testimonialTrack) {
      // Best Practice: Handle both desktop and mobile controls
      [nextBtn, mobileNextBtn].forEach(btn => {
          if (btn) {
              btn.addEventListener('click', scrollNext);
          }
      });
      
      [prevBtn, mobilePrevBtn].forEach(btn => {
          if (btn) {
              btn.addEventListener('click', scrollPrev);
          }
      });
      
      // Best Practice: Add touch support with passive listeners
      testimonialTrack.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
      }, { passive: true });
      
      testimonialTrack.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].clientX;
          handleSwipe();
      }, { passive: true });
      
      // Best Practice: Add keyboard navigation
      document.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') {
              scrollPrev();
          } else if (e.key === 'ArrowRight') {
              scrollNext();
          }
      });
      
      // Best Practice: Debounce resize events
      let resizeTimeout;
      window.addEventListener('resize', () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
              calculateDimensions();
              // Reset to valid index if needed
              if (currentIndex > maxIndex) {
                  currentIndex = maxIndex;
              }
              updateCarousel();
          }, 250);
      });
      
      // Initialize
      calculateDimensions();
      updateCarousel();
  }

  // --- Chat Widget ---
  const chatWidget = document.getElementById('chatWidget');
  const chatPopup = document.getElementById('chatPopup');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');

  // Best Practice: Simple toggle for chat UI
  chatWidget.addEventListener('click', () => chatPopup.classList.add('active'));
  chatClose.addEventListener('click', () => chatPopup.classList.remove('active'));
  // Best Practice: Handle form submission gracefully
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent! We\'ll get back to you soon.');
    chatPopup.classList.remove('active');
    e.target.reset();
  });

  // --- Scroll To Top Button ---
  // Best Practice: Use smooth scrolling
  scrollToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Smooth Scrolling with Header Offset ---
  // Best Practice: Handle all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      // Ensure it's a valid anchor on the page
      if (href.length > 1 && href.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          // Best Practice: Account for fixed header
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
  // Best Practice: Use IntersectionObserver for scroll animations
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

  // Best Practice: Observe multiple elements
  document.querySelectorAll('.about-content, .service-card, .testimonial-card, .newsletter-section').forEach(el => {
    observer.observe(el);
  });

  // --- Close Popups on Outside Click ---
  // Best Practice: Handle outside clicks for popups
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
  // Best Practice: Handle form submission
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    alert(`Thank you for subscribing with ${email}!`);
    e.target.reset();
  });

  // --- Initialize ---
  createParticles();
});