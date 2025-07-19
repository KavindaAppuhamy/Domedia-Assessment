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
              const icon = toggle.querySelector('i');
              const text = toggle.querySelector('.toggle-text');
              icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
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

  // --- Testimonials Carousel ---
  const testimonialTrack = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentTestimonial = 0;
  const testimonials = document.querySelectorAll('.testimonial-card');
  const totalTestimonials = testimonials.length;

  const showTestimonial = (index) => {
    testimonialTrack.style.transform = `translateX(-${index * (100 / totalTestimonials)}%)`;
    testimonials.forEach((card, i) => card.style.opacity = i === index ? 1 : 0.5);
  };
  
  if (totalTestimonials > 0) {
    // Adjust track width for proper translation
    testimonialTrack.style.width = `${totalTestimonials * 100}%`;
    
    nextBtn.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
      showTestimonial(currentTestimonial);
    });
    prevBtn.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
      showTestimonial(currentTestimonial);
    });
    setInterval(() => nextBtn.click(), 5000);
    showTestimonial(0); // Initial call
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