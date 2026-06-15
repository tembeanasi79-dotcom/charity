// Counter Animation Function
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000; // 2 seconds
  const start = 0;
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    
    const current = Math.floor(start + (target - start) * easeOutQuad);
    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  update();
}

// Intersection Observer to trigger animation when counter is in view
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          animateCounter(entry.target);
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
  } else {
    // Fallback for browsers without IntersectionObserver
    counters.forEach(counter => {
      animateCounter(counter);
      counter.classList.add('animated');
    });
  }
}

// Lazy load partner logos
function initPartnerLogos() {
  const partnerImages = document.querySelectorAll('.partner-img');
  
  if ('IntersectionObserver' in window) {
    const imageObserverOptions = {
      threshold: 0.1,
      rootMargin: '50px'
    };

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const dataSrc = img.getAttribute('data-src');
          
          if (dataSrc) {
            img.src = dataSrc;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          }
          
          imageObserver.unobserve(img);
        }
      });
    }, imageObserverOptions);

    partnerImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback: load all images immediately
    partnerImages.forEach(img => {
      const dataSrc = img.getAttribute('data-src');
      if (dataSrc) {
        img.src = dataSrc;
      }
    });
  }
}

// Initialize counters when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCounters();
    initPartnerLogos();
  });
} else {
  initCounters();
  initPartnerLogos();
}
