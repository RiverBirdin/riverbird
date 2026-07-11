const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal--visible');
      
      // Trigger After Effects style decrypt/scramble on headings in the revealed section
      const headings = entry.target.querySelectorAll('h1, h2, .h1, .h2');
      headings.forEach(h => scrambleText(h));
      
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
});

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const targetNum = parseInt(target.getAttribute('data-target'), 10);
      if (isNaN(targetNum)) return;
      
      const duration = 1500;
      let start = 0;
      const stepTime = Math.max(Math.floor(duration / targetNum), 15);
      
      const timer = setInterval(() => {
        start += 1;
        target.textContent = start;
        if (start >= targetNum) {
          target.textContent = targetNum;
          clearInterval(timer);
        }
      }, stepTime);
      
      counterObserver.unobserve(target);
    }
  });
}, { threshold: 0.2 });

export function initAnimations() {
  initCursorGlow();
  initCardTilt();
  initScrollProgress();
  initSectionIndicators();
  initParallax();
  initStaggerAnimations();
  initMouseTrail();
  
  scanAndObserve(document.body);
  initMutationObserver();
}

function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;

  window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
  });
}



/* Scrambles only text nodes recursively to avoid breaking nested HTML elements */
function scrambleText(element) {
  if (element.dataset.scrambled === 'true') return;
  element.dataset.scrambled = 'true';

  const textNodes = [];
  function findTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.nodeValue.trim().length > 0) {
        textNodes.push(node);
      }
    } else {
      for (let child of node.childNodes) {
        findTextNodes(child);
      }
    }
  }
  findTextNodes(element);

  const originalValues = textNodes.map(node => node.nodeValue);
  const chars = 'XYZ-+$#@&0123456789%[]{}*?!=';
  let progress = 0;
  const maxLen = Math.max(...originalValues.map(val => val.length), 0);
  
  const interval = setInterval(() => {
    textNodes.forEach((node, nodeIdx) => {
      const orig = originalValues[nodeIdx];
      node.nodeValue = orig
        .split('')
        .map((char, charIdx) => {
          if (/\s/.test(char)) return char; // Skip white space
          if (charIdx < progress) return orig[charIdx];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
    });

    progress += Math.ceil(maxLen / 12);
    if (progress > maxLen) {
      textNodes.forEach((node, nodeIdx) => {
        node.nodeValue = originalValues[nodeIdx];
      });
      clearInterval(interval);
    }
  }, 45);
}

function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.body.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.card, .value-card, .stat-card');
    if (!card) return;

    if (card.classList.contains('card-showcase')) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = x / rect.width - 0.5;
    const yc = y / rect.height - 0.5;

    const rotateX = -yc * 8;
    const rotateY = xc * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) translateZ(0)`;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });

  document.body.addEventListener('mouseleave', (e) => {
    const card = e.target.closest('.card, .value-card, .stat-card');
    if (!card) return;

    card.style.transform = '';
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
  }, true);
}

function scanAndObserve(root) {
  if (!root) return;
  
  if (root.classList && root.classList.contains('reveal')) {
    revealObserver.observe(root);
  }
  root.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
  
  if (root.classList && root.classList.contains('counter-val')) {
    counterObserver.observe(root);
  }
  root.querySelectorAll('.counter-val').forEach(el => {
    counterObserver.observe(el);
  });
}

function initMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          scanAndObserve(node);
        }
      });
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}


function initScrollProgress() {
  let progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
  }

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight);
    progressBar.style.transform = `scaleX(${scrolled})`;
  });
}

function initSectionIndicators() {
  const sections = document.querySelectorAll('main > section[id]');
  if (sections.length === 0) return;

  let indicator = document.querySelector('.section-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'section-indicator';
    document.body.appendChild(indicator);
  }

  sections.forEach((section, index) => {
    const dot = document.createElement('div');
    dot.className = 'section-indicator__dot';
    dot.setAttribute('data-label', section.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
    dot.addEventListener('click', () => {
      section.scrollIntoView({ behavior: 'smooth' });
    });
    indicator.appendChild(dot);
  });

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    const dots = indicator.querySelectorAll('.section-indicator__dot');
    dots.forEach((dot, index) => {
      dot.classList.remove('active');
      if (sections[index] && sections[index].getAttribute('id') === current) {
        dot.classList.add('active');
      }
    });
  });
}

function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-layer');
  if (parallaxElements.length === 0) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    parallaxElements.forEach((el, index) => {
      const speed = el.dataset.speed || (index + 1) * 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
}

function initStaggerAnimations() {
  const staggerGroups = document.querySelectorAll('[data-stagger]');
  
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.stagger-item');
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('animated');
          }, index * 100);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  staggerGroups.forEach(group => {
    staggerObserver.observe(group);
  });
}



function initMouseTrail() {
  // Create trail elements
  const trailCount = 8;
  const trails = [];
  
  for (let i = 0; i < trailCount; i++) {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    document.body.appendChild(trail);
    trails.push({
      element: trail,
      x: 0,
      y: 0,
      currentX: 0,
      currentY: 0
    });
  }

  let mouseX = 0;
  let mouseY = 0;
  let isMoving = false;
  let movingTimeout;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    isMoving = true;
    trails.forEach(trail => trail.element.classList.add('active'));
    
    clearTimeout(movingTimeout);
    movingTimeout = setTimeout(() => {
      isMoving = false;
      trails.forEach(trail => trail.element.classList.remove('active'));
    }, 150);
  });

  function animateTrail() {
    trails.forEach((trail, index) => {
      const delay = index * 0.05;
      
      trail.x += (mouseX - trail.x) * (0.1 - delay);
      trail.y += (mouseY - trail.y) * (0.1 - delay);
      
      trail.element.style.transform = `translate(${trail.x}px, ${trail.y}px) scale(${1 - (index * 0.1)})`;
      trail.element.style.opacity = isMoving ? (0.6 - (index * 0.07)) : 0;
    });
    
    requestAnimationFrame(animateTrail);
  }
  
  animateTrail();
}

