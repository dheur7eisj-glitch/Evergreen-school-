// script.js
// Interactive behaviors: mobile nav toggle, smooth scrolling, active nav on scroll,
// gallery modal, notices rotation, logo enhancement, and accessibility helpers.

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalClose = document.getElementById('modal-close');
  const galleryImgs = document.querySelectorAll('.gallery-item img');
  const notices = document.querySelectorAll('.notice');
  const yearEl = document.getElementById('year');

  // Footer year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  // Smooth scrolling for internal anchors with header offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        // close mobile nav if open
        if (mainNav && mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
        }
      }
    });
  });

  // Highlight active nav link on scroll
  const sections = Array.from(document.querySelectorAll('main section, header'));
  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    let currentId = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('active', href === `#${currentId}`);
    });
  }
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // Gallery modal open/close
  if (galleryImgs && modal && modalImg) {
    galleryImgs.forEach(img => {
      img.addEventListener('click', () => {
        modalImg.src = img.src;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        // trap focus on modal close button for accessibility
        modalClose && modalClose.focus();
      });
    });

    function closeModal() {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modalImg.src = '';
    }

    modalClose && modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
    });
  }

  // Notices auto-rotate
  if (notices.length) {
    let idx = 0;
    function showNotice(i) {
      notices.forEach((n, j) => n.classList.toggle('active', i === j));
    }
    showNotice(0);
    setInterval(() => {
      idx = (idx + 1) % notices.length;
      showNotice(idx);
    }, 6000);
  }

  // Subtle logo enhancement for low-res images
  const logos = [document.getElementById('school-logo'), document.getElementById('footer-logo')];
  logos.forEach(img => {
    if (!img) return;
    img.addEventListener('load', () => {
      try {
        if (img.naturalWidth && (img.naturalWidth < 200 || img.naturalHeight < 200)) {
          img.style.filter = 'drop-shadow(0 10px 30px rgba(11,107,58,0.12))';
          img.style.transform = 'scale(1.02)';
          img.style.transition = 'transform .25s ease, filter .25s ease';
        }
      } catch (e) {
        // ignore any read errors
      }
    });
  });

  // Small progressive enhancement: lazy-loading fallback (if browser doesn't support loading attr)
  if (!('loading' in HTMLImageElement.prototype)) {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    const onIntersection = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    };
    if (lazyImgs.length) {
      const observer = new IntersectionObserver(onIntersection, { rootMargin: '200px' });
      lazyImgs.forEach(img => observer.observe(img));
    }
  }
});