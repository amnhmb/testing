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

// Add no-scroll to body on load to lock scrolling until envelope is opened
document.body.classList.add('no-scroll');

// ==========================================
// CONFIGURATION ENGINE (DYNAMIC INJECTION)
// ==========================================
function initConfig() {
  if (typeof clientConfig === 'undefined') {
    console.error("clientConfig is not defined! Make sure config.js is loaded.");
    return;
  }

  // 1. Set CSS Variables
  const root = document.documentElement;
  root.style.setProperty('--bg', clientConfig.theme.warnaBackground);
  root.style.setProperty('--surface', clientConfig.theme.warnaSurface);
  root.style.setProperty('--envelope', clientConfig.theme.warnaSampul);
  root.style.setProperty('--wax', clientConfig.theme.warnaWax);
  root.style.setProperty('--accent', clientConfig.theme.warnaAccent);
  root.style.setProperty('--asset', clientConfig.theme.warnaAset);
  root.style.setProperty('--ampersand', clientConfig.theme.warnaAmpersand);
  root.style.setProperty('--shadow', clientConfig.theme.warnaBayang);
  root.style.setProperty('--text', clientConfig.theme.warnaText);
  root.style.setProperty('--text-muted', clientConfig.theme.warnaTextMuted);
  root.style.setProperty('--border', clientConfig.theme.warnaBorder);

  // 2. Inject simple Text & Images (data-content & data-image)
  const allData = { ...clientConfig.pengantin, ...clientConfig.keluarga, ...clientConfig.majlis };
  
  document.querySelectorAll('[data-content]').forEach(el => {
    const key = el.getAttribute('data-content');
    if (allData[key]) {
      let text = allData[key];
      if (typeof text === 'string') {
        text = text.replace(/&/g, '<span class="ampersand">&</span>');
        el.innerHTML = text.replace(/\n/g, '<br>');
      }
    }
  });

  document.querySelectorAll('[data-image]').forEach(el => {
    const key = el.getAttribute('data-image');
    if (clientConfig.media[key]) {
      el.src = clientConfig.media[key];
    }
  });

  // 3. Inject Links (data-link)
  document.querySelectorAll('[data-link]').forEach(el => {
    const key = el.getAttribute('data-link');
    if (clientConfig.pautan[key]) {
      el.href = clientConfig.pautan[key];
    }
  });

  // 4. Render Arrays
  // 4a. Tema Warna
  const bekasTemaWarna = document.getElementById('bekas-tema-warna');
  if (bekasTemaWarna && clientConfig.senaraiTemaWarna) {
    bekasTemaWarna.innerHTML = '';
    clientConfig.senaraiTemaWarna.forEach(tema => {
      bekasTemaWarna.innerHTML += `
        <div class="swatch-col">
          <div class="color-swatch kain-texture" style="background-color: ${tema.kodWarna};"></div>
          <span class="swatch-label">${tema.namaWarna.replace(/\n/g, '<br>')}</span>
        </div>
      `;
    });
  }

  // 4b. Atur Cara
  const bekasAturCara = document.getElementById('bekas-atur-cara');
  if (bekasAturCara && clientConfig.aturCara) {
    bekasAturCara.innerHTML = '';
    clientConfig.aturCara.forEach(atur => {
      bekasAturCara.innerHTML += `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <p class="timeline-time font-semibold text-[var(--accent)]">${atur.masa}</p>
          <p class="timeline-desc text-sm">${atur.acara}</p>
        </div>
      `;
    });
  }

  // 4c. Kisah Kami
  const storyCarousel = document.getElementById('story-carousel');
  const storyIndicators = document.getElementById('story-indicators'); // Assuming we have this
  if (storyCarousel && clientConfig.kisahKami) {
    storyCarousel.innerHTML = '';
    if(storyIndicators) storyIndicators.innerHTML = '';
    clientConfig.kisahKami.forEach((kisah, i) => {
      storyCarousel.innerHTML += `
        <div class="story-slide">
          <div class="story-card">
            <img src="${kisah.gambar}" alt="${kisah.tajuk}" class="story-img">
            <div class="story-content">
              <h3 class="font-serif mb-2">${kisah.tajuk}</h3>
              <p class="story-text">${kisah.teks}</p>
            </div>
          </div>
        </div>
      `;
      if(storyIndicators) {
        storyIndicators.innerHTML += `<span class="story-dot ${i===0?'active':''}" data-index="${i}"></span>`;
      }
    });
  }

  // 4d. Penginapan
  const bekasPenginapan = document.getElementById('bekas-penginapan');
  if (bekasPenginapan && clientConfig.penginapan) {
    bekasPenginapan.innerHTML = '';
    clientConfig.penginapan.forEach(pinap => {
      bekasPenginapan.innerHTML += `
        <li class="info-item">
          <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/></svg>
          <div>
            <p class="info-title">${pinap.nama}</p>
            <p class="info-desc">${pinap.jarak}</p>
          </div>
        </li>
      `;
    });
  }

  // 4e. FAQ
  const bekasFaq = document.getElementById('bekas-faq');
  if (bekasFaq && clientConfig.infoFaq) {
    // Keep the title, just append FAQs
    // Title is already there, so we just append. Actually it's better to empty it but keep the title.
    // In index.html, we cleared the items but kept the h3.
    clientConfig.infoFaq.forEach(faq => {
      bekasFaq.innerHTML += `
        <div class="faq-item">
          <div class="faq-question">
            <p class="faq-title">${faq.soalan}</p>
            <svg class="faq-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <div class="faq-answer">
            <p class="faq-desc">${faq.jawapan}</p>
          </div>
        </div>
      `;
    });
  }

  // 4f. Hubungi
  const bekasHubungi = document.getElementById('bekas-hubungi');
  if (bekasHubungi && clientConfig.hubungi) {
    bekasHubungi.innerHTML = '';
    clientConfig.hubungi.forEach(hub => {
      bekasHubungi.innerHTML += `
        <div class="mb-4 border-b border-[var(--border-soft)] pb-4">
          <p class="font-bold text-[var(--text)] mb-2">${hub.hubungan} (${hub.nama})</p>
          <div class="flex gap-2">
            <a href="${hub.panggilanBiasa}" class="btn-contact btn-call">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Telefon
            </a>
            <a href="${hub.whatsapp}" class="btn-contact btn-whatsapp">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      `;
    });
  }

  // 4g. Salam Kaut
  const bekasSalamKaut = document.getElementById('bekas-salam-kaut');
  if (bekasSalamKaut && clientConfig.salamKaut) {
    bekasSalamKaut.innerHTML = '';
    clientConfig.salamKaut.forEach((salam, index) => {
      bekasSalamKaut.innerHTML += `
        <div class="card-songket max-w-xs mx-auto mb-4">
          <img src="${salam.qrCode}" alt="QR DuitNow" class="qr-code-img">
          <div class="bank-details-box">
            <p class="bank-name">${salam.namaBank}</p>
            <div class="bank-acc-row">
              <p id="bank-acc-${index}" class="bank-acc-number">${salam.noAkaun}</p>
              <button onclick="salinAkaun('bank-acc-${index}', this)" class="btn-secondary btn-copy">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Salin
              </button>
            </div>
            <p class="bank-owner">${salam.namaAkaun}</p>
          </div>
        </div>
      `;
    });
  }
}

// Global Salin Akaun function since we are generating buttons dynamically
window.salinAkaun = function(targetId, btnElement) {
  const bankAcc = document.getElementById(targetId);
  if (bankAcc) {
    const textToCopy = bankAcc.innerText.replace(/\s+/g, '');
    navigator.clipboard.writeText(textToCopy).then(() => {
      const originalText = btnElement.innerHTML;
      btnElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg> Disalin!';
      setTimeout(() => {
        btnElement.innerHTML = originalText;
      }, 2000);
    });
  }
};

// Run config initialization immediately
initConfig();

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

  // Envelope Cover Logic
  const envelopeCover = document.getElementById('envelope-cover');
  const btnBuka = document.getElementById('btn-buka-jemputan');
  const bgMusic = document.getElementById('bg-music');
  const audioText = document.getElementById('audio-text');
  const whiteFade = document.getElementById('white-fade');

  if (envelopeCover && btnBuka) {
    btnBuka.addEventListener('click', () => {
      // 1. Start envelope open animation
      envelopeCover.classList.add('open');
      
      // 2. Remove body scroll lock
      document.body.classList.remove('no-scroll');
      
      // 3. Play music automatically (Disabled for now based on request)
      /* 
      if (bgMusic) {
        bgMusic.play().then(() => {
          if(audioText) audioText.innerText = 'Pause Muzik';
          const audioIcon = document.getElementById('audio-icon');
          const audioWave = document.getElementById('audio-wave');
          if(audioIcon) audioIcon.style.display = 'none';
          if(audioWave) audioWave.style.display = 'flex';
        }).catch(err => console.log('Audio autoplay blocked', err));
      }
      */

      // 4. White Fade logic
      if (whiteFade) {
        // Start fading to white at 1.2s (right before zoom begins) so it blocks the website
        setTimeout(() => {
          whiteFade.classList.add('active');
        }, 1200);

        // Remove white fade at 3.0s to slowly reveal website
        setTimeout(() => {
          whiteFade.classList.remove('active');
        }, 3000);
      }

      // 5. Remove cover from DOM after animation completes
      setTimeout(() => {
        envelopeCover.style.display = 'none';
      }, 3000);
    });
  }
});

// Global RSVP Submit Function
window.submitRSVP = function(event) {
  event.preventDefault(); // Prevent page reload

  // Show Toast
  const toast = document.getElementById('toast-notification');
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // Fire elegant grayscale confetti
  if (typeof confetti === 'function') {
    const duration = 3000;
    const end = Date.now() + duration;
    
    // Grayscale colors for formal look
    const colors = ['#000000', '#555555', '#AAAAAA', '#333333'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        gravity: 0.8,
        scalar: 0.8,
        ticks: 200
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        gravity: 0.8,
        scalar: 0.8,
        ticks: 200
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
};
