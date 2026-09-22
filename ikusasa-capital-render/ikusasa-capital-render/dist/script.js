(() => {
  const body = document.body;
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('siteNav');
  const scrim = document.getElementById('navScrim');
  const progress = document.getElementById('progressBar');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const currentPage = body.dataset.page;

  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  document.querySelectorAll('[data-nav-page]').forEach(link => {
    if (link.dataset.navPage === currentPage) link.setAttribute('aria-current', 'page');
  });

  function setNav(open) {
    if (!nav || !menuToggle || !scrim) return;
    nav.classList.toggle('open', open);
    scrim.classList.toggle('open', open);
    nav.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
    body.classList.toggle('nav-open', open);
    menuToggle.querySelector('span').textContent = open ? 'Close' : 'Menu';
    if (open) nav.querySelector('a')?.focus();
  }

  menuToggle?.addEventListener('click', () => setNav(!nav.classList.contains('open')));
  scrim?.addEventListener('click', () => setNav(false));
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setNav(false)));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) setNav(false);
  });

  const pathways = document.querySelectorAll('.pathway');
  pathways.forEach(card => {
    const activate = () => {
      pathways.forEach(other => {
        const active = other === card;
        other.classList.toggle('active', active);
        other.querySelector('.pathway-toggle')?.setAttribute('aria-expanded', String(active));
      });
    };
    card.addEventListener('click', activate);
    card.querySelector('.pathway-toggle')?.addEventListener('click', event => {
      event.stopPropagation();
      activate();
    });
  });

  const serviceTriggers = document.querySelectorAll('.service-trigger');
  serviceTriggers.forEach(button => {
    button.addEventListener('click', () => {
      const willOpen = button.getAttribute('aria-expanded') !== 'true';
      serviceTriggers.forEach(other => {
        const panel = document.getElementById(other.getAttribute('aria-controls'));
        other.setAttribute('aria-expanded', 'false');
        other.closest('.service-item')?.classList.remove('active');
        if (panel) panel.hidden = true;
      });
      if (willOpen) {
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        button.setAttribute('aria-expanded', 'true');
        button.closest('.service-item')?.classList.add('active');
        if (panel) panel.hidden = false;
      }
    });
  });

  document.querySelectorAll('.select-engagement').forEach(button => {
    button.addEventListener('click', () => {
      const value = encodeURIComponent(button.dataset.engagement);
      window.location.href = `./contact.html?engagement=${value}`;
    });
  });

  const interestInput = document.getElementById('interest');
  const engagementSelect = document.getElementById('engagementModel');
  const intentButtons = document.querySelectorAll('.intent');
  intentButtons.forEach(button => {
    button.addEventListener('click', () => {
      intentButtons.forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      if (interestInput) interestInput.value = button.dataset.intent;
    });
  });

  if (engagementSelect) {
    const selectedModel = new URLSearchParams(window.location.search).get('engagement');
    if (selectedModel && [...engagementSelect.options].some(option => option.value === selectedModel)) {
      engagementSelect.value = selectedModel;
    }
  }

  document.getElementById('inquiryForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('name')?.value.trim() || '';
    const organisation = document.getElementById('organisation')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';
    const interest = interestInput?.value || 'General inquiry';
    const engagement = engagementSelect?.value || 'Not sure yet';
    const subject = `Ikusasa Capital inquiry — ${interest}`;
    const copy = [
      'Hello Ikusasa Capital,',
      '',
      `I would like to discuss: ${interest}.`,
      `Preferred engagement model: ${engagement}.`,
      organisation ? `Organisation: ${organisation}` : '',
      '',
      message,
      '',
      'Regards,',
      name
    ].filter((line, index, lines) => line !== '' || lines[index - 1] !== '').join('\n');
    window.location.href = `mailto:hello@ikusasacapital.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(copy)}`;
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .1 });

  document.querySelectorAll('.reveal').forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(el);
  });

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    const heroOrbit = document.querySelector('.hero-orbit');
    if (heroOrbit && !reducedMotion) {
      heroOrbit.style.transform = `translateY(calc(-50% + ${window.scrollY * .055}px)) rotate(${window.scrollY * .008}deg)`;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('.magnetic').forEach(button => {
    if (reducedMotion) return;
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .12;
      const y = (event.clientY - rect.top - rect.height / 2) * .16;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });

  const canvas = document.getElementById('starfield');
  const ctx = canvas?.getContext('2d');
  let particles = [];
  let raf;

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(135, Math.floor(window.innerWidth * window.innerHeight / 9500));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.15 + .2,
      a: Math.random() * .55 + .12,
      v: Math.random() * .055 + .012
    }));
  }

  function drawParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(particle => {
      particle.y += particle.v;
      if (particle.y > window.innerHeight + 2) particle.y = -2;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(181, 211, 255, ${particle.a})`;
      ctx.fill();
    });
    if (!reducedMotion) raf = requestAnimationFrame(drawParticles);
  }

  if (canvas && ctx) {
    window.addEventListener('resize', () => {
      cancelAnimationFrame(raf);
      resizeCanvas();
      drawParticles();
    });
    resizeCanvas();
    drawParticles();
  }
})();
