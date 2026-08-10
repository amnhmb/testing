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

  // PREVENT AUDIO PLAYER FROM OVERLAPPING FOOTER
  const footer = document.getElementById('base-footer');
  const audioPlayer = document.querySelector('.audio-player-fixed');
  
  if(footer && audioPlayer) {
    window.addEventListener('scroll', () => {
      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // If the top of the footer is visible in the viewport
      if (footerRect.top < viewportHeight) {
        // Calculate how much of the footer is exposed
        const overlap = viewportHeight - footerRect.top;
        // Push the audio player up by the exposed amount
        audioPlayer.style.transform = `translateY(-${overlap}px)`;
      } else {
        // Reset to original fixed position
        audioPlayer.style.transform = 'translateY(0)';
      }
    });
  }
});
