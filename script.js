/* 
   Crown & Collar - Remake JavaScript
   Circular Queue Paw Carousel & Brand Aligned Elements
*/

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Mobile Menu Toggle Drawer
  // ==========================================
  const mobileToggle = document.getElementById('MobileMenuToggle');
  const navMenu = document.getElementById('NavMenu');
  const navOverlay = document.getElementById('NavOverlay');
  const navCloseBtn = document.getElementById('NavCloseBtn');
  const navLinks = document.querySelectorAll('.nav-link');

  function openNav() {
    mobileToggle.classList.add('active');
    navMenu.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mobileToggle.classList.remove('active');
    navMenu.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (navCloseBtn) navCloseBtn.addEventListener('click', closeNav);
    if (navOverlay) navOverlay.addEventListener('click', closeNav);

    navLinks.forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }



  // ==========================================
  // 2. Scroll to Top Floating Button
  // ==========================================
  const scrollToTopBtn = document.getElementById('ScrollToTopBtn');

  if (scrollToTopBtn) {
    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });

    // Smooth scroll to top when clicked
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // ==========================================
  // 3. Active Link Highlight on Scroll (ScrollSpy)
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  
  function scrollActiveHighlight() {
    const scrollY = window.pageYOffset;
    const sectionList = Array.from(sections);

    // Find the last section whose top is above current scroll position
    let current = null;
    sectionList.forEach(section => {
      const sectionTop = section.offsetTop - 130;
      if (scrollY >= sectionTop) {
        current = section;
      }
    });

    if (current) {
      const sectionId = current.getAttribute('id');
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-menu a[href*='${sectionId}']`);
      if (activeLink) activeLink.classList.add('active');
    }
  }
  
  if (sections.length > 0) {
    window.addEventListener('scroll', scrollActiveHighlight);
    scrollActiveHighlight(); // run on load
  }


  // ==========================================
  // 4. Dynamic About Heading: Rotating Text
  // ==========================================
  const rotators = document.querySelectorAll('.rotating-text');
  let currentRotator = 0;

  function rotateText() {
    const exitText = rotators[currentRotator];
    if (!exitText) return;
    exitText.classList.remove('active');
    exitText.classList.add('exit');

    currentRotator = (currentRotator + 1) % rotators.length;
    
    const activeText = rotators[currentRotator];
    activeText.classList.remove('exit');
    activeText.classList.add('active');

    // Remove exit class after slide transition completes
    setTimeout(() => {
      exitText.classList.remove('exit');
    }, 600);
  }

  if (rotators.length > 1) {
    setInterval(rotateText, 2500);
  }


  // ==========================================
  // 5. Paw Carousel Circular Queue Physics
  // ==========================================
  const carousel = document.getElementById('PawCarousel');
  
  if (carousel) {
    const cards = Array.from(carousel.querySelectorAll('.paw-card'));
    const slots = ['slot-palm', 'slot-toe1', 'slot-toe2', 'slot-toe3', 'slot-toe4'];
    
    // Initial slots: Card 0 is Palm, Card 1 is Toe 1, Card 2 is Toe 2, etc.
    let cardSlots = [0, 1, 2, 3, 4];
    let carouselInterval;
    const intervalDuration = 5000; // 5 seconds

    function updateCardClasses() {
      cards.forEach((card, cardIdx) => {
        // Remove all previous slot classes
        slots.forEach(slotClass => card.classList.remove(slotClass));
        
        // Add the new slot class for this card
        const currentSlotIndex = cardSlots[cardIdx];
        card.classList.add(slots[currentSlotIndex]);
        
        // Add visual active states for toe elements
        const image = card.querySelector('img');
        if (currentSlotIndex === 0) {
          card.classList.add('active-palm');
        } else {
          card.classList.remove('active-palm');
        }
      });
    }

    // Rotates the queue forward: Palm -> Toe 1 -> Toe 2 -> Toe 3 -> Toe 4 -> Palm
    function advanceQueue() {
      cardSlots = cardSlots.map(slotIndex => (slotIndex + 1) % 5);
      updateCardClasses();
    }

    function startAutoplay() {
      carouselInterval = setInterval(advanceQueue, intervalDuration);
    }

    function resetAutoplay() {
      clearInterval(carouselInterval);
      startAutoplay();
    }

    // Click trigger on any card: shifts that card to Palm and moves others forward
    cards.forEach((card, cardIdx) => {
      card.addEventListener('click', () => {
        const clickedSlot = cardSlots[cardIdx];
        if (clickedSlot === 0) return; // Already active in Palm, do nothing
        
        // Calculate shifts needed to bring this card to slot 0 (Palm)
        const shiftDiff = (5 - clickedSlot) % 5;
        cardSlots = cardSlots.map(slotIndex => (slotIndex + shiftDiff) % 5);
        
        updateCardClasses();
        resetAutoplay();
      });
    });

    // Initialize layout
    updateCardClasses();
    startAutoplay();
  }


  // ==========================================
  // 6. Services Auto-Scroll Marquee (4 Cards)
  // ==========================================
  const servicesRow = document.getElementById('ServicesRow');
  const servicesContainer = servicesRow ? servicesRow.parentElement : null;

  if (servicesRow && servicesContainer) {
    // Clone children to ensure continuous infinite loop
    const originalChildren = Array.from(servicesRow.children);
    originalChildren.forEach(child => {
      const clone = child.cloneNode(true);
      servicesRow.appendChild(clone);
    });

    let isHovered = false;
    const scrollSpeed = 0.6; // pixels per frame

    servicesContainer.addEventListener('mouseenter', () => { isHovered = true; });
    servicesContainer.addEventListener('mouseleave', () => { isHovered = false; });
    servicesContainer.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
    servicesContainer.addEventListener('touchend', () => { isHovered = false; }, { passive: true });

    function marqueeLoop() {
      if (!isHovered) {
        servicesContainer.scrollLeft += scrollSpeed;
        const halfWidth = servicesRow.scrollWidth / 2;
        if (servicesContainer.scrollLeft >= halfWidth) {
          servicesContainer.scrollLeft = 0;
        }
      }
      requestAnimationFrame(marqueeLoop);
    }

    setTimeout(() => {
      requestAnimationFrame(marqueeLoop);
    }, 500);
  }


  // ==========================================
  // 7. Gallery Lightbox Modal
  // ==========================================
  const galleryGrid = document.getElementById('GalleryGrid');
  const galleryViewBtn = document.getElementById('GalleryViewBtn');
  const lightbox = document.getElementById('GalleryLightbox');
  const lightboxImg = document.getElementById('LightboxImg');
  const lightboxCaption = document.getElementById('LightboxCaption');
  const closeBtn = document.getElementById('LightboxCloseBtn');
  const prevBtn = document.getElementById('LightboxPrevBtn');
  const nextBtn = document.getElementById('LightboxNextBtn');
  
  let currentImgIndex = 0;
  let galleryImagesList = [];

  function initGalleryBinding() {
    if (!galleryGrid) return;
    const galleryItems = galleryGrid.querySelectorAll('.gallery-item-col');
    
    galleryImagesList = Array.from(galleryItems).map(item => {
      const img = item.querySelector('.gallery-img');
      const title = item.querySelector('.gallery-item-title');
      return {
        src: img.src,
        alt: img.alt,
        caption: title ? title.textContent : img.alt
      };
    });

    galleryItems.forEach((item, index) => {
      item.onclick = (e) => {
        e.preventDefault();
        openLightbox(index);
      };
    });
  }

  function openLightbox(index) {
    currentImgIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const currentData = galleryImagesList[currentImgIndex];
    if (currentData) {
      lightboxImg.src = currentData.src;
      lightboxImg.alt = currentData.alt;
      lightboxCaption.textContent = currentData.caption;
    }
  }

  function nextImage() {
    currentImgIndex = (currentImgIndex + 1) % galleryImagesList.length;
    updateLightboxContent();
  }

  function prevImage() {
    currentImgIndex = (currentImgIndex - 1 + galleryImagesList.length) % galleryImagesList.length;
    updateLightboxContent();
  }

  if (lightbox) {
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      }
    });

    // View >> button opens the first item in the Lightbox
    if (galleryViewBtn) {
      galleryViewBtn.addEventListener('click', () => {
        openLightbox(0);
      });
    }
  }

  initGalleryBinding();


  // ==========================================
  // 8. Contact Form Verification Response & Netlify Integration
  // ==========================================
  const contactForm = document.getElementById('ContactForm');
  const formSuccessToast = document.getElementById('FormSuccessToast');

  if (contactForm && formSuccessToast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameVal = document.getElementById('name').value.trim();
      const emailVal = document.getElementById('email').value.trim();
      const messageVal = document.getElementById('message').value.trim();

      if (!nameVal || !emailVal || !messageVal) {
        alert("Please fill out all form inputs.");
        return;
      }

      // Netlify AJAX submission
      const formData = new FormData(contactForm);
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit form to Netlify");
        }
        
        // Fade out form and display success toast
        contactForm.style.transition = 'opacity 0.4s ease';
        contactForm.style.opacity = '0';
        
        setTimeout(() => {
          contactForm.style.display = 'none';
          formSuccessToast.style.display = 'flex';
          void formSuccessToast.offsetHeight;
          formSuccessToast.classList.add('active');
          formSuccessToast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 400);

        console.log("Form successfully submitted to Netlify:", {
          name: nameVal,
          email: emailVal,
          message: messageVal,
          timestamp: new Date().toISOString()
        });
      })
      .catch((error) => {
        console.error("Submission error:", error);
        alert("Oops! There was an issue submitting your inquiry. Please try again.");
      });
    });
  }

});