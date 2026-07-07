import { initLayout } from '../components/layout.js';
import { initAnimations } from './animations.js';
import { initLiquidBackground } from './liquid.js';
import { initForms } from '../components/forms.js';
import { initOrbitalSystem } from '../components/orbital.js';
import { 
  renderTestimonials, 
  renderCaseStudies, 
  renderJobs, 
  renderDevServices, 
  renderProcessSteps, 
  renderTechStack, 
  renderFaqs,
  renderBlogs
} from '../components/render.js';

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-enabled');
  
  // No loader - instant page load
  document.body.classList.add('page-loaded');
  
  initLayout();

  initAnimations();

  initLiquidBackground();

  initForms();

  const pageName = document.body.getAttribute('data-page');
  
  if (pageName === 'home') {
    renderCaseStudies('home-case-studies', 3);
    renderTestimonials('home-testimonials');
    initOrbitalSystem();
  } 
  else if (pageName === 'development') {
    renderProcessSteps('dev-process-grid');
  }
  else if (pageName === 'company') {
    renderBlogs('company-blog-grid');
  }
  else if (pageName === 'careers') {
    const hash = window.location.hash.replace('#', '');
    const validDepts = ['it', 'marketing', 'internship'];
    const initialDept = validDepts.includes(hash) ? hash : 'all';
    
    renderJobs('careers-jobs-grid', initialDept);
    setupCareersFilter(initialDept);
    
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash.replace('#', '');
      const newDept = validDepts.includes(newHash) ? newHash : 'all';
      renderJobs('careers-jobs-grid', newDept);
      updateFilterButtons(newDept);
    });
  }
});

function setupCareersFilter(activeDept = 'all') {
  const filterContainer = document.querySelector('.careers-filter');
  if (!filterContainer) return;

  updateFilterButtons(activeDept);

  filterContainer.querySelectorAll('.careers-filter__btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const dept = btn.getAttribute('data-filter');
      window.location.hash = dept === 'all' ? '' : dept;
    });
  });
}

function updateFilterButtons(activeDept) {
  const filterContainer = document.querySelector('.careers-filter');
  if (!filterContainer) return;
  filterContainer.querySelectorAll('.careers-filter__btn').forEach(btn => {
    const dept = btn.getAttribute('data-filter');
    if (dept === activeDept) {
      btn.classList.add('careers-filter__btn--active');
    } else {
      btn.classList.remove('careers-filter__btn--active');
    }
  });
}


function initPageLoader() {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div class="loader-content">
      <div class="loader-logo">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-primary);">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>
      <div class="loader-text">Loading</div>
      <div class="loader-spinner"></div>
    </div>
  `;
  document.body.prepend(loader);
}

function hidePageLoader() {
  setTimeout(() => {
    const loader = document.querySelector('.page-loader');
    if (loader) {
      loader.classList.add('hidden');
      document.body.classList.add('page-loaded');
      setTimeout(() => loader.remove(), 600);
    }
  }, 800);
}

