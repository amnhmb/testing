// Force page to start at top on reload and clear hash
if (window.history.scrollRestoration) {
  window.history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});
if (window.location.hash) {
  window.history.replaceState(null, null, window.location.pathname);
}
window.scrollTo(0, 0);

// Scroll Reveal Animation
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.section-reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Countdown Logic
  const countdownDate = new Date("Oct 24, 2026 11:00:00").getTime();
  
  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = countdownDate - now;
    
    if (distance < 0) {
      document.getElementById("cd-days").innerText = "00";
      document.getElementById("cd-hours").innerText = "00";
      document.getElementById("cd-mins").innerText = "00";
      document.getElementById("cd-secs").innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("cd-days").innerText = days.toString().padStart(2, '0');
    document.getElementById("cd-hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("cd-mins").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("cd-secs").innerText = seconds.toString().padStart(2, '0');
  };

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Audio Logic
  const audioBtn = document.getElementById('audio-toggle');
  const audioText = document.getElementById('audio-text');
  const bgMusic = document.getElementById('bg-music');
  bgMusic.volume = 0.7; // Set default volume to 70%
  let isPlaying = false;

  audioBtn.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      audioText.innerText = 'Play Muzik';
      document.getElementById('audio-icon').style.display = 'block';
      document.getElementById('audio-wave').style.display = 'none';
      isPlaying = false;
    } else {
      bgMusic.play().catch(e => console.log('Audio play failed:', e));
      audioText.innerText = 'Pause Muzik';
      document.getElementById('audio-icon').style.display = 'none';
      document.getElementById('audio-wave').style.display = 'flex';
      isPlaying = true;
    }
  });

  // SIDE MENU LOGIC
  const menuBtn = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('close-menu-btn');
  const sideMenu = document.getElementById('side-menu');
  const menuLinks = document.querySelectorAll('.menu-link');

  if(menuBtn && closeBtn && sideMenu) {
    menuBtn.addEventListener('click', () => {
      sideMenu.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
      sideMenu.classList.remove('active');
    });

    // Close when clicking outside content
    sideMenu.addEventListener('click', (e) => {
      if(e.target === sideMenu) {
        sideMenu.classList.remove('active');
      }
    });

    // Close when a link is clicked
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        sideMenu.classList.remove('active');
      });
    });
  }

  // MAP MODAL LOGIC
  const mapModal = document.getElementById('map-modal');
  if(mapModal) {
    mapModal.addEventListener('click', (e) => {
      if(e.target === mapModal) {
        mapModal.classList.remove('active');
      }
    });
  }

  // CONTACT MODAL LOGIC
  const contactModal = document.getElementById('contact-modal');
  if(contactModal) {
    contactModal.addEventListener('click', (e) => {
      if(e.target === contactModal) {
        contactModal.classList.remove('active');
      }
    });
  }

  // COPY BANK ACCOUNT
  const copyBtn = document.getElementById('copy-btn');
  const bankAcc = document.getElementById('bank-acc');

  if(copyBtn && bankAcc) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = bankAcc.innerText.replace(/\s+/g, '');
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg> Disalin!';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      });
    });
  }


});


/* ==========================================================================
   STANDARD PACKAGE ADDITIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // Carousel Logic (Scroll Snap with Indicators)
  const track = document.getElementById('story-carousel');
  const slides = document.querySelectorAll('.story-slide');
  const indicators = document.querySelectorAll('.story-dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (track && slides.length > 0) {
    let currentIndex = 0;

    const updateCarousel = (index) => {
      track.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
      indicators.forEach((ind, i) => {
        if (i === index) ind.classList.add('active');
        else ind.classList.remove('active');
      });
    };

    track.addEventListener('scroll', () => {
      const scrollPosition = track.scrollLeft;
      const slideWidth = slides[0].offsetWidth;
      currentIndex = Math.round(scrollPosition / slideWidth);
      
      indicators.forEach((ind, i) => {
        if (i === currentIndex) {
          ind.classList.add('active');
          ind.classList.remove('bg-gray-300');
        } else {
          ind.classList.remove('active');
          ind.classList.add('bg-gray-300');
        }
      });
    });

    prevBtn?.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel(currentIndex);
      }
    });

    nextBtn?.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        updateCarousel(currentIndex);
      }
    });

    indicators.forEach((ind, i) => {
      ind.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel(currentIndex);
      });
    });
  }

  // RSVP Form Expand Logic based on Kehadiran
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
  const detailsContainer = document.getElementById('rsvp-details-container');
  
  if (attendanceRadios.length > 0 && detailsContainer) {
    attendanceRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'ya') {
          detailsContainer.style.maxHeight = detailsContainer.scrollHeight + "px";
        } else {
          detailsContainer.style.maxHeight = "0";
        }
      });
    });
  }
});
